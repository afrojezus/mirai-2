import './anime.css';

export default theme => ({
  appBar: {
    backgroundColor:
      window.theme.palette.type === 'dark'
        ? 'rgba(0,0,0,.8)'
        : 'rgba(255,255,255,.8)',
  },
  section: {
    padding: '0 2em',
    paddingBottom: '2em',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden',
    boxSizing: 'border-box',
    '&:last-of-type': {
      paddingBottom: '2em',
    },
  },
  title: {
    letterSpacing: -3,
    fontWeight: 700,
    padding: '2em',
    margin: '0 auto',
    color: 'white',
    boxSizing: 'border-box',
  },
  memeBannerImg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: '100%',
    width: '100%',
    zIndex: -1,
    filter: 'brightness(0.5)',
    transition: theme.transitions.create(['all']),
    objectFit: 'cover',
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
  },
  cardHeaderTitle: {
    fontSize: 14,
    fontWeight: 600,
  },
  drawer: {
    width: 250,
  },
  appDrawerToolbar: {
    borderBottom: '1px solid rgba(0,0,0,.1)',
    padding: '1em',
    display: 'flex',
    flexDirection: 'column',
  },
  cardShowMore: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: 300 + 69,
  },
  searchBar: {
    backgroundColor: 'rgba(0,0,0,.1)',
    borderRadius: 4,
    padding: '0 1em',
  },
  searchBarContainer: {
    maxWidth: 500,
    padding: '0 1em',
  },
});
