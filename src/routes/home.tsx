import {
  // Divider,
  Grid,
  // LinearProgress,
  // List,
  // ListItem,
  // ListItemText,
  List,
  ListItem,
  ListItemText,
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
    marginTop: theme.spacing.unit,
    background: 'rgba(255,255,255,.05)',
    border: '1px solid rgba(255,255,255,.1)',
    boxShadow: 'none',
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
  // ...load the global styles as well
  ...globalStyles(theme)
});

// Index page route for the application, load through router.
class Home extends React.Component<any> {
  public state = {
    searchVal: '',
    animes: this.props.mir.twist
  };

  constructor(props: any) {
    super(props);
  }

  public handleChangeText = (event: any) =>
    this.setState({ searchVal: event.target.value });
  public handleSubmit = (event: any) => {
    event.preventDefault();
  };
  public sortByTitle = (a: any, b: any) => {
    const titleA = a.title;
    const titleB = b.title;

    if (titleA < titleB) {
      return -1;
    }
    if (titleA > titleB) {
      return 1;
    }
    return 0;
  };
  public searchFilter = (anime: any) => {
    const search = this.state.searchVal.toLowerCase().trim();
    const searchSplits = search.split(/[^a-z0-9]/i).filter(split => !!split);
    const clonedAnime = { ...anime };

    const title = clonedAnime.title.toLowerCase();

    let match = false;

    if (search.length === 1) {
      match = search.charAt(0) === title.charAt(0);
    } else if (searchSplits.length === 0) {
      match = true;
    } else if (search === 'ongoing') {
      match = !!clonedAnime.ongoing;
    } else {
      match = !searchSplits.find(split => title.indexOf(split) === -1);
    }

    clonedAnime.filteredOut = !match;
    return clonedAnime;
  };

  public goToAnime = (id: number) => this.props.history.push(`/anime?id=${id}`);

  public render() {
    const { classes } = this.props;
    const { searchVal } = this.state;
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
            src="http://storage.csgoani.me/uploads/prxqis.webm"
            className={classes.bannerImage}
          />
          <div
            className={classes.innerMargin}
            style={{ margin: 'auto', paddingBottom: 128 }}
          >
            <div style={{ display: 'inline-flex', width: '100%' }}>
              <Typography variant="h2" className={classes.title}>
                Mirai
              </Typography>
              <Typography
                variant="headline"
                style={{ textAlign: 'right', width: '100%', margin: 'auto' }}
              >
                Stream anime without any of the bullshit.
              </Typography>
            </div>
            <div className={classes.searchMargin}>
              <Searchbar
                value={searchVal}
                change={this.handleChangeText}
                submit={this.handleSubmit}
              />
            </div>
            <Paper className={classes.animeList}>
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
                        onClick={this.goToAnime.bind(this, anime.kitsu)}
                        button={true}
                        key={index}
                      >
                        <ListItemText primary={anime.title} />
                      </ListItem>
                    ))
                  : null}
              </List>
            </Paper>
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
