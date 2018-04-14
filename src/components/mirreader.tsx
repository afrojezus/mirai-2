import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import { connect } from 'react-redux';

const style = (theme: any) => ({

});

class MirReader extends Component<any, any> {
    static propTypes = {

    };

    static defaultProps = {

    };

    constructor(props: any) {
        super(props);
        this.state = {
            recentlyRead: Date.now()
        };
    }


    render() {
        return (
            <div></div>
        )
    }
}

export default connect(state => state)(withStyles(style as any)(MirReader));