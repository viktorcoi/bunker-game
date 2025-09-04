import React, {useEffect} from "react";
import {
    Box,
    createTheme,
    CssBaseline, GlobalStyles,
    ThemeProvider,
    Typography
} from "@mui/material";
import WaitingPlayers from "./pages/WaitingPlayers/WaitingPlayers";
import {useServerStore} from "./store/useServerStore";
const { ipcRenderer } = window.require('electron');

const App = () => {

    const setIp = useServerStore(s => s.setIp);
    const connect = useServerStore(s => s.ws.connect)
    const disconnect = useServerStore((s) => s.ws.disconnect);

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
        const getLocalIp = async (): Promise<string> => {
            return await ipcRenderer.invoke('getLocalIp');
        };

        getLocalIp().then(res => {
            setIp(`http://${res}:${process.env.NODE_ENV === 'development' ? '7357' : '7355'}`);
            connect(`ws://${res}:7355`);
        });

        return () => disconnect();
    }, []);

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <GlobalStyles
                styles={{
                    html: { height: '100%' },
                    body: { height: '100%' },
                    '#electron': { height: '100%' }
                }}
            />
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    appRegion: 'drag',
                    width: 'env(titlebar-area-width)',
                    height: 'env(titlebar-area-height, 34px)',
                    pl: "1.4%",
                    pr: '1.4%'
                }}
            >
                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>

                    </Box>
                    <Typography
                        component="p"
                    >
                        Ожидание игроков
                    </Typography>
                </Box>
            </Box>
            <Box
                sx={{
                    height: 'calc(100% - env(titlebar-area-height, 34px))',
                    p: '1.4%',
                }}
            >
                <WaitingPlayers/>
            </Box>
        </ThemeProvider>
    )
};

export default App;
