import React from "react";
import "./banner.css";

import { Typography, Grid, TextInput, IconButton } from "@material-ui/core";

export default class extends React.Component {
  render() {
    return (
      <div className="element banner">
        <img
          alt=""
          src="https://wallpapertag.com/wallpaper/full/f/6/f/370039-widescreen-touhou-wallpaper-1920x1200.jpg"
          className="bannerImage"
        />
        <Typography variant="display2" className="bannerTitle">
          Just anime, nothing else.
        </Typography>
        <Typography variant="body1" className="bannerTitle">
          You and uwu others are currently looking for just anime. How nice.
        </Typography>
      </div>
    );
  }
}
