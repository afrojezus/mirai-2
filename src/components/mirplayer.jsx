// TODO: Fix every single eslint-airbnb issue
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-closing-tag-location */
import React, { Component } from "react";
import classnames from "classnames";
import * as Icon from "@material-ui/icons";
import {
  Card,
  CardHeader,
  CardActions,
  CardContent,
  Typography,
  IconButton,
  CircularProgress,
  Divider,
  LinearProgress,
  withStyles,
  Toolbar,
  Tooltip,
  Menu,
  MenuItem
} from "@material-ui/core";
import { grey, blue } from "@material-ui/core/colors";
import ReactPlayer from "react-player";
import localForage from "localforage";
import { connect } from "react-redux";
import { firebaseConnect, isEmpty } from "react-redux-firebase";
import { history } from "../store";
import Duration from "../components/yuplayer/Duration";
import { getState, loadEp } from "../utils/mirfetch";
import { MIR_PLAY_SHOW } from "../constants";
import { guid } from "../utils/uuid";
import strings from "../strings.json";
import checklang from "../checklang";

const style = theme => ({
  root: {
    minHeight: "100vh",
    minWidth: "100%",
    position: "fixed",
    bottom: 0,
    top: 0,
    right: 0,
    left: 0,
    animation: "playerLoad .5s ease",
    transition: theme.transitions.create(["all"])
  },
  rootSmol: {
    minHeight: 140,
    minWidth: 240,
    position: "fixed",
    right: theme.spacing() * 3,
    bottom: theme.spacing() * 3,
    overflow: "hidden",
    boxShadow: "0 2px 16px rgba(0,0,0,.3)",
    zIndex: 3000,
    animation: "playerLoad .5s ease",
    transition: theme.transitions.create(["all"]),
    display: "flex",
    borderRadius: theme.spacing(),
    [theme.breakpoints.down("sm")]: {
      minHeight: 80,
      minWidth: 140
    }
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
    bottom: 0,
    width: "100%",
    background: "linear-gradient(to top, rgba(0,0,0,.75), rgba(0,0,0,.1))",
    transition: theme.transitions.create(["all"])
  },
  backToolbar: {
    zIndex: 10,
    transition: theme.transitions.create(["all"]),
    "-webkitAppRegion": "drag",
    background: "linear-gradient(to top, rgba(0,0,0,.1), rgba(0,0,0,.75))"
  },
  indicator: {
    flexDirection: "row",
    padding: 0,
    display: "flex",
    position: "relative",
    marginRight: theme.spacing() * 2,
    marginLeft: theme.spacing() * 2,
    boxSizing: "border-box"
  },
  progress: {
    flex: 1
  },
  progressVolume: {
    flex: 1,
    position: "absolute",
    margin: "7px 0",
    width: "100%",
    zIndex: -1
  },
  progressLoaded: {
    zIndex: -1,
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%"
  },
  progressBg: {
    backgroundColor: "rgba(255,255,255,.1)"
  },
  progressBgOver: {
    backgroundColor: "transparent"
  },
  progressBar: {
    transition: "none"
  },
  progressBarLoaded: {
    backgroundColor: "rgba(255,255,255,.4)"
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
    outline: "none",
    "-webkit-appearance": "none",
    zIndex: 5
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
    zIndex: 1000,
    padding: 0,
    margin: "auto",
    transition: theme.transitions.create(["all"]),
    color: "white",
    pointerEvents: "none"
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
  },
  pipcontrols: {
    margin: "auto",
    display: "flex",
    flexFlow: "column wrap",
    zIndex: "3000",
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    transition: theme.transitions.create(["all"]),
    opacity: 0,
    background: "linear-gradient(to bottom, transparent, rgba(0,0,0,.95))",
    [theme.breakpoints.down("sm")]: {
      opacity: 1
    }
  },
  piptitle: {
    [theme.breakpoints.down("sm")]: {
      display: "none"
    },
    margin: "auto",
    fontSize: theme.typography.pxToRem(12),
    paddingLeft: theme.spacing()
  },
  controlpanelActions: {
    margin: theme.spacing()
  },
  episodeName: {
    fontSize: ".6em",
    opacity: 0.5
  },
  episodeCount: {
    fontSize: "1em"
  },
  episodeThumb: {
    width: 60,
    objectFit: "cover"
  },
  marginAuto: {
    margin: "auto"
  },
  secTitleText: {
    fontWeight: 700,
    fontSize: 22
  }
});

class MirPlayer extends Component {
  static defaultProps = {
    history
  };
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
    recentlyWatched: 0,
    volEl: null,
    counter: 5,
    torrent: false,
    quality: 480,
    torrentFile: null,
    quaEl: null,
    native: false,
    lang: strings.enus
  };

  componentWillMount = async () => {
    const playerVolume = await localForage.getItem("player-settings-volume");
    checklang(this);

    if (window.mobilecheck()) this.setState({ native: true });

    if (playerVolume) this.setState({ volume: playerVolume });

    /* if (playerUseTorrent) this.setState({ torrent: playerUseTorrent });
                else return; */

    /*	this.draggable = new Draggable(document.getElementById('frame'), {
            draggable: !this.props.fullSize ? '#frame' : null
        }) */
  };
  // TODO: Fix loading
  componentWillReceiveProps = async nextProps => {
    if (this.props.mir !== nextProps.mir) {
      if (this.props.profile !== nextProps.profile) return false;
      if (!this.props.fullSize) {
        this.logTheWatch();
      }
      await getState(this);
    }
    return false;
  };

  logToActivity = () => {
    const id = guid();
    if (isEmpty(this.props.profile)) {
      return null;
    }
    if (this.state.loaded < 0) {
      return null;
    }

    if (
      this.props.profile.completed &&
      this.props.profile.completed.show &&
      this.props.profile.completed.show[this.state.showId]
    ) {
      if (
        !isEmpty(this.props.profile) &&
        this.props.profile.username &&
        this.props.profile.willLog
      ) {
        return this.props.firebase
          .ref("/users")
          .child(this.props.profile.userID)
          .child("feed")
          .child(id)
          .update({
            date: Date.now(),
            id,
            type: "REWATCH",
            showId: this.state.showId,
            activity: `Rewatched ${this.state.eps.length > 1
              ? "Episode " + this.state.ep + " of"
              : ""
              } ${this.state.title}`,
            coverImg: this.state.showArtwork,
            user: {
              username: this.props.profile.username,
              avatar: this.props.profile.avatar,
              userID: this.props.profile.userID
            }
          });
      }
    } else {
      return this.props.firebase
        .ref("/users")
        .child(this.props.profile.userID)
        .child("feed")
        .child(id)
        .update({
          date: Date.now(),
          id,
          type: "WATCH",
          showId: this.state.showId,
          activity: `Watched ${this.state.eps.length > 1 ? "Episode " + this.state.ep + " of" : ""
            } ${this.state.title}`,
          coverImg: this.state.showArtwork,
          user: {
            username: this.props.profile.username,
            avatar: this.props.profile.avatar,
            userID: this.props.profile.userID
          }
        });
    }
    return null;
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

    this.props.removeDataFromMir(null);
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
          videoQuality: this.player
            ? this.player.getInternalPlayer().videoHeight
            : null,
          recentlyWatched: Date.now()
        });
        if (!isEmpty(this.props.profile)) {
          await this.props.firebase.updateProfile({
            status: `Watching ${this.state.title} Episode ${this.state.ep}`
          });
        }
        if (
          this.player !== null &&
          this.player.getInternalPlayer() &&
          this.player.getInternalPlayer().networkState
        ) {
          switch (this.player.getInternalPlayer().networkState) {
            case 1:
              this.setState({ buffering: false });
              break;
            case 2:
              this.setState({ buffering: false });
              break;
            default:
              break;
          }
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

  draggable = undefined;

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
    nextEp += 0;
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
    const pcontrols = document.getElementById("pipcontrols");
    const player = document.getElementById("player");
    if (back && (controls || pcontrols) && player) {
      back.style.opacity = 1;
      if (controls) controls.style.opacity = 1;
      if (pcontrols) pcontrols.style.opacity = 1;
      player.style.cursor = "initial";
      this.mouseResetDelay();
    }
  };

  hide = () => {
    const back = document.getElementById("backbutton");
    const controls = document.getElementById("controls");
    const pcontrols = document.getElementById("pipcontrols");
    const player = document.getElementById("player");
    const epMenu = this.state.menuEl;
    const volMenu = this.state.volEl;
    if (
      back &&
      (controls || pcontrols) &&
      player &&
      this.state.loaded > 0 &&
      this.state.played < 1
    ) {
      player.style.cursor = "none";
      back.style.opacity = 0;
      if (epMenu) this.closeMenu();
      if (volMenu) this.setState({ volEl: null });
      if (controls) controls.style.opacity = 0;
      if (pcontrols && window.mobilecheck() === false)
        pcontrols.style.opacity = 0;
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

  logTheWatch = async () => {
    if (
      !isEmpty(this.props.profile) &&
      this.state.loaded > 0 &&
      !this.state.seeking
    ) {
      await this.props.firebase.updateProfile({
        status: `Watching ${this.state.title} ${this.state.eps.length > 1 ? "Episode " + this.state.ep : null
          }`
      });
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

  render() {
    const { classes, mir, fullSize, theme } = this.props;
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
      videoQuality,
      torrent,
      quaEl,
      quality,
      native,
      lang
    } = this.state;
    const menu = Boolean(menuEl);
    const volumeMenu = Boolean(volEl);
    const qualityMenu = Boolean(quaEl);
    if (!mir.play) return null;
    return (
      <div
        id="frame"
        style={!mir.play ? { display: "none" } : null}
        className={!fullSize ? classes.rootSmol : classes.root}
        onMouseLeave={
          played === 1 ? null : menu || volumeMenu ? null : this.hide
        }
        onMouseMove={this.reveal}
        onTouchMove={this.reveal}
      >
        {!fullSize ? (
          <div
            className={classes.pipcontrols}
            style={!loaded > 0 ? { opacity: 0 } : null}
            id="pipcontrols"
          >
            <div
              style={{ display: "flex", padding: window.mobilecheck() ? 0 : 8 }}
            >
              <Typography
                variant="h6"
                className={classes.piptitle}
                style={{ textAlign: "left" }}
              >
                {status} {loaded > 0 ? `EP ${ep}` : null}
              </Typography>
              <div style={{ flex: 1 }} />
              {loaded > 0 ? (
                <IconButton onClick={this.playPause}>
                  {playing ? <Icon.Pause /> : <Icon.PlayArrow />}
                </IconButton>
              ) : null}
              <IconButton onClick={() => this.props.history.push("/watch")}>
                <Icon.PictureInPicture />
              </IconButton>
              <IconButton
                onClick={() => {
                  this.props.removeDataFromMir(null);
                  this.logTheWatch();
                  this.logToActivity();
                  this.setState({
                    playing: false,
                    buffering: true,
                    source: "",
                    duration: 0,
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
                    recentlyWatched: 0,
                    volEl: null,
                    counter: 5,
                    torrent: false,
                    quality: 480,
                    torrentFile: null,
                    quaEl: null
                  });
                }}
              >
                <Icon.Close />
              </IconButton>
            </div>
          </div>
        ) : null}
        <div
          style={
            !fullSize && !window.mobilecheck()
              ? { position: "relative", height: 140, width: "100%", display: "flex", pointerEvents: "none" }
              : !fullSize && window.mobilecheck()
                ? { position: "relative", height: 80, width: "100%", display: "flex", pointerEvents: "none" }
                : { display: "flex", pointerEvents: "none", position: "absolute", height: "100%", width: "100%" }
          }
        >
          <CircularProgress
            className={classes.loading}
            style={!buffering ? { opacity: 0 } : null}
          />
        </div>
        <Toolbar
          id="backbutton"
          className={classes.backToolbar}
          style={!fullSize ? { display: "none" } : null}
        >
          <IconButton
            style={{
              marginLeft: -12,
              marginRight: 20
            }}
            onClick={() => this.props.history.goBack()}
          >
            <Icon.ArrowBack />
          </IconButton>
        </Toolbar>
        <div onClick={this.playPause}>
          <ReactPlayer
            id="player"
            ref={player => {
              this.player = player;
            }}
            url={source}
            volume={volume}
            playing={playing}
            controls={native}
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
            onDuration={dura => this.setState({ duration: dura })}
            style={played === 1 ? { filter: "brightness(.2)" } : null}
          />
        </div>
        {/*played === 1 ? (
					<FadeIn>
						<div className={classes.showInfo}>
							<div className={classes.showInfoColumn}>
								<img
									src={showArtwork}
									alt=""
									className={classes.showInfoArtwork}
									style={{ opacity: 0 }}
									onLoad={e => e.currentTarget.style.opacity == null}
								/>
							</div>
							<div className={classes.showInfoColumn} style={{ flex: 1 }}>
								<Typography
									variant="h3"
									className={classes.showInfoTitle}
								>
									{title}
								</Typography>
								<Divider />
								<Typography
									variant="body1"
									className={classes.showInfoDesc}
									dangerouslySetInnerHTML={{ __html: showDesc }}
								/>
							</div>
						</div>
					</FadeIn>
				) : null*/}
        {!native ? (
          <Card
            id="controls"
            className={classes.controlpanel}
            style={!fullSize ? { display: "none" } : { overflow: "initial" }}
          >
            <CardContent className={classes.indicator}>
              <LinearProgress
                classes={{
                  root: classes.progress,
                  colorPrimary: classes.progressBgOver,
                  barColorPrimary: classes.progressBar
                }}
                variant="determinate"
                value={played * 100}
                valueBuffer={loaded * 100}
              />
              <LinearProgress
                classes={{
                  root: classes.progressLoaded,
                  colorPrimary: classes.progressBg,
                  barColorPrimary: classes.progressBarLoaded
                }}
                variant="determinate"
                value={loaded * 100}
              />
              <input
                className={classnames(
                  classes.progressInput,
                  "webKitThumbButton"
                )}
                type="range"
                step="any"
                max={0.999}
                min={0.001}
                value={played}
                onMouseDown={this.onSeekMouseDown}
                onChange={this.onSeekChange}
                onMouseUp={this.onSeekMouseUp}
              />
            </CardContent>
            <CardActions className={classes.controlpanelActions}>
              <Tooltip title={playing ? lang.watch.pause : lang.watch.play}>
                <div>
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
                </div>
              </Tooltip>
              <Typography
                variant="h6"
                className={!source ? classes.left : null}
              >
                {status} {played > 0 && source ? ` Episode ${ep}` : null}
              </Typography>
              <div style={{ flex: 1 }} />
              <IconButton
                disabled={!torrent}
                aria-owns={qualityMenu ? "quality-menu" : null}
                aria-haspopup="true"
                onClick={e => this.setState({ quaEl: e.currentTarget })}
                color="default"
              >
                {torrent ? (
                  quality === 480 ? (
                    <Typography
                      variant="h6"
                      className={classes.qualityTitle}
                    >
                      480p
                    </Typography>
                  ) : quality === 720 ? (
                    <Typography
                      variant="h6"
                      className={classes.qualityTitle}
                    >
                      720p
                    </Typography>
                  ) : quality === 1080 ? (
                    <Typography
                      variant="h6"
                      className={classes.qualityTitle}
                    >
                      1080p
                    </Typography>
                  ) : null
                ) : (
                  <Typography
                    variant="h6"
                    style={torrent ? null : { opacity: ".2" }}
                    className={classes.qualityTitle}
                  >
                    {videoQuality ? `${videoQuality}p` : "HD"}
                  </Typography>
                )}
              </IconButton>
              <Typography variant="body1" className={classes.duration}>
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
                    outline: "none",
                    boxSizing: "border-box"
                  }
                }}
              >
                <LinearProgress
                  classes={{
                    root: classes.progressVolume,
                    colorPrimary: classes.progressBgOver,
                    barColorPrimary: classes.progressBar
                  }}
                  variant="determinate"
                  value={volume * 100}
                />
                <input
                  step="any"
                  type="range"
                  className={classnames(
                    classes.volumeSlider,
                    "webKitThumbButton",
                    "webKitSlider"
                  )}
                  max={1}
                  min={0}
                  value={volume}
                  onChange={this.setVolume}
                />
              </Menu>
              <Tooltip title={lang.watch.skipToNextEp}>
                <div>
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
                </div>
              </Tooltip>
              <Tooltip title={lang.watch.skipTo30sec}>
                <div>
                  <IconButton disabled={loaded === 0} onClick={this.skip30Sec}>
                    <Icon.Forward30 />
                  </IconButton>
                </div>
              </Tooltip>
              <Tooltip
                title={
                  fullscreen ? lang.watch.fullscreenExit : lang.watch.fullscreen
                }
              >
                <IconButton onClick={this.handleFullscreen}>
                  {fullscreen ? <Icon.FullscreenExit /> : <Icon.Fullscreen />}
                </IconButton>
              </Tooltip>
              <div>
                <Tooltip title={lang.watch.showEpisodes}>
                  <div>
                    <IconButton
                      disabled={eps.length < 1 ? true : !(eps.length > 0)}
                      aria-owns={menu ? "ep-menu" : null}
                      aria-haspopup="true"
                      onClick={e => this.setState({ menuEl: e.currentTarget })}
                      color="default"
                    >
                      <Icon.ViewList />
                    </IconButton>
                  </div>
                </Tooltip>
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
                      width: 420,
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
                      title={lang.watch.episodes}
                      classes={{
                        action: classes.marginAuto,
                        title: classes.secTitleText
                      }}
                      action={
                        <IconButton onClick={this.closeMenu}>
                          <Icon.ExpandMore />
                        </IconButton>
                      }
                    />
                    <Divider />
                    <CardContent className={classes.epListCont}>
                      {eps &&
                        eps.map(e => (
                          <MenuItem
                            onClick={() => {
                              this.logToActivity();
                              this.setState({ ep: e.ep }, async () =>
                                loadEp(this, e, null)
                              );
                            }}
                            key={e.ep}
                            selected={e.ep === ep}
                            className={classes.epListItem}
                          >
                            {e.thumb ? (
                              <img
                                alt=""
                                className={classes.episodeThumb}
                                src={e.thumb.original}
                              />
                            ) : null}
                            <div
                              style={{
                                display: "flex",
                                flexFlow: "column nowrap",
                                paddingLeft: 8
                              }}
                            >
                              <Typography
                                variant="h6"
                                className={classes.episodeCount}
                              >
                                Episode {e.ep}
                              </Typography>
                              {e.canon ? (
                                <Typography
                                  variant="body1"
                                  className={classes.episodeName}
                                >
                                  {e.canon}
                                </Typography>
                              ) : null}
                            </div>
                            <div style={{ flex: 1 }} />
                            {e.ep === ep ? <Icon.PlayArrow /> : null}
                          </MenuItem>
                        ))}
                    </CardContent>
                  </Card>
                </Menu>
              </div>
              {/* <Tooltip
          PopperProps={{ PaperProps: { style: { fontSize: 16 } } }}
          title="Switch between Twist mode (recommended) or Nyaa mode (highly experimental)"
        >
          <FormGroup>
            <FormControlLabel
              disabled
              control={
                <Switch checked={torrent} onChange={this.switchMode} />
									}
              label={torrent ? 'Nyaa' : 'Twist'}
            />
          </FormGroup>
        </Tooltip> */}
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
                  width: 420,
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
                  classes={{
                    action: classes.marginAuto,
                    title: classes.secTitleText
                  }}
                  action={
                    <IconButton onClick={this.closeMenu}>
                      <Icon.ExpandMore />
                    </IconButton>
                  }
                />
                <Divider />
                <CardContent className={classes.epListCont}>
                  {eps &&
                    eps.map(e => (
                      <MenuItem
                        onClick={() => {
                          this.setState({ ep: e.ep }, async () =>
                            loadEp(this, e, null)
                          );
                        }}
                        key={e.ep}
                        selected={e.ep === ep}
                        className={classes.epListItem}
                      >
                        {e.thumb ? (
                          <img
                            alt=""
                            className={classes.episodeThumb}
                            src={e.thumb.original}
                          />
                        ) : null}
                        <div
                          style={{
                            display: "flex",
                            flexFlow: "column nowrap",
                            paddingLeft: 8
                          }}
                        >
                          <Typography
                            variant="h6"
                            className={classes.episodeCount}
                          >
                            Episode {e.ep}
                          </Typography>
                          {e.canon ? (
                            <Typography
                              variant="body1"
                              className={classes.episodeName}
                            >
                              {e.canon}
                            </Typography>
                          ) : null}
                        </div>
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

export const loadPlayer = play => ({
  type: MIR_PLAY_SHOW,
  play
});

const mapPTS = dispatch => ({
  removeDataFromMir: play => dispatch(loadPlayer(play))
});

export default firebaseConnect()(
  connect(({ firebase: { profile }, mir }) => ({ profile, mir }), mapPTS)(
    withStyles(style, { withTheme: true })(MirPlayer)
  )
);
