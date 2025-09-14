import React, {useEffect, useState} from "react";
import {Box, CssBaseline, GlobalStyles, ThemeProvider} from "@mui/material";
import SignIn from "./pages/SignIn/SignIn";
import {useClientStore} from "./store/useClientStore";
import {MUITheme} from "../MUITheme";
import Room from "./pages/Room/Room";

const styles = {
    global: {
        html: { height: '100%' },
        body: { height: '100%' },
        '#root': { height: '100%' }
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        p: '15px',
    }
};

const App = () => {

    const player = useClientStore((s) => s.player);
    const updatePlayers = useClientStore((s) => s.updatePlayers);
    const connect = useClientStore((s) => s.ws.connect);
    const disconnect = useClientStore((s) => s.ws.disconnect);
    const subscribe = useClientStore((s) => s.ws.subscribe);

    const [test, setTest] = useState<boolean>(true);

    // TODO - реализовать общение с ws по uid между сервером и игроком

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
        <ThemeProvider theme={MUITheme}>
        <CssBaseline />
        <GlobalStyles styles={styles.global}/>
            <Box sx={styles.container}>

                {!player.id ? <SignIn/> : (
                    <Room/>
                )}
            </Box>
        </ThemeProvider>
    )
};

export default App;
