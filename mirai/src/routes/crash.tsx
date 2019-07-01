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

class Crash extends React.Component<any> {
  public render() {
    const { classes, error } = this.props;
    return (
      <div className={classes.MainContainer}>
        <Toolbar disableGutters className={classes.largeToolbar}>
          <div style={{ flex: 1 }} />
          <Typography variant="display1" className={classes.largeTitle}>
            Crashed!
          </Typography>
          <div style={{ flex: 1 }} />
        </Toolbar>
        <Toolbar disableGutters>
          <div style={{ flex: 1 }} />
          <Typography variant="display4">
            That wasn't quite what was supposed to happen. Maybe refresh?
          </Typography>
          <div style={{ flex: 1 }} />
        </Toolbar>
        <Toolbar disableGutters style={{ paddingTop: 16 }}>
          <div style={{ flex: 1 }} />
          <Typography
            variant="subtitle1"
            style={{
              color:
                (window as any).theme.palette.type === 'dark'
                  ? 'rgba(255,255,255,.3)'
                  : 'rgba(0,0,0,.3)'
            }}
          >
            {error}
          </Typography>
          <div style={{ flex: 1 }} />
        </Toolbar>
      </div>
    );
  }
}

export default withStyles(styles as any)(Crash);
