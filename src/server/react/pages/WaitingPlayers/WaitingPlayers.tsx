import {
    Avatar,
    Box,
    Button,
    ClickAwayListener,
    IconButton,
    MenuItem,
    Paper,
    Popper,
    SvgIcon,
    Typography,
    useTheme
} from "@mui/material";
import React, {useEffect, useMemo, useState} from "react";
import {QRCodeSVG} from "qrcode.react";
import {useServerStore} from "../../store/useServerStore";
import {PlayerType} from "../../../../types";
import {getColorForName, getInitialsFromName} from "../../../../helpers/getAvatarInfo";
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import MoreVertIcon from "@mui/icons-material/MoreVert";

const styles = {
    wrapper: {
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'min(3vw, 4em)',
        overflow: 'hidden',
    },
    qr: {
        style: {
            maxWidth: '45em',
            width: '40%',
            maxHeight: '100%'
        },
        width: '45em',
        height: '45em',
        bgColor: '#121212'
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        height: '100%',
        maxWidth: '60em',
        width: '60%',
    },
    list: {
        overflow: 'overlay',
        maxHeight: '100%',
        mb: '2rem'
    },
    players: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        gap: '.6em',
    },
    player: {
        position: 'relative',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        gap: '.6em',
        justifyContent: 'space-between',
    },
    playerWrapper: {
        display: 'flex',
        alignItems: 'center',
        gap: '.75em',
        maxWidth: 'calc(100% - 8px - 3em)',
    },
    avatar: {
        height: '3rem',
        width: '3rem',
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
        width: '1.88rem',
        height: '1.88rem',
        top: 0,
        left: 0,
        transform: 'rotate(-45deg)',
    },
};

const WaitingPlayers = () => {

    const theme = useTheme();

    const ip = useServerStore(s => s.ip);
    const players = useServerStore((s) => s.players);

    const [showMenuPlayer, setShowMenuPlayer] = useState({
        el: null,
        id: null,
    });

    const renderPlayers = useMemo(() => {
        let list: Partial<Omit<PlayerType, 'id'> & {id: string | number}>[] = [...Array(16).keys()].map(key => ({
            id: `empty-${key}`,
            name: 'Ожидание игрока...'
        }));

        if (players.length !== 0) {
            list = list.map((item, key) => {
                if (players[key]) {
                    return players[key];
                }
                return {...item}
            })
        }

        return list;
    }, [players]);

    const handleOpenMenuPlayer = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        id: number
    ) => {
        if (id === showMenuPlayer.id) {
            setShowMenuPlayer({el: null, id: null});
            return;
        }
        setShowMenuPlayer(prevState => ({
            ...prevState,
            el: e.currentTarget,
        }));
        setTimeout(() => {
            setShowMenuPlayer(prevState => ({
                ...prevState,
                id
            }));
        })
    };

    useEffect(() => {
        console.log(showMenuPlayer);
    }, [showMenuPlayer])

    return (
        <Box sx={styles.wrapper}>
            <Popper
                placement={'bottom-end'}
                open={Boolean(showMenuPlayer.el)}
                anchorEl={showMenuPlayer.el}
            >
                <ClickAwayListener
                    onClickAway={(event) => {
                        if (!showMenuPlayer.el || !showMenuPlayer.el.contains(event.target as Node)) {
                            setShowMenuPlayer({el: null, id: null});
                        }
                    }}
                >
                    <Paper elevation={3}>
                        {players.some(({id, role}) => id === showMenuPlayer.id && role !== 'host') && (
                            <MenuItem onClick={() => setShowMenuPlayer({el: null, id: null})}>
                                <SvgIcon>
                                    <path d="M5 16L3 7L8.5 11L12 4L15.5 11L21 7L19 16H5M5 18H19C19 19.1 18.1 20 17 20H7C5.9 20 5 19.1 5 18Z" />
                                </SvgIcon>
                                <Typography>Применить роль ведущего игрока</Typography>
                            </MenuItem>
                        )}
                        <MenuItem sx={{ color: "error.main" }} onClick={() => setShowMenuPlayer({el: null, id: null})}>
                            <DoDisturbIcon/>
                            <Typography>Исключить игрока</Typography>
                        </MenuItem>
                    </Paper>
                </ClickAwayListener>
            </Popper>
            <QRCodeSVG
                value={ip}
                fgColor={theme.palette.primary.main}
                {...styles.qr}
            />
            <Box sx={styles.container}>
                <Box sx={styles.list}>
                    <Box sx={styles.players}>
                        {renderPlayers.map(({id, name, image, role}) => {
                            const placeholder = typeof id === 'string';

                            return (
                                <Paper
                                    key={id}
                                    sx={{
                                        ...styles.player,
                                        padding: placeholder ? 'calc(.6em - 1px)' : '.6em',
                                        border: placeholder ? '1px dashed gray' : undefined,
                                        opacity: placeholder ? .35 : 1,
                                    }}
                                >
                                    {role === 'host' && (
                                        <SvgIcon sx={styles.crown}>
                                            <path d="M5 16L3 7L8.5 11L12 4L15.5 11L21 7L19 16H5M5 18H19C19 19.1 18.1 20 17 20H7C5.9 20 5 19.1 5 18Z" />
                                        </SvgIcon>
                                    )}
                                    <Box sx={styles.playerWrapper}>
                                        <Avatar
                                            src={image}
                                            sx={{
                                                ...styles.avatar,
                                                background: placeholder || image ? undefined : getColorForName(name),
                                            }}
                                        >
                                            {placeholder ? undefined : getInitialsFromName(name)}
                                        </Avatar>
                                        <Typography sx={styles.name}>
                                            {name}
                                        </Typography>
                                    </Box>
                                    {!placeholder && (
                                        <IconButton
                                            onClick={e => handleOpenMenuPlayer(e, id)}
                                            aria-haspopup="true"
                                        >
                                            <MoreVertIcon sx={{color: 'primary.main'}} />
                                        </IconButton>
                                    )}
                                </Paper>
                            )
                        })}
                    </Box>
                </Box>
                <Button
                    disabled={players.length < 4}
                    fullWidth={true}
                    variant="contained"
                >
                    Начать игру
                </Button>
            </Box>
        </Box>
    )
};

export default WaitingPlayers;
