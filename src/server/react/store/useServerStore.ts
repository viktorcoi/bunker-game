import { create } from 'zustand';
import {ServerStoreTypes} from "./types";
import {signStatusType} from "../../../types";

export const useServerStore = create<ServerStoreTypes>((set, get) => ({
    ip: '',
    players: [],
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
            players: () => {
                get().ws.send.message(
                    'players',
                    get().players.map(({id, name, image}) => (
                        {id, name, image}
                    ))
                );
            },
            signStatus: (uid, data) => {
                get().ws.send.message(uid, data);
            }
        },
        connect: (url: string) => {
            if (get().ws.socket) return;

            const ws = new WebSocket(url);

            ws.onopen = () => {
                set((state) => ({
                    ws: { ...state.ws, connected: true }
                }));
            };

            ws.onmessage = async (event) => {
                let data = await event.data.text();

                try {
                    const parsed = JSON.parse(data);

                    console.log(parsed);
                    // обработка выхода
                    if (parsed?.players === 'get') {
                        get().ws.send.players();
                    }

                    if (parsed?.logout) {
                        get().removePlayer(parsed.logout);
                        get().ws.send.players();
                    }

                    // обработка входа
                    if (parsed?.signIn) {
                        console.log('aaa')

                        const currentPlayers = get().players;
                        const newId = currentPlayers.length
                            ? currentPlayers[currentPlayers.length - 1].id + 1
                            : 1;

                        let signStatus: signStatusType = {
                            status: 'success',
                            player: {
                                id: newId,
                                name: parsed.signIn.name,
                                image: parsed.signIn.image || "",
                                uid: parsed.signIn.uid,
                            }
                        }

                        if (currentPlayers.some(({ name }) => name === signStatus.player.name)) {
                            signStatus.status = 'error';
                            signStatus.error = 'Такое имя уже занято';
                        } else {
                            get().addPlayer(signStatus.player);
                            get().ws.send.players();
                        }

                        get().ws.send.signStatus(signStatus.player.uid, signStatus);
                    }

                    set((state) => ({
                        ws: { ...state.ws, messages: [...state.ws.messages, parsed] }
                    }));

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
                        ws: {
                            ...state.ws,
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
    setIp: (ip) => set(() => ({ip: ip})),
    addPlayer: (player) => set((state) => ({
        players: [...state.players, player],
    })),
    removePlayer: (uidRemove) => set((state) => ({
        players: [...state.players.filter(({ uid }) => uid !== uidRemove)],
    })),
}));
