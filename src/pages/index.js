import React from "react";
import { connect } from "react-redux";
import { isEmpty } from "react-redux-firebase";
import PropTypes from "prop-types";
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
  TextField,
  Paper,
  Grow,
  List,
  ListItem,
  MenuItem,
  ListItemText,
} from "@material-ui/core";
import {
  Menu as MenuIcon,
  NotificationsNone as NotificationIcon,
} from "@material-ui/icons";
import SwipeableViews from "react-swipeable-views";
import withRoot from "../withRoot";

import Home from "./home";
import Uganu from "./uganu";
import Booru from "./booru";
import Search from "./search";

import Show from "./show";

import styles from "../styles";

class Index extends React.Component {
  state = {
    open: false,
    index: 0,
    notificationDrawer: false,
    search: "",
    openWindow: false,
    showId: null,
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
    const { classes, firebase, mir } = this.props;
    const {
      open,
      index,
      notificationDrawer,
      search,
      openWindow,
      showId,
    } = this.state;
    const { profile } = firebase;
    return (
      <div>
        <AppBar position="sticky" classes={{ colorPrimary: classes.appBar }}>
          <Toolbar>
            <IconButton onClick={this.handleClick.bind(this, "open")}>
              {!isEmpty(profile) ? (
                <Avatar src={profile.avatar} />
              ) : (
                <MenuIcon />
              )}
            </IconButton>
            <div style={{ flex: 1 }} />
            <form
              onSubmit={e => {
                e.preventDefault();
                this.setState({ index: 1 });
              }}
              style={{
                flex: 1,
                position: "relative",
                width: "100%",
              }}
            >
              <TextField
                placeholder="Search anime"
                value={search}
                onChange={event =>
                  this.setState({
                    search: event.target.value,
                  })
                }
                fullWidth
                className={classes.searchBarContainer}
                InputProps={{
                  fullWidth: true,
                  className: classes.searchBar,
                  disableUnderline: true,
                }}
              />
              {search && (
                <Grow in={Boolean(search)} className={classes.searchBox}>
                  <Paper elevation={8}>
                    <List>
                      {mir.twist &&
                      mir.twist.filter(a => a.name.match(search)).length > 0 ? (
                        mir.twist &&
                        mir.twist
                          .filter(a => a.name.match(search))
                          .map((anime, index) => (
                            <MenuItem key={index}>
                              <ListItemText primary={anime.name} />
                            </MenuItem>
                          ))
                          .splice(0, 8)
                      ) : (
                        <ListItem>
                          <ListItemText
                            primary={`We couldn't find the anime you're looking for... :(`}
                          />
                        </ListItem>
                      )}
                    </List>
                  </Paper>
                </Grow>
              )}
            </form>
            <div style={{ flex: 1 }} />
            <IconButton
              onClick={this.handleClick.bind(this, "notificationDrawer")}
            >
              <NotificationIcon />
            </IconButton>
          </Toolbar>
          <Tabs
            value={index}
            onChange={(event, value) => {
              window.scrollTo(0, 0);
              this.setState({ index: value });
            }}
            indicatorColor="primary"
            textColor="primary"
            centered={document.body.offsetWidth < 800 ? false : true}
            fullWidth
          >
            <Tab label="Home" />
            <Tab label="Browse" />
            <Tab label="You" />
            <Tab label="Booru" />
          </Tabs>
        </AppBar>
        <SwipeableViews
          index={index}
          onChangeIndex={index => this.setState({ index })}
        >
          <Home
            showGet={showId =>
              this.setState({ showId, openWindow: true }, () => {
                document.body.style.overflow = "hidden";
              })
            }
          />
          <Search search={search} />
          <Uganu />
          <Booru />
        </SwipeableViews>
        <Drawer
          classes={{ paper: classes.drawer }}
          open={open}
          onClose={this.handleClose.bind(this, "open")}
        >
          <section className={classes.appDrawerToolbar}>
            {!isEmpty(profile) && (
              <div>
                <Avatar src={profile.avatar} />
                <Typography variant="headline" style={{ marginBottom: "1em" }}>
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
          onClose={this.handleClose.bind(this, "notificationDrawer")}
        >
          <Toolbar>
            <Typography variant="title">Notifications</Typography>
          </Toolbar>
        </Drawer>
        <Grow in={openWindow}>
          <Show
            style={{
              minHeight: !openWindow ? 0 : "initial",
              pointerEvents: !openWindow ? "none" : "initial",
            }}
            close={() =>
              this.setState({ openWindow: false, showId: null }, () => {
                document.body.style.overflow = "auto";
              })
            }
            id={showId}
          />
        </Grow>
      </div>
    );
  }
}

Index.propTypes = {
  classes: PropTypes.object.isRequired,
};

const cp = withRoot(withStyles(styles)(Index));

export default connect(
  state => state,
  null
)(cp);
