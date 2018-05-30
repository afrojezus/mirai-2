import "./anime.css";

export default theme => ({
  appBar: {
    backgroundColor:
      window.theme.palette.type === "dark"
        ? window.chrome || window.firefox
          ? "rgba(0,0,0,1)"
          : "rgba(0,0,0,.8)"
        : window.chrome || window.firefox
          ? "rgba(255,255,255,1)"
          : "rgba(255,255,255,.8)",
    boxShadow: (window.chrome || window.firefox) && theme.shadows[5],
    borderBottom: (window.chrome || window.firefox) && "none",
  },
  appBarShow: {
    background: "transparent",
    boxShadow: "none",
    borderBottom: "none",
  },
  section: {
    padding: "2em",
    paddingBottom: "2em",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    overflow: "hidden",
    boxSizing: "border-box",
    "&:last-of-type": {
      paddingBottom: "2em",
    },
  },
  title: {
    letterSpacing: -3,
    fontWeight: 700,
    margin: "0 auto",
    color: "white",
    boxSizing: "border-box",
  },
  memeBannerImg: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: "100%",
    width: "100%",
    zIndex: -1,
    filter: "brightness(0.5)",
    transition: theme.transitions.create(["all"]),
    objectFit: "cover",
  },
  sectionToolbarTitle: {
    letterSpacing: -1,
    fontWeight: 600,
  },
  cardMedia: {
    minHeight: 300,
  },
  cardItem: {
    minWidth: 200,
    display: "flex",
  },
  cardItemFlex: {
    flex: 1,
  },
  cardItemCarousel: {
    minWidth: 200,
    display: "flex",
    flex: 1,
    width: "inherit",
    textAlign: "initial",
  },
  cardHeaderTitle: {
    fontSize: 14,
    fontWeight: 600,
  },
  cardButtonBase: {
    textAlign: "initial",
    flex: 1,
  },
  drawer: {
    width: 250,
  },
  appDrawerToolbar: {
    borderBottom: "1px solid rgba(0,0,0,.1)",
    padding: "1em",
    display: "flex",
    flexDirection: "column",
  },
  cardShowMore: {
    display: "flex",
    flexDirection: "column",
    minHeight: 300 + 65,
    flex: 1,
  },
  searchBar: {
    backgroundColor:
      window.theme.palette.type === "dark"
        ? "rgba(255,255,255,.1)"
        : "rgba(0,0,0,.1)",
    borderRadius: 4,
    padding: "0 1em",
  },
  searchBarContainer: {
    maxWidth: 500,
    padding: "0 1em",
  },
  searchBox: {
    position: "absolute",
    zIndex: 5000,
    width: "100%",
  },
  windowFrame: {
    position: "fixed",
    overflowY: "auto",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
    zIndex: 2000000,
    backgroundColor: theme.palette.background.default,
    "::-webkit-overflow-scrolling": "touch",
  },
  spinner: {
    width: "100%",
  },
});
