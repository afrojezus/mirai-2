import {
  Button,
  Divider,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  withStyles
} from '@material-ui/core';
import * as MICON from '@material-ui/icons';
import Kitsu from 'kitsu';
import * as React from 'react';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import globalStyles from '../globalStyles';

// Local MUI styles for the route.
const styles = (theme: any) => ({
  title: {
    fontWeight: 700
  },
  buttonMargin: {
    margin: `${theme.spacing.unit * 2}px 0`
  },
  coverImage: {
    width: 181,
    height: 250,
    objectFit: 'cover',
    borderRadius: 4,
    boxShadow: theme.shadows[3]
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
  // ...load the global styles as well
  ...globalStyles(theme)
});

class Anime extends React.Component<any> {
  public state = {
    data: null
  };
  private kitsu: Kitsu = new Kitsu();
  constructor(props: any) {
    super(props);
    this.fetchData();
  }
  public fetchData = async () => {
    try {
      const { data }: any = await this.kitsu.get(
        `anime/${this.props.location.search.replace('?id=', '')}`
      );
      // tslint:disable-next-line:no-console
      console.log(data);
      this.setState({ data });
    } catch (error) {
      // tslint:disable-next-line:no-console
      console.error(error);
    }
  };
  public render() {
    const { classes } = this.props;
    const { data } = this.state;
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
              style={{ margin: 'auto', paddingBottom: 128 }}
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
                    className={classes.coverImage}
                  />
                  <List dense={true}>
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
                  </List>
                </Grid>
                <Grid
                  item={true}
                  xs={true}
                  className={classes.interactiveAreaBanner}
                >
                  <Typography style={{ fontWeight: 700 }} variant="h2">
                    {d.titles.en_jp ? d.titles.en_jp : d.titles.en_us}
                  </Typography>
                  <div className={classes.buttonMargin} />
                  <Typography>{d.synopsis}</Typography>
                  <Divider className={classes.buttonMargin} />
                  <Grid container={true} spacing={8}>
                    <Grid item={true} style={{ margin: 'auto' }}>
                      <Button color="primary" variant="outlined">
                        Stream
                      </Button>
                    </Grid>
                    <Grid item={true} style={{ margin: 'auto' }}>
                      <Button variant="outlined">ShareStream</Button>
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

export default compose(
  firestoreConnect()(
    connect(({ mir }: any) => ({
      mir
    }))(withStyles(styles as any)(Anime))
  )
);
