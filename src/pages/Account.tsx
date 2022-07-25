import { Avatar, Container, Grid, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, ListSubheader, Stack, Toolbar, Typography, useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Hero from "../common/components/Hero";
import SafeArea from "../common/components/SafeArea";
import { useAppSelector } from "../common/hooks";
import Feed from "../features/feed/Feed";

export default () => {
    const isMobile = useMediaQuery('(max-width: 480px)');
    const navigate = useNavigate();
    const user = useAppSelector((state) => state.layout.user);
    if (!user) {
        return <SafeArea>
            <Hero>
                <Typography variant="h3">Become a part of Mirai today</Typography>
                <Typography variant="subtitle1">Log back in or sign up here</Typography>
            </Hero>
        </SafeArea>;
    }
    return <SafeArea top={
        <Hero mounted row colorRich>
            <Avatar sx={(theme) => ({
                height: theme.spacing(16),
                width: theme.spacing(16)
            })} src={user.avatar} alt="U" />
            <Stack sx={{ my: 'auto', mx: 4 }}>
                <Typography variant="h3">{user.name}</Typography>
                <Typography variant="subtitle1">{user.email}</Typography>
            </Stack>
        </Hero>
    }>
        <Grid container spacing={2} sx={{ px: 2 }}>
            <Grid item xs={isMobile ? 'auto' : 3}>
                <List subheader={
                    <ListSubheader sx={(theme) => ({ background: theme.palette.background.paper })}>
                        Info
                    </ListSubheader>}>
                    <ListItem>
                        <ListItemText primary="9000 hours" secondary="spent on watching anime" />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="5 years" secondary="spent on reading manga" />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Summary" secondary={"bla bla bla bla bla bla bla bla bla bla bla bla"} />
                    </ListItem>
                    <List subheader={
                        <ListSubheader sx={(theme) => ({ background: theme.palette.background.paper })}>
                            Favorites
                        </ListSubheader>
                    }>
                        {user.favorites.map((e, i) => <ListItemButton onClick={() => navigate(`/anime/${e.id}`)}>
                            <ListItemAvatar sx={{ mr: 2 }}>
                                <img alt="Cover image" src={e.coverImage} className="anime-cover-image-list" />
                            </ListItemAvatar>
                            <ListItemText primary={e.title} key={e.id} />
                        </ListItemButton>)}
                    </List>
                    <List subheader={
                        <ListSubheader sx={(theme) => ({ background: theme.palette.background.paper })}>
                            Favorite genres
                        </ListSubheader>
                    }>
                        {user.favorites.map((e, i) => <ListItemButton onClick={() => navigate(`/anime/${e.id}`)}>
                            <ListItemAvatar sx={{ mr: 2 }}>
                                <img alt="Cover image" src={e.coverImage} className="anime-cover-image-list" />
                            </ListItemAvatar>
                            <ListItemText primary={e.title} key={e.id} />
                        </ListItemButton>)}
                    </List>
                    <List subheader={
                        <ListSubheader sx={(theme) => ({ background: theme.palette.background.paper })}>
                            Favorite characters
                        </ListSubheader>
                    }>
                        {user.favorites.map((e, i) => <ListItemButton onClick={() => navigate(`/anime/${e.id}`)}>
                            <ListItemAvatar sx={{ mr: 2 }}>
                                <img alt="Cover image" src={e.coverImage} className="anime-cover-image-list" />
                            </ListItemAvatar>
                            <ListItemText primary={e.title} key={e.id} />
                        </ListItemButton>)}
                    </List>
                    <List subheader={
                        <ListSubheader sx={(theme) => ({ background: theme.palette.background.paper })}>
                            Favorite staff
                        </ListSubheader>
                    }>
                        {user.favorites.map((e, i) => <ListItemButton onClick={() => navigate(`/anime/${e.id}`)}>
                            <ListItemAvatar sx={{ mr: 2 }}>
                                <img alt="Cover image" src={e.coverImage} className="anime-cover-image-list" />
                            </ListItemAvatar>
                            <ListItemText primary={e.title} key={e.id} />
                        </ListItemButton>)}
                    </List>
                    <List subheader={
                        <ListSubheader sx={(theme) => ({ background: theme.palette.background.paper })}>
                            Favorite studios
                        </ListSubheader>
                    }>
                        {user.favorites.map((e, i) => <ListItemButton onClick={() => navigate(`/anime/${e.id}`)}>
                            <ListItemAvatar sx={{ mr: 2 }}>
                                <img alt="Cover image" src={e.coverImage} className="anime-cover-image-list" />
                            </ListItemAvatar>
                            <ListItemText primary={e.title} key={e.id} />
                        </ListItemButton>)}
                    </List>
                </List>
            </Grid>
            <Grid item xs>
                <Feed title={"Feed & Activity"} filter={(post => post.author.id === user.id)} />
            </Grid>
        </Grid>
    </SafeArea>;
};