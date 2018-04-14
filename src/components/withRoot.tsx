/* eslint-disable flowtype/require-valid-file-annotation */

import React, { ReactElement } from "react";
import { MuiThemeProvider, createMuiTheme } from "material-ui/styles";
import CssBaseline from "material-ui/CssBaseline";
import { blue } from "material-ui/colors/index";

// If the user has opted a background, apply the hues as accent color etc.
const getColors = () => {
  const hue = localStorage.getItem("user-hue");
  if (hue) {
    let hues = JSON.parse(hue);
    return {
      hue: hues.hue,
      hueVib: hues.hueVib,
      hueVibN: hues.hueVibN,
      hueAccent: hues.hueAccent
    };
  } else {
    return null;
  }
};

// Apply some reset
const theme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: blue,
    type: "dark",
    background: {
      default: "#111",
      paper: "#111",
    },
  },
  typography: {
    // Use the system font.
    fontFamily:
      "BlinkMacSystemFont, -apple-system, 'SF Display', 'Segoe UI', 'Roboto', 'Ubuntu', 'Arial'",
    fontSize: 16
  },
  overrides: {
    MuiTypography: {
      body1: {
        fontSize: 16
      }
    },
    MuiTooltip: {
      tooltipPlacementBottom: {
        fontSize: 14
      },
      tooltipPlacementTop: {
        fontSize: 14
      }
    },
    MuiButton: {
      root: {
        "-webkitAppRegion": "no-drag"
      }
    },
    MuiIconButton: {
      root: {
        "-webkitAppRegion": "no-drag"
      }
    },
    MuiTab: {
      root: {
        "-webkitAppRegion": "no-drag"
      }
    },
    MuiBackdrop: {
      root: {
        "-webkitAppRegion": "no-drag"
      }
    },
    MuiInput: {
      root: {
        "-webkitAppRegion": "no-drag"
      }
    }
  }
});
// Expose the theme as a global variable so people can play with it.
if (process['browser']) {
  window['theme'] = theme;
}

function withRoot(Component: any) {
  function WithRoot(props: any) {
    // MuiThemeProvider makes the theme available down the React tree
    // thanks to React context.
    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...props} />
      </MuiThemeProvider>
    );
  }

  return WithRoot;
}

export default withRoot;
