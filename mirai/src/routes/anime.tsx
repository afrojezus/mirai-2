import React from 'react';
import {
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Paper,
  Theme,
  Toolbar,
  Tooltip,
  Typography,
  withStyles
} from '@material-ui/core';
import {ExpandMore} from "@material-ui/icons";
import globalStyles, {realNearBoxShadow} from '../globalStyles';
import Player from 'components/player';
import {Attributes, Status} from "../api/kitsu";
import Twist, {TwistEpisodeItem} from "../api/twist";

const styles = (theme: Theme) => ({
    bg: {
        position: 'absolute',
        left: 0,
        top: 0,
        zIndex: -1,
        objectFit: 'cover',
        width: '100%',
        filter: 'blur(0px)',
        transform: 'scale(1)',
        opacity: 0.1,
        animation: 'BgIntro 0.4s ease'
    },
    posterImage: {
        width: 200
    },
    animeBlock: {
        marginTop: theme.spacing(0),
        animation: 'SplashPaperIntro 1s ease',
        boxShadow: realNearBoxShadow,
        borderRadius: 0
    },
    bgTitle: {
        fontWeight: 700,
        position: 'fixed',
        fontSize: 256,
        left: '1%',
        top: '5%',
        color: theme.palette.background.default,
        zIndex: -1,
        animation: 'SplashPaperIntroText 1s ease'
    },
    _ageRating: {
        fontWeight: 700,
        border: `2px solid ${theme.palette.text.hint}`,
        padding: '0 16px',
        borderRadius: 4,
        fontSize: 20
    },
    _averageRating: {
        fontWeight: 700,
        margin: "0 16px",
        fontSize: 22,
        color: theme.palette.primary.main
    },
    ...globalStyles(theme)
});

class Anime extends React.Component<any> {
    state = {
        episodes: null,
        id: 0
    };

    constructor(props: any) {
        super(props);
        this.getTwistEpisodes();
    }

    getTwistEpisodes = async () => {
        const id = this.props.location.state.kitsuId;
        try {
            const episodes = await new Twist().get(id);
            episodes && this.setState({episodes: episodes.items, id});
        } catch (e) {
            console.error(`[Mirai] ${e}`);
        }
    }

    churnDateToYear = (date: Date) => new Date(date).getFullYear();

    public render() {
        const {episodes, id} = this.state;
        const {classes, location} = this.props;
        const state = location.state;
        const anime: Attributes = state.anime;

        let status: string = "";

        switch (anime.status) {
            case Status.Current:
                status = "Ongoing";
                break;
            case Status.Finished:
                status = "";
                break;
            default:
                break;
        }

        return (
            <div className={classes.MainContainer}>
                <img alt="" className={classes.bg} src={anime.coverImage ? anime.coverImage.large : ""}/>
                <Toolbar disableGutters className={classes.largeToolbar}>
                    <div style={{flex: 1}}/>
                    <div style={{flex: 1}}/>
                </Toolbar>

                <Typography variant="h1" className={classes.bgTitle}>
                    {anime.titles.en_jp}
                </Typography>

                <Paper elevation={24} className={classes.animeBlock}>
                    <Player src=""/>
                    <Grid container>
                        <Grid item>
                            <img
                                alt=""
                                src={anime.posterImage.large}
                                className={classes.posterImage}
                            />
                            <List>
                                <ListSubheader>Airing date</ListSubheader>
                                <ListItem>
                                    <ListItemText
                                        secondary={anime.endDate && 'Ended ' + new Date(anime.endDate).toDateString()}
                                        primary={new Date(anime.startDate).toDateString()}></ListItemText>
                                </ListItem>
                            </List>
                        </Grid>
                        <Grid item xs>
                            <Toolbar>
                                <div>
                                    <Typography variant="h5" style={{fontWeight: 700}}>
                                        {anime.titles.en_jp}
                                    </Typography>
                                    <Typography style={{fontWeight: 700, opacity: 0.5}}>
                                        {anime.subtype} {this.churnDateToYear(anime.startDate)}
                                    </Typography>
                                </div>
                                <div style={{flex: 1}}/>
                                <Tooltip title="Average rating of this anime">
                                    <div>
                                        <Typography
                                            className={classes._averageRating}>{anime.averageRating}%</Typography>
                                    </div>
                                </Tooltip>
                                <Tooltip title={anime.ageRatingGuide}><Typography
                                    className={classes._ageRating}>{anime.ageRating}</Typography></Tooltip>
                                {status !== "" &&
                                <Typography style={{marginLeft: 16, fontWeight: 600}}>{status}</Typography>}
                            </Toolbar>
                            <ExpansionPanel defaultExpanded>
                                <ExpansionPanelSummary
                                    expandIcon={<ExpandMore/>}>
                                    <Typography style={{flexBasis: '33.33%', flexShrink: 0}}>
                                        Episodes
                                    </Typography>
                                    <Typography color='primary'>
                                        Current Episode
                                    </Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails style={{maxHeight: 500, overflow: 'auto'}}>
                                    <List style={{width: '100%'}}>
                                        {episodes && (episodes as any).map((e: TwistEpisodeItem, i: number) =>
                                            <ListItem button key={i}>
                                                <ListItemText primary={"Episode " + e["episode:number"]}
                                                              secondary='Sample Text'></ListItemText>
                                            </ListItem>)}
                                    </List>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                            <ExpansionPanel>
                                <ExpansionPanelSummary
                                    expandIcon={<ExpandMore/>}>
                                    <Typography>
                                        Synopsis
                                    </Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    {anime.synopsis}
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                        </Grid>
                    </Grid>
                </Paper>
            </div>
        );
    }
}

export default withStyles(styles as any)(Anime);
