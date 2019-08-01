import React from 'react';
import {colors, createMuiTheme, CssBaseline, MuiThemeProvider} from '@material-ui/core';
import {realBoxShadow, realNearBoxShadow} from './globalStyles';
import {Palette} from 'node-vibrant/lib/color';

const themeColor = localStorage.getItem("theme_color") ? localStorage.getItem("theme_color") : "light";
(window as any).color = themeColor;

const pal: Palette = localStorage.getItem('bg_accent') ? JSON.parse(localStorage.getItem('bg_accent') as string) : null;

// let mutedAccent = pal && pal.Muted && pal.Muted.rgb;
let darkMAccent = pal && pal.DarkMuted && pal.DarkMuted.rgb;
let darkVAccent = pal && pal.DarkVibrant && pal.DarkVibrant.rgb;
let lightMAccent = pal && pal.LightMuted && pal.LightMuted.rgb;
let lightVAccent = pal && pal.LightVibrant && pal.LightVibrant.rgb;
let vibrantAccent = pal && pal.Vibrant && pal.Vibrant.rgb;

// A theme with custom primary and secondary color.
// It's optional.
const theme = createMuiTheme({
    palette: {
        type: (window as any).color,
        primary: {
            light: lightVAccent ? `rgb(${lightVAccent[0] + ',' + lightVAccent[1] + ',' + lightVAccent[2]})` : colors.blue[300],
            main: vibrantAccent ? `rgb(${vibrantAccent[0] + ',' + vibrantAccent[1] + ',' + vibrantAccent[2]})` : colors.blue[500],
            dark: darkVAccent ? `rgb(${darkVAccent[0] + ',' + darkVAccent[1] + ',' + darkVAccent[2]})` : colors.blue[700]
        },
        secondary: {
            light: colors.blue[300],
            main: colors.blue[500],
            dark: colors.blue[700]
        },
        background: {
            paper: (window as any).color === 'light' && lightMAccent ? `rgb(${lightMAccent[0] + ',' + lightMAccent[1] + ',' + lightMAccent[2]})` : darkMAccent ? `rgb(${darkMAccent[0] + ',' + darkMAccent[1] + ',' + darkMAccent[2]})` : (window as any).color === 'light' ? colors.grey[50] : colors.grey[900],
            default: (window as any).color === 'light' && lightMAccent ? `rgb(${lightMAccent[0] + ',' + lightMAccent[1] + ',' + lightMAccent[2]})` : darkMAccent ? `rgb(${darkMAccent[0] + ',' + darkMAccent[1] + ',' + darkMAccent[2]})` : (window as any).color === 'light' ? colors.grey[100] : colors.grey[800],
        }
    },
    typography: {
        fontFamily: 'SF UI Display',
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
        },
        MuiCard: {
            root: {
                borderRadius: 0,
                boxShadow: realNearBoxShadow
            }
        },
        MuiPaper: {
            root: {
                borderRadius: 0,
                boxShadow: realNearBoxShadow
            }
        },
        MuiTooltip: {
            tooltip: {
                fontSize: 14
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
                <CssBaseline/>
                <Component {...props} />
            </MuiThemeProvider>
        );
    }

    return WithRoot;
}

export default withRoot;
