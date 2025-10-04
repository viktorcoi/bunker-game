import React, {useEffect, useState} from "react";
import {Avatar, Box, Button, TextField} from "@mui/material";
import {useClientStore} from "../../store/useClientStore";
import {getColorForName, getInitialsFromName} from "../../../helpers/getAvatarInfo";
import {CircularProgress} from "@mui/material";
import axios from "axios";

const styles = {
    wrapper: {
        padding: "15px",
        display: "flex",
        flexDirection: 'column',
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxWidth: "600px",
        gap: '20px',
        alignItems: "center",
    },
    avatar: {
        height: '128px',
        width: '128px',
    },
};


const SignIn = () => {

    const updatePlayer = useClientStore((s) => s.updatePlayer);
    const uid = useClientStore((s) => s.player.uid);
    const login = useClientStore((s) => s.login);
    const connectionId = useClientStore((s) => s.connectionId);

    const [name, setName] = React.useState("");
    const [image, setImage] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [statusAuth, setStatusAuth] = useState<{ status: 'success' | 'error', error?: string } | null>(null);
    const [imageLoading, setImageLoading] = React.useState(false);

    // useEffect(() => { // No longer needed as login handles status directly
    //     const unsubscribe = subscribe(uid, (data) => {
    //         console.log(data)
    //         setStatusAuth(data);
    //     });
    //
    //     return () => unsubscribe();
    // }, [uid]);

    // useEffect(() => { // Combined with handleSignIn
    //     if (!statusAuth) return;
    //
    //     setLoading(false);
    //     if (statusAuth.status === 'success') {
    //         updatePlayer(statusAuth.player);
    //     }
    // }, [statusAuth]);

    const handleSignIn = async () => {
        if (!connectionId) {
            setStatusAuth({ status: 'error', error: 'No WebSocket connection. Please refresh.' });
            return;
        }
        setLoading(true);
        setStatusAuth(null);
        const result = await login(name, image, uid, connectionId);
        if (result.status === 'error') {
            setStatusAuth({ status: 'error', error: result.error });
        }
        setLoading(false);
    }

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImageLoading(true);

            const formData = new FormData();
            formData.append('avatar', file);
            formData.append('uid', 'uid-23');

            await axios.post(`http://${window.location.hostname}:7355/upload-avatar`,
                formData
            ).then((res) => {

            }).catch(e => {
                setStatusAuth({ status: 'error', error: e.message || 'Image upload failed' });
            }).finally(() => {
                setImageLoading(false);
            })
        }
    };

    const dev = process.env.NODE_ENV === 'development';

    return (
        <Box sx={styles.wrapper}>
            <Box sx={styles.form}>
                <Avatar
                    src={dev ? `http://192.168.0.104:7355${image}` : image}
                    sx={{
                        ...styles.avatar,
                        background: image ? undefined : getColorForName(name),
                    }}
                >
                    {imageLoading ? (
                        <CircularProgress size={82}/>
                    ) : (
                        getInitialsFromName(name)
                    )}
                </Avatar>
                <>
                    <input
                        type="file"
                        accept="image/*"
                        style={{display: 'none'}}
                        id="avatar-upload"
                        onChange={handleImageUpload}
                    />
                    <Button
                        size={'large'}
                        variant="outlined"
                        component="label"
                        htmlFor="avatar-upload"
                        disabled={imageLoading}
                    >
                        {imageLoading ? <CircularProgress size={24}/> : "Загрузить аватар"}
                    </Button>
                </>
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
                    fullWidth={true}
                    loading={loading}
                    disabled={name.trim().length < 3 || loading || !connectionId}
                    onClick={handleSignIn}
                    size={'large'}
                    variant="contained"
                >
                    {loading ? <CircularProgress size={24}/> : "Войти"}
                </Button>
            </Box>
        </Box>
    )
}

export default SignIn;
