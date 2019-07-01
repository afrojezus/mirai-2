import { Theme, colors } from '@material-ui/core';

export const realShadow: string = 'rgba(0,0,0,.12)';
export const realBoxShadow: string = '0 6pt 36pt rgba(0,0,0,.12)';
export const realNearBoxShadow: string = '0 1pt 12pt rgba(0,0,0,.16)';

export const realHoverBoxShadow: string = '0 4pt 12pt rgba(0,0,0,.2)';

export const realBorderRadius: number = 10;

export default (theme: Theme) => ({
  AppBar: {
    background: theme.palette.type === 'dark' ? colors.grey[900] : 'white'
  },
  AppBarNOBG: {
    background: 'transparent',
    boxShadow: 'none'
  },
  AppBarTitle: {
    fontWeight: 700,
    marginRight: theme.spacing.unit * 2,
    fontFamily: `Raleway, 'sans-serif'`,
    letterSpacing: 3,
    cursor: 'pointer'
  },
  AppBarMenu: {
    marginLeft: -12,
    marginRight: 20
  },
  AppBarDivider: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit * 2,
    height: 32,
    borderRight: `${1}px solid ${
      theme.palette.type === 'dark'
        ? 'rgba(255,255,255,.12)'
        : 'rgba(0,0,0,.12)'
    }`
  },
  MainContainer: {
    marginLeft: 'auto',
    marginRight: 'auto',
    maxWidth: 800,
    marginTop: theme.spacing.unit * 8
  },
  largeTitle: {
    fontSize: 48,
    fontWeight: 700
  },
  largeToolbar: {
    paddingTop: theme.spacing.unit * 4,
    paddingBottom: theme.spacing.unit * 4
  },
  paperBlock: {
    boxShadow: realBoxShadow,
    borderRadius: 0,
    minHeight: 50,
    minWidth: '100%',
    overflow: 'hidden',
    animation: 'SplashPaperIntro 0.4s ease'
  },
  paperBlockMini: {
    boxShadow: realBoxShadow,
    borderRadius: 0,
    height: 32,
    minWidth: 200,
    overflow: 'hidden',
    marginRight: theme.spacing.unit,
    animation: 'SplashPaperIntro 0.4s ease'
  },
  paperPaddingMini: {},
  paperPadding: {
    padding: theme.spacing.unit
  },
  paperInput: {
    marginLeft: 8,
    flex: 1,
    width: 'calc(100% - 8px)'
  },
  drawer: {
    width: 200,
    height: '100%'
  },
  containerBgImg: {
    objectFit: 'cover',
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
    zIndex: -10000,
    animation: 'BgIntro 0.4s ease',
    willChange: 'auto'
  },
  specialTitle: {
    fontFamily: `Raleway, 'sans-serif'`,
    letterSpacing: 3,
    textTransform: 'uppercase'
  }
});
