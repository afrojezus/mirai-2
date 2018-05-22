import React, { Component } from "react";
import LoadableVisibility from "react-loadable-visibility/react-loadable";
import { Route, withRouter, Switch, Link } from "react-router-dom";
import { firebaseConnect } from "react-redux-firebase";
import { connect } from "react-redux";
import { MIR_PLAY_SHOW } from "../constants";
import PageNotFound from "./pnf";
import LoadingScreen from "../components/loading";
import withRoot from "../withRoot";
import { AppBar, Toolbar, IconButton } from "@material-ui/core";
import { Settings } from "@material-ui/icons";
import miraiIcon from "../assets/images/mirai-icon.png";

const Home = LoadableVisibility({
  loader: () => import("./home.js"),
  loading: LoadingScreen,
});
const Monika = LoadableVisibility({
  loader: () => import("./monika.js"),
  loading: LoadingScreen,
});

class Index extends Component {
  state = {
    loading: true,
    log: "Please wait",
    error: false,
    info: "Mirai crashed. Check console for more information.",
    scrolling: false,
  };

  componentDidMount = () => {
    this.props.removeDataFromMir(null);
    this.handleScroll();
  };

  componentWillReceiveProps = async ({ authExists, mir, profile }) => {
    return this.timedLoad();
  };

  timedLoad = message =>
    setTimeout(
      () =>
        this.setState(
          { loading: false },
          () => (message ? console.info(message) : null)
        ),
      1000
    );

  componentDidCatch = (error, info) => {
    console.error(error, info);
    this.setState({ error: error, errorInfo: info });
  };

  handleScroll = event => {
    if (window.scrollY === 0 && this.state.scrolling === true)
      this.setState({ scrolling: false }, () => {});
    else if (window.scrollY !== 0 && this.state.scrolling !== true)
      this.setState({ scrolling: true }, () => {});
  };

  render() {
    const HomeRoute = () => <Home {...this.props} />;


    if (this.state.error) return <LoadingScreen error log={this.state.info} />;
    return (
      <div className="mirai">
        {this.state.loading ? (
          <LoadingScreen log={this.state.log} />
        ) : (
          <div>
            <AppBar className={this.state.scrolling ? undefined : "top"}>
              <Toolbar>
                <IconButton component={Link} to="/">
                  <img src={miraiIcon} alt="" className="mirai-icon" />
                </IconButton>
                <div className="space" />
                <IconButton>
                  <Settings />
                </IconButton>
              </Toolbar>
            </AppBar>
            <Switch>
              <Route path="/" exact render={HomeRoute} />
              <Route path="/monika" exact component={Monika} />
              <Route exact component={PageNotFound} />
            </Switch>
          </div>
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

export default withRouter(
  firebaseConnect()(
    connect(
      ({ firebase: { auth, profile }, mir, routing }) => ({
        authExists: !!auth && !!auth.uid && !!profile,
        mir,
        routing,
        profile,
      }),
      mapPTS
    )(withRoot(Index))
  )
);
