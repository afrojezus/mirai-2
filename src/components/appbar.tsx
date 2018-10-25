import {
  AppBar,
  Avatar,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  withStyles
} from '@material-ui/core';
import * as MICON from '@material-ui/icons';
import * as React from 'react';
import { Link } from 'react-router-dom';
import MiraiIcon from '../assets/icon.png';
import globalStyles from '../globalStyles';
import Searchbar from './searchbar';

// Main toolbar for the application
class Bar extends React.Component<any> {
  public state = {
    menuEl: null
  };

  public handleMenuClick = (element: any) =>
    this.setState({ menuEl: element.currentTarget });
  public handleMenuClose = () => this.setState({ menuEl: null });
  public goHome = () => this.props.history.push('/');

  public render() {
    const { classes, location } = this.props;
    const { menuEl } = this.state;
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
        <AppBar position="fixed" classes={{ root: classes.appBar }}>
          <Toolbar>
            {location.pathname === '/' ? null : (
              <IconButton onClick={this.goHome} style={{ marginRight: 8 }}>
                <img
                  src={MiraiIcon}
                  alt=""
                  style={{ margin: 'auto', width: 24, height: 24 }}
                />
              </IconButton>
            )}
            {location.pathname === '/' ? null : (
              <Typography variant="title" style={{ marginRight: 16 }}>
                {routeName}
              </Typography>
            )}
            <div style={{ flex: 1 }} />
            {location.pathname === '/' ? null : (
              <Searchbar style={{ width: 800 }} />
            )}
            <div style={{ flex: 1 }} />
            <IconButton>
              <MICON.NotificationsNoneOutlined />
            </IconButton>
            <IconButton
              aria-owns={menuEl ? 'user-menu' : undefined}
              aria-haspopup="true"
              onClick={this.handleMenuClick}
              style={{ marginRight: 16 }}
            >
              <Avatar
                src="https://cdn.discordapp.com/attachments/495368554678321163/502233186911387679/1508887494012.png"
                style={{ backgroundColor: '#111', width: 24, height: 24 }}
              />
            </IconButton>
            <Menu
              id="user-menu"
              anchorEl={menuEl}
              open={Boolean(menuEl)}
              onClose={this.handleMenuClose}
              classes={{ paper: classes.userMenu }}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <Link to="user" onClick={this.handleMenuClose}>
                <MenuItem>Profile</MenuItem>
              </Link>
              <Link to="settings" onClick={this.handleMenuClose}>
                <MenuItem>Settings</MenuItem>
              </Link>
              <Divider />
              <MenuItem>Log out</MenuItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <img
                    src={MiraiIcon}
                    alt=""
                    style={{ margin: 'auto 0', width: 32, height: 32 }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary="Mirai"
                  secondary="version 2.0, developed by nani"
                />
              </ListItem>
            </Menu>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default withStyles(globalStyles as any)(Bar);
