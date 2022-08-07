import React, { Component } from "react";
import * as Icon from "@material-ui/icons";
import { connect } from "react-redux";
import { firebaseConnect } from "react-redux-firebase";
import SwipeableViews from "react-swipeable-views";
import {
  Typography,
  Button,
  Avatar,
  IconButton,
  Divider,
  withStyles,
  List,
  ListItem,
  ListItemText,
  Tab,
  Tabs,
  TextField
} from "@material-ui/core";
import JSONTree from "react-json-tree";
import moment from "moment";
import MuiTable from "../../components/muiTable";
import {
  Root,
  CommandoBar,
  Container,
  TitleHeader,
  MainCard,
  Column
} from "../../components/layouts";
import SuperTable from "../../components/supertable";
import { PeopleButton } from "../../components/cardButton";
import { scrollFix } from "./../../utils/scrollFix";

const style = theme => ({
  tagBox: {
    marginTop: theme.spacing()
  },
  tagTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: "white",
    textShadow: "0 2px 12px rgba(0,0,0,.17)",
    marginBottom: theme.spacing()
  },
  tabLabel: {
    opacity: 0.5,
    fontSize: 16,
    color: "white",
    textTransform: "initial"
  },
  tabLabelActive: {
    fontWeight: 700,
    fontSize: 16,
    color: "white",
    textTransform: "initial"
  },
  tabLine: {
    filter: "drop-shadow(0 1px 12px rgba(0,0,255,.2))",
    height: 2,
    background: "white"
  },
  tab: {
    height: 64
  },
  editList: {
    height: "100%",
    background: "#070707",
    width: 300
  }
});

class DB extends Component {
  state = {
    index: 0,
    collections: null,
    feeds: null,
    users: null,
    database: null,
    streams: null,
    feedTabVal: 0,
    collecTabVal: 0,
    liveTabVal: 0,
    feedEditCurrently: null,
    feedEditContext: "",
    feedEditTitle: "",
    collecEditCurrently: null,
    collecEditTitle: "",
    collecEditCategory: "",
    collecEditDesc: "",
    collecEditBg: "",
    collecEditImg: "",
    collecEditData: null
  };
  componentWillMount = () => {
    scrollFix();
  };

  componentDidMount = () => {
    const { firebase } = this.props;

    firebase
      .database()
      .ref("/")
      .on("value", value => this.setState({ database: value.val() }));
    firebase
      .database()
      .ref("/rankings")
      .on("value", value => this.setState({ collections: value.val() }));
    firebase
      .database()
      .ref("/social")
      .on("value", value => this.setState({ feeds: value.val() }));
    firebase
      .database()
      .ref("/users")
      .on("value", value => this.setState({ users: value.val() }));

    this.listen();
  };

  listen = () => {
    switch (window.location.hash) {
      case "#db":
        this.setState({ index: 0 });
        break;
      case "#collec":
        this.setState({ index: 1 });
        break;
      case "#user":
        this.setState({ index: 2 });
        break;
      case "#feed":
        this.setState({ index: 3 });
        break;
      case "#live":
        this.setState({ index: 4 });
        break;
      default:
        break;
    }
  };

  publishFeed = () => {
    if (this.state.feedEditContext === "" || this.state.feedEditTitle === "") {
      return null;
    }

    return this.props.firebase
      .database()
      .ref("/social")
      .child("public_feed")
      .child(this.state.feedEditCurrently.id)
      .update({
        name: this.state.feedEditTitle,
        context: this.state.feedEditContext,
        date: Date.now()
      })
      .then(() => this.setState({ feedEditCurrently: null }));
  };

  addFeed = () => {
    let x = Object.values(this.state.feeds.public_feed).length;
    x += 0;
    return this.props.firebase
      .database()
      .ref("/social")
      .child("public_feed")
      .child(x)
      .update({
        name: this.state.feedEditTitle,
        context: this.state.feedEditContext,
        date: Date.now(),
        id: x,
        user: {
          name: "Mir-ai",
          image:
            "https://firebasestorage.googleapis.com/v0/b/miraistream.appspot.com/o/publicFeed%2Fmirai-icon.png?alt=media&token=46a1a3e3-6a32-4b38-8d38-e3f073824f02"
        }
      })
      .then(() =>
        this.setState({ feedEditCurrently: this.state.feeds.public_feed[x] })
      );
  };

  render() {
    const { classes, profile } = this.props;
    const {
      collections,
      users,
      feeds,
      database,
      feedTabVal,
      collecTabVal,
      collecEditCurrently,
      collecEditTitle,
      collecEditCategory,
      collecEditDesc,
      feedEditCurrently,
      feedEditContext,
      feedEditTitle
    } = this.state;
    return (
      <div>
        <TitleHeader
          title="Admin Dashboard"
          color="black"
          subtitle="Moderate everything in Mirai"
        />
        <Root>
          <Container hasHeader>
            <MainCard>
              <CommandoBar>
                <Tabs
                  value={this.state.index}
                  onChange={(e, val) => this.setState({ index: val })}
                  className={classes.contextBar}
                  indicatorClassName={classes.tabLine}
                >
                  <Tab
                    onClick={() => this.props.history.push("/dev/db#db")}
                    label="Database"
                    classes={{
                      root: classes.tab,
                      selected:
                        this.state.index === 0
                          ? classes.tabLabelActive
                          : classes.tabLabel
                    }}
                  />
                  <Tab
                    onClick={() => this.props.history.push("/dev/db#collec")}
                    label="Collections"
                    classes={{
                      root: classes.tab,
                      selected:
                        this.state.index === 1
                          ? classes.tabLabelActive
                          : classes.tabLabel
                    }}
                  />
                  <Tab
                    onClick={() => this.props.history.push("/dev/db#user")}
                    label="Users"
                    classes={{
                      root: classes.tab,
                      selected:
                        this.state.index === 2
                          ? classes.tabLabelActive
                          : classes.tabLabel
                    }}
                  />
                  {profile.role === "admin" ? null : (
                    <Tab
                      onClick={() => this.props.history.push("/dev/db#feed")}
                      label="Feeds"
                      classes={{
                        root: classes.tab,
                        selected:
                          this.state.index === 3
                            ? classes.tabLabelActive
                            : classes.tabLabel
                      }}
                    />
                  )}
                  <Tab
                    onClick={() => this.props.history.push("/dev/db#live")}
                    label="Live"
                    classes={{
                      root: classes.tab,
                      selected:
                        this.state.index === 4
                          ? classes.tabLabelActive
                          : classes.tabLabel
                    }}
                  />
                </Tabs>
                <div style={{ flex: 1 }} />
                <IconButton
                  onClick={() =>
                    window.open(
                      "https://console.firebase.google.com/project/yura-a8e86/database/yura-a8e86/data"
                    )
                  }
                >
                  <Icon.DeveloperMode />
                </IconButton>
              </CommandoBar>
              <SwipeableViews
                index={this.state.index}
                onChangeIndex={index => this.setState({ index })}
              >
                <div>
                  <Container>
                    {database && (
                      <JSONTree
                        data={database}
                        style={{ fontFamily: "SF Mono" }}
                      />
                    )}
                  </Container>
                </div>
                <div>
                  <CommandoBar>
                    <Tabs
                      index={collecTabVal}
                      onChange={(e, val) =>
                        this.setState({ collecTabVal: val })
                      }
                    >
                      <Tab
                        onClick={() => this.setState({ collecTabVal: 0 })}
                        label="Overview"
                        classes={{
                          root: classes.tab,
                          selected:
                            collecTabVal === 0
                              ? classes.tabLabelActive
                              : classes.tabLabel
                        }}
                      />
                      <Tab
                        onClick={() => this.setState({ collecTabVal: 1 })}
                        label="Editor"
                        classes={{
                          root: classes.tab,
                          selected:
                            collecTabVal === 1
                              ? classes.tabLabelActive
                              : classes.tabLabel
                        }}
                      />
                    </Tabs>
                  </CommandoBar>
                  {collecTabVal === 0 ? (
                    <Container>
                      <Typography variant="h6">
                        Current collections
                      </Typography>
                      {collections ? (
                        <SuperTable
                          data={Object.values(collections.collections)}
                          type="c"
                          typeof="ranking"
                          limit={12}
                        />
                      ) : null}
                    </Container>
                  ) : null}
                  {collecTabVal === 1 ? (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        width: "100%"
                      }}
                    >
                      <List className={classes.editList}>
                        {collections &&
                          Object.values(collections.collections).map(
                            collection => (
                              <ListItem
                                button
                                onClick={() =>
                                  this.setState({
                                    collecEditCurrently: collection
                                  })
                                }
                                key={collection.id}
                              >
                                <ListItemText primary={collection.name} />
                              </ListItem>
                            )
                          )}
                        <Button onClick={this.addFeed}>Add</Button>
                      </List>
                      {collecEditCurrently ? (
                        <Container>
                          <Column>
                            <TextField
                              placeholder={collecEditCurrently.name}
                              value={collecEditTitle}
                              onChange={e =>
                                this.setState({
                                  collecEditTitle: e.target.value
                                })
                              }
                              InputProps={{
                                style: {
                                  fontSize: 24
                                },
                                disableUnderline: true
                              }}
                              fullWidth
                            />
                            <div style={{ margin: "16px 0", display: "flex" }}>
                              <Avatar src={collecEditCurrently.image} />
                              <TextField
                                value={collecEditCategory}
                                placeholder={collecEditCurrently.category}
                                onChange={e =>
                                  this.setState({
                                    collecEditCategory: e.target.value
                                  })
                                }
                                style={{ margin: "auto", marginLeft: 0 }}
                              />
                              <TextField
                                value={collecEditDesc}
                                placeholder={collecEditCurrently.desc}
                                onChange={e =>
                                  this.setState({
                                    collecEditDesc: e.target.value
                                  })
                                }
                                style={{ margin: "auto", marginLeft: 0 }}
                              />
                              <div style={{ flex: 1 }} />
                            </div>
                            <MuiTable />
                            <div
                              style={{
                                display: "flex",
                                width: "100%",
                                margin: "16px 0"
                              }}
                            >
                              <div style={{ flex: 1 }} />
                              <Button
                                onClick={() =>
                                  this.setState({
                                    feedEditContext: "",
                                    feedEditTitle: ""
                                  })
                                }
                              >
                                Cancel
                              </Button>
                              <Button
                                onClick={this.publishFeed}
                                color="primary"
                              >
                                Publish
                              </Button>
                            </div>
                          </Column>
                        </Container>
                      ) : null}
                    </div>
                  ) : null}
                </div>
                <div>
                  <Container>
                    <Typography variant="h6">Current users</Typography>
                    <Container>
                      {users &&
                        Object.values(users)
                          .filter(u => u.userID)
                          .map(user => (
                            <PeopleButton
                              key={user.userID}
                              name={{ first: user.username }}
                              image={user.avatar}
                              onClick={() =>
                                this.props.history.push(
                                  `/user?u=${user.userID}`
                                )
                              }
                            />
                          ))}
                    </Container>
                  </Container>
                </div>
                <div>
                  <CommandoBar>
                    <Tabs
                      index={feedTabVal}
                      onChange={(e, val) => this.setState({ feedTabVal: val })}
                    >
                      <Tab
                        onClick={() => this.setState({ feedTabVal: 0 })}
                        label="Overview"
                        classes={{
                          root: classes.tab,
                          selected:
                            feedTabVal === 0
                              ? classes.tabLabelActive
                              : classes.tabLabel
                        }}
                      />
                      <Tab
                        onClick={() => this.setState({ feedTabVal: 1 })}
                        label="Editor"
                        classes={{
                          root: classes.tab,
                          selected:
                            feedTabVal === 1
                              ? classes.tabLabelActive
                              : classes.tabLabel
                        }}
                      />
                    </Tabs>
                  </CommandoBar>
                  {feedTabVal === 0 ? (
                    <Container>
                      <Column>
                        <Typography variant="h6">
                          Current public feeds
                        </Typography>
                        <Container>
                          {feeds && (
                            <SuperTable
                              data={Object.values(feeds.public_feed).sort(
                                (a, b) => b.date - a.date
                              )}
                              typeof="feeds"
                              type="f"
                            />
                          )}
                        </Container>
                        <Divider style={{ margin: "16px 0" }} />
                        <Typography variant="h6">
                          Current user feeds
                        </Typography>
                        <Divider style={{ margin: "16px 0" }} />
                      </Column>
                    </Container>
                  ) : null}
                  {feedTabVal === 1 ? (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        width: "100%"
                      }}
                    >
                      <List className={classes.editList}>
                        {feeds &&
                          Object.values(feeds.public_feed)
                            .sort((a, b) => b.date - a.date)
                            .map(feed => (
                              <ListItem
                                button
                                onClick={() =>
                                  this.setState({ feedEditCurrently: feed })
                                }
                                key={feed.id}
                              >
                                <ListItemText primary={feed.name} />
                              </ListItem>
                            ))}
                        <Button onClick={this.addFeed}>Add</Button>
                      </List>
                      {feedEditCurrently ? (
                        <Container>
                          <Column>
                            <TextField
                              placeholder={feedEditCurrently.name}
                              value={feedEditTitle}
                              onChange={e =>
                                this.setState({ feedEditTitle: e.target.value })
                              }
                              InputProps={{
                                style: {
                                  fontSize: 24
                                },
                                disableUnderline: true
                              }}
                              fullWidth
                            />
                            <div style={{ margin: "16px 0", display: "flex" }}>
                              <Avatar src={feedEditCurrently.user.image} />
                              <Typography
                                variant="h6"
                                style={{ margin: "auto", marginLeft: 8 }}
                              >
                                {feedEditCurrently.user.name}
                              </Typography>
                              <Typography
                                variant="body1"
                                style={{ margin: "auto", marginLeft: 8 }}
                              >
                                {moment(feedEditCurrently.date).format(
                                  "HH:MM dd/mm/yyyy"
                                )}
                              </Typography>
                              <div style={{ flex: 1 }} />
                            </div>
                            <Typography variant="h6">Context</Typography>
                            <TextField
                              value={feedEditContext}
                              placeholder={feedEditCurrently.context}
                              onChange={e =>
                                this.setState({
                                  feedEditContext: e.target.value
                                })
                              }
                              multiline
                              fullWidth
                            />
                            <div
                              style={{
                                display: "flex",
                                width: "100%",
                                margin: "16px 0"
                              }}
                            >
                              <div style={{ flex: 1 }} />
                              <Button
                                onClick={() =>
                                  this.setState({
                                    feedEditContext: "",
                                    feedEditTitle: ""
                                  })
                                }
                              >
                                Cancel
                              </Button>
                              <Button
                                onClick={this.publishFeed}
                                color="primary"
                              >
                                Publish
                              </Button>
                            </div>
                          </Column>
                        </Container>
                      ) : null}
                    </div>
                  ) : null}
                </div>
                <div>
                  <Container>
                    <Typography variant="h6">Current streams</Typography>
                  </Container>
                </div>
                <div />
              </SwipeableViews>
            </MainCard>
          </Container>
        </Root>
      </div>
    );
  }
}

export default firebaseConnect()(
  connect(({ firebase: { profile } }) => ({ profile }))(withStyles(style)(DB))
);
