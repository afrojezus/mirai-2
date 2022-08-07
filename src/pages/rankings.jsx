import React, { Component } from "react";
import { connect } from "react-redux";
import { firebaseConnect, isEmpty } from "react-redux-firebase";
import SuperTable from "../components/supertable";
import queryString from "query-string";
import {
  Typography,
  Divider,
  Hidden, Tabs, Tab,
  withStyles
} from "@material-ui/core";
import CardButton from "../components/cardButton";
import SuperComment from "../components/supercomment";
import { scrollFix } from "./../utils/scrollFix";
import moment from "moment";
import strings from "../strings.json";
import Filter from "../utils/filter";
import {
  Root,
  Container,
  LoadingIndicator,
  TitleHeader,
  Header,
  CommandoBarTop,
  Column,
  SectionTitle,
  SectionSubTitle,
  ItemContainer,
  Dialogue
} from "../components/layouts";
import checklang from "../checklang";
import Anilist from "../anilist-api";
import { bigFuckingQueryM, bigFuckingQuery } from "../anilist-api/queries";

const style = theme => ({
  tabLabel: {
    opacity: 0.5,
    fontSize: 16,
    color: "white",
    textTransform: "initial"
  },
  tabLabelActive: {
    fontWeight: 700,
    fontSize: 16,
    opacity: 1,
    color: "white",
    textTransform: "initial"
  },
  tabLine: {
    filter: "drop-shadow(0 1px 12px rgba(0,0,255,.2))",
    height: 1,
    background: "white"
  },
  tab: {
    height: 64
  },
  feedTitle: {
    fontWeight: 700,
    textShadow: "0 2px 24px rgba(0,0,0,.07)",
    marginBottom: theme.spacing() * 3,
    zIndex: 20,
    color: "white"
  },
  infoBox: {
    display: "flex",
    marginBottom: theme.spacing() * 2
  },
  feedContext: {
    fontSize: theme.typography.pxToRem(16)
  },
  divider: {
    margin: "8px 0"
  }
});

class Rankings extends Component {
  state = {
    loading: true,
    index: 0,
    collection: null,
    friendRecommends: {},
    rankingMentionable: null,
    lang: strings.enus,
    actions: null,
    cgcts: null,
    dramas: null,
    memes: null,
    selectedRow: null,
    showMore: false,
    selectedTitle: "",
    selectedDesc: ""
  };

  unlisten = this.props.history.listen((location, action) => {
    const id = queryString.parse(location.search);
    if (id.c !== this.state.id && id.c !== undefined)
      return this.props.firebase
        .database()
        .ref("/rankings")
        .child("collections")
        .child(id.c)
        .on("value", val => this.setState({ collection: val.val(), index: 3 }));
    return this.setState({ collection: null });
  });

  componentWillUnmount = () => {
    this.unlisten();
  };

  componentWillMount = () => {
    checklang(this);
    this.getColors();
    scrollFix();
  };

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

  componentDidMount = async () => {
    await this.getFriendsRecommend();
    this.getCollections();
    this.fetchOngoing();
    if (this.props.history.location.search) {
      const id = queryString.parse(this.props.history.location.search);
      this.props.firebase
        .database()
        .ref("/rankings")
        .child("collections")
        .child(id.c)
        .on("value", val =>
          this.setState({ collection: val.val(), index: 3, loading: false })
        );
    }
  };

  fetchOngoing = async () => {
    const topScore = await Anilist.get(bigFuckingQuery, {
      page: 1,
      isAdult: false,
      sort: ["SCORE_DESC"]
    });

    const topPopularity = await Anilist.get(bigFuckingQuery, {
      page: 1,
      isAdult: false,
      sort: ["POPULARITY_DESC"]
    });

    const actions = await Anilist.get(bigFuckingQuery, {
      page: 1,
      isAdult: false,
      sort: ["SCORE_DESC"],
      genre: "Action"
    });

    const cgcts = await Anilist.get(bigFuckingQuery, {
      page: 1,
      isAdult: false,
      sort: ["SCORE_DESC"],
      tag: "Cute Girls Doing Cute Things"
    });

    const dramas = await Anilist.get(bigFuckingQuery, {
      page: 1,
      isAdult: false,
      sort: ["SCORE_DESC"],
      genre: "Drama"
    });

    const memes = await Anilist.get(bigFuckingQuery, {
      page: 1,
      isAdult: false,
      sort: ["SCORE_DESC"],
      genre: "Comedy",
      tag: "Parody"
    });

    const ongoing = await Anilist.get(bigFuckingQuery, {
      page: 1,
      isAdult: false,
      sort: ["POPULARITY_DESC"],
      status: "RELEASING"
    });

    const ongoingM = await Anilist.get(bigFuckingQueryM, {
      page: 1,
      isAdult: false,
      sort: ["POPULARITY_DESC"],
      status: "RELEASING"
    });

    try {
      if (
        ongoing &&
        ongoingM &&
        topPopularity &&
        topScore &&
        actions &&
        dramas &&
        cgcts &&
        memes
      )
        return this.setState({
          ongoing,
          ongoingM,
          topPopularity,
          topScore,
          actions,
          cgcts,
          dramas,
          memes,
          loading: false
        });
    } catch (error) {
      console.error(error);
    }
    return null;
  };

  getCollections = () =>
    this.props.firebase
      .ref("rankings")
      .child("collections")
      .on("value", mentionables =>
        this.setState({
          rankingMentionable: Object.values(mentionables.val())
        })
      );

  getFriendsRecommend = async () => {
    const you = this.props.profile;
    if (isEmpty(you)) {
      return null;
    }
    if (!isEmpty(you) && !you.friends) {
      return null;
    }
    const db = this.props.firebase.database().ref("/users");
    try {
      return db.on("value", value => {
        /*const allUsers = value.val();
        const yourUsers = Object.values(you.friends);
        const yourUsersArray = yourUsers.map(s => {
          return s.userID;
        });
        const allUsersArray = Object.values(allUsers);*/
      });
    } catch (error) {
      return console.error(error);
    }
  };

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
              ? `${Filter(
                this.state.ongoing.data.Page.media,
                this.props.mir.twist
              ).filter(s => s.nextAiringEpisode).length - 1} ${this.state.lang.home.ongoingAnimeEstimate
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

  render() {
    const { classes } = this.props;
    const {
      index,
      collection,
      friendRecommends,
      rankingMentionable,
      lang,
      ongoing,
      ongoingM,
      topScore,
      topPopularity,
      hue,
      actions,
      cgcts,
      dramas,
      memes,
      showMore,
      selectedRow,
      selectedTitle,
      selectedDesc
    } = this.state;
    return (
      <div>
        <LoadingIndicator loading={this.state.loading} />
        {hue ? <TitleHeader color={hue} /> : null}
        <Header
          color={hue ? hue : "#111"}
          image={collection && index === 3 ? collection.bg : null}
        />
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
              this.props.mir.twist &&
              Filter(selectedRow.data.Page.media, this.props.mir.twist).map(
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
        <CommandoBarTop title={lang.explore.title}>
          <Hidden smDown>
            <div style={{ flex: 1 }} />
          </Hidden>
          <Tabs
            value={this.state.index}
            onChange={(e, val) =>
              this.setState({ index: val, collection: null })
            }
            classes={{
              indicator: classes.tabLine
            }}
            centered
          >
            <Tab
              label={lang.explore.title}
              classes={{
                root: classes.tab,
                selected:
                  this.state.index === 0
                    ? classes.tabLabelActive
                    : classes.tabLabel
              }}
            />
            <Tab
              label={lang.explore.recommendationsTitle}
              classes={{
                root: classes.tab,
                selected:
                  this.state.index === 1
                    ? classes.tabLabelActive
                    : classes.tabLabel
              }}
            />
            <Tab
              style={{ display: "none" }}
              disabled
              label={lang.explore.hCorner}
              classes={{
                root: classes.tab,
                selected:
                  this.state.index === 2
                    ? classes.tabLabelActive
                    : classes.tabLabel
              }}
            />
            <Tab
              label={lang.explore.collectionsTitle}
              classes={{
                root: classes.tab,
                selected:
                  this.state.index === 3
                    ? classes.tabLabelActive
                    : classes.tabLabel
              }}
            />
            <Tab
              style={{ display: "none" }}
              disabled={true}
              label={lang.explore.friendsTitle}
              classes={{
                root: classes.tab,
                selected:
                  this.state.index === 4
                    ? classes.tabLabelActive
                    : classes.tabLabel
              }}
            />
          </Tabs>
          <Hidden smDown>
            <div style={{ flex: 1 }} />
          </Hidden>
        </CommandoBarTop>
        <Root hasTab>
          {index === 0 ? (
            <Container>
              <Column>
                <Typography variant="h2" className={classes.feedTitle}>
                  {lang.explore.title}
                </Typography>
                <SectionTitle
                  noPad
                  title={lang.explore.topRatedTitle}
                  button={lang.explore.showAll}
                  buttonClick={() => this.selectThis("tc")}
                />
                <SectionSubTitle title={lang.explore.topRatedDesc} />
                {topScore &&
                  topScore.data &&
                  this.props.mir ? (
                  <SuperTable
                    data={Filter(
                      topScore.data.Page.media,
                      this.props.mir.twist
                    )}
                    type="s"
                    typeof="animeS"
                    limit={12}
                  />
                ) : (
                  <SuperTable loading />
                )}
                <Divider className={classes.divider} />
                <SectionTitle
                  noPad
                  title={lang.explore.topPopularTitle}
                  button={lang.explore.showAll}
                  buttonClick={() => this.selectThis("tp")}
                />
                <SectionSubTitle title={lang.explore.topPopularDesc} />
                {topPopularity &&
                  topPopularity.data &&
                  this.props.mir ? (
                  <SuperTable
                    data={Filter(
                      topPopularity.data.Page.media,
                      this.props.mir.twist
                    )}
                    type="s"
                    typeof="animeP"
                    limit={12}
                  />
                ) : (
                  <SuperTable loading />
                )}
                <Divider className={classes.divider} />
                <SectionTitle
                  noPad
                  title={lang.home.ongoingAnimeTitle}
                  button={lang.explore.showAll}
                  buttonClick={() => this.selectThis("oA")}
                />
                <SectionSubTitle
                  title={
                    ongoing &&
                      ongoing.data &&
                      this.props.mir
                      ? `${Filter(
                        ongoing.data.Page.media,
                        this.props.mir.twist
                      ).filter(s => s.nextAiringEpisode).length - 1} ${lang.home.ongoingAnimeEstimate
                      }`
                      : null
                  }
                />
                {ongoing &&
                  ongoing.data &&
                  this.props.mir ? (
                  <SuperTable
                    data={Filter(ongoing.data.Page.media, this.props.mir.twist)
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
                <Divider className={classes.divider} />
                <SectionTitle
                  noPad
                  title={lang.home.ongoingMangaTitle}
                  button={lang.explore.showAll}
                  buttonClick={() => this.selectThis("oM")}
                />
                {ongoingM && ongoingM.data ? (
                  <SuperTable
                    data={ongoingM.data.Page.media}
                    type="m"
                    typeof="ongoing"
                    limit={12}
                  />
                ) : (
                  <SuperTable loading />
                )}
              </Column>
            </Container>
          ) : null}
          {index === 1 ? (
            <Container>
              <Column>
                <Typography variant={"display3"} className={classes.feedTitle}>
                  {lang.explore.recommendationsTitle}
                </Typography>
                <SectionTitle noPad title={lang.explore.action.title} />
                <SectionSubTitle title={lang.explore.action.desc} />
                <ItemContainer>
                  {actions &&
                    Filter(actions.data.Page.media, this.props.mir.twist).map(
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
                <Divider className={classes.divider} />
                <SectionTitle noPad title={lang.explore.cgct.title} />
                <SectionSubTitle title={lang.explore.cgct.desc} />
                <ItemContainer>
                  {cgcts &&
                    Filter(cgcts.data.Page.media, this.props.mir.twist).map(
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
                <Divider className={classes.divider} />
                <SectionTitle noPad title={lang.explore.drama.title} />
                <SectionSubTitle title={lang.explore.drama.desc} />
                <ItemContainer>
                  {dramas &&
                    Filter(dramas.data.Page.media, this.props.mir.twist).map(
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
                <Divider className={classes.divider} />
                <SectionTitle noPad title={lang.explore.meme.title} />
                <SectionSubTitle title={lang.explore.meme.desc} />
                <ItemContainer>
                  {memes &&
                    Filter(memes.data.Page.media, this.props.mir.twist).map(
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
              </Column>
            </Container>
          ) : null}
          {index === 2 ? (
            <Container>
              <Column>
                <Typography variant={"display3"} className={classes.feedTitle}>
                  Zones
                </Typography>
                <SectionTitle
                  title="A preview of this feature will come later this summer"
                  lighter
                />
              </Column>
            </Container>
          ) : null}
          {index === 3 ? (
            collection ? (
              <Container>
                <Column>
                  <Typography variant="h2" className={classes.feedTitle}>
                    {collection.name}
                  </Typography>
                  <div className={classes.infoBox}>
                    <Column>
                      <Typography variant="h6">
                        {collection.category}
                      </Typography>
                      <Typography variant="body1">{collection.desc}</Typography>
                    </Column>
                  </div>
                  <Container>
                    {Object.values(collection.data).map((anime, index) => (
                      <CardButton
                        key={index}
                        onClick={() =>
                          this.props.history.push(`/show?s=${anime.id}`)
                        }
                        image={anime.image}
                        title={anime.title}
                      />
                    ))}
                  </Container>
                  <Typography variant="h6" style={{ margin: "16px 0" }}>
                    What do you think of this collection?
                  </Typography>
                  <SuperComment
                    article={{
                      url: window.location.href,
                      identifier: collection.id,
                      title: collection.title
                    }}
                  />
                </Column>
              </Container>
            ) : (
              <Container>
                <Column>
                  <Typography variant="h2" className={classes.feedTitle}>
                    {lang.explore.collectionsTitle}
                  </Typography>
                  {rankingMentionable ? (
                    <SuperTable
                      data={Object.values(rankingMentionable)}
                      type="c"
                      typeof="ranking"
                      limit={12}
                    />
                  ) : (
                    <SuperTable loading />
                  )}
                </Column>
              </Container>
            )
          ) : null}
          {index === 4 ? (
            <Container>
              <Column>
                <Typography variant="h2" className={classes.feedTitle}>
                  {lang.explore.friendsTitle}
                </Typography>
                {friendRecommends && friendRecommends.show ? (
                  Object.values(friendRecommends)
                    .sort((a, b) => b.date - a.date)
                    .map(show => (
                      <CardButton
                        key={show.id}
                        onClick={() =>
                          this.props.history.push(`/show?s=${show.id}`)
                        }
                        title={show.name}
                        image={show.image}
                        subtitle={`Added ${moment(show.date).from(Date.now())}`}
                      />
                    ))
                ) : (
                  <SectionTitle title={lang.explore.error} lighter />
                )}
              </Column>
            </Container>
          ) : null}
        </Root>
      </div>
    );
  }
}

export default firebaseConnect()(
  connect(({ firebase: { profile }, mir }) => ({ profile, mir }))(
    withStyles(style)(Rankings)
  )
);
