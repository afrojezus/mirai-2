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
  Fab
} from '@material-ui/core';
import globalStyles, {
  realBoxShadow,
  realBorderRadius,
  realNearBoxShadow,
  realHoverBoxShadow
} from '../globalStyles';
import { Notifications, Image, Edit } from '@material-ui/icons';
//import Tilt from 'react-tilt';
import ava_example from '../assets/avatar.gif';
import bg_example from '../assets/bg.jpg';

const styles = (theme: Theme) => ({
  bigTitle: {
    fontWeight: 700,
    marginRight: theme.spacing.unit,
    fontFamily: `Raleway, 'sans-serif'`,
    letterSpacing: 3
  },
  SplashContainer: {},
  SplashContext: {
    marginLeft: 'auto',
    marginRight: 'auto',
    maxWidth: 800,
    marginTop: theme.spacing.unit * 8
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
    padding: theme.spacing.unit
  },
  splashButton: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  SplashAnimeButton: {
    flexDirection: 'column',
    margin: 'auto',
    padding: theme.spacing.unit * 2,
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
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
    color:
      theme.palette.type === 'dark' ? 'rgba(255,255,255,.5)' : 'rgba(0,0,0,1)',
    backgroundColor:
      theme.palette.type === 'dark'
        ? 'rgba(255,255,255,.1)'
        : 'rgba(255,255,255,1)'
  },
  ...globalStyles(theme)
});

class Splash extends React.Component<any> {
  state = {
    trending: [],
    notificationsShow: false,
    bg:
      'https://cdn.discordapp.com/attachments/400695134016110592/594654503211368488/abigail_williams_fate_grand_order_and_etc_drawn_by_shikitani_asuka__baa9ef6811acb34f59753de2cfcce835.png'
  };

  constructor(props: any) {
    super(props);
    this.fetchData();
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
  public render() {
    const { trending, notificationsShow, bg } = this.state;
    const { classes } = this.props;
    return (
      <div className={classes.SplashContainer}>
        <img src={bg} alt="" className={classes.containerBgImg} />
        <div className={classes.SplashContext}>
          <Toolbar disableGutters>
            <div>
              <Typography>未</Typography>
              <Typography style={{ marginTop: -7 }}>来</Typography>
            </div>
            <Typography variant="h4" className={classes.bigTitle}>
              MIRAI
            </Typography>
            <div style={{ flex: 1 }} />
            <Button
              className={classes.SplashButton}
              onClick={() => this.props.history.push('/explore')}
            >
              Explore
            </Button>
            <Button
              className={classes.SplashButton}
              onClick={() => this.props.history.push('/sharestreams')}
            >
              Sharestreams
            </Button>
            <Button
              className={classes.SplashButton}
              onClick={() => this.props.history.push('/social')}
            >
              Social
            </Button>
            <div style={{ flex: 1 }} />
            <IconButton onClick={this.toggleNotifications}>
              <Notifications />
            </IconButton>
            <Avatar
              src={ava_example}
              onClick={() => this.props.history.push('/account')}
            />
          </Toolbar>
          <Paper elevation={24} className={classes.SplashPaper}>
            <div className={classes.SplashPaperPadding}>
              <InputBase
                className={classes.SplashPaperInput}
                placeholder="Search for anime"
              />
            </div>
          </Paper>

          <Toolbar disableGutters>
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
          <Toolbar disableGutters>
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
            <Typography
              variant="subtitle1"
              style={{
                color:
                  (window as any).theme.palette.type === 'dark'
                    ? 'rgba(255,255,255,.5)'
                    : 'rgba(0,0,0,.5)',
                padding: '0 16px'
              }}
            >
              Trending
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
          <Grid
            container
            spacing={32}
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
        </div>
        <Drawer
          anchor="right"
          open={notificationsShow}
          onClose={this.toggleNotifications}
          className={classes.drawer}
        >
          <List className={classes.drawer}>
            <ListItem button>
              <ListItemText primary="UwU" />
            </ListItem>
          </List>
        </Drawer>
        <Fab variant="extended" size="medium" className={classes.fab}>
          <Edit style={{ marginRight: 8 }} />
          <div style={{ textTransform: 'none' }}>Customize</div>
        </Fab>
      </div>
    );
  }
}

export default withStyles(styles as any)(Splash);
