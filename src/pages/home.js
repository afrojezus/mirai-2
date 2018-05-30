import React, { Component } from 'react';
import { connect } from 'react-redux';
import { isEmpty } from 'react-redux-firebase';
import {
  withStyles,
  Typography,
  Toolbar,
  Card,
  Grid,
  CardMedia,
  Button,
  CardHeader,
  CardContent,
} from '@material-ui/core';
import moment from 'moment';
import {
  ArrowBack as PreviousIcon,
  ArrowForward as NextIcon,
} from '@material-ui/icons';
import Dotdotdot from 'react-dotdotdot';
import Carousel from 'nuka-carousel';
import styles from '../styles';

import AniList from '../anilist-api';
import { bigFuckingQuery } from '../anilist-api/queries';

class Home extends Component {
  state = {
    ongoing: [],
  };

  componentDidMount = async () => {
    try {
      const { data } = await AniList.get(bigFuckingQuery, {
        page: 1,
        isAdult: false,
        sort: ['POPULARITY_DESC'],
        status: 'RELEASING',
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
    const { classes, firebase } = this.props;
    const { profile } = firebase;
    console.log(profile);
    return (
      <main>
        <section className={classes.section}>
          <img
            alt=""
            src="http://www.axp.no/wp-content/uploads/2015/09/Anders-Øvergaard-riktig.jpg"
            className={classes.memeBannerImg}
          />
          <Typography className={classes.title} variant="display3">
            Streaming. Effortless. Fast.
          </Typography>
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
                  <Card>
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
                </Grid>
              ))
              .splice(0, 7)}
            <Grid item xs className={classes.cardItem}>
              <Card className={classes.cardShowMore}>
                <div
                  style={{
                    margin: 'auto',
                    alignSelf: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    alignContent: 'center',
                  }}
                >
                  <Button
                    color="primary"
                    style={{ marginBottom: 8 }}
                    variant="fab"
                  >
                    <NextIcon />
                  </Button>
                  <Typography>Show more</Typography>
                </div>
              </Card>
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
                    <Card>
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
                            {'Episode ' +
                              anime.ep +
                              ' | ' +
                              moment(anime.recentlyWatched).fromNow()}
                          </Dotdotdot>
                        }
                      />
                    </Card>
                  </Grid>
                ))
                .splice(0, 7)}
              <Grid item xs className={classes.cardItem}>
                <Card className={classes.cardShowMore}>
                  <div
                    style={{
                      margin: 'auto',
                      alignSelf: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      alignContent: 'center',
                    }}
                  >
                    <Button
                      color="primary"
                      style={{ marginBottom: 8 }}
                      variant="fab"
                    >
                      <NextIcon />
                    </Button>
                    <Typography>Show more</Typography>
                  </div>
                </Card>
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
