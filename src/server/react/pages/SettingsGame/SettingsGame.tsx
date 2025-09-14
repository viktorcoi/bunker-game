import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
    Autocomplete,
    Box, Button, Checkbox, FormControlLabel, TextField, Typography
} from "@mui/material";
import { useServerStore } from "../../store/useServerStore";
import TimeSelect from "../../components/TimeSelect/TimeSelect";
import {changeSecondsForMinutes} from "./helpers";

const styles = {
    wrapper: {
        display: 'flex',
        flexDirection: 'column',
        width: '70%',
        margin: 'auto',
        gap: '3em'
    },
    fields: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1em',
    },
    time: {
        display: "flex",
        flexDirection: 'column',
        gap: '.8em',
        position: 'relative',
    },
    fieldsTimes: {
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: '12px'
    },
    caption: {
        position: 'absolute',
        right: 0,
        top: '100%',
    },
    checkbox: {
        width: 'fit-content',
    },
    listBox: {
        maxHeight: '21vh',
        overflow: 'overlay',
    }
};

const SettingsGame = () => {
    const players = useServerStore((s) => s.players);

    const [playerTurnTime, setPlayerTurnTime] = useState({
        minutes: 0,
        seconds: 30,
    });
    const [discussionTime, setDiscussionTime] = useState({
        minutes: 1,
        seconds: 0,
    });
    const [autoVote, setAutoVote] = useState(false);
    const [votingTime, setVotingTime] = useState({
        minutes: 0,
        seconds: 30,
    });
    const [host, setHost] = useState<{id: number; label: string} | null>(null);
    const [manageByHost, setManageByHost] = useState(false);

    const hostRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const findHost = players.find((player) => player.role === 'host');

        if (findHost.id) setHost({id: findHost.id, label: findHost.name});
    }, []);

    const playersOptions = useMemo(() => {
        return players.map((player) => ({
            id: player.id,
            label: player.name,
        }))
    }, [players]);

    return (
        <Box sx={styles.wrapper}>
            <Box sx={styles.fields}>
                <Autocomplete
                    ListboxProps={{style: styles.listBox}}
                    options={playersOptions}
                    value={host}
                    onClose={(e) => {
                        e.stopPropagation();
                        hostRef.current?.blur();
                    }}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    noOptionsText="Игроков не найдено"
                    onChange={(_, newValue) => {
                        hostRef.current?.blur();
                        setHost(newValue)
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            placeholder={'Выберите ведущего игрока'}
                            InputLabelProps={{shrink: true}}
                            inputRef={hostRef}
                            label={'Ведущий'}
                        />
                    )}
                />
                <Box sx={styles.time}>
                    <Typography>Время хода игрока</Typography>
                    <Box>
                        <Box sx={styles.fieldsTimes}>
                            <TimeSelect
                                disabled={manageByHost}
                                value={playerTurnTime.minutes}
                                label={'Минуты'}
                                maxTime={2}
                                onChange={value => setPlayerTurnTime(prevState => ({
                                    seconds: changeSecondsForMinutes(value, prevState.seconds, 2, 10),
                                    minutes: value,
                                }))}
                            />
                            <TimeSelect
                                disabled={manageByHost}
                                getOptionDisabled={option =>
                                    (playerTurnTime.minutes === 0 && option.id < 10) ||
                                    (playerTurnTime.minutes === 2 && option.id > 0)
                                }
                                value={playerTurnTime.seconds}
                                label={'Секунды'}
                                onChange={value => setPlayerTurnTime(prevState => ({
                                    ...prevState,
                                    seconds: value,
                                }))}
                            />
                        </Box>
                        <Typography
                            sx={styles.caption}
                            align={'right'}
                            variant="caption"
                            color="textSecondary"
                        >
                            минимум 00:10, максимум 02:00
                        </Typography>
                    </Box>
                </Box>
                <Box sx={styles.time}>
                    <Typography>Время обсуждения</Typography>
                    <Box>
                        <Box sx={styles.fieldsTimes}>
                            <TimeSelect
                                disabled={manageByHost}
                                maxTime={10}
                                value={discussionTime.minutes}
                                label={'Минуты'}
                                onChange={value => setDiscussionTime(prevState => ({
                                    seconds: changeSecondsForMinutes(value, prevState.seconds, 10, 10),
                                    minutes: value,
                                }))}
                            />
                            <TimeSelect
                                disabled={manageByHost}
                                value={discussionTime.seconds}
                                label={'Секунды'}
                                getOptionDisabled={option =>
                                    (discussionTime.minutes === 0 && option.id < 10) ||
                                    (discussionTime.minutes === 10 && option.id > 0)
                                }
                                onChange={value => setDiscussionTime(prevState => ({
                                    ...prevState,
                                    seconds: value,
                                }))}
                            />
                        </Box>
                        <Typography
                            sx={styles.caption}
                            align={'right'}
                            variant="caption"
                            color="textSecondary"
                        >
                            минимум 00:10, максимум 10:00
                        </Typography>
                    </Box>
                </Box>
                <FormControlLabel
                    sx={styles.checkbox}
                    control={
                        <Checkbox
                            checked={autoVote}
                            onChange={(e) => setAutoVote(e.target.checked)}
                            name="autoVote"
                        />
                    }
                    label="Автоматически переходить к голосованию после обсуждения"
                />
                <Box sx={styles.time}>
                    <Typography>Время голосования</Typography>
                    <Box>
                        <Box sx={styles.fieldsTimes}>
                            <TimeSelect
                                disabled={manageByHost}
                                maxTime={5}
                                value={votingTime.minutes}
                                label={'Минуты'}
                                onChange={value => setVotingTime(prevState => ({
                                    seconds: changeSecondsForMinutes(value, prevState.seconds, 5, 10),
                                    minutes: value,
                                }))}
                            />
                            <TimeSelect
                                disabled={manageByHost}
                                value={votingTime.seconds}
                                label={'Секунды'}
                                getOptionDisabled={option =>
                                    (votingTime.minutes === 0 && option.id < 10) ||
                                    (votingTime.minutes === 5 && option.id > 0)
                                }
                                onChange={value => setVotingTime(prevState => ({
                                    ...prevState,
                                    seconds: value,
                                }))}
                            />
                        </Box>
                        <Typography
                            sx={styles.caption}
                            align={'right'}
                            variant="caption"
                            color="textSecondary"
                        >
                            минимум 00:10, максимум 05:00
                        </Typography>
                    </Box>
                </Box>
                <FormControlLabel
                    sx={styles.checkbox}
                    control={
                        <Checkbox
                            checked={manageByHost}
                            onChange={(e) => setManageByHost(e.target.checked)}
                            name="manageByHost"
                        />
                    }
                    label="Управление игрой ведущим"
                />
            </Box>
            <Button
                variant="contained"
            >
                Сохранить
            </Button>
        </Box>
    );
};

export default SettingsGame;
