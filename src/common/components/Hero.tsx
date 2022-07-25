import { Paper, Theme, useMediaQuery } from "@mui/material";
import { ReactNode } from "react";
import { useAppSelector } from "../hooks";

interface Hero {
    children: ReactNode;
    img?: string;
    mounted?: boolean;
    row?: boolean;
    colorRich?: boolean;
    sx?: (theme: Theme) => any;
}

export default ({ children, img, mounted = false, row = false, colorRich = false, sx }: Hero) => {
    const scheme = useAppSelector((state) => state.layout.material3Scheme);
    const isMobile = useMediaQuery('(max-width: 480px)');
    return <Paper
        elevation={0}
        sx={(theme) => ({
            ...(mounted && { borderTopLeftRadius: isMobile ? 0 : undefined, borderBottomLeftRadius: 0, borderBottomRightRadius: 0, borderTopRightRadius: 0 }),
            display: 'inline-flex',
            px: 4,
            py: 6,
            ...(row ? { flexFlow: 'row wrap' } : { flexFlow: 'column wrap', }),
            textAlign: 'left',
            justifyContent: 'start',
            alignContent: 'start',
            alignItems: 'start',
            ...(colorRich ? {
                background: scheme ? theme.palette.secondary.main : theme.palette.secondary.dark,
            } : {
                background: mounted ? theme.palette.background.paper : theme.palette.background.default,
            }),
            ...(img && { backgroundImage: img }),
            '& > h1, h2, h3, h4, h5, h6, p, code, a': {
                fontWeight: 500,
                ...(colorRich ? {
                    color: scheme ? theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.dark : theme.palette.getContrastText(theme.palette.secondary.dark)
                } : {
                    color: theme.palette.getContrastText(img ? img : theme.palette.background.default)
                })
            },
            '& > * > button': {
                ...(colorRich ? {
                    color: scheme ? theme.palette.text.primary : theme.palette.getContrastText(theme.palette.primary.dark),
                    background: scheme ? theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.dark : theme.palette.primary.main
                } : {
                    background: theme.palette.getContrastText(img ? img : theme.palette.background.default)
                })
            },
            ...(sx ? sx(theme) : undefined)
        })}
    >
        {children}
    </Paper>;
};