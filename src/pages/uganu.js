import React, { Component } from 'react';
import { withStyles, Typography } from '@material-ui/core';
import styles from '../styles';

class Uganu extends Component {
  render() {
    const { classes } = this.props;
    return (
      <main>
        <section className={classes.section}>
          <Typography className={classes.title} variant="display4">
            Fredrik er en homoseksuell apekatt
          </Typography>
        </section>
      </main>
    );
  }
}

export default withStyles(styles)(Uganu);
