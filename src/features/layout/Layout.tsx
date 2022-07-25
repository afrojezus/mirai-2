import { AppBar, Avatar, BottomNavigation, BottomNavigationAction, Box, Button, Dialog, Drawer, IconButton, List, Menu, Modal, Paper, SwipeableDrawer, Toolbar, Typography, useMediaQuery } from "@mui/material";
import * as Icons from '@mui/icons-material';
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import NavigationRail from "../../common/components/NavigationRail/NavigationRail";
import NavigationRailAction from "../../common/components/NavigationRail/NavigationRailAction";
import { SyntheticEvent, useCallback, useEffect, useState } from "react";
import SearchInput from "../../common/components/SearchInput";
import SettingsMenu from "../../common/components/SettingsMenu";
import { useAppDispatch, useAppSelector } from "../../common/hooks";
import clsx from "clsx";
import { motion } from "framer-motion";
import WhiteSpace from "../../common/components/WhiteSpace";
import Player from "../player/Player";
import { miniturizePlayer, showPlayer } from "../player/playerSlice";

function Layout() {
    const user = useAppSelector((state) => state.layout.user);
    const backgroundUserImage = useAppSelector((state) => state.layout.backgroundUserImage);
    const playerState = useAppSelector((state) => state.player);
    const dispatch = useAppDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const isMobile = useMediaQuery('(max-width: 480px)');
    const [pageNames] = useState([
        { display: 'Home', href: '/' },
        { display: 'Explore', href: 'explore' },
        { display: 'Updates', href: 'updates' },
        { display: 'You', href: 'account' },
        { display: 'Anime', href: 'anime' },
        { display: '', href: '' }, // white space
        { display: 'Player', href: 'watch' }
    ]);
    const [currentPage, setCurrentPage] = useState(pageNames.map(x => x.href).indexOf(location.pathname === '/' ? location.pathname : location.pathname.replace('/', '').split('/')[0]));
    const [drawer, openDrawer] = useState(false);
    const [settings, openSettings] = useState(false);
    const onNavClick = useCallback((_: SyntheticEvent<Element, Event>, v: number) => {
        setCurrentPage(v);
        navigate(pageNames[v].href);
    }, [currentPage]);
    const pageMotion = {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
        exit: { opacity: 0, y: 0, transition: { duration: 0.3 } }
    };

    useEffect(() => {
        if (playerState.active) {
            dispatch(miniturizePlayer(!location.pathname.includes('watch')));
        } else {
            dispatch(showPlayer(location.pathname.includes('watch')));
        }

        setCurrentPage(pageNames.map(x => x.href).indexOf(location.pathname === '/' ? location.pathname : location.pathname.replace('/', '').split('/')[0]));
    }, [location.pathname, playerState.active]);

    return <>
        <img id="app-bg" src={backgroundUserImage} alt='' className={clsx("app-bg", !backgroundUserImage && "invisible")} />
        <AppBar sx={{ boxShadow: 'none' }} color="transparent" position="fixed">
            <Toolbar>
                <IconButton onClick={() => openDrawer(!drawer)} color="inherit" sx={(theme) => ({
                    marginLeft: theme.spacing(-1),
                    marginRight: isMobile ? theme.spacing(2) : theme.spacing(4)
                })} edge="start">
                    <Icons.Menu />
                </IconButton>
                {!isMobile && <><Typography component="div" sx={(theme) => ({
                    marginRight: theme.spacing(2),
                    fontWeight: 700,
                    letterSpacing: 5
                })} variant="h6" noWrap>
                    MIRAI
                </Typography>
                    <Typography component="div" sx={(theme) => ({
                        flex: 1,
                        color: theme.palette.text.secondary
                    })} variant="h6" noWrap>
                        {pageNames[currentPage].display}
                    </Typography></>}
                <SearchInput sx={(theme) => ({
                    mr: 2
                })} />
                <IconButton color="inherit" onClick={() => openSettings(true)}>
                    <Icons.Settings />
                </IconButton>
            </Toolbar>
        </AppBar>
        <Box sx={(theme) => ({
            display: 'inline-flex',
            flex: 1,
            '& > .MuiBottomNavigation-root': {
                top: `${theme.mixins.toolbar.minHeight}px`
            },
            maxHeight: 'inherit'
        })}>
            {!isMobile && <NavigationRail disableDivider value={currentPage} onChange={onNavClick}>
                <NavigationRailAction visible label="Home" icon={<Icons.Home />} />
                <NavigationRailAction visible label="Explore" icon={<Icons.Explore />} />
                <NavigationRailAction visible label="Updates" icon={<Icons.Update />} />
                <NavigationRailAction visible label="You" icon={user ? <Avatar sx={{ width: 32, height: 32 }} src={user.avatar} alt="U" /> : <Icons.AccountCircle />} />
                <NavigationRailAction visible={currentPage === 4} label="Anime" icon={<Icons.Movie />} />
                <WhiteSpace />
                <NavigationRailAction visible label="Player" icon={<Icons.PlayArrow />} />
            </NavigationRail>}
            <motion.div
                initial="initial" animate="animate" exit="exit" variants={pageMotion}
                style={{ display: 'inherit', flexFlow: 'inherit', width: '100%', maxHeight: 'inherit' }}
                key={location.pathname}
            >
                <Outlet />
            </motion.div>
        </Box>
        {isMobile && <BottomNavigation sx={(theme) => ({
            background: 'transparent',
            position: 'fixed',
            bottom: 0,
            width: '100%'
        })} showLabels value={currentPage} onChange={onNavClick}>
            <BottomNavigationAction label="Home" icon={<Icons.Home />} />
            <BottomNavigationAction label="Explore" icon={<Icons.Explore />} />
            <BottomNavigationAction label="Updates" icon={<Icons.Update />} />
            <BottomNavigationAction label="You" icon={user ? <Avatar sx={{ width: 24, height: 24 }} src={user.avatar} alt="U" /> : <Icons.AccountCircle />} />
        </BottomNavigation>}
        <SwipeableDrawer
            anchor="left"
            open={drawer}
            onClose={() => openDrawer(false)}
            onOpen={() => openDrawer(true)}
            sx={(theme) => ({
                '& > .MuiPaper-root': {
                    boxShadow: 'none',
                    borderTopRightRadius: theme.shape.borderRadius,
                    borderBottomRightRadius: theme.shape.borderRadius
                }
            })}
        >
            <Toolbar>
                <IconButton onClick={() => openDrawer(!drawer)} color="inherit" sx={(theme) => ({
                    marginLeft: theme.spacing(-1),
                    marginRight: theme.spacing(4)
                })} edge="start">
                    <Icons.MenuOpen />
                </IconButton>
                <Typography sx={(theme) => ({
                    marginRight: theme.spacing(2),
                    fontWeight: 700,
                    letterSpacing: 5
                })} variant="h6" noWrap>
                    MIRAI
                </Typography>
            </Toolbar>
            <List>

            </List>
        </SwipeableDrawer>
        <Dialog scroll="paper" fullScreen={isMobile} sx={(theme) => ({
            '& > * > .MuiPaper-root': {
                boxShadow: 'none'
            }
        })} open={settings} onClose={() => openSettings(false)}>
            <AppBar color="inherit" sx={{ boxShadow: 'none' }} position="relative">
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={() => openSettings(false)}
                        aria-label="close"
                    >
                        <Icons.Close />
                    </IconButton>
                    <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        Settings
                    </Typography>
                    <Button autoFocus color="inherit" onClick={() => openSettings(false)}>
                        Save
                    </Button>
                </Toolbar>
            </AppBar>
            <SettingsMenu />
        </Dialog>

        <Player />
    </>;
}

export default Layout;