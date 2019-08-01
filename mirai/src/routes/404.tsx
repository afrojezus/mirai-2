import React from 'react';
import { withStyles, Theme, Typography } from '@material-ui/core';
import Iframe from 'react-iframe';
import globalStyles from '../globalStyles';

const styles = (theme: Theme) => ({
  _title: {
    marginTop: -theme.spacing(12),
    fontWeight: 700,
    marginBottom: theme.spacing(2)
  },
  _subtitle: {
    marginTop: theme.spacing(2),
    fontWeight: 700,
  },
  ...globalStyles(theme)
});

class FourOFour extends React.Component<any> {
  public render() {
    const {classes} = this.props;
    return <div className={classes.MainWideContainer} style={{height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', marginTop: 0}}>
      <img src="https://cdn.discordapp.com/attachments/400695134016110592/603193349624692748/72727363_p6_master1200.png" alt="" className={classes.containerBgImg} />
      <Typography variant='h1' className={classes._title}>
        <div style={{animation: 'SplashPaperIntroFade 0.4s ease'}}>You</div>
        <div style={{animation: 'SplashPaperIntroFadeMore 0.5s ease'}}>find yourself</div>
        <div style={{animation: 'SplashPaperIntroFadeFar 0.6s ease'}}>at a very odd place.</div>
      </Typography>
      <div style={{animation: 'SplashPaperIntroFadeFar 0.7s ease', border: 'none'}}><Iframe frameBorder={0} width="560px" height="315px" url="https://www.youtube.com/embed/eGslweDOihs" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" /></div>
      <Typography variant='h4' className={classes._subtitle}>
        <div style={{animation: 'SplashPaperIntroFadeFar 0.7s ease'}}>A 404, it appears to be.</div>
      </Typography>
      </div>;
  }
}

export default withStyles(styles as any)(FourOFour);
