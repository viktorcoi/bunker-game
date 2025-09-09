import {createTheme} from "@mui/material";

export const MUITheme = createTheme({
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                "::-webkit-scrollbar": {
                    width: ".32em",
                },
                "::-webkit-scrollbar-thumb": {
                    backgroundColor: "#ffa726",
                    borderRadius: ".4em",
                },
                "::-webkit-scrollbar-button": {
                    height: 'auto',
                },
            },
        },
    },
    typography: {
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            'Segoe UI',
            'Roboto',
            'Oxygen',
            'Ubuntu',
            'Cantarell',
            'Fira Sans',
            'Droid Sans',
            'Helvetica Neue',
            'sans-serif',
        ].join(','),
    },
    palette: {
        mode: 'dark',
        primary: {
            main: '#ffa726',
        },
    },
});
