import React, {useMemo, useState} from "react";
import {Avatar, Box, Button, IconButton, List, ListItem, ListItemText, Paper, SvgIcon, SwipeableDrawer, Typography} from "@mui/material";
import {useClientStore} from "../../store/useClientStore";
import {getColorForName, getInitialsFromName} from "../../../helpers/getAvatarInfo";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LogoutIcon from '@mui/icons-material/Logout';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';

const styles = {
    wrapper: {
        maxWidth: '1024px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        height: '100%',
        overflow: 'hidden',
        gap: '12px',
        margin: '0 auto'
    },
    title: {
        color: 'primary.main',
        fontSize: '20px',
        fontWeight: 'bold',
    },
    container: {
        maxWidth: '1024px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        overflow: 'auto'
    },
    player: {
        position: 'relative',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px',
        justifyContent: 'space-between',
    },
    playerWrapper: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        maxWidth: 'calc(100% - 52px)',
    },
    you: {
        borderWidth: '1px',
        borderStyle: 'dashed',
        borderColor: 'primary.main',
        padding: '11px',
    },
    avatar: {
        width: '48px',
        height: '48px',
    },
    name: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    },
    crown: {
        position: 'absolute',
        color: 'primary.main',
        zIndex: 1,
        width: '30px',
        height: '30px',
        top: 0,
        left: 0,
        transform: 'rotate(-45deg)',
    },
};

const Room = () => {

    const player = useClientStore((s) => s.player);
    const players = useClientStore((s) => s.players);

    const [showMenuPlayer, setShowMenuPlayer] = useState({
        id: null,
        show: false
    });

    const host = useMemo(() => player.role === 'host', [player]);

    const renderPlayers = useMemo(() => {
        return players.filter(({id}) => id !== player.id);
    }, [players]);

    return (
        <Box sx={styles.wrapper}>
            <SwipeableDrawer
                anchor="bottom"
                open={showMenuPlayer.show}
                onClose={() => setShowMenuPlayer({id: null, show: false})}
                onOpen={() => setShowMenuPlayer({id: null, show: false})}
                PaperProps={{ sx: { mx: "auto" } }}
            >
                <Box>
                    <ListItem
                        component={'div'}
                        onClick={() => setShowMenuPlayer({id: null, show: false})}
                    >
                        <SvgIcon>
                            <path d="M5 16L3 7L8.5 11L12 4L15.5 11L21 7L19 16H5M5 18H19C19 19.1 18.1 20 17 20H7C5.9 20 5 19.1 5 18Z" />
                        </SvgIcon>
                        <ListItemText primary="Передать роль ведущего игрока" />
                    </ListItem>
                    <ListItem
                        sx={{color: 'error.main'}}
                        component={'div'}
                        onClick={() => setShowMenuPlayer({id: null, show: false})}
                    >
                        <DoDisturbIcon />
                        <ListItemText primary="Исключить игрока" />
                    </ListItem>
                </Box>
                <ListItem component={'div'} onClick={() => setShowMenuPlayer({id: null, show: false})}>
                    <ListItemText primary="Отмена" />
                </ListItem>
            </SwipeableDrawer>

            <Typography
                sx={styles.title}
                align='center'
            >
                {players.length >= 4 ? 'Ожидание запруска игры...' : 'Ожидание игроков...'}
            </Typography>
            <Paper
                key={player.id}
                sx={{...styles.player, ...styles.you}}
            >
                {host && (
                    <SvgIcon sx={styles.crown}>
                        <path d="M5 16L3 7L8.5 11L12 4L15.5 11L21 7L19 16H5M5 18H19C19 19.1 18.1 20 17 20H7C5.9 20 5 19.1 5 18Z" />
                    </SvgIcon>
                )}
                <Box sx={styles.playerWrapper}>
                    <Avatar
                        src={player.image}
                        sx={{
                            ...styles.avatar,
                            background: player.image ? undefined : getColorForName(player.name),
                        }}
                    >
                        {getInitialsFromName(player.name)}
                    </Avatar>
                    <Typography sx={styles.name}>
                        {player.name}
                    </Typography>
                </Box>
                <IconButton>
                    <LogoutIcon sx={{color: 'primary.main'}} />
                </IconButton>
            </Paper>
            <Box sx={styles.container}>
                {renderPlayers.map(({id, role, image, name}) => (
                    <Paper
                        key={id}
                        sx={styles.player}
                    >
                        {role === 'host' && (
                            <SvgIcon sx={styles.crown}>
                                <path d="M5 16L3 7L8.5 11L12 4L15.5 11L21 7L19 16H5M5 18H19C19 19.1 18.1 20 17 20H7C5.9 20 5 19.1 5 18Z" />
                            </SvgIcon>
                        )}
                        <Box
                            sx={styles.playerWrapper}
                        >
                            <Avatar
                                src={image}
                                sx={{
                                    ...styles.avatar,
                                    background: image ? undefined : getColorForName(name),
                                }}
                            >
                                {getInitialsFromName(name)}
                            </Avatar>
                            <Typography sx={styles.name}>
                                {name}
                            </Typography>
                        </Box>
                        {host && (
                            <IconButton onClick={() => setShowMenuPlayer({id, show: true})}>
                                <MoreVertIcon sx={{color: 'primary.main'}} />
                            </IconButton>
                        )}
                    </Paper>
                ))}
            </Box>
            {host && (
                <Button
                    sx={{mt: 'auto'}}
                    disabled={players.length < 4}
                    size={'large'}
                    variant="contained"
                >
                    Запустить игру
                </Button>
            )}
        </Box>
    )
};

export default Room;
