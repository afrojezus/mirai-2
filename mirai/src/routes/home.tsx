import React from 'react';
import { withStyles, Theme } from '@material-ui/core';
import globalStyles from '../globalStyles';

const styles = (theme: Theme) => ({
  ...globalStyles(theme)
});

class Home extends React.Component<any> {
  public render() {
    return <div />;
  }
}

export default withStyles(styles as any)(Home);
