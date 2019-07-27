import React from 'react';
import {
  withStyles,
  Theme,
  Paper,
  Typography,
  Toolbar,
  InputBase,
  Grid,
  IconButton
} from '@material-ui/core';
import globalStyles, { realNearBoxShadow } from '../globalStyles';
import Player from 'components/player';

const styles = (theme: Theme) => ({
  bg: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: -1,
    objectFit: 'cover',
    width: '100%',
    filter: 'blur(0px)',
    transform: 'scale(1)',
    opacity: 0.1,
    animation: 'BgIntro 0.4s ease'
  },
  posterImage: {
    width: 200
  },
  animeBlock: {
    marginTop: theme.spacing(0),
    animation: 'SplashPaperIntro 1s ease',
    boxShadow: realNearBoxShadow,
    borderRadius: 0
  },
  bgTitle: {
    fontWeight: 700,
    position: 'fixed',
    fontSize: 256,
    left: '1%',
    top: '5%',
    color: theme.palette.background.default,
    zIndex: -1,
    animation: 'SplashPaperIntroText 1s ease'
  },
  ...globalStyles(theme)
});

class Anime extends React.Component<any> {
  public render() {
    const { classes, location } = this.props;
    const { anime } = location.state;
    return (
      <div className={classes.MainContainer}>
        <img alt="" className={classes.bg} src={anime.coverImage.large} />
        <Toolbar disableGutters className={classes.largeToolbar}>
          <div style={{ flex: 1 }} />
          <div style={{ flex: 1 }} />
        </Toolbar>

        <Typography variant="h1" className={classes.bgTitle}>
            {anime.titles.en_jp}
          </Typography>

        <Paper elevation={24} className={classes.animeBlock}>
          <Player src="" />
          <Grid container>
            <Grid item>
              <img
                alt=""
                src={anime.posterImage.large}
                className={classes.posterImage}
              />
            </Grid>
            <Grid item xs>
              <Toolbar>
              <Typography variant="h5" style={{fontWeight: 700}}>
            {anime.titles.en_jp}
          </Typography>
          <div style={{flex: 1}} />
          <Typography style={{margin: '0 16px'}}>Popular</Typography>
          <Typography>Ongoing</Typography>
              </Toolbar>
              </Grid>
          </Grid>
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles as any)(Anime);
