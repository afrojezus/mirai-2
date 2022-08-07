// TODO: Fix every single eslint-airbnb issue
/* eslint-disable react/no-array-index-key */
import React, { Component } from "react";
import { connect } from "react-redux";
import { firebaseConnect } from "react-redux-firebase";

import {
  Typography,
  Divider,
  withStyles
} from "@material-ui/core";

import checklang from "../checklang";
import strings from "../strings.json";
import { scrollFix } from "./../utils/scrollFix";
import { Root, Container, TitleHeader, Header } from "../components/layouts";

const style = theme => ({
  column: {
    display: "flex",
    flexFlow: "column wrap",
    width: "100%"
  },
  headline: {
    marginBottom: theme.spacing()
  },
  title: {
    fontWeight: 700,
    marginBottom: theme.spacing() * 2,
    fontSize: theme.typography.pxToRem(24)
  },
  divider: {
    marginTop: theme.spacing() * 3,
    marginBottom: theme.spacing() * 3
  },
  paragraph: {
    fontSize: theme.typography.pxToRem(16)
  }
});

class Help extends Component {
  state = {
    articles: null,
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

  componentDidMount = () =>
    this.props.firebase
      .database()
      .ref("/articles")
      .child("help")
      .on("value", value =>
        this.setState({ articles: Object.values(value.val()) })
      );
  render = () => (
    <div>
      <TitleHeader
        title={this.state.lang.help.title}
        color={this.state.hue ? this.state.hue : "#000"}
      />
      <Header color={this.state.hue ? this.state.hue : null} />
      <Root>
        <Container hasHeader>
          <div className={this.props.classes.column}>
            <Typography className={this.props.classes.title} variant="h6">
              FAQ
            </Typography>
            {this.state.articles &&
              this.state.articles.map((paragraph, index) => (
                <div key={index}>
                  <Typography
                    className={this.props.classes.headline}
                    variant="h5"
                  >
                    {paragraph.headline}
                  </Typography>
                  <Typography
                    variant="body1"
                    className={this.props.classes.paragraph}
                    dangerouslySetInnerHTML={{ __html: paragraph.paragraph }}
                  />
                  <Divider className={this.props.classes.divider} />
                </div>
              ))}
          </div>
        </Container>
      </Root>
    </div>
  );
}

export default firebaseConnect()(
  connect(({ firebase: { profile } }) => ({ profile }))(withStyles(style)(Help))
);
