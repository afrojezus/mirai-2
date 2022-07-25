import { Button, Icon, IconButton, InputBase, Paper, Toolbar } from "@mui/material";
import * as Icons from '@mui/icons-material';
import { useCallback } from "react";
import WhiteSpace from "../WhiteSpace";

function SocialEntry() {

    const onSubmit = useCallback((event: { preventDefault: () => void; }) => {
        event.preventDefault();
    }, []);

    return <Paper elevation={0} sx={(theme) => ({
        background: theme.palette.background.default,
        display: 'inline-flex',
        flexFlow: 'column wrap',
        '& > form': {
            display: 'inherit',
            flexFlow: 'inherit',
        },
        width: '100%'
    })}>
        <form onSubmit={onSubmit}>
            <Paper elevation={0} sx={(theme) => ({
                background: theme.palette.primary.paper,
                borderWidth: 2,
                borderStyle: 'solid',
                borderColor: theme.palette.background.default,
            })}>
                <InputBase multiline sx={(theme) => ({ fontSize: theme.typography.pxToRem(16), px: 2, py: 1 })} fullWidth placeholder="What's on your mind today?" />
            </Paper>
            <Toolbar sx={(theme) => ({
                px: 1
            })} variant="dense" disableGutters>
                <IconButton color="inherit">
                    <Icons.Gif />
                </IconButton>
                <IconButton color="inherit">
                    <Icons.Image />
                </IconButton>
                <WhiteSpace />
                <Button variant="outlined">Publish</Button>
            </Toolbar>
        </form>
    </Paper>;
}

export default SocialEntry;