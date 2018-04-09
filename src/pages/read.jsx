import React, { Component } from 'react';
import * as M from 'material-ui';
import { scrollFix } from './../utils/scrollFix';

const style = theme => ({
  root: {
    height: '100%',
    width: '100%',
    position: 'relative',
  },
  bgImage: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.4,
    height: '100vh',
    objectFit: 'cover',
    width: '100%',
    zIndex: -1,
  },
  content: {
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: 24,
    maxWidth: 1600,
    paddingTop: theme.spacing.unit * 8,
  },
  header: {
    position: 'relative',
    margin: 'auto',
    paddingTop: theme.spacing.unit * 3,
  },
  title: {
    color: 'rgba(255,255,255,.5)',
    fontSize: 64,
    textShadow: '0 3px 16px rgba(0,0,0,.4)',
    padding: theme.spacing.unit,
    textAlign: 'center',
    margin: 'auto',
  },
  icon: {
    boxShadow: '0 1px 12px rgba(0,0,0,.2)',
    color: 'white',
    height: 92,
    width: 92,
    zIndex: -1,
    background: 'linear-gradient(to top, #9900ff 0%, #ff00ff 70%)',
    borderRadius: '50%',
    padding: theme.spacing.unit * 2,
  },
});

class Read extends Component
{
  state = {
    data: null,
  };

  componentWillMount = () =>
  {
    scrollFix();
  };

  render()
  {
    const { classes } = this.props;
    const { data } = this.state;
    return (
      <div className={classes.root}>
        {data && data.Media ? (
          <img
            src={data.Media.image.large}
            alt=""
            className={classes.bgImage}
          />
        ) : null}
        <M.Grid container spacing={0} className={classes.content}>
          <div className={classes.header}>
            <M.Typography variant="display3" className={classes.title}>
              Reading manga isn't supported by Mirai.
            </M.Typography>
          </div>
        </M.Grid>
      </div>
    );
  }
}

export default M.withStyles(style)(Read);
