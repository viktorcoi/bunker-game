import { WebSocket, WebSocketServer } from 'ws';
import { serverStore } from '../store/serverStore';
import http from "http";
import { PlayerType } from '../../types';
import { generateUID } from '../../helpers/generateUID';

// Temporary map to store WebSocket instances by a connection ID - will be moved inside the class
const connectedSockets: Map<string, WebSocket> = new Map();

class WsHandler {
    private wss: WebSocketServer | null = null;
    private connectedSockets: Map<string, WebSocket> = new Map();

    public init(server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>) {
        this.wss = new WebSocketServer({ server });

        this.wss.on("connection", (ws: WebSocket) => {
            this.registerWebSocket(ws, true); // Register the new WebSocket connection

            ws.on("message", (message: string) => {
                const parsedMessage = JSON.parse(message);
                console.log("Received message:", parsedMessage);

                if (parsedMessage.type === 'playerUpdate') {
                    this.broadcastPlayerState();
                }
                // Further message handling will go here based on message type
            });

            ws.on("close", () => {
                console.log("Client disconnected");
                // Remove player from store when they disconnect
                serverStore.removePlayerByWs(ws);
                // Find and remove from connectedSockets if it's still there
                for (const [connId, socket] of this.connectedSockets.entries()) {
                    if (socket === ws) {
                        this.connectedSockets.delete(connId);
                        break;
                    }
                }
                this.broadcastPlayerState();
            });

            ws.on("error", (error) => {
                console.error("WebSocket error:", error);
                for (const [connId, socket] of this.connectedSockets.entries()) {
                    if (socket === ws) {
                        this.connectedSockets.delete(connId);
                        break;
                    }
                }
            });
        });
    }

    public registerWebSocket(ws: WebSocket, server: boolean = false): string {
        const connectionId = server ? 'server' : generateUID();
        this.connectedSockets.set(connectionId, ws);

        ws.send(JSON.stringify({ type: 'connectionId', payload: connectionId }));
        console.log("Client connected with connectionId:", connectionId);
        return connectionId;
    }

    public getWebSocket(connectionId: string): WebSocket | undefined {
        return this.connectedSockets.get(connectionId);
    }

    public removeWebSocket(connectionId: string): boolean {
        return this.connectedSockets.delete(connectionId);
    }

    public broadcastPlayerState() {
        if (!this.wss) {
            console.error("WebSocketServer not initialized.");
            return;
        }

        const players = serverStore.getPlayers().map(p => {
            const { ws, ...playerWithoutWs } = p; // Exclude ws property before sending
            return playerWithoutWs;
        });
        this.wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ type: 'playerState', payload: players }));
            }
        });
    }

    public sendToPlayer(uid: string, message: any) {
        const player = serverStore.getPlayerByUid(uid);
        if (player && player.ws && player.ws.readyState === WebSocket.OPEN) {
            player.ws.send(JSON.stringify(message));
        } else {
            console.warn(`Player ${uid} not found or WebSocket not open.`);
        }
    }

    public sendToServer(message: any) {
        // This method is for messages *from* the server *to* the server itself, or for internal server processing
        console.log("Server received internal message:", message);
        // Implement internal server logic here if needed
    }

    // Other potential methods:
    // public sendToAllExcept(excludeUid: string, message: any) { ... }
}

export const wsHandler = new WsHandler();
