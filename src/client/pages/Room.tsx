import React from "react";
import {Avatar, Box, Paper, Typography} from "@mui/material";
import {getColorForName, getInitialsFromName} from "../../server/react/pages/WaitingPlayers/helpers";
import {useClientStore} from "./store/useClientStore";

const Room = () => {

    const user = useClientStore((s) => s.player);
    const players = useClientStore((s) => s.players);

    return (
        <Box
            sx={{
                p: '2%'
            }}
        >
            <Paper
                key={user.id}
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
                    src={user.image}
                    sx={{
                        background: getColorForName(user.name),
                    }}
                >
                    {getInitialsFromName(user.name)}
                </Avatar>
                {user.name}(ты лох)
            </Paper>
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
                        {players
                            .filter(({id}) => id !== user.id)
                            .map((player) => (
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
    )
};

export default Room;
