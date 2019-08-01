import React from 'react';
import {
    Button,
    Fade,
    List,
    ListItem,
    Paper,
    Tab,
    Tabs,
    TextField,
    Theme,
    Toolbar,
    Typography,
    withStyles
} from '@material-ui/core';
import SwipeableViews from 'react-swipeable-views'
import globalStyles from '../globalStyles';
import * as firebase from "firebase";

const styles = (theme: Theme) => ({
    _title: {
        marginTop: -theme.spacing(12),
        fontWeight: 700,
        marginBottom: theme.spacing(2)
    },
    _titleFinal: {
        fontWeight: 700,
    },
    _subtitle: {
        marginTop: theme.spacing(2),
        fontWeight: 700,
    },
    _menu: {
        display: 'flex'

    },
    _loginDiv: {
        width: 500,
    },
    _loginPaper: {
        animation: 'SplashPaperIntroFade 0.4s ease',
        width: 'inherit',
        borderRadius: 0,
    },

    ...globalStyles(theme)
});

class Wizard extends React.Component<any> {
    state = {
        phase1: true,
        phase2: false,
        phase3: false,
        phase4: false,
        t: 0
    };

    constructor(props: any) {
        super(props);
        setTimeout(() => this.setState({phase1: false, phase2: true}, () => {
            setTimeout(() => this.setState({phase2: false, phase3: true}, () => {
                setTimeout(() => this.setState({phase3: false, phase4: true}), 5000);
            }), 5000);
        }), 5000);
    }

    handleSwitchTabs = (e: React.ChangeEvent<{}>, t: number) => this.setState({t});
    handleSwitchTabsIndex = (t: number) => this.setState({t});

    handleAnonSignIn = () => {
        firebase.auth().signInAnonymously();
        this.props.callback();
    };

    public render() {
        const {classes} = this.props;
        const {phase1, phase2, phase3, phase4, t} = this.state;
        return (<div className={classes.MainWideContainer} style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            marginTop: 0
        }}>
            {/*<img src="https://cdn.discordapp.com/attachments/400695134016110592/603193349624692748/72727363_p6_master1200.png" alt="" className={classes.containerBgImg} />*/}
            {phase1 && <Fade in={phase1}><Typography variant='h1' className={classes._title}>
                <div style={{animation: 'SplashPaperIntroFade 0.4s ease'}}>You</div>
                <div style={{animation: 'SplashPaperIntroFadeMore 0.5s ease'}}>find yourself</div>
                <div style={{animation: 'SplashPaperIntroFadeFar 0.6s ease'}}>at a very odd place.</div>
            </Typography></Fade>}
            {phase2 && <Fade in={phase2}><Typography variant='h1' className={classes._title}>
                <div style={{animation: 'SplashPaperIntroFade 0.4s ease'}}>There's nothing</div>
                <div style={{animation: 'SplashPaperIntroFadeMore 0.5s ease'}}>but yourself</div>
                <div style={{animation: 'SplashPaperIntroFadeFar 0.6s ease'}}>and this gigantic text.</div>
            </Typography></Fade>}
            {phase3 && <Fade in={phase3}><Typography variant='h1' className={classes._title}>
                <div style={{animation: 'SplashPaperIntroFade 0.4s ease'}}>Little did you know</div>
                <div style={{animation: 'SplashPaperIntroFadeMore 0.5s ease'}}>there's an entire site</div>
                <div style={{animation: 'SplashPaperIntroFadeFar 0.6s ease'}}>hidden underneath this.</div>
            </Typography></Fade>}
            {phase4 && <Fade in={phase4}>
                <div className={classes._menu}><Typography variant='h1' className={classes._titleFinal}>
                    <div style={{animation: 'SplashPaperIntroFade 0.4s ease'}}>Welcome</div>
                    <div style={{animation: 'SplashPaperIntroFadeMore 0.5s ease'}}>to the new</div>
                    <div style={{
                        animation: 'SplashPaperIntroFadeFar 0.6s ease', fontWeight: 700,
                        fontFamily: `Raleway, 'sans-serif'`,
                        letterSpacing: 10
                    }}>MIRAI
                    </div>
                </Typography>
                    <div style={{flex: 1}}/>
                    <div className={classes._loginDiv}>
                        <Paper elevation={8} className={classes._loginPaper} style={{maxHeight: t === 1 ? 456 : 308}}>
                            <Tabs
                                value={t}
                                onChange={this.handleSwitchTabs}
                                indicatorColor='primary'
                                textColor='primary'
                                variant='fullWidth'
                            >
                                <Tab label='Sign In'/>
                                <Tab label='Sign Up'/>
                            </Tabs>
                            <SwipeableViews
                                index={t}
                                onChangeIndex={this.handleSwitchTabsIndex}>
                                <div>
                                    <List>

                                        <ListItem>
                                            <TextField fullWidth margin='normal' variant='outlined'
                                                       label='Email Address' autoComplete="email" name='email'/>
                                        </ListItem>
                                        <ListItem>
                                            <TextField fullWidth margin='normal' variant='outlined' label='Password'
                                                       type='password' autoComplete="current-password" name='password'/>
                                        </ListItem>
                                        <ListItem>
                                            <Button>Forgot</Button>
                                            <div style={{flex: 1}}/>
                                            <Button variant='outlined' color='primary'>Login</Button>
                                        </ListItem>
                                    </List>
                                </div>
                                <div>
                                    <List>
                                        <ListItem>
                                            <Button>Upload Avatar</Button>
                                        </ListItem>
                                        <ListItem>
                                            <TextField
                                                helperText='Pick any name you want to be known as, this can be changed later.'
                                                fullWidth margin='normal' variant='outlined' label='Username'
                                                autoComplete="username" name='username'/>
                                            <TextField
                                                helperText='Tags are used to identify users more easily, you cannot change this later.'
                                                margin='normal' variant='outlined' label='Tag' autoComplete="tag"
                                                name='tag'/>
                                        </ListItem>
                                        <ListItem>
                                            <TextField fullWidth margin='normal' variant='outlined'
                                                       label='Email Address' autoComplete="email" name='email'/>
                                        </ListItem>
                                        <ListItem>
                                            <TextField fullWidth margin='normal' variant='outlined' label='Password'
                                                       type='password' autoComplete="current-password" name='password'/>
                                        </ListItem>
                                        <ListItem>
                                            <div style={{flex: 1}}/>
                                            <Button variant='outlined' color='primary'>Sign Up</Button>
                                        </ListItem>
                                    </List>
                                </div>
                            </SwipeableViews>
                        </Paper>
                        <Toolbar disableGutters>
                            <div style={{flex: 1}}/>
                            <Typography>
                                Or if you prefer, you can
                            </Typography>
                            <Button onClick={this.handleAnonSignIn}>Stay Anonymous</Button>
                        </Toolbar>
                    </div>
                </div>
            </Fade>}
        </div>);
    }
}

export default withStyles(styles as any)(Wizard);
