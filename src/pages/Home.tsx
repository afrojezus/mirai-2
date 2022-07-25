import { Card, Grid, Typography, List, ListSubheader, ListItem, ListItemAvatar, Avatar, ListItemText, ListItemButton, useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Hero from "../common/components/Hero";
import SafeArea from "../common/components/SafeArea";
import SocialEntry from "../common/components/Social/SocialEntry";
import { useAppSelector } from "../common/hooks";
import Feed from "../features/feed/Feed";

export default () => {
    const isMobile = useMediaQuery('(max-width: 480px)');
    const user = useAppSelector((state) => state.layout.user);
    const navigate = useNavigate();
    return <SafeArea disableVerticalGutter>
        <Hero sx={(theme) => ({
            mt: 2
        })}>
            <Typography variant="h4">Your destination for Japanese media</Typography>
            <Typography variant="subtitle1">Stream, share, and track anime effortlessly</Typography>
        </Hero>
        <Grid container spacing={2} sx={{ my: 2 }}>
            {user && <Grid item xs={isMobile ? 12 : 3}>
                <List subheader={<ListSubheader sx={(theme) => ({ background: theme.palette.background.paper })}>You</ListSubheader>}>
                    <ListItemButton sx={(theme) => ({ background: theme.palette.background.default, borderRadius: theme.shape.borderRadius })}>
                        <ListItemAvatar>
                            <Avatar src={user.avatar} alt="U" />
                        </ListItemAvatar>
                        <ListItemText primary={user.name} secondary={user.email} />
                    </ListItemButton>
                    <ListItemButton>
                        <ListItemText primary="Friends" />
                    </ListItemButton>
                    <ListItemButton>
                        <ListItemText primary="Later" />
                    </ListItemButton>
                    <ListItemButton>
                        <ListItemText primary="Random" />
                    </ListItemButton>
                </List>
            </Grid>}
            <Grid item xs>
                <List subheader={<ListSubheader sx={(theme) => ({ background: theme.palette.background.paper })}>Feed</ListSubheader>}>
                    {user && <SocialEntry />}
                </List>
                <Feed />
            </Grid>
            {user && <Grid item xs={isMobile ? 12 : 3}>
                <List subheader={<ListSubheader sx={(theme) => ({ background: theme.palette.background.paper })}>Favorites</ListSubheader>}>
                    {user.favorites.map((e, i) => <ListItemButton onClick={() => navigate(`anime/${e.id}`)}>
                        <ListItemAvatar sx={{ mr: 2 }}>
                            <img alt="Cover image" src={e.coverImage} className="anime-cover-image-list" />
                        </ListItemAvatar>
                        <ListItemText primary={e.title} key={e.id} />
                    </ListItemButton>)}
                </List>
            </Grid>}
        </Grid>
    </SafeArea>;
};