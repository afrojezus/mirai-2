import React from 'react';
import { withStyles, Theme, Menu, Paper, InputBase, Toolbar, IconButton, Button, colors } from '@material-ui/core';
import globalStyles, { realNearBoxShadow } from '../globalStyles';
import { Image, Gif, Poll, InsertEmoticon } from '@material-ui/icons';

const styles = (theme: Theme) => ({
  feedfactory: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    height: 140,
    borderRadius: 0,
    boxShadow: realNearBoxShadow
  },
  feedInputContainer: {
    borderRadius: 0,
    margin: theme.spacing(2),
    background: theme.palette.background.paper,
    minHeight: 50,
    minWidth: '100%',
    overflow: 'hidden',
    animation: 'SplashPaperIntro 0.4s ease',
  },
  feedPadding: {
    padding: theme.spacing(1)
  },
  feedInput: {
    marginLeft: 8,
    flex: 1,
    width: 'calc(100% - 8px)'
  },
  ...globalStyles(theme)
});

class FeedFactory extends React.Component<any> {
  render() {
    const { classes } = this.props;
    return (
      <Paper className={classes.feedfactory}>
          <Paper elevation={24} className={classes.feedInputContainer}>
            <div className={classes.feedPadding}>
              <InputBase
                className={classes.feedInput}
                placeholder="What's on your mind?"
              />
            </div>
          </Paper>
          <Toolbar>
              <IconButton>
                  <Image />
              </IconButton>
              <IconButton>
                  <Gif />
              </IconButton>
              <IconButton>
                  <Poll />
              </IconButton>
              <IconButton>
                  <InsertEmoticon />
              </IconButton>
              <div style={{flex: 1}} />
              <Button color='primary'>
                Post
              </Button>
          </Toolbar>
          </Paper>
    );
  }
}

export default withStyles(styles as any)(FeedFactory);