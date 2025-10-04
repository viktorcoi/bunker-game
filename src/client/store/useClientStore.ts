import {create} from "zustand";
import {ClientStoreTypes} from "./types";
import {PlayerType} from "../../types";
import {generateUID} from "./generateUID";

const wsUrl = `ws://${window.location.hostname}:7355`;
const apiUrl = `http://${window.location.hostname}:7355`;

export const useClientStore = create<ClientStoreTypes>((set, get) => ({
    player: JSON.parse(localStorage.getItem('player') || '{}') || {uid: generateUID()},
    players: [
    ],
    connectionId: null,
    setConnectionId: (id: string) => set(() => ({ connectionId: id})),
    ws: {
        socket: null,
        connected: false,
        messages: [],
        _subscribers: {},
        send: {
            message: (key: string, value: any) => {
                const ws = get().ws.socket;
                if (ws && ws.readyState === WebSocket.OPEN) {
                    ws.send(JSON.stringify({ [key]: value }));
                }
            },
            // singIn: (player) => { // This will be removed and replaced by login action
            //     get().ws.send.message('signIn', player);
            // }
        },
        connect: () => {
            if (get().ws.socket) return;

            const ws = new WebSocket(wsUrl);

            ws.onopen = () => {
                set((state) => ({
                    ws: { ...state.ws, connected: true }
                }));
            };

            ws.onmessage = async (event) => {
                let data = await event.data.text();

                try {
                    const parsed = JSON.parse(data);

                    if (parsed.type === 'connectionId') {
                        get().setConnectionId(parsed.payload);
                        return;
                    }

                    set((state) => ({
                        ws: { ...state.ws, messages: [...state.ws.messages, parsed] }
                    }));

                    if (parsed.type === 'playerState') {
                        get().updatePlayers(parsed.payload);
                        return;
                    }

                    Object.keys(parsed).forEach((key) => {
                        const subs = get().ws._subscribers[key];
                        if (subs) subs.forEach(cb => cb(parsed[key]));
                    });
                } catch (err) {
                    console.error("Failed to parse WS message:", err);
                }
            };

            ws.onclose = () => {
                set((state) => ({
                    ws: { ...state.ws, connected: false, socket: null }
                }));
            };

            ws.onerror = (err) => {
                console.error("WebSocket error:", err);
            };

            set((state) => ({
                ws: { ...state.ws, socket: ws }
            }));
        },
        subscribe: (key, callback) => {
            const subs = get().ws._subscribers; // теперь get доступен
            if (!subs[key]) subs[key] = [];
            subs[key].push(callback);

            set((state) => ({
                ws: {
                    ...state.ws,
                    _subscribers: { ...subs }
                }
            }));

            return () => {
                const subs = get().ws._subscribers;
                if (subs[key]) {
                    subs[key] = subs[key].filter(cb => cb !== callback);
                    set((state) => ({
                        ws: { ...state.ws,
                            _subscribers: { ...subs }
                        }
                    }));
                }
            };
        },
        disconnect: () => {
            get().ws.socket?.close();
            set((state) => ({
                ws: { ...state.ws, socket: null, connected: false }
            }));
        },
    },
    updatePlayers: (players) => set(() => ({
        players: players,
    })),
    updatePlayer: (player: PlayerType) => {
        set(() => ({player}));
        localStorage.setItem('player', JSON.stringify(player));
    },
    login: async (name: string, image: string, uid: string, connectionId: string) => {
        try {
            const response = await fetch(`${apiUrl}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, image, uid, connectionId }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Login failed');
            }

            const player = await response.json();
            get().updatePlayer(player);
            return { status: 'success', player };
        } catch (error: any) {
            console.error('Login error:', error);
            return { status: 'error', error: error.message };
        }
    },
    logout: async (playerId: number) => {
        try {
            const response = await fetch(`${apiUrl}/players/${playerId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Logout failed');
            }

            set(() => ({ player: { uid: generateUID() }, players: [] })); // Clear player state
            localStorage.removeItem('player');
            get().ws.disconnect(); // Disconnect WebSocket
            return { status: 'success' };
        } catch (error: any) {
            console.error('Logout error:', error);
            return { status: 'error', error: error.message };
        }
    },
}));
