import React, { Component } from "react";
import { connect } from "react-redux";
import { isEmpty } from "react-redux-firebase";
import { withStyles, Typography } from "@material-ui/core";
import styles from "../styles";

class Uganu extends Component {
  render() {
    const { classes, firebase } = this.props;
    const { profile } = firebase;
    return (
      <main>
        <section className={classes.section}>
          <img alt="" src={profile.headers} className={classes.memeBannerImg} />
          <Typography className={classes.title} variant="display3">
            {!isEmpty(profile) && profile.username}
          </Typography>
        </section>
      </main>
    );
  }
}

const cp = withStyles(styles)(Uganu);

export default connect(state => state, null)(cp);
