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

class Explore extends React.Component<any> {
  state = {};
  public render() {
    const { classes } = this.props;
    return (
      <div className={classes.MainContainer}>
        <Toolbar disableGutters className={classes.largeToolbar}>
          <div style={{ flex: 1 }} />
          <Typography variant="h6" className={classes.specialTitle}>
            EVERY ANIME YOU COULD THINK OF, IN ONE PLACE, FOR FREE
          </Typography>
          <div style={{ flex: 1 }} />
        </Toolbar>
        <Toolbar disableGutters>
          <Paper elevation={24} className={classes.paperBlock}>
            <div className={classes.paperPadding}>
              <InputBase
                className={classes.paperInput}
                placeholder="Search the directory"
              />
            </div>
          </Paper>
        </Toolbar>
      </div>
    );
  }
}

export default withStyles(styles as any)(Explore);
