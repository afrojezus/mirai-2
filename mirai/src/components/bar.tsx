import React from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  withStyles,
  Theme,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Menu,
  MenuList,
  Button,
  Paper,
  InputBase
} from '@material-ui/core';
import * as MICON from '@material-ui/icons';
import globalStyles from '../globalStyles';
import ava_example from '../assets/avatar.gif';

const styles = (theme: Theme) => ({
  hidden: {
    display: 'none'
  },
  ...globalStyles(theme)
});

class Bar extends React.Component<any> {
  state = {
    notificationsShow: false,
    menu: false
  };
  constructor(props: any) {
    super(props);
  }

  toggleNotifications = () =>
    this.setState({ notificationsShow: !this.state.notificationsShow });

  handleMenu = (event: any) => {
    this.setState({ menu: !this.state.menu });
  };

  render() {
    const { notificationsShow, menu } = this.state;
    const { history, classes } = this.props;
    let routeContext: string = '';
    let hidden: boolean = false;
    let transparent: boolean = true;

    window.addEventListener('scroll', () => {
      if (hidden) return;
      if (window.scrollY <= 0) {
        transparent = true;
      } else {
        transparent = false;
      }
    });

    switch (history.location.pathname) {
      case '/':
        routeContext = 'Splash';
        hidden = true;
        break;
      case '/explore':
        routeContext = 'Explore';
        hidden = false;
        break;
      case '/sharestreams':
        routeContext = 'Sharestreams (Beta)';
        hidden = false;
        break;
      case '/tos':
        routeContext = 'Terms of Service';
        hidden = false;
        break;
      case '/social':
        routeContext = 'Social';
        hidden = false;
        break;
      case '/anime':
        routeContext = history.location.state.anime
          ? history.location.state.anime.titles.en_jp
          : 'Anime';
        hidden = false;
        break;
      case '/wiki':
        routeContext = 'Wiki';
        hidden = false;
        break;
      case '/doujin':
        routeContext = '🔞';
        hidden = false;
        break;
      case '/account':
        routeContext = 'User';
        hidden = false;
        break;
      default:
        routeContext = '404 - Not found';
        hidden = false;
        break;
    }
    return (
      <div className={hidden ? classes.hidden : undefined}>
        <AppBar className={transparent ? classes.AppBarNOBG : classes.AppBar}>
          <Toolbar>
            <div
              style={{
                flexDirection: 'row',
                display: 'inline-flex'
              }}
              onClick={() => history.push('/')}
            >
              <div style={{ transform: 'scale(0.7)' }}>
                <Typography>未</Typography>
                <Typography style={{ marginTop: -8 }}>来</Typography>
              </div>
              <Typography variant="h6" className={classes.AppBarTitle}>
                MIRAI
              </Typography>
            </div>
            <div
              style={{
                flexDirection: 'row',
                display: 'inline-flex'
              }}
            >
              <IconButton onClick={() => history.push('explore')}>
                <MICON.Explore />
              </IconButton>
              <IconButton onClick={() => history.push('sharestreams')}>
                <MICON.Tv />
              </IconButton>
              <IconButton onClick={() => history.push('social')}>
                <MICON.People />
              </IconButton>
            </div>
            <Divider className={classes.AppBarDivider} />
            <Typography variant="h6">{routeContext}</Typography>
            <div style={{ flex: 1 }} />
            {history.location.pathname === '/explore' ? null : (
              <Paper elevation={0} className={classes.paperBlockMini}>
                <div className={classes.paperPaddingMini}>
                  <InputBase
                    className={classes.paperInput}
                    placeholder="Search for anime"
                  />
                </div>
              </Paper>
            )}
            <IconButton onClick={this.toggleNotifications}>
              <MICON.Notifications />
            </IconButton>
            <Avatar
              src={ava_example}
              onClick={() => history.push('/account')}
            />
          </Toolbar>
        </AppBar>
        <Drawer
          anchor="right"
          open={notificationsShow}
          onClose={this.toggleNotifications}
          className={classes.drawer}
        >
          <List className={classes.drawer}>
            <ListItem button>
              <ListItemText primary="UwU" />
            </ListItem>
          </List>
        </Drawer>
      </div>
    );
  }
}

export default withStyles(styles as any)(Bar);
