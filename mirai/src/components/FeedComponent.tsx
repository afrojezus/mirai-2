import React from 'react';
import { withStyles, Theme, Menu, Paper } from '@material-ui/core';
import { realNearBoxShadow } from '../globalStyles';

const styles = (theme: Theme) => ({
  feedcomponent: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 0,
    boxShadow: realNearBoxShadow
  }
});

class FeedComponent extends React.Component<any> {
  render() {
    const { classes } = this.props;
    return (
      <Paper className={classes.feedcomponent}>
          </Paper>
    );
  }
}

export default withStyles(styles as any)(FeedComponent);