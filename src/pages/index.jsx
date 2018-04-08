import React, { Component } from 'react';
import LoadableVisibility from 'react-loadable-visibility/react-loadable';
import { Route, withRouter, Switch } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import { firebaseConnect } from 'react-redux-firebase';
import { connect } from 'react-redux';
import colorizer from '../utils/colorizer';
import { MIR_PLAY_SHOW } from '../constants';
/* import Home from './home';
import Setup from './setup';
import Show from './show';
import Wizard from './wizard';
import User from './user';
import Feeds from './feeds';
import Rankings from './rankings';
import Live from './live';
import Monika from './monika';
import Settings from './settings';
import Search from './search';
import Fig from './fig';
import Read from './read';
import Tag from './tag';
import Later from './later';
import History from './history';
import Help from './help';
import Tos from './tos';
import DevPlayer from './dev/player';
import DevDB from './dev/db';
*/
import Watch from './watch';
import PageNotFound from './pnf';
import Stream from '../components/mirstreamer';

import withRoot from '../components/withRoot';

import Superbar from '../components/superbar';
import { LoadingScreen } from '../components/layouts';

import { history } from '../store';

const styles = theme => ({
  root: {},
  welcomeMessage: {
    margin: 'auto',
    flex: 0,
    marginBottom: -500,
    color: 'white',
    fontWeight: 700,
    transition: theme.transitions.create(['all']),
  },
});
const Home = LoadableVisibility({
  loader: () => import('./home.jsx'),
  loading: LoadingScreen,
});
const Setup = LoadableVisibility({
  loader: () => import('./setup.jsx'),
  loading: LoadingScreen,
});
const Show = LoadableVisibility({
  loader: () => import('./show.jsx'),
  loading: LoadingScreen,
});
const Wizard = LoadableVisibility({
  loader: () => import('./wizard.jsx'),
  loading: LoadingScreen,
});
const Later = LoadableVisibility({
  loader: () => import('./later.jsx'),
  loading: LoadingScreen,
});
const Live = LoadableVisibility({
  loader: () => import('./live.jsx'),
  loading: LoadingScreen,
});
const Monika = LoadableVisibility({
  loader: () => import('./monika.jsx'),
  loading: LoadingScreen,
});
const Read = LoadableVisibility({
  loader: () => import('./read.jsx'),
  loading: LoadingScreen,
});
const Search = LoadableVisibility({
  loader: () => import('./search.jsx'),
  loading: LoadingScreen,
});
const History = LoadableVisibility({
  loader: () => import('./history.jsx'),
  loading: LoadingScreen,
});
const Rankings = LoadableVisibility({
  loader: () => import('./rankings.jsx'),
  loading: LoadingScreen,
});
const User = LoadableVisibility({
  loader: () => import('./user.jsx'),
  loading: LoadingScreen,
});
const Tos = LoadableVisibility({
  loader: () => import('./tos.jsx'),
  loading: LoadingScreen,
});
const Tag = LoadableVisibility({
  loader: () => import('./tag.jsx'),
  loading: LoadingScreen,
});
const Settings = LoadableVisibility({
  loader: () => import('./settings.jsx'),
  loading: LoadingScreen,
});
const Fig = LoadableVisibility({
  loader: () => import('./fig.jsx'),
  loading: LoadingScreen,
});
const Help = LoadableVisibility({
  loader: () => import('./help.jsx'),
  loading: LoadingScreen,
});
const Dev = LoadableVisibility({
  loader: () => import('./dev.jsx'),
  loading: LoadingScreen,
});
const Admin = LoadableVisibility({
  loader: () => import('./admin.jsx'),
  loading: LoadingScreen,
});

const Privacy = LoadableVisibility({
  loader: () => import('./pri.jsx'),
  loading: LoadingScreen,
});

class Index extends Component
{
  state = {
    loading: true,
    log: 'Please wait',
    error: false,
    info: 'Mirai crashed. Check console for more information.',
  };

  componentWillMount = () =>
  {
    this.props.removeDataFromMir(null);
  };

  componentWillReceiveProps = async ({ authExists, profile }) =>
  {
    if (authExists)
    {
      this.handleProfile(profile);
      return this.handleColors(profile);
    }
    return this.timedLoad();
  };

  handleColors = profile =>
    this.setState({}, async () =>
    {
      if (profile.headers)
      {
        const hues = localStorage.getItem('user-hue');
        if (!hues)
        {
          return this.setState({ log: 'Applying coloring...' }, () =>
            colorizer(profile.headers).then((pal) =>
            {
              const huesJ = {
                hue: pal.DarkMuted && pal.DarkMuted.getHex(),
                hueVib: pal.LightVibrant && pal.LightVibrant.getHex(),
                hueVibN: pal.DarkVibrant && pal.DarkVibrant.getHex(),
              };
              localStorage.setItem('user-hue', JSON.stringify(huesJ));
              return this.timedLoad('[mirai] Coloring applied.');
            }));
        }
        return this.timedLoad();
      }
      return this.timedLoad();
    });

  timedLoad = message =>
    setTimeout(
      () =>
        this.setState(
          { loading: false },
          () => (message ? console.info(message) : null),
        ),
      1000,
    );

  handleProfile = profile =>
    this.setState({ log: 'Getting user info...' }, async () =>
    {
      if (profile.userID)
      {
        if (profile.role !== undefined) return null;
        return this.setState({ log: 'Adding role...' }, () =>
          this.props.firebase
            .database()
            .ref('/users')
            .child(profile.userID)
            .update({ role: 'Normal' }));
      }
      return null;
    });

  componentDidCatch = (error, info) =>
  {
    console.error(error, info);
    this.setState({ error, errorInfo: info });
  };

  render()
  {
    if (this.state.error) return <LoadingScreen error log={this.state.info} />;
    return (
      <div className={this.props.classes.root}>
        {this.state.loading ? (
          <LoadingScreen log={this.state.log} />
        ) : (
          <Superbar history={history}>
            <Switch>
              <Route path="/" exact component={Home} />
              <Route path="/setup" exact component={Setup} />
              <Route path="/show" exact component={Show} />
              <Route path="/wizard" exact component={Wizard} />
              <Route path="/user" exact component={User} />
              <Route path="/rankings" exact component={Rankings} />
              <Route path="/live" exact component={Live} />
              <Route path="/watch" exact component={Watch} />
              <Route path="/monika" exact component={Monika} />
              <Route path="/settings" exact component={Settings} />
              <Route path="/search" exact component={Search} />
              <Route path="/read" exact component={Read} />
              <Route path="/fig" exact component={Fig} />
              <Route path="/tag" exact component={Tag} />
              <Route path="/later" exact component={Later} />
              <Route path="/history" exact component={History} />
              <Route path="/help" exact component={Help} />
              <Route path="/stream" exact component={Stream} />
              <Route path="/tou" exact component={Tos} />
              <Route path="/privacy" exact component={Privacy} />
              {this.props.profile &&
                this.props.profile.isDeveloper && (
                  <Route path="/dev" exact component={Dev} />
                )}
              {this.props.profile &&
                this.props.profile.isDeveloper && (
                  <Route path="/admin" exact component={Admin} />
                )}
              <Route exact component={PageNotFound} />
            </Switch>
          </Superbar>
        )}
      </div>
    );
  }
}

export const loadPlayer = play => ({
  type: MIR_PLAY_SHOW,
  play,
});

const mapPTS = dispatch => ({
  removeDataFromMir: play => dispatch(loadPlayer(play)),
});

export default withRouter(firebaseConnect()(connect(
  ({ firebase: { auth, profile }, mir, routing }) => ({
    authExists: !!auth && !!auth.uid && !!profile,
    mir,
    routing,
    profile,
  }),
  mapPTS,
)(withRoot(withStyles(styles, { withTheme: true })(Index)))));
