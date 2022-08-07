// TODO: Fix every single eslint-airbnb issue
import React, { Component } from "react";
import { withStyles } from "@material-ui/core";
import { TitleHeader } from "../components/layouts";
import { scrollFix } from "./../utils/scrollFix";

const style = theme => ({
  awoo: {
    position: "fixed",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none"
  }
});

class PageNotFound extends Component {
  state = {
    loading: true
  };

  componentWillMount = () => {
    scrollFix();
  };

  onReady = () => this.setState({ loading: false });

  render() {
    return (
      <div>
        <TitleHeader title={"404"} subtitle="Page not found, are you lost?" color={"#000"} />
        {/*<ReactPlayer
          className={classes.awoo}
          onReady={this.onReady}
          width={"100%"}
          height={"100%"}
          url={"https://www.youtube.com/watch?v=eGslweDOihs"}
          playing
          loop
          volume={0.25}
        />*/}
      </div>
    );
  }
}

export default withStyles(style)(PageNotFound);
