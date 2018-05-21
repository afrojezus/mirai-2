import React, { Component } from "react";
import { scrollFix } from "./../utils/scrollFix";

class PageNotFound extends Component {
  componentDidMount = () => {
    scrollFix();
  };

  render() {
    return (
      <div>
        <h1>404</h1>
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

export default PageNotFound;
