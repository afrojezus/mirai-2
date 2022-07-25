import { colors, createTheme, CssBaseline, ThemeProvider, useMediaQuery } from '@mui/material';
import { useMemo, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useAppSelector } from './common/hooks';
import Layout from './features/layout/Layout';
import Account from './pages/Account';
import Anime from './pages/Anime';
import Explore from './pages/Explore';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Watch from './pages/Watch';

function App() {
  const backgroundUserImage = useAppSelector((state) => state.layout.backgroundUserImage);
  const colorScheme = useAppSelector((state) => state.layout.colorScheme);
  const scheme = useAppSelector((state) => state.layout.material3Scheme);
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const dark = useMemo(() => colorScheme ? colorScheme === 'dark' : prefersDarkMode, [prefersDarkMode, colorScheme]);
  const theme = useMemo(
    () => {
      return createTheme({
        palette: {
          mode: colorScheme ? colorScheme : prefersDarkMode ? 'dark' : 'light',
          ...((scheme && backgroundUserImage) ? {
            common: {
              black: dark ? (scheme.dark.background as unknown as string) : (scheme.light.onBackground as unknown as string),
              white: dark ? (scheme.dark.onBackground as unknown as string) : (scheme.light.background as unknown as string)
            },
            primary: {
              light: (scheme.light.primary as unknown as string),
              main: dark ? (scheme.dark.primary as unknown as string) : (scheme.light.primary as unknown as string),
              dark: (scheme.dark.primary as unknown as string),
            },
            secondary: {
              light: (scheme.light.secondary as unknown as string),
              main: dark ? (scheme.dark.secondary as unknown as string) : (scheme.light.secondary as unknown as string),
              dark: (scheme.dark.secondary as unknown as string),
            },
            text: {
              primary: dark ? (scheme.dark.onPrimaryContainer as unknown as string) : (scheme.light.onPrimaryContainer as unknown as string),
              secondary: dark ? (scheme.dark.onSecondaryContainer as unknown as string) : (scheme.light.onPrimaryContainer as unknown as string),
            },
            background: {
              default: dark ? (scheme.dark.surfaceVariant as unknown as string) : (scheme.light.surfaceVariant as unknown as string),
              paper: dark ? (scheme.dark.background as unknown as string) : (scheme.light.background as unknown as string)
            },
            grey: dark ? (scheme.dark.onPrimaryContainer as unknown as string) : (scheme.light.onPrimaryContainer as unknown as string)
          } : {
            secondary: {
              light: colors.blueGrey[50],
              main: colors.blueGrey.A400,
              dark: colors.blueGrey[900]
            },
            background: {
              default: dark ? colors.blueGrey[900] : colors.blue[50],
              paper: dark ? colors.blueGrey[800] : colors.grey[50]
            }
          }),
        },
        shape: {
          borderRadius: 16
        },
        typography: {
          fontFamily: "'Inter', sans-serif"
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none'
              }
            }
          },
          MuiDialog: {
            styleOverrides: {
              paper: {
                '& > .MuiAppBar-root': {
                  background: 'transparent'
                }
              }
            }
          },
          MuiListItemAvatar: {
            styleOverrides: {
              root: {
                '& > img': {
                  borderRadius: 16
                }
              }
            }
          },
          MuiListSubheader: {
            styleOverrides: {
              root: {
                background: 'transparent'
              }
            }
          },
          MuiListItemButton: {
            styleOverrides: {
              root: {
                borderRadius: 16
              }
            }
          },
          MuiListItemText: {
            styleOverrides: {
              secondary: {
                whiteSpace: 'pre-wrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }
            }
          }
        }
      });
    },
    [prefersDarkMode, backgroundUserImage, scheme, colorScheme],
  );

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="watch" element={<Watch />} />
            <Route path="explore" element={<Explore />}>

            </Route>
            <Route path="anime">
              <Route path=":id" element={<Anime />} />
            </Route>
            <Route path="account" element={<Account />}></Route>
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
