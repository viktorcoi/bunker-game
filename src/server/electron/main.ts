import { app, BrowserWindow, ipcMain  } from "electron"
import * as path from 'path';
import * as url from 'url';
import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import os from "os";

const isDev = process.env.NODE_ENV === 'development';
let mainWindow: BrowserWindow | null = null;
let server: http.Server | null = null;
let wss: WebSocketServer | null = null;

const getLocalIP = (): string | null => {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        const iface = interfaces[name];
        if (!iface) continue;
        for (const alias of iface) {
            if (alias.family === 'IPv4' && !alias.internal) {
                return alias.address;
            }
        }
    }
    return null;
}

const createWindow = async () => {
    mainWindow = new BrowserWindow({
        minWidth: 850,
        minHeight: 550,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        titleBarStyle: 'hidden',
        ...(process.platform !== 'darwin' ? {
            titleBarOverlay: {
                height: 34,
                color: '#121212',
                symbolColor: '#fff'
            }
        } : {}),
    })

    mainWindow.loadURL(isDev ? `http://${getLocalIP()}:7356` : url.format({
        pathname: path.join(__dirname, '../react/index.html'),
        protocol: 'file:',
        slashes: true,
    })).finally();

    mainWindow.maximize()
    mainWindow.removeMenu();
    mainWindow.webContents.openDevTools();
};

const startServer = () => {
    const appExpress = express();
    if (!isDev) {
        appExpress.use(express.static(path.join(__dirname, "../../client")));
    }
    server = http.createServer(appExpress);

    wss = new WebSocketServer({ server });

    wss.on("connection", (ws) => {
        ws.on("message", (message) => {
            wss?.clients.forEach((client) => {
                if (client.readyState === ws.OPEN) {
                    client.send(message);
                }
            });
        });
    });

    server.listen(7355, () => {
        console.log(`Server running at http://${getLocalIP()}:7355`);
    });
};

app.on("ready", () => {
    startServer();
    createWindow().finally();
});

app.on("window-all-closed", () => {
    if (server) server.close();
    if (process.platform !== "darwin") app.quit();
});

ipcMain.handle('getLocalIp', () => {
    return getLocalIP();
});
