import React, { Component } from "react";
import { connect } from "react-redux";
import withStyles from "@material-ui/core/styles/withStyles";
import { firebaseConnect } from "react-redux-firebase";
import Disqus from "disqus-react";
// TODO: Not use disqus, but firebase-powered comment threads; so that users can engage with same accounts.
const styles = theme => ({
  commentContainer: {
    marginTop: theme.spacing() * 2
  }
});

class SuperComment extends Component {
  state = {
    comments: []
  };
  componentDidMount = () => { };

  render() {
    const { classes } = this.props;

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
