import { AppBar, Box, Fade, IconButton, Paper, Slider, Toolbar, Typography, useMediaQuery } from "@mui/material";
import * as Icons from '@mui/icons-material';
import ReactPlayer from "react-player";
import { useAppDispatch, useAppSelector } from "../../common/hooks";
import { miniturizePlayer, showPlayer } from "./playerSlice";
import { useNavigate } from "react-router-dom";
import { useCallback, useState } from "react";

interface Progress {
    played: number;
    playedSeconds: number;
    loaded: number;
    loadedSeconds: number;
}

function Player() {
    const navigate = useNavigate();
    const {
        active,
        mini,
        fullscreen,
        anime
    } = useAppSelector((state) => state.player);
    const isMobile = useMediaQuery('(max-width: 480px)');
    const dispatch = useAppDispatch();

    const [currentEpisode, setCurrentEpisode] = useState(0);
    const [playing, setPlaying] = useState(true);
    const [progress, setProgress] = useState<Progress | null>(null);
    const [duration, setDuration] = useState(0);

    const togglePlaying = useCallback(() => {
        setPlaying(!playing);
    }, [playing]);

    const onPlayerClose = useCallback(() => {
        dispatch(showPlayer(false));
        setPlaying(false);
    }, []);

    const onProgress = useCallback((state: Progress) => {
        console.log(state);
        setProgress(state);
    }, [progress]);

    const onDuration = useCallback((num: number) => setDuration(num), [duration]);

    return <Paper elevation={0} sx={(theme) => ({
        transition: theme.transitions.create(['all']),
        position: 'fixed',
        minWidth: mini ? 150 : '100vw',
        minHeight: mini ? 100 : '100vh',
        maxWidth: mini ? 150 : '100vw',
        maxHeight: mini ? 100 : '100vh',
        bottom: mini ? theme.spacing(2) : 0,
        right: mini ? theme.spacing(2) : 0,
        pointerEvents: active ? undefined : 'none',
        opacity: active ? 1 : 0,
        background: mini ? theme.palette.background.default : 'black',
        borderRadius: mini ? undefined : 0,
        zIndex: 6000,
        overflow: 'hidden',
        display: 'inline-flex',
        flexFlow: 'column wrap',
        '&:hover > .player-wrapper': {
            opacity: mini ? 0.2 : 1
        },
        '&:hover > .MuiToolbar-root': {
            opacity: 1
        }
    })}>
        <AppBar color="transparent" sx={{ boxShadow: 'none', opacity: mini ? 0 : undefined, pointerEvents: mini ? 'none' : undefined, display: mini ? 'none' : undefined }} position="relative">
            <Toolbar>
                <IconButton onClick={() => navigate(-1)} color="inherit" sx={(theme) => ({
                    marginLeft: theme.spacing(-1),
                    marginRight: isMobile ? theme.spacing(2) : theme.spacing(4)
                })} edge="start">
                    <Icons.ArrowBack />
                </IconButton>
                <Typography component="div" sx={(theme) => ({
                    marginRight: theme.spacing(2),
                })} variant="h6" noWrap>
                    {anime ? anime.title : "Player"}
                </Typography>
                <Fade in={Boolean(anime)}>
                    <Typography component="div" sx={(theme) => ({
                        marginRight: theme.spacing(2),
                        color: theme.palette.secondary.main
                    })} variant="h6" noWrap>
                        {anime ? `E${anime.episodes[currentEpisode].episode}: ${anime.episodes[currentEpisode].name}` : "Episode"}
                    </Typography>
                </Fade>
            </Toolbar>
        </AppBar>
        {mini && <Toolbar sx={{
            m: 'auto', position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 100,
            opacity: 0
        }}>
            <IconButton onClick={() => navigate('/watch')} color="inherit">
                <Icons.OpenInFull />
            </IconButton>
            <IconButton onClick={togglePlaying} color="inherit">
                {playing ? <Icons.Pause /> : <Icons.PlayArrow />}
            </IconButton>
            <IconButton onClick={onPlayerClose} color="inherit">
                <Icons.Close />
            </IconButton>
        </Toolbar>}
        <Box className="player-wrapper" sx={(theme) => ({
            transition: theme.transitions.create(['all']),
            flex: 1,
        })}>
            <Box sx={{ width: "inherit", position: "relative", '& > div': { position: 'absolute' } }}>
                <ReactPlayer
                    onDuration={onDuration}
                    volume={0.5}
                    onProgress={onProgress}
                    playing={playing}
                    className="react-player"
                    url={anime?.episodes[currentEpisode].src ?? undefined}
                    width="100%"
                    height="100%"
                    style={{ transform: mini ? 'scale(1.2)' : undefined, pointerEvents: mini ? 'none' : undefined }} />
            </Box>
        </Box>
        <AppBar color="transparent" sx={{ boxShadow: 'none', opacity: mini ? 0 : undefined, pointerEvents: mini ? 'none' : undefined, display: mini ? 'none' : undefined }} position="relative">
            <Toolbar>
                <IconButton onClick={togglePlaying} color="inherit" sx={(theme) => ({
                    marginLeft: theme.spacing(-1),
                    marginRight: isMobile ? theme.spacing(2) : theme.spacing(4)
                })} edge="start">
                    {playing ? <Icons.Pause /> : <Icons.PlayArrow />}
                </IconButton>
                <IconButton color="inherit" sx={(theme) => ({
                    marginRight: isMobile ? theme.spacing(2) : theme.spacing(4)
                })} edge="start">
                    <Icons.SkipNext />
                </IconButton>
                <Slider value={progress?.played} min={0} max={duration} />
                <IconButton color="inherit" sx={(theme) => ({
                    marginLeft: isMobile ? theme.spacing(2) : theme.spacing(4),
                })}>
                    <Icons.VideoLibrary />
                </IconButton>
                <IconButton color="inherit" sx={(theme) => ({
                    marginLeft: isMobile ? theme.spacing(2) : theme.spacing(4)
                })}>
                    <Icons.Settings />
                </IconButton>
            </Toolbar>
        </AppBar>
    </Paper>;
}

export default Player;