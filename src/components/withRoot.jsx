/* eslint-disable flowtype/require-valid-file-annotation */

import React from "react";
import { MuiThemeProvider, createTheme } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { blue } from "@material-ui/core/colors/index";

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
const theme = createTheme({
  palette: {
    primary: getColors()
      ? {
        main: getColors().hueAccent
          ? getColors().hueAccent
          : getColors().hueVibN ? getColors().hueVibN : blue
      }
      : blue,
    secondary: blue,
    type: "dark",
    background: {
      default: "#111",
      paper: "#111",
      appBar: "#111",
      contentFrame: "#eeeeee"
    },
    contrastThreshold: 3
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
        "-webkitAppRegion": "no-drag",
        textTransform: "none"
      },
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
if (process.browser) {
  window.theme = theme;
}

function withRoot(Component) {
  function WithRoot(props) {
    // MuiThemeProvider makes the theme available down the React tree
    // thanks to React context.
    return (
      <MuiThemeProvider theme={theme}>
        {/* Reboot kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Component {...props} />
      </MuiThemeProvider>
    );
  }

  return WithRoot;
}

export default withRoot;
