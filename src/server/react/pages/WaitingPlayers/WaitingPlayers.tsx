import {Avatar, Box, Button, Paper, Typography} from "@mui/material";
import React, {useMemo} from "react";
import {QRCodeSVG} from "qrcode.react";
import {getColorForName, getInitialsFromName} from "./helpers";
import {useServerStore} from "../../store/useServerStore";
import {PlayerType} from "../../../../types";

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
        fgColor: '#ffa726',
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
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        gap: '.6em',
    },
    avatar: {
        height: '3rem',
        width: '3rem',
    },
    name: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    }
};

const WaitingPlayers = () => {

    const ip = useServerStore(s => s.ip);
    const players = useServerStore((s) => s.players);

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

    return (
        <Box sx={styles.wrapper}>
            <QRCodeSVG
                value={ip}
                {...styles.qr}
            />
            <Box sx={styles.container}>
                <Box sx={styles.list}>
                    <Box sx={styles.players}>
                        {renderPlayers.map(({id, name, image}) => {
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
                                    <Avatar
                                        src={image}
                                        sx={{
                                            ...styles.avatar,
                                            background: placeholder ? undefined : getColorForName(name),
                                        }}
                                    >
                                        {placeholder ? undefined : getInitialsFromName(name)}
                                    </Avatar>
                                    <Typography sx={styles.name}>
                                        {name}
                                    </Typography>
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
