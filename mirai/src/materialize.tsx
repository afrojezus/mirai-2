import React from 'react';
import {
  MuiThemeProvider,
  createMuiTheme,
  colors,
  CssBaseline
} from '@material-ui/core';
import { realBoxShadow, realNearBoxShadow } from './globalStyles';

let themeType: 'light' | 'dark' | undefined = 'dark';
(window as any).color = themeType;

// A theme with custom primary and secondary color.
// It's optional.
const theme = createMuiTheme({
  palette: {
    type: (window as any).color,
    primary: {
      light: colors.blue[300],
      main: colors.blue[500],
      dark: colors.blue[700]
    },
    secondary: {
      light: colors.blue[300],
      main: colors.blue[500],
      dark: colors.blue[700]
    },
    background: {
      //paper: colors.grey[50],
      //default: colors.grey[50]
    }
  },
  typography: {
    useNextVariants: true,
    fontFamily: 'SF UI Display'
  },
  overrides: {
    MuiAppBar: {
      root: {
        boxShadow: realNearBoxShadow,
        animation: 'AppBarIntro 0.4s ease'
      }
    },
    MuiFab: {
      root: {
        boxShadow: realBoxShadow,
        borderRadius: 0
      }
    }
  }
});

(window as any).theme = theme;

function withRoot(Component: any) {
  function WithRoot(props: any) {
    // MuiThemeProvider makes the theme available down the React tree
    // thanks to React context.
    return (
      <MuiThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Component {...props} />
      </MuiThemeProvider>
    );
  }

  return WithRoot;
}

export default withRoot;
