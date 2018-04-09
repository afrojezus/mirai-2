import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import { connect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';
import Typography from 'material-ui/Typography/Typography';
import green from 'material-ui/colors/green';
import grey from 'material-ui/colors/grey';
import SwipeableViews from 'react-swipeable-views';
import Tab from 'material-ui/Tabs/Tab';
import Tabs from 'material-ui/Tabs/Tabs';
import SuperTable from '../components/supertable';
import Button from 'material-ui/Button/Button';
import AddIcon from 'material-ui-icons/Add';
import Hidden from 'material-ui/Hidden/Hidden';
import checklang from '../checklang';
import strings from '../strings.json';
import {
  Root,
  CommandoBar,
  Container,
  LoadingIndicator,
  TitleHeader,
  Header,
  CommandoBarTop,
  Column,
  Dialogue,
  SectionTitle,
} from '../components/layouts';
import CardButton from '../components/cardButton';
import { scrollFix } from './../utils/scrollFix';

const style = (theme) => ({
  tabLabel: {
    opacity: 0.5,
    fontSize: 16,
    color: 'white',
    textTransform: 'initial',
  },
  tabLabelActive: {
    fontWeight: 700,
    fontSize: 16,
    opacity: 1,
    color: 'white',
    textTransform: 'initial',
  },
  tabLine: {
    filter: 'drop-shadow(0 1px 12px rgba(0,0,255,.2))',
    height: 2,
    background: 'white',
  },
  tab: {
    height: 64,
  },
  feedTitle: {
    fontWeight: 700,
    textShadow: '0 2px 24px rgba(0,0,0,.07)',
    marginBottom: theme.spacing.unit * 3,
    zIndex: 20,
    color: 'white',
  },
  infoBox: {
    display: 'flex',
    marginBottom: theme.spacing.unit * 2,
  },
  feedContext: {
    fontSize: theme.typography.pxToRem(16),
  },
  fabContainer: {
    transition: theme.transitions.create(['all']),
    zIndex: 10000,
  },
  fabPlayButton: {
    position: 'fixed',
    bottom: theme.spacing.unit * 4,
    right: theme.spacing.unit * 4,
    zIndex: 10000,
    transform: 'translateZ(0)',
  },
  fabProgress: {
    color: 'white',
    zIndex: 10001,
    transition: theme.transitions.create(['all']),
  },
  fabWrapper: {
    transition: theme.transitions.create(['all']),
    margin: theme.spacing.unit,
    position: 'relative',
    zIndex: 10000,
  },
});

class Live extends Component {
  state = {
    loading: true,
    index: 0,
    streams: null,
    streamModal: false,
    lang: strings.enus,
    hue: '#111',
  };

  componentWillMount = () => {
    checklang(this);
    scrollFix();
  };

  componentDidMount = () => {
    this.getColors();
    this.props.firebase
      .database()
      .ref('/streams')
      .on('value', (value) =>
        this.setState({ streams: value.val() }, () =>
          this.setState({ loading: false }),
        ),
      );
  };

  getColors = () => {
    const hue = localStorage.getItem('user-hue');
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

  showHelp = () => this.setState({ streamModal: !this.state.streamModal });

  render() {
    const { classes, profile } = this.props;
    const { index, streams, streamModal, lang, hue } = this.state;
    return (
      <div>
        <LoadingIndicator loading={this.state.loading} />
        <TitleHeader color={hue} />
        <Header color={hue} />
        <div id="fabShowButton" className={classes.fabContainer}>
          <Button
            color="primary"
            className={classes.fabPlayButton}
            variant={'fab'}
            onClick={this.showHelp}>
            <AddIcon />
          </Button>
        </div>
        <Dialogue
          aria-labelledby="stream-modal"
          aria-describedby="stream"
          open={streamModal}
          onClose={() => this.setState({ streamModal: false })}
          title={lang.live.streamHelp.title}
          actions={'ok'}>
          <Typography variant="body1">{lang.live.streamHelp.desc}</Typography>
        </Dialogue>
        <CommandoBarTop title="Live">
          <Hidden smDown>
            <div style={{ flex: 1 }} />
          </Hidden>
          <Tabs
            value={this.state.index}
            onChange={(e, val) => this.setState({ index: val })}
            indicatorClassName={classes.tabLine}
            centered
            fullWidth>
            <Tab
              label={lang.live.streams}
              classes={{
                root: classes.tab,
                label:
                  this.state.index === 0
                    ? classes.tabLabelActive
                    : classes.tabLabel,
              }}
            />
            <Tab
              label={lang.live.friends}
              classes={{
                root: classes.tab,
                label:
                  this.state.index === 1
                    ? classes.tabLabelActive
                    : classes.tabLabel,
              }}
            />
          </Tabs>
          <Hidden smDown>
            <div style={{ flex: 1 }} />
          </Hidden>
        </CommandoBarTop>
        <Root hasTab>
          {index === 0 ? (
            <Container>
              <Column>
                <Typography variant="display3" className={classes.feedTitle}>
                  {lang.live.streams}
                </Typography>
                <SectionTitle
                  title={lang.live.streamsdesc}
                  style={{ marginTop: -32 }}
                />
                {streams &&
                Object.values(streams).filter((u) => u.id !== 'example')
                  .length > 0 ? (
                  <Container>
                    {Object.values(streams)
                      .filter((u) => u.id !== 'example')
                      .map((stream, index) => (
                        <CardButton
                          key={index}
                          onClick={() =>
                            this.props.history.push(`/stream?s=${stream.id}`)
                          }
                          image={stream.cover}
                          title={stream.title}
                          subtitle={stream.hoster + "'s stream"}
                        />
                      ))}
                  </Container>
                ) : (
                  <SectionTitle title={lang.live.nostreams} lighter />
                )}
              </Column>
            </Container>
          ) : null}
          {index === 1 ? (
            <Container>
              <Column>
                <Typography variant="display3" className={classes.feedTitle}>
                  {lang.live.friendsstream}
                </Typography>
                {streams &&
                Object.values(streams)
                  .filter((u) => u.id !== 'example')
                  .filter((s) => profile.friends && profile.friends[s.id])
                  .length > 0 ? (
                  <Container>
                    {Object.values(streams)
                      .filter((u) => u.id !== 'example')
                      .filter((s) => profile.friends && profile.friends[s.id])
                      .map((stream, index) => (
                        <CardButton
                          key={index}
                          onClick={() =>
                            this.props.history.push(`/stream?s=${stream.id}`)
                          }
                          image={stream.cover}
                          title={stream.title}
                          subtitle={stream.hoster + "'s stream"}
                        />
                      ))}
                  </Container>
                ) : (
                  <SectionTitle title={lang.live.nofriends} lighter />
                )}
              </Column>
            </Container>
          ) : null}
          {index === 2 ? (
            <Container>
              <Column>
                <Typography variant="display3" className={classes.feedTitle}>
                  {lang.live.livetv}
                </Typography>
              </Column>
            </Container>
          ) : null}
        </Root>
      </div>
    );
  }
}

export default firebaseConnect()(
  connect(({ firebase: { profile } }) => ({ profile }))(
    withStyles(style)(Live),
  ),
);
