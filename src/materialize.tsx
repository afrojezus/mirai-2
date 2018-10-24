import {
  colors,
  createMuiTheme,
  CssBaseline,
  MuiThemeProvider
} from '@material-ui/core';
import * as React from 'react';

// A theme with custom primary and secondary color.
// It's optional.
const theme = createMuiTheme({
  palette: {
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
    type: 'dark',
    background: {
      paper: colors.grey[900],
      default: colors.grey[900]
    }
  },
  typography: {
    useNextVariants: true,
    fontFamily: 'CircularStd'
  }
});

// materialize ensures the components in the application follows the MUI theme. TODO: Fix the type later.
function materialize(Component: any) {
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

export default materialize;
