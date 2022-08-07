import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';

const style = theme => ({

});

class MirReader extends Component {
    static propTypes = {

    };

    static defaultProps = {

    };

    constructor(props) {
        super(props);
        this.state = {
            recentlyRead: Date.now()
        };
    }
    componentWillMount = () => {

    };


    componentDidMount = () => {

    };


    componentWillReceiveProps = (nextProps) => {

    };


    render() {
        return (
            <div></div>
        );
    }
}

export default connect(state => state)(withStyles(style)(MirReader));