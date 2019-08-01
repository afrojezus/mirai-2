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

class Pri extends React.Component<any> {
  public render() {
    const { classes } = this.props;
    return (
      <div className={classes.MainWideContainer}>
        <Toolbar disableGutters className={classes.largeToolbar} style={{animation: 'SplashPaperIntroFade 0.4s ease'}}>
          <Typography variant="h1" className={classes.largeTitle}>
            Privacy Policy
          </Typography>
        </Toolbar>
        <Typography variant='h6'>
        Your privacy on Mirai
        </Typography>
        <Typography>
        Mirai does not sell user data nor does it transfer it to third-parties and etc. 
How the service is provided is purely by external sources that gather the information anonymously. None of the user data has an effect on the internal workings of the application.
<br />
Internally users are identified by individual keys. Anything shared is only avaliable inside the application, any image uploads except for in singular feeds are stored internally in the Mirai server. Images uploaded and shared inside feeds are uploaded onto an external file server in order to decrease costs. 
<br />
Some anonymous information is sent to Google such as session time. Google Analytics is the only tracker used on Mirai; however it does not send anything other than the system information and the location of the IP.
        </Typography>
        <Divider style={{marginTop: 16, marginBottom: 16}} />
        <Typography variant='h6'>
        Cookies
        </Typography>
        <Typography>
        Mirai does store cookies, only for saving account information locally on your system in order to log you back in next time. The cookies do not store anything else.
<br />
This is needed to point out in compliance with the EU law on information tokens. (Mirai is an European product)
        </Typography>
        <Divider style={{marginTop: 16, marginBottom: 16}} />
        <Typography variant='h6'>
        COPPA (Children Online Privacy Protection Act)
        </Typography>
        <Typography>
        When it comes to the collection of personal information from children under 13, the Children's Online Privacy Protection Act (COPPA) puts parents in control. 
The Federal Trade Commission, the nation's consumer protection agency, enforces the COPPA Rule, which spells out what operators of websites and online services must do to protect children's privacy and safety online.
<br />
We do not specifically market to children under 13.
        </Typography>
      </div>
    );
  }
}

export default withStyles(styles as any)(Pri);
