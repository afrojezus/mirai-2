import React from "react";
import "./animeList.css";

import {
  TextField,
  Grid,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider,
} from "@material-ui/core";
import { StarBorder, Star } from "@material-ui/icons";

export default class extends React.Component {
  state = {
    search: "",
    onlyOngoing: false,
  };
  handleChange = (event, value) => this.setState({ search: value });
  toggleOngoing = () => this.setState({ onlyOngoing: !this.state.onlyOngoing });
  render() {
    const { search, onlyOngoing } = this.state;
    return (
      <div className="element anime-list">
        <div className="search-container">
          <TextField
            type="search"
            className="search"
            placeholder="Search"
            value={search}
            onChange={this.handleChange}
            fullWidth
            InputProps={{
              disableUnderline: true,
            }}
          />
          <IconButton onClick={this.toggleOngoing}>
            {onlyOngoing ? <Star /> : <StarBorder />}
          </IconButton>
        </div>
        <Grid container className="column">
          <Grid item xs>
            <div className="seperator">
              <Typography variant="title" className="seperator-title">
                Schedule
              </Typography>
              <div className="seperator-line" />
            </div>
            <List className="anime-list-list">
              <ListItem className="anime-list-item">
                <ListItemAvatar>
                  <Avatar>
                    <Typography>A</Typography>
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Anime"
                  secondary="Smol information about this anime"
                />
              </ListItem>
              <ListItem className="anime-list-item">
                <ListItemAvatar>
                  <Avatar>
                    <Typography>A</Typography>
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Anime"
                  secondary="Smol information about this anime"
                />
              </ListItem>
            </List>
          </Grid>
          <Grid item xs>
            <div className="seperator">
              <Typography variant="title" className="seperator-title">
                Popular this season
              </Typography>
              <div className="seperator-line" />
            </div>
            <List className="anime-list-list">
              <ListItem className="anime-list-item">
                <ListItemAvatar>
                  <Avatar>
                    <Typography>A</Typography>
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Anime"
                  secondary="Smol information about this anime"
                />
              </ListItem>
              <ListItem className="anime-list-item">
                <ListItemAvatar>
                  <Avatar>
                    <Typography>A</Typography>
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Anime"
                  secondary="Smol information about this anime"
                />
              </ListItem>
            </List>
          </Grid>
          <Grid item xs>
            <div className="seperator">
              <Typography variant="title" className="seperator-title">
                All
              </Typography>
              <div className="seperator-line" />
            </div>
            <List className="anime-list-list">
              <ListItem className="anime-list-item">
                <ListItemAvatar>
                  <Avatar>
                    <Typography>A</Typography>
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Anime"
                  secondary="Smol information about this anime"
                />
              </ListItem>
              <ListItem className="anime-list-item">
                <ListItemAvatar>
                  <Avatar>
                    <Typography>A</Typography>
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Anime"
                  secondary="Smol information about this anime"
                />
              </ListItem>
              <ListItem className="anime-list-item">
                <ListItemAvatar>
                  <Avatar>
                    <Typography>A</Typography>
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Anime"
                  secondary="Smol information about this anime"
                />
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </div>
    );
  }
}
