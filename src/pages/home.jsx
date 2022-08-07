import React, { Component } from "react";
import * as ICON from "@material-ui/icons";
import checkLang from "../checklang";
import strings from "../strings.json";
import { firebaseConnect, isEmpty } from "react-redux-firebase";
import { blue, grey } from "@material-ui/core/colors";
import { connect } from "react-redux";
import { scrollFix } from "./../utils/scrollFix";
import CardButton from "../components/cardButton";
import AvatarWrapper from "../components/avatarWrapper";
import {
  Card,
  CardHeader,
  Avatar,
  Typography,
  Hidden,
  Grid,
  MenuItem,
  Select,
  withStyles,
  Divider,
  ListItemText
} from "@material-ui/core";
import {
  Container,
  Root,
  Header,
  LoadingIndicator,
  TitleHeader,
  ItemContainer,
  SectionTitle,
  Dialogue,
  Column,
} from "../components/layouts";
import SuperTable from "../components/supertable";
import Anilist from "../anilist-api";
import { bigFuckingQuery } from "../anilist-api/queries";
import { FeedMaker, Feed } from "../components/feed";
import { SearchBox } from "../components/superbar";

const styles = theme => ({
  root: {
    paddingTop: theme.spacing() * 8
  },
  container: {
    marginLeft: "auto",
    marginRight: "auto",
    padding: 24,
    maxWidth: 1600,
    paddingLeft: "env(safe-area-inset-left)",
    paddingRight: "env(safe-area-inset-right)"
  },
  itemContainer: {
    margin: theme.spacing()
  },
  bgImage: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
    height: "100vh",
    objectFit: "cover",
    width: "100%",
    zIndex: -1,
    transition: theme.transitions.create(["all"])
  },
  topHeader: {
    width: "100%",
    maxHeight: 520,
    position: "relative",
    margin: "auto",
    transition: theme.transitions.create(["all"])
  },
  topHeaderBig: {
    width: "100%",
    maxHeight: 520,
    position: "relative",
    margin: "auto",
    transition: theme.transitions.create(["all"]),
    background: "black",
    paddingTop: theme.spacing() * 12
  },
  cardBg: {
    objectFit: "cover",
    height: "100%",
    width: "100%",
    position: "absolute",
    textIndent: -999,
    top: 0,
    left: 0,
    zIndex: 0
  },
  cardContent: {
    textAlign: "center",
    height: "100%",
    zIndex: 2,
    display: "flex",
    background: grey[800]
  },
  divide: {
    width: "100%",
    marginTop: 24,
    marginBottom: 24
  },
  spacer: {
    flex: 1
  },
  headline: {
    margin: "auto"
  },
  headlineTitle: {
    marginBottom: 24,
    fontSize: 48,
    fontWeight: 800
  },
  fullWidth: {
    width: "100%"
  },
  entityCard: {
    height: 200,
    width: 183,
    flexGrow: "initial",
    flexBasis: "initial",
    margin: theme.spacing() / 2,
    transition: theme.transitions.create(["all"]),
    "&:hover": {
      transform: "scale(1.05)",
      overflow: "initial",
      zIndex: 200,
      boxShadow: `0 2px 14px rgba(0,55,230,.3)`,
      background: blue.A200
    },
    "&:hover > div": {
      boxShadow: "none"
    },
    "&:hover > * > h1": {
      transform: "scale(1.4)",
      fontWeight: 700,
      textShadow: "0 2px 12px rgba(0,0,0,.7)"
    },
    position: "relative",
    overflow: "hidden"
  },
  entityCardDisabled: {
    height: 200,
    width: 183,
    flexGrow: "initial",
    flexBasis: "initial",
    margin: theme.spacing() / 2,
    transition: theme.transitions.create(["all"]),
    filter: "brightness(.8)",
    position: "relative",
    overflow: "hidden"
  },
  entityImage: {
    height: "100%",
    width: "100%",
    objectFit: "cover",
    position: "absolute",
    zIndex: -1,
    transition: theme.transitions.create(["filter"]),
    "&:hover": {
      filter: "brightness(0.8)"
    },
    top: 0,
    left: 0
  },
  entityContext: {
    "&:last-child": {
      paddingBottom: 12
    }
  },
  entityTitle: {
    fontSize: 14,
    fontWeight: 500,
    position: "absolute",
    padding: theme.spacing() * 2,
    transition: theme.transitions.create(["transform"]),
    bottom: 0,
    zIndex: 5,
    left: 0,
    textShadow: "0 1px 12px rgba(0,0,0,.2)"
  },
  entitySubTitle: {
    fontSize: 14,
    fontWeight: 600,
    position: "absolute",
    padding: theme.spacing() * 2,
    transition: theme.transitions.create(["transform"]),
    top: 0,
    left: 0,
    zIndex: 5,
    textShadow: "0 1px 12px rgba(0,0,0,.2)"
  },
  itemcontainer: {
    paddingBottom: theme.spacing() * 2,
    marginLeft: theme.spacing(),
    marginRight: theme.spacing()
  },
  gradientCard: {
    position: "relative",
    background: "linear-gradient(to top, transparent, rgba(0,0,0,.6))",
    height: 183,
    width: "100%"
  },
  likeCount: {},
  cardColor: {},
  snackBar: {
    position: "fixed",
    marginTop: 64
  },
  avatar: {
    marginLeft: -theme.spacing() * 4,
    height: 82,
    width: 82,
    boxShadow: "0 3px 16px rgba(0,0,0,.5)"
  },
  frame: {
    transition: theme.transitions.create(["all"])
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
    transition: theme.transitions.create(["all"])
  },
  bigCard: {
    margin: theme.spacing() * 3,
    padding: theme.spacing() * 2,
    display: "flex",
    boxShadow: "0 2px 18px rgba(0,0,0,.4)",
    background: "rgba(255,255,255,0)",
    height: "100%",
    minHeight: "300px !important",
    width: "100%",

    boxSizing: "border-box",
    transition: theme.transitions.create(["all"]),
    "&:last-child": {
      marginRight: theme.spacing() * 9
    },
    "&:first-child": {
      marginLeft: theme.spacing() * 9
    },
    position: "relative",
    "&:hover": {
      background: `rgba(0,55,230,.3)`
    },
    "&:hover > div:nth-of-type(2) > img": {
      zIndex: 200,
      boxShadow: `0 2px 14px rgba(0,55,230,.3)`,
      borderColor: blue.A200
    }
  },
  bigCardIcon: {
    background: "white",
    zIndex: 4,
    width: 156,
    height: 228,
    boxShadow: "0 3px 24px rgba(0,0,0,.6)",
    objectFit: "cover",
    marginRight: theme.spacing() * 2,
    transition: theme.transitions.create(["all"]),
    border: "8px solid transparent",
    "&:hover": {
      filter: "brightness(0.8)"
    }
  },
  bigCardImage: {
    position: "absolute",
    height: "100%",
    width: "100%",
    objectFit: "cover",
    top: 0,
    left: 0,
    display: "inline-block",
    background: "linear-gradient(to top, rgba(0,0,0,.7), transparent)"
  },
  bigCardImageImg: {
    position: "relative",
    height: "100%",
    width: "100%",
    objectFit: "cover",
    top: 0,
    left: 0,
    zIndex: -1,
    display: "block"
  },
  bigCardRow: {
    display: "flex",
    zIndex: 3,
    position: "absolute",
    width: "100%",
    bottom: -theme.spacing() * 2,
    left: -theme.spacing() * 2
  },
  bigCardTitle: {
    zIndex: 3,
    color: "white",
    fontWeight: 700,
    fontSize: 32,
    textShadow: "0 3px 20px rgba(0,0,0,.87)"
  },
  bigCardText: {
    display: "flex",
    flexDirection: "column",
    margin: "auto 0"
  },
  bigCardSmallTitle: {
    zIndex: 3,
    color: "white",
    fontWeight: 400,
    marginTop: theme.spacing(),
    lineHeight: 1,
    fontSize: 18,
    textShadow: "0 3px 20px rgba(0,0,0,.7)"
  },
  bigCardVerySmallTitle: {
    zIndex: 3,
    color: "white",
    fontWeight: 700,
    fontSize: 14,
    textShadow: "0 3px 20px rgba(0,0,0,.7)",
    marginBottom: theme.spacing(),
    textTransform: "uppercase"
  },
  searchBar: {
    background: "rgba(255,255,255,.05)",
    border: "1px solid rgba(255,255,255,.1)",
    boxShadow: "none",
    maxWidth: 1970,
    minWidth: 300,
    display: "flex",
    transition: theme.transitions.create(["all"]),
    "&:hover": {
      background: "rgba(255,255,255,.08)",
      border: "1px solid rgba(255,255,255,.15)"
    },
    "&:focus": {
      background: "rgba(255,255,255,.08)",
      border: "1px solid rgba(255,255,255,.15)"
    },
    margin: "auto",
    marginLeft: theme.spacing(),
    marginRight: theme.spacing()
  },
  searchInput: {
    boxSizing: "border-box",
    padding: theme.spacing()
  },
  searchIcon: {
    paddingLeft: theme.spacing() * 2,
    paddingRight: theme.spacing() * 2,
    margin: "auto 0",
    width: "auto",
    color: "white"
  },
  profileCardImg: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: 80,
    objectFit: "cover",
    width: "100%",
    opacity: 0.4,
    zIndex: -1,
    transition: theme.transitions.create(["all"]),
    pointerEvent: "none"
  },
  userAvatar: {
    zIndex: 5,
    boxShadow: theme.shadows[6],
    borderRadius: "50%"
  },
  userNick: {
    zIndex: 5,
    textShadow: "0 2px 30px rgba(0,0,0,3)"
  },
  userTitle: {
    zIndex: 5,
    textShadow: "0 2px 30px rgba(0,0,0,3)"
  },
  secTitleText: {
    fontWeight: 700,
    fontSize: 22
  }
});

class Home extends Component {
  state = {
    feeds: null,
    anchorEl: null,
    es: false,
    loading: true,
    ongoing: null,
    rankingMentionable: null,
    hue: "#111",
    hueVib: "#111",
    hueVibN: "#111",
    lang: strings.enus,
    filterFeedVal: 0,
    randomID: 1,
    selectedRow: null,
    showMore: false,
    selectedTitle: "",
    selectedDesc: ""
  };

  componentWillMount = () => {
    checkLang(this);
    scrollFix();
  };

  componentDidMount = () => {
    this.feedsObserve();
    this.getColors();
    this.getRandomID();
    this.fetchOngoing();
  };
  componentWillUnmount = () => { };

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

  feedsObserve = () => {
    return this.props.firebase.ref("social").on("value", feed => {
      return this.props.firebase.ref("users").on("value", usersR => {
        if (!feed) {
          return null;
        }

        // Get all 'social' feeds
        const feedsync = feed.val();
        // Get users
        const usersync = usersR.val();
        // Get activity feed from users
        const users = Object.values(usersync)
          .filter(a => !a.privateLog)
          .filter(x => x.feed)
          .map(f => f.feed);
        const userFeedArray = users.map(s => Object.values(s));
        let userFeeds = [];
        userFeedArray.map(a => a.map(s => userFeeds.push(s)));
        // Make sure there ain't duplicates
        const activities = Object.values(userFeeds).filter(a =>
          userFeeds.map(s => !s.activity)
        );

        // Group them together in one feed
        let feeds = [
          ...Object.values(feedsync.byusers),
          ...feedsync.public_feed,
          ...activities
        ];

        feeds.sort((a, b) => b.date - a.date);

        return this.setState({ feeds: feeds });
      });
    });
  };

  openEntity = link => this.props.changePage(link);

  easterEggOne = () => this.setState({ es: !this.state.es });

  filterFeed = e => this.setState({ filterFeedVal: e.target.value });

  getRandomID = () =>
    this.props.firebase
      .database()
      .ref("anime")
      .child("twist")
      .on("value", val => this.setState({ randomID: val.val() }));

  componentDidCatch(error, info) {
    console.log(error, info);
  }

  selectThis = type => {
    switch (type) {
      case "oA":
        this.setState({
          selectedRow: this.state.ongoing,
          showMore: true,
          selectedTitle: this.state.lang.home.ongoingAnimeTitle,
          selectedDesc:
            this.state.ongoing &&
              this.state.ongoing.data &&
              this.props.mir
              ? `${this.state.ongoing.data.Page.media
                .filter(s => s.nextAiringEpisode).length - 1} ${this.state.lang.home.ongoingAnimeEstimate
              }`
              : null
        });
        break;
      case "oM":
        this.setState({
          selectedRow: this.state.ongoingM,
          showMore: true,
          selectedTitle: this.state.lang.home.ongoingMangaTitle
        });
        break;
      case "tc":
        this.setState({
          selectedRow: this.state.topScore,
          showMore: true,
          selectedTitle: this.state.lang.explore.topRatedTitle,
          selectedDesc: this.state.lang.explore.topRatedDesc
        });
        break;
      case "tp":
        this.setState({
          selectedRow: this.state.topPopularity,
          showMore: true,
          selectedTitle: this.state.lang.explore.topPopularTitle,
          selectedDesc: this.state.lang.explore.topPopularDesc
        });
        break;
      default:
        break;
    }
  };

  fetchOngoing = async () => {
    const ongoing = await Anilist.get(bigFuckingQuery, {
      page: 1,
      isAdult: false,
      sort: ["POPULARITY_DESC"],
      status: "RELEASING"
    });

    console.log(ongoing, this.props);

    try {
      if (ongoing)
        return this.setState({
          ongoing,
          loading: false
        });
    } catch (error) {
      console.error(error);
    }
    return null;
  };

  render() {
    const { classes } = this.props;
    const {
      feeds,
      loading,
      ongoing,
      hue,
      lang,
      filterFeedVal,
      randomID,
      showMore,
      selectedRow,
      selectedTitle,
      selectedDesc
    } = this.state;

    const user = this.props.profile;
    return (
      <div>
        <LoadingIndicator loading={loading} />
        {!isEmpty(user) && user.headers ? (
          <Header image={user.headers} color={hue} />
        ) : null}
        {isEmpty(user) ? (
          <TitleHeader
            title={lang.home.welcomeanon}
            subtitle={lang.home.welcomeSubtitle}
            miraiLogo
            color={"#000"}
          />
        ) : null}
        <Dialogue
          open={showMore}
          onClose={() =>
            this.setState({
              showMore: false,
              selectedRow: null,
              selectedTitle: "",
              selectedDesc: ""
            })
          }
          title={selectedTitle}
          actions={"close"}
        >
          {selectedDesc !== "" ? (
            <Typography variant="h5">{selectedDesc}</Typography>
          ) : null}

          <ItemContainer
            style={{
              maxWidth: 1600,
              maxHeight: window.innerHeight / 1.5,
              overflowY: "auto",
              overflowX: "hidden"
            }}
          >
            {selectedRow &&
              selectedRow.data.Page.media.map(
                (action, index) => (
                  <CardButton
                    key={index}
                    onClick={() =>
                      this.props.history.push(`/show?s=${action.id}`)
                    }
                    image={action.coverImage.large}
                    title={action.title.romaji}
                  />
                )
              )}
          </ItemContainer>
        </Dialogue>
        <div className={classes.frame}>
          <Root>
            <Container hasHeader={isEmpty(user)} spacing={2}>
              {!isEmpty(user) ? (
                <Column>
                  <SectionTitle
                    noPad
                    title={lang.home.ongoingAnimeTitle}
                    subtitle={
                      ongoing &&
                        ongoing.data &&
                        this.props.mir
                        ? `${ongoing.data.Page.media
                          .filter(s => s.nextAiringEpisode).length - 1} ${lang.home.ongoingAnimeEstimate
                        }`
                        : null
                    }
                    button={lang.explore.showAll}
                    buttonClick={() => this.selectThis("oA")}
                  />
                  {ongoing &&
                    ongoing.data &&
                    this.props.mir ? (
                    <SuperTable
                      data={ongoing.data.Page.media
                        .filter(s => s.nextAiringEpisode)
                        .sort(
                          (a, b) =>
                            a.nextAiringEpisode.timeUntilAiring -
                            b.nextAiringEpisode.timeUntilAiring
                        )}
                      type="s"
                      typeof="ongoing"
                      limit={12}
                    />
                  ) : (
                    <SuperTable loading />
                  )}
                </Column>
              ) : null}
              {!isEmpty(user) ? (
                <Hidden mdDown>
                  <Grid item xs={3} style={{ padding: 16 }}>
                    <Card
                      style={{
                        background: hue,
                        border: "1px solid rgba(255,255,255,.1)",
                        position: "relative",
                        marginBottom: 16
                      }}
                      elevation={4}
                    >
                      <CardHeader
                        onClick={() => this.props.history.push("/user")}
                        title={user.username}
                        subheader={user.nick}
                        avatar={<Avatar src={user.avatar} />}
                        style={{
                          cursor: "pointer",
                          background: `url(${user.headers})`
                        }}
                        classes={{
                          title: classes.userTitle,
                          subheader: classes.userNick,
                          avatar: classes.userAvatar
                        }}
                      />
                      <Divider />
                      <MenuItem
                        onClick={() => this.props.history.push("/user")}
                      >
                        <ICON.People style={{ marginRight: 16 }} />{" "}
                        {lang.user.friends}
                      </MenuItem>
                      <MenuItem
                        onClick={() => this.props.history.push("/later")}
                      >
                        <ICON.WatchLater style={{ marginRight: 16 }} />{" "}
                        {lang.superbar.later}
                      </MenuItem>
                      <MenuItem
                        onClick={() =>
                          this.props.history.push(
                            `/show?s=${Object.keys(randomID)[0]}`
                          )
                        }
                      >
                        <ICON.Star style={{ marginRight: 16 }} />
                        {lang.home.random}
                      </MenuItem>
                    </Card>
                    <Card
                      style={{
                        background: hue,
                        border: "1px solid rgba(255,255,255,.1)",
                        display: "none"
                      }}
                      elevation={4}
                    >
                      <CardHeader
                        title={lang.home.sponsor}
                        classes={{ title: classes.secTitleText }}
                      />
                      <Divider />
                    </Card>
                  </Grid>
                </Hidden>
              ) : (
                <Grid item xs={3} />
              )}
              <Grid item xs>
                {!isEmpty(user) ? (
                  <FeedMaker color={hue} />
                ) : (
                  <SearchBox
                    mir={this.props.mir}
                    history={this.props.history}
                    main
                    classes={{
                      searchBar: classes.searchBar,
                      searchInput: classes.searchInput,
                      searchIcon: classes.searchIcon
                    }}
                  />
                )}
                {isEmpty(user) ? (
                  <Container style={{ padding: 8 }}>
                    <Column>
                      <SectionTitle
                        noPad
                        title={lang.home.ongoingAnimeTitle}
                        subtitle={
                          ongoing &&
                            ongoing.data &&
                            this.props.mir
                            ? `${ongoing.data.Page.media.filter(s => s.nextAiringEpisode).length - 1} ${lang.home.ongoingAnimeEstimate
                            }`
                            : null
                        }
                        button={lang.explore.showAll}
                        buttonClick={() => this.selectThis("oA")}
                      />
                    </Column>
                    {ongoing &&
                      ongoing.data &&
                      this.props.mir ? (
                      <SuperTable
                        data={ongoing.data.Page.media
                          .filter(s => s.nextAiringEpisode)
                          .sort(
                            (a, b) =>
                              a.nextAiringEpisode.timeUntilAiring -
                              b.nextAiringEpisode.timeUntilAiring
                          )}
                        type="s"
                        typeof="ongoing"
                        limit={12}
                        single
                      />
                    ) : (
                      <SuperTable loading single />
                    )}
                  </Container>
                ) : null}
                <Container style={{ padding: 8 }}>
                  <SectionTitle title={lang.home.feeds} noPad />
                  <div style={{ flex: 1 }} />
                  <form>
                    <Select value={filterFeedVal} onChange={this.filterFeed}>
                      <MenuItem value={0}>{lang.home.all}</MenuItem>
                      <MenuItem value={1}>{lang.home.onlyfeeds}</MenuItem>
                      <MenuItem value={2}>{lang.home.onlyactivities}</MenuItem>
                    </Select>
                  </form>
                </Container>
                {feeds &&
                  feeds.filter(
                    o =>
                      filterFeedVal === 0
                        ? o
                        : filterFeedVal === 1
                          ? o && !o.type
                          : filterFeedVal === 2 ? o && o.type : null
                  ).length > 0 ? (
                  feeds
                    .filter(
                      o =>
                        filterFeedVal === 0
                          ? o
                          : filterFeedVal === 1
                            ? o && !o.type
                            : filterFeedVal === 2 ? o && o.type : null
                    )
                    .map((feed, index) => {
                      if (feed.user && feed.user.username === undefined)
                        // It's an update.
                        return (
                          <Feed
                            userless
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
                            userless
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
                            showId={feed.showId}
                            id={feed.id}
                            image={feed.coverImg}
                            user={{
                              avatar: feed.user.avatar,
                              id: feed.user.userID,
                              username: feed.user.username
                            }}
                            color={hue}
                            format={feed.format}
                            activity
                            noActions
                          />
                        ); // It's an user-made feed
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
                            likes={feed.likes}
                            reposts={feed.reposts}
                          />
                        );
                    })
                ) : (
                  <Container style={{ padding: 8 }}>
                    <SectionTitle title="Nobody has said anything..." lighter />
                  </Container>
                )}
              </Grid>
              {!isEmpty(user) ? (
                <Grid
                  item
                  xs={window.mobilecheck() ? 12 : 3}
                  style={{ padding: 16 }}
                >
                  <Card
                    style={{
                      background: hue,
                      border: "1px solid rgba(255,255,255,.1)",
                      marginBottom: 16
                    }}
                    elevation={4}
                  >
                    <CardHeader
                      title={lang.home.animefavTitle}
                      classes={{ title: classes.secTitleText }}
                    />
                    <Divider />
                    {!isEmpty(user) &&
                      user.favs &&
                      user.favs.show &&
                      user.favs.show ? (
                      Object.values(user.favs.show)
                        .sort((a, b) => a.name - b.name)
                        .map(anime => (
                          <MenuItem
                            style={{ paddingLeft: 0 }}
                            key={anime.id}
                            onClick={() =>
                              this.props.history.push(`/show?s=${anime.id}`)
                            }
                          >
                            <AvatarWrapper
                              src={anime.image}
                              style={{
                                borderRadius: 0,
                                height: "auto",
                                width: 60,
                                background: "white"
                              }}
                            />
                            <ListItemText primary={anime.name} />
                          </MenuItem>
                        ))
                    ) : (
                      <MenuItem disabled>
                        <Typography variant="body1">
                          {lang.home.nofavs}
                        </Typography>
                      </MenuItem>
                    )}
                  </Card>
                  <Card
                    style={{
                      background: hue,
                      border: "1px solid rgba(255,255,255,.1)"
                    }}
                    elevation={4}
                  >
                    <CardHeader
                      title={lang.home.mangafavTitle}
                      classes={{ title: classes.secTitleText }}
                    />
                    <Divider />
                    {!isEmpty(user) &&
                      user.favs &&
                      user.favs.manga &&
                      user.favs.manga ? (
                      Object.values(user.favs.manga)
                        .sort((a, b) => a.name - b.name)
                        .map(anime => (
                          <MenuItem
                            style={{ paddingLeft: 0 }}
                            key={anime.id}
                            onClick={() =>
                              this.props.history.push(`/show?m=${anime.id}`)
                            }
                          >
                            <AvatarWrapper
                              src={anime.image}
                              style={{
                                borderRadius: 0,
                                height: "auto",
                                width: 60,
                                background: "white"
                              }}
                            />
                            <ListItemText primary={anime.name} />
                          </MenuItem>
                        ))
                    ) : (
                      <MenuItem disabled>
                        <Typography variant="body1">
                          {lang.home.nofavs}
                        </Typography>
                      </MenuItem>
                    )}
                  </Card>
                </Grid>
              ) : (
                <Grid item xs={3} />
              )}
            </Container>
          </Root>
        </div>
      </div>
    );
  }
}

export default firebaseConnect()(
  connect(({ firebase: { auth, profile }, mir }) => ({
    auth,
    profile,
    mir
  }))(withStyles(styles)(Home))
);
