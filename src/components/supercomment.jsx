import React, { Component } from "react";
import * as Icon from "@material-ui/icons";
import Dotdotdot from "react-dotdotdot";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import {
  GridList,
  GirdListTitle,
  CircularProgress,
  withStyles,
  Typography,
  Button,
} from "@material-ui/core";
import moment from "moment";
import FadeIn from "react-fade-in";
import { firebaseConnect } from "react-redux-firebase";
import Disqus from "disqus-react";
// TODO: Not use disqus, but firebase-powered comment threads; so that users can engage with same accounts.
const styles = theme => ({
  commentContainer: {
    marginTop: theme.spacing.unit * 2,
  },
});

class SuperComment extends Component {
  state = {
    comments: [],
  };
  componentDidMount = () => {};

  render() {
    const { classes, firebase, profile } = this.props;
    const { comments } = this.state;

    const disqusShortname = "mirai-1";
    const disqusConfig = {
      url: this.props.article.url,
      identifier: this.props.article.id,
      title: this.props.article.title,
    };

    return (
      <div className={classes.commentContainer}>
        <Disqus.DiscussionEmbed
          shortname={disqusShortname}
          config={disqusConfig}
        />
      </div>
    );
  }
}

export default firebaseConnect()(
  connect(({ firebase: profile }) => ({ profile }))(
    withStyles(styles, { withTheme: true })(SuperComment)
  )
);
