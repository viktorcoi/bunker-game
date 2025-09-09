import React, {useEffect, useState} from "react";
import {Box, Button, TextField} from "@mui/material";
import {useClientStore} from "../store/useClientStore";

const SignIn = () => {

    const updatePlayer = useClientStore((s) => s.updatePlayer);
    const uid = useClientStore((s) => s.player.uid);
    const singIn = useClientStore((s) => s.ws.send.singIn);
    const subscribe = useClientStore((s) => s.ws.subscribe);

    const [name, setName] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [statusAuth, setStatusAuth] = useState<any>(null);

    useEffect(() => {
        const unsubscribe = subscribe(uid, (data) => {
            console.log(data)
            setStatusAuth(data);
        });

        return () => unsubscribe();
    }, [uid]);

    useEffect(() => {
        if (!statusAuth) return;

        setLoading(false);
        if (statusAuth.status === 'success') {
            updatePlayer(statusAuth.player);
        }
    }, [statusAuth]);

    const handleSignIn = () => {
        singIn({uid, name});
        setLoading(true);
        setStatusAuth(null)
    }

    return (
        <Box
            sx={{
                padding: "2%",
                display: "flex",
                flexDirection: 'column',
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    maxWidth: "600px",
                    gap: '20px'
                }}
            >
                <TextField
                    error={statusAuth?.status === 'error'}
                    helperText={statusAuth?.error}
                    disabled={loading}
                    value={name}
                    onChange={(e) => {
                        if (e.target.value.length <= 26) {
                            setName(e.target.value);
                        }
                    }}
                    fullWidth={true}
                    label="Введите имя"
                />
                <Button
                    loading={loading}
                    disabled={name.trim().length < 3}
                    onClick={handleSignIn}
                    size={'large'}
                    variant="contained"
                >
                    Войти
                </Button>
            </Box>
        </Box>
    )
}

export default SignIn;
