import React, { Component } from "react";
import * as Icon from "@material-ui/icons";
import ReactPlayer from "react-player";
import localForage from "localforage";
import Dropzone from "react-dropzone";
import { connect } from "react-redux";
import { firebaseConnect, isEmpty } from "react-redux-firebase";
import { grey, blue } from "@material-ui/core/colors";
import Duration from "../../components/yuplayer/Duration";
import { getState, loadEp, loadFile } from "../../utils/mirfetch";

import {
  CardHeader,
  Typography,
  Button,
  IconButton,
  Divider,
  withStyles,
  Menu,
  MenuItem,
  TextField,
  Card,
  FormGroup,
  FormControlLabel,
  CardContent,
  Switch,
  CircularProgress,
  LinearProgress,
  CardActions,
  Tooltip
} from "@material-ui/core";

const style = theme => ({
  root: {
    height: "100vh",
    width: "100%",
    position: "relative",
    top: 0,
    left: 0,
    overflow: "hidden"
  },
  player: {
    height: "100%",
    width: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    background: "black",
    transition: theme.transitions.create(["all"])
  },
  controlpanel: {
    position: "fixed",
    bottom: theme.spacing() * 6,
    width: "calc(100% - 128px)",
    marginLeft: 64,
    marginRight: 64,
    background: window.safari ? "rgba(0,0,0,.2)" : grey[800],
    boxShadow: "0 2px 32px rgba(0,0,0,.3)",
    transition: theme.transitions.create(["all"]),
    backdropFilter: "blur(10px)"
  },
  backToolbar: {
    zIndex: 10,
    transition: theme.transitions.create(["all"])
  },
  indicator: {
    flexDirection: "row",
    padding: 0,
    display: "flex",
    position: "relative"
  },
  progress: {
    flex: 1
  },
  progressLoaded: {
    zIndex: -1,
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%"
  },
  progressBg: {
    backgroundColor: grey[900]
  },
  progressBgOver: {
    backgroundColor: "transparent"
  },
  progressBar: {
    transition: "none"
  },
  progressBarLoaded: {
    transition: "none",
    backgroundColor: grey[700]
  },
  duration: {
    padding: theme.spacing(),
    fontFamily: "SF Mono"
  },
  left: {
    padding: theme.spacing()
  },
  epListCont: {
    maxHeight: 300,
    overflowY: "scroll",
    padding: 0
  },
  epListItem: {},
  volumeSlider: {
    paddingLeft: theme.spacing(),
    paddingRight: theme.spacing(),
    outline: "none"
  },
  progressInput: {
    background: "transparent",
    position: "absolute",
    margin: "-5px 0",
    width: "100%",
    "-webkit-appearance": "none",
    outline: "none",
    transition: theme.transitions.create(["all"]),
    opacity: 0,
    "&:hover": {
      opacity: 1
    }
  },
  loading: {
    height: "100%",
    width: "100%",
    zIndex: 1000,
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
    padding: 0,
    margin: "auto",
    transition: theme.transitions.create(["all"])
  },
  showInfo: {
    margin: "auto",
    width: "100%",
    padding: theme.spacing() * 8,
    display: "flex",
    zIndex: 500,
    boxSizing: "border-box"
  },
  showInfoColumn: {
    display: "flex",
    flexDirection: "column",
    margin: 8
  },
  showInfoTitle: {
    fontWeight: 700,
    padding: theme.spacing(),
    paddingLeft: 0,
    color: "white"
  },
  showInfoDesc: {
    paddingTop: theme.spacing() * 2,
    fontSize: 16
  },
  showInfoArtwork: {
    width: 300,
    objectFit: "cover",
    boxShadow: "0 2px 16px rgba(0,0,0,.2)"
  },
  nextButton: {},
  nextButtonWrapper: {
    margin: theme.spacing(),
    position: "relative"
  },
  nextButtonProgress: {
    color: blue.A200,
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12
  },
  qualityTitle: {
    border: "2px solid white",
    borderRadius: 2,
    padding: theme.spacing() / 2,
    boxSizing: "border-box",
    fontSize: 14,
    fontWeight: 500
  },
  menuPaper: {
    outline: "none"
  }
});

class DevPlayer extends Component {

  state = {
    playing: false,
    buffering: true,
    source: "",
    duration: 0,
    volume: 0.5,
    status: "",
    title: "",
    fullscreen: false,
    played: 0,
    loaded: 0,
    seeking: false,
    menu: false,
    rate: null,
    ep: 0,
    eps: [],
    error: false,
    menuEl: null,
    showId: 0,
    recentlyWatched: Date.now(),
    volEl: null,
    counter: 5,
    torrent: false,
    quality: 480,
    torrentFile: null,
    quaEl: null,
    native: false
  };

  componentWillMount = async () => {
    const playerVolume = await localForage.getItem("player-settings-volume");

    if (playerVolume) this.setState({ volume: playerVolume });

    /* if (playerUseTorrent) this.setState({ torrent: playerUseTorrent });
        else return; */
  };

  componentWillReceiveProps = async nextProps => {
    if (this.props !== nextProps) {
      // Not sure if I want to play cowbow fuckin' bebop every damn time I change this thing
      if (this.props.profile !== nextProps.profile) return null;
      await getState(this);
    }
    return false;
  };

  componentWillUnmount = async () => {
    if (!isEmpty(this.props.profile) && this.state.loaded > 0) {
      const episodePro = this.props.firebase
        .database()
        .ref("users")
        .child(`${this.props.profile.userID}`)
        .child("episodeProgress");
      localForage.getItem("player-state").then(async a => {
        if (a && a.showId) {
          episodePro.child(`${a.showId}`).update(a);
          return true;
        }
        return false;
      });
    }
  };

  onSeekMouseDown = e => {
    this.setState({ seeking: true });
  };

  onSeekChange = e => {
    this.setState({ played: parseFloat(e.target.value) });
  };

  onSeekMouseUp = e => {
    this.setState({ seeking: false, buffering: true });
    this.player.seekTo(parseFloat(e.target.value));
  };

  onBuffer = () => {
    this.setState({ buffering: true, status: "Buffering..." }, () => { });
  };

  onProgress = state => {
    if (!this.state.seeking)
      this.setState(state, async () => {
        this.setState({
          videoQuality: this.player.getInternalPlayer().videoHeight
        });
        switch (this.player.getInternalPlayer().networkState) {
          case 1:
            console.log("IDLE");
            this.setState({ buffering: false });
            break;
          case 2:
            console.log("LOADING");
            this.setState({ buffering: false });
            break;
          default:
            break;
        }

        if (this.state.resume) {
          const { resume } = this.state;
          this.setState({ resume: null, buffering: true }, () => {
            this.player.seekTo(resume);
            if (resume === this.state.played)
              this.setState({ buffering: false });
          });
        }
        if (!this.state.menuEl && !this.state.volEl)
          await localForage.setItem("player-state", this.state);
      });
  };

  setVolume = e => {
    this.setState({ volume: parseFloat(e.target.value) }, async () => {
      await localForage.setItem("player-settings-volume", this.state.volume);
    });
  };

  setPlaybackRate = e => {
    this.setState({ playbackRate: parseFloat(e.target.value) });
  };

  mute = e => {
    const prevVol = this.state.volume;
    if (this.state.volume > 0) {
      this.setState({ volume: 0 });
    } else {
      this.setState({ volume: prevVol });
    }
  };

  inactivityTimeout;
  /* stop = () => {
        this.setState({ source: null, playing: false });
      }; */

  playPause = resume => {
    this.setState({ playing: !this.state.playing });
    if (this.timer && this.timer !== undefined) clearInterval(this.timer);
  };

  skip30Sec = () => {
    this.player.seekTo(this.state.played + 18 / 1000, null);
  };

  skipToNextEp = () => {
    let nextEp = this.state.ep;
    nextEp += 1;
    loadEp(this, this.state.eps[nextEp], null);
    if (this.state.willLoadNextEp) this.setState({ willLoadNextEp: false });
  };

  player = HTMLMediaElement;
  closeMenu = () => this.setState({ menuEl: null });

  mouseResetDelay = () => {
    clearTimeout(this.inactivityTimeout);
    this.inactivityTimeout = setTimeout(() => {
      this.hide();
    }, 4000);
  };

  reveal = event => {
    const back = document.getElementById("backbutton");
    const controls = document.getElementById("controls");
    const player = document.getElementById("player");
    if (back && controls && player) {
      back.style.opacity = 1;
      controls.style.opacity = 1;
      player.style.cursor = "initial";
      this.mouseResetDelay();
    }
  };

  hide = () => {
    const back = document.getElementById("backbutton");
    const controls = document.getElementById("controls");
    const player = document.getElementById("player");
    if (
      back &&
      controls &&
      player &&
      this.state.loaded > 0 &&
      this.state.played < 1
    ) {
      player.style.cursor = "none";
      back.style.opacity = 0;
      controls.style.opacity = 0;
    }
  };

  handleFullscreen = e =>
    this.setState({ fullscreen: !this.state.fullscreen }, () => {
      const docElm = document.documentElement;
      if (this.state.fullscreen) {
        if (docElm.requestFullscreen) {
          docElm.requestFullscreen();
        } else if (docElm.mozRequestFullScreen) {
          docElm.mozRequestFullScreen();
        } else if (docElm.webkitRequestFullScreen) {
          docElm.webkitRequestFullScreen();
        } else if (docElm.msRequestFullscreen) {
          docElm.msRequestFullscreen();
        }
      } else if (!this.state.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      }
    });

  handleEnded = () => {
    this.reveal();
    if (!isEmpty(this.props.profile) && this.state.loaded > 0) {
      const episodePro = this.props.firebase
        .database()
        .ref("users")
        .child(`${this.props.profile.userID}`)
        .child("episodeProgress");
      localForage.getItem("player-state").then(async a => {
        if (a && a.showId) {
          episodePro.child(`${a.showId}`).update(a);
          return true;
        }
        return false;
      });
    }

    if (this.state.eps.length < this.state.ep) {
      this.setState({ willLoadNextEp: true }, () => {
        this.timer = setTimeout(
          () =>
            this.setState({ willLoadNextEp: false }, () => this.skipToNextEp()),
          5000
        );
      });
    }
  };

  timer = undefined;

  changeQuality = int => {
    switch (int) {
      case 1080:
        this.setState(
          {
            source: null,
            playing: false,
            quality: 1080,
            quaEl: null,
            buffering: true,
            status: "Downloading...",
            loaded: 0,
            played: 0,
            videoQuality: null
          },
          async () => getState(this)
        );
        break;
      case 720:
        this.setState(
          {
            source: null,
            playing: false,
            quality: 720,
            quaEl: null,
            buffering: true,
            status: "Downloading...",
            loaded: 0,
            played: 0,
            videoQuality: null
          },
          async () => getState(this)
        );
        break;
      case 480:
        this.setState(
          {
            source: null,
            playing: false,
            quality: 480,
            quaEl: null,
            buffering: true,
            status: "Downloading...",
            loaded: 0,
            played: 0,
            videoQuality: null
          },
          async () => getState(this)
        );
        break;
      default:
        break;
    }
  };

  switchMode = () =>
    this.setState({ torrent: !this.state.torrent }, async () => {
      const { torrent } = this.state;
      if (torrent) {
        await localForage.setItem("player-setting-torrent", true);
        this.setState(
          {
            source: null,
            playing: false,
            buffering: true,
            status: "Downloading...",
            loaded: 0,
            played: 0,
            videoQuality: null
          },
          async () => getState(this)
        );
      } else {
        await localForage.setItem("player-setting-torrent", false);
        this.setState(
          {
            playing: false,
            source: null,
            buffering: true,
            status: "Loading...",
            loaded: 0,
            played: 0,
            videoQuality: null
          },
          async () => getState(this)
        );
      }
    });

  render() {
    const { classes, theme } = this.props;
    const {
      playing,
      buffering,
      source,
      duration,
      played,
      loaded,
      volume,
      fullscreen,
      status,
      title,
      menuEl,
      eps,
      ep,
      volEl,
      willLoadNextEp,
      videoQuality,
      torrent,
      quaEl,
      quality,
      native
    } = this.state;
    const menu = Boolean(menuEl);
    const volumeMenu = Boolean(volEl);
    const qualityMenu = Boolean(quaEl);
    return (
      <div
        id="frame"
        className={classes.root}
        onMouseLeave={played === 1 ? null : this.hide}
        onMouseMove={this.reveal}
        onTouchMove={this.reveal}
      >
        <Card
          style={{
            position: "absolute",
            top: theme.spacing() * 8,
            left: theme.spacing(),
            zIndex: 1000,
            margin: theme.spacing(),
            minWidth: 300
          }}
        >
          <CardHeader title="Debug" />
          <CardContent>
            <Typography type="body1">URL: {source}</Typography>
            <Typography type="body1">Played: {played}</Typography>
            <Typography type="body1">Loaded: {loaded}</Typography>
            <Typography type="body1">Volume: {volume}</Typography>
            <Typography type="body1">
              IsPlaying: {playing ? "true" : "false"}
            </Typography>
            <Typography type="body1">
              IsFullscreen: {fullscreen ? "true" : "false"}
            </Typography>
            <Typography type="body1">
              IsBuffering: {buffering ? "true" : "false"}
            </Typography>
            <div style={{ display: "flex" }}>
              <Typography style={{ margin: "auto" }}>
                Native controls
              </Typography>
              <div style={{ flex: 1 }} />
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={native}
                      onChange={() =>
                        this.setState({ native: !this.state.native })
                      }
                    />
                  }
                />
              </FormGroup>
            </div>
            <Dropzone
              style={{ textAlign: "center", margin: "auto", color: "white" }}
              multiple={false}
              onDrop={accept => accept.forEach(file => loadFile(this, file))}
            >
              <Button raised color="accent">
                Open video
              </Button>
            </Dropzone>
            <TextField
              fullWidth
              value={source}
              onChange={e =>
                this.setState(
                  {
                    source: e.currentTarget.value,
                    status: e.currentTarget.value
                  },
                  () => this.playPause()
                )
              }
              placeholder="URL"
            />
          </CardContent>
        </Card>
        <CircularProgress
          className={classes.loading}
          style={!buffering ? { opacity: 0 } : null}
        />
        <ReactPlayer
          id="player"
          ref={player => {
            this.player = player;
          }}
          controls={native}
          url={source}
          volume={volume}
          playing={playing}
          onProgress={this.onProgress}
          className={classes.player}
          width="100%"
          height="100%"
          onBuffer={this.onBuffer}
          onReady={() =>
            this.setState({ playing: true, buffering: false, status: title })
          }
          onPause={() => this.setState({ playing: false })}
          onEnded={this.handleEnded}
          onError={e => console.error(e)}
          onDuration={dur => this.setState({ duration: dur })}
          style={played === 1 ? { filter: "brightness(.2)" } : null}
        />
        {!native ? (
          <Card id="controls" className={classes.controlpanel}>
            <CardContent className={classes.indicator}>
              <LinearProgress
                classes={{
                  root: classes.progress,
                  primaryColor: classes.progressBgOver,
                  primaryColorBar: classes.progressBar
                }}
                mode="determinate"
                value={played * 100}
                valueBuffer={loaded * 100}
              />
              <LinearProgress
                classes={{
                  root: classes.progressLoaded,
                  primaryColor: classes.progressBg,
                  primaryColorBar: classes.progressBarLoaded
                }}
                mode="determinate"
                value={loaded * 100}
              />
              <input
                className={classes.progressInput}
                type="range"
                step="any"
                max={0.999}
                min={0}
                value={played}
                onMouseDown={this.onSeekMouseDown}
                onChange={this.onSeekChange}
                onMouseUp={this.onSeekMouseUp}
              />
            </CardContent>
            <CardActions>
              <IconButton
                disabled={!!(loaded === 0 || !source)}
                onClick={this.playPause}
              >
                {playing ? (
                  <Icon.Pause />
                ) : played === 1 ? (
                  <Icon.Replay />
                ) : (
                  <Icon.PlayArrow />
                )}
              </IconButton>
              <Typography
                type="title"
                className={!source ? classes.left : null}
              >
                {status}
              </Typography>
              <div style={{ flex: 1 }} />
              {willLoadNextEp ? (
                <div className={classes.nextWrapper}>
                  <Button
                    onClick={this.skipToNextEp}
                    className={classes.nextButton}
                  >
                    Loading next episode in 5 seconds...
                  </Button>
                </div>
              ) : null}
              <IconButton
                disabled={!torrent}
                aria-owns={qualityMenu ? "quality-menu" : null}
                aria-haspopup="true"
                onClick={e => this.setState({ quaEl: e.currentTarget })}
                color="default"
              >
                {torrent ? (
                  quality === 480 ? (
                    <Typography type="title" className={classes.qualityTitle}>
                      480p
                    </Typography>
                  ) : quality === 720 ? (
                    <Typography type="title" className={classes.qualityTitle}>
                      720p
                    </Typography>
                  ) : quality === 1080 ? (
                    <Typography type="title" className={classes.qualityTitle}>
                      1080p
                    </Typography>
                  ) : null
                ) : (
                  <Typography
                    type="title"
                    style={torrent ? null : { opacity: ".2" }}
                    className={classes.qualityTitle}
                  >
                    {videoQuality ? `${videoQuality}p` : "HD"}
                  </Typography>
                )}
              </IconButton>
              <Typography type="body1" className={classes.duration}>
                <Duration seconds={duration * played} />
              </Typography>
              <Menu
                id="quality-menu"
                anchorEl={quaEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right"
                }}
                transformOrigin={{
                  vertical: "center",
                  horizontal: "right"
                }}
                open={qualityMenu}
                classes={{
                  paper: classes.menuPaper
                }}
                onClose={() => this.setState({ quaEl: null })}
                PaperProps={{
                  style: {
                    width: 300,
                    padding: 0,
                    outline: "none",
                    background: grey[800]
                  }
                }}
                MenuListProps={{
                  style: {
                    padding: 0,
                    outline: "none"
                  }
                }}
              >
                <Card style={{ background: grey[800] }}>
                  <CardHeader
                    style={{ background: grey[900] }}
                    title="Quality"
                  />
                  <Divider />
                  <CardContent className={classes.epListCont}>
                    <MenuItem
                      onClick={() => this.changeQuality(1080)}
                      selected={quality === 1080}
                      className={classes.epListItem}
                    >
                      1080p
                      <div style={{ flex: 1 }} />
                      {quality === 1080 ? <Icon.PlayArrow /> : null}
                    </MenuItem>
                    <MenuItem
                      onClick={() => this.changeQuality(720)}
                      selected={quality === 720}
                      className={classes.epListItem}
                    >
                      720p
                      <div style={{ flex: 1 }} />
                      {quality === 720 ? <Icon.PlayArrow /> : null}
                    </MenuItem>
                    <MenuItem
                      onClick={() => this.changeQuality(480)}
                      selected={quality === 480}
                      className={classes.epListItem}
                    >
                      480p
                      <div style={{ flex: 1 }} />
                      {quality === 480 ? <Icon.PlayArrow /> : null}
                    </MenuItem>
                  </CardContent>
                </Card>
              </Menu>
              <IconButton
                aria-owns={volumeMenu ? "volume-menu" : null}
                aria-haspopup="true"
                onClick={e => this.setState({ volEl: e.currentTarget })}
                color="default"
              >
                {volume > 0 ? <Icon.VolumeUp /> : <Icon.VolumeOff />}
              </IconButton>
              <Menu
                id="volume-menu"
                anchorEl={volEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right"
                }}
                transformOrigin={{
                  vertical: "bottom",
                  horizontal: "right"
                }}
                open={volumeMenu}
                onClose={() => this.setState({ volEl: null })}
                PaperProps={{
                  style: {
                    outline: "none",
                    background: grey[800]
                  }
                }}
                MenuListProps={{
                  style: {
                    padding: 8,
                    outline: "none"
                  }
                }}
              >
                <input
                  step="any"
                  type="range"
                  className={classes.volumeSlider}
                  max={1}
                  min={0}
                  value={volume}
                  onChange={this.setVolume}
                />
              </Menu>
              <IconButton
                disabled={
                  loaded === 0
                    ? eps.length > 0 ? eps.length < ep : true
                    : false
                }
                onClick={this.skipToNextEp}
              >
                <Icon.SkipNext />
              </IconButton>
              <IconButton disabled={loaded === 0} onClick={this.skip30Sec}>
                <Icon.Forward30 />
              </IconButton>
              <IconButton onClick={this.handleFullscreen}>
                {fullscreen ? <Icon.FullscreenExit /> : <Icon.Fullscreen />}
              </IconButton>
              <div>
                <IconButton
                  disabled={!(eps.length > 0)}
                  aria-owns={menu ? "ep-menu" : null}
                  aria-haspopup="true"
                  onClick={e => this.setState({ menuEl: e.currentTarget })}
                  color="default"
                >
                  <Icon.ViewList />
                </IconButton>
                <Menu
                  id="ep-menu"
                  anchorEl={menuEl}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right"
                  }}
                  transformOrigin={{
                    vertical: "center",
                    horizontal: "right"
                  }}
                  open={menu}
                  classes={{
                    paper: classes.menuPaper
                  }}
                  onClose={this.closeMenu}
                  PaperProps={{
                    style: {
                      width: 300,
                      padding: 0,
                      outline: "none",
                      background: grey[800]
                    }
                  }}
                  MenuListProps={{
                    style: {
                      padding: 0,
                      outline: "none"
                    }
                  }}
                >
                  <Card style={{ background: grey[800] }}>
                    <CardHeader
                      style={{ background: grey[900] }}
                      title="Episodes"
                    />
                    <Divider />
                    <CardContent className={classes.epListCont}>
                      {eps &&
                        eps.map(e => (
                          <MenuItem
                            onClick={() => {
                              this.setState({ ep: e.ep }, async () =>
                                this.loadEp(e, null)
                              );
                            }}
                            key={e.ep}
                            selected={e.ep === ep}
                            className={classes.epListItem}
                          >
                            Episode {e.ep}
                            <div style={{ flex: 1 }} />
                            {e.ep === ep ? <Icon.PlayArrow /> : null}
                          </MenuItem>
                        ))}
                    </CardContent>
                  </Card>
                </Menu>
              </div>
              <Tooltip
                PopperProps={{ PaperProps: { style: { fontSize: 16 } } }}
                title="Switch between Twist mode (recommended) or Nyaa mode (highly experimental)"
              >
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch checked={torrent} onChange={this.switchMode} />
                    }
                    label={torrent ? "Nyaa" : "Twist"}
                  />
                </FormGroup>
              </Tooltip>
            </CardActions>
          </Card>
        ) : (
          <div>
            <IconButton
              disabled={!(eps.length > 0)}
              aria-owns={menu ? "ep-menu" : null}
              aria-haspopup="true"
              onClick={e => this.setState({ menuEl: e.currentTarget })}
              color="default"
              style={{
                position: "fixed",
                bottom: theme.spacing() * 4,
                right: theme.spacing() * 4
              }}
            >
              <Icon.ViewList />
            </IconButton>
            <Menu
              id="ep-menu"
              anchorEl={menuEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right"
              }}
              transformOrigin={{
                vertical: "center",
                horizontal: "right"
              }}
              open={menu}
              classes={{
                paper: classes.menuPaper
              }}
              onClose={this.closeMenu}
              PaperProps={{
                style: {
                  width: 300,
                  padding: 0,
                  outline: "none",
                  background: grey[800]
                }
              }}
              MenuListProps={{
                style: {
                  padding: 0,
                  outline: "none"
                }
              }}
            >
              <Card style={{ background: grey[800] }}>
                <CardHeader
                  style={{ background: grey[900] }}
                  title="Episodes"
                />
                <Divider />
                <CardContent className={classes.epListCont}>
                  {eps &&
                    eps.map(e => (
                      <MenuItem
                        onClick={() => {
                          this.setState({ ep: e.ep }, async () =>
                            this.loadEp(e, null)
                          );
                        }}
                        key={e.ep}
                        selected={e.ep === ep}
                        className={classes.epListItem}
                      >
                        Episode {e.ep}
                        <div style={{ flex: 1 }} />
                        {e.ep === ep ? <Icon.PlayArrow /> : null}
                      </MenuItem>
                    ))}
                </CardContent>
              </Card>
            </Menu>
          </div>
        )}
      </div>
    );
  }
}

export default firebaseConnect()(
  connect(({ firebase: { profile }, mir }) => ({ profile, mir }))(
    withStyles(style, { withTheme: true })(DevPlayer)
  )
);
