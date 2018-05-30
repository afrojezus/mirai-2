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
  LinearProgress,
} from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";
import SwipeableViews from "react-swipeable-views";
import AniList from "../anilist-api";
import {
  bigFuckingQueryS,
  entryQuery,
  entryQueryM,
  bigFuckingQueryM,
} from "../anilist-api/queries";

import styles from "../styles";

class Show extends React.Component {
  state = {
    open: false,
    index: 0,
    data: null,
    loading: true,
  };

  componentWillReceiveProps = (nextProps, nextContext) => {
    if (nextProps.id) {
      this.loadData();
    }
  };

  loadData = async () => {
    try {
      const { data } = await AniList.get(entryQuery, { id: this.props.id });
      const { Media } = data;
      this.setState({ data: Media, loading: false });
    } catch (e) {
      console.error(e);
    }
  };

  render() {
    const { classes, firebase, mir, style, close } = this.props;
    const { open, index, data, loading } = this.state;
    const { profile } = firebase;
    return (
      <div className={classes.windowFrame} style={style}>
        <AppBar position="fixed" classes={{ colorPrimary: classes.appBarShow }}>
          <Toolbar>
            <IconButton onClick={close}>
              <ArrowBack style={{ color: "white" }} />
            </IconButton>
            <div style={{ flex: 1 }} />
          </Toolbar>
        </AppBar>
        <section className={classes.section}>
          <img
            alt=""
            src={
              data
                ? data.bannerImage
                  ? data.bannerImage
                  : data.coverImage.large
                : null
            }
            style={{
              filter: data && !data.bannerImage ? "blur(10px)" : undefined,
              transform: data && !data.bannerImage ? "scale(1.1)" : undefined,
            }}
            className={classes.memeBannerImg}
          />
          <Typography
            className={classes.title}
            style={{ padding: "2em 0" }}
            variant="display3"
          >
            {data && data.title.romaji}
          </Typography>
        </section>
        <Tabs
          value={index}
          onChange={(event, value) => this.setState({ index: value })}
          indicatorColor="primary"
          textColor="primary"
          centered={document.body.offsetWidth < 800 ? false : true}
          fullWidth
        >
          <Tab label="Overview" />
          <Tab label="Episodes" />
        </Tabs>
        {loading && !data ? (
          <LinearProgress className={classes.spinner} />
        ) : (
          <SwipeableViews
            index={index}
            onChangeIndex={index => this.setState({ index })}
          >
            <main />
            <main />
          </SwipeableViews>
        )}
      </div>
    );
  }
}

Show.propTypes = {
  classes: PropTypes.object.isRequired,
};

const cp = withStyles(styles)(Show);

export default connect(state => state, null)(cp);
