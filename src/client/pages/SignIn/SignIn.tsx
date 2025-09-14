import React, {useEffect, useState} from "react";
import {Avatar, Box, Button, TextField} from "@mui/material";
import {useClientStore} from "../../store/useClientStore";
import {getColorForName, getInitialsFromName} from "../../../helpers/getAvatarInfo";
import {CircularProgress} from "@mui/material";

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
    const singIn = useClientStore((s) => s.ws.send.singIn);
    const subscribe = useClientStore((s) => s.ws.subscribe);

    const [name, setName] = React.useState("");
    const [image, setImage] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [statusAuth, setStatusAuth] = useState<any>(null);
    const [imageLoading, setImageLoading] = React.useState(false);

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
        singIn({uid, name, image});
        setLoading(true);
        setStatusAuth(null)
    }

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImageLoading(true);
            const reader = new FileReader();
            reader.onloadend = () => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    canvas.width = 256;
                    canvas.height = 256;
                    const aspectRatio = img.width / img.height;
                    let sx, sy, sWidth, sHeight;

                    if (aspectRatio > 1) {
                        sHeight = img.height;
                        sWidth = img.height;
                        sx = (img.width - sWidth) / 2;
                        sy = 0;
                    } else {
                        sWidth = img.width;
                        sHeight = img.width;
                        sx = 0;
                        sy = (img.height - sHeight) / 2;
                    }

                    ctx?.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, 256, 256);
                    setImage(canvas.toDataURL('image/webp', .8));
                    setImageLoading(false);
                };
                img.src = reader.result as string;
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Box sx={styles.wrapper}>
            <Box sx={styles.form}>
                <Avatar
                    src={image}
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
                    >
                        Загрузить аватар
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
