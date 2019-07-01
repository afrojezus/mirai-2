import React from 'react';
import {
  withStyles,
  Theme,
  Paper,
  Typography,
  Toolbar,
  InputBase
} from '@material-ui/core';
import globalStyles from '../globalStyles';

const styles = (theme: Theme) => ({
  ...globalStyles(theme)
});

class Account extends React.Component<any> {
  public render() {
    const { classes } = this.props;
    return (
      <div className={classes.MainContainer}>
        <Toolbar disableGutters className={classes.largeToolbar}>
          <div style={{ flex: 1 }} />
          <Typography variant="h6" className={classes.specialTitle}>
            EXAMPLE USER
          </Typography>
          <div style={{ flex: 1 }} />
        </Toolbar>
      </div>
    );
  }
}

export default withStyles(styles as any)(Account);
