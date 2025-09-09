import React, {useEffect} from "react";
import {
    Box,
    CssBaseline, GlobalStyles, Tab, Tabs,
    ThemeProvider,
} from "@mui/material";
import WaitingPlayers from "./pages/WaitingPlayers/WaitingPlayers";
import {useServerStore} from "./store/useServerStore";
import SettingsIcon from '@mui/icons-material/Settings';
import PeopleIcon from '@mui/icons-material/People';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import SettingsGame from "./pages/SettingsGame/SettingsGame";
import {MUITheme} from "../../MUITheme";
const { ipcRenderer } = window.require('electron');

const styles = {
    global: {
        html: { height: '100%' },
        body: { height: '100%' },
        '#electron': { height: '100%', minHeight: '100%' }
    },
    wrapper: {
        display: "flex",
        alignItems: "center",
        appRegion: 'drag',
        width: 'env(titlebar-area-width)',
        height: 'env(titlebar-area-height, 34px)',
    },
    tabs: {
        appRegion: 'no-drag',
        height: '100%',
        minHeight: 'unset',
        '& .MuiTab-root': {
            transition: '.2s ease-in-out',
            borderRadius: '6px',
            p: '0 6px',
            fontSize: '16px',
            '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, .1)',
            },
            '&.Mui-selected': {
                color: '#fff',
                pointerEvents: 'none',
            },
        },
        '& .MuiTabs-flexContainer': {
            height: '100%',
            gap: '5px'
        },
        '& .MuiTabs-indicator': {
            height: '100%',
            zIndex: -1,
            borderRadius: '6px',
        },
        '& .MuiSvgIcon-root': {
            width: '22px',
            height: '22px',
        }
    },
    tab: {
        height: '100%',
        minHeight: 'unset',
    },
    container: {
        height: 'calc(100% - env(titlebar-area-height, 34px))',
        minHeight: 'calc(100% - env(titlebar-area-height, 34px))',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'overlay',
        p: '2em',
    }
}

const tabs = [
    {label: 'Ожидание игроков', icon: <PeopleIcon />},
    {label: 'Настройки', icon: <SettingsIcon />},
    {label: 'Управление карточками', icon: <DashboardCustomizeIcon />}
];

const App = () => {

    const setIp = useServerStore(s => s.setIp);
    const connect = useServerStore(s => s.ws.connect);
    const disconnect = useServerStore((s) => s.ws.disconnect);

    const [activeTab, setActiveTab] = React.useState(0);

    useEffect(() => {
        const getLocalIp = async (): Promise<string> => {
            return await ipcRenderer.invoke('getLocalIp');
        };

        getLocalIp().then(res => {
            setIp(`http://${res}:${process.env.NODE_ENV === 'development' ? '7357' : '7355'}`);
            connect(`ws://${res}:7355`);
        });

        const updateFontSize = () => {
            const baseWidth = 1920;
            const baseFontSize = 16;
            const currentWidth = window.innerWidth;

            let fontSize = Math.ceil(baseFontSize * (currentWidth / baseWidth));
            fontSize = Math.max(12, Math.min(fontSize, 32));
            document.documentElement.style.fontSize = `${fontSize}px`;
        };

        window.addEventListener("resize", updateFontSize);
        updateFontSize();

        return () => {
            disconnect();
            window.removeEventListener("resize", updateFontSize);
        };
    }, []);

    const handleChangeTab = (
        _: React.SyntheticEvent,
        value: number
    ) => {
        setActiveTab(value);
    };

    return (
        <ThemeProvider theme={MUITheme}>
            <CssBaseline />
            <GlobalStyles styles={styles.global}/>
            <Box sx={styles.wrapper}>
                <Tabs
                    value={activeTab}
                    onChange={handleChangeTab}
                    sx={styles.tabs}
                >
                    {tabs.map(({label, icon}, key) => (
                        <Tab
                            key={key}
                            sx={styles.tab}
                            icon={icon}
                            iconPosition="start"
                            label={label}
                        />
                    ))}
                </Tabs>

                {/*<Box>*/}
                {/*    <Box sx={{ display: 'flex', alignItems: 'center' }}>*/}

                {/*    </Box>*/}
                {/*    <Typography*/}
                {/*        component="p"*/}
                {/*    >*/}
                {/*        Ожидание игроков*/}
                {/*    </Typography>*/}
                {/*</Box>*/}
            </Box>
            <Box sx={styles.container}>
                {activeTab === 0 && <WaitingPlayers/>}
                {activeTab === 1 && <SettingsGame/>}
            </Box>
        </ThemeProvider>
    )
};

export default App;
