import React from 'react';
import { connect } from 'react-redux';
import { isEmpty } from 'react-redux-firebase';
import PropTypes from 'prop-types';
import {
  Typography,
  AppBar,
  Toolbar,
  withStyles,
  Tabs,
  Tab,
  IconButton,
  Drawer,
  Avatar,
} from '@material-ui/core';
import {
  Menu as MenuIcon,
  NotificationsNone as NotificationIcon,
} from '@material-ui/icons';
import SwipeableViews from 'react-swipeable-views';
import withRoot from '../withRoot';

import Home from './home';
import Uganu from './uganu';

import styles from '../styles';

class Index extends React.Component {
  state = {
    open: false,
    index: 0,
    notificationDrawer: false,
  };

  handleClose = type => {
    this.setState({
      [type]: false,
    });
  };

  handleClick = type => {
    this.setState({
      [type]: true,
    });
  };

  render() {
    const { classes, firebase } = this.props;
    const { open, index, notificationDrawer } = this.state;
    const { profile } = firebase;
    return (
      <div>
        <AppBar position="sticky" classes={{ colorPrimary: classes.appBar }}>
          <Toolbar>
            <IconButton onClick={this.handleClick.bind(this, 'open')}>
              {!isEmpty(profile) ? (
                <Avatar src={profile.avatar} />
              ) : (
                <MenuIcon />
              )}
            </IconButton>
            <div style={{ flex: 1 }} />
            <Typography variant="title">Mirai</Typography>
            <div style={{ flex: 1 }} />
            <IconButton
              onClick={this.handleClick.bind(this, 'notificationDrawer')}
            >
              <NotificationIcon />
            </IconButton>
          </Toolbar>
          <Tabs
            value={index}
            onChange={(event, value) => this.setState({ index: value })}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab label="Home" />
            <Tab label="You" />
            <Tab label="Booru" />
          </Tabs>
        </AppBar>
        <SwipeableViews
          index={index}
          onChangeIndex={index => this.setState({ index })}
        >
          <Home />
          <Uganu />
        </SwipeableViews>
        <Drawer
          classes={{ paper: classes.drawer }}
          open={open}
          onClose={this.handleClose.bind(this, 'open')}
        >
          <section className={classes.appDrawerToolbar}>
            {!isEmpty(profile) && (
              <div>
                <Avatar src={profile.avatar} />
                <Typography variant="headline" style={{ marginBottom: '1em' }}>
                  {profile.username}
                </Typography>
              </div>
            )}
            <Typography variant="title">Mirai 2.0</Typography>
            <Typography>afroJ</Typography>
          </section>
        </Drawer>
        <Drawer
          classes={{ paper: classes.drawer }}
          anchor="right"
          open={notificationDrawer}
          onClose={this.handleClose.bind(this, 'notificationDrawer')}
        >
          <Toolbar>
            <Typography variant="title">Notifications</Typography>
          </Toolbar>
        </Drawer>
      </div>
    );
  }
}

Index.propTypes = {
  classes: PropTypes.object.isRequired,
};

const cp = withRoot(withStyles(styles)(Index));

export default connect(state => state, null)(cp);
