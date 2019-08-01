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

class Faq extends React.Component<any> {
  public render() {
    const { classes } = this.props;
    return (
      <div className={classes.MainWideContainer}>
        <Toolbar disableGutters className={classes.largeToolbar} style={{animation: 'SplashPaperIntroFade 0.4s ease'}}>
          <Typography variant="h1" className={classes.largeTitle}>
            Frequently Asked Questions
          </Typography>
        </Toolbar>
        <Typography variant='h6'>
        Is it legal to watch anime on here?
        </Typography>
        <Typography>
        It's perfectly fine to watch anime on Mirai. The content provided is however none of MIR's responsibility. We get our content from Anime Twist.
<br />
As an addition, we provide links where you can support the creators by referring to a Blu-ray set of the same anime, or a copy of their manga at Amazon. 
<br />
Any complaints regarding copyright will be observed, and we will ensure the copyrighted content will no longer be avaliable on Mirai.
        </Typography>
        <Divider style={{marginTop: 16, marginBottom: 16}} />
        <Typography variant='h6'>
        The site is slow.
        </Typography>
        <Typography>
        The previous iteration of Mirai was indeed slow, but this new version should be way faster.<br />
        It is updated for the latest browsers. If it's experienced as clunky or slow, we recommend switching to Chrome or Firefox.
        </Typography>
        <Divider style={{marginTop: 16, marginBottom: 16}} />
        <Typography variant='h6'>
        The anime I want to watch isn't avaliable, what do?
        </Typography>
        <Typography>
       Give us time to fix it, or in desperate measures, consider finding the anime on your own through Nyaa.si.
        </Typography>
      </div>
    );
  }
}

export default withStyles(styles as any)(Faq);