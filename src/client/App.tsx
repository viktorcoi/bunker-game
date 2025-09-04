import React, {useEffect} from "react";
import {createTheme, CssBaseline, GlobalStyles, ThemeProvider} from "@mui/material";
import SignIn from "./pages/SignIn/SignIn";
import Room from "./pages/Room";
import {useClientStore} from "./pages/store/useClientStore";

const App = () => {

    const player = useClientStore((s) => s.player);
    const updatePlayers = useClientStore((s) => s.updatePlayers);
    const connect = useClientStore((s) => s.ws.connect);
    const connected = useClientStore((s) => s.ws.connected);
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

    useEffect(() => {
        if (connected) return;

        connect();

        const unsubscribe = subscribe('players', (data) => {
            updatePlayers(data);
        });

        return () => {
            disconnect();
            unsubscribe();
        }
    }, []);

    useEffect(() => {
        const handler = () => {
            if (document.visibilityState === "visible") {
                const { ws, player } = useClientStore.getState();

                if (!ws.socket || ws.socket.readyState !== WebSocket.OPEN) {
                    alert("🔄 Reconnecting...");
                    ws.connect();
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
