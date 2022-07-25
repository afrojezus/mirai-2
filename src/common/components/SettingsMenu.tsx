import { hexFromArgb, themeFromImage } from "@material/material-color-utilities";
import { Avatar, Button, DialogContent, DialogTitle, List, ListItem, ListItemAvatar, ListItemButton, ListItemSecondaryAction, ListItemText, ListSubheader, PaletteMode, Radio, TextField, Typography } from "@mui/material";
import { useCallback } from "react";
import { changeBackgroundUserImage, changeProfilePicture, setNewColorScheme, setNewMaterial3Scheme } from "../../features/layout/layoutSlice";
import { useAppDispatch, useAppSelector } from "../hooks";
import { readAsDataUrl } from "../utils/FileReader";

export default () => {
    const backgroundUserImage = useAppSelector((state) => state.layout.backgroundUserImage);
    const user = useAppSelector((state) => state.layout.user);
    const colorScheme = useAppSelector((state) => state.layout.colorScheme);
    const dispatch = useAppDispatch();

    const onChangeBackground = useCallback((e) => {
        if (window && e.target.files.length > 0) {
            readAsDataUrl(e.target.files[0]).then((x) => {
                dispatch(changeBackgroundUserImage(x));
                themeFromImage(document.getElementById("app-bg") as HTMLImageElement).then((theme) => {
                    const light: any = {};
                    const dark: any = {};
                    for (const [key, value] of Object.entries(theme.schemes.light.toJSON())) {
                        const color = hexFromArgb(value);
                        light[key] = color;
                    }
                    for (const [key, value] of Object.entries(theme.schemes.dark.toJSON())) {
                        const color = hexFromArgb(value);
                        dark[key] = color;
                    }
                    dispatch(setNewMaterial3Scheme({ light, dark }));
                });
            });
        }
    }, []);

    const onChangeProfilePicture = useCallback((e) => {
        if (window && e.target.files.length > 0) {
            readAsDataUrl(e.target.files[0]).then((x) => {
                dispatch(changeProfilePicture(x));
            });
        }
    }, []);

    const changeColorScheme = (c: PaletteMode | null) => dispatch(setNewColorScheme(c));

    return <DialogContent>
        <List subheader={<ListSubheader>Color scheme</ListSubheader>}>
            <ListItemButton onClick={() => changeColorScheme('light')}>
                <ListItemText primary="Make it all bright" />
                <ListItemSecondaryAction>
                    <Radio checked={colorScheme === 'light'} />
                </ListItemSecondaryAction>
            </ListItemButton>
            <ListItemButton onClick={() => changeColorScheme('dark')}>
                <ListItemText primary="Make it all dark" />
                <ListItemSecondaryAction>
                    <Radio checked={colorScheme === 'dark'} />
                </ListItemSecondaryAction>
            </ListItemButton>
            <ListItemButton onClick={() => changeColorScheme(null)}>
                <ListItemText primary="Let the system settings on my device decide" />
                <ListItemSecondaryAction>
                    <Radio checked={!colorScheme} />
                </ListItemSecondaryAction>
            </ListItemButton>
        </List>
        <List subheader={<ListSubheader>Background</ListSubheader>}>
            <ListItemButton component="label">
                {backgroundUserImage && <ListItemAvatar>
                    <img src={backgroundUserImage} alt="Your current background image" className="bg-preview" />
                </ListItemAvatar>}
                <ListItemText primary="Change background" secondary="This changes the appearence of the application, including colors" />
                <input hidden accept="image/*" onChange={onChangeBackground} type="file" />
            </ListItemButton>
            <ListItemButton disabled={!backgroundUserImage} onClick={() => dispatch(changeBackgroundUserImage(''))}>
                <ListItemText primary="Clear background" />
            </ListItemButton>
        </List>
        <List subheader={<ListSubheader>Profile</ListSubheader>}>
            <ListItemButton component="label">
                {backgroundUserImage && <ListItemAvatar>
                    <Avatar src={user?.avatar} alt="Your current profile picture" className="bg-preview" />
                </ListItemAvatar>}
                <ListItemText primary="Profile Picture" secondary="Change how you represent yourself on the application" />
                <input hidden accept="image/*" onChange={onChangeProfilePicture} type="file" />
            </ListItemButton>
        </List>
    </DialogContent>;
};