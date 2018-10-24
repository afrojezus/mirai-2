import { Paper, TextField, withStyles } from '@material-ui/core';
import * as MICON from '@material-ui/icons';
import React from 'react';
import globalStyles from 'src/globalStyles';

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
  public render() {
    const { classes, submit, change, value } = this.props;
    return (
      <div>
        <Paper className={classes.searchBar}>
          <MICON.SearchOutlined className={classes.searchIcon} />
          <form onSubmit={submit} style={{ width: '100%' }}>
            <TextField
              autoFocus={true}
              onChange={change}
              fullWidth={true}
              value={value}
              placeholder={'Search'}
              InputProps={{
                className: classes.searchInput,
                disableUnderline: true,
                fullWidth: true
              }}
              type="search"
            />
          </form>
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles as any)(SearchBar);
