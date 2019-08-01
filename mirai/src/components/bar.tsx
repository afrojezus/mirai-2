import React from "react";
import {
    AppBar,
    Drawer,
    IconButton,
    InputBase,
    List,
    ListItem,
    ListItemText,
    ListSubheader,
    Menu,
    Paper,
    Slide,
    Theme,
    Toolbar,
    Typography,
    useScrollTrigger,
    withStyles
} from "@material-ui/core";
import * as MICON from "@material-ui/icons";


import globalStyles from "../globalStyles";

const styles = (theme: Theme) => ({
    hidden: {
        display: "none"
    },
    _barMenu: {
        width: 300,
        padding: 0
    },
    ...globalStyles(theme)
});

function HideOnScroll(props: any) {
    const {children, window} = props;
    const trigger = useScrollTrigger({target: window ? window() : undefined});

    return (
        <Slide appear={false} direction="down" in={!trigger}>
            {children}
        </Slide>
    );
}

class Bar extends React.Component<any> {

    state = {
        notificationsShow: false,
        menu: null,
        top: true
    };

    toggleNotifications = () =>
        this.setState({notificationsShow: !this.state.notificationsShow});

    handleMenu = (event: any) => {
        this.setState({menu: event.currentTarget});
    };


    render() {
        const {notificationsShow, menu} = this.state;
        const {history, classes} = this.props;
        let routeContext: string = "";
        let hidden: boolean = false;
        let transparent: boolean = true;

        switch (history.location.pathname) {
            case "/":
                routeContext = "Home";
                hidden = false;
                break;
            case "/explore":
                routeContext = "Explore";
                hidden = false;
                break;
            case "/sharestreams":
                routeContext = "Sharestreams (Beta)";
                hidden = false;
                break;
            case "/tos":
                routeContext = "Terms of Service";
                hidden = false;
                break;
            case "/social":
                routeContext = "Social";
                hidden = false;
                break;
            case "/anime":
                routeContext = history.location.state.anime
                    ? history.location.state.anime.titles.en_jp
                    : "Anime";
                hidden = false;
                break;
            case "/wiki":
                routeContext = "Wiki";
                hidden = false;
                break;
            case "/doujin":
                routeContext = "🔞";
                hidden = false;
                break;
            case "/account":
                routeContext = "User";
                hidden = false;
                break;
            default:
                routeContext = "404 - Not found";
                hidden = false;
                break;
        }
        return (
            <div className={hidden ? classes.hidden : undefined}>
                <HideOnScroll {...this.props}>
                    <AppBar className={classes.AppBar} style={{
                        background: transparent ? 'transparent' : undefined,
                        boxShadow: transparent ? 'none' : undefined,
                    }}>
                        <Toolbar>
                            <div
                                style={{
                                    flexDirection: "row",
                                    display: "inline-flex"
                                }}
                                onClick={() => history.push("/")}
                            >
                                <div style={{transform: "scale(0.7)"}}>
                                    <Typography className={classes.AppBarTitleTiny}>未</Typography>
                                    <Typography
                                        className={classes.AppBarTitleTiny}
                                        style={{marginTop: -8}}
                                    >
                                        来
                                    </Typography>
                                </div>
                                <Typography variant="h5" className={classes.AppBarTitle}>
                                    MIRAI
                                </Typography>
                            </div>
                            <div
                                style={{
                                    flexDirection: "row",
                                    display: "none" //"inline-flex"
                                }}
                            >
                                <IconButton onClick={() => history.push("explore")}>
                                    <MICON.Explore/>
                                </IconButton>
                                <IconButton onClick={() => history.push("sharestreams")}>
                                    <MICON.Tv/>
                                </IconButton>
                                <IconButton onClick={() => history.push("social")}>
                                    <MICON.People/>
                                </IconButton>
                            </div>
                            {/*<Divider className={classes.AppBarDivider} style={{display: history.location.pathname === '/' ? 'none' : undefined }} />*/}
                            {/*<Typography variant="h6">{routeContext}</Typography>*/}
                            <div style={{flex: 1}}/>
                            <Paper elevation={24} className={classes.paperSearch}>
                                <div className={classes.paperPadding}>
                                    <InputBase
                                        className={classes.paperInput}
                                        placeholder="Search for anime"
                                    />
                                </div>
                            </Paper>
                            <div style={{flex: 1}}/>

                            <IconButton onClick={this.toggleNotifications}>
                                <MICON.Notifications/>
                            </IconButton>
                            <IconButton onClick={this.handleMenu}>
                                <MICON.MoreHoriz/>
                            </IconButton>
                        </Toolbar>
                    </AppBar>
                </HideOnScroll>
                <Drawer
                    anchor="right"
                    open={notificationsShow}
                    onClose={this.toggleNotifications}
                    className={classes.drawer}
                >
                    <List className={classes.drawer}>
                        <ListSubheader>Notifications</ListSubheader>
                        <ListItem button>
                            <ListItemText primary="UwU"/>
                        </ListItem>
                    </List>
                </Drawer>
                <Menu MenuListProps={{className: classes._barMenu}} open={Boolean(menu)} anchorEl={menu}
                      onClose={() => this.setState({menu: null})}>
                    <List>
                        <ListItem style={{paddingTop: 0}}><Typography variant="subtitle1"
                                                                      className={classes.AppBarTitle}>
                            MIRAI
                        </Typography>
                            <div style={{flex: 1}}/>
                            <Typography variant="subtitle1">
                                V2 re:1.0
                            </Typography>
                        </ListItem>
                        <ListItem button>
                            <ListItemText primary={'Login'}/>
                        </ListItem>

                        <ListSubheader>
                            Information
                        </ListSubheader>
                        <ListItem button onClick={() => history.push("/tos")}>
                            <ListItemText primary={'Terms of service'}/>
                        </ListItem>
                        <ListItem button onClick={() => history.push("/pri")}>
                            <ListItemText primary={'Privacy policy'}/>
                        </ListItem>
                        <ListItem button onClick={() => history.push("/faq")}>
                            <ListItemText primary={'FAQ'}/>
                        </ListItem>
                        <ListSubheader>
                            Development
                        </ListSubheader>
                        <ListItem button onClick={() => history.push('404')}>
                            <ListItemText primary={'404'}/>
                        </ListItem>
                        <ListItem button onClick={() => history.push('callback')}>
                            <ListItemText primary={'Callback page'}/>
                        </ListItem>
                        <ListItem button onClick={() => history.push('adm')}>
                            <ListItemText primary={'Administration Room'}/>
                        </ListItem>
                        <ListItem>
                            <Typography
                                style={{
                                    color:
                                        (window as any).theme.palette.type === "dark"
                                            ? "rgba(255,255,255,.5)"
                                            : "rgba(0,0,0,.5)"
                                }}
                            >
                                Mirai V2
                            </Typography>
                            <Typography
                                style={{
                                    marginLeft: 8,
                                    marginRight: 8,
                                    color:
                                        (window as any).theme.palette.type === "dark"
                                            ? "rgba(255,255,255,.12)"
                                            : "rgba(0,0,0,.12)"
                                }}
                            >
                                |
                            </Typography>
                            <Typography
                                style={{
                                    color:
                                        (window as any).theme.palette.type === "dark"
                                            ? "rgba(255,255,255,.5)"
                                            : "rgba(0,0,0,.5)"
                                }}
                            >
                                Developed by MIR
                            </Typography>
                        </ListItem>
                    </List>
                </Menu>
            </div>
        );
    }
}

export default withStyles(styles as any)(Bar);
