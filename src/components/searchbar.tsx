import {List, ListItem, ListItemText, Paper, Popper, TextField, withStyles} from '@material-ui/core';
import * as MICON from '@material-ui/icons';
import React from 'react';
import {connect} from 'react-redux';
import {firestoreConnect} from 'react-redux-firebase';
import {compose} from 'redux';
import globalStyles from 'src/globalStyles';
import {history} from 'src/store';

const styles = (theme: any) => ({
    searchBar: {
        ['-webkitAppRegion']: 'no-drag',
        background: 'rgba(255,255,255,.05)',
        border: '1px solid rgba(255,255,255,.1)',
        boxShadow: 'none',
        maxWidth: 1970,
        minWidth: 300,
        display: 'flex',
        transition: theme.transitions.create(['all']),
        '&:hover': {
            background: 'rgba(255,255,255,.08)',
            border: '1px solid rgba(255,255,255,.15)'
        },
        '&:focus': {
            background: 'rgba(255,255,255,.08)',
            border: '1px solid rgba(255,255,255,.15)'
        },
        margin: 'auto'
    },
    searchInput: {
        padding: theme.spacing.unit / 2,
        boxSizing: 'border-box'
    },
    searchIcon: {
        paddingLeft: theme.spacing.unit * 2,
        paddingRight: theme.spacing.unit * 2,
        margin: 'auto 0',
        width: 'auto',
        color: 'white'
    },
    ...globalStyles(theme)
});

class SearchBar extends React.Component<any> {
    public state = {
        searchVal: ''
    };
    private popperNode: any = null;
    public handleChangeText = (event: any) =>
        this.setState({searchVal: event.target.value});
    public handleSubmit = (event: any) => {
        event.preventDefault();
    };
    public sortByTitle = (a: any, b: any) => {
        const titleA = a.title;
        const titleB = b.title;

        if (titleA < titleB) {
            return -1;
        }
        if (titleA > titleB) {
            return 1;
        }
        return 0;
    };
    public searchFilter = (anime: any) => {
        const search = this.state.searchVal.toLowerCase().trim();
        const searchSplits = search.split(/[^a-z0-9]/i).filter(split => !!split);
        const clonedAnime = {...anime};

        const title = clonedAnime.title.toLowerCase();

        let match = false;

        if (search.length === 1) {
            match = search.charAt(0) === title.charAt(0);
        } else if (searchSplits.length === 0) {
            match = true;
        } else if (search === 'ongoing') {
            match = !!clonedAnime.ongoing;
        } else {
            match = !searchSplits.find(split => title.indexOf(split) === -1);
        }

        clonedAnime.filteredOut = !match;
        return clonedAnime;
    };
    public goToAnime = (anime: any) =>
        this.setState({searchVal: ''}, () =>
            history.push(`/anime?id=${anime.kitsu}`, {anime})
        );

    public render() {
        const {classes, style} = this.props;
        return (
            <div style={style}>
                <Paper className={classes.searchBar}>
                    <MICON.SearchOutlined className={classes.searchIcon}/>
                    <form onSubmit={this.handleSubmit} style={{width: '100%'}}>
                        <TextField
                            autoFocus={true}
                            onChange={this.handleChangeText}
                            fullWidth={true}
                            value={this.state.searchVal}
                            placeholder={'Search'}
                            InputProps={{
                                className: classes.searchInput,
                                disableUnderline: true,
                                fullWidth: true
                            }}
                            // tslint:disable-next-line:jsx-no-lambda
                            inputRef={(node: Node) => (this.popperNode = node)}
                            type="search"
                        />
                    </form>
                </Paper>
                <Popper
                    style={{
                        maxWidth: 960,
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        transition: 'none'
                    }}
                    anchorEl={this.popperNode}
                    open={Boolean(this.state.searchVal)}
                >
                    <Paper>
                        <List
                            style={{
                                flex: 1,
                                overflow: 'scroll',
                                overflowX: 'hidden',
                                scrollBehavior: 'smooth'
                            }}
                        >
                            {this.props.mir.twist.length > 0
                                ? this.props.mir.twist
                                    .map(this.searchFilter)
                                    .sort(this.sortByTitle)
                                    .filter((anime: any) => !anime.filteredOut)
                                    .splice(0, 8)
                                    .map((anime: any, index: number) => (
                                        <ListItem
                                            onClick={this.goToAnime.bind(this, anime)}
                                            button={true}
                                            key={index}
                                        >
                                            <ListItemText primary={anime.title}/>
                                        </ListItem>
                                    ))
                                : null}
                        </List>
                    </Paper>
                </Popper>
            </div>
        );
    }
}

export default compose(
    firestoreConnect()(
        connect(({mir}: any) => ({
            mir
        }))(withStyles(styles as any)(SearchBar))
    )
);
