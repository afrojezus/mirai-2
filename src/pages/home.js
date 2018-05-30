import React, { Component } from "react";
import { connect } from "react-redux";
import { isEmpty } from "react-redux-firebase";
import {
  withStyles,
  Typography,
  Toolbar,
  Card,
  Grid,
  CardMedia,
  Button,
  CardHeader,
  ButtonBase,
} from "@material-ui/core";
import moment from "moment";
import {
  ArrowBack as PreviousIcon,
  ArrowForward as NextIcon,
} from "@material-ui/icons";
import Dotdotdot from "react-dotdotdot";
import Carousel from "nuka-carousel";
import Adsense from "react-adsense";
import styles from "../styles";

import AniList from "../anilist-api";
import { bigFuckingQuery } from "../anilist-api/queries";

const timeFormatter = time => {
  const secNum = parseInt(time, 10); // don't forget the second param
  let hours = Math.floor(secNum / 3600);
  let minutes = Math.floor((secNum - hours * 3600) / 60);
  let seconds = secNum - hours * 3600 - minutes * 60;
  let days = Math.floor(secNum / (3600 * 24));

  if (hours < 10) {
    hours = `0${hours}`;
  }
  if (hours === "00") {
    hours = null;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  if (seconds < 10) {
    seconds = `0${seconds}`;
  }
  if (days === 0) {
    days = null;
  }

  return `${(days ? days + (days > 1 ? " days " : " day ") : "") +
    (hours ? `${hours} hr ` : "") +
    minutes} min`;
};

class Home extends Component {
  state = {
    ongoing: [],
  };

  componentDidMount = async () => {
    try {
      const { data } = await AniList.get(bigFuckingQuery, {
        page: 1,
        isAdult: false,
        sort: ["POPULARITY_DESC"],
        status: "RELEASING",
      });
      const { Page } = data;
      const { media } = Page;
      this.setState({ ongoing: media });
    } catch (e) {
      console.error(e);
    }
  };

  render() {
    const { ongoing } = this.state;
    const { classes, firebase, showGet } = this.props;
    const { profile } = firebase;
    return (
      <main>
        <section className={classes.section}>
          <Adsense.Google
            client="ca-pub-5718203937607584"
            slot="7606078429"
            format="auto"
          />
        </section>
        <section className={classes.section}>
          <Toolbar disableGutters>
            <Typography
              className={classes.sectionToolbarTitle}
              variant="headline"
            >
              Schedule
            </Typography>
          </Toolbar>
          <Carousel
            autoplay
            slidesToShow={4}
            cellSpacing={8}
            framePadding="0 0 1em 0"
            frameOverflow="initial"
            renderBottomCenterControls={null}
            renderCenterLeftControls={({ previousSlide }) => (
              <Button color="primary" variant="fab" onClick={previousSlide}>
                <PreviousIcon />
              </Button>
            )}
            renderCenterRightControls={({ nextSlide }) => (
              <Button color="primary" variant="fab" onClick={nextSlide}>
                <NextIcon />
              </Button>
            )}
          >
            {ongoing
              .filter(a => a.nextAiringEpisode)
              .sort(
                (a, b) =>
                  b.nextAiringEpisode.timeUntilAiring -
                  a.nextAiringEpisode.timeUntilAiring
              )
              .map((anime, index) => (
                <ButtonBase
                  focusRipple
                  key={index}
                  className={classes.cardItemCarousel}
                  onClick={() => showGet(anime.id)}
                >
                  <Card className={classes.cardItemFlex}>
                    <CardMedia
                      className={classes.cardMedia}
                      image={anime.coverImage.large}
                    />
                    <CardHeader
                      classes={{
                        title: classes.cardHeaderTitle,
                      }}
                      title={
                        <Dotdotdot clamp={1}>{anime.title.romaji}</Dotdotdot>
                      }
                      subheader={
                        <Dotdotdot clamp={1}>
                          {"Episode " +
                            anime.nextAiringEpisode.episode +
                            " in " +
                            timeFormatter(
                              anime.nextAiringEpisode.timeUntilAiring
                            )}
                        </Dotdotdot>
                      }
                    />
                  </Card>
                </ButtonBase>
              ))
              .reverse()}
          </Carousel>
        </section>
        <section className={classes.section}>
          <Toolbar disableGutters>
            <Typography
              className={classes.sectionToolbarTitle}
              variant="headline"
            >
              New & Trending
            </Typography>
          </Toolbar>
          <Grid container spacing={8}>
            {ongoing
              .map((anime, index) => (
                <Grid item xs key={index} className={classes.cardItem}>
                  <ButtonBase
                    focusRipple
                    className={classes.cardButtonBase}
                    onClick={() => showGet(anime.id)}
                  >
                    <Card className={classes.cardItemFlex}>
                      <CardMedia
                        className={classes.cardMedia}
                        image={anime.coverImage.large}
                      />
                      <CardHeader
                        classes={{
                          title: classes.cardHeaderTitle,
                        }}
                        title={
                          <Dotdotdot clamp={1}>{anime.title.romaji}</Dotdotdot>
                        }
                        subheader={
                          <Dotdotdot clamp={1}>{anime.description}</Dotdotdot>
                        }
                      />
                    </Card>
                  </ButtonBase>
                </Grid>
              ))
              .splice(0, 7)}
            <Grid item xs className={classes.cardItem}>
              <ButtonBase focusRipple className={classes.cardButtonBase}>
                <Card className={classes.cardShowMore}>
                  <div
                    style={{
                      margin: "auto",
                      alignSelf: "center",
                      justifyContent: "center",
                      textAlign: "center",
                      alignContent: "center",
                    }}
                  >
                    <NextIcon style={{ marginBottom: 8 }} />
                    <Typography>Show more</Typography>
                  </div>
                </Card>
              </ButtonBase>
            </Grid>
          </Grid>
        </section>
        {!isEmpty(profile) && (
          <section className={classes.section}>
            <Toolbar disableGutters>
              <Typography
                className={classes.sectionToolbarTitle}
                variant="headline"
              >
                Last watched
              </Typography>
            </Toolbar>
            <Grid container spacing={8}>
              {Object.values(profile.episodeProgress)
                .map((anime, index) => (
                  <Grid item xs key={index} className={classes.cardItem}>
                    <ButtonBase
                      focusRipple
                      className={classes.cardButtonBase}
                      onClick={() => showGet(anime.showId)}
                    >
                      <Card className={classes.cardItemFlex}>
                        <CardMedia
                          className={classes.cardMedia}
                          image={anime.showArtwork}
                        />
                        <CardHeader
                          classes={{
                            title: classes.cardHeaderTitle,
                          }}
                          title={<Dotdotdot clamp={1}>{anime.title}</Dotdotdot>}
                          subheader={
                            <Dotdotdot clamp={1}>
                              {"Episode " +
                                anime.ep +
                                " | " +
                                moment(anime.recentlyWatched).fromNow()}
                            </Dotdotdot>
                          }
                        />
                      </Card>
                    </ButtonBase>
                  </Grid>
                ))
                .splice(0, 7)}
              <Grid item xs className={classes.cardItem}>
                <ButtonBase focusRipple className={classes.cardButtonBase}>
                  <Card className={classes.cardShowMore}>
                    <div
                      style={{
                        margin: "auto",
                        alignSelf: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        alignContent: "center",
                      }}
                    >
                      <NextIcon style={{ marginBottom: 8 }} />
                      <Typography>Show more</Typography>
                    </div>
                  </Card>
                </ButtonBase>
              </Grid>
            </Grid>
          </section>
        )}
      </main>
    );
  }
}

const cp = withStyles(styles)(Home);

export default connect(state => state, null)(cp);
