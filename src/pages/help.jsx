import React, { Component } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
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
} from "@material-ui/core";
import { connect } from "react-redux";
import { firebaseConnect } from "react-redux-firebase";
import checklang from "../checklang";
import strings from "../strings.json";
import { scrollFix } from "./../utils/scrollFix";
import { Root, Container, TitleHeader, Header } from "../components/layouts";

const style = theme => ({
  column: {
    display: "flex",
    flexFlow: "column wrap",
    width: "100%",
  },
  headline: {
    marginBottom: theme.spacing.unit,
  },
  title: {
    fontWeight: 700,
    marginBottom: theme.spacing.unit * 2,
    fontSize: theme.typography.pxToRem(24),
  },
  divider: {
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 3,
  },
  paragraph: {
    fontSize: theme.typography.pxToRem(16),
  },
});

class Help extends Component {
  state = {
    articles: null,
    lang: strings.enus,
  };
  componentWillMount = () => {
    checklang(this);
    scrollFix();
    this.getColors();
  };

  getColors = () => {
    const hue = localStorage.getItem("user-hue");
    if (hue) {
      let hues = JSON.parse(hue);
      return this.setState({
        hue: hues.hue,
        hueVib: hues.hueVib,
        hueVibN: hues.hueVibN,
      });
    } else {
      return null;
    }
  };

  componentDidMount = () =>
    this.props.firebase
      .database()
      .ref("/articles")
      .child("help")
      .on("value", value =>
        this.setState({ articles: Object.values(value.val()) })
      );
  render = () => (
    <div>
      <TitleHeader title={this.state.lang.help.title} />
      <Root>
        <Container hasHeader>
          <div className={this.props.classes.column}>
            <Typography className={this.props.classes.title} variant="title">
              FAQ
            </Typography>
            {this.state.articles &&
              this.state.articles.map((paragraph, index) => (
                <div key={index}>
                  <Typography
                    className={this.props.classes.headline}
                    variant="headline"
                  >
                    {paragraph.headline}
                  </Typography>
                  <Typography
                    variant="body1"
                    className={this.props.classes.paragraph}
                    dangerouslySetInnerHTML={{ __html: paragraph.paragraph }}
                  />
                  <Divider className={this.props.classes.divider} />
                </div>
              ))}
          </div>
        </Container>
      </Root>
    </div>
  );
}

export default firebaseConnect()(
  connect(({ firebase: { profile } }) => ({ profile }))(withStyles(style)(Help))
);
