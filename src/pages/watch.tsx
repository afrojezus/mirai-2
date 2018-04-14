import React, { Component } from 'react';
import withStyles from 'material-ui/styles/withStyles';
import { connect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';
import { scrollFix } from './../utils/scrollFix';

const style = theme => ({
	root: {
		height: '100vh',
		width: '100%',
		position: 'relative',
		top: 0,
		left: 0,
		overflow: 'hidden',
	},
});

class Watch extends Component {
	state = {};

	componentWillMount = () => {
		scrollFix();
	};

	componentDidMount = () => {
		if (this.props.mir.play) {
		document.title = `Mirai - Watching ${
			this.props.mir.play.meta.title.romaji}`;
		} else {
			return this.props.history.goBack();
		}
	};
	componentWillUnmount = () => {
		document.title = `Mirai`;
	};

	render() {
		const { classes } = this.props;
		return <div id="frame" className={classes.root} />;
	}
}

export default firebaseConnect()(
	connect(({ firebase: { profile }, mir }) => ({ profile, mir }))(
		withStyles(style)(Watch)
	)
);
