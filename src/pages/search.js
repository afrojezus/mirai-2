import React, { Component } from "react";
import { connect } from "react-redux";
import { withStyles, Typography, Toolbar } from "@material-ui/core";
import styles from "../styles";

class Search extends Component {
  render() {
    const { classes, firebase, search } = this.props;
    const { profile } = firebase;
    return (
      <main>
        {Boolean(search) ? (
          <section className={classes.section}>
            <Typography
              className={classes.title}
              style={{ color: "black" }}
              variant="display3"
            >
              {search}
            </Typography>
          </section>
        ) : (
          <section className={classes.section}>
            <Toolbar disableGutters>
              <Typography
                className={classes.sectionToolbarTitle}
                variant="headline"
              >
                Browse
              </Typography>
            </Toolbar>
          </section>
        )}
      </main>
    );
  }
}

const cp = withStyles(styles)(Search);

export default connect(state => state, null)(cp);
