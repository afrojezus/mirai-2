import React, { Component } from "react";
import {
  Checkbox,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Card,
  CardHeader,
  CardContent,
  Avatar,
  Grid,
  Tabs,
  Tab,
  Typography,
  withStyles,
  Hidden,
  Divider,
  MenuItem,
  Select,
} from "@material-ui/core";
import ReactPlayer from "react-player";
import { LoadingIndicator, Root, TitleHeader } from "../components/layouts";
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
    pointerEvents: "none",
  },
});

class PageNotFound extends Component {
  state = {
    loading: true,
  };

  componentWillMount = () => {
    scrollFix();
  };

  onReady = () => this.setState({ loading: false });

  render() {
    const { classes } = this.props;
    const { loading } = this.state;
    return (
      <div>
        <TitleHeader title={"404"} color={"#000"} />
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
