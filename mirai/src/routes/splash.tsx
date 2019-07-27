import React from 'react';
import {
  withStyles,
  Theme,
  Typography,
  Paper,
  Toolbar,
  Button,
  Avatar,
  colors,
  IconButton,
  Grid,
  Fade,
  ButtonBase,
  Grow,
  InputBase,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Fab,
  Icon,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Snackbar,
  Menu,
  TextField,
  LinearProgress,
  Backdrop,
  GridList,
  GridListTile,
  ListSubheader,
  GridListTileBar,
  MenuItem
} from '@material-ui/core';
import Imgur from 'imgur-v2';
import globalStyles, {
  realBoxShadow,
  realBorderRadius,
  realNearBoxShadow,
  realHoverBoxShadow
} from '../globalStyles';
import { Notifications, Image, Edit, MoreHoriz } from '@material-ui/icons';
//import Tilt from 'react-tilt';
import ava_example from '../assets/avatar.gif';
import bg_example from '../assets/bg.jpg';
import FeedFactory from 'components/FeedFactory';
import colorizer from 'utils/colorizer';
import { IMGUR_API } from 'utils/supersecretkeys';
// TODO: Implement a more safe approach to customization
const tileData = [
  {
    img: "https://cdn.discordapp.com/attachments/400695134016110592/604338334986141716/original_drawn_by_fukahire_ruinon__8d3073e9f2c724cd4c829e03edefa1a4.png",
    title: "OC",
    author: "Fukahire Ruinon"
  },
  {
    img: "https://cdn.discordapp.com/attachments/400695134016110592/604338551936778276/original_drawn_by_shion_mirudakemann__0a18eb0ad4ee5d61c78d34fe7eb351cc.png",
    title: "OC",
    author: "Shion Mirudakemann"
  },
  {
    img: "https://cdn.discordapp.com/attachments/400695134016110592/604413905304944650/Konachan.com_-_286303_bicycle_bike_shorts_kukka_original_ponytail_see_through_short_hair_shorts.jpg",
    title: "ジュライドライ",
    author: "くっか"
  },
]

const styles = (theme: Theme) => ({
  bigTitle: {
    fontWeight: 700,
    marginRight: theme.spacing(0),
    fontFamily: `Raleway, 'sans-serif'`,
    letterSpacing: 3
  },
  SplashContainer: {
    marginTop: theme.spacing(8)
  },
  SplashArea: {
    display: 'inline-flex',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  SplashLeftSideContext: {
    marginLeft: 'auto',
    marginRight: theme.spacing(2),
    maxWidth: 400,
    width: 400,
    //marginTop: theme.spacing(8)
  },
  SplashRightSideContext: {
    marginLeft: theme.spacing(2),
    marginRight: 'auto',
    maxWidth: 400,
    width: 400,
    //marginTop: theme.spacing(8)
  },
  SplashContext: {
    marginLeft: theme.spacing(0),
    marginRight: theme.spacing(0),
    maxWidth: 800,
    width: 800,
    //marginTop: theme.spacing(8)
  },
  SplashPaper: {
    boxShadow: realBoxShadow,
    borderRadius: 0,
    minHeight: 50,
    minWidth: 600,
    overflow: 'hidden',
    animation: 'SplashPaperIntro 0.4s ease',
    backdropFilter: 'blur(10px)',
    background: 'rgba(255,255,255,.1)'
  },
  SplashPaperPadding: {
    padding: theme.spacing(1)
  },
  splashButton: {
    marginLeft: theme.spacing(0),
    marginRight: theme.spacing(0)
  },
  SplashAnimeButton: {
    flexDirection: 'column',
    margin: 'auto',
    padding: theme.spacing(2),
    '&:hover': {
      backdropFilter: 'blur(10px)',
      boxShadow: realHoverBoxShadow,
      background: 'rgba(255,255,255,0.5)'
    }
  },
  SplashAnimeGrid: {
    boxShadow: 0
  },
  SplashAnimeCover: {
    height: 70,
    width: 70,
    borderRadius: 50,
    overflow: 'hidden',
    boxShadow: 0,
    background: 'rgba(0,0,0,.1)',
    '&:hover': {
      boxShadow: realHoverBoxShadow
    }
  },
  SplashAnimeCoverImage: {
    height: '100%',
    width: '100%',
    objectFit: 'cover'
  },
  SplashAnimeTitle: {
    fontSize: 11,
    fontWeight: 600,
    paddingTop: 8
  },
  SplashPaperInput: {
    marginLeft: 8,
    flex: 1,
    width: 'calc(100% - 8px)'
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  SplashFooter: {
    position: 'fixed',
    bottom: theme.spacing(0.5),
    left: theme.spacing(2),
    width: `calc(100% - ${theme.spacing(23)}px)`,
  },
  SplashCard: {
    maxWidth: 400,
  },
  SplashCardMedia: {
    height: 140
  },
  bgChangeLoadOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: '100vh',
    width: '100%',
    zIndex: 10000000000000,
    background: 'rgba(0,0,0,.6)',
    display: 'flex',
    flexDirection: 'column'
  },
  customMenuRoot: {
    width: 500
    },
    customGridList: {
      width: 500
    },
    customGridListIcon: {
      color: 'rgba(255, 255, 255, 0.54)',
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
      bgMenuAnchorEl: null
  };

  constructor(props: any) {
    super(props);
    Imgur.setClientId(IMGUR_API.clientId);
    Imgur.setAPIUrl('https://api.imgur.com/3/');
    this.fetchData();
    this.getAccentFromBG(false);
  }

  public getAccentFromBG = async (_bgWillChange: boolean) => {
    try {
      if (!_bgWillChange) return this.setState({bgChange: false})
      else {
      this.setState({bgChangeLoading: true}, async () => {
        console.log(`[Colorizer] Changing accent colors to new background.`)
        const pal = await colorizer((this.state.bg as string));
        localStorage.setItem("bg_accent", JSON.stringify(pal));
        this.setState({bgChange: true, bgChangeLoading: false})
      })
    }
    } catch (error) {
      console.error(`[Colorizer] ${error}`);
    }
  }

  public fetchData = async () => {
    try {
      const { data }: any = await fetch(
        'https://kitsu.io/api/edge/trending/anime',
        {
          headers: {
            Accept: 'application/vnd.api+json',
            'Content-Type': 'application/vnd.api+json'
          }
        }
      ).then((response: Response) => response.json());
      // tslint:disable-next-line:no-console
      // console.log(data);
      this.setState({ trending: data });
    } catch (error) {
      // tslint:disable-next-line:no-console
      // console.error(error);
    }
  };

  public goToAnime = (anime: any) => {
    if (anime.attributes)
      this.props.history.push(`/anime?id=${anime.id}`, {
        anime: anime.attributes
      });
    else this.props.history.push(`/anime?id=${anime.kitsu}`, { anime });
  };

  toggleNotifications = () =>
    this.setState({ notificationsShow: !this.state.notificationsShow });

    toggleMoreMenu = (el: any) =>
    this.setState({ moreMenu: !this.state.moreMenu, moreMenuEl: el.target });

    handleBackgroundChange = async (e: any) => {
      let selectedFile = e.target.files[0];
      if (!selectedFile) return

      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const json = await Imgur.uploadBase64(reader.result);
          json && this.setState({bg: json.data.link}, () => this.getAccentFromBG(true));
        } catch (error) {
          console.error(`[Imgur] ${error}`);
        }
      }
      reader.readAsDataURL(selectedFile);
    }

    handleBGMenu = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => this.setState({bgMenuAnchorEl: e.currentTarget})

    handleBGURLChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      this.setState({bg: e.target.value});
    }

    setBGFromURL = () => {
      localStorage.setItem("bg_url", (this.state.bg as string));
      this.getAccentFromBG(true)
    };

  public render() {
    const { trending, notificationsShow, bg, bgChange, bgChangeLoading, bgMenuAnchorEl } = this.state;
    const { classes } = this.props;
    return (
      <div className={classes.SplashContainer}>
        <div style={{display: bgChangeLoading ? 'flex' : 'none'}} className={classes.bgChangeLoadOverlay}>
          <div style={{flex: 1, margin: 'auto', maxHeight: 0}}>
          <Typography variant='h4' style={{margin: 8, marginLeft: 0}}>Keep calm, we're adding new flavors to Mirai with your new background</Typography>
        <LinearProgress  />
        </div>
          </div>
        <Snackbar open={bgChange} autoHideDuration={6000} onClose={() => this.setState({bgChange: false})} message={<span>Accent color changed! Reload to see changes.</span>} action={[<Button onClick={() => window.location.reload(false)} color='primary'>Reload</Button>]}/>
        {bg && <img src={bg} alt="" className={classes.containerBgImg} />}
        <Grid
            container
            style={{ justifyContent: 'space-evenly', paddingTop: 8 }}
          >
            {trending.length > 0
              ? trending.map((anime: any, index: number) => (
                  <Grow in={true} key={index}>
                    <Grid
                      item
                      className={classes.SplashAnimeGrid}
                      style={{ width: 160, display: 'inline-flex' }}
                    >
                      <ButtonBase
                        className={classes.SplashAnimeButton}
                        disableRipple
                        onClick={this.goToAnime.bind(this, anime)}
                      >
                        <div className={classes.SplashAnimeCover}>
                          <img
                            className={classes.SplashAnimeCoverImage}
                            alt=""
                            src={anime.attributes.posterImage.original}
                          />
                        </div>
                        <Typography
                          className={classes.SplashAnimeTitle}
                          variant="body1"
                        >
                          {anime.attributes.titles.en_jp}
                        </Typography>
                      </ButtonBase>
                    </Grid>
                  </Grow>
                ))
              : [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}].map(
                  (anime: any, index: number) => (
                    <Grow in={true} key={index}>
                      <Grid item style={{ width: 160, display: 'inline-flex' }}>
                        <ButtonBase
                          className={classes.SplashAnimeButton}
                          disableRipple
                          disabled
                        >
                          <div className={classes.SplashAnimeCover}>
                            <img
                              className={classes.SplashAnimeCoverImage}
                              alt=""
                              src={''}
                            />
                          </div>
                          <Typography
                            className={classes.SplashAnimeTitle}
                            style={{
                              color: 'rgba(0,0,0,.1)'
                            }}
                            variant="body1"
                          >
                            ......................
                          </Typography>
                        </ButtonBase>
                      </Grid>
                    </Grow>
                  )
                )}
          </Grid>
        <Grid container className={classes.SplashArea}>
        <Grid item className={classes.SplashLeftSideContext}>
          <Toolbar disableGutters>
            <Typography
              variant="subtitle1"
              style={{
                color:
                  (window as any).theme.palette.type === 'dark'
                    ? 'rgba(255,255,255,.5)'
                    : 'rgba(0,0,0,.5)',
                    padding: '0 16px 0 0'
              }}
            >
              You
            </Typography>
            <div
              style={{
                flex: 1,
                borderBottom: `1px solid ${
                  (window as any).theme.palette.type === 'dark'
                    ? 'rgba(255,255,255,.3)'
                    : 'rgba(0,0,0,.3)'
                }`
              }}
            />
          </Toolbar>
          <Card className={classes.SplashCard}>
            <CardActionArea>
              <CardMedia className={classes.SplashCardMedia}
              image={ava_example}
              title="This is you. Amazing, aren't you?"
              />
              <CardContent>
              <Typography gutterBottom variant="h5">
            You
          </Typography>
          <Typography variant="body2" color="textSecondary">
            You are everything.
          </Typography>
                </CardContent>
              </CardActionArea>
              <List>
                <ListSubheader>Shortcuts</ListSubheader>
                <ListItem button>
                  <ListItemText primary='History' />
                  </ListItem>
                  <ListItem button>
                  <ListItemText primary='Favorites' />
                  </ListItem>
                  <ListItem button>
                  <ListItemText primary='Account Settings' />
                  </ListItem>
                  <ListItem button>
                  <ListItemText primary='Log out' style={{color: '#f0a0a0'}} />
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
                  (window as any).theme.palette.type === 'dark'
                    ? 'rgba(255,255,255,.5)'
                    : 'rgba(0,0,0,.5)',
                padding: '0 16px 0 0'
              }}
            >
              Social
            </Typography>
            <div
              style={{
                flex: 1,
                borderBottom: `1px solid ${
                  (window as any).theme.palette.type === 'dark'
                    ? 'rgba(255,255,255,.3)'
                    : 'rgba(0,0,0,.3)'
                }`
              }}
            />
          </Toolbar>
          <FeedFactory />
        </Grid>
        <Grid item className={classes.SplashRightSideContext}>
          <Toolbar disableGutters>
            <Typography
              variant="subtitle1"
              style={{
                color:
                  (window as any).theme.palette.type === 'dark'
                    ? 'rgba(255,255,255,.5)'
                    : 'rgba(0,0,0,.5)',
                    padding: '0 16px 0 0'
              }}
            >
              Friends
            </Typography>
            <div
              style={{
                flex: 1,
                borderBottom: `1px solid ${
                  (window as any).theme.palette.type === 'dark'
                    ? 'rgba(255,255,255,.3)'
                    : 'rgba(0,0,0,.3)'
                }`
              }}
            />
          </Toolbar>
          
        </Grid>
        </Grid>{/*TODO: This will utilize a better method later. */}
        <Fab variant="extended" size="medium" className={classes.fab} onClick={this.handleBGMenu}>
          {/*<input id='file' type="file" name="file" style={{ display: 'none' }} onChange={this.handleBackgroundChange}/>*/}
          <Edit style={{ marginRight: 8 }} />
          <div style={{ textTransform: 'none' }}>Customize</div>
        </Fab>
        <Toolbar disableGutters className={classes.SplashFooter}>
            <Button
              className={classes.SplashButton}
              onClick={() => this.props.history.push('/tos')}
              style={{
                color:
                  (window as any).theme.palette.type === 'dark'
                    ? 'rgba(255,255,255,.5)'
                    : 'rgba(0,0,0,.5)'
              }}
            >
              Terms of service
            </Button>
            <Button
              className={classes.SplashButton}
              onClick={() => this.props.history.push('/pri')}
              style={{
                color:
                  (window as any).theme.palette.type === 'dark'
                    ? 'rgba(255,255,255,.5)'
                    : 'rgba(0,0,0,.5)'
              }}
            >
              Privacy Policy
            </Button>
            <Button
              className={classes.SplashButton}
              onClick={() => this.props.history.push('/faq')}
              style={{
                color:
                  (window as any).theme.palette.type === 'dark'
                    ? 'rgba(255,255,255,.5)'
                    : 'rgba(0,0,0,.5)'
              }}
            >
              FAQ
            </Button>
            <div style={{ flex: 1 }} />
            <Typography
              style={{
                color:
                  (window as any).theme.palette.type === 'dark'
                    ? 'rgba(255,255,255,.5)'
                    : 'rgba(0,0,0,.5)'
              }}
            >
              Mirai V2
            </Typography>
            <Typography
              style={{
                marginLeft: 8,
                marginRight: 8,
                color:
                  (window as any).theme.palette.type === 'dark'
                    ? 'rgba(255,255,255,.12)'
                    : 'rgba(0,0,0,.12)'
              }}
            >
              |
            </Typography>
            <Typography
              style={{
                color:
                  (window as any).theme.palette.type === 'dark'
                    ? 'rgba(255,255,255,.5)'
                    : 'rgba(0,0,0,.5)'
              }}
            >
              Developed by MIR
            </Typography>
          </Toolbar>
          <Menu style={{flexDirection: 'column', display: 'inline-flex'}} anchorEl={bgMenuAnchorEl} keepMounted open={Boolean(bgMenuAnchorEl)} onClose={() => this.setState({bgMenuAnchorEl: null})}>
            <GridList className={classes.customGridList} cellHeight={180}>
              <GridListTile key='Subheader' cols={2} style={{height: 'auto'}}>
                <ListSubheader>Customize Mirai with a brand new look</ListSubheader>
                <ListSubheader style={{marginTop: -16}}>You can choose one of these backgrounds</ListSubheader>
                </GridListTile>
                {tileData.map(tile => (
          <GridListTile key={tile.img} onClick={() => this.setState({bg: tile.img})}>
            <img src={tile.img} alt={tile.title} />
            <GridListTileBar
              title={tile.title}
              subtitle={<span>by: {tile.author}</span>}
            />
          </GridListTile>
        ))}
            </GridList>
            <TextField variant="outlined" style={{width: 500, margin: 8}} label='Or use a custom background with your URL' value={bg} onChange={this.handleBGURLChange} margin='normal' />
            <MenuItem color='primary' onClick={this.setBGFromURL}>
              Set as background
            </MenuItem>
          </Menu>
      </div>
    );
  }
}

export default withStyles(styles as any)(Splash);
