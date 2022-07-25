import { Button, ButtonBase, Grid, IconButton, List, ListSubheader, Paper, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import * as Icons from '@mui/icons-material';
import { useNavigate, useParams } from "react-router-dom";
import FilledButton from "../common/components/FilledButton";
import Hero from "../common/components/Hero";
import SafeArea from "../common/components/SafeArea";
import { Anime } from "../common/utils/model";
import { loadAnime } from "../features/player/playerSlice";
import { useAppDispatch, useAppSelector } from "../common/hooks";
import sampleVideo from '../assets/sample.mp4';

const animes: Anime[] = [
    {
        id: 1000,
        title: 'Cory In The House',
        description: 'Cory is a very cool kid who lives in the white house',
        coverImage: 'https://resizing.flixster.com/SM_Y6uCQopZUKdYZlF0YEoHDPZw=/206x305/v2/https://flxt.tmsimg.com/assets/p186164_b_v7_aa.jpg',
        trailer: 'https://www.youtube.com/watch?v=aaxcziAOnTU',
        genre: ['Shonen'],
        episodes: [
            {
                id: 0,
                anime: 1000,
                name: 'Brand new start',
                description: 'Cory moves into the white house or something',
                episode: 1,
                src: sampleVideo
            }
        ]
    },
    {
        id: 2000,
        title: 'Some other anime',
        description: 'Bla bla bla',
        coverImage: 'https://resizing.flixster.com/SM_Y6uCQopZUKdYZlF0YEoHDPZw=/206x305/v2/https://flxt.tmsimg.com/assets/p186164_b_v7_aa.jpg',
        trailer: 'https://www.youtube.com/watch?v=aaxcziAOnTU',
        genre: ['Shonen'],
        episodes: [
            {
                id: 0,
                anime: 2000,
                name: 'Brand new start',
                description: 'Cory moves into the white house or something',
                episode: 1,
                src: 'https://www.youtube.com/watch?v=Qa-7RSearp4'
            }
        ]
    }
];

export default () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    let params = useParams();
    const [anime, setAnime] = useState<Anime | undefined>();
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (params && params.id) {
                    const { id } = params;
                    setAnime(animes.find(a => a.id === parseInt(id)));
                }
            } catch (error) {
                // ignore
            }
        };
        fetchData();
    }, []);

    if (!anime) {
        return <SafeArea>
            <Stack sx={{ m: 'auto' }}>
                <Typography>{"T.T"}</Typography>
                <Typography>I tried looking for what you wanted, but I couldn't find it!</Typography>
            </Stack>
        </SafeArea>;
    }

    const onWatch = async () => {
        dispatch(loadAnime(anime));
        navigate('watch');
    };

    return <SafeArea top={
        <Hero row mounted colorRich>
            <Stack sx={(theme) => ({
                mr: 4
            })}>
                <ButtonBase onClick={onWatch} sx={(theme) => ({
                    borderRadius: 1,
                    overflow: 'hidden',
                    '& > img': {
                        width: 200
                    },
                })}>
                    <IconButton component="div" color="inherit" sx={(theme) => ({
                        position: 'absolute',
                        p: 2,
                        background: theme.palette.primary.main,
                        pointerEvents: 'none',
                        borderRadius: 1
                    })}><Icons.PlayArrow sx={(theme) => ({
                        color: theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.dark
                    })} /></IconButton>
                    <img draggable={false} alt="Cover image" src={anime.coverImage} />
                </ButtonBase>
                <FilledButton bsx={(theme) => ({
                    mt: 2
                })}>Livestream this</FilledButton>
            </Stack>
            <Stack>
                <Typography variant="h3">{anime.title}</Typography>
                <Typography variant="subtitle1">{anime.description}</Typography>
            </Stack>
        </Hero>
    }>
        <Grid container spacing={2} sx={{ px: 2 }}>
            <Grid item xs={3}>
                <List subheader={
                    <ListSubheader sx={(theme) => ({ background: theme.palette.background.paper })}>
                        Info
                    </ListSubheader>}>
                </List>
            </Grid>
            <Grid item xs>
                <List subheader={
                    <ListSubheader sx={(theme) => ({ background: theme.palette.background.paper })}>
                        Related
                    </ListSubheader>}>
                </List>
            </Grid>
        </Grid>
    </SafeArea>;
};