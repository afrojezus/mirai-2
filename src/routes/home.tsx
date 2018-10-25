import {
  ButtonBase,
  Fade,
  Grid,
  Paper,
  Typography,
  withStyles
} from '@material-ui/core';
import * as React from 'react';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import Searchbar from 'src/components/searchbar';
import globalStyles from '../globalStyles';

// Local MUI styles for the route.
const styles = (theme: any) => ({
  title: {
    fontWeight: 700
  },
  searchMargin: {
    paddingTop: theme.spacing.unit
  },
  animeList: {
    background: 'rgba(255,255,255,.05)',
    border: '1px solid rgba(255,255,255,.1)',
    boxShadow: 'none',
    borderRadius: 4,
    display: 'flex',
    transition: theme.transitions.create(['all']),
    '&:hover': {
      background: 'rgba(255,255,255,.08)',
      border: '1px solid rgba(255,255,255,.15)'
    },
    '&:focus': {
      background: 'rgba(255,255,255,.08)',
      border: '1px solid rgba(255,255,255,.15)'
    }
  },
  listItem: {},
  trendingContainer: {
    width: '100%',
    marginTop: theme.spacing.unit
  },
  // ...load the global styles as well
  ...globalStyles(theme)
});

// Index page route for the application, load through router.
class Home extends React.Component<any> {
  public state = {
    trending: []
  };
  constructor(props: any) {
    super(props);
    this.fetchData();
  }
  public fetchData = async () => {
    try {
      const { data }: any = await fetch(
        'https://kitsu.io/api/edge/trending/anime',
        {
          headers: {
            Accept: 'application/vnd.api+json',
            'Content-Type': 'application/vnd.api+json'
          }
        }
      ).then((response: Response) => response.json());
      // tslint:disable-next-line:no-console
      console.log(data);
      this.setState({ trending: data });
    } catch (error) {
      // tslint:disable-next-line:no-console
      console.error(error);
    }
  };

  public goToAnime = (anime: any) =>
    this.props.history.push(`/anime?id=${anime.kitsu}`, { anime });

  public goToAnime2 = (anime: any) =>
    this.props.history.push(`/anime?id=${anime.id}`, {
      anime: anime.attributes
    });

  public render() {
    const { classes } = this.props;
    const { trending } = this.state;
    return (
      <main className="routeContainer" style={{ height: '100%' }}>
        <Grid
          container={true}
          className={classes.grid}
          style={{ display: 'flex', height: '100%' }}
        >
          <video
            muted={true}
            autoPlay={true}
            loop={true}
            src="http://storage.csgoani.me/uploads/ofdrof.webm"
            className={classes.bannerImage}
          />
          <div
            className={classes.innerMargin}
            style={{ margin: 'auto', maxWidth: 189 * 4 }}
          >
            <div style={{ display: 'inline-flex', width: '100%' }}>
              <Typography variant="h2" className={classes.title}>
                Mirai
              </Typography>
              <Typography
                variant="h5"
                style={{ textAlign: 'right', width: '100%', margin: 'auto' }}
              >
                Stream anime without any of the bullshit.
              </Typography>
            </div>
            <div className={classes.searchMargin}>
              <Searchbar />
            </div>
            <Grid
              container={true}
              spacing={8}
              className={classes.trendingContainer}
              style={{ margin: 0, marginTop: 8 }}
            >
              {trending.length > 0
                ? trending.map((anime: any, index: number) => (
                    <Fade in={true} key={index}>
                      <Grid item={true}>
                        <ButtonBase onClick={this.goToAnime2.bind(this, anime)}>
                          <img
                            className={classes.coverImage}
                            alt=""
                            src={anime.attributes.posterImage.original}
                          />
                        </ButtonBase>
                      </Grid>
                    </Fade>
                  ))
                : [{}, {}, {}].map((e: any, index: number) => (
                    <Grid key={index} item={true}>
                      <Paper className={classes.animeList}>
                        <img className={classes.coverImage} alt="" src="" />
                      </Paper>
                    </Grid>
                  ))}
            </Grid>
            {/*<Paper className={classes.animeList}>
              <List
                style={{
                  flex: 1,
                  maxHeight: 300,
                  overflow: 'scroll',
                  overflowX: 'hidden',
                  scrollBehavior: 'smooth'
                }}
              >
                {this.props.mir.twist.length > 0
                  ? this.props.mir.twist.map((anime: any, index: number) => (
                      <ListItem
                        onClick={this.goToAnime.bind(this, anime)}
                        button={true}
                        key={index}
                      >
                        <ListItemText primary={anime.title} />
                      </ListItem>
                    ))
                  : null}
              </List>
                  </Paper>*/}
          </div>
        </Grid>
      </main>
    );
  }
}

export default compose(
  firestoreConnect()(
    connect(({ mir }: any) => ({
      mir
    }))(withStyles(styles as any)(Home))
  )
);
