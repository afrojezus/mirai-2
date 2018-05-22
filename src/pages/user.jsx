import React, { Component } from "react";
import * as M from "@material-ui/core";
import * as Icon from "@material-ui/icons";
import localForage from "localforage";
import queryString from "query-string";
import Colorizer from "../utils/colorizer";
import SwipableViews from "react-swipeable-views";
import strings from "../strings.json";
import checklang from "../checklang";
// import { virtualize } from 'react-swipeable-views-utils';
import moment from "moment";
import { connect } from "react-redux";
import { firebaseConnect, isEmpty } from "react-redux-firebase";
import CardButton, { PeopleButton } from "../components/cardButton";
import {
  CommandoBar,
  Header,
  Root,
  Container,
  LoadingIndicator,
  TitleHeader,
  MainCard,
  Column,
  ItemContainer,
  SectionTitle,
} from "../components/layouts";
import { Feed } from "../components/feed";
import { scrollFix } from "./../utils/scrollFix";

// const VirtualizedSwipableViews = virtualize(SwipableViews);

const style = theme => ({
  root: {
    height: "100%",
    width: "100%",
    position: "relative",
    transition: theme.transitions.create(["all"]),
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
  },
  content: {
    paddingTop: theme.spacing.unit * 8,
    marginLeft: "auto",
    marginRight: "auto",
    maxWidth: 1600,
  },
  header: {
    position: "relative",
    margin: "auto",
    paddingTop: theme.spacing.unit * 3,
  },
  title: {
    color: "white",
    fontSize: 64,
    fontWeight: 700,
    textShadow: "0 3px 16px rgba(0,0,0,.4)",
    padding: theme.spacing.unit,
    textAlign: "center",
    margin: "auto",
  },
  icon: {
    boxShadow: "0 1px 12px rgba(0,0,0,.2)",
    color: "white",
    height: 92,
    width: 92,
    zIndex: -1,
    background: "linear-gradient(to top, #9900ff 0%, #ff00ff 70%)",
    borderRadius: "50%",
    padding: theme.spacing.unit * 2,
  },
  fillImg: {
    height: "100%",
    width: "100%",
    objectFit: "cover",
    background: "white",
    borderRadius: "50%",
  },
  peopleCard: {
    height: "auto",
    width: 183,
    flexGrow: "initial",
    flexBasis: "initial",
    margin: theme.spacing.unit / 2,
    transition: theme.transitions.create(["all"]),
    "&:hover": {
      transform: "scale(1.05)",
      overflow: "initial",
      zIndex: 200,
      boxShadow: `0 2px 14px rgba(0,55,230,.3)`,
      background: M.colors.blue.A200,
    },
    "&:hover > * > h1": {
      transform: "scale(1.1)",
      textShadow: "0 2px 12px rgba(0,0,0,.7)",
    },
    position: "relative",
    overflow: "hidden",
  },
  peopleImage: {
    height: 156,
    width: 156,
    margin: "auto",
    zIndex: 1,
    borderRadius: "50%",
    boxShadow: "0 2px 12px rgba(0,0,0,.2)",
    transition: theme.transitions.create(["all"]),
    "&:hover": {
      boxShadow: "0 3px 16px rgba(0,0,0,.5)",
    },
    top: 0,
    left: 0,
  },
  peopleCharImage: {
    height: 64,
    width: 64,
    margin: "auto",
    zIndex: 2,
    position: "absolute",
    borderRadius: "50%",
    boxShadow: "0 2px 12px rgba(0,0,0,.2)",
    transition: theme.transitions.create(["all"]),
    "&:hover": {
      boxShadow: "0 3px 16px rgba(0,0,0,.5)",
      transform: "scale(1.2)",
    },
    right: theme.spacing.unit * 3,
    bottom: theme.spacing.unit * 7,
  },
  entityContext: {
    "&:last-child": {
      paddingBottom: 12,
    },
  },
  peopleTitle: {
    fontSize: 14,
    fontWeight: 500,
    padding: theme.spacing.unit,
    paddingBottom: theme.spacing.unit / 2,
    transition: theme.transitions.create(["transform"]),
    bottom: 0,
    zIndex: 5,
    margin: "auto",
    textAlign: "center",
    textShadow: "0 1px 12px rgba(0,0,0,.2)",
  },
  peopleSubTitle: {
    fontSize: 14,
    color: "rgba(255,255,255,.7)",
    fontWeight: 600,
    margin: "auto",
    transition: theme.transitions.create(["transform"]),
    zIndex: 5,
    textShadow: "0 1px 12px rgba(0,0,0,.2)",
    textAlign: "center",
    whiteSpace: "nowrap",
  },
  entityCard: {
    height: 200,
    width: 183,
    flexGrow: "initial",
    flexBasis: "initial",
    margin: theme.spacing.unit / 2,
    transition: theme.transitions.create(["all"]),
    "&:hover": {
      transform: "scale(1.05)",
      overflow: "initial",
      zIndex: 200,
      boxShadow: `0 2px 14px rgba(0,55,230,.3)`,
      background: M.colors.blue.A200,
    },
    "&:hover > div": {
      boxShadow: "none",
    },
    "&:hover > * > h1": {
      transform: "scale(1.4)",
      fontWeight: 700,
      textShadow: "0 2px 12px rgba(0,0,0,.7)",
    },
    position: "relative",
    overflow: "hidden",
  },
  entityCardDisabled: {
    height: 200,
    width: 183,
    flexGrow: "initial",
    flexBasis: "initial",
    margin: theme.spacing.unit / 2,
    transition: theme.transitions.create(["all"]),
    filter: "brightness(.8)",
    position: "relative",
    overflow: "hidden",
  },
  entityImage: {
    height: "100%",
    width: "100%",
    objectFit: "cover",
    position: "absolute",
    zIndex: -1,
    transition: theme.transitions.create(["filter"]),
    "&:hover": {
      filter: "brightness(0.8)",
    },
    top: 0,
    left: 0,
  },
  entityTitle: {
    fontSize: 14,
    fontWeight: 500,
    position: "absolute",
    padding: theme.spacing.unit * 2,
    transition: theme.transitions.create(["transform"]),
    bottom: 0,
    zIndex: 5,
    left: 0,
    textShadow: "0 1px 12px rgba(0,0,0,.2)",
  },
  entitySubTitle: {
    fontSize: 14,
    fontWeight: 600,
    position: "absolute",
    padding: theme.spacing.unit * 2,
    transition: theme.transitions.create(["transform"]),
    top: 0,
    left: 0,
    zIndex: 5,
    textShadow: "0 1px 12px rgba(0,0,0,.2)",
  },
  itemcontainer: {
    paddingBottom: theme.spacing.unit * 2,
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  gradientCard: {
    position: "relative",
    background: "linear-gradient(to top, transparent, rgba(0,0,0,.6))",
    height: 183,
    width: "100%",
  },
  sectDivide: {
    marginTop: theme.spacing.unit * 2,
  },
  progressCon: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    maxWidth: 400,
    margin: "auto",
  },
  progressTitle: {
    display: "flex",
    fontSize: 12,
    margin: "auto",
    textAlign: "center",
  },
  progressBar: {
    background: "rgba(255,255,255,.3)",
    margin: theme.spacing.unit / 2,
  },
  progressBarActive: {
    background: "white",
  },
  commandoBar: {
    width: "100%",
    display: "inline-flex",
    boxSizing: "border-box",
    background: "#222",
    boxShadow: "0 3px 18px rgba(0,0,0,.1)",
  },
  commandoText: {
    margin: "auto",
    textAlign: "center",
  },
  commandoTextBox: {
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    margin: "auto",
  },
  commandoTextLabel: {
    fontSize: 10,
    textAlign: "center",
    color: "rgba(255,255,255,.8)",
  },
  smallTitlebar: {
    display: "flex",
  },
  secTitle: {
    padding: theme.spacing.unit,
    fontWeight: 700,
    fontSize: 22,
    zIndex: "inherit",
    paddingBottom: theme.spacing.unit * 2,
  },
  secTitleSmall: {
    padding: theme.spacing.unit,
    fontSize: 16,
    zIndex: "inherit",
    color: "rgba(255,255,255,.5)",
    paddingBottom: theme.spacing.unit * 2,
  },
  backToolbar: {
    marginTop: theme.spacing.unit * 8,
  },
  bigBar: {
    width: "100%",
    height: "auto",
    boxShadow: "0 2px 24px rgba(0,0,0,.2)",
    background: "#111",
    marginTop: theme.spacing.unit * 8,
    position: "relative",
    overflow: "hidden",
    paddingBottom: theme.spacing.unit * 4,
    marginBottom: theme.spacing.unit * 8,
    transition: theme.transitions.create(["all"]),
    [theme.breakpoints.down("md")]: {
      marginTop: 0,
    },
  },
  glassEffect: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.4,
    height: "100vh",
    objectFit: "cover",
    width: "100%",
    transform: "scale(20)",
  },
  rootInactive: {
    opacity: 0,
    pointerEvents: "none",
    transition: theme.transitions.create(["all"]),
  },
  container: {
    marginLeft: "auto",
    marginRight: "auto",
    maxWidth: 1200,
    [theme.breakpoints.up("md")]: {
      maxWidth: "calc(100% - 64px)",
      paddingTop: 24,
    },
    margin: "auto",
  },
  frame: {
    height: "100%",
    width: "100%",
    position: "relative",
    transition: theme.transitions.create(["all"]),
  },
  grDImage: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 1,
    height: "100vh",
    width: "100%",
    zIndex: -1,
    overflow: "hidden",
    transition: theme.transitions.create(["all"]),
  },
  mainFrame: {
    marginLeft: 24,
  },
  bigTitle: {
    fontWeight: 700,
    fontSize: 82,
    color: "white",
    textShadow: "0 2px 12px rgba(0,0,0,.2)",
  },
  smallTitle: {
    fontWeight: 600,
    color: "white",
    fontSize: 40,
    textShadow: "0 2px 12px rgba(0,0,0,.17)",
  },
  tagBox: {
    marginTop: theme.spacing.unit,
  },
  tagTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: "white",
    textShadow: "0 2px 12px rgba(0,0,0,.17)",
    marginBottom: theme.spacing.unit,
  },
  desc: {
    marginTop: theme.spacing.unit * 4,
    color: "white",
    textShadow: "0 0 12px rgba(0,0,0,.1)",
    marginBottom: theme.spacing.unit * 6,
    fontSize: theme.typography.pxToRem(16),
  },
  boldD: {
    marginTop: theme.spacing.unit,
    color: "white",
    textShadow: "0 0 12px rgba(0,0,0,.1)",
    marginBottom: theme.spacing.unit,
    fontWeight: 600,
  },
  smallD: {
    marginLeft: theme.spacing.unit,
    marginTop: theme.spacing.unit,
    color: "white",
    textShadow: "0 0 12px rgba(0,0,0,.1)",
    marginBottom: theme.spacing.unit,
  },
  sepD: {
    display: "flex",
    marginLeft: theme.spacing.unit,
  },
  artworkimg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    background: "white",
    transition: theme.transitions.create(["all"]),
    zIndex: -1,
  },
  artwork: {
    width: 250,
    height: 250,
    overflow: "hidden",
    margin: "auto",
    transition: theme.transitions.create(["all"]),
    position: "relative",
    zIndex: 500,
    [theme.breakpoints.down("md")]: {
      height: 256,
      width: 256,
      margin: theme.spacing.unit * 2,
    },
    filter: "drop-shadow(0 4px 12px rgba(0,0,0,.2))",
  },
  loading: {
    height: "100%",
    width: "100%",
    zIndex: -5,
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
    padding: 0,
    margin: "auto",
    transition: theme.transitions.create(["all"]),
  },
  tabLabel: {
    opacity: 0.5,
    fontSize: 16,
    color: "white",
    textTransform: "initial",
  },
  tabLabelActive: {
    fontWeight: 700,
    fontSize: 16,
    color: "white",
    textTransform: "initial",
  },
  tabLine: {
    filter: "drop-shadow(0 1px 12px rgba(0,0,255,.2))",
    height: 2,
    background: "white",
  },
  tab: {
    height: 64,
  },
  feed: {
    margin: theme.spacing.unit,
  },
  roleTitle: {
    fontSize: theme.typography.pxToRem(18),
    borderRadius: 2,
    border: "2px solid rgba(255,255,255,1)",
    padding: theme.spacing.unit / 2,
    boxSizing: "border-box",
    textTransform: "uppercase",
    color: "white",
    fontWeight: 700,
    float: "right",
  },
});

class User extends Component {
  state = {
    loading: true,
    data: null,
    tabVal: 0,
    lang: strings.enus,
    userFeeds: null,
    menuEl: null,
    hue: "#111",
    hueVib: "#111",
    hueVibN: "#111",
  };

  componentWillMount = async () => {
    checklang(this);
    scrollFix();
    if (!isEmpty(this.props.profile)) return this.init();
    return false;
  };

  componentDidMount = async () => {
    await this.handleProfile();
  };

  handleProfile = async () => {
    const profile = this.props.profile;
    if (profile.userID) {
      if (profile.role !== undefined) return null;
      return this.props.firebase
        .database()
        .ref("/users")
        .child(profile.userID)
        .update({ role: "Normal" })
        .then(() => this.setState({ loading: false }));
    } else {
      return null;
    }
  };

  componentWillUnmount = () => {
    this.unlisten();
  };

  unlisten = this.props.history.listen(location => {
    const id = queryString.parse(location.search);
    if (location.pathname === "/user") {
      if (id.u !== this.state.id) return this.init();
      else if (location.search === "") return this.init();
    }
    return false;
  });

  init = () =>
    this.setState({ loading: true, data: null, id: null }, () => {
      const id = queryString.parse(this.props.location.search);
      if (this.props.location.search) {
        if (id !== this.props.profile.userID) {
          this.props.firebase
            .database()
            .ref("users")
            .child(id.u)
            .on("value", val =>
              this.setState(
                { data: val.val(), id: val.val().userID },
                async () =>
                  this.vibrance().then(() => this.setState({ loading: false }))
              )
            );
        } else {
          this.vibrance().then(() => this.setState({ loading: false }));
        }
      } else {
        this.vibrance().then(() => this.setState({ loading: false }));
      }
    });

  vibrance = async () => {
    const image = this.state.data
      ? this.state.data.avatar
      : this.props.profile
        ? this.props.profile.headers
          ? this.props.profile.headers
          : this.props.profile.avatar
        : null;
    await this.getFeeds(
      this.state.data ? this.state.data.userID : this.props.profile.userID
    );
    return this.getColors();
  };

  getColors = () => {
    const hue = localStorage.getItem("user-hue");
    if (hue) {
      let hues = JSON.parse(hue);
      return this.setState({
        hue: hues.hue,
        hueVib: hues.hueVib,
        hueVibN: hues.hueVibN,
      });
    } else {
      return null;
    }
  };

  getFeeds = async id => {
    const db = this.props.firebase
      .database()
      .ref("/social")
      .child("byusers");
    try {
      return db.on("value", allVal => {
        if (!allVal) {
          return;
        }
        const v = allVal.val();

        const thisUser = this.state.data
          ? this.state.data.userID
          : !isEmpty(this.props.profile)
            ? this.props.profile.userID
            : null;

        if (!thisUser) {
          return;
        } else {
          let userFeeds = Object.values(v).filter(s => s.user.id === thisUser);
          this.setState({ userFeeds });
        }
      });
    } catch (error) {
      return console.error(error);
    }
  };

  addFriend = async () => {
    const you = this.props.profile;
    const them = this.props.firebase
      .database()
      .ref("/users")
      .child(this.state.data.userID);
    const theirnotif = await them
      .child("notifications")
      .child(Date.now())
      .set({
        id: Date.now(),
        date: Date.now(),
        title: `Friend request`,
        desc: `${you.username} wants to be your friend.`,
        options: ["accept", "ignore"],
        avatar: you.avatar,
        ignored: false,
        userid: you.userID,
        type: "fr",
        username: you.username,
      });
    const theirreq = await them
      .child("requests")
      .child("friend")
      .child(you.userID)
      .set({
        pending: true,
      });

    return !!(theirnotif && theirreq);
  };

  removeFriend = async () => {
    const you = this.props.profile;
    const them = this.props.firebase
      .database()
      .ref("/users")
      .child(this.state.data.userID);

    const theirlist = await them
      .child("friends")
      .child(you.userID)
      .remove();
    const theirreq = await them
      .child("requests")
      .child("friend")
      .child(you.userID)
      .remove();

    const yourlist = await this.props.firebase
      .database()
      .ref("/users")
      .child(you.userID)
      .child("friends")
      .child(this.state.data.userID)
      .remove();

    if (theirlist && theirreq && yourlist) {
      return true;
    } else {
      return false;
    }
  };

  banUser = async () => {
    const { firebase } = this.props;
    if (!this.state.data) {
      return null;
    } else if (this.state.data.role === "banned") {
      return await firebase
        .database()
        .ref("/users")
        .child(this.state.data.userID)
        .update({ role: "Normal" });
    } else {
      return await firebase
        .database()
        .ref("/users")
        .child(this.state.data.userID)
        .update({ role: "banned" });
    }
  };

  giveAdmin = async () => {
    const { firebase } = this.props;
    if (!this.state.data) {
      return null;
    } else if (this.state.data.role === "admin") {
      return await firebase
        .database()
        .ref("/users")
        .child(this.state.data.userID)
        .update({ role: "Normal" });
    } else {
      return await firebase
        .database()
        .ref("/users")
        .child(this.state.data.userID)
        .update({ role: "admin" });
    }
  };

  reportUser = async () => {
    const { firebase } = this.props;
    if (!this.state.data) {
      return null;
    }
    return await firebase
      .database()
      .ref("/users")
      .child(this.state.data.userID)
      .child("reports")
      .push({ reported: true });
  };

  render() {
    const { classes } = this.props;
    const user = this.props.profile;
    const {
      loading,
      hue,
      hueVibN,
      data,
      tabVal,
      lang,
      userFeeds,
      menuEl,
    } = this.state;
    const openMenu = Boolean(menuEl);
    if (isEmpty(user))
      return (
        <div>
          <TitleHeader color={"#000"} title={lang.user.nouserfound} />
        </div>
      );
    return (
      <div>
        <LoadingIndicator loading={loading} />
        <TitleHeader color={hue ? hue : null} />
        <Root>
          <Header image={data ? data.headers : user.headers} color={hueVibN} />
          <Container spacing={0}>
            <M.Grid container spacing={0} className={classes.container}>
              <M.Grid
                item
                style={{ width: 400, flexGrow: 0, marginRight: 24 }}
                xs
              >
                <div>
                  <M.Avatar
                    src={data ? data.avatar : user.avatar}
                    className={classes.artwork}
                    classes={{ img: classes.fillImg }}
                    imgProps={{
                      style: { opacity: 0 },
                      onLoad: e => (e.currentTarget.style.opacity = null),
                    }}
                  />
                </div>
              </M.Grid>
              <M.Grid item xs style={{ margin: "auto" }}>
                <M.Typography className={classes.roleTitle} variant="display3">
                  {data ? data.role : user.role}
                </M.Typography>
                <M.Typography className={classes.bigTitle} variant="display3">
                  {data ? data.username : user.username}{" "}
                  {!isEmpty(user) &&
                  user.friends &&
                  data &&
                  user.friends[data.userID] ? (
                    <M.Tooltip
                      title={lang.user.bothfriends}
                      style={{ letterSpacing: "initial" }}
                    >
                      <Icon.SupervisorAccount />
                    </M.Tooltip>
                  ) : null}
                </M.Typography>
                <M.Typography variant="display1" className={classes.smallTitle}>
                  {data ? data.nick : user.nick}
                </M.Typography>
                <M.Typography
                  variant="body1"
                  className={classes.desc}
                  dangerouslySetInnerHTML={{
                    __html: data ? data.motto : user.motto,
                  }}
                />
              </M.Grid>
            </M.Grid>
            <MainCard>
              <CommandoBar>
                <M.Tabs
                  value={tabVal}
                  onChange={(e, val) => this.setState({ tabVal: val })}
                  className={classes.contextBar}
                  indicatorClassName={classes.tabLine}
                >
                  <M.Tab
                    label={data ? data.username : user.username}
                    classes={{
                      root: classes.tab,
                      label:
                        tabVal === 0
                          ? classes.tabLabelActive
                          : classes.tabLabel,
                    }}
                  />
                  <M.Tab
                    label={lang.user.feed}
                    classes={{
                      root: classes.tab,
                      label:
                        tabVal === 1
                          ? classes.tabLabelActive
                          : classes.tabLabel,
                    }}
                  />
                  <M.Tab
                    label={lang.user.animelist}
                    classes={{
                      root: classes.tab,
                      label:
                        tabVal === 2
                          ? classes.tabLabelActive
                          : classes.tabLabel,
                    }}
                  />
                  <M.Tab
                    label={lang.user.mangalist}
                    classes={{
                      root: classes.tab,
                      label:
                        tabVal === 3
                          ? classes.tabLabelActive
                          : classes.tabLabel,
                    }}
                  />
                  <M.Tab
                    label={lang.user.recommends}
                    classes={{
                      root: classes.tab,
                      label:
                        tabVal === 4
                          ? classes.tabLabelActive
                          : classes.tabLabel,
                    }}
                  />
                </M.Tabs>
                <div style={{ flex: 1 }} />
                {!isEmpty(user) && data && data.userID !== user.userID ? (
                  <M.Button
                    color="default"
                    onClick={
                      !isEmpty(user) &&
                      user.friends &&
                      user.friends[data.userID]
                        ? this.removeFriend
                        : this.addFriend
                    }
                  >
                    {!isEmpty(user) &&
                    user.friends &&
                    user.friends[data.userID] ? (
                      <Icon.Remove style={{ marginRight: 12 }} />
                    ) : (
                      <Icon.PersonAdd style={{ marginRight: 12 }} />
                    )}
                    {!isEmpty(user) && user.friends && user.friends[data.userID]
                      ? lang.user.removefriend
                      : lang.user.addfriend}
                  </M.Button>
                ) : null}
                {!data && !isEmpty(user) && user.role === "Normal" ? null : (
                  <M.IconButton
                    color="default"
                    aria-owns={openMenu ? "more-menu" : null}
                    aria-haspopup="true"
                    onClick={e => this.setState({ menuEl: e.currentTarget })}
                  >
                    <Icon.MoreVert />
                  </M.IconButton>
                )}
                <M.Menu
                  id="more-menu"
                  anchorEl={menuEl}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  MenuListProps={{ style: { padding: 0 } }}
                  PaperProps={{ style: { background: hue } }}
                  open={openMenu}
                  onClose={() => this.setState({ menuEl: null })}
                >
                  {!data ? null : (
                    <M.MenuItem onClick={this.reportUser}>
                      Report user
                    </M.MenuItem>
                  )}
                  {!isEmpty(user) && user.role === "dev" ? (
                    <M.MenuItem onClick={this.giveAdmin}>
                      {data && data.role === "admin" && user.role === "dev"
                        ? "Remove admin privileges"
                        : "Make user admin"}
                    </M.MenuItem>
                  ) : null}
                  {!isEmpty(user) &&
                  user.role === "Normal" ? null : user.role === "dev" ||
                  "Admin" ? (
                    <M.MenuItem onClick={this.banUser}>Ban user</M.MenuItem>
                  ) : null}
                </M.Menu>
              </CommandoBar>
              {tabVal === 0 ? (
                <M.Grid container className={classes.container}>
                  <M.Grid item xs style={{ zIndex: 10 }}>
                    <SectionTitle title={lang.user.friends} />
                    {data ? (
                      data.friends ? (
                        <M.Grid container className={classes.itemcontainer}>
                          {Object.values(data.friends).map((friend, index) => (
                            <PeopleButton
                              key={index}
                              name={{ first: friend.username }}
                              onClick={() =>
                                this.props.history.push(
                                  `/user?u=${friend.userID}`
                                )
                              }
                              image={friend.avatar}
                            />
                          ))}
                        </M.Grid>
                      ) : (
                        <M.Typography variant="body1">
                          {`${data.username} ${lang.user.nofriends}`}
                        </M.Typography>
                      )
                    ) : user.friends ? (
                      <M.Grid container className={classes.itemcontainer}>
                        {Object.values(user.friends).map((friend, index) => (
                          <PeopleButton
                            key={index}
                            name={{ first: friend.username }}
                            onClick={() =>
                              this.props.history.push(
                                `/user?u=${friend.userID}`
                              )
                            }
                            image={friend.avatar}
                          />
                        ))}
                      </M.Grid>
                    ) : (
                      <M.Typography variant="body1">
                        {lang.user.yougotnofriends}
                      </M.Typography>
                    )}
                    <M.Divider style={{ marginBottom: 8, marginTop: 16 }} />
                    <SectionTitle title={lang.user.activity} />
                    {data ? (
                      data.feed && !data.privateLog ? (
                        Object.values(data.feed)
                          .sort((a, b) => b.date - a.date)
                          .map((feed, index) => (
                            <Feed
                              key={index}
                              ftitle={feed.user.username}
                              context={feed.activity}
                              date={feed.date}
                              avatar={feed.user.avatar}
                              id={feed.id}
                              image={feed.coverImg}
                              user={{
                                avatar: feed.user.avatar,
                                id: feed.user.userID,
                                username: feed.user.username,
                              }}
                              color={hue}
                              showId={feed.showId}
                              format={feed.format}
                              activity
                              noActions
                            />
                          ))
                      ) : (
                        <M.Typography variant="body1">
                          {lang.user.noact}
                        </M.Typography>
                      )
                    ) : !isEmpty(user) && user.feed ? (
                      Object.values(user.feed)
                        .sort((a, b) => b.date - a.date)
                        .map((feed, index) => {
                          if (feed.user.username === undefined)
                            // It's an update.
                            return (
                              <Feed
                                key={index}
                                ftitle={feed.name}
                                context={"MIRAI UPDATE"}
                                text={feed.context}
                                date={feed.date}
                                avatar={feed.user.image}
                                id={feed.id}
                                user={feed.user}
                                mirUpdate
                                noActions
                                color={hue}
                              />
                            );
                          else if (feed.context === "INTRO")
                            // It's an intro feed
                            return (
                              <Feed
                                key={index}
                                ftitle={feed.user.username}
                                context={feed.context}
                                text={feed.text}
                                date={feed.date}
                                avatar={feed.user.avatar}
                                image={feed.image}
                                id={feed.id}
                                user={feed.user}
                                noDelete
                                noActions
                                color={hue}
                              />
                            );
                          else if (feed.type)
                            // It's an activity feed
                            return (
                              <Feed
                                key={index}
                                ftitle={feed.user.username}
                                context={feed.activity}
                                date={feed.date}
                                avatar={feed.user.avatar}
                                id={feed.id}
                                image={feed.coverImg}
                                user={{
                                  avatar: feed.user.avatar,
                                  id: feed.user.userID,
                                  username: feed.user.username,
                                }}
                                color={hue}
                                showId={feed.showId}
                                activity
                                noActions
                              />
                            );
                          // It's an user-made feed
                          else
                            return (
                              <Feed
                                key={index}
                                ftitle={feed.user.username}
                                context={feed.context}
                                text={feed.text}
                                date={feed.date}
                                avatar={feed.user.avatar}
                                image={feed.image}
                                id={feed.id}
                                user={feed.user}
                                color={hue}
                                reposts={feed.reposts}
                              />
                            );
                        })
                    ) : (
                      <M.Typography variant="body1">
                        {lang.user.noact}
                      </M.Typography>
                    )}
                  </M.Grid>
                  <M.Grid
                    item
                    xs={window.mobilecheck() ? 12 : 5}
                    style={{ zIndex: 10 }}
                    id="favourites"
                  >
                    <SectionTitle title={lang.user.favorites} />
                    <M.Typography
                      variant="title"
                      className={classes.secTitleSmall}
                    >
                      {lang.user.anime}
                    </M.Typography>
                    <M.Grid container className={classes.itemcontainer}>
                      {data ? (
                        data.favs && data.favs.show ? (
                          Object.values(data.favs.show).map(show => (
                            <CardButton
                              key={show.id}
                              onClick={() =>
                                this.props.history.push(`/show?s=${show.id}`)
                              }
                              title={show.name}
                              image={show.image}
                            />
                          ))
                        ) : (
                          <M.Typography variant="body1">
                            {"They don't appear to like anime..."}
                          </M.Typography>
                        )
                      ) : !isEmpty(user) && user.favs && user.favs.show ? (
                        Object.values(user.favs.show).map(show => (
                          <CardButton
                            key={show.id}
                            onClick={() =>
                              this.props.history.push(`/show?s=${show.id}`)
                            }
                            title={show.name}
                            image={show.image}
                          />
                        ))
                      ) : (
                        <M.Typography variant="body1">
                          {
                            "Doesn't seem like you've found yourself a good one yet..."
                          }
                        </M.Typography>
                      )}
                    </M.Grid>
                    <M.Divider />
                    <M.Typography
                      variant="title"
                      className={classes.secTitleSmall}
                    >
                      {lang.user.manga}
                    </M.Typography>
                    <M.Grid container className={classes.itemcontainer}>
                      {data ? (
                        data.favs && data.favs.manga ? (
                          Object.values(data.favs.manga).map(show => (
                            <CardButton
                              key={show.id}
                              onClick={() =>
                                this.props.history.push(`/show?m=${show.id}`)
                              }
                              title={show.name}
                              image={show.image}
                            />
                          ))
                        ) : (
                          <M.Typography variant="body1">
                            Appears {data.username} is not into reading...
                          </M.Typography>
                        )
                      ) : !isEmpty(user) && user.favs && user.favs.manga ? (
                        Object.values(user.favs.manga).map(show => (
                          <CardButton
                            key={show.id}
                            onClick={() =>
                              this.props.history.push(`/show?m=${show.id}`)
                            }
                            title={show.name}
                            image={show.image}
                          />
                        ))
                      ) : (
                        <M.Typography variant="body1">
                          Not into reading? Understandable.
                        </M.Typography>
                      )}
                    </M.Grid>
                    <M.Divider />
                    <M.Typography
                      variant="title"
                      className={classes.secTitleSmall}
                    >
                      {lang.user.characters}
                    </M.Typography>
                    <M.Grid container className={classes.itemcontainer}>
                      {data ? (
                        data.favs && data.favs.char ? (
                          Object.values(data.favs.char).map(cast => (
                            <PeopleButton
                              key={cast.id}
                              name={{ first: cast.name }}
                              image={cast.image}
                              onClick={() =>
                                this.props.history.push(`/fig?c=${cast.id}`)
                              }
                            />
                          ))
                        ) : (
                          <M.Typography variant="body1">
                            {data.username} has yet to find his waifu...
                          </M.Typography>
                        )
                      ) : !isEmpty(user) && user.favs && user.favs.char ? (
                        Object.values(user.favs.char).map(cast => (
                          <PeopleButton
                            key={cast.id}
                            name={{ first: cast.name }}
                            image={cast.image}
                            onClick={() =>
                              this.props.history.push(`/fig?c=${cast.id}`)
                            }
                          />
                        ))
                      ) : (
                        <M.Typography variant="body1">
                          Do you like any characters at all?
                        </M.Typography>
                      )}
                    </M.Grid>
                    <M.Divider />
                    <M.Typography
                      variant="title"
                      className={classes.secTitleSmall}
                    >
                      {lang.user.staff}
                    </M.Typography>
                    <M.Grid container className={classes.itemcontainer}>
                      {data ? (
                        data.favs && data.favs.staff ? (
                          Object.values(data.favs.staff).map(cast => (
                            <PeopleButton
                              key={cast}
                              name={{ first: cast.name }}
                              image={cast.image}
                              onClick={() =>
                                this.props.history.push(`/fig?s=${cast.id}`)
                              }
                            />
                          ))
                        ) : (
                          <M.Typography variant="body1">
                            Staff? Actors? Casting? {data.username} does not
                            know.
                          </M.Typography>
                        )
                      ) : !isEmpty(user) && user.favs && user.favs.staff ? (
                        Object.values(user.favs.staff).map(cast => (
                          <PeopleButton
                            key={cast.id}
                            name={{ first: cast.name }}
                            image={cast.image}
                            onClick={() =>
                              this.props.history.push(`/fig?s=${cast.id}`)
                            }
                          />
                        ))
                      ) : (
                        <M.Typography variant="body1">
                          {
                            "Hmm... I suppose you don't find anyone that interesting to follow."
                          }
                        </M.Typography>
                      )}
                    </M.Grid>
                    <M.Divider />
                    <M.Typography
                      variant="title"
                      className={classes.secTitleSmall}
                    >
                      {lang.user.studio}
                    </M.Typography>
                    <M.Grid container className={classes.itemcontainer}>
                      {data ? (
                        data.favs && data.favs.studio ? (
                          Object.values(data.favs.studio).map(show => (
                            <M.Grid
                              className={classes.entityCard}
                              item
                              xs
                              key={show.id}
                            >
                              <M.Card
                                style={{ background: "transparent" }}
                                onClick={() =>
                                  this.props.history.push(
                                    `/studio?s=${show.id}`
                                  )
                                }
                              >
                                <div className={classes.gradientCard}>
                                  <M.CardMedia
                                    className={classes.entityImage}
                                    image={show.image}
                                  />
                                </div>
                                <M.Typography
                                  variant="headline"
                                  className={classes.entityTitle}
                                >
                                  {show.name}
                                </M.Typography>
                                <M.Typography
                                  variant="headline"
                                  className={classes.entitySubTitle}
                                />
                              </M.Card>
                            </M.Grid>
                          ))
                        ) : (
                          <M.Typography variant="body1">
                            {`Appears ${
                              data.username
                            } isn't fond of any studios at
                            all.`}
                          </M.Typography>
                        )
                      ) : !isEmpty(user) && user.favs && user.favs.studio ? (
                        Object.values(user.favs.studio).map(show => (
                          <M.Grid
                            className={classes.entityCard}
                            item
                            xs
                            key={show.id}
                          >
                            <M.Card
                              style={{ background: "transparent" }}
                              onClick={() =>
                                this.props.history.push(`/tag?s=${show.id}`)
                              }
                            >
                              <div className={classes.gradientCard}>
                                <M.CardMedia
                                  className={classes.entityImage}
                                  image={show.image}
                                />
                              </div>
                              <M.Typography
                                variant="headline"
                                className={classes.entityTitle}
                              >
                                {show.name}
                              </M.Typography>
                              <M.Typography
                                variant="headline"
                                className={classes.entitySubTitle}
                              />
                            </M.Card>
                          </M.Grid>
                        ))
                      ) : (
                        <M.Typography variant="body1">
                          Studios can be rather abstract.. perhaps you enjoy
                          works by Studio Ghibli or perhaps... Trigger?
                        </M.Typography>
                      )}
                    </M.Grid>
                  </M.Grid>
                </M.Grid>
              ) : null}
              {tabVal === 1 ? (
                <Container>
                  <ItemContainer>
                    {userFeeds &&
                    Object.values(userFeeds).filter(
                      u => (u.user.id === data ? data.id : user.userID)
                    ).length > 0 ? (
                      Object.values(userFeeds)
                        .filter(
                          u => (u.user.id === data ? data.id : user.userID)
                        )
                        .sort((a, b) => b.date - a.date)
                        .map((feed, index) => (
                          <Feed
                            key={index}
                            ftitle={feed.user.username}
                            context={feed.context}
                            text={feed.text}
                            date={feed.date}
                            avatar={feed.user.avatar}
                            image={feed.image}
                            id={feed.id}
                            user={feed.user}
                            color={hue}
                            likes={feed.likes}
                            reposts={feed.reposts}
                          />
                        ))
                    ) : (
                      <SectionTitle
                        title="No feeds to be found... antisocial?"
                        lighter
                      />
                    )}
                  </ItemContainer>
                </Container>
              ) : null}
              {tabVal === 2 ? (
                <Container>
                  <Column>
                    <M.Typography variant="title" className={classes.secTitle}>
                      {lang.user.animeList.recentlyWatched}
                    </M.Typography>
                    <M.Grid container className={classes.itemcontainer}>
                      {data ? (
                        data.episodeProgress ? (
                          Object.values(data.episodeProgress)
                            .filter(s => s.recentlyWatched)
                            .sort(
                              (a, b) => b.recentlyWatched - a.recentlyWatched
                            )
                            .map(show => (
                              <CardButton
                                key={show.showId}
                                onClick={() =>
                                  this.props.history.push(
                                    `/show?s=${show.showId}`
                                  )
                                }
                                title={show.title}
                                image={show.showArtwork}
                                subtitle={show.ep ? `Episode ${show.ep}` : null}
                              />
                            ))
                        ) : (
                          <M.Typography variant="body1">
                            {lang.user.animeList.rnone}
                          </M.Typography>
                        )
                      ) : !isEmpty(user) && user.episodeProgress ? (
                        Object.values(user.episodeProgress)
                          .filter(s => s.recentlyWatched)
                          .sort((a, b) => b.recentlyWatched - a.recentlyWatched)
                          .map(show => (
                            <CardButton
                              key={show.showId}
                              onClick={() =>
                                this.props.history.push(
                                  `/show?s=${show.showId}`
                                )
                              }
                              title={show.title}
                              image={show.showArtwork}
                              subtitle={show.ep ? `Episode ${show.ep}` : null}
                            />
                          ))
                      ) : (
                        <M.Typography variant="body1">
                          {lang.user.animeList.rnone}
                        </M.Typography>
                      )}
                    </M.Grid>
                    <M.Typography variant="title" className={classes.secTitle}>
                      {lang.user.animeList.later}
                    </M.Typography>
                    <M.Grid container className={classes.itemcontainer}>
                      {data ? (
                        data.later && data.later.show ? (
                          Object.values(data.later.show)
                            .sort((a, b) => b.date - a.date)
                            .map(show => (
                              <CardButton
                                key={show.id}
                                onClick={() =>
                                  this.props.history.push(`/show?s=${show.id}`)
                                }
                                title={show.name}
                                image={show.image}
                                subtitle={`Added ${moment(show.date).from(
                                  Date.now()
                                )}`}
                              />
                            ))
                        ) : (
                          <M.Typography variant="body1">
                            {lang.user.animeList.lnoneUser}
                          </M.Typography>
                        )
                      ) : !isEmpty(user) && user.later && user.later.show ? (
                        Object.values(user.later.show)
                          .sort((a, b) => b.date - a.date)
                          .map(show => (
                            <CardButton
                              key={show.id}
                              onClick={() =>
                                this.props.history.push(`/show?s=${show.id}`)
                              }
                              title={show.name}
                              image={show.image}
                              subtitle={`Added ${moment(show.date).from(
                                Date.now()
                              )}`}
                            />
                          ))
                      ) : (
                        <M.Typography variant="body1">
                          {lang.user.animeList.lnone}
                        </M.Typography>
                      )}
                    </M.Grid>
                    <M.Typography vairant="title" className={classes.secTitle}>
                      {lang.user.animeList.compl}
                    </M.Typography>
                    <M.Grid container className={classes.itemcontainer}>
                      {data ? (
                        data.completed && data.completed.show ? (
                          Object.values(data.completed.show)
                            .sort((a, b) => b.date - a.date)
                            .map(show => (
                              <CardButton
                                key={show.showId}
                                onClick={() =>
                                  this.props.history.push(show.link)
                                }
                                title={show.name}
                                image={show.image}
                                subtitle={`Completed ${moment(show.date).from(
                                  Date.now()
                                )}`}
                              />
                            ))
                        ) : (
                          <M.Typography variant="body1">
                            {lang.user.animeList.cnoneUser}
                          </M.Typography>
                        )
                      ) : !isEmpty(user) &&
                      user.completed &&
                      user.completed.show ? (
                        Object.values(user.completed.show)
                          .sort((a, b) => b.date - a.date)
                          .map(show => (
                            <CardButton
                              key={show.showId}
                              onClick={() => this.props.history.push(show.link)}
                              title={show.name}
                              image={show.image}
                              subtitle={`Completed ${moment(show.date).from(
                                Date.now()
                              )}`}
                            />
                          ))
                      ) : (
                        <M.Typography variant="body1">
                          {lang.user.animeList.cnone}
                        </M.Typography>
                      )}
                    </M.Grid>
                    <M.Typography vairant="title" className={classes.secTitle}>
                      {lang.user.animeList.dropped}
                    </M.Typography>
                    <M.Grid container className={classes.itemcontainer}>
                      {data ? (
                        data.dropped && data.dropped.show ? (
                          Object.values(data.dropped.show)
                            .sort((a, b) => b.date - a.date)
                            .map(show => (
                              <CardButton
                                key={show.showId}
                                onClick={() =>
                                  this.props.history.push(show.link)
                                }
                                title={show.name}
                                image={show.image}
                                subtitle={`Dropped ${moment(show.date).from(
                                  Date.now()
                                )}`}
                              />
                            ))
                        ) : (
                          <M.Typography variant="body1">
                            {lang.user.animeList.dnoneUser}
                          </M.Typography>
                        )
                      ) : !isEmpty(user) &&
                      user.dropped &&
                      user.dropped.show ? (
                        Object.values(user.dropped.show)
                          .sort((a, b) => b.date - a.date)
                          .map(show => (
                            <CardButton
                              key={show.showId}
                              onClick={() => this.props.history.push(show.link)}
                              title={show.name}
                              image={show.image}
                              subtitle={`Dropped ${moment(show.date).from(
                                Date.now()
                              )}`}
                            />
                          ))
                      ) : (
                        <M.Typography variant="body1">
                          {lang.user.animeList.dnone}
                        </M.Typography>
                      )}
                    </M.Grid>
                  </Column>
                </Container>
              ) : null}
              {tabVal === 3 ? (
                <Container>
                  <Column>
                    <M.Typography variant="title" className={classes.secTitle}>
                      {lang.user.mangaList.later}
                    </M.Typography>
                    <M.Grid container className={classes.itemcontainer}>
                      {data ? (
                        data.later && data.later.manga ? (
                          Object.values(data.later.manga)
                            .sort((a, b) => b.date - a.date)
                            .map(show => (
                              <CardButton
                                key={show.id}
                                onClick={() =>
                                  this.props.history.push(`/show?s=${show.id}`)
                                }
                                title={show.name}
                                image={show.image}
                                subtitle={`Added ${moment(show.date).from(
                                  Date.now()
                                )}`}
                              />
                            ))
                        ) : (
                          <M.Typography variant="body1">
                            {lang.user.mangaList.lnoneUser}
                          </M.Typography>
                        )
                      ) : !isEmpty(user) && user.later && user.later.manga ? (
                        Object.values(user.later.manga)
                          .sort((a, b) => b.date - a.date)
                          .map(show => (
                            <CardButton
                              key={show.id}
                              onClick={() =>
                                this.props.history.push(`/show?s=${show.id}`)
                              }
                              title={show.name}
                              image={show.image}
                              subtitle={`Added ${moment(show.date).from(
                                Date.now()
                              )}`}
                            />
                          ))
                      ) : (
                        <M.Typography variant="body1">
                          {lang.user.mangaList.lnone}
                        </M.Typography>
                      )}
                    </M.Grid>
                    <M.Typography vairant="title" className={classes.secTitle}>
                      {lang.user.mangaList.compl}
                    </M.Typography>
                    <M.Grid container className={classes.itemcontainer}>
                      {data ? (
                        data.completed && data.completed.manga ? (
                          Object.values(data.completed.manga)
                            .sort((a, b) => b.date - a.date)
                            .map(show => (
                              <CardButton
                                key={show.showId}
                                onClick={() =>
                                  this.props.history.push(show.link)
                                }
                                title={show.name}
                                image={show.image}
                                subtitle={`Completed ${moment(show.date).from(
                                  Date.now()
                                )}`}
                              />
                            ))
                        ) : (
                          <M.Typography variant="body1">
                            {lang.user.mangaList.cnoneUser}
                          </M.Typography>
                        )
                      ) : !isEmpty(user) &&
                      user.completed &&
                      user.completed.manga ? (
                        Object.values(user.completed.manga)
                          .sort((a, b) => b.date - a.date)
                          .map(show => (
                            <CardButton
                              key={show.showId}
                              onClick={() => this.props.history.push(show.link)}
                              title={show.name}
                              image={show.image}
                              subtitle={`Completed ${moment(show.date).from(
                                Date.now()
                              )}`}
                            />
                          ))
                      ) : (
                        <M.Typography variant="body1">
                          {lang.user.mangaList.cnone}
                        </M.Typography>
                      )}
                    </M.Grid>
                    <M.Typography vairant="title" className={classes.secTitle}>
                      {lang.user.mangaList.dropped}
                    </M.Typography>
                    <M.Grid container className={classes.itemcontainer}>
                      {data ? (
                        data.dropped && data.dropped.manga ? (
                          Object.values(data.dropped.manga)
                            .sort((a, b) => b.date - a.date)
                            .map(show => (
                              <CardButton
                                key={show.showId}
                                onClick={() =>
                                  this.props.history.push(show.link)
                                }
                                title={show.name}
                                image={show.image}
                                subtitle={`Dropped ${moment(show.date).from(
                                  Date.now()
                                )}`}
                              />
                            ))
                        ) : (
                          <M.Typography variant="body1">
                            {lang.user.mangaList.dnoneUser}
                          </M.Typography>
                        )
                      ) : !isEmpty(user) &&
                      user.dropped &&
                      user.dropped.manga ? (
                        Object.values(user.dropped.manga)
                          .sort((a, b) => b.date - a.date)
                          .map(show => (
                            <CardButton
                              key={show.showId}
                              onClick={() => this.props.history.push(show.link)}
                              title={show.name}
                              image={show.image}
                              subtitle={`Dropped ${moment(show.date).from(
                                Date.now()
                              )}`}
                            />
                          ))
                      ) : (
                        <M.Typography variant="body1">
                          {lang.user.mangaList.dnone}
                        </M.Typography>
                      )}
                    </M.Grid>
                  </Column>
                </Container>
              ) : null}
              {tabVal === 4 ? (
                <Container>
                  <Column>
                    <SectionTitle
                      title={
                        data
                          ? lang.user.recommenddataanime
                          : lang.user.recommendanime
                      }
                    />
                    <ItemContainer topPad>
                      {data ? (
                        data.recommends && data.recommends.show ? (
                          Object.values(data.recommends.show)
                            .sort((a, b) => b.date - a.date)
                            .map(show => (
                              <CardButton
                                key={show.id}
                                onClick={() =>
                                  this.props.history.push(`/show?s=${show.id}`)
                                }
                                title={show.name}
                                image={show.image}
                                subtitle={`Added ${moment(show.date).from(
                                  Date.now()
                                )}`}
                              />
                            ))
                        ) : (
                          <SectionTitle
                            title={lang.user.recommendDataanimenone}
                            lighter
                          />
                        )
                      ) : user && user.recommends && user.recommends.show ? (
                        Object.values(user.recommends.show)
                          .sort((a, b) => b.date - a.date)
                          .map(show => (
                            <CardButton
                              key={show.id}
                              onClick={() =>
                                this.props.history.push(`/show?s=${show.id}`)
                              }
                              title={show.name}
                              image={show.image}
                              subtitle={`Added ${moment(show.date).from(
                                Date.now()
                              )}`}
                            />
                          ))
                      ) : (
                        <SectionTitle
                          title={lang.user.recommendanimenone}
                          lighter
                        />
                      )}
                    </ItemContainer>
                    <SectionTitle
                      title={
                        data
                          ? lang.user.recommenddatamanga
                          : lang.user.recommendmanga
                      }
                    />
                    <ItemContainer topPad>
                      {data ? (
                        data.recommends && data.recommends.manga ? (
                          Object.values(data.recommends.manga)
                            .sort((a, b) => b.date - a.date)
                            .map(show => (
                              <CardButton
                                key={show.id}
                                onClick={() =>
                                  this.props.history.push(`/show?m=${show.id}`)
                                }
                                title={show.name}
                                image={show.image}
                                subtitle={`Added ${moment(show.date).from(
                                  Date.now()
                                )}`}
                              />
                            ))
                        ) : (
                          <SectionTitle
                            title={lang.user.recommendDatamanganone}
                            lighter
                          />
                        )
                      ) : user && user.recommends && user.recommends.manga ? (
                        Object.values(user.recommends.manga)
                          .sort((a, b) => b.date - a.date)
                          .map(show => (
                            <CardButton
                              key={show.id}
                              onClick={() =>
                                this.props.history.push(`/show?m=${show.id}`)
                              }
                              title={show.name}
                              image={show.image}
                              subtitle={`Added ${moment(show.date).from(
                                Date.now()
                              )}`}
                            />
                          ))
                      ) : (
                        <SectionTitle
                          title={lang.user.recommendmanganone}
                          lighter
                        />
                      )}
                    </ItemContainer>
                  </Column>
                </Container>
              ) : null}
            </MainCard>
          </Container>
        </Root>
      </div>
    );
  }
}

export default firebaseConnect()(
  connect(({ firebase: { profile } }) => ({ profile }))(
    M.withStyles(style)(User)
  )
);
