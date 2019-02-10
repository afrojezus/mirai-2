import {
    AppBar,
    Avatar,
    Divider,
    IconButton,
    ListItem,
    ListItemAvatar,
    ListItemSecondaryAction,
    ListItemText,
    Menu,
    MenuItem,
    Modal,
    Paper,
    Toolbar,
    Typography,
    withStyles
} from '@material-ui/core';
import * as MICON from '@material-ui/icons';
import * as React from 'react';
import {connect} from 'react-redux';
import {firestoreConnect, isEmpty} from 'react-redux-firebase';
import {Link} from 'react-router-dom';
import {compose} from 'redux';
import MiraiIcon from '../assets/mirai-icon.png';
import globalStyles from '../globalStyles';
import Searchbar from './searchbar';

const styles = (theme: any) => ({
    profileItem: {
        background: '#111',
        paddingTop: 16,
        paddingBottom: 16,
    },
    ...globalStyles(theme)
});

// Main toolbar for the application
class Bar extends React.Component<any> {
    public state = {
        menuEl: null,
        setupEl: false,
        privacyEl: false,
        helpEl: false,
        settingEl: false
    };

    public handleMenuClick = (element: any) =>
        this.setState({menuEl: element.currentTarget});
    public handleSetupClick = () => {
        this.setState({setupEl: true});
    }
    public handlePrivacyClick = () => {
        this.setState({privacyEl: true});
    }
    public handleHelpClick = () => {
        this.setState({helpEl: true});
    }
    public handleSettingsClick = () => {
        this.setState({settingEl: true});
    }
    public handleMenuClose = () => this.setState({menuEl: null});
    public handleSetupClose = () => this.setState({setupEl: false});
    public handlePrivacyClose = () => this.setState({privacyEl: false});
    public handleHelpClose = () => this.setState({helpEl: false});
    public handleSettingsClose = () => this.setState({settingEl: false});
    public goHome = () => this.props.history.push('/');

    public render() {
        const {classes, location, firebase, theme} = this.props;
        const {menuEl, setupEl, helpEl, privacyEl, settingEl} = this.state;

        const {profile} = firebase;

        let routeName: string = '';
        switch (location.pathname) {
            case '/user':
                routeName = 'User';
                break;
            case '/settings':
                routeName = 'Settings';
                break;
            case '/anime':
                routeName = 'Anime';
                break;
            case '/watch':
                routeName = 'Anime';
                break;
            default:
                break;
        }
        return (
            <div>
                <AppBar position="fixed" classes={{root: classes.appBar}}>
                    <Toolbar>
                        {location.pathname === '/' ? null : (
                            <IconButton onClick={this.goHome} style={{marginRight: 8}}>
                                <img
                                    src={MiraiIcon}
                                    alt=""
                                    style={{margin: 'auto', width: 32, height: 32, filter: 'invert(1)'}}
                                />
                            </IconButton>
                        )}
                        {location.pathname === '/' ? null : (
                            <Typography variant="title" style={{marginRight: 16}}>
                                {routeName}
                            </Typography>
                        )}
                        <div style={{flex: 1}}/>
                        {location.pathname === '/' ? null : (
                            <Searchbar style={{width: 960}}/>
                        )}
                        <div style={{flex: 1}}/>
                        <IconButton>
                            <MICON.NotificationsNoneOutlined/>
                        </IconButton>
                        <IconButton
                            aria-owns={menuEl ? 'user-menu' : undefined}
                            aria-haspopup="true"
                            onClick={this.handleMenuClick}
                            style={{marginRight: 16}}
                        >
                            {isEmpty(profile) ? <MICON.MenuOutlined/> : <Avatar
                                src="https://cdn.discordapp.com/attachments/495368554678321163/502233186911387679/1508887494012.png"
                                style={{backgroundColor: '#111', width: 24, height: 24}}
                            />}
                        </IconButton>
                        <Menu
                            id="user-menu"
                            anchorEl={menuEl}
                            open={Boolean(menuEl)}
                            onClose={this.handleMenuClose}
                            classes={{paper: classes.userMenu}}
                            anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                            MenuListProps={{
                                disablePadding: true
                            }}
                        >
                            {isEmpty(profile) ? null : <Link to="user" onClick={this.handleMenuClose}>
                                <ListItem className={classes.profileItem}>
                                    <ListItemAvatar>
                                        <Avatar
                                            src="https://cdn.discordapp.com/attachments/495368554678321163/502233186911387679/1508887494012.png"
                                            style={{backgroundColor: '#111'}}
                                        />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary="Anonymous"
                                        secondary="anon@anonmail.no"
                                    />
                                </ListItem>
                            </Link>}
                            {isEmpty(profile) ?
                                <MenuItem style={{color: theme.palette.primary.light}} onClick={this.handleSetupClick}>Sign
                                    In</MenuItem> :
                                <Link to="user" onClick={this.handleMenuClose}>
                                    <MenuItem>History</MenuItem>
                                </Link>}
                            <Divider/>
                            <MenuItem onClick={this.handleHelpClick}>Help</MenuItem>
                            <MenuItem onClick={this.handlePrivacyClick}>Privacy & Guidelines</MenuItem>
                            <Link to="monika" onClick={this.handleMenuClose}>
                                <MenuItem>Monika</MenuItem>
                            </Link>
                            <Divider/>
                            <MenuItem onClick={this.handleSettingsClick}>Settings</MenuItem>
                            {isEmpty(profile) ? null : <MenuItem>Log out</MenuItem>}
                            <Divider/>
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar
                                        src={MiraiIcon}
                                        style={{filter: 'invert(1)'}}
                                    />
                                </ListItemAvatar>
                                <ListItemText
                                    primary="Mirai"
                                    secondary="version 2.0, developed by afroJ"
                                />
                                <ListItemSecondaryAction>
                                    <IconButton>
                                        <svg viewBox="0 0 24 24" style={{width: 28, height: 28}}>
                                            <path fill="rgba(255,255,255,1)"
                                                  d="M22,24L16.75,19L17.38,21H4.5A2.5,2.5 0 0,1 2,18.5V3.5A2.5,2.5 0 0,1 4.5,1H19.5A2.5,2.5 0 0,1 22,3.5V24M12,6.8C9.32,6.8 7.44,7.95 7.44,7.95C8.47,7.03 10.27,6.5 10.27,6.5L10.1,6.33C8.41,6.36 6.88,7.53 6.88,7.53C5.16,11.12 5.27,14.22 5.27,14.22C6.67,16.03 8.75,15.9 8.75,15.9L9.46,15C8.21,14.73 7.42,13.62 7.42,13.62C7.42,13.62 9.3,14.9 12,14.9C14.7,14.9 16.58,13.62 16.58,13.62C16.58,13.62 15.79,14.73 14.54,15L15.25,15.9C15.25,15.9 17.33,16.03 18.73,14.22C18.73,14.22 18.84,11.12 17.12,7.53C17.12,7.53 15.59,6.36 13.9,6.33L13.73,6.5C13.73,6.5 15.53,7.03 16.56,7.95C16.56,7.95 14.68,6.8 12,6.8M9.93,10.59C10.58,10.59 11.11,11.16 11.1,11.86C11.1,12.55 10.58,13.13 9.93,13.13C9.29,13.13 8.77,12.55 8.77,11.86C8.77,11.16 9.28,10.59 9.93,10.59M14.1,10.59C14.75,10.59 15.27,11.16 15.27,11.86C15.27,12.55 14.75,13.13 14.1,13.13C13.46,13.13 12.94,12.55 12.94,11.86C12.94,11.16 13.45,10.59 14.1,10.59Z"/>
                                        </svg>
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        </Menu>
                    </Toolbar>
                </AppBar>
                <Modal open={setupEl} onClose={this.handleSetupClose}>
                    <Paper className={classes.mainModal}>
                        <Typography variant={'h5'} style={{marginBottom: 16}}>
                            Sign In
                        </Typography>
                        <img src={MiraiIcon} style={{margin: 'auto', filter: 'invert(1)', width: 64, height: 64}}
                             alt={''}/>

                    </Paper>
                </Modal>
                <Modal open={privacyEl} onClose={this.handlePrivacyClose}>
                    <Paper className={classes.mainModal}>
                        <Typography variant={'h5'} style={{marginBottom: 16}}>
                            Privacy & Guidelines
                        </Typography>
                        <Typography
                            variant="h6"
                            className={classes.textTitle}
                        >
                            {"Mirai should be used for what it's intended and only that."}
                        </Typography>
                        <Typography
                            variant="body1"
                            className={classes.textParagraph}
                        >
                            Watching anime, reading manga, making use of the social features
                            and engaging in what it has to offer is primarly the intent with
                            Mirais usage. <br/>
                            That implies anything of pornographic nature will not be tolerated
                            on this platform.
                        </Typography>
                        <Divider className={classes.textDivider}/>
                        <Typography
                            variant="h6"
                            className={classes.textTitle}
                        >
                            Mirai is an open platform where everyone, regardless of sex,
                            gender, race, ethnicity, are welcome.
                        </Typography>
                        <Typography
                            variant="body1"
                            className={classes.textParagraph}
                        >
                            Any form of the discrimination will be observed, and the users
                            behind will be restricted to further usage of the platform.
                        </Typography>
                    </Paper>
                </Modal>
                <Modal open={helpEl} onClose={this.handleHelpClose}>
                    <Paper className={classes.mainModal}>
                        <Typography variant={'h5'} style={{marginBottom: 16}}>
                            Help
                        </Typography>
                    </Paper>
                </Modal>
                <Modal open={settingEl} onClose={this.handleSettingsClose}>
                    <Paper className={classes.mainModal}>
                        <Typography variant={'h5'} style={{marginBottom: 16}}>
                            Settings
                        </Typography>
                    </Paper>
                </Modal>
            </div>
        );
    }
}

export default compose(
    firestoreConnect()(
        connect(
            (state) => (state)
        )(withStyles(styles as any, {withTheme: true})(Bar))
    )
);
