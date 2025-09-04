import React, {useEffect, useState} from "react";
import {createTheme, CssBaseline, GlobalStyles, ThemeProvider} from "@mui/material";
import SignIn from "./pages/SignIn/SignIn";
import Room from "./pages/Room";
import {useClientStore} from "./pages/store/useClientStore";

const App = () => {

    const player = useClientStore((s) => s.player);
    const updatePlayers = useClientStore((s) => s.updatePlayers);
    const connect = useClientStore((s) => s.ws.connect);
    const disconnect = useClientStore((s) => s.ws.disconnect);
    const subscribe = useClientStore((s) => s.ws.subscribe);

    const darkTheme = createTheme({
        typography: {
            fontFamily: [
                '-apple-system',
                'BlinkMacSystemFont',
                'Segoe UI',
                'Roboto',
                'Oxygen',
                'Ubuntu',
                'Cantarell',
                'Fira Sans',
                'Droid Sans',
                'Helvetica Neue',
                'sans-serif',
            ].join(','),
        },
        palette: {
            mode: 'dark',
        },
    });

    const [test, setTest] = useState<boolean>(true);

    // TODO - реализовать общение с ws по uid

    // useEffect(() => {
    //     connect();
    //
    //     const unsubscribe = subscribe("players", (data) => {
    //         if (data === "get") return;
    //         updatePlayers(data);
    //     });
    //
    //     return () => {
    //         disconnect();
    //         unsubscribe();
    //     };
    // }, []);
    //
    // useEffect(() => {
    //     const handler = () => {
    //         if (document.visibilityState === "visible") {
    //             const { ws, player } = useClientStore.getState();
    //
    //             if (!ws.socket || ws.socket.readyState !== WebSocket.OPEN) {
    //                 console.log("🔄 Reconnecting...");
    //                 ws.connect();
    //
    //                 // ждем успешного открытия сокета и шлём sync
    //                 const unsub = ws.subscribe("connected", () => {
    //                     if (player?.uid) {
    //                         ws.send("players", "get");
    //                     }
    //                     unsub();
    //                 });
    //             } else if (player?.uid) {
    //                 console.log("🔄 Requesting sync for", player.uid);
    //                 ws.send("players", "get");
    //             }
    //         }
    //     };
    //
    //     document.addEventListener("visibilitychange", handler);
    //     return () => document.removeEventListener("visibilitychange", handler);
    // }, []);

    useEffect(() => {
        if (!test) return;

        setTest(false);

        connect();

        const unsubscribe = subscribe('players', (data) => {
            if (data === 'get') return;
            updatePlayers(data);
        });

        return () => {
            if (test) return;
            disconnect();
            unsubscribe();
        }
    }, [test]);

    useEffect(() => {
        const handler = () => {
            if (document.visibilityState === "visible") {
                const { ws, player } = useClientStore.getState();

                if (!ws.socket || ws.socket.readyState !== WebSocket.OPEN) {
                    setTest(true)
                } else if (player?.uid) {
                    console.log("🔄 Requesting sync for", player.uid);
                    ws.send.message("players", 'get');
                }
            }
        };

        document.addEventListener("visibilitychange", handler);
        return () => document.removeEventListener("visibilitychange", handler);
    }, []);

    return (
        <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <GlobalStyles
            styles={{
                html: { height: '100%' },
                body: { height: '100%' },
                '#root': { height: '100%' }
            }}
        />
            {!player.id ? <SignIn/> : (
                <Room/>
            )}

        </ThemeProvider>
    )
};

export default App;
