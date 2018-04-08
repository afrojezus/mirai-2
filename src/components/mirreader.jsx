import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import { connect } from 'react-redux';

const style = () => ({});

class MirReader extends Component
{
  static propTypes = {};

  static defaultProps = {};

  constructor(props)
  {
    super(props);
    this.state = {
      recentlyRead: Date.now(),
    };
  }
  componentWillMount = () =>
  {};

  componentDidMount = () =>
  {};

  render()
  {
    return <div />;
  }
}

export default connect(state => state)(withStyles(style)(MirReader));
