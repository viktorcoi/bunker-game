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
    const connect = useClientStore((s) => s.ws.connect);
    const disconnect = useClientStore((s) => s.ws.disconnect);
    const subscribe = useClientStore((s) => s.ws.subscribe);
    const uid = useClientStore((s) => s.player.uid);
    const connectionId = useClientStore((s) => s.connectionId);

    useEffect(() => {
        connect();

        // Subscribe to playerState updates
        const unsubscribePlayers = subscribe('playerState', (players) => {
            // The updatePlayers logic is now handled directly in useClientStore.ts
            // So this subscription mainly serves to trigger re-renders if needed.
            console.log('Received player state update:', players);
        });

        return () => {
            disconnect();
            unsubscribePlayers();
        };
    }, []);

    useEffect(() => {
        const handler = () => {
            if (document.visibilityState === "visible") {
                const { ws, player, connectionId } = useClientStore.getState();

                if (!ws.socket || ws.socket.readyState !== WebSocket.OPEN) {
                    console.log("🔄 Reconnecting WebSocket...");
                    ws.connect();
                } else if (player?.id && connectionId) {
                    // If player is logged in and WS is connected, ensure server knows about this connection
                    // This might involve re-sending login data or a 'reconnect' message if needed.
                    // For now, the existing login flow in SignIn.tsx will handle re-associating WS on login.
                    console.log("WebSocket already open and player logged in.");
                }
            }
        };

        document.addEventListener("visibilitychange", handler);
        return () => document.removeEventListener("visibilitychange", handler);
    }, [uid, connectionId]);

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
