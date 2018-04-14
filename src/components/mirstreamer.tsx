import React, { Component, MouseEvent, ChangeEvent } from "react";
import { connect } from "react-redux";
import { firebaseConnect, isEmpty } from "react-redux-firebase";
import blue from "material-ui/colors/blue";
import yellow from "material-ui/colors/yellow";
import { history } from "../store";
import localForage from "localforage";
import { getState, loadEp } from "../utils/mirfetch";
import hsfetcher from "../torrent";
import classnames from "classnames";
import { MIR_PLAY_SHOW } from "../constants";
import withStyles from "material-ui/styles/withStyles";
import grey from "material-ui/colors/grey";
import PropTypes from "prop-types";
import * as Icon from "material-ui-icons";
import CircularProgress from "material-ui/Progress/CircularProgress";
import Toolbar from "material-ui/Toolbar/Toolbar";
import Button from "material-ui/Button/Button";
import IconButton from "material-ui/IconButton/IconButton";
import Typography from "material-ui/Typography/Typography";
import Divider from "material-ui/Divider/Divider";
import Card from "material-ui/Card/Card";
import CardContent from "material-ui/Card/CardContent";
import LinearProgress from "material-ui/Progress/LinearProgress";
import CardActions from "material-ui/Card/CardActions";
import Menu from "material-ui/Menu/Menu";
import CardHeader from "material-ui/Card/CardHeader";
import MenuItem from "material-ui/Menu/MenuItem";
import Tooltip from "material-ui/Tooltip/Tooltip";
import FormGroup from "material-ui/Form/FormGroup";
import FormControlLabel from "material-ui/Form/FormControlLabel";
import Switch from "material-ui/Switch/Switch";
import TextField from "material-ui/TextField/TextField";
import ReactPlayer from "react-player";
import queryString from "query-string";
import FadeIn from "react-fade-in";
import Duration from "../components/yuplayer/Duration";
import Twist from "../twist-api";
import corrector from "../utils/bigfuck";
import Grid from "material-ui/Grid/Grid";
import { PeopleButton } from "./cardButton";
import moment from "moment";
import { Dialogue } from "./layouts";
import strings from "../strings.json";

import Avatar from "material-ui/Avatar";
import checklang from "../checklang";

const style = (theme: any) => ({
  root: {
    minHeight: "100vh",
    minWidth: "100%",
    position: "fixed",
    bottom: 0,
    top: 0,
    right: 0,
    left: 0,
    overflow: "hidden",
    animation: "playerLoad .5s ease",
    transition: theme.transitions.create(["all"]),
  },
  rootSmol: {
    minHeight: 140,
    minWidth: 240,
    position: "fixed",
    right: theme.spacing.unit * 3,
    bottom: theme.spacing.unit * 3,
    overflow: "hidden",
    boxShadow: "0 2px 16px rgba(0,0,0,.3)",
    zIndex: 3000,
    animation: "playerLoad .5s ease",
    transition: theme.transitions.create(["all"]),
    display: "flex",
    borderRadius: theme.spacing.unit,
    [theme.breakpoints.down("sm")]: {
      minHeight: 80,
      minWidth: 140,
    },
  },
  player: {
    height: "100%",
    width: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    background: "black",
    transition: theme.transitions.create(["all"]),
  },
  controlpanel: {
    position: "fixed",
    bottom: 0,
    width: "100%",
    background: "linear-gradient(to top, rgba(0,0,0,.75), rgba(0,0,0,.1))",
    transition: theme.transitions.create(["all"]),
  },
  backToolbar: {
    zIndex: 10,
    transition: theme.transitions.create(["all"]),
    "-webkitAppRegion": "drag",
    background: "linear-gradient(to top, rgba(0,0,0,.1), rgba(0,0,0,.75))",
  },
  indicator: {
    flexDirection: "row",
    padding: 0,
    display: "flex",
    position: "relative",
    marginRight: theme.spacing.unit * 2,
    marginLeft: theme.spacing.unit * 2,
    boxSizing: "border-box",
  },
  progress: {
    flex: 1,
  },
  progressVolume: {
    flex: 1,
    position: "absolute",
    margin: "7px 0",
    width: "100%",
    zIndex: -1,
  },
  progressLoaded: {
    zIndex: -1,
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
  },
  progressBg: {
    backgroundColor: "rgba(255,255,255,.3)",
  },
  progressBgOver: {
    backgroundColor: "transparent",
  },
  progressBar: {
    transition: "none",
    background: "white",
  },
  progressBarLoaded: {
    transition: "none",
    backgroundColor: "rgba(255,255,255,.6)",
  },
  duration: {
    padding: theme.spacing.unit,
    fontFamily: "SF Mono",
  },
  left: {
    padding: theme.spacing.unit,
  },
  epListCont: {
    maxHeight: 300,
    overflowY: "scroll",
    padding: 0,
  },
  epListItem: {},
  volumeSlider: {
    outline: "none",
    "-webkit-appearance": "none",
    zIndex: 5,
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
      opacity: 1,
    },
  },
  loading: {
    height: "100%",
    width: "100%",
    zIndex: 1000,
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
    padding: 0,
    margin: "auto",
    transition: theme.transitions.create(["all"]),
    color: "white",
    pointerEvents: "none",
  },
  showInfo: {
    margin: "auto",
    width: "100%",
    padding: theme.spacing.unit * 8,
    display: "flex",
    zIndex: 500,
    boxSizing: "border-box",
  },
  showInfoColumn: {
    display: "flex",
    flexDirection: "column",
    margin: 8,
  },
  showInfoTitle: {
    fontWeight: 700,
    padding: theme.spacing.unit,
    paddingLeft: 0,
    color: "white",
  },
  showInfoDesc: {
    paddingTop: theme.spacing.unit * 2,
    fontSize: 16,
  },
  showInfoArtwork: {
    width: 300,
    objectFit: "cover",
    boxShadow: "0 2px 16px rgba(0,0,0,.2)",
  },
  nextButton: {},
  nextButtonWrapper: {
    margin: theme.spacing.unit,
    position: "relative",
  },
  nextButtonProgress: {
    color: blue.A200,
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
  qualityTitle: {
    border: "2px solid white",
    borderRadius: 2,
    padding: theme.spacing.unit / 2,
    boxSizing: "border-box",
    fontSize: 14,
    fontWeight: 500,
  },
  menuPaper: {
    outline: "none",
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
      opacity: 1,
    },
  },
  piptitle: {
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
    margin: "auto",
    fontSize: theme.typography.pxToRem(12),
    paddingLeft: theme.spacing.unit,
  },
  controlpanelActions: {
    margin: theme.spacing.unit,
  },
  episodeName: {
    fontSize: ".6em",
    opacity: 0.5,
  },
  episodeCount: {
    fontSize: "1em",
  },
  episodeThumb: {
    width: 60,
    objectFit: "cover",
  },
  marginAuto: {
    margin: "auto",
  },
  secTitleText: {
    fontWeight: 700,
    fontSize: 22,
  },
});

class MirStreamer extends Component<any, any> {
  static defaultProps = {
    history,
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
    menuEl: undefined,
    showId: 0,
    recentlyWatched: 0,
    volEl: undefined,
    counter: 5,
    torrent: false,
    quality: 480,
    torrentFile: null,
    quaEl: null,
    native: false,
    cover: "",
    users: [],
    king: false,
    hoster: "",
    hosterAva: "",
    hosterPlayTime: 0,
    date: "",
    alphaMsg: true,
    id: 0,
    lang: strings.enus,
    resume: 0,
    showArtwork: '',
    showDesc: '',
    showEpisodes: null,
    showHeaders: '',
    videoQuality: 0,
    willLoadNextEp: false
  };

  async componentDidMount() {
    const playerVolume = await localForage.getItem("player-settings-volume");
    const playerUseTorrent = await localForage.getItem(
      "player-setting-torrent",
    );

    checklang(this);

    if (window['mobilecheck']()) this.setState({ native: true });

    if (playerVolume) this.setState({ volume: playerVolume });

    console.info(
      "[mirai] This feature is quite experimental, but shouldn't run into issues most of the time.",
    );

    if (localStorage.getItem("hasSeenTheAlphaMsgForStreamingLikeACoolDude")) {
      this.setState({ alphaMsg: false });
    }

    if (!isEmpty(this.props.profile) && this.props.profile) {
      const id = queryString.parse(this.props.history.location.search);
      console.log(id.s);
      if (id.s) {
        return await this.joinStream(id.s);
      } else {
        return await this.makeStream(this.props.history.location.state);
      }
    } else {
      return null;
    }
  };

  async componentWillUnmount() {
    /*if (!isEmpty(this.props.profile) && this.state.loaded > 0) {
            const episodePro = this.props.firebase
                .database()
                .ref('users')
                .child(`${this.props.profile.userID}`)
                .child('episodeProgress');
            localForage.getItem('player-state').then(async a => {
                if (a && a.showId) {
                    episodePro.child(`${a.showId}`).update(a);
                    return true;
                }
                return false;
            });
        }*/
    //this.props.removeDataFromMir(null);

    if (this.state.id !== 0) {
      if (this.state.king) {
        return await this.props.firebase
          .database()
          .ref("/streams")
          .child(this.props.profile.userID)
          .remove();
      } else {
        return await this.props.firebase
          .database()
          .ref("/streams")
          .child(this.state.id)
          .child("users")
          .child(this.props.profile.userID)
          .remove();
      }
    } else {
      return this.props.history.goBack();
    }
  };

  joinStream = async (streamId: any) => {
    const db = await this.props.firebase
      .database()
      .ref("/streams")
      .child(streamId);

    try {
      await db
        .child("users")
        .child(this.props.profile.userID)
        .update({
          name: this.props.profile.username,
          avatar: this.props.profile.avatar,
          reaction: "LOVE",
          king: false,
        });

      return db.once("value").then((value: any) => this.loadStream(value.val()));
    } catch (error) {
      return console.error(error);
    }
  };

  makeStream = async (streamData: any) => {
    const db = await this.props.firebase
      .database()
      .ref("/streams")
      .child(this.props.profile.userID);

    if (db) {
      db
        .update({
          title: streamData.title,
          cover: streamData.cover,
          eps: streamData.eps,
          id: this.props.profile.userID,
          hoster: this.props.profile.username,
          hosterAva: this.props.profile.avatar,
          users: {
            [this.props.profile.userID]: {
              name: this.props.profile.username,
              avatar: this.props.profile.avatar,
              reaction: "LOVE",
              king: true,
            },
          },
          private: false,
          playstate: {
            playing: false,
            loaded: 0,
            played: 0,
            ep: 1,
          },
          date: Date.now(),
        })
        .then(async () => {
          return await this.startStream(streamData.eps);
        });
    }
    return null;
  };

  startStream = async (eps: any) => {
    const db = await this.props.firebase
      .database()
      .ref("/streams")
      .child(this.props.profile.userID);

    // Synced info (this is for preventing playback to manually fetch ep every damn second info syncs.)
    db.on("value", (value: any) => {
      const val = value.val();
      if (val) {
        this.setState({
          title: val.title,
          cover: val.cover,
          users: val.users,
          hoster: this.props.profile.username,
          hosterAva: this.props.profile.avatar,
          date: val.date,
          id: this.props.profile.userID,
          private: val.private,
        });
      }
      return null;
    });

    //Asynced info
    this.setState(
      {
        king: true,
        eps: eps,
        ep: 1,
        playing: false,
        played: 0,
        loaded: 0,
        status: "Setting up...",
      },
      async () => {
        loadEp(this, this.state.eps[0], null);
      },
    );
  };

  loadStream = async (stream: any) => {
    const db = await this.props.firebase
      .database()
      .ref("/streams")
      .child(stream.id);
    // Synced info (this is for preventing playback to manually fetch ep every damn second info syncs.)
    db.on("value", (value: any) => {
      const val = value.val();
      if (val) {
        this.setState({
          title: val.title,
          cover: val.cover,
          users: val.users,
          hoster: val.hoster,
          hosterAva: val.hosterAva,
          date: val.date,
          private: val.private,
        });
      }
      return null;
    });

    this.setState(
      {
        king: false,
        eps: stream.eps,
        ep: stream.playstate.ep,
        playing: stream.playstate.playing,
        played: 0,
        loaded: 0,
        status: "Connecting...",
        id: stream.id,
      },
      async () => {
        loadEp(
          this,
          this.state.eps[stream.playstate.ep - 1],
          this.state.played,
        );
      },
    );
  };

  onSeekMouseDown = (e: MouseEvent<HTMLInputElement>) => {
    this.setState({ seeking: true });
  };

  onSeekChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ played: parseFloat(e.target['value']) });
  };

  onSeekMouseUp = (e: MouseEvent<HTMLInputElement>) => {
    this.setState({ seeking: false, buffering: true });
    this.player && this.player.seekTo(parseFloat(e.target['value']));
  };

  onBuffer = () => {
    this.setState({ buffering: true, status: "Buffering..." }, () => { });
  };

  onProgress = (state: any) => {
    const play = this.state.played;
    if (!this.state.seeking)
      this.setState(state, async () => {
        this.setState({
          videoQuality: this.player
            ? this.player.getInternalPlayer()['videoHeight']
            : null,
          recentlyWatched: Date.now(),
        });
        if (
          this.player !== null &&
          this.player.getInternalPlayer() &&
          this.player.getInternalPlayer()['networkState']
        ) {
          switch (this.player.getInternalPlayer()['networkState']) {
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

        if (this.state.resume !== 0) {
          const { resume } = this.state;
          this.setState({ resume: null, buffering: true }, () => {
            this.player && this.player.seekTo(resume);
            if (resume === this.state.played)
              this.setState({ buffering: false });
          });
        }
        if (!this.state.menuEl && !this.state.volEl) {
          if (this.state.king) {
            await this.props.firebase
              .database()
              .ref("/streams")
              .child(this.props.profile.userID)
              .child("playstate")
              .update({
                played: this.state.played,
                loaded: this.state.loaded,
                playing: this.state.playing,
                ep: this.state.ep,
              });
          } else {
            this.props.firebase
              .database()
              .ref("/streams")
              .child(this.state.id)
              .child("playstate")
              .on("value", async (value: any) => {
                try {
                  const val = await value.val();
                  return this.setState({
                    hosterPlayTime: val.played,
                  });
                } catch (error) {
                  return console.error(error);
                }
              });
          }
        }
      });
  };

  setVolume = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ volume: parseFloat(e.target.value) }, async () => {
      await localForage.setItem("player-settings-volume", this.state.volume);
    });
  };

  setPlaybackRate = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ playbackRate: parseFloat(e.target.value) });
  };

  draggable = undefined;

  mute = (e: ChangeEvent<HTMLInputElement>) => {
    const prevVol = this.state.volume;
    if (this.state.volume > 0) {
      this.setState({ volume: 0 });
    } else {
      this.setState({ volume: prevVol });
    }
  };

  inactivityTimeout: NodeJS.Timer;
  /* stop = () => {
        this.setState({ source: null, playing: false });
      }; */

  playPause = () => {
    this.setState({ playing: !this.state.playing });
    if (this.timer && this.timer !== undefined) clearInterval(this.timer);
  };

  skip30Sec = () => {
    this.player && this.player.seekTo(this.state.played + 18 / 1000);
  };

  skipToNextEp = () => {
    let nextEp = this.state.ep;
    nextEp += 0;
    loadEp(this, this.state.eps[nextEp], null);
    if (this.state.willLoadNextEp) this.setState({ willLoadNextEp: false });
  };

  player: ReactPlayer | null;
  closeMenu = () => this.setState({ menuEl: null });

  mouseResetDelay = () => {
    clearTimeout(this.inactivityTimeout);
    this.inactivityTimeout = setTimeout(() => {
      this.hide();
    }, 4000);
  };

  reveal = () => {
    const back = document.getElementById("backbutton");
    const controls = document.getElementById("controls");
    const pcontrols = document.getElementById("pipcontrols");
    const player = document.getElementById("player");
    if (back && (controls || pcontrols) && player) {
      back.style.opacity = '1';
      if (controls) controls.style.opacity = '1';
      if (pcontrols) pcontrols.style.opacity = '1';
      player.style.cursor = "initial";
      this.mouseResetDelay();
    }
  };

  hide = () => {
    const back = document.getElementById("backbutton");
    const controls = document.getElementById("controls");
    const pcontrols = document.getElementById("pipcontrols");
    const player = document.getElementById("player");
    if (
      back &&
      (controls || pcontrols) &&
      player &&
      this.state.loaded > 0 &&
      this.state.played < 1
    ) {
      player.style.cursor = "none";
      back.style.opacity = '0';
      if (controls) controls.style.opacity = '0';
      if (pcontrols && window['mobilecheck']() === false)
        pcontrols.style.opacity = '0';
    }
  };

  handleFullscreen = () =>
    this.setState({ fullscreen: !this.state.fullscreen }, () => {
      const docElm = document.documentElement;
      if (this.state.fullscreen) {
        if (docElm.requestFullscreen) {
          docElm.requestFullscreen();
        } else if (docElm['mozRequestFullScreen']) {
          docElm['mozRequestFullScreen']();
        } else if (docElm.webkitRequestFullScreen) {
          docElm.webkitRequestFullScreen();
        } else if (docElm['msRequestFullscreen']) {
          docElm['msRequestFullscreen']();
        }
      } else if (!this.state.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document['mozCancelFullScreen']) {
          document['mozCancelFullScreen']();
        } else if (document['msExitFullscreen']) {
          document['msExitFullscreen']();
        }
      }
    });

  skipToHostersTime = () => this.player && this.player.seekTo(this.state.hosterPlayTime);

  handleEnded = () => {
    this.reveal();
    /*if (!isEmpty(this.props.profile) && this.state.loaded > 0) {
            const episodePro = this.props.firebase
                .database()
                .ref('users')
                .child(`${this.props.profile.userID}`)
                .child('episodeProgress');
            localForage.getItem('player-state').then(async a => {
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
        }*/
  };

  timer: NodeJS.Timer | undefined;

  logTheWatch = () => {
    /*if (!isEmpty(this.props.profile) && this.state.loaded > 0) {
            const episodePro = this.props.firebase
                .database()
                .ref('users')
                .child(`${this.props.profile.userID}`)
                .child('episodeProgress');
            localForage.getItem('player-state').then(async a => {
                if (a && a.showId) {
                    episodePro.child(`${a.showId}`).update(a);
                    return true;
                }
                return false;
            });
        }*/
  };

  render() {
    const { classes, mir, theme } = this.props;
    const {
      playing,
      buffering,
      source,
      duration,
      played,
      loaded,
      volume,
      rate,
      seeking,
      fullscreen,
      status,
      title,
      menuEl,
      eps,
      ep,
      showArtwork,
      showHeaders,
      showDesc,
      volEl,
      willLoadNextEp,
      counter,
      videoQuality,
      torrent,
      quaEl,
      quality,
      native,
      cover,
      users,
      king,
      hoster,
      hosterAva,
      date,
      alphaMsg,
      lang,
    } = this.state;
    const menu = Boolean(menuEl);
    const volumeMenu = Boolean(volEl);
    const qualityMenu = Boolean(quaEl);
    return (
      <div
        id="frame"
        className={classes.root}
        onMouseLeave={
          played === 1 ? undefined : menu || volumeMenu ? undefined : this.hide
        }
        onMouseMove={this.reveal}
        onTouchMove={this.reveal}>
        <div>
          <Dialogue
            open={alphaMsg}
            title={lang.stream.title}
            actions={"ok"}
            onClose={() =>
              this.setState({ alphaMsg: false }, () =>
                localStorage.setItem(
                  "hasSeenTheAlphaMsgForStreamingLikeACoolDude",
                  'true',
                ),
              )
            }>
            <Typography variant="body1">{lang.stream.warn}</Typography>
          </Dialogue>
          <CircularProgress
            className={classes.loading}
            style={!buffering ? { opacity: 0 } : undefined}
          />
        </div>
        <Toolbar id="backbutton" className={classes.backToolbar}>
          <IconButton
            style={{
              marginLeft: -12,
              marginRight: 20,
            }}
            onClick={() => this.props.history.goBack()}>
            <Icon.ArrowBack />
          </IconButton>
          <Typography variant={"title"}>
            {king ? lang.stream.you : hoster + lang.stream.them}
          </Typography>
          <div style={{ flex: 1 }} />
          <Typography variant="body1">
            {users
              ? Array.from(users).length > 1
                ? Array.from(users).length + lang.stream.users
                : Array.from(users).length + lang.stream.user
              : undefined}
          </Typography>
        </Toolbar>
        <div onClick={this.playPause}>
          <ReactPlayer
            id="player"
            ref={(player) => {
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
              this.setState({
                playing: true,
                buffering: false,
                status: title,
              })
            }
            onPause={() => this.setState({ playing: false })}
            onEnded={this.handleEnded}
            onError={(e) => console.error(e)}
            onDuration={(dura) => this.setState({ duration: dura })}
            style={played === 1 ? { filter: "brightness(.2)" } : undefined}
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
									onLoad={e => e.currentTarget.style.opacity == undefined}
								/>
							</div>
							<div className={classes.showInfoColumn} style={{ flex: 1 }}>
								<Typography
									variant="display2"
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
          <Card id="controls" className={classes.controlpanel}>
            <CardContent className={classes.indicator}>
              <LinearProgress
                classes={{
                  root: classes.progress,
                  colorPrimary: classes.progressBgOver,
                  barColorPrimary: classes.progressBar,
                }}
                variant="determinate"
                value={played * 100}
                valueBuffer={loaded * 100}
              />
              <LinearProgress
                classes={{
                  root: classes.progressLoaded,
                  colorPrimary: classes.progressBg,
                  barColorPrimary: classes.progressBarLoaded,
                }}
                variant="determinate"
                value={loaded * 100}
              />
              <input
                className={classnames(
                  classes.progressInput,
                  "webKitThumbButton",
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
                    onClick={this.playPause}>
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
              <Tooltip title={lang.watch.streamskip}>
                <div>
                  <IconButton
                    disabled={king ? true : loaded === 0}
                    onClick={this.skipToHostersTime}>
                    <Icon.FastForward />
                  </IconButton>
                </div>
              </Tooltip>
              <Typography
                variant="title"
                className={!source ? classes.left : null}>
                {status} {played > 0 && source ? ` Episode ${ep}` : null}
              </Typography>
              <div style={{ flex: 1 }} />
              <Tooltip title={king ? lang.watch.you : hoster}>
                <Avatar
                  src={king ? this.props.profile.avatar : hosterAva}
                  style={{ border: "2px solid", borderColor: yellow.A200 }}
                />
              </Tooltip>
              {users &&
                Array.from(users)
                  .filter((u: any) => !u.king)
                  .map((user: any, index) => (
                    <Tooltip title={user.name}>
                      <Avatar key={index} src={user.avatar} />
                    </Tooltip>
                  ))}
              <IconButton
                disabled={!torrent}
                aria-owns={qualityMenu ? "quality-menu" : undefined}
                aria-haspopup="true"
                onClick={(e) => this.setState({ quaEl: e.currentTarget })}
                color="default"
                style={{ marginLeft: 8 }}>
                {torrent ? (
                  quality === 480 ? (
                    <Typography
                      variant="title"
                      className={classes.qualityTitle}>
                      480p
                    </Typography>
                  ) : quality === 720 ? (
                    <Typography
                      variant="title"
                      className={classes.qualityTitle}>
                      720p
                    </Typography>
                  ) : quality === 1080 ? (
                    <Typography
                      variant="title"
                      className={classes.qualityTitle}>
                      1080p
                    </Typography>
                  ) : null
                ) : (
                    <Typography
                      variant="title"
                      style={torrent ? undefined : { opacity: .2 }}
                      className={classes.qualityTitle}>
                      {videoQuality ? `${videoQuality}p` : "HD"}
                    </Typography>
                  )}
              </IconButton>
              <Typography variant="body1" className={classes.duration}>
                <Duration seconds={duration * played} className={''} />
              </Typography>
              <IconButton
                aria-owns={volumeMenu ? "volume-menu" : undefined}
                aria-haspopup="true"
                onClick={(e) => this.setState({ volEl: e.currentTarget })}
                color="default">
                {volume > 0 ? <Icon.VolumeUp /> : <Icon.VolumeOff />}
              </IconButton>
              <Menu
                id="volume-menu"
                anchorEl={volEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                open={volumeMenu}
                onClose={() => this.setState({ volEl: undefined })}
                PaperProps={{
                  style: {
                    outline: "none",
                    background: grey[800],
                  },
                }}
                MenuListProps={{
                  style: {
                    padding: 8,
                    outline: "none",
                    boxSizing: "border-box",
                  },
                }}>
                <LinearProgress
                  classes={{
                    root: classes.progressVolume,
                    colorPrimary: classes.progressBgOver,
                    barColorPrimary: classes.progressBar,
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
                    "webKitSlider",
                  )}
                  max={1}
                  min={0}
                  value={volume}
                  onChange={this.setVolume}
                />
              </Menu>
              <Tooltip
                title={
                  fullscreen ? lang.watch.fullscreenExit : lang.watch.fullscreen
                }>
                <IconButton onClick={this.handleFullscreen}>
                  {fullscreen ? <Icon.FullscreenExit /> : <Icon.Fullscreen />}
                </IconButton>
              </Tooltip>
              <div>
                <Tooltip title={lang.watch.showEpisodes} disableFocusListener>
                  <div>
                    <IconButton
                      disabled={
                        !king ? true : eps.length < 1 ? true : !(eps.length > 0)
                      }
                      aria-owns={menu ? "ep-menu" : undefined}
                      aria-haspopup="true"
                      onClick={(e) =>
                        this.setState({ menuEl: e.currentTarget })
                      }
                      color="default">
                      <Icon.ViewList />
                    </IconButton>
                  </div>
                </Tooltip>
                <Menu
                  id="ep-menu"
                  anchorEl={menuEl}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "center",
                    horizontal: "right",
                  }}
                  open={menu}
                  classes={{
                    paper: classes.menuPaper,
                  }}
                  onClose={this.closeMenu}
                  PaperProps={{
                    style: {
                      width: 420,
                      padding: 0,
                      outline: "none",
                      background: grey[800],
                    },
                  }}
                  MenuListProps={{
                    style: {
                      padding: 0,
                      outline: "none",
                    },
                  }}>
                  <Card style={{ background: grey[800] }}>
                    <CardHeader
                      style={{ background: grey[900] }}
                      title={lang.watch.episodes}
                      classes={{
                        action: classes.marginAuto,
                        title: classes.secTitleText,
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
                        eps.map((e: any) => (
                          <MenuItem
                            onClick={() => {
                              this.setState({ ep: e.ep }, async () =>
                                loadEp(this, e, null),
                              );
                            }}
                            key={e.ep}
                            selected={e.ep === ep}
                            className={classes.epListItem}>
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
                                paddingLeft: 8,
                              }}>
                              <Typography
                                variant="title"
                                className={classes.episodeCount}>
                                Episode {e.ep}
                              </Typography>
                              {e.canon ? (
                                <Typography
                                  variant="body1"
                                  className={classes.episodeName}>
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
                aria-owns={menu ? "ep-menu" : undefined}
                aria-haspopup="true"
                onClick={(e) => this.setState({ menuEl: e.currentTarget })}
                color="default"
                style={{
                  position: "fixed",
                  bottom: theme.spacing.unit * 4,
                  right: theme.spacing.unit * 4,
                }}>
                <Icon.ViewList />
              </IconButton>
              <Menu
                id="ep-menu"
                anchorEl={menuEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "center",
                  horizontal: "right",
                }}
                open={menu}
                classes={{
                  paper: classes.menuPaper,
                }}
                onClose={this.closeMenu}
                PaperProps={{
                  style: {
                    width: 300,
                    padding: 0,
                    outline: "none",
                    background: grey[800],
                  },
                }}
                MenuListProps={{
                  style: {
                    padding: 0,
                    outline: "none",
                  },
                }}>
                <Card style={{ background: grey[800] }}>
                  <CardHeader
                    style={{ background: grey[900] }}
                    title="Episodes"
                  />
                  <Divider />
                  <CardContent className={classes.epListCont}>
                    {eps &&
                      eps.map((e: any) => (
                        <MenuItem
                          onClick={() => {
                            this.setState({ ep: e.ep }, async () =>
                              loadEp(e, null),
                            );
                          }}
                          key={e.ep}
                          selected={e.ep === ep}
                          className={classes.epListItem}>
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

export const loadPlayer = (play: any) => ({
  type: MIR_PLAY_SHOW,
  play,
});

const mapPTS = (dispatch: any) => ({
  removeDataFromMir: (play: any) => dispatch(loadPlayer(play)),
});

export default firebaseConnect()(
  connect(({ firebase: { profile }, mir }: any) => ({ profile, mir }), mapPTS)(
    withStyles(style as any, { withTheme: true })(MirStreamer),
  ),
);
