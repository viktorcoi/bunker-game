import {create} from "zustand";
import {ClientStoreTypes} from "./types";
import {PlayerType} from "../../types";
import {generateUID} from "./generateUID";

const wsUrl = `ws://${window.location.hostname}:7355`;

export const useClientStore = create<ClientStoreTypes>((set, get) => ({
    player: {
        // id: 9999,
        // name: 'TEST',
        // image: '',
        // role: 'host',
        uid: generateUID()
    },
    players: [
        // {id: 9999,
        //     name: 'TEST',
        //     image: '',
        //     role: 'host',
        //     uid: generateUID()},
        // {id: 1, name: 'Сергей Лысый', image: '', uid: 'sadsa', role: 'player'},
        // {id: 2, name: 'Даунич', image: '', uid: 'sadsa', role: 'player'},
        // {id: 3, name: 'Малой', image: '', uid: 'sadsa', role: 'player'},
        // {id: 4, name: 'Андрюха', image: '', uid: 'sadsa', role: 'player'},
        // {id: 5, name: 'CR 7', image: '', uid: 'sadsa', role: 'player'},
        // {id: 6, name: 'Месси', image: '', uid: 'sadsa', role: 'player'},
        // {id: 7, name: 'Андрес', image: '', uid: 'sadsa', role: 'player'},
        // {id: 8, name: 'Булочка с маком', image: '', uid: 'sadsa', role: 'player'},
        // {id: 9, name: 'А я самый умный, сделаю оченб длинный ник ыыыыыыыыыы', image: '', uid: 'sadsa', role: 'player'},
    ],
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
            singIn: (player) => {
                get().ws.send.message('signIn', player);
            }
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
    updatePlayers: (players) => set(() => ({
        players: players,
    })),
    updatePlayer: (player: PlayerType) => {
        set(() => ({player}));
        localStorage.setItem('player', JSON.stringify(player));
    }
}));
