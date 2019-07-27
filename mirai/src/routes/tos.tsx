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

class ToS extends React.Component<any> {
  public render() {
    const { classes } = this.props;
    return (
      <div className={classes.MainContainer}>
        <Toolbar disableGutters className={classes.largeToolbar}>
          <Typography variant="h1" className={classes.largeTitle}>
            Terms of Service
          </Typography>
        </Toolbar>
      </div>
    );
  }
}

export default withStyles(styles as any)(ToS);
