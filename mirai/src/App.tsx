import React from 'react';
import materialize from './materialize';
import { Switch, Route, withRouter } from 'react-router-dom';
import Bar from './components/bar';
import Home from './routes/home';
import ToS from './routes/tos';
import FourOFour from './routes/404';
import Splash from './routes/splash';
import Social from './routes/social';
import Sharestreams from './routes/sharestreams';
import Explore from './routes/explore';
import Anime from './routes/anime';
import Account from './routes/account';
import Crash from './routes/crash';

interface App {
  children: React.ReactChildren;
  history: any;
}
class App extends React.PureComponent<App> {
  componentDidCatch(error: Error) {
    return <Crash error={error} />;
  }
  render() {
    return (
      <div className="Mirai">
        <Bar history={this.props.history} />
        <Switch>
          <Route exact path="/" component={Splash} />
          <Route exact path="/home" component={Home} />
          <Route exact path="/tos" component={ToS} />
          <Route exact path="/social" component={Social} />
          <Route exact path="/sharestreams" component={Sharestreams} />
          <Route exact path="/explore" component={Explore} />
          <Route exact path="/anime" component={Anime} />
          <Route exact path="/account" component={Account} />
          <Route exact component={FourOFour} />
        </Switch>
      </div>
    );
  }
}

export default withRouter(materialize(App));
