import React from 'react';
import {
  withStyles,
  Theme,
  Paper,
  Typography,
  Toolbar,
  InputBase,
  Grid
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
    marginTop: theme.spacing.unit,
    animation: 'SplashPaperIntro 0.4s ease',
    boxShadow: realNearBoxShadow,
    borderRadius: 0
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
          <Typography variant="h6" className={classes.specialTitle}>
            {anime.titles.ja_jp}
          </Typography>
          <div style={{ flex: 1 }} />
        </Toolbar>

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
            <Grid item xs />
          </Grid>
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles as any)(Anime);
