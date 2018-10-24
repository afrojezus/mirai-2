// Global MUI styles for all components to impose consistency.
export default (theme: any) => ({
  appBar: {
    boxShadow: 'none',
    background: 'transparent'
  },
  grid: {
    flexDirection: 'column'
  },
  bannerToolbarBG: {
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    paddingTop: theme.mixins.toolbar.minHeight * 1.15
  },
  bannerGrid: {
    padding: theme.spacing.unit * 8,
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    paddingTop: theme.mixins.toolbar.minHeight * 2
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    position: 'absolute',
    filter: 'brightness(0.2) grayscale(1) contrast(1.2)',
    top: 0,
    left: 0,
    zIndex: -1,
    background: 'rgba(0,0,0,1)'
  },
  bannerVideo: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    filter: 'brightness(0.4) blur(20px)',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: -2
  },
  bannerButtons: {
    marginTop: theme.spacing.unit * 4
  },
  section: {
    width: '100%'
  },
  sectionTitle: {
    padding: `${theme.spacing.unit * 4}px 0`
  },
  sectionGrid: {},
  innerMargin: {
    maxWidth: 800,
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '100%'
  }
});
