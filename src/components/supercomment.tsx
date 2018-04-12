import React, { Component } from "react";
import * as Icon from "material-ui-icons";
import Dotdotdot from "react-dotdotdot";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import GridList from "material-ui/GridList/GridList";
import GridListTile from "material-ui/GridList/GridListTile";
import CircularProgress from "material-ui/Progress/CircularProgress";
import moment from "moment";
import withStyles from "material-ui/styles/withStyles";
import Typography from "material-ui/Typography/Typography";
import FadeIn from "react-fade-in";
import Button from "material-ui/Button/Button";
import { firebaseConnect } from "react-redux-firebase";
import Disqus from "disqus-react";
// TODO: Not use disqus, but firebase-powered comment threads; so that users can engage with same accounts.
const styles = theme => ({
  commentContainer: {
    marginTop: theme.spacing.unit * 2
  }
});

class SuperComment extends Component {
  state = {
    comments: []
  };
  componentDidMount = () => {};

  render() {
    const { classes, firebase, profile } = this.props;
    const { comments } = this.state;

    const disqusShortname = "mirai-1";
    const disqusConfig = {
      url: this.props.article.url,
      identifier: this.props.article.id,
      title: this.props.article.title
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
