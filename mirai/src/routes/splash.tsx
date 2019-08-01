import React from "react";
import {
    Avatar,
    Button,
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Fab,
    Fade,
    FormControlLabel,
    FormGroup,
    Grid,
    GridList,
    GridListTile,
    GridListTileBar,
    LinearProgress,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    ListSubheader,
    MenuItem,
    Modal,
    Paper,
    Radio,
    RadioGroup,
    Snackbar,
    TextField,
    Theme,
    Toolbar,
    Typography,
    withStyles
} from "@material-ui/core";
import Imgur from "imgur-v2";
import globalStyles, {realBoxShadow, realHoverBoxShadow} from "../globalStyles";
import {Edit} from "@material-ui/icons";
import ava_example from "../assets/avatar.gif";
import anilist_logo from '../assets/anilist.png';
import FeedFactory from "components/FeedFactory";
import colorizer from "utils/colorizer";
import {IMGUR_API} from "utils/supersecretkeys";
import Carousel from "components/Carousel";
import * as firebase from "firebase";
import {User} from "firebase";
import {Data} from "../api/kitsu";
// TODO: Implement a more safe approach to customization
const tileData = [
    {
        img:
            "https://cdn.discordapp.com/attachments/400695134016110592/604338334986141716/original_drawn_by_fukahire_ruinon__8d3073e9f2c724cd4c829e03edefa1a4.png",
        title: "OC",
        author: "Fukahire Ruinon"
    },
    {
        img:
            "https://cdn.discordapp.com/attachments/400695134016110592/604338551936778276/original_drawn_by_shion_mirudakemann__0a18eb0ad4ee5d61c78d34fe7eb351cc.png",
        title: "OC",
        author: "Shion Mirudakemann"
    },
    {
        img:
            "https://cdn.discordapp.com/attachments/400695134016110592/604413905304944650/Konachan.com_-_286303_bicycle_bike_shorts_kukka_original_ponytail_see_through_short_hair_shorts.jpg",
        title: "ジュライドライ",
        author: "くっか"
    },
    {
        img: "https://cdn.discordapp.com/attachments/400695134016110592/603820135131643904/image0.jpg",
        title: "Neko Fish",
        author: "Unknown"
    }
];

const styles = (theme: Theme) => ({
    bigTitle: {
        fontWeight: 700,
        marginRight: theme.spacing(0),
        fontFamily: `Raleway, 'sans-serif'`,
        letterSpacing: 3
    },
    SplashContainer: {
        marginTop: theme.spacing(8),
        marginBottom: theme.spacing(8)
    },
    _carouselContainer: {
        marginLeft: "auto",
        marginRight: "auto",
        maxWidth: 800 + 400 + 400 + theme.spacing(4),
        width: 800 + 400 + 400 + theme.spacing(4)
    },
    SplashArea: {
        display: "inline-flex",
        marginLeft: "auto",
        marginRight: "auto"
    },
    SplashLeftSideContext: {
        marginLeft: "auto",
        marginRight: theme.spacing(2),
        maxWidth: 400,
        width: 400
        //marginTop: theme.spacing(8)
    },
    SplashRightSideContext: {
        marginLeft: theme.spacing(2),
        marginRight: "auto",
        maxWidth: 400,
        width: 400
        //marginTop: theme.spacing(8)
    },
    SplashContext: {
        marginLeft: theme.spacing(0),
        marginRight: theme.spacing(0),
        maxWidth: 800,
        width: 800
        //marginTop: theme.spacing(8)
    },
    SplashPaper: {
        boxShadow: realBoxShadow,
        borderRadius: 0,
        minHeight: 50,
        minWidth: 600,
        overflow: "hidden",
        animation: "SplashPaperIntro 0.4s ease",
        backdropFilter: "blur(10px)",
        background: "rgba(255,255,255,.1)"
    },
    SplashPaperPadding: {
        padding: theme.spacing(1)
    },
    splashButton: {
        marginLeft: theme.spacing(0),
        marginRight: theme.spacing(0)
    },
    SplashAnimeButton: {
        flexDirection: "column",
        margin: "auto",
        padding: theme.spacing(2),
        "&:hover": {
            backdropFilter: "blur(10px)",
            boxShadow: realHoverBoxShadow,
            background: "rgba(255,255,255,0.5)"
        }
    },
    SplashAnimeGrid: {
        boxShadow: 0
    },
    SplashAnimeCover: {
        height: 70,
        width: 70,
        borderRadius: 50,
        overflow: "hidden",
        boxShadow: 0,
        background: "rgba(0,0,0,.1)",
        "&:hover": {
            boxShadow: realHoverBoxShadow
        }
    },
    SplashAnimeCoverImage: {
        height: "100%",
        width: "100%",
        objectFit: "cover"
    },
    SplashAnimeTitle: {
        fontSize: 11,
        fontWeight: 600,
        paddingTop: 8
    },
    SplashPaperInput: {
        marginLeft: 8,
        flex: 1,
        width: "calc(100% - 8px)"
    },
    fab: {},
    SplashFooter: {
        position: "fixed",
        bottom: 0,
        width: '100%'
    },
    SplashCard: {
        maxWidth: 400
    },
    SplashCardMedia: {
        height: 140
    },
    bgChangeLoadOverlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        height: "100vh",
        width: "100%",
        zIndex: 10000000000000,
        background: "rgba(0,0,0,.6)",
        display: "flex",
        flexDirection: "column"
    },
    customMenuRoot: {
        width: 500
    },
    customGridList: {},
    customGridListIcon: {
        color: "rgba(255, 255, 255, 0.54)"
    },
    ...globalStyles(theme)
});

class Splash extends React.Component<any> {
    state = {
        trending: [],
        notificationsShow: false,
        moreMenu: false,
        moreMenuEl: null,
        bg: localStorage.getItem("bg_url") ? localStorage.getItem("bg_url") : "",
        bgChange: false,
        bgChangeLoading: false,
        bgMenuAnchorEl: null,
        user: (firebase.auth().currentUser as User)
    };

    constructor(props: any) {
        super(props);
        Imgur.setClientId(IMGUR_API.clientId);
        Imgur.setAPIUrl("https://api.imgur.com/3/");
        this.fetchData();
        this.getAccentFromBG(false);
    }

    public getAccentFromBG = async (_bgWillChange: boolean) => {
        try {
            if (!_bgWillChange) return this.setState({bgChange: false});
            else {
                this.setState({bgChangeLoading: true}, async () => {
                    console.log(`[Colorizer] Changing accent colors to new background.`);
                    const pal = await colorizer(this.state.bg as string);
                    localStorage.setItem("bg_accent", JSON.stringify(pal));
                    this.setState({bgChange: true, bgChangeLoading: false});
                });
            }
        } catch (error) {
            console.error(`[Colorizer] ${error}`);
        }
    };

    public fetchData = async () => {
        try {
            const {data}: any = await fetch(
                "https://kitsu.io/api/edge/trending/anime",
                {
                    headers: {
                        Accept: "application/vnd.api+json",
                        "Content-Type": "application/vnd.api+json"
                    }
                }
            ).then((response: Response) => response.json());
            // tslint:disable-next-line:no-console
            // console.log(data);
            this.setState({trending: data})
        } catch (error) {
            // tslint:disable-next-line:no-console
            // console.error(error);
        }
    };

    public goToAnime = (anime: Data) => {
        if (anime.attributes)
            this.props.history.push(`/anime?id=${anime.id}`, {
                anime: anime.attributes,
                kitsuId: anime.id
            });
        else
            return null;
    };

    toggleNotifications = () =>
        this.setState({notificationsShow: !this.state.notificationsShow});

    toggleMoreMenu = (el: any) =>
        this.setState({moreMenu: !this.state.moreMenu, moreMenuEl: el.target});

    handleBackgroundChange = async (e: any) => {
        let selectedFile = e.target.files[0];
        if (!selectedFile) return;

        const reader = new FileReader();
        reader.onloadend = async () => {
            try {
                const json = await Imgur.uploadBase64(reader.result);
                json &&
                this.setState({bg: json.data.link}, () =>
                    this.getAccentFromBG(true)
                );
            } catch (error) {
                console.error(`[Imgur] ${error}`);
            }
        };
        reader.readAsDataURL(selectedFile);
    };

    handleBGMenu = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
        this.setState({bgMenuAnchorEl: e.currentTarget});

    handleBGURLChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({bg: e.target.value});
    };

    restoreBG = () => {
        localStorage.removeItem("bg_url");
        localStorage.removeItem("bg_accent");
        this.setState({bg: ""});
        window.location.reload();
    };

    setBGFromURL = () => {
        localStorage.setItem("bg_url", this.state.bg as string);
        this.getAccentFromBG(true);
    };

    handleThemeChange = (event: React.ChangeEvent<unknown>) => {
        let value = (event.target as HTMLInputElement).value;
        localStorage.setItem("theme_color", value);
        window.location.reload();
    };

    handleSignOut = async () => {
        try {
            if (this.state.user.isAnonymous) {
                (firebase.auth().currentUser as User).delete().then(() => {
                    localStorage.clear();
                    window.location.reload();
                });
            }
        } catch (error) {
            console.error(`[Auth] ${error}`)
        }
    };

    public render() {
        const {
            trending,
            bg,
            bgChange,
            bgChangeLoading,
            bgMenuAnchorEl,
            user
        } = this.state;
        const {classes} = this.props;
        return (
            <div className={classes.SplashContainer}>
                <div
                    style={{display: bgChangeLoading ? "flex" : "none"}}
                    className={classes.bgChangeLoadOverlay}
                >
                    <div style={{flex: 1, margin: "auto", maxHeight: 0}}>
                        <Typography variant="h4" style={{margin: 8, marginLeft: 0}}>
                            Keep calm, we're adding new flavors to Mirai with your new
                            background
                        </Typography>
                        <LinearProgress/>
                    </div>
                </div>
                <Snackbar
                    open={bgChange}
                    autoHideDuration={6000}
                    onClose={() => this.setState({bgChange: false})}
                    message={<span>Accent color changed! Reload to see changes.</span>}
                    action={[
                        <Button
                            onClick={() => window.location.reload(false)}
                            color="primary"
                        >
                            Reload
                        </Button>
                    ]}
                />
                {bg && <img src={bg} alt="" className={classes.containerBgImg}/>}
                <div className={classes._carouselContainer}>
                    <Toolbar disableGutters>
                        <Typography
                            variant="subtitle1"
                            style={{
                                color:
                                    (window as any).theme.palette.type === "dark"
                                        ? "rgba(255,255,255,.5)"
                                        : "rgba(0,0,0,.5)",
                                padding: "0 16px 0 0"
                            }}
                        >
                            Currently trending anime
                        </Typography>
                        <div
                            style={{
                                flex: 1,
                                borderBottom: `1px solid ${
                                    (window as any).theme.palette.type === "dark"
                                        ? "rgba(255,255,255,.3)"
                                        : "rgba(0,0,0,.3)"
                                }`
                            }}
                        />
                    </Toolbar>
                    {trending.length > 0 ? <Carousel items={trending} click={this.goToAnime.bind(this)}/> :
                        <div style={{display: 'flex'}}><Paper elevation={0} style={{
                            height: 200,
                            width: '100%',
                            opacity: 0.5,
                            borderRadius: 0,
                            animation: 'SplashPaperIntroFade 0.4s ease'
                        }}/><Paper elevation={0} style={{
                            height: 200,
                            width: '100%',
                            opacity: 0.5,
                            borderRadius: 0,
                            animation: 'SplashPaperIntroFadeMore 0.5s ease'
                        }}/><Paper elevation={0} style={{
                            height: 200,
                            width: '100%',
                            opacity: 0.5,
                            borderRadius: 0,
                            animation: 'SplashPaperIntroFadeFar 0.6s ease'
                        }}/></div>}
                </div>
                <Grid container className={classes.SplashArea}>
                    <Grid item className={classes.SplashLeftSideContext}>
                        <Toolbar disableGutters>
                            <Typography
                                variant="subtitle1"
                                style={{
                                    color:
                                        (window as any).theme.palette.type === "dark"
                                            ? "rgba(255,255,255,.5)"
                                            : "rgba(0,0,0,.5)",
                                    padding: "0 16px 0 0"
                                }}
                            >
                                You
                            </Typography>
                            <div
                                style={{
                                    flex: 1,
                                    borderBottom: `1px solid ${
                                        (window as any).theme.palette.type === "dark"
                                            ? "rgba(255,255,255,.3)"
                                            : "rgba(0,0,0,.3)"
                                    }`
                                }}
                            />
                        </Toolbar>
                        <Card className={classes.SplashCard}>
                            <CardActionArea>
                                <CardMedia
                                    className={classes.SplashCardMedia}
                                    image={ava_example}
                                    title="This is you. Amazing, aren't you?"
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h5">
                                        {user.isAnonymous ? "Anon" : user.displayName}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {user.isAnonymous ? "Anonymous User" : user.email}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                            <List>
                                <ListSubheader>Shortcuts</ListSubheader>
                                <ListItem button>
                                    <ListItemText primary="History"/>
                                </ListItem>
                                <ListItem button>
                                    <ListItemText primary="Favorites"/>
                                </ListItem>
                                <ListItem button>
                                    <ListItemText primary="Account Settings"/>
                                </ListItem>
                                <ListItem button onClick={this.handleSignOut}>
                                    <ListItemText
                                        primary={user.isAnonymous ? "Delete account" : "Log out"}
                                        style={{color: "#f0a0a0"}}
                                    />
                                </ListItem>
                            </List>
                        </Card>
                    </Grid>
                    <Grid item className={classes.SplashContext}>
                        <Toolbar disableGutters>
                            <Typography
                                variant="subtitle1"
                                style={{
                                    color:
                                        (window as any).theme.palette.type === "dark"
                                            ? "rgba(255,255,255,.5)"
                                            : "rgba(0,0,0,.5)",
                                    padding: "0 16px 0 0"
                                }}
                            >
                                Social
                            </Typography>
                            <div
                                style={{
                                    flex: 1,
                                    borderBottom: `1px solid ${
                                        (window as any).theme.palette.type === "dark"
                                            ? "rgba(255,255,255,.3)"
                                            : "rgba(0,0,0,.3)"
                                    }`
                                }}
                            />
                        </Toolbar>
                        <FeedFactory/>
                    </Grid>
                    <Grid item className={classes.SplashRightSideContext}>
                        <Toolbar disableGutters>
                            <Typography
                                variant="subtitle1"
                                style={{
                                    color:
                                        (window as any).theme.palette.type === "dark"
                                            ? "rgba(255,255,255,.5)"
                                            : "rgba(0,0,0,.5)",
                                    padding: "0 16px 0 0"
                                }}
                            >
                                Friends
                            </Typography>
                            <div
                                style={{
                                    flex: 1,
                                    borderBottom: `1px solid ${
                                        (window as any).theme.palette.type === "dark"
                                            ? "rgba(255,255,255,.3)"
                                            : "rgba(0,0,0,.3)"
                                    }`
                                }}
                            />
                        </Toolbar>
                        <Card className={classes.SplashCard}>
                            <CardContent>
                                <Typography gutterBottom variant="h5">
                                    {/* TODO: Add friend counter */}
                                    {user.isAnonymous ? "Anonymous users can't have friends." : "0 Friends"}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {user.isAnonymous ? "Consider signing up for friends." : "None of them are online right now"}
                                </Typography>
                            </CardContent>
                        </Card>
                        {user.isAnonymous ? undefined : <Card style={{marginTop: 16}} className={classes.SplashCard}>
                            <List style={{padding: 0}}>
                                <ListItem button>
                                    <ListItemAvatar>
                                        <Avatar src={ava_example}/>
                                    </ListItemAvatar>
                                    <ListItemText primary="Friend"/>
                                </ListItem>
                                <ListItem button>
                                    <ListItemAvatar>
                                        <Avatar src={ava_example}/>
                                    </ListItemAvatar>
                                    <ListItemText primary="Friend"/>
                                </ListItem>
                            </List>
                        </Card>}
                        <Card
                            style={{marginTop: 16, background: "#95A6FD"}}
                            className={classes.SplashCard}
                        >
                            <CardActionArea style={{display: "flex"}}>
                                <CardMedia
                                    style={{width: 64, height: 64}}
                                    image="https://i.imgur.com/BNIn6uj.png"
                                />
                                <div style={{display: "flex", flexDirection: "column"}}>
                                    <CardContent style={{flex: "1 0 auto"}}>
                                        <Typography gutterBottom variant="h6" style={{color: 'white'}}>
                                            Connect Mirai to Discord
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" style={{color: 'white'}}>
                                            Show what you're watching to your friends
                                        </Typography>
                                    </CardContent>
                                </div>
                            </CardActionArea>
                        </Card>
                        <Card
                            style={{marginTop: 16, background: "#2E51A2"}}
                            className={classes.SplashCard}
                        >
                            <CardActionArea style={{display: "flex"}}>
                                <CardMedia
                                    style={{width: 64, height: 64}}
                                    image="https://image.myanimelist.net/ui/OK6W_koKDTOqqqLDbIoPAiC8a86sHufn_jOI-JGtoCQ"
                                />
                                <div style={{display: "flex", flexDirection: "column"}}>
                                    <CardContent style={{flex: "1 0 auto"}}>
                                        <Typography gutterBottom variant="h6" style={{color: 'white'}}>
                                            Connect Mirai to MyAnimeList
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" style={{color: 'white'}}>
                                            Watch here, track there, automatically
                                        </Typography>
                                    </CardContent>
                                </div>
                            </CardActionArea>
                        </Card>
                        <Card
                            style={{marginTop: 16, background: "#402F3F"}}
                            className={classes.SplashCard}
                        >
                            <CardActionArea style={{display: "flex"}}>
                                <CardMedia
                                    style={{width: 64, height: 64}}
                                    image="data:image/jpeg;base64,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"
                                />
                                <div style={{display: "flex", flexDirection: "column"}}>
                                    <CardContent style={{flex: "1 0 auto"}}>
                                        <Typography gutterBottom variant="h6" style={{color: 'white'}}>
                                            Connect Mirai to Kitsu
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" style={{color: 'white'}}>
                                            Watch here, track there, automatically
                                        </Typography>
                                    </CardContent>
                                </div>
                            </CardActionArea>
                        </Card>
                        <Card
                            style={{marginTop: 16, background: "#121923"}}
                            className={classes.SplashCard}
                        >
                            <CardActionArea style={{display: "flex"}}>
                                <CardMedia
                                    style={{width: 64, height: 64}}
                                    image={anilist_logo}
                                />
                                <div style={{display: "flex", flexDirection: "column"}}>
                                    <CardContent style={{flex: "1 0 auto"}}>
                                        <Typography gutterBottom variant="h6" style={{color: 'white'}}>
                                            Connect Mirai to AniList
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" style={{color: 'white'}}>
                                            Watch here, track there, automatically
                                        </Typography>
                                    </CardContent>
                                </div>
                            </CardActionArea>
                        </Card>
                    </Grid>
                </Grid>
                {/*TODO: This will utilize a better method later. */}
                <Toolbar className={classes.SplashFooter}>
                    <Button
                        className={classes.SplashButton}
                        onClick={() => this.props.history.push("/tos")}
                        style={{
                            color:
                                (window as any).theme.palette.type === "dark"
                                    ? "rgba(255,255,255,.5)"
                                    : "rgba(0,0,0,.5)"
                        }}
                    >
                        Terms of service
                    </Button>
                    <Button
                        className={classes.SplashButton}
                        onClick={() => this.props.history.push("/pri")}
                        style={{
                            color:
                                (window as any).theme.palette.type === "dark"
                                    ? "rgba(255,255,255,.5)"
                                    : "rgba(0,0,0,.5)"
                        }}
                    >
                        Privacy Policy
                    </Button>
                    <Button
                        className={classes.SplashButton}
                        onClick={() => this.props.history.push("/faq")}
                        style={{
                            color:
                                (window as any).theme.palette.type === "dark"
                                    ? "rgba(255,255,255,.5)"
                                    : "rgba(0,0,0,.5)"
                        }}
                    >
                        FAQ
                    </Button>
                    <div style={{flex: 1}}/>
                    <Fab
                        variant="extended"
                        size="medium"
                        className={classes.fab}
                        onClick={this.handleBGMenu}
                    >
                        {/*<input id='file' type="file" name="file" style={{ display: 'none' }} onChange={this.handleBackgroundChange}/>*/}
                        <Edit style={{marginRight: 8}}/>
                        <div style={{textTransform: "none"}}>Customize</div>
                    </Fab>
                </Toolbar>
                <Modal
                    open={Boolean(bgMenuAnchorEl)}
                    onClose={() => this.setState({bgMenuAnchorEl: null})}

                >
                    <Fade in={Boolean(bgMenuAnchorEl)}><Paper style={{
                        outline: 'none',
                        position: 'absolute',
                        width: 600,
                        boxShadow: realHoverBoxShadow,
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)'
                    }}>
                        <Toolbar>
                            <Typography variant='h6'>
                                Customize Mirai with a brand new look</Typography>
                        </Toolbar>
                        <FormGroup style={{paddingLeft: 8, paddingBottom: 0}}>
                            <ListSubheader style={{marginTop: -16}}>
                                What kind of theme do you prefer?
                            </ListSubheader>
                            <RadioGroup style={{marginLeft: 16}} value={(window as any).color}
                                        onChange={this.handleThemeChange}>
                                <FormControlLabel value="light" control={<Radio/>} label='Light'/>
                                <FormControlLabel value="dark" control={<Radio/>} label='Dark'/>
                                <FormControlLabel value="95" control={<Radio/>} label='95 (Coming soon)' disabled/>
                            </RadioGroup>
                        </FormGroup>
                        <GridList className={classes.customGridList} cellHeight={180} style={{paddingBottom: 16}}>
                            <GridListTile key="Subheader" cols={2} style={{height: "auto"}}>
                                <ListSubheader style={{marginLeft: 8}}>
                                    You can choose one of these backgrounds
                                </ListSubheader>
                            </GridListTile>
                            {tileData.map(tile => (
                                <GridListTile
                                    key={tile.img}
                                    onClick={() => this.setState({bg: tile.img})}
                                >
                                    <img src={tile.img} alt={tile.title}/>
                                    <GridListTileBar
                                        title={tile.title}
                                        subtitle={<span>by: {tile.author}</span>}
                                    />
                                </GridListTile>
                            ))}
                        </GridList>
                        <TextField
                            variant="outlined"
                            style={{width: 'calc(100% - 32px)', margin: 8, marginLeft: 16}}
                            label="Or use a custom background with your URL"
                            value={bg}
                            onChange={this.handleBGURLChange}
                            margin="normal"
                        />
                        <MenuItem color="primary" onClick={this.setBGFromURL}>
                            Set as background
                        </MenuItem>
                        <MenuItem color="primary" onClick={this.restoreBG}>
                            Restore to default
                        </MenuItem>
                    </Paper></Fade>
                </Modal>
            </div>
        );
    }
}

export default withStyles(styles as any)(Splash);
