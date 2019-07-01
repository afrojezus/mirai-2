import React from 'react';
import { withStyles, Theme } from '@material-ui/core';

const styles = (theme: Theme) => ({
  player: {
    height: 450,
    width: '100%',
    background: 'black'
  }
});

interface PlayerProps {
  classes: any;
  src: string;
}
class Player extends React.Component<PlayerProps> {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.player}>
        <video />
      </div>
    );
  }
}

export default withStyles(styles as any)(Player);
