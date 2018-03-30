// TODO: Fix every single eslint-airbnb issue
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import * as M from 'material-ui';
import * as Icon from 'material-ui-icons';
import spaceBgEmpty from '../assets/monika/monika_room.png';
import monispace from '../assets/monika/monika_bg.png';
import moniscare from '../assets/monika/monika_scare.png';
import textbox from '../assets/monika/textbox.png';
import moni from './monikastuff';
import { history } from '../store';

const style = theme => ({
	root: {
		height: '100vh',
		width: '100%',
		position: 'relative'
	},
	bgImage: {
		position: 'fixed',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		opacity: 1,
		height: '100vh',
		objectFit: 'cover',
		width: '100%',
		zIndex: -1,
		transition: theme.transitions.create(['all'])
	},
	content: {
		marginLeft: 'auto',
		marginRight: 'auto',
		padding: 24,
		maxWidth: 1200,
		paddingTop: theme.spacing.unit * 8,
		[theme.breakpoints.up('md')]: {
			maxWidth: 'calc(100% - 64px)'
		}
	},
	dialogue: {
		position: 'fixed',
		background: `url(${textbox}) no-repeat center center`,
		bottom: theme.spacing.unit * 8,
		boxShadow: '0 2px 32px rgba(0,0,0,.3)',
		width: 816,
		left: '50%',
		transform: 'translateX(-50%)',
		height: 146,
		borderRadius: 8,
		transition: theme.transitions.create(['all'])
	},
	text: {
		fontWeight: 700,
		fontSize: 20,
		fontFamily: 'Aller',
		textShadow: '0 0 12px rgba(0,0,0,.3)'
	},
	buttonbar: {
		position: 'absolute',
		bottom: 0,
		width: '100%'
	}
});

class Monika extends Component {

	state = {
		dialog: '',
		wait: false,
		img: true,
		scare: false
	};

	componentWillMount = () => {
		this.setState({ dialog: moni[0][0], text: 0, topic: 0 });
	};

	next = () => {
		if (this.state.text + 1 > moni[this.state.topic].length) {
			this.setState({ dialog: '', wait: true });
			setTimeout(() => {
				if (this.state.topic + 1 > Object.values(moni).length - 1) {
					this.setState({ scare: true, img: false }, () =>
						setTimeout(
							() =>
								this.setState({ scare: false }, () =>
									this.props.history.goBack()
								),
							200
						)
					);
				} else {
					this.setState({
						dialog: moni[this.state.topic + 1][0],
						text: 0,
						topic: this.state.topic + 1,
						wait: false
					});
				}
			}, 10000);
		} else
			this.setState({
				dialog: moni[this.state.topic][this.state.text + 1],
				text: this.state.text + 1,
				topic: this.state.topic,
				wait: false
			});
	};

	render() {
		const { classes } = this.props;
		const { dialog, wait, scare, img } = this.state;
		return (
  <div className={classes.root}>
    <img
      src={img ? monispace : scare ? moniscare : spaceBgEmpty}
      alt=""
      style={
						scare
							? { transform: 'scale(3) translateY(20%)', animation: 'none' }
							: null
					}
      className={classes.bgImage}
    />
    <M.Card
      className={classes.dialogue}
      style={wait ? { opacity: 0, pointerEvents: 'none' } : null}
    >
      <M.CardContent>
        <M.Typography variant="body1" className={classes.text}>
          {dialog}
        </M.Typography>
      </M.CardContent>
      <M.CardActions className={classes.buttonbar}>
        <div style={{ flex: 1 }} />
        <M.IconButton onClick={this.next}>
          <Icon.KeyboardArrowDown />
        </M.IconButton>
      </M.CardActions>
    </M.Card>
  </div>
		);
	}
}

export default M.withStyles(style)(Monika);
