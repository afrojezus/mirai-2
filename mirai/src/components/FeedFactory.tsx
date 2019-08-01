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
  feedInput: {
    marginLeft: theme.spacing(4),
    flex: 1,
    fontSize: 20,
    borderRadius: 0,
    minWidth: `calc(100% - ${theme.spacing(4)}px)`,
    overflow: 'hidden',
    animation: 'SplashPaperIntro 0.4s ease',
  },
  ...globalStyles(theme)
});

class FeedFactory extends React.Component<any> {

  render() {
    const { classes } = this.props;
    return (
      <Paper className={classes.feedfactory}>
              <InputBase
              multiline
              rowsMax={3}
                className={classes.feedInput}
                placeholder="What's on your mind?"
              />
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