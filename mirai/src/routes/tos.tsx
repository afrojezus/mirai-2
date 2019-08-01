import React from 'react';
import {
  withStyles,
  Theme,
  Paper,
  Typography,
  Toolbar,
  InputBase,
  Divider
} from '@material-ui/core';
import globalStyles from '../globalStyles';

const styles = (theme: Theme) => ({
  ...globalStyles(theme)
});

class ToS extends React.Component<any> {
  public render() {
    const { classes } = this.props;
    return (
      <div className={classes.MainWideContainer}>
        <Toolbar disableGutters className={classes.largeToolbar} style={{animation: 'SplashPaperIntroFade 0.4s ease'}}>
          <Typography variant="h1" className={classes.largeTitle}>
            Terms of Service
          </Typography>
        </Toolbar>
        <Typography variant='h6'>
        Mirai should be used for what it's intended and only that.
        </Typography>
        <Typography>
        Watching anime, reading manga, making use of the social features and engaging in what it has to offer is primarly the intent with Mirais usage. 
That implies anything of pornographic nature will not be tolerated on this platform.
        </Typography>
        <Divider style={{marginTop: 16, marginBottom: 16}} />
        <Typography variant='h6'>
        Mirai is an open platform where everyone, regardless of sex, gender, race, ethnicity, are welcome.
        </Typography>
        <Typography>
        Any form of the discrimination will be observed, and the users behind will be restricted to further usage of the platform.
        </Typography>
      </div>
    );
  }
}

export default withStyles(styles as any)(ToS);
