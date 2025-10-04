import { Router } from 'express';
import { serverStore } from '../store/serverStore';
import { wsHandler } from "../ws/wsHandler"; // Import the wsHandler instance

const playersRouter = Router();

playersRouter.put('/players/:id/host', (req, res) => {
    const playerId = parseInt(req.params.id);

    if (isNaN(playerId)) {
        return res.status(400).send('Invalid player ID.');
    }

    const success = serverStore.setHost(playerId);

    if (success) {
        wsHandler.broadcastPlayerState(); // Use wsHandler to broadcast
        res.status(200).send('Host updated successfully.');
    } else {
        res.status(404).send('Player not found.');
    }
});

playersRouter.delete('/players/:id', (req, res) => {
    const playerId = parseInt(req.params.id);

    if (isNaN(playerId)) {
        return res.status(400).send('Invalid player ID.');
    }

    const playerToRemove = serverStore.getPlayerById(playerId);

    if (playerToRemove) {
        serverStore.removePlayer(playerToRemove.uid);
        wsHandler.broadcastPlayerState(); // Use wsHandler to broadcast
        res.status(200).send('Player removed successfully.');
    } else {
        res.status(404).send('Player not found.');
    }
});

export default playersRouter;
