import {Avatar, Box, Paper, Typography} from "@mui/material";
import React from "react";
import {QRCodeSVG} from "qrcode.react";
import {getColorForName, getInitialsFromName} from "./helpers";
import {useServerStore} from "../../store/useServerStore";

const WaitingPlayers = () => {

    const ip = useServerStore(s => s.ip);
    const players = useServerStore((s) => s.players);

    return (
        <Box
            sx={{
                height: '100%',
                display: 'flex',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1,
                }}
            >
                <Typography
                    align="center"
                    variant="h4"
                >
                    Присоедениться к игре:
                </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            flexGrow: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden',
                            margin: '10%'
                        }}
                    >
                        <QRCodeSVG
                            style={{
                                maxHeight: '900px',
                                maxWidth: '900px',
                            }}
                            width='100%'
                            height='100%'
                            value={ip}
                            fgColor="#ffa726"
                            bgColor="#121212"
                        />
                    </Box>
            </Box>
            <Box
                sx={{
                    width: '35%'
                }}
            >
                <Typography
                    align="center"
                    variant="h4"
                    mb={'8%'}
                >
                    Игроки в комнате
                </Typography>
                <Box>
                    {players.length > 0 ? (
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: '1fr',
                                gap: '1vh'
                            }}
                        >
                            {players.map((player) => (
                                <Paper
                                    key={player.id}
                                    sx={{
                                        fontWeight: 'bold',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '2%',
                                        width: "100%",
                                        p: '2%',
                                    }}
                                >
                                    <Avatar
                                        src={player.image}
                                        sx={{
                                            background: getColorForName(player.name),
                                        }}
                                    >
                                        {getInitialsFromName(player.name)}
                                    </Avatar>
                                    {player.name}
                                </Paper>
                            ))}
                        </Box>
                    ) : (
                        <Typography color="text.secondary">Ожидание игроков...</Typography>
                    )}
                </Box>
            </Box>
        </Box>
    )
};

export default WaitingPlayers;
