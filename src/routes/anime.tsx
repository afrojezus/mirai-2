import {
    Button,
    ButtonBase,
    CircularProgress,
    Divider,
    Fade,
    Grid,
    Icon,
    LinearProgress,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Tooltip,
    Typography,
    withStyles
} from '@material-ui/core';
import * as MICON from '@material-ui/icons';
import classnames from 'classnames';
import Kitsu from 'kitsu';
import {Palette, Swatch} from 'node-vibrant/lib/color';
import * as React from 'react';
import {connect} from 'react-redux';
import {firestoreConnect} from 'react-redux-firebase';
import {compose, Dispatch} from 'redux';
import Twist from 'src/api/twist';
import {MIR_PLAY_SHOW, MIR_SET_TITLE} from 'src/store/mutation-types';
import hue from 'src/utils/hue';
import globalStyles from '../globalStyles';

// Local MUI styles for the route.
const styles = (theme: any) => ({
    title: {
        fontWeight: 700
    },
    buttonMargin: {
        margin: `${theme.spacing.unit * 2}px 0`
    },
    coverImageSmall: {
        width: 181 / 2,
        height: 250 / 2
    },
    interactiveAreaBanner: {
        display: 'inline-flex',
        flexDirection: 'column'
    },
    infoItem: {
        padding: 0
    },
    infoItemIcon: {
        margin: 0
    },
    infoItemText: {padding: 0, paddingLeft: 8},
    list: {
        width: 181
    },
    listHide: {
        width: 0,
        height: 0,
        opacity: 0,
        overflow: 'hidden'
    },
    showMore: {
        // tslint:disable-next-line:no-string-literal
        transitions: theme.transitions.create['all'],
    },
    // ...load the global styles as well
    ...globalStyles(theme)
});

const defaultState = {
    data: null,
    episodes: null,
    loadingStream: false,
    LSMessage: '',
    w: false,
    error: false,
    showMore: null,
    animeAccentColor: '',
    animeAccentColorBG: '',
}

class Anime extends React.Component<any> {
    public state = defaultState;
    private kitsu: Kitsu = new Kitsu();
    private unlisten = this.props.history.listen((location: Location) => {
        const id = location.search.replace('?id=', '');
        const d: any = this.state.data;
        if (location.pathname === '/anime') {
            if (!d || id !== d.id) {
                return this.setState(defaultState, () =>
                    this.fetchData()
                );
            }
            return false;
        }
        return false;
    });

    constructor(props: any) {
        super(props);
        this.fetchData();
    }

    public componentWillUnmount() {
        // tslint:disable-next-line:no-unused-expression
        this.unlisten;
    }

    public fetchData = async () => {
        try {
            const {data}: any = await this.kitsu.get(
                `anime/${this.props.location.search.replace('?id=', '')}`,
                {
                    include: 'categories'
                }
            );
            const animeAccentColorPalette = data.coverImage ? await hue(data.coverImage.original) : null;
            const animeAccentColorSwatch = animeAccentColorPalette && (animeAccentColorPalette as Palette).LightVibrant;
            const animeAccentColorSwatchBG = animeAccentColorPalette && (animeAccentColorPalette as Palette).Muted;
            const animeAccentColor = animeAccentColorSwatch && (animeAccentColorSwatch as Swatch).getHex();
            const animeAccentColorBG = animeAccentColorSwatchBG && (animeAccentColorSwatchBG as Swatch).getHex();
            // tslint:disable-next-line:no-console
            console.log(data);
            this.setState({data, animeAccentColor, animeAccentColorBG});
        } catch (error) {
            // tslint:disable-next-line:no-console
            console.error(error);
            this.setState({error: true});
        }
    };
    public handleStream = async (shareStream: boolean) =>
        this.setState(
            {
                loadingStream: true,
                LSMessage: `Fetching ${
                    (this.state.data as any).showType === 'movie'
                        ? 'movie...'
                        : 'episodes...'
                    }`
            },
            async () => {
                if (shareStream) {
                    // Enable sharestream
                    return this.fetchEpisodes(
                        this.props.location.search.replace('?id=', ''),
                        true
                    );
                } else {
                    // Run locally
                    return this.fetchEpisodes(
                        this.props.location.search.replace('?id=', ''),
                        false
                    );
                }
            }
        );
    public fetchEpisodes = async (id: number, share: boolean) => {
        // const slug = this.props.location.state.anime.slug;
        try {
            const episodes = await Twist.loadEpisodeList(id);
            // tslint:disable-next-line:no-console
            console.log(episodes);
            if (!episodes) {
                throw new Error('Proxy failure');
            }
            return this.setState({episodes: episodes.reverse()}, () =>
                this.props
                    .sendDataToMir({
                        eps: this.state.episodes,
                        meta: this.state.data,
                        id
                    })
                    .then(() =>
                        this.setState({w: true}, () =>
                            setTimeout(
                                () =>
                                    this.props.history.push(
                                        `/watch?id=${id}${share ? '&share=true' : '&share=false'}`
                                    ),
                                300
                            )
                        )
                    )
            );
        } catch (error) {
            // tslint:disable-next-line:no-console
            console.error(error);
            this.setState(
                {LSMessage: 'An error occurred while fetching episodes :('},
                () => setTimeout(() => this.setState({loadingStream: false}), 5000)
            );
        }
    };

    public showMore = (e: any) => this.setState({showMore: e.currentTarget});
    public hideShowMore = () => this.setState({showMore: null});

    public switchAnime = (anime: any) => this.props.history.push(`/anime?id=${anime.id}`, {
        anime: anime.attributes
    })

    public render() {
        const {classes} = this.props;
        const {data, loadingStream, LSMessage, w, error, showMore, animeAccentColor, animeAccentColorBG} = this.state;
        if (data === null && error === false) {
            return (
                <LinearProgress color="primary" style={{width: '100%', height: 1}}/>
            );
        } else if (error) {
            return (
                <main
                    className="routeContainer"
                    style={{height: '100%', opacity: w ? 0 : 1, backgroundColor: 'red'}}
                >
                    <Grid
                        container={true}
                        className={classes.grid}
                        style={{height: '100%'}}
                    >
                        <div
                            className={classes.innerMargin}
                            style={{
                                margin: 'auto'
                            }}
                        >
                            <Typography variant="h2" style={{fontWeight: 700}}>
                                Woops.
                            </Typography>
                            <Typography variant="h5">
                                An error occurred, but it's nothing to worry about, just refresh.
                            </Typography>
                        </div>
                    </Grid>
                </main>
            );
        } else {
            const d: any = data;
            let status: string = '';
            let popularity: string = 'Not really known';
            switch (d.status) {
                case 'current':
                    status = 'Ongoing';
                    break;

                default:
                    break;
            }
            if (d.popularityRank > 2000) {
                popularity = 'Somewhat known';
            } else if (d.popularityRank > 1000) {
                popularity = 'Fairly known';
            } else if (d.popularityRank > 500) {
                popularity = 'Fairly popular';
            } else if (d.popularityRank > 0) {
                popularity = 'Quite popular';
            }
            return (
                <main
                    className="routeContainer"
                    style={{height: '100%', opacity: w ? 0 : 1}}
                >
                    <Grid
                        container={true}
                        className={classes.grid}
                        style={{height: '100%'}}
                    >
                        <img alt="" src="" className={classes.bannerImage}/>
                        <div
                            className={classes.innerMargin}
                            style={{
                                margin: 'auto'
                            }}
                        >
                            <img
                                src={d.coverImage ? d.coverImage.original : ''}
                                alt=""
                                className={classes.bannerImage}
                            />
                            <div className={classes.bannerColor} style={{backgroundColor: animeAccentColorBG as any}}/>
                            <Grid container={true}>
                                <Grid item={true} style={{marginRight: 32}}>
                                    <img
                                        src={d.posterImage.original}
                                        alt=""
                                        className={classnames(classes.coverImage)}
                                    />
                                    <List className={classnames(classes.list)} dense={true}>
                                        <ListItem className={classes.infoItem}>
                                            <ListItemIcon className={classes.infoItemIcon}>
                                                {d.showType === 'movie' ? (
                                                    <MICON.MovieOutlined/>
                                                ) : (
                                                    <MICON.TvOutlined/>
                                                )}
                                            </ListItemIcon>
                                            <ListItemText
                                                className={classes.infoItemText}
                                                primary={
                                                    d.showType === 'movie'
                                                        ? 'Movie'
                                                        : (d.episodeCount ? d.episodeCount : '???') + ' ' + 'Episodes'
                                                }
                                            />
                                        </ListItem>
                                        <Tooltip
                                            TransitionComponent={Fade}
                                            title={"A score that ranges from 100% (perfect) to 0% (horrible)."}
                                        >
                                            <ListItem className={classes.infoItem}>
                                                <ListItemIcon className={classes.infoItemIcon}>
                                                    <MICON.RateReviewOutlined/>
                                                </ListItemIcon>
                                                <ListItemText
                                                    className={classes.infoItemText}
                                                    primary={d.averageRating + '% Kitsu Score'}
                                                />
                                            </ListItem>
                                        </Tooltip>
                                        <ListItem className={classes.infoItem}>
                                            <ListItemIcon className={classes.infoItemIcon}>
                                                <MICON.StarBorderOutlined/>
                                            </ListItemIcon>
                                            <ListItemText
                                                className={classes.infoItemText}
                                                primary={popularity}
                                            />
                                        </ListItem>
                                        <Divider style={{marginTop: 10}}/>
                                        <ListItem className={classes.infoItem}>
                                            <ListItemIcon className={classes.infoItemIcon}>
                                                <Typography
                                                    style={{
                                                        margin: 'auto',
                                                        fontSize: 32,
                                                        fontWeight: 700,
                                                        paddingRight: 4
                                                    }}
                                                >
                                                    {d.ageRating}
                                                </Typography>
                                            </ListItemIcon>
                                            <ListItemText
                                                className={classes.infoItemText}
                                                primary={d.ageRatingGuide}
                                            />
                                        </ListItem>
                                        <Divider style={{marginBottom: 10}}/>
                                        {d.categories.map((category: any, index: number) => (
                                            <ListItem className={classes.infoItem} key={index}>
                                                <Tooltip
                                                    TransitionComponent={Fade}
                                                    title={category.description}
                                                >
                                                    <ListItemText
                                                        className={classes.infoItemText}
                                                        primary={category.title}
                                                        style={{whiteSpace: 'normal'}}
                                                    />
                                                </Tooltip>
                                            </ListItem>
                                        ))}
                                    </List>
                                </Grid>
                                <Grid
                                    item={true}
                                    xs={true}
                                    className={classes.interactiveAreaBanner}
                                >
                                    <Typography style={{
                                        fontWeight: 700,
                                        color: (animeAccentColor as any),
                                        textShadow: '0 0px 24px rgba(0,0,0,.1)'
                                    }} variant={'h2'}>
                                        {d.titles.en_jp ? d.titles.en_jp : d.titles.en_us}
                                    </Typography>
                                    <Typography style={{
                                        fontWeight: 700,
                                        color: (animeAccentColor as any),
                                        textShadow: '0 0px 24px rgba(0,0,0,.05)'
                                    }} variant={'h6'}>
                                        {d.titles.ja_jp}
                                    </Typography>
                                    <div className={classes.buttonMargin}/>
                                    <Typography>{d.synopsis}</Typography>
                                    <Divider className={classes.buttonMargin}/>

                                    <Grid container={true} spacing={8}>
                                        <Grid
                                            item={true}
                                            style={{
                                                padding: loadingStream ? undefined : 0,
                                                margin: loadingStream ? 'auto' : 0,
                                                opacity: loadingStream ? 1 : 0,
                                                width: loadingStream ? undefined : 0,
                                                overflow: 'hidden',
                                                height: loadingStream ? undefined : 0,
                                                display: 'inline-flex'
                                            }}
                                        >
                                            {LSMessage.startsWith('An error') ? (
                                                <Icon
                                                    color="error"
                                                    style={{margin: 'auto', marginRight: 8}}
                                                >
                                                    <MICON.ErrorOutlined/>
                                                </Icon>
                                            ) : (
                                                <CircularProgress
                                                    size={20}
                                                    style={{margin: 'auto', marginRight: 8, color: animeAccentColor}}
                                                />
                                            )}
                                            <Typography
                                                variant="subheading"
                                                color={
                                                    LSMessage.startsWith('An error') ? 'error' : 'primary'
                                                }
                                                style={{margin: 'auto', color: animeAccentColor}}
                                            >
                                                {LSMessage}
                                            </Typography>
                                        </Grid>
                                        <Grid
                                            item={true}
                                            style={{
                                                margin: 'auto',
                                                opacity: loadingStream ? 0 : 1,
                                                width: loadingStream ? 0 : undefined,
                                                pointerEvents: loadingStream ? 'none' : undefined
                                            }}
                                        >
                                            <Button
                                                onClick={this.handleStream.bind(this, false)}
                                                color="primary"
                                                variant="outlined"
                                                style={{color: animeAccentColor, borderColor: animeAccentColor}}
                                            >
                                                Stream
                                            </Button>
                                        </Grid>
                                        <Grid
                                            item={true}
                                            style={{
                                                margin: 'auto',
                                                opacity: loadingStream ? 0 : 1,
                                                width: loadingStream ? 0 : undefined,
                                                pointerEvents: loadingStream ? 'none' : undefined
                                            }}
                                        >
                                            <Button
                                                onClick={this.handleStream.bind(this, true)}
                                                variant="outlined"
                                            >
                                                ShareStream
                                            </Button>
                                        </Grid>
                                        <div style={{flex: 1}}/>
                                        <Grid
                                            item={true}
                                            style={{margin: 'auto', marginRight: 8}}
                                        >
                                            <Typography
                                                variant="subtitle1"
                                                style={{margin: 'auto'}}
                                            >
                                                {status}
                                            </Typography>
                                        </Grid>
                                        <Grid item={true} style={{margin: 'auto'}}>
                                            <Button style={{borderRadius: 50}} variant="outlined"
                                                    aria-owns={showMore ? 'anime-menu' : undefined}
                                                    aria-haspopup="true"
                                                    onClick={this.showMore}>
                                                <MICON.MoreHorizOutlined/>
                                            </Button>
                                        </Grid>
                                    </Grid>
                                    <Divider className={classes.buttonMargin}/>
                                    <Typography variant='title'>Franchise</Typography>
                                    <Grid container={true}>
                                        {d.related
                                            ? d.related.map((anime: any, index: number) => (
                                                <Fade in={true} key={index}>
                                                    <Grid item={true}>
                                                        <ButtonBase onClick={this.switchAnime.bind(this, anime)}>
                                                            {/*<img
                                                                    className={classes.coverImage}
                                                                    alt=""
                                                                    src={anime.attributes.posterImage.original}
                                                                />*/}
                                                            <Typography variant={'body1'}>{anime.role}</Typography>
                                                        </ButtonBase>
                                                    </Grid>
                                                </Fade>)) :
                                            <Typography variant='subtitle1' style={{opacity: 0.5}}>No anime found
                                                related to this one</Typography>}
                                    </Grid>
                                    <Divider className={classes.buttonMargin}/>
                                    <Typography variant='title'>Cast</Typography>
                                    <Grid container={true}>
                                        {d.casting
                                            ? d.casting.map((anime: any, index: number) => (
                                                <Fade in={true} key={index}>
                                                    <Grid item={true}>
                                                        <ButtonBase onClick={this.switchAnime.bind(this, anime)}>
                                                            {/* <img
                                                                    className={classes.coverImage}
                                                                    alt=""
                                                                    src={anime.attributes.posterImage.original}
                                                                />*/}
                                                            <Typography variant={'body1'}>{anime.role}</Typography>
                                                        </ButtonBase>
                                                    </Grid>
                                                </Fade>)) :
                                            <Typography variant='subtitle1' style={{opacity: 0.5}}>Either nobody
                                                made this, or it spawned outta nowhere.</Typography>}
                                    </Grid>
                                </Grid>
                            </Grid>
                        </div>
                    </Grid>
                    <Menu
                        id="anime-menu"
                        anchorEl={showMore}
                        open={Boolean(showMore)}
                        onClose={this.hideShowMore}
                        classes={{paper: classes.showMenu}}
                        MenuListProps={{
                            disablePadding: true
                        }}
                    >

                        <MenuItem>Kitsu</MenuItem>

                    </Menu>
                </main>
            );
        }
    }
}

export const updateMirTitle = (title: string) => ({
    type: MIR_SET_TITLE,
    title
});

export const loadPlayer = (play: any) => ({
    type: MIR_PLAY_SHOW,
    play
});

const mapPTS = (dispatch: Dispatch) => ({
    sendTitleToMir: (title: string) => dispatch(updateMirTitle(title)),
    sendDataToMir: async (play: any) => dispatch(loadPlayer(play))
});

export default compose(
    firestoreConnect()(
        connect(
            ({mir}: any) => ({
                mir
            }),
            mapPTS
        )(withStyles(styles as any)(Anime))
    )
);
