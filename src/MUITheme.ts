import {createTheme} from "@mui/material";

export const MUITheme = createTheme({
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                "@media (hover: hover) and (pointer: fine)": {
                    "::-webkit-scrollbar": {
                        width: ".32em",
                    },
                    "::-webkit-scrollbar-thumb": {
                        backgroundColor: "#ffa726",
                        borderRadius: ".4em",
                    },
                    "::-webkit-scrollbar-button": {
                        height: "auto",
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    padding: ".5em 0",
                },
            },
        },
        MuiMenuItem: {
            styleOverrides: {
                root: {
                    padding: ".6em",
                    display: "flex",
                    gap: ".45rem",
                    alignItems: "center",
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    '& .MuiBox-root': {
                        display: "flex",
                        flexDirection: "column",
                        backgroundImage: 'var(--Paper-overlay)',
                        backgroundColor: '#121212',
                        borderRadius: "14px",
                        padding: "4px",
                        '& .MuiListItem-root:not(:first-of-type)::after': {
                            position: 'absolute',
                            left: '7px',
                            right: '7px',
                            height: '1px',
                            content: '""',
                            top: 0,
                            backgroundColor: 'rgba(0, 0, 0, .2)',
                            transformOrigin: 'center bottom'
                        }
                    },
                    background: "transparent",
                    boxShadow: "none",
                    maxWidth: "768px",
                    width: "calc(100% - 16px)",
                    gap: '8px',
                    paddingBottom: '8px',
                },
            },
        },
        MuiListItem: {
            styleOverrides: {
                root: {
                    flex: 'unset',
                    display: "flex",
                    alignItems: "center",
                    gap: '12px',
                    userSelect: "none",
                    WebkitTapHighlightColor: 'transparent',
                    borderRadius: "14px",
                    backgroundImage: 'var(--Paper-overlay)',
                    backgroundColor: '#121212',
                    height: "56px",
                    transition: '.2s ease-in-out',
                    textAlign: 'center',
                    cursor: 'pointer',
                    justifyContent: 'center',
                    '&:hover, &:active': {
                        backgroundColor: '#040404',
                    },
                    '& .MuiListItemText-root': {
                        flex: 'unset'
                    }
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
