// The main video player for the application. Fuck ReactPlayer. Fuck depending on other shit for tiny things.
import { IconButton, Paper, Toolbar, withStyles } from '@material-ui/core';
import * as MICON from '@material-ui/icons';
import classnames from 'classnames';
import * as React from 'react';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import Twist from 'src/api/twist';
import { history } from 'src/store';

const styles = (theme: any) => ({
  root: {
    position: 'fixed',
    bottom: 0,
    right: 0,
    height: '100%',
    width: '100%',
    zIndex: 500000
  },
  mini: {
    bottom: 0,
    right: 0,
    height: 200,
    width: 300,
    margin: theme.spacing.unit * 2
  },
  fullscreen: {},
  video: {
    height: '100%',
    width: '100%',
    backgroundColor: 'black'
  },
  controls: {
    position: 'absolute',
    bottom: 0,
    width: '100%'
  },
  inactive: {
    opacity: 0,
    pointerEvents: 'none'
  }
});

class VideoPlayer extends React.Component<any> {
  public container: HTMLElement | null = null;
  public video: HTMLVideoElement | null = null;
  public state = {
    mini: false,
    fullscreen: false,
    active: false,
    source: '',
    playing: false,
    watchURL: ''
  };
  private unlisten = history.listen((location: any) => {
    if (location.pathname === '/watch') {
      return this.setState(
        {
          active: true,
          mini: false,
          watchURL: window.location.pathname + window.location.search
        },
        () => {
          return this.loadEpisode();
        }
      );
    }
    return this.setState({ mini: true, playing: false });
  });
  constructor(props: any) {
    super(props);
  }
  public loadEpisode = async () => {
    // Load episode
    const eps = this.props.mir.play.eps;
    // tslint:disable-next-line:no-console
    console.log(eps[0]);
    try {
      const source = await Twist.fetchSource_Hack(eps[0].link);
      this.setState({
        source,
        playing: true
      });
    } catch (error) {
      // tslint:disable-next-line:no-console
      console.error(error);
    }
  };
  public componentWillUnmount() {
    // tslint:disable-next-line:no-unused-expression
    this.unlisten;
  }
  public setElement = (element: any) => (this.container = element);
  public setVideo = (element: any) => (this.video = element);
  public onPlaying = (event: React.SyntheticEvent<HTMLVideoElement>) => {
    //
  };

  // Controls
  public toggleMini = () => this.setState({ mini: !this.state.mini });
  public toggleFullscreen = () =>
    this.setState({ fullscreen: !this.state.fullscreen }, () => {
      if (this.state.fullscreen) {
        (this.container as HTMLElement).requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    });
  public goBackToWatch = () => history.push(this.state.watchURL);

  public togglePlay = () => this.setState({ playing: !this.state.playing });

  public render() {
    const { classes } = this.props;
    const { mini, fullscreen, active, source, playing } = this.state;
    const v: HTMLVideoElement = this.video as HTMLVideoElement;

    if (v) {
      // Boolean controls for video
      if (playing) {
        v.play();
      } else {
        v.pause();
      }
    }

    return (
      <Paper
        className={classnames(
          classes.root,
          mini ? classes.mini : null,
          fullscreen ? classes.fullscreen : null,
          active ? null : classes.inactive
        )}
        innerRef={this.setElement}
      >
        <video
          className={classes.video}
          src={source}
          muted={true}
          onPlaying={this.onPlaying}
          ref={this.setVideo}
        />
        <Toolbar className={classes.controls}>
          <IconButton onClick={this.togglePlay}>
            {playing ? <MICON.PauseOutlined /> : <MICON.PlayArrowOutlined />}
          </IconButton>
          <div style={{ flex: 1 }} />
          {mini ? (
            <IconButton onClick={this.goBackToWatch}>
              <MICON.OpenInNewOutlined />
            </IconButton>
          ) : (
            <IconButton onClick={this.toggleFullscreen}>
              {fullscreen ? (
                <MICON.FullscreenExitOutlined />
              ) : (
                <MICON.FullscreenOutlined />
              )}
            </IconButton>
          )}
        </Toolbar>
      </Paper>
    );
  }
}

export default compose(
  firestoreConnect()(
    connect(({ mir }: any) => ({
      mir
    }))(withStyles(styles as any)(VideoPlayer))
  )
);
