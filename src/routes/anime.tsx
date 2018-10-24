import {
  Button,
  Divider,
  Fade,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
  withStyles
} from '@material-ui/core';
import * as MICON from '@material-ui/icons';
import classnames from 'classnames';
import Kitsu from 'kitsu';
import * as React from 'react';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose, Dispatch } from 'redux';
import Twist from 'src/api/twist';
import { MIR_PLAY_SHOW, MIR_SET_TITLE } from 'src/store/mutation-types';
import globalStyles from '../globalStyles';

// Local MUI styles for the route.
const styles = (theme: any) => ({
  title: {
    fontWeight: 700
  },
  buttonMargin: {
    margin: `${theme.spacing.unit * 2}px 0`
  },
  coverImageSmall: {
    width: 181 / 2,
    height: 250 / 2
  },
  interactiveAreaBanner: {
    display: 'inline-flex',
    flexDirection: 'column'
  },
  infoItem: {
    padding: 0
  },
  infoItemIcon: {
    margin: 0
  },
  infoItemText: { padding: 0, paddingLeft: 8 },
  list: {
    width: 181
  },
  listHide: {
    width: 0,
    height: 0,
    opacity: 0,
    overflow: 'hidden'
  },
  // ...load the global styles as well
  ...globalStyles(theme)
});

class Anime extends React.Component<any> {
  public state = {
    data: null,
    episodes: null,
    loadingStream: false,
    LSMessage: ''
  };
  private kitsu: Kitsu = new Kitsu();
  constructor(props: any) {
    super(props);
    this.fetchData();
  }
  public fetchData = async () => {
    try {
      const { data }: any = await this.kitsu.get(
        `anime/${this.props.location.search.replace('?id=', '')}`,
        {
          include: 'categories'
        }
      );
      // tslint:disable-next-line:no-console
      console.log(data);
      this.setState({ data });
    } catch (error) {
      // tslint:disable-next-line:no-console
      console.error(error);
    }
  };
  public handleStream = async (shareStream: boolean) =>
    this.setState(
      { loadingStream: true, LSMessage: 'Fetching episodes...' },
      async () => {
        if (shareStream) {
          // Enable sharestream
          try {
            const episodes = await Twist.loadEpisodeList(
              this.props.location.search.replace('?id=', '')
            );
            // tslint:disable-next-line:no-console
            console.log(episodes);
            if (!episodes) {
              throw new Error('Proxy failure');
            }
            return this.setState({ episodes: episodes.reverse() }, () =>
              this.props
                .sendDataToMir({
                  eps: this.state.episodes,
                  meta: this.state.data,
                  id: this.props.location.search.replace('?id=', '')
                })
                .then(() =>
                  this.props.history.push(
                    `/watch?id=${this.props.location.search.replace(
                      '?id=',
                      ''
                    )}&share=true`
                  )
                )
            );
          } catch (error) {
            // tslint:disable-next-line:no-console
            console.error(error);
            this.setState(
              { LSMessage: 'An error occurred while fetching episodes :(' },
              () =>
                setTimeout(() => this.setState({ loadingStream: false }), 5000)
            );
          }
        } else {
          // Run locally
          try {
            const episodes = await Twist.loadEpisodeList(
              this.props.location.search.replace('?id=', '')
            );
            // tslint:disable-next-line:no-console
            console.log(episodes);
            if (!episodes) {
              throw new Error('Proxy failure');
            }
            return this.setState({ episodes: episodes.reverse() }, () =>
              this.props
                .sendDataToMir({
                  eps: this.state.episodes,
                  meta: this.state.data,
                  id: this.props.location.search.replace('?id=', '')
                })
                .then(() =>
                  this.props.history.push(
                    `/watch?id=${this.props.location.search.replace(
                      '?id=',
                      ''
                    )}`
                  )
                )
            );
          } catch (error) {
            // tslint:disable-next-line:no-console
            console.error(error);
            this.setState(
              { LSMessage: 'An error occurred while fetching episodes :(' },
              () =>
                setTimeout(() => this.setState({ loadingStream: false }), 5000)
            );
          }
        }
      }
    );
  public render() {
    const { classes } = this.props;
    const { data, loadingStream, LSMessage } = this.state;
    if (data === null) {
      return (
        <LinearProgress color="primary" style={{ width: '100%', height: 1 }} />
      );
    } else {
      const d: any = data;
      let status: string = '';
      let popularity: string = 'Not really known';
      switch (d.status) {
        case 'current':
          status = 'Ongoing';
          break;

        default:
          break;
      }
      if (d.popularityRank > 2000) {
        popularity = 'Somewhat known';
      } else if (d.popularityRank > 1000) {
        popularity = 'Fairly known';
      } else if (d.popularityRank > 500) {
        popularity = 'Fairly popular';
      } else if (d.popularityRank > 0) {
        popularity = 'Quite popular';
      }
      return (
        <main className="routeContainer" style={{ height: '100%' }}>
          <Grid
            container={true}
            className={classes.grid}
            style={{ height: '100%' }}
          >
            <img alt="" src="" className={classes.bannerImage} />
            <div
              className={classes.innerMargin}
              style={{
                margin: 'auto',
                paddingBottom: 128
              }}
            >
              <img
                src={d.coverImage ? d.coverImage.original : ''}
                alt=""
                className={classes.bannerImage}
              />
              <Grid container={true}>
                <Grid item={true} style={{ marginRight: 32 }}>
                  <img
                    src={d.posterImage.original}
                    alt=""
                    className={classnames(classes.coverImage)}
                  />
                  <List className={classnames(classes.list)} dense={true}>
                    <ListItem className={classes.infoItem}>
                      <ListItemIcon className={classes.infoItemIcon}>
                        {d.showType === 'movie' ? (
                          <MICON.MovieOutlined />
                        ) : (
                          <MICON.TvOutlined />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        className={classes.infoItemText}
                        primary={
                          d.showType === 'movie'
                            ? 'Movie'
                            : d.episodeCount + ' ' + 'Episodes'
                        }
                      />
                    </ListItem>
                    <ListItem className={classes.infoItem}>
                      <ListItemIcon className={classes.infoItemIcon}>
                        <MICON.RateReviewOutlined />
                      </ListItemIcon>
                      <ListItemText
                        className={classes.infoItemText}
                        primary={d.averageRating + '% Kitsu Score'}
                      />
                    </ListItem>
                    <ListItem className={classes.infoItem}>
                      <ListItemIcon className={classes.infoItemIcon}>
                        <MICON.StarBorderOutlined />
                      </ListItemIcon>
                      <ListItemText
                        className={classes.infoItemText}
                        primary={popularity}
                      />
                    </ListItem>
                    <Divider style={{ marginTop: 10 }} />
                    <ListItem className={classes.infoItem}>
                      <ListItemIcon className={classes.infoItemIcon}>
                        <Typography
                          style={{
                            margin: 'auto',
                            fontSize: 32,
                            fontWeight: 700,
                            paddingRight: 4
                          }}
                        >
                          {d.ageRating}
                        </Typography>
                      </ListItemIcon>
                      <ListItemText
                        className={classes.infoItemText}
                        primary={d.ageRatingGuide}
                      />
                    </ListItem>
                    <Divider style={{ marginBottom: 10 }} />
                    {d.categories.map((category: any, index: number) => (
                      <ListItem className={classes.infoItem} key={index}>
                        <Tooltip
                          TransitionComponent={Fade}
                          title={category.description}
                        >
                          <ListItemText
                            className={classes.infoItemText}
                            primary={category.title}
                            style={{ whiteSpace: 'normal' }}
                          />
                        </Tooltip>
                      </ListItem>
                    ))}
                  </List>
                </Grid>
                <Grid
                  item={true}
                  xs={true}
                  className={classes.interactiveAreaBanner}
                >
                  <Typography style={{ fontWeight: 700 }} variant={'h2'}>
                    {d.titles.en_jp ? d.titles.en_jp : d.titles.en_us}
                  </Typography>
                  <div className={classes.buttonMargin} />
                  <Typography>{d.synopsis}</Typography>
                  <Divider className={classes.buttonMargin} />

                  <Grid container={true} spacing={8}>
                    <Grid
                      item={true}
                      style={{
                        padding: loadingStream ? undefined : 0,
                        margin: loadingStream ? 'auto' : 0,
                        opacity: loadingStream ? 1 : 0,
                        width: loadingStream ? undefined : 0,
                        overflow: 'hidden',
                        height: loadingStream ? undefined : 0
                      }}
                    >
                      <Typography
                        variant="subheading"
                        color={
                          LSMessage.startsWith('An error') ? 'error' : 'primary'
                        }
                        style={{ margin: 'auto' }}
                      >
                        {LSMessage}
                      </Typography>
                    </Grid>
                    <Grid
                      item={true}
                      style={{
                        margin: 'auto',
                        opacity: loadingStream ? 0 : 1,
                        width: loadingStream ? 0 : undefined
                      }}
                    >
                      <Button
                        onClick={this.handleStream.bind(this, false)}
                        color="primary"
                        variant="outlined"
                      >
                        Stream
                      </Button>
                    </Grid>
                    <Grid
                      item={true}
                      style={{
                        margin: 'auto',
                        opacity: loadingStream ? 0 : 1,
                        width: loadingStream ? 0 : undefined
                      }}
                    >
                      <Button
                        onClick={this.handleStream.bind(this, true)}
                        variant="outlined"
                      >
                        ShareStream
                      </Button>
                    </Grid>
                    <div style={{ flex: 1 }} />
                    <Grid
                      item={true}
                      style={{ margin: 'auto', marginRight: 8 }}
                    >
                      <Typography
                        variant="subheading"
                        style={{ margin: 'auto' }}
                      >
                        {status}
                      </Typography>
                    </Grid>
                    <Grid item={true} style={{ margin: 'auto' }}>
                      <Button style={{ borderRadius: 50 }} variant="outlined">
                        <MICON.MoreHorizOutlined />
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </div>
          </Grid>
        </main>
      );
    }
  }
}

export const updateMirTitle = (title: string) => ({
  type: MIR_SET_TITLE,
  title
});

export const loadPlayer = (play: any) => ({
  type: MIR_PLAY_SHOW,
  play
});

const mapPTS = (dispatch: Dispatch) => ({
  sendTitleToMir: (title: string) => dispatch(updateMirTitle(title)),
  sendDataToMir: async (play: any) => dispatch(loadPlayer(play))
});

export default compose(
  firestoreConnect()(
    connect(
      ({ mir }: any) => ({
        mir
      }),
      mapPTS
    )(withStyles(styles as any)(Anime))
  )
);
