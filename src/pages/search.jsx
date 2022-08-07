import React, { Component } from "react";
import * as M from "@material-ui/core";
import queryString from "query-string";

import localForage from "localforage";

import { connect } from "react-redux";
import { firebaseConnect } from "react-redux-firebase";

import searchQuery, {
  searchStaffQuery,
  searchCharQuery,
  searchStudiosQuery
} from "../utils/searchquery";
import strings from "../strings.json";
import {
  LoadingIndicator,
  SectionTitle,
  Column
} from "../components/layouts";
import CardButton, { PeopleButton } from "../components/cardButton";
import Anilist from "../anilist-api";
import { scrollFix } from "./../utils/scrollFix";
import TwistFilter from "./../utils/filter";
import checklang from "../checklang";

const style = theme => ({
  container: {
    marginLeft: "auto",
    marginRight: "auto",
    maxWidth: 1600,
    margin: "auto"
  },
  root: {
    height: "100%",
    width: "100%",
    position: "relative",
    transition: theme.transitions.create(["all"]),
    marginLeft: "auto",
    marginRight: "auto",
    padding: 24,
    maxWidth: 1450,
    paddingLeft: "env(safe-area-inset-left)",
    paddingRight: "env(safe-area-inset-right)",
    boxSizing: "border-box",
    [theme.breakpoints.down("xs")]: {
      padding: 0
    }
  },
  bgImage: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.4,
    height: "100vh",
    objectFit: "cover",
    width: "100%",
    zIndex: -1
  },
  content: {
    marginTop: theme.spacing() * 8
  },
  header: {
    position: "relative",
    margin: "auto",
    paddingTop: theme.spacing() * 3
  },
  title: {
    color: "white",
    fontSize: 64,
    fontWeight: 700,
    textShadow: "0 3px 16px rgba(0,0,0,.4)",
    position: "absolute",
    bottom: -theme.spacing() * 2,
    padding: theme.spacing(),
    textAlign: "center",
    margin: "auto",
    left: -theme.spacing() * 8
  },
  icon: {
    boxShadow: "0 1px 12px rgba(0,0,0,.2)",
    color: "white",
    height: 92,
    width: 92,
    zIndex: -1,
    background: "linear-gradient(to top, #9900ff 0%, #ff00ff 70%)",
    borderRadius: "50%",
    padding: theme.spacing() * 2
  },
  searchContainer: {
    flexGrow: 1,
    position: "relative",
    width: 700
  },
  suggestionsContainerOpen: {
    position: "absolute",
    marginTop: theme.spacing(),
    marginBottom: theme.spacing() * 3,
    left: 0,
    right: 0
  },
  suggestion: {
    display: "block"
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: "none"
  },
  textField: {
    width: "100%",
    padding: 0,
    "label + &": {
      marginTop: theme.spacing() * 3
    }
  },
  input: {
    padding: theme.spacing() * 2,
    width: "100%",
    transition: theme.transitions.create(["all"]),
    "&:focus": {
      boxShadow: "0 1pt 0.2rem rgba(0,0,0,.25)"
    },
    boxSizing: "border-box"
  },
  searchBar: {
    marginTop: theme.spacing() * 8
  },
  textInput: {
    borderRadius: 4,
    fontSize: 20,
    padding: theme.spacing(),
    textAlign: "center"
  },
  entityCard: {
    height: 200,
    width: 183,
    flexGrow: "initial",
    flexBasis: "initial",
    margin: theme.spacing() / 2,
    transition: theme.transitions.create(["all"]),
    "&:hover": {
      transform: "scale(1.05)",
      overflow: "initial",
      zIndex: 200,
      boxShadow: `0 2px 14px rgba(0,55,230,.3)`,
      background: M.colors.blue.A200
    },
    "&:hover > div": {
      boxShadow: "none"
    },
    "&:hover > * > h1": {
      transform: "scale(1.4)",
      fontWeight: 700,
      textShadow: "0 2px 12px rgba(0,0,0,.7)"
    },
    position: "relative",
    overflow: "hidden"
  },
  entityCardDisabled: {
    height: 200,
    width: 183,
    flexGrow: "initial",
    flexBasis: "initial",
    margin: theme.spacing() / 2,
    transition: theme.transitions.create(["all"]),
    filter: "brightness(.8)",
    position: "relative",
    overflow: "hidden"
  },
  entityImage: {
    height: "100%",
    width: "100%",
    objectFit: "cover",
    position: "absolute",
    zIndex: -1,
    transition: theme.transitions.create(["filter"]),
    "&:hover": {
      filter: "brightness(0.8)"
    },
    top: 0,
    left: 0
  },
  entityContext: {
    "&:last-child": {
      paddingBottom: 12
    }
  },
  entityTitle: {
    fontSize: 14,
    fontWeight: 500,
    position: "absolute",
    padding: theme.spacing() * 2,
    transition: theme.transitions.create(["transform"]),
    bottom: 0,
    zIndex: 5,
    left: 0,
    textShadow: "0 1px 12px rgba(0,0,0,.2)"
  },
  entitySubTitle: {
    fontSize: 14,
    fontWeight: 600,
    position: "absolute",
    padding: theme.spacing() * 2,
    transition: theme.transitions.create(["transform"]),
    top: 0,
    left: 0,
    zIndex: 5,
    textShadow: "0 1px 12px rgba(0,0,0,.2)"
  },
  itemcontainer: {
    paddingBottom: theme.spacing() * 2,
    marginLeft: theme.spacing(),
    marginRight: theme.spacing(),
    [theme.breakpoints.down("xs")]: {
      width: "initial",
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  gradientCard: {
    position: "relative",
    background: "linear-gradient(to top, transparent, rgba(0,0,0,.6))",
    height: 183,
    width: "100%"
  },
  secTitle: {
    padding: theme.spacing(),
    paddingLeft: window.mobilecheck() ? null : 0,
    fontWeight: 700,
    fontSize: 22,
    zIndex: "inherit",
    paddingBottom: theme.spacing() * 2
  },
  secTitleSmall: {
    padding: theme.spacing(),
    fontSize: 16,
    zIndex: "inherit",
    color: "rgba(255,255,255,.5)",
    paddingBottom: theme.spacing() * 2
  },
  fillImg: {
    height: "100%",
    width: "100%",
    objectFit: "cover",
    background: "white"
  },
  peopleCard: {
    height: "auto",
    width: 183,
    flexGrow: "initial",
    flexBasis: "initial",
    margin: theme.spacing() / 2,
    transition: theme.transitions.create(["all"]),
    "&:hover": {
      transform: "scale(1.05)",
      overflow: "initial",
      zIndex: 200,
      boxShadow: `0 2px 14px rgba(0,55,230,.3)`,
      background: M.colors.blue.A200
    },
    "&:hover > * > h1": {
      transform: "scale(1.1)",
      textShadow: "0 2px 12px rgba(0,0,0,.7)"
    },
    position: "relative",
    overflow: "hidden"
  },
  peopleImage: {
    height: 156,
    width: 156,
    margin: "auto",
    zIndex: 1,
    borderRadius: "50%",
    boxShadow: "0 2px 12px rgba(0,0,0,.2)",
    transition: theme.transitions.create(["all"]),
    "&:hover": {
      boxShadow: "0 3px 16px rgba(0,0,0,.5)"
    },
    top: 0,
    left: 0
  },
  peopleCharImage: {
    height: 64,
    width: 64,
    margin: "auto",
    zIndex: 2,
    position: "absolute",
    borderRadius: "50%",
    boxShadow: "0 2px 12px rgba(0,0,0,.2)",
    transition: theme.transitions.create(["all"]),
    "&:hover": {
      boxShadow: "0 3px 16px rgba(0,0,0,.5)",
      transform: "scale(1.2)"
    },
    right: theme.spacing() * 3,
    bottom: theme.spacing() * 7
  },
  peopleTitle: {
    fontSize: 14,
    fontWeight: 500,
    padding: theme.spacing(),
    paddingBottom: theme.spacing() / 2,
    transition: theme.transitions.create(["transform"]),
    bottom: 0,
    zIndex: 5,
    margin: "auto",
    textAlign: "center",
    textShadow: "0 1px 12px rgba(0,0,0,.2)"
  },
  peopleSubTitle: {
    fontSize: 14,
    color: "rgba(255,255,255,.7)",
    fontWeight: 600,
    margin: "auto",
    transition: theme.transitions.create(["transform"]),
    zIndex: 5,
    textShadow: "0 1px 12px rgba(0,0,0,.2)",
    textAlign: "center",
    whiteSpace: "nowrap"
  },
  loading: {
    height: "100%",
    width: "100%",
    zIndex: -5,
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
    padding: 0,
    margin: "auto",
    transition: theme.transitions.create(["all"])
  },
  commandoBar: {
    width: "100%",
    padding: theme.spacing(),
    display: "inline-flex",
    boxSizing: "border-box",
    background: "#222",
    boxShadow: "0 3px 18px rgba(0,0,0,.1)"
  },
  commandoText: {
    margin: "auto",
    textAlign: "center"
  },
  commandoTextBox: {
    paddingLeft: theme.spacing(),
    paddingRight: theme.spacing(),
    margin: "auto"
  },
  commandoTextLabel: {
    fontSize: 10,
    textAlign: "center",
    color: "rgba(255,255,255,.8)"
  },
  cox: {
    transition: theme.transitions.create(["all"])
  },
  feedTitle: {
    fontWeight: 700,
    textShadow: "0 2px 24px rgba(0,0,0,.07)",
    marginBottom: theme.spacing() * 3,
    zIndex: 20,
    color: "white"
  }
});

class Search extends Component {
  state = {
    searchVal: "",
    loading: true,
    data: [],
    users: null,
    hue: "#111",
    hueVib: "#0066ff",
    hueVibN: "#111",
    lang: strings.enus,
    error: false
  };

  componentWillMount = () => {
    scrollFix();
    checklang(this);
  };

  componentDidMount = async () => {
    /* const prevSearch = await localForage.getItem('prevSearch');
    if (prevSearch)
      this.setState(prevSearch, () =>
        this.setState({ loading: false })
      ); */

    if (this.props.history.location.search) {
      const parsed = queryString.parse(this.props.history.location.search);
      this.setState({ searchVal: parsed.q }, () => this.uwu());
    } else this.setState({ loading: false });
  };

  componentWillReceiveProps = nextProps => {
    if (nextProps.history.location.search) {
      const parsed = queryString.parse(nextProps.history.location.search);
      this.setState({ searchVal: parsed.q }, () => this.uwu());
    }
  };

  componentWillUnmount = async () =>
    this.state.searchVal !== undefined ||
      (null && this.state.searchVal.length > 3 && this.state.searchVal !== "")
      ? localForage.setItem("prevSearch", this.state)
      : null;

  uwu = () =>
    this.setState(
      {
        data: null,
        characters: null,
        staff: null,
        studios: null,
        users: null,
        loading: true,
        error: false
      },
      async () => {
        if (this.state.searchVal === "") {
          return null;
        }
        try {
          const { data } = await Anilist.get(searchQuery, {
            search: this.state.searchVal,
            isAdult: false,
            page: 1
          });

          const characters = await Anilist.get(searchCharQuery, {
            search: this.state.searchVal,
            page: 1
          });

          const staff = await new Anilist.get(searchStaffQuery, {
            search: this.state.searchVal,
            page: 1
          });

          const studios = await new Anilist.get(searchStudiosQuery, {
            search: this.state.searchVal,
            page: 1
          });

          const users = await this.props.firebase
            .database()
            .ref("users")
            .once("value");

          if (
            data &&
            characters &&
            staff &&
            studios &&
            users &&
            this.props.mir &&
            this.props.mir.twist
          ) {
            return this.setState({
              anime: data.Page.media
                .filter(s => s.type === "ANIME")
                .filter(s => s.title.romaji),
              manga: data.Page.media.filter(s => s.type === "MANGA"),
              characters,
              staff,
              studios,
              users: Object.values(users.val())
                .filter(s => s.username)
                .filter(s =>
                  s.username
                    .toLowerCase()
                    .match(`${this.state.searchVal.toLowerCase()}`)
                ),
              loading: false
            });
          } else {
            throw new Error("No results");
          }
        } catch (error) {
          console.error(error);
          return this.setState({ error: true });
        }
      }
    );

  openEntity = link => {
    this.props.history.push(link);
  };

  handleChange = e => {
    this.setState({
      searchVal: e.target.value
    });
  };

  handleSubmit = async e => {
    e.preventDefault();
    if (this.state.searchVal.length > 3) this.uwu();
  };

  render() {
    const { classes } = this.props;
    const {
      searchVal,
      loading,
      anime,
      manga,
      characters,
      staff,
      studios,
      users,
      lang,
      error
    } = this.state;
    return (
      <div>
        <LoadingIndicator loading={loading} />
        <div className={classes.root}>
          <div className={classes.cox}>
            <M.Grid container spacing={0} className={classes.content}>
              <M.Hidden mdUp>
                <form
                  style={{ width: "100%", marginBottom: 16, padding: 16 }}
                  onSubmit={this.handleSubmit}
                >
                  <M.TextField
                    value={searchVal}
                    placeholder={"Minimum 3 char."}
                    onChange={this.handleChange}
                    fullWidth
                    InputProps={{ fullWidth: true }}
                  />
                </form>
              </M.Hidden>
              <M.Hidden mdDown>
                {error ? null : (
                  <M.Typography
                    variant={"display3"}
                    className={classes.feedTitle}
                  >
                    {lang.search.title}
                  </M.Typography>
                )}
              </M.Hidden>
              {error ? (
                <Column>
                  <M.Typography
                    variant={"display1"}
                    style={{
                      textAlign: "center"
                    }}
                  >
                    {lang.search.error}
                  </M.Typography>
                </Column>
              ) : (
                <Column>
                  {anime &&
                    anime.length > 0 &&
                    this.props.mir &&
                    this.props.mir.twist ? (
                    <M.Grid container className={classes.container}>
                      <M.Typography
                        variant="h6"
                        className={classes.secTitle}
                      >
                        Anime
                      </M.Typography>
                      <M.Grid container className={classes.itemcontainer}>
                        {anime
                          ? TwistFilter(anime, this.props.mir.twist).map(
                            show => (
                              <CardButton
                                key={show.id}
                                title={show.title.romaji}
                                image={show.coverImage.large}
                                onClick={() =>
                                  this.openEntity(`/show?s=${show.id}`)
                                }
                              />
                            )
                          )
                          : null}
                      </M.Grid>
                    </M.Grid>
                  ) : (
                    <SectionTitle title={lang.search.noani} lighter />
                  )}
                  {manga && manga.length > 0 ? (
                    <M.Grid container className={classes.container}>
                      <M.Typography
                        variant="h6"
                        className={classes.secTitle}
                      >
                        Manga
                      </M.Typography>
                      <M.Grid container className={classes.itemcontainer}>
                        {manga
                          ? manga.map(mang => (
                            <CardButton
                              key={mang.id}
                              title={mang.title.romaji}
                              image={mang.coverImage.large}
                              onClick={() =>
                                this.openEntity(`/show?m=${mang.id}`)
                              }
                            />
                          ))
                          : null}
                      </M.Grid>
                    </M.Grid>
                  ) : (
                    <SectionTitle title={lang.search.nomang} lighter />
                  )}
                  {characters && characters.data.Page.characters.length > 0 ? (
                    <M.Grid container className={classes.container}>
                      <M.Typography
                        variant="h6"
                        className={classes.secTitle}
                      >
                        {lang.search.characters}
                      </M.Typography>
                      <M.Grid container className={classes.itemcontainer}>
                        {characters ? (
                          characters.data.Page.characters.map(char => (
                            <PeopleButton
                              key={char.id}
                              name={{
                                first: char.name.first,
                                last: char.name.last
                              }}
                              image={char.image.large}
                              onClick={() =>
                                this.props.history.push(`/fig?c=${char.id}`)
                              }
                            />
                          ))
                        ) : (
                          <SectionTitle title={lang.search.nochar} lighter />
                        )}
                      </M.Grid>
                    </M.Grid>
                  ) : null}
                  {staff && staff.data.Page.staff.length > 0 ? (
                    <M.Grid container className={classes.container}>
                      <M.Typography
                        variant="h6"
                        className={classes.secTitle}
                      >
                        {lang.search.stafftitle}
                      </M.Typography>
                      <M.Grid container className={classes.itemcontainer}>
                        {staff
                          ? staff.data.Page.staff.map(staf => (
                            <PeopleButton
                              key={staf.id}
                              name={{
                                first: staf.name.first,
                                last: staf.name.last
                              }}
                              image={staf.image.large}
                              onClick={() =>
                                this.props.history.push(`/fig?s=${staf.id}`)
                              }
                            />
                          ))
                          : null}
                      </M.Grid>
                    </M.Grid>
                  ) : (
                    <SectionTitle title={lang.search.nostaff} lighter />
                  )}
                  {studios && studios.data.Page.studios.length > 0 ? (
                    <M.Grid container className={classes.container}>
                      <M.Typography
                        variant="h6"
                        className={classes.secTitle}
                      >
                        {lang.search.studiotitle}
                      </M.Typography>
                      <M.Grid container className={classes.itemcontainer}>
                        {studios
                          ? studios.data.Page.studios.map(studio => (
                            <CardButton
                              key={studio.id}
                              title={studio.name}
                              onClick={() =>
                                this.openEntity(`/tag?s=${studio.id}`)
                              }
                            />
                          ))
                          : null}
                      </M.Grid>
                    </M.Grid>
                  ) : (
                    <SectionTitle title={lang.search.nostudio} lighter />
                  )}
                  {users && users.length > 0 ? (
                    <M.Grid container className={classes.container}>
                      <M.Typography
                        variant="h6"
                        className={classes.secTitle}
                      >
                        {lang.search.userstitle}
                      </M.Typography>
                      <M.Grid container className={classes.itemcontainer}>
                        {users
                          ? users.map(user => (
                            <PeopleButton
                              key={user.userID}
                              name={{ first: user.username }}
                              image={user.avatar}
                              onClick={() =>
                                this.props.history.push(
                                  `/user${this.props.profile
                                    ? user.userID ===
                                      this.props.profile.userID
                                      ? ``
                                      : `?u=${user.userID}`
                                    : `?u=${user.userID}`
                                  }`
                                )
                              }
                            />
                          ))
                          : null}
                      </M.Grid>
                    </M.Grid>
                  ) : (
                    <SectionTitle title={lang.search.nousers} lighter />
                  )}
                </Column>
              )}
            </M.Grid>
          </div>
        </div>
      </div>
    );
  }
}

export default firebaseConnect()(
  connect(({ firebase: profile, mir }) => ({ profile, mir }))(
    M.withStyles(style)(Search)
  )
);
