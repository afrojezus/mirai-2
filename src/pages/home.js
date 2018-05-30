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
} from '@material-ui/core';
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
          <Carousel
            slidesToShow={8}
            slidesToScroll={8}
            renderCenterLeftControls={({ previousSlide }) => (
              <Button variant="fab" onClick={previousSlide}>
                <PreviousIcon />
              </Button>
            )}
            renderCenterRightControls={({ nextSlide }) => (
              <Button variant="fab" onClick={nextSlide}>
                <NextIcon />
              </Button>
            )}
            cellSpacing={16}
            framePadding={'0 8px'}
            initialSlideHeight={300}
          >
            {ongoing.map((anime, index) => (
              <Card key={index} className={classes.cardItem}>
                <CardMedia
                  className={classes.cardMedia}
                  image={anime.coverImage.large}
                />
                <CardHeader
                  classes={{
                    title: classes.cardHeaderTitle,
                  }}
                  title={<Dotdotdot clamp={1}>{anime.title.romaji}</Dotdotdot>}
                  subheader={
                    <Dotdotdot clamp={1}>{anime.description}</Dotdotdot>
                  }
                />
              </Card>
            ))}
          </Carousel>
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
            <Grid container>
              <Grid item xs className={classes.cardItem}>
                <Card>
                  <CardMedia className={classes.cardMedia} />
                  <CardHeader title="Example" subheader="Description" />
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
