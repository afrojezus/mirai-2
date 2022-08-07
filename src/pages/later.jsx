// TODO: Fix every single eslint-airbnb issue
import React, { Component } from "react";
import checklang from "../checklang";
import strings from "../strings";
import { withStyles } from "@material-ui/core";
import { connect } from "react-redux";
import { firebaseConnect, isEmpty } from "react-redux-firebase";
import Typography from "@material-ui/core/Typography/Typography";
import {
  Root,
  Container,
  LoadingIndicator,
  TitleHeader,
  Header
} from "../components/layouts";
import Supertable from "../components/supertable";
import { scrollFix } from "../utils/scrollFix";

const style = theme => ({
  column: {
    display: "flex",
    flexFlow: "column wrap",
    marginBottom: theme.spacing(),
    width: "100%"
  },
  noneMessage: {
    paddingTop: theme.spacing() * 3,
    paddingBottom: theme.spacing() * 3,
    color: "rgba(255,255,255,.8)"
  },
  categoryTitle: {
    fontWeight: 700
  }
});

class Later extends Component {
  state = {
    loading: true,
    lang: strings.enus
  };

  componentWillMount = () => {
    checklang(this);
    scrollFix();
    this.getColors();
  };

  getColors = () => {
    const hue = localStorage.getItem("user-hue");
    if (hue) {
      let hues = JSON.parse(hue);
      return this.setState({
        hue: hues.hue,
        hueVib: hues.hueVib,
        hueVibN: hues.hueVibN
      });
    } else {
      return null;
    }
  };

  componentDidMount = () => this.setState({ loading: false });

  componentWillReceiveProps = nextProps => {
    if (this.props.profile !== nextProps.profile) {
    }
  };

  userprops = {
    userShows:
      !isEmpty(this.props.profile) &&
        this.props.profile.later &&
        this.props.profile.later.show
        ? Object.values(this.props.profile.later.show)
        : null,
    userManga:
      !isEmpty(this.props.profile) &&
        this.props.profile.later &&
        this.props.profile.later.manga
        ? Object.values(this.props.profile.later.manga)
        : null
  };

  render = () => (
    <div>
      <LoadingIndicator loading={this.state.loading} />
      <Root>
        <TitleHeader
          title={this.state.lang.later.later}
          color={this.state.hue ? this.state.hue : "#000"}
        />
        <Header color={this.state.hue ? this.state.hue : null} />
        <Container hasHeader>
          <div className={this.props.classes.column}>
            <Typography
              className={this.props.classes.categoryTitle}
              variant="h6"
            >
              {this.state.lang.later.animetitle}
            </Typography>
            {!isEmpty(this.props.profile) && this.userprops.userShows ? (
              <Supertable
                data={this.userprops.userShows.sort((a, b) => b.date - a.date)}
                type="s"
                typeof="later"
              />
            ) : (
              <Typography
                className={this.props.classes.noneMessage}
                variant="h6"
              >
                {this.state.lang.later.animenone}
              </Typography>
            )}
          </div>
          <div className={this.props.classes.column}>
            <Typography
              className={this.props.classes.categoryTitle}
              variant="h6"
            >
              {this.state.lang.later.mangatitle}
            </Typography>
            {!isEmpty(this.props.profile) && this.userprops.userManga ? (
              <Supertable
                data={this.userprops.userManga.sort((a, b) => b.date - a.date)}
                type="m"
                typeof="later"
              />
            ) : (
              <Typography
                className={this.props.classes.noneMessage}
                variant="h6"
              >
                {this.state.lang.later.manganone}
              </Typography>
            )}
          </div>
        </Container>
      </Root>
    </div>
  );
}

export default firebaseConnect()(
  connect(({ firebase: { profile } }) => ({ profile }))(
    withStyles(style)(Later)
  )
);
