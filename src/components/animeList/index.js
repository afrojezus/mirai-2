import React from "react";
import "./animeList.css";

import { kapi } from '../../kitsu-api';

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
} from "@material-ui/core";
import { StarBorder, Star } from "@material-ui/icons";

export default class extends React.Component {
  state = {
    search: "",
    onlyOngoing: false,
      anime: []
  };
  async componentDidMount() {
      this.setState({anime: this.props.twist})
  }
  handleChange = (event, value) => this.setState({ search: value });
  toggleOngoing = () => this.setState({ onlyOngoing: !this.state.onlyOngoing });
  render() {
    const { search, onlyOngoing, anime } = this.state;
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
                {anime && anime.map((item, index) => <ListItem className="anime-list-item" key={index}>
                <ListItemAvatar>
                  <Avatar>
                    <Typography>A</Typography>
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={item.name}
                  secondary={item.kitsu}
                />
              </ListItem>)}
            </List>
          </Grid>
        </Grid>
      </div>
    );
  }
}
