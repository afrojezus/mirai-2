// TODO: Fix every single eslint-airbnb issue
import React, { Component } from "react";
import * as M from "@material-ui/core";
import * as Icon from "@material-ui/icons";
import Dropzone from "react-dropzone";
import localForage from "localforage";
import { connect } from "react-redux";
import { firebaseConnect } from "react-redux-firebase";
import { clientID } from "../utils/segoku/config.json";
import AniList from "../anilist-api";
import {
  TitleHeader,
  Header,
  Column,
  Row,
  Dialogue
} from "../components/layouts";

import strings from "../strings.json";
import { scrollFix } from "./../utils/scrollFix";
import colorizer from "../utils/colorizer";

const style = theme => ({
  root: {
    height: "100%",
    width: "100%",
    position: "relative",
    transition: theme.transitions.create(["all"])
  },
  bgImage: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.4,
    height: "100vh",
    objectFit: "cover",
    width: "100%",
    zIndex: -1,
    background: M.colors.blue[700]
  },
  content: {
    marginLeft: "auto",
    marginRight: "auto",
    padding: 24,
    maxWidth: 1500,
    paddingTop: theme.spacing() * 12,
    display: "flex",
    flexDirection: "column"
  },
  header: {
    position: "relative"
  },
  title: {
    color: "white",
    fontWeight: 600,
    textShadow: "0 3px 16px rgba(0,0,0,.4)",
    padding: theme.spacing() * 2,
    paddingBottom: theme.spacing() * 8
  },
  icon: {
    boxShadow: "0 1px 12px rgba(0,0,0,.2)",
    color: "white",
    height: 92,
    width: 92,
    zIndex: -1,
    background: "linear-gradient(to top, #0044aa 0%, #0066ff 70%)",
    borderRadius: "50%",
    padding: theme.spacing() * 2
  },
  panel: {
    width: "100%"
  },
  divide: {
    margin: theme.spacing()
  },
  headline: {
    padding: theme.spacing()
  },
  ava: {
    height: "100%",
    width: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    objectFit: "cover",
    transition: theme.transitions.create(["all"])
  },
  bg: {
    height: "100%",
    width: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    objectFit: "cover",
    transition: theme.transitions.create(["all"])
  },
  dropzone: {
    height: 256,
    width: 256,
    position: "relative",
    borderRadius: "50%",
    margin: "auto",
    border: "2px solid white",
    "&:hover > div": {
      filter: "brightness(0.5)"
    },
    "&:hover > svg": {
      opacity: 1
    },
    transition: theme.transitions.create(["all"]),
    zIndex: 1000,
    cursor: "pointer"
  },
  dropzoneBg: {
    height: 256,
    width: 480,
    position: "relative",
    margin: "auto",
    border: "2px solid white",
    "&:hover > img": {
      filter: "brightness(0.5)"
    },
    "&:hover > svg": {
      opacity: 1
    },
    zIndex: 1000,
    transition: theme.transitions.create(["all"]),
    cursor: "pointer"
  },
  column: {
    flexBasis: "33.3%"
  },
  avaImg: {
    height: "100%",
    width: "100%",
    objectFit: "cover",
    borderRadius: "50%"
  },
  pictureIcon: {
    top: "50%",
    left: "50%",
    position: "absolute",
    transform: "translate(-50%,-50%)",
    color: "white",
    fontSize: 48,
    opacity: 0,
    transition: theme.transitions.create(["all"])
  }
});

class Settings extends Component {
  state = {
    ava: null,
    bg: null,
    nick: "",
    user: "",
    email: "",
    pass: "",
    motto: "",
    avaLoading: false,
    bgLoading: false,
    loading: true,
    theme: "Mirai",
    langCode: "en-us",
    lang: strings.enus,
    langVal: "",
    deleteDialog: false,
    hasEnteredTwist: false,
    ALToken: ""
  };

  componentWillMount = () => {
    scrollFix();
    this.getColors();
    const lang = localStorage.getItem("language");
    switch (lang) {
      case "en-us":
        this.setState({ lang: strings.enus, langCode: "en-us" });
        break;

      case "nb-no":
        this.setState({ lang: strings.nbno, langCode: "nb-no" });
        break;

      case "jp":
        this.setState({ lang: strings.jp, langCode: "jp" });
        break;

      default:
        break;
    }
  };

  enableTwist = () => {
    AniList.auth(this.state.ALToken);
    this.setState({ hasEnteredTwist: false }, () => { });
  };

  triggerTwist = () => {
    window.open(
      `https://anilist.co/api/v2/oauth/authorize?client_id=${clientID}&response_type=token`
    );
    this.setState({ hasEnteredTwist: true });
  };

  removeTwist = () => localStorage.removeItem("ALTOKEN");

  getColors = () => {
    const hue = localStorage.getItem("user-hue");
    if (hue) {
      let hues = JSON.parse(hue);
      return this.setState({
        hue: hues.hue,
        hueVib: hues.hueVib,
        hueVibN: hues.hueVibN
      });
    } else {
      return null;
    }
  };

  componentDidMount = () =>
    setTimeout(() => this.setState({ loading: false }), 300);

  changeLangVal = event => {
    this.setState({
      langVal: event.target.value,
      langCode: event.target.value
    });
  };

  changeLang = value =>
    this.setState({ langCode: value, langVal: null }, () => {
      localStorage.setItem("language", this.state.langCode);
      window.location.reload();
    });

  handleAva = accept =>
    accept.forEach(file => this.setState({ ava: file }, () => { }));

  changeAva = () =>
    this.setState({ avaLoading: true }, async () => {
      const ava = this.props.firebase
        .storage()
        .ref("userData")
        .child("avatar")
        .child(this.state.ava.name)
        .put(this.state.ava);

      ava.on(
        "state_changed",
        () => { },
        error => console.error(error),
        () => {
          // console.log(ava);
          this.props.firebase
            .updateProfile({
              avatar: ava.snapshot.downloadURL
            })
            .then(() => {
              console.info("Avatar updated.");
              this.setState({ avaLoading: false, ava: null });
            });
        }
      );
    });

  handleBg = accept =>
    accept.forEach(file => this.setState({ bg: file }, () => { }));

  changeBg = () =>
    this.setState({ bgLoading: true }, async () => {
      const bg = this.props.firebase
        .storage()
        .ref("userData")
        .child("header")
        .child(this.state.bg.name)
        .put(this.state.bg);

      bg.on(
        "state_changed",
        () => { },
        error => console.error(error),
        () => {
          // console.log(bg);
          this.props.firebase
            .updateProfile({ headers: bg.snapshot.downloadURL })
            .then(() => {
              colorizer(this.props.profile.headers)
                .then(pal => {
                  let hues = {
                    hue: pal.DarkMuted && pal.DarkMuted.getHex(),
                    hueVib: pal.LightVibrant && pal.LightVibrant.getHex(),
                    hueVibN: pal.DarkVibrant && pal.DarkVibrant.getHex(),
                    hueAccent: pal.Vibrant && pal.Vibrant.getHex()
                  };
                  console.info("Background updated.");
                  localStorage.setItem("user-hue", JSON.stringify(hues));
                  return this.setState({ bgLoading: false, bg: null }, () =>
                    window.location.reload()
                  );
                })
                .catch(error => {
                  console.error(error);
                  console.info("Background updated, but with errors.");
                  return this.setState({ bgLoading: false, bg: null });
                });
            })
            .catch(error => {
              console.error(error);
              console.info("Background upload failed.");
              return this.setState({ bgLoading: false, bg: null });
            });
        }
      );
    });

  changeNick = async () =>
    this.props.firebase
      .updateProfile({ nick: this.state.nick })
      .then(() => console.info("Nickname updated."));

  changeUsername = async () =>
    this.props.firebase
      .updateProfile({
        username: this.state.user
      })
      .then(() => console.info("Username updated."));

  changeMotto = async () =>
    this.props.firebase
      .updateProfile({ motto: this.state.motto })
      .then(() => console.info("Motto updated."));

  changeEmail = async () => { };

  changePass = () => { };

  changeContriSetting = async (e, check) => {
    const set = this.props.profile.noMine;
    if (set) this.props.firebase.updateProfile({ noMine: false });
    else this.props.firebase.updateProfile({ noMine: true });
  };

  changeLogSetting = async (e, check) => {
    const set = this.props.profile.willLog;
    if (set) this.props.firebase.updateProfile({ willLog: false });
    else this.props.firebase.updateProfile({ willLog: true });
  };

  changeLogPrivate = async (e, check) => {
    const set = this.props.profile.privateLog;
    if (set) this.props.firebase.updateProfile({ privateLog: false });
    else this.props.firebase.updateProfile({ privateLog: true });
  };

  deleteLogg = async () =>
    this.props.firebase
      .ref("users")
      .child(this.props.profile.userID)
      .child("feed")
      .remove();

  deleteMyAccount = async () => {
    const db = this.props.firebase
      .ref("users")
      .child(this.props.profile.userID);
    try {
      await db.remove();
      return this.props.firebase
        .logout()
        .then(async () =>
          localForage.removeItem("user", async () => {
            localStorage.removeItem("user-hue");
            this.props.history.push("/setup");
            await localForage.removeItem("player-state");
          })
        )
        .catch(err => console.error(err.message));
    } catch (error) {
      return console.error(error);
    }
  };

  render() {
    const { classes, theme } = this.props;
    const {
      langCode,
      lang,
      langVal,
      hue,
      deleteDialog,
      hasEnteredTwist,
      ALToken
    } = this.state;
    const user = this.props.profile;
    if (!user) return null;
    return (
      <div>
        <TitleHeader
          title={lang.settings.settings}
          color={hue ? hue : "#000"}
        />
        <Header color={hue ? hue : null} />
        <div className={classes.root}>
          <M.Grid
            container
            spacing={0}
            style={{
              marginTop: window.mobilecheck() ? 0 : theme.spacing() * 16
            }}
            className={classes.content}
          >
            <M.Typography variant="h5" className={classes.headline}>
              {lang.settings.aesthetics}
            </M.Typography>
            <M.ExpansionPanel
              style={{ background: hue ? hue : null }}
              className={classes.panel}
            >
              <M.ExpansionPanelSummary expandIcon={<Icon.ExpandMore />}>
                <div className={classes.column}>
                  <M.Typography variant="h6">
                    {lang.settings.language}
                  </M.Typography>
                </div>
                <div className={classes.column}>
                  <M.Typography variant="body1">{langCode}</M.Typography>
                </div>
              </M.ExpansionPanelSummary>
              <M.ExpansionPanelDetails>
                <Column>
                  <M.Typography variant="body1">
                    {lang.settings.languageDesc}
                  </M.Typography>
                  <form>
                    <M.FormControl>
                      <M.Select value={langCode} onChange={this.changeLangVal}>
                        <M.MenuItem value="en-us">
                          <span role="img" aria-label="English">
                            🇬🇧
                          </span>{" "}
                          English
                        </M.MenuItem>
                        <M.MenuItem value="nb-no">
                          <span role="img" aria-label="Norsk Bokmål">
                            🇳🇴
                          </span>{" "}
                          Norsk Bokmål
                        </M.MenuItem>
                        <M.MenuItem value="jp">
                          <span role="img" aria-label="Norsk Bokmål">
                            🇯🇵
                          </span>{" "}
                          日本語
                        </M.MenuItem>
                      </M.Select>
                    </M.FormControl>
                  </form>
                </Column>
              </M.ExpansionPanelDetails>
              <M.ExpansionPanelActions>
                {langVal ? (
                  <M.Button
                    onClick={() =>
                      this.setState({
                        langCode: localStorage.getItem("language"),
                        langVal: null
                      })
                    }
                  >
                    {lang.settings.cancel}
                  </M.Button>
                ) : null}
                {langVal ? (
                  <M.Button
                    onClick={() => this.changeLang(langVal)}
                    color="primary"
                  >
                    {lang.settings.accept}
                  </M.Button>
                ) : null}
              </M.ExpansionPanelActions>
            </M.ExpansionPanel>
            <M.ExpansionPanel
              style={{ background: hue ? hue : null }}
              className={classes.panel}
            >
              <M.ExpansionPanelSummary expandIcon={<Icon.ExpandMore />}>
                <div className={classes.column}>
                  <M.Typography variant="h6">
                    {lang.settings.avatar}
                  </M.Typography>
                </div>
                <div className={classes.column}>
                  <M.Avatar
                    classes={{ img: classes.avaImg }}
                    className={classes.secondaryHeading}
                    src={user.avatar}
                  />
                </div>
              </M.ExpansionPanelSummary>
              <M.ExpansionPanelDetails>
                <Column>
                  <Dropzone
                    className={classes.dropzone}
                    multiple={false}
                    onDrop={this.handleAva}
                  >
                    <M.Avatar
                      classes={{ img: classes.avaImg }}
                      className={classes.ava}
                      src={
                        this.state.ava ? this.state.ava.preview : user.avatar
                      }
                    />
                    <Icon.CloudUpload className={classes.pictureIcon} />
                  </Dropzone>
                </Column>
              </M.ExpansionPanelDetails>
              <M.ExpansionPanelActions>
                {this.state.ava ? (
                  <M.Button onClick={() => this.setState({ ava: null })}>
                    {lang.settings.cancel}
                  </M.Button>
                ) : null}
                {this.state.ava ? (
                  <M.Button
                    onClick={this.state.avaLoading ? null : this.changeAva}
                    color="primary"
                  >
                    {this.state.avaLoading ? (
                      <M.CircularProgress />
                    ) : (
                      lang.settings.avaaccept
                    )}
                  </M.Button>
                ) : null}
              </M.ExpansionPanelActions>
            </M.ExpansionPanel>
            <M.ExpansionPanel
              style={{ background: hue ? hue : null }}
              className={classes.panel}
            >
              <M.ExpansionPanelSummary expandIcon={<Icon.ExpandMore />}>
                <div className={classes.column}>
                  <M.Typography variant="h6">
                    {lang.settings.bg}
                  </M.Typography>
                </div>
                <div className={classes.column}>
                  <M.Avatar
                    classes={{ img: classes.avaImg }}
                    className={classes.secondaryHeading}
                    src={user.headers}
                  />
                </div>
              </M.ExpansionPanelSummary>
              <M.ExpansionPanelDetails style={{ display: "block" }}>
                <M.Typography variant="body1">
                  {lang.settings.bgdesc}
                </M.Typography>
                <Dropzone
                  className={classes.dropzoneBg}
                  multiple={false}
                  onDrop={this.handleBg}
                >
                  <img
                    alt=""
                    className={classes.bg}
                    src={this.state.bg ? this.state.bg.preview : user.headers}
                  />
                  <Icon.CloudUpload className={classes.pictureIcon} />
                </Dropzone>
              </M.ExpansionPanelDetails>
              <M.ExpansionPanelActions>
                {this.state.bg ? (
                  <M.Button onClick={() => this.setState({ bg: null })}>
                    {lang.settings.cancel}
                  </M.Button>
                ) : null}
                {this.state.bg ? (
                  <M.Button
                    onClick={this.state.bgLoading ? null : this.changeBg}
                    color="primary"
                  >
                    {this.state.bgLoading ? (
                      <M.CircularProgress />
                    ) : (
                      lang.settings.bgaccept
                    )}
                  </M.Button>
                ) : null}
              </M.ExpansionPanelActions>
            </M.ExpansionPanel>
            <M.ExpansionPanel
              style={{ background: hue ? hue : null }}
              className={classes.panel}
            >
              <M.ExpansionPanelSummary expandIcon={<Icon.ExpandMore />}>
                <div className={classes.column}>
                  <M.Typography variant="h6">
                    {lang.settings.nickname}
                  </M.Typography>
                </div>
                <div className={classes.column}>
                  <M.Typography className={classes.secondaryHeading}>
                    {user.nick}
                  </M.Typography>
                </div>
              </M.ExpansionPanelSummary>
              <M.ExpansionPanelDetails>
                <Column>
                  <M.Typography variant="body1">
                    {lang.settings.nickdesc}
                  </M.Typography>
                  <M.TextField
                    value={this.state.nick}
                    onChange={e => this.setState({ nick: e.target.value })}
                    helperText={lang.settings.nickplaceholder}
                    fullWidth
                    margin="normal"
                  />
                </Column>
              </M.ExpansionPanelDetails>
              <M.ExpansionPanelActions>
                {this.state.nick !== "" ? (
                  <M.Button onClick={() => this.setState({ nick: "" })}>
                    {lang.settings.cancel}
                  </M.Button>
                ) : null}
                {this.state.nick !== "" ? (
                  <M.Button onClick={this.changeNick} color="primary">
                    {lang.settings.nickaccept}
                  </M.Button>
                ) : null}
              </M.ExpansionPanelActions>
            </M.ExpansionPanel>
            <M.ExpansionPanel
              style={{ background: hue ? hue : null }}
              className={classes.panel}
            >
              <M.ExpansionPanelSummary expandIcon={<Icon.ExpandMore />}>
                <div className={classes.column}>
                  <M.Typography variant="h6">
                    {lang.settings.username}
                  </M.Typography>
                </div>
                <div className={classes.column}>
                  <M.Typography className={classes.secondaryHeading}>
                    {user.username}
                  </M.Typography>
                </div>
              </M.ExpansionPanelSummary>
              <M.ExpansionPanelDetails>
                <Column>
                  <M.Typography variant="body1">
                    {lang.settings.userdesc}
                  </M.Typography>
                  <M.TextField
                    value={this.state.user}
                    onChange={e => this.setState({ user: e.target.value })}
                    helperText={lang.settings.usernameplaceholder}
                    fullWidth
                    margin="normal"
                  />
                </Column>
              </M.ExpansionPanelDetails>
              <M.ExpansionPanelActions>
                {this.state.user !== "" ? (
                  <M.Button onClick={() => this.setState({ user: "" })}>
                    {lang.settings.cancel}
                  </M.Button>
                ) : null}
                {this.state.user !== "" ? (
                  <M.Button onClick={this.changeUsername} color="primary">
                    {lang.settings.useraccept}
                  </M.Button>
                ) : null}
              </M.ExpansionPanelActions>
            </M.ExpansionPanel>
            <M.ExpansionPanel
              style={{ background: hue ? hue : null }}
              className={classes.panel}
            >
              <M.ExpansionPanelSummary expandIcon={<Icon.ExpandMore />}>
                <div className={classes.column}>
                  <M.Typography variant="h6">
                    {lang.settings.motto}
                  </M.Typography>
                </div>
                <div className={classes.column}>
                  <M.Typography className={classes.secondaryHeading}>
                    {user.motto}
                  </M.Typography>
                </div>
              </M.ExpansionPanelSummary>
              <M.ExpansionPanelDetails>
                <M.TextField
                  value={this.state.motto}
                  onChange={e => this.setState({ motto: e.target.value })}
                  helperText={lang.settings.mottoplaceholder}
                  fullWidth
                  margin="normal"
                />
              </M.ExpansionPanelDetails>
              <M.ExpansionPanelActions>
                {this.state.motto !== "" ? (
                  <M.Button onClick={() => this.setState({ motto: "" })}>
                    {lang.settings.cancel}
                  </M.Button>
                ) : null}
                {this.state.motto !== "" ? (
                  <M.Button onClick={this.changeMotto} color="primary">
                    {lang.settings.mottoaccept}
                  </M.Button>
                ) : null}
              </M.ExpansionPanelActions>
            </M.ExpansionPanel>
            <div className={classes.divide} />
            <M.Typography variant="h5" className={classes.headline}>
              {lang.settings.account}
            </M.Typography>
            <M.ExpansionPanel
              style={{ background: hue ? hue : null }}
              className={classes.panel}
            >
              <M.ExpansionPanelSummary expandIcon={<Icon.ExpandMore />}>
                <div className={classes.column}>
                  <M.Typography variant="h6">
                    {lang.settings.logging}
                  </M.Typography>
                </div>
                <div className={classes.column}>
                  <M.Typography className={classes.secondaryHeading}>
                    {this.props.profile.willLog
                      ? lang.settings.on
                      : lang.settings.off}
                  </M.Typography>
                </div>
              </M.ExpansionPanelSummary>
              <M.ExpansionPanelDetails>
                <Column>
                  <Row>
                    <M.Typography variant="body1">
                      {lang.settings.loggingdelete}
                    </M.Typography>
                    <M.Button onClick={this.deleteLogg} color="primary">
                      {lang.settings.yes}
                    </M.Button>
                  </Row>
                  <M.Typography variant="body1">
                    {lang.settings.loggingallow}
                  </M.Typography>
                  <M.FormGroup>
                    <M.FormControlLabel
                      control={
                        <M.Switch
                          checked={this.props.profile.willLog}
                          onChange={this.changeLogSetting}
                        />
                      }
                      label={
                        this.props.profile.willLog
                          ? lang.settings.on
                          : lang.settings.off
                      }
                    />
                  </M.FormGroup>
                  <M.Typography variant="body1">
                    {lang.settings.loggingprivate}
                  </M.Typography>
                  <M.FormGroup>
                    <M.FormControlLabel
                      disabled={!this.props.profile.willLog}
                      control={
                        <M.Switch
                          checked={this.props.profile.privateLog}
                          onChange={this.changeLogPrivate}
                        />
                      }
                      label={
                        this.props.profile.privateLog
                          ? lang.settings.on
                          : lang.settings.off
                      }
                    />
                  </M.FormGroup>
                </Column>
              </M.ExpansionPanelDetails>
            </M.ExpansionPanel>
            <div className={classes.divide} />
            <M.Typography variant="h5" className={classes.headline}>
              {lang.settings.sync}
            </M.Typography>
            <M.ExpansionPanel
              style={{ background: hue ? hue : null }}
              className={classes.panel}
            >
              <M.ExpansionPanelSummary expandIcon={<Icon.ExpandMore />}>
                <div className={classes.column}>
                  <M.Typography variant="h6">AniList</M.Typography>
                </div>
                <div className={classes.column}>
                  <M.Typography className={classes.secondaryHeading}>
                    {localStorage.getItem("ALTOKEN")
                      ? lang.settings.on
                      : lang.settings.off}
                  </M.Typography>
                </div>
              </M.ExpansionPanelSummary>
              <M.ExpansionPanelDetails>
                <M.Typography variant="body1">
                  {lang.settings.anilistdesc}
                </M.Typography>
              </M.ExpansionPanelDetails>
              <M.ExpansionPanelActions>
                <M.Button
                  onClick={
                    localStorage.getItem("ALTOKEN")
                      ? this.removeTwist
                      : this.triggerTwist
                  }
                >
                  {localStorage.getItem("ALTOKEN")
                    ? "Disconnect from AniList"
                    : "Connect with AniList"}
                </M.Button>
              </M.ExpansionPanelActions>
            </M.ExpansionPanel>
            <M.ExpansionPanel
              disabled
              style={{ display: "none", background: hue ? hue : null }}
              className={classes.panel}
            >
              <M.ExpansionPanelSummary expandIcon={<Icon.ExpandMore />}>
                <div className={classes.column}>
                  <M.Typography variant="h6">MyAnimeList</M.Typography>
                </div>
                <div className={classes.column}>
                  <M.Typography className={classes.secondaryHeading}>
                    {this.props.profile.mal
                      ? lang.settings.on
                      : lang.settings.off}
                  </M.Typography>
                </div>
              </M.ExpansionPanelSummary>
              <M.ExpansionPanelDetails>
                <M.Typography variant="body1">
                  {lang.settings.maldesc}
                </M.Typography>
              </M.ExpansionPanelDetails>
              <M.ExpansionPanelActions>
                <M.FormGroup>
                  <M.FormControlLabel
                    control={
                      <M.Switch
                        disabled
                        checked={this.props.profile.mal}
                        onChange={this.changeMALSetting}
                      />
                    }
                    label={
                      this.props.profile.mal
                        ? lang.settings.on
                        : lang.settings.off
                    }
                  />
                </M.FormGroup>
              </M.ExpansionPanelActions>
            </M.ExpansionPanel>
            <M.ExpansionPanel
              disabled
              style={{ display: "none", background: hue ? hue : null }}
              className={classes.panel}
            >
              <M.ExpansionPanelSummary expandIcon={<Icon.ExpandMore />}>
                <div className={classes.column}>
                  <M.Typography variant="h6">Discord</M.Typography>
                </div>
                <div className={classes.column}>
                  <M.Typography className={classes.secondaryHeading}>
                    {this.props.profile.discord
                      ? lang.settings.on
                      : lang.settings.off}
                  </M.Typography>
                </div>
              </M.ExpansionPanelSummary>
              <M.ExpansionPanelDetails>
                <M.Typography variant="body1">
                  {lang.settings.discorddesc}
                </M.Typography>
              </M.ExpansionPanelDetails>
              <M.ExpansionPanelActions>
                <M.FormGroup>
                  <M.FormControlLabel
                    control={
                      <M.Switch
                        disabled
                        checked={this.props.profile.discord}
                        onChange={this.changeDiscordSetting}
                      />
                    }
                    label={
                      this.props.profile.discord
                        ? lang.settings.on
                        : lang.settings.off
                    }
                  />
                </M.FormGroup>
              </M.ExpansionPanelActions>
            </M.ExpansionPanel>
            <div style={{ display: "none" }} className={classes.divide} />
            <M.Typography
              style={{ display: "none" }}
              variant="h5"
              className={classes.headline}
            >
              {lang.settings.misc}
            </M.Typography>
            <M.ExpansionPanel
              disabled
              style={{ display: "none", background: hue ? hue : null }}
              className={classes.panel}
            >
              <M.ExpansionPanelSummary expandIcon={<Icon.ExpandMore />}>
                <div className={classes.column}>
                  <M.Typography variant="h6">
                    {lang.settings.contribmodule}
                  </M.Typography>
                </div>
                <div className={classes.column}>
                  <M.Typography className={classes.secondaryHeading}>
                    {this.props.profile.noMine
                      ? lang.settings.off
                      : lang.settings.on}
                  </M.Typography>
                </div>
              </M.ExpansionPanelSummary>
              <M.ExpansionPanelDetails>
                <M.Typography
                  variant="body1"
                  dangerouslySetInnerHTML={{
                    __html: lang.settings.contribdesc
                  }}
                />
              </M.ExpansionPanelDetails>
              <M.ExpansionPanelActions>
                <M.FormGroup>
                  <M.FormControlLabel
                    control={
                      <M.Switch
                        checked={!this.props.profile.noMine}
                        onChange={this.changeContriSetting}
                      />
                    }
                    label={
                      this.props.profile.noMine
                        ? lang.settings.off
                        : lang.settings.on
                    }
                  />
                </M.FormGroup>
              </M.ExpansionPanelActions>
            </M.ExpansionPanel>
            <div
              style={{ display: "flex", marginTop: theme.spacing() * 12 }}
            >
              <div style={{ flex: 1 }} />
              <M.Button
                variant="contained"
                color="secondary"
                style={{ background: "red" }}
                onClick={() => this.setState({ deleteDialog: true })}
              >
                Delete my account
              </M.Button>
            </div>
          </M.Grid>
        </div>
        <Dialogue
          open={deleteDialog}
          onClose={() => this.setState({ deleteDialog: false })}
          title="Are you sure you want to delete your account?"
        >
          <M.Typography variant="body1">
            This action cannot be undone.
          </M.Typography>
          <div style={{ display: "flex", marginTop: theme.spacing() * 4 }}>
            <M.Button onClick={() => this.setState({ deleteDialog: false })}>
              Nope
            </M.Button>
            <div style={{ flex: 1 }} />
            <M.Button
              variant="contained"
              color="secondary"
              style={{ background: "red" }}
              onClick={this.deleteMyAccount}
            >
              Yes
            </M.Button>
          </div>
        </Dialogue>
        <Dialogue
          open={hasEnteredTwist}
          onClose={() => this.setState({ hasEnteredTwist: false })}
          title="Enter the code you got from AniList"
        >
          <Column>
            <M.Typography variant="body1">
              This will enable Mirai to use your AniList account for syncing.
            </M.Typography>
            <M.TextField
              value={ALToken}
              onChange={e => this.setState({ ALToken: e.target.value })}
              placeholder="Enter your code here"
            />
          </Column>
          <div style={{ display: "flex", marginTop: theme.spacing() * 4 }}>
            <M.Button onClick={() => this.setState({ hasEnteredTwist: false })}>
              Actually nevermind
            </M.Button>
            <div style={{ flex: 1 }} />
            <M.Button
              disabled={ALToken.length > 0 ? false : true}
              variant="contained"
              color="primary"
              onClick={this.enableTwist}
            >
              Apply
            </M.Button>
          </div>
        </Dialogue>
      </div>
    );
  }
}

export default firebaseConnect()(
  connect(({ firebase: { profile } }) => ({ profile }))(
    M.withStyles(style, { withTheme: true })(Settings)
  )
);
