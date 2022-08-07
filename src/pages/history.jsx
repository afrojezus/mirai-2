import React, { Component } from "react";
import { connect } from "react-redux";
import { firebaseConnect, isEmpty } from "react-redux-firebase";
import moment from "moment";
import strings from "../strings.json";
import {
  Root,
  CommandoBarTop,
  Container,
  TitleHeader,
  Header,
  Column,
  SectionTitle,
  ItemContainer,
  SectionSubTitle
} from "../components/layouts";
import SuperTable from "../components/supertable";
import checklang from "../checklang";
import { Feed } from "../components/feed";
import { scrollFix } from "./../utils/scrollFix";
import CardButton from "../components/cardButton";

import {
  Typography,
  Divider,
  withStyles,
  Hidden,
  Tabs,
  Tab
} from "@material-ui/core";

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
    fontWeight: 800,
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
  commandoText: {
    margin: "auto",
    textAlign: "center"
  },
  commandoTextBox: {
    paddingLeft: theme.spacing(),
    paddingRight: theme.spacing(),
    margin: "auto"
  },
  divider: {
    marginTop: theme.spacing(),
    marginBottom: theme.spacing()
  }
});

class History extends Component {
  state = {
    index: 0,
    lang: strings.enus
  };

  componentWillMount = () => {
    checklang(this);
    scrollFix();
    this.getColors();
  };

  componentDidMount = () => { };

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

  render() {
    const { classes, profile } = this.props;
    const { index, lang, hue } = this.state;
    const user = isEmpty(profile) ? null : profile;
    return (
      <div>
        <TitleHeader color={hue ? hue : "#000"} />
        <Header color={hue ? hue : "#111"} />
        <CommandoBarTop title={lang.superbar.history}>
          <Hidden smDown>
            <div
              className={classes.commandoTextBox}
              style={{ marginRight: 16, marginLeft: 16 }}
            >
              <Typography variant="h6" className={classes.commandoText}>
                {lang.superbar.history}
              </Typography>
            </div>
          </Hidden>
          <Tabs
            value={this.state.index}
            onChange={(e, val) => this.setState({ index: val })}
            classes={{
              indicator: classes.tabLine
            }}
          >
            <Tab
              label={lang.history.overview}
              classes={{
                root: classes.tab,
                selected:
                  this.state.index === 0
                    ? classes.tabLabelActive
                    : classes.tabLabel
              }}
            />
            <Tab
              label={lang.history.alog}
              classes={{
                root: classes.tab,
                selected:
                  this.state.index === 1
                    ? classes.tabLabelActive
                    : classes.tabLabel
              }}
            />
            <Tab
              label={lang.history.mlog}
              classes={{
                root: classes.tab,
                selected:
                  this.state.index === 2
                    ? classes.tabLabelActive
                    : classes.tabLabel
              }}
            />
            <Tab
              label={lang.history.ulog}
              classes={{
                root: classes.tab,
                selected:
                  this.state.index === 3
                    ? classes.tabLabelActive
                    : classes.tabLabel
              }}
            />
          </Tabs>
          <div style={{ flex: 1 }} />
        </CommandoBarTop>
        <Root hasTab>
          {index === 0 ? (
            <Container>
              <Column>
                <Typography variant="h2" className={classes.feedTitle}>
                  {lang.history.overview}
                </Typography>
                {user && user.episodeProgress ? (
                  <div>
                    <SectionTitle noPad title={lang.home.animehistoryTitle} />
                    <SectionSubTitle
                      title={
                        Object.values(user.episodeProgress).length -
                        1 +
                        " " +
                        lang.home.animehistoryEstimate
                      }
                    />
                    <Container spacing={2}>
                      {user.episodeProgress ? (
                        <SuperTable
                          data={Object.values(user.episodeProgress)
                            .filter(s => s.recentlyWatched)
                            .sort(
                              (a, b) => b.recentlyWatched - a.recentlyWatched
                            )}
                          limit={24}
                          type="s"
                          typeof="progress"
                        />
                      ) : (
                        <SuperTable loading />
                      )}
                    </Container>
                  </div>
                ) : (
                  <Typography
                    variant="h6"
                    style={{ color: "rgba(255,255,255, .5)" }}
                  >
                    {lang.history.noneA}
                  </Typography>
                )}
                <Divider className={classes.divider} />
                {user && user.chapterProgress ? (
                  <div>
                    <SectionTitle noPad title={lang.home.animehistoryTitle} />
                    <SectionSubTitle
                      title={
                        Object.values(user.episodeProgress).length -
                        1 +
                        " " +
                        lang.home.animehistoryEstimate
                      }
                    />
                    <Container spacing={2}>
                      {user.episodeProgress ? (
                        <SuperTable
                          data={Object.values(user.episodeProgress)
                            .filter(s => s.recentlyWatched)
                            .sort(
                              (a, b) => b.recentlyWatched - a.recentlyWatched
                            )}
                          limit={24}
                          type="s"
                          typeof="progress"
                        />
                      ) : (
                        <SuperTable loading />
                      )}
                    </Container>
                  </div>
                ) : (
                  <Typography
                    variant="h6"
                    style={{ color: "rgba(255,255,255, .5)" }}
                  >
                    {lang.history.noneM}
                  </Typography>
                )}
                <Divider className={classes.divider} />
                {user && user.feed ? (
                  <div>
                    <SectionTitle noPad title="Activity" />
                    <SectionSubTitle
                      title={
                        Object.values(user.feed).length +
                        " " +
                        lang.history.instances
                      }
                    />
                    <ItemContainer>
                      <Column>
                        {Object.values(user.feed)
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
                                username: feed.user.username
                              }}
                              format={feed.format}
                              activity
                              noActions
                              color={hue}
                            />
                          ))}
                      </Column>
                    </ItemContainer>
                  </div>
                ) : (
                  <Typography
                    variant="h6"
                    style={{ color: "rgba(255,255,255, .5)" }}
                  >
                    {user && !user.willLog
                      ? lang.history.logdisabled
                      : lang.history.noneU}
                  </Typography>
                )}
              </Column>
            </Container>
          ) : null}
          {index === 1 ? (
            <Container>
              <Column>
                <Typography variant="h2" className={classes.feedTitle}>
                  {lang.history.alog}
                </Typography>
                <ItemContainer>
                  {!isEmpty(user) && user.episodeProgress ? (
                    Object.values(user.episodeProgress)
                      .filter(s => s.recentlyWatched)
                      .sort((a, b) => b.recentlyWatched - a.recentlyWatched)
                      .map(show => (
                        <CardButton
                          key={show.showId}
                          onClick={() =>
                            this.props.history.push(`/show?s=${show.showId}`)
                          }
                          title={show.title}
                          image={show.showArtwork}
                          subtitle={
                            show.ep
                              ? `Episode ${show.ep} | ${moment(
                                show.recentlyWatched
                              ).from(Date.now())}`
                              : null
                          }
                        />
                      ))
                  ) : (
                    <Typography
                      variant="h6"
                      style={{ color: "rgba(255,255,255, .5)" }}
                    >
                      {lang.history.noneA}
                    </Typography>
                  )}
                </ItemContainer>
              </Column>
            </Container>
          ) : null}
          {index === 2 ? (
            <Container>
              <Column>
                <Typography variant="h2" className={classes.feedTitle}>
                  {lang.history.mlog}
                </Typography>
                <ItemContainer>
                  {!isEmpty(user) && user.chapterProgress ? (
                    Object.values(user.chapterProgress)
                      .filter(s => s.recentlyRead)
                      .sort((a, b) => b.recentlyRead - a.recentlyRead)
                      .map(show => (
                        <CardButton
                          key={show.showId}
                          onClick={() =>
                            this.props.history.push(`/show?m=${show.showId}`)
                          }
                          title={show.title}
                          image={show.showArtwork}
                          subtitle={
                            show.ep
                              ? `Chapter ${show.ch} | ${moment(
                                show.recentlyRead
                              ).from(Date.now())}`
                              : null
                          }
                        />
                      ))
                  ) : (
                    <Typography
                      variant="h6"
                      style={{ color: "rgba(255,255,255, .5)" }}
                    >
                      {lang.history.noneM}
                    </Typography>
                  )}
                </ItemContainer>
              </Column>
            </Container>
          ) : null}
          {index === 3 ? (
            <Container>
              <Column>
                <Typography variant="h2" className={classes.feedTitle}>
                  {lang.history.ulog}
                </Typography>
                <ItemContainer>
                  {user && user.feed ? (
                    Object.values(user.feed)
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
                            username: feed.user.username
                          }}
                          activity
                          format={feed.format}
                          noActions
                          color={hue}
                        />
                      ))
                  ) : (
                    <Typography
                      variant="h6"
                      style={{ color: "rgba(255,255,255, .5)" }}
                    >
                      {user && !user.willLog
                        ? lang.history.logdisabled
                        : lang.history.noneU}
                    </Typography>
                  )}
                </ItemContainer>
              </Column>
            </Container>
          ) : null}
        </Root>
      </div>
    );
  }
}

export default firebaseConnect()(
  connect(({ firebase: { profile } }) => ({ profile }))(
    withStyles(style)(History)
  )
);
