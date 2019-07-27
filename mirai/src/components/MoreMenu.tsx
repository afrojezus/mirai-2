import React from 'react';
import { withStyles, Theme, Menu } from '@material-ui/core';

const styles = (theme: Theme) => ({
  more: {

  }
});

class MoreMenu extends React.Component<any> {
  render() {
    const { classes, open, anchorEl, onClose } = this.props;
    return (
      <Menu open={open} anchorEl={anchorEl} onClose={onClose} className={classes.more}>
          
      </Menu>
    );
  }
}

export default withStyles(styles as any)(MoreMenu);