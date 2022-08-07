import React from "react";
import PropTypes from "prop-types";
import * as Icon from "@material-ui/icons";
import {
  Card,
  CardHeader,
  CardActions,
  CardContent,
  Typography,
  Button,
  IconButton,
  Hidden,
  CircularProgress,
  Grid,
  Divider,
  LinearProgress,
  withStyles,
  Toolbar,
  Paper,
  Modal,
  Grow,
  Tooltip,
  Fade
} from "@material-ui/core";
import { blue, grey } from "@material-ui/core/colors";
import moment from "moment";
import classNames from "classnames";
import { isEmpty, firebaseConnect } from "react-redux-firebase";
import { connect } from "react-redux";
import AvatarWrapper from "./avatarWrapper";

const style = theme => ({
  compacMode: {
    background: "transparent"
  },
  container: {
    padding: theme.spacing() * 3,
    boxSizing: "border-box",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      padding: theme.spacing(),
      marginTop: "0 !important"
    },
    background: "transparent !important",
    transition: theme.transitions.create(["all"]),
    animation: "load .5s ease"
  },
  containerRow: {
    padding: theme.spacing() * 3,
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "row",
    background: "transparent !important",
    transition: theme.transitions.create(["all"]),

    animation: "load .5s ease"
  },
  root: {
    paddingTop: theme.spacing() * 8,
    transition: theme.transitions.create(["all"]),
    animation: "load .3s ease",
    marginLeft: "auto",
    marginRight: "auto",
    maxWidth: 1500,
    paddingLeft: theme.spacing() * 2,
    paddingRight: theme.spacing() * 2,
    [theme.breakpoints.down("sm")]: {
      paddingLeft: 0,
      paddingRight: 0
    },
    boxSizing: "border-box"
  },
  commandoBar: {
    width: "100%",
    display: "inline-flex",
    boxSizing: "border-box",
    background: "transparent",
    borderBottom: `1px solid rgba(255,255,255,.1)`,
    flexFlow: "row wrap"
  },
  commandoBarTop: {
    width: "100%",
    [theme.breakpoints.down("sm")]: {
      marginTop: theme.spacing() * 7
    },
    borderBottom: "1px solid rgba(255,255,255,.1)",
    boxSizing: "border-box",
    background: "rgba(0,0,0,0)",
    marginTop: theme.spacing() * 8,
    position: "static",
    zIndex: 10,
    backdropFilter: "blur(10px)"
  },
  commandoBarTopInner: {
    width: "100%",
    maxWidth: 1500,
    marginLeft: "auto",
    marginRight: "auto",
    display: "flex",
    boxSizing: "border-box",
    background: "transparent",
    zIndex: 10
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
    fontSize: theme.typography.pxToRem(12),
    textAlign: "center",
    color: "rgba(255,255,255,.8)"
  },
  bigBar: {
    width: "100%",
    height: "auto",
    boxShadow: "0 2px 24px rgba(0,0,0,.0)",
    background: "transparent",
    position: "relative",
    // overflow: 'hidden',
    transformStyle: "preserve-3d",
    // transform: 'translateZ(20px)',
    paddingBottom: theme.spacing() * 4,
    marginBottom: theme.spacing() * 8,
    transition: theme.transitions.create(["all"])
  },
  header: {
    position: "absolute",
    zIndex: -1,
    opacity: 0.28,
    top: 0,
    width: "100%",
    objectFit: "cover",
    left: 0,
    transition: theme.transitions.create(["all"]),
    animation: "fade 1.1s ease",
    textIndent: -999,
    border: "none",
    height: "100vh",
    maskImage: "linear-gradient(rgba(0, 0, 0, 1.0), transparent)",
    transformStyle: "preserve-3d",
    backfaceVisibility: "hidden"
  },
  headerD: {
    position: "fixed",
    zIndex: -1,
    opacity: 0.8,
    top: 0,
    width: "100%",
    objectFit: "cover",
    left: 0,
    transition: theme.transitions.create(["all"]),
    animation: "fadeInSlowly 1.1s ease",
    textIndet: -999,
    border: "none",
    height: "100vh"
  },
  loading: {
    height: "100%",
    width: "100%",
    zIndex: 1200,
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
    padding: 0,
    margin: "auto",
    color: "white",
    transition: theme.transitions.create(["all"])
  },
  loadingBar: {
    margin: "auto"
  },
  loadingBarMobile: {
    position: "fixed",
    top: theme.mixins.toolbar.minHeight,
    left: 0,
    width: "100%",
    zIndex: 1000,
    height: 1,
    [theme.breakpoints.up("sm")]: {
      top: 64
    },
    background: "transparent"
  },
  loadingBarColor: {
    background: "white"
  },
  titleheader: {
    width: "100%",
    minHeight: 900,
    background: `linear-gradient(to top, transparent, ${blue.A200})`,
    position: "absolute",
    top: 0,
    left: 0,
    display: "flex",
    zIndex: -1,
    transition: theme.transitions.create(["all"]),
    opacity: 0
  },
  titleHeaderInner: {
    paddingLeft: theme.spacing() * 5,
    paddingRight: theme.spacing() * 5,
    margin: "0 auto",
    boxSizing: "border-box",
    display: "flex",
    width: "100%",
    maxWidth: 1500,
    [theme.breakpoints.down("sm")]: {
      display: "none"
    },
    transition: theme.transitions.create(["all"])
  },
  titleheadertitle: {
    color: "white",
    margin: "auto 0",
    position: "relative",
    marginTop: theme.spacing() * 14,
    fontWeight: 700,
    textShadow: "0 2px 24px rgba(0,0,0,.07)",
    whiteSpace: "nowrap",
    flex: 1,
    [theme.breakpoints.down("sm")]: {
      whiteSpace: "initial",
      marginTop: theme.spacing() * 10,
      fontSize: theme.typography.pxToRem(28)
    },
    transition: theme.transitions.create(["all"])
  },
  titleheadersubtitle: {
    color: "white",
    margin: "auto 0",
    fontSize: theme.typography.pxToRem(24),
    position: "relative",
    marginTop: theme.spacing() * 17,
    fontWeight: 500,
    textShadow: "0 2px 24px rgba(0,0,0,.07)",
    whiteSpace: "nowrap",
    flex: 1,
    [theme.breakpoints.down("sm")]: {
      marginTop: theme.spacing(),
      fontSize: theme.typography.pxToRem(16)
    },
    transition: theme.transitions.create(["all"])
  },
  loadingRoot: {
    height: "100vh",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    animation: "loadIn .3s ease",
    transition: theme.transitions.create(["all"])
  },
  loadingCircle: {
    margin: "auto",
    color: "white"
  },
  column: {
    display: "flex",
    flexDirection: "column",
    width: "100%"
  },
  row: {
    display: "flex",
    flexDirection: "row",
    width: "100%"
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
  secTitle: {
    zIndex: "inherit",
    display: "flex"
  },
  secTitleText: {
    fontWeight: 700,
    fontSize: 22,
    paddingLeft: 0,
    margin: "auto 0",
    padding: theme.spacing()
  },
  secSubtitle: {
    padding: theme.spacing(),
    paddingLeft: 0,
    fontWeight: 500,
    fontSize: 16,
    zIndex: "inherit",
    color: "rgba(255,255,255,.7)"
  },
  lightersecTitle: {
    fontWeight: 500
  },
  modalPaper: {
    margin: "auto",
    padding: theme.spacing(),
    boxSizing: "border-box",
    background: theme.palette.background.paper,
    outline: "none",
    minHeight: 120,
    minWidth: window.mobilecheck() ? null : 500
  },
  modalTextColor: {
    color: grey[50]
  },
  modalTitle: {
    fontWeight: 700
  },
  likeContainer: {
    display: "flex",
    opacity: 0.7,
    margin: "0 4px"
  },
  likeIcon: {
    color: "white",
    fontSize: 18,
    margin: "auto"
  },
  likeCount: {
    marginLeft: theme.spacing(),
    fontWeight: 700
  },
  dialogueActionButton: {
    margin: "auto"
  }
});

export const Column = withStyles(style, { withTheme: true })(
  ({ classes, children }) => <div className={classes.column}>{children}</div>
);

export const Row = withStyles(style, { withTheme: true })(
  ({ classes, children }) => <div className={classes.row}>{children}</div>
);

export const ItemContainer = withStyles(style, { withTheme: true })(
  ({ classes, theme, children, noMargin, spacing, topPad, ...props }) => (
    <Grid
      container
      className={classes.itemcontainer}
      style={{
        margin: noMargin ? 0 : null,
        paddingTop: topPad ? theme.spacing() * 2 : null,
        ...props.style
      }}
      spacing={spacing}
    >
      {children}
    </Grid>
  )
);

ItemContainer.defaultProps = {
  spacing: 8,
  noMargin: true
};

export const SectionTitle = withStyles(style, { withTheme: true })(
  ({
    classes,
    theme,
    title,
    lighter,
    subtitle,
    noPad,
    button,
    buttonClick,
    ...props
  }) => (
    <div className={classes.secTitle}>
      <Typography
        variant="h6"
        className={classNames(
          classes.secTitleText,
          lighter ? classes.lightersecTitle : null
        )}
        style={{
          color: lighter ? "rgba(255,255,255,.5)" : null,
          paddingBottom: noPad ? 0 : null,
          ...props.style
        }}
      >
        {title}
      </Typography>
      {subtitle && subtitle !== "" ? (
        <Hidden mdDown>
          <Typography
            variant="h6"
            className={classNames(
              classes.secTitleText,
              classes.lightersecTitle
            )}
            style={{
              color: "rgba(255,255,255,.5)",
              paddingBottom: noPad ? 0 : null,
              marginLeft: theme.spacing(),
              fontWeight: 500,
              fontSize: 18
            }}
          >
            {subtitle}
          </Typography>
        </Hidden>
      ) : null}
      {button ? <div style={{ flex: 1 }} /> : null}
      {button ? <Button onClick={buttonClick}>{button}</Button> : null}
    </div>
  )
);

export const SectionSubTitle = withStyles(style, { withTheme: true })(
  ({ classes, title, ...props }) => (
    <Typography
      variant={"body1"}
      className={classes.secSubtitle}
      style={props.style}
    >
      {title}
    </Typography>
  )
);

export const LoadingScreen = withStyles(style, { withTheme: true })(
  ({ classes, error, log }) => (
    <div className={classes.loadingRoot}>
      <div style={{ margin: "auto", display: "flex", flexDirection: "column" }}>
        {error ? (
          <Icon.ErrorOutline className={classes.loadingCircle} />
        ) : (
          <CircularProgress className={classes.loadingCircle} />
        )}
        {log && log !== "" ? (
          <Typography
            variant="h6"
            style={{ textAlign: "center", marginTop: 16 }}
          >
            {log}
          </Typography>
        ) : null}
      </div>
    </div>
  )
);

export const Container = withStyles(style, { withTheme: true })(
  ({
    classes,
    theme,
    children,
    spacing,
    special,
    row,
    hasHeader,
    direction,
    justify,
    alignContent,
    alignItems,
    ...props
  }) => (
    <Grid
      container
      direction={direction}
      justify={justify}
      alignContent={alignContent}
      alignItems={alignItems}
      style={
        hasHeader
          ? window.innerWidth < 1000 || window.mobilecheck()
            ? null
            : {
              marginTop: theme.spacing() * 16
            }
          : null
      }
      spacing={spacing}
      {...props}
      className={
        row ? classes.containerRow : special ? "containerS" : classes.container
      }
    >
      {children}
    </Grid>
  )
);

export const Root = withStyles(style, { withTheme: true })(
  ({ classes, theme, children, hasTab, ...props }) => (
    <div
      className={classes.root}
      style={hasTab ? { paddingTop: theme.spacing() * 4 } : null}
      {...props}
    >
      {children}
    </div>
  )
);

export const Dialogue = firebaseConnect()(
  connect(({ firebase: { profile }, ...state }) => ({ profile, ...state }))(
    withStyles(style, { withTheme: true })(
      ({
        classes,
        theme,
        children,
        open,
        title,
        actions,
        actionsSend,
        zoom, // This is an user-feed.
        feed,
        profile,
        style,
        onClose
      }) => (
        <Modal open={open} style={{ display: "flex", ...style }} onClose={onClose}>
          {zoom ? (
            <Grow in={open}>
              <Card
                elevation={4}
                className={classes.modalPaper}
                style={{ padding: 0, maxWidth: 700 }}
              >
                <CardHeader
                  title={feed.ftitle}
                  subheader={
                    feed.context + " | " + moment(feed.date).from(Date.now())
                  }
                  avatar={<AvatarWrapper src={feed.avatar} />}
                  action={
                    <IconButton onClick={onClose}>
                      <Icon.Close />
                    </IconButton>
                  }
                  classes={{
                    action: classes.dialogueActionButton
                  }}
                />
                <Divider />
                {feed.image ? (
                  <img
                    style={{
                      transition: theme.transitions.create(["all"]),
                      maxHeight: window.innerHeight,
                      width: "100%",
                      objectFit: "cover"
                    }}
                    alt=""
                    src={feed.image}
                  />
                ) : null}
                <CardContent>
                  <Typography
                    variant="body1"
                    dangerouslySetInnerHTML={{ __html: feed.text }}
                  />
                </CardContent>
                <Divider />
                <CardActions>
                  <Tooltip
                    title={
                      !feed.likes
                        ? "Nobody likes this post"
                        : Object.values(feed.likes).length > 1
                          ? Object.values(feed.likes).length +
                          " users liked this"
                          : Object.values(feed.likes).length +
                          " user liked this"
                    }
                  >
                    <div className={classes.likeContainer}>
                      <Icon.Favorite className={classes.likeIcon} />
                      <Typography vairant="title" className={classes.likeCount}>
                        {!feed.likes ? 0 : Object.values(feed.likes).length}
                      </Typography>
                    </div>
                  </Tooltip>
                  <IconButton
                    style={{
                      opacity: 0,
                      pointerEvents: "none",
                      cursor: "default"
                    }}
                  />
                  <div style={{ flex: 1 }} />
                  {!isEmpty(profile) && profile ? (
                    <Tooltip
                      title={
                        isEmpty(profile)
                          ? "You need to login to like posts"
                          : feed.likes && feed.likes[profile.userID]
                            ? "Dislike this"
                            : "Like this"
                      }
                      placement="bottom"
                    >
                      <div>
                        <IconButton
                          disabled={isEmpty(feed.profile) ? true : false}
                          classes={{ label: classes.text }}
                          onClick={async () =>
                            feed.likes && feed.likes[profile.userID]
                              ? feed.disLikeThis()
                              : feed.likeThis()
                          }
                        >
                          {profile &&
                            profile.userID &&
                            feed.likes &&
                            feed.likes[profile.userID] ? (
                            <Icon.Favorite />
                          ) : (
                            <Icon.FavoriteBorder />
                          )}
                        </IconButton>
                      </div>
                    </Tooltip>
                  ) : null}
                </CardActions>
              </Card>
            </Grow>
          ) : (
            <Fade in={open}>
              <Card elevation={4} className={classes.modalPaper}>
                <CardContent>
                  <Typography
                    variant="h6"
                    className={classNames(
                      classes.modalTextColor,
                      classes.modalTitle
                    )}
                  >
                    {title}
                  </Typography>
                  {children}
                </CardContent>
                {actions !== undefined ? (
                  <CardActions>
                    <Hidden mdDown>
                      <div style={{ flex: 1 }} />
                    </Hidden>
                    {actions.includes("send") ? (
                      <Button onClick={actionsSend}>SEND</Button>
                    ) : null}
                    {actions.includes("ok") ? (
                      <Button onClick={onClose}>OK</Button>
                    ) : null}
                    {actions.includes("close") ? (
                      <Button onClick={onClose}>CLOSE</Button>
                    ) : null}
                  </CardActions>
                ) : null}
              </Card>
            </Fade>
          )}
        </Modal>
      )
    )
  )
);

export const CommandoBar = withStyles(style)(
  ({ classes, children, ...props }) => (
    <Toolbar id="commandoBar" className={classes.commandoBar} {...props}>
      {children}
    </Toolbar>
  )
);

export const CommandoBarTop = withStyles(style)(
  ({ classes, title, children, ...props }) => (
    <div className={classes.commandoBarTop} id="commandoBarMain">
      <Toolbar className={classes.commandoBarTopInner} {...props}>
        {children}
      </Toolbar>
    </div>
  )
);

export const MainCard = withStyles(style)(({ classes, children, ...props }) => (
  <Paper id="mainCard" className={classes.bigBar} {...props}>
    {children}
  </Paper>
));

export const TitleHeader = withStyles(style, { withTheme: true })(
  ({
    classes,
    theme,
    children,
    title,
    subtitle,
    color,
    miraiLogo,
    colortext,
    ...props
  }) => {
    if (window.innerWidth < 1000) return null;
    else
      return (
        <div
          className={classes.titleheader}
          style={
            color
              ? {
                opacity: 1,
                background: `linear-gradient(to top, transparent, ${color})`
              }
              : null
          }
          {...props}
        >
          <div className={classes.titleHeaderInner}>
            {miraiLogo ? <div style={{ flex: 1 }} /> : null}
            {miraiLogo ? (
              <div style={{ display: window.mobilecheck() ? "none" : null }}>
                <Typography
                  className={classes.titleheadertitle}
                  style={{
                    marginTop: theme.spacing() * 12,
                    textAlign: "center"
                  }}
                  variant="h2"
                >
                  {title}
                </Typography>
                <Typography
                  className={classes.titleheadersubtitle}
                  style={{
                    marginTop: -8,
                    textAlign: window.mobilecheck() ? null : "center",
                    fontSize: 18
                  }}
                  variant="h5"
                  dangerouslySetInnerHTML={{ __html: subtitle }}
                />
              </div>
            ) : null}
            {miraiLogo ? <div style={{ flex: 1 }} /> : null}
            {miraiLogo ? null : (
              <Typography
                className={classes.titleheadertitle}
                style={colortext ? { color: colortext } : null}
                variant="h2"
              >
                {title}
              </Typography>
            )}
            {miraiLogo ? null : (
              <Hidden smDown>
                <div style={{ flex: "1 1 100%" }} />
              </Hidden>
            )}
            {miraiLogo ? null : (
              <Typography
                className={classes.titleheadersubtitle}
                style={colortext ? { color: colortext } : null}
                variant="h5"
              >
                {subtitle}
              </Typography>
            )}
          </div>
          {children}
        </div>
      );
  }
);

class HeaderRaw extends React.Component {
  static defaultProps = {
    color: "#111",
    image: null,
    classes: style
  };

  componentDidMount = () => {
    if (this.props.color) {
      document.documentElement.style.background = this.props.color;
    }
  };

  componentWillReceiveProps = nextProps => {
    if (this.props.color) {
      document.documentElement.style.background = nextProps.color;
    }
  };

  componentWillUnmount = () => {
    if (this.props.color) {
      document.documentElement.style.background = null;
    }
  };

  render() {
    const { image, classes } = this.props;
    if (image) {
      return (
        <img
          id="header"
          style={{ opacity: 0 }}
          onLoad={e => {
            e.currentTarget.style.animation = "loadInH 1s ease";
            e.currentTarget.style.opacity = null;
          }}
          className={classes.header}
          src={image}
          alt=""
          {...this.props}
        />
      );
    }
    return <div />;
  }
}

export const Header = withStyles(style)(HeaderRaw);

export const LoadingIndicator = withStyles(style)(({ classes, loading }) => {
  if (window.mobilecheck())
    return (
      <LinearProgress
        className={classes.loadingBarMobile}
        classes={{ barColorPrimary: classes.loadingBarColor }}
        style={!loading ? { opacity: 0 } : null}
      />
    );
  else
    return (
      <div style={{
        position: "fixed",
        display: "flex",
        width: "100%",
        height: 64,
        pointerEvents: "none",
        zIndex: 2000
      }}>
        <CircularProgress
          classes={{ colorPrimary: classes.loadingCircle }}
          className={classes.loadingBar}
          style={!loading ? { opacity: 0 } : null}
        />
      </div>
    );
});

// Proptypes
Container.propTypes = {
  children: PropTypes.node,
  spacing: PropTypes.number
};
Container.defaultProps = {
  spacing: 0
};
Root.propTypes = {
  children: PropTypes.node
};
