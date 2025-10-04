import { Router, Request } from 'express';
import multer, { Multer } from 'multer'; // Import Multer
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { serverStore } from '../store/serverStore';
import { generateUID } from '../../helpers/generateUID';
import { WebSocket } from 'ws';
import { wsHandler } from "../ws/wsHandler"; // Import the wsHandler instance

// Define a local interface to augment the Request type for Multer files
interface AuthenticatedRequest extends Request {
    file?: Multer.File;
}

const authRouter = Router();

const uploadDir = path.join(process.cwd(), 'build', 'uploads'); // Corrected path to build/uploads
if (!fs.existsSync(uploadDir)) {
    console.log(`Creating upload directory: ${uploadDir}`);
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req: Request, file, cb) => { // Keep req as Request here
        console.log(`Multer destination: ${uploadDir}`);
        cb(null, uploadDir);
    },
    filename: (req: Request, file, cb) => { // Keep req as Request here
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
        console.log(`Multer filename: ${filename}`);
        cb(null, filename);
    },
});

const upload = multer({ storage: storage });

authRouter.post('/upload-avatar', upload.single('avatar'), async (req: AuthenticatedRequest, res) => {
    if (!req.file) {
        console.error('No file uploaded.');
        return res.status(400).send('No file uploaded.');
    }

    console.log(req.file);

    const imagePath = req.file.path;
    const outputFileName = req.file.filename;
    const outputPath = path.join(uploadDir, outputFileName);
    const tempOutputPath = path.join(uploadDir, `temp-${outputFileName}`);

    try {
        const image = sharp(imagePath);
        const metadata = await image.metadata();

        if (metadata.width && metadata.height) {
            if (metadata.width > 256 || metadata.height > 256) {
                if (metadata.width >= metadata.height) {
                    await image.resize(256, null).toFile(tempOutputPath);
                } else {
                    await image.resize(null, 256).toFile(tempOutputPath);
                }
            } else {
                await image.toFile(tempOutputPath);
            }
        } else {
            await image.toFile(tempOutputPath);
        }

        fs.unlinkSync(imagePath); // Delete original uploaded file
        fs.renameSync(tempOutputPath, outputPath); // Rename temporary file to final output file

        const imageUrl = `/uploads/${outputFileName}`;

        const { uid } = req.body;
        if (uid) {
            const player = serverStore.getPlayerByUid(uid);
            if (player && player.image) {
                const oldImagePath = path.join(uploadDir, path.basename(player.image));
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            serverStore.updatePlayerImage(uid, imageUrl);
        }

        res.json({ url: imageUrl });
    } catch (error) {
        console.error('Error processing image:', error);
        // Ensure cleanup of the temporary file if an error occurs after it's created but before renaming
        if (fs.existsSync(tempOutputPath)) {
            fs.unlinkSync(tempOutputPath);
        }
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath); // Clean up original uploaded file on error
        }
        res.status(500).send('Error processing image.');
    }
});

authRouter.post('/login', (req, res) => {
    const { name, image, uid, connectionId } = req.body;

    if (!name || !uid || !connectionId) {
        return res.status(400).send('Name, UID, and connectionId are required.');
    }

    const ws = wsHandler.getWebSocket(connectionId); // Use wsHandler to get the WebSocket
    if (!ws) {
        return res.status(400).send('Invalid or expired connectionId.');
    }

    let player = serverStore.getPlayerByUid(uid);
    if (player) {
        player.name = name;
        player.image = image;
        serverStore.updatePlayerWs(uid, ws);
        console.log(`Player ${name} (${uid}) reconnected.`);
    } else {
        const newPlayer = serverStore.addPlayer({ name, image, uid }, ws);
        player = newPlayer;
        console.log(`Player ${name} (${uid}) joined as ${newPlayer.role}.`);
    }

    wsHandler.removeWebSocket(connectionId); // Remove from temporary map after associating with player

    wsHandler.broadcastPlayerState(); // Broadcast updated state after login

    res.json(player);
});

export default authRouter;
