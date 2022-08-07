import localForage from 'localforage';
import { isEmpty } from 'react-redux-firebase';
import Anilist from '../anilist-api';
import { entryQuery } from '../anilist-api/queries';

export const loadEp = (parent, ep, resume) =>
	parent.setState(
		{
			playing: false,
			source: null,
			buffering: true,
			status: 'Loading...',
			loaded: 0,
			played: 0,
			videoQuality: null,
		},
		async () => {
			if (document.getElementById('player'))
				document.getElementById('player').style.opacity = 1;
			if (parent.state.menuEl) {
				parent.closeMenu();
			}
			if (parent.state.torrent) {
				/*hsfetcher.getSource(ep.link, (torrent, file) => {
					file.getBlobURL((err, url) => {
						if (err) throw err;
						if (url)
							parent.setState(
								{
									torrentFile: torrent,
									source: url,
									ep: ep.ep,
									resume: resume || null,
								},
								() => parent.playPause()
							);
					});
				});*/
			} else {
				parent.setState({
					source: ep.link, ep: ep.ep, resume: resume || null
				});

				// Twist.moe no longer works as of this patch, thus, load the link directly.
				/*
				const source = await Twist.getSource(ep.link);
				try {
					if (source) {
						parent.setState(
							{ source, ep: ep.ep, resume: resume || null },
							() => {
								parent.playPause();
							}
						);
					}
				} catch (error) {
					console.error(error);
					parent.setState({ error: true, status: 'Error' });
				}*/
			}
		}
	);

export const loadFile = (parent, link) =>
	parent.setState(
		{
			playing: false,
			source: null,
			buffering: true,
			status: 'Loading...',
			loaded: 0,
			played: 0,
			videoQuality: null,
		},
		async () => {
			// console.log(link);
			if (document.getElementById('player'))
				document.getElementById('player').style.opacity = 1;
			if (parent.state.menuEl) {
				parent.closeMenu();
			}
			if (link) {
				parent.setState(
					{
						source: link.preview,
						status: link.name.trim(),
						ep: null,
						resume: null,
					},
					() => {
						parent.playPause();
					}
				);
			} else {
				console.error("File couldn't be played.");
				parent.setState({ error: true, status: 'Error' });
			}
		}
	);

/*const getTorrent = (parent, data) =>
	parent.setState(
		{
			title: data.meta.title.romaji,
			showId: data.meta.id,
			showArtwork: data.meta.coverImage.large,
			showDesc: data.meta.description,
			showHeaders: data.meta.bannerImage
				? data.meta.bannerImage
				: data.meta.coverImage.large,
		},
		async () => {
			const list = await hsfetcher.getList(data.meta.title.romaji);
			try {
				if (list) {
					const eps = [];
					list
						.filter(e => e.quality === parent.state.quality)
						.reverse()
						.forEach((s, i) =>
							eps.push({
								name: s.title,
								link: s.torrent,
								ep: i + 1,
								provider: 'Nyaa',
							})
						);
					parent.setState({ eps, status: 'Initiating client...' }, async () =>
						loadEp(parent, parent.state.eps[0], null)
					);
				} else return new Error('fuck');
			} catch (error) {
				return console.error(error);
			}
			return null;
		}
	);*/

const getSource = async (parent, data) => {
	parent.setState({
		title: data.meta.title.romaji,
		showId: data.meta.id,
		showArtwork: data.meta.coverImage.large,
		showDesc: data.meta.description,
		showHeaders: data.meta.bannerImage
			? data.meta.bannerImage
			: data.meta.coverImage.large
	});
	/*const correctedtitle = bigfuck(data.meta.title.romaji.toLowerCase())
		;
	const meta = Object.values(parent.props.mir.twist).filter(s =>
		s.name.toLowerCase().match(`${correctedtitle}`)
	);
	parent.setState({ isOngoing: meta && meta[0].ongoing ? meta[0].ongoing : false });*/
	// console.log(meta)
	try {
		if (data.eps) {
			// console.log(data.eps);
			console.info('Episodes found from cache!');
			parent.setState({ eps: data.eps, status: 'Loading...' }, async () => {
				/*if (parent.props.history.location.state.skipToEp) {
					return loadEp(parent, parent.state.eps[parent.props.history.location.state.skipToEp - 1], null);
				}*/
				localForage
					.getItem('player-state')
					.then(a => {
						if (a.showId === parent.state.showId) {
							console.info('Metadata found.');
							console.log(a, parent.state.eps[a.ep - 1], parent.state.eps);
							loadEp(parent, parent.state.eps[a.ep - 1], a.played);
						} else throw new Error('');
					})
					.catch(async a => {
						if (
							!isEmpty(parent.props.profile) &&
							parent.props.profile.episodeProgress &&
							parent.props.profile.episodeProgress[parent.state.showId]
						) {
							console.info('No metadata found locally, attempting remote.');
							loadEp(
								parent,
								parent.state.eps[
								parent.props.profile.episodeProgress[parent.state.showId].ep -
								1
								],
								parent.props.profile.episodeProgress[parent.state.showId].played
							);
						} else {
							console.info(
								'No metadata found locally and remotely, starting new session.'
							);
							loadEp(parent, parent.state.eps[0], null);
						}
					});
			});
		}/* else if (meta && meta[0].link) {
			console.info('Episodes not found from cache! Scratching...');
			// console.log(meta)
			const eps = await Twist.get(meta[0].link, meta[0].ongoing);
			if (eps) {
				parent.setState({ eps, status: 'Loading...' }, async () => {
					localForage
						.getItem('player-state')
						.then(a => {
							if (a.showId === parent.state.showId) {
								console.info('Metadata found.');
								loadEp(parent, parent.state.eps[a.ep - 1], a.played);
							} else throw new Error('');
						})
						.catch(async a => {
							if (
								!isEmpty(parent.props.profile) &&
								parent.props.profile.episodeProgress &&
								parent.props.profile.episodeProgress[parent.state.showId]
							) {
								console.info('No metadata found locally, attempting remote.');
								loadEp(
									parent,
									parent.state.eps[
									parent.props.profile.episodeProgress[parent.state.showId]
										.ep - 1
									],
									parent.props.profile.episodeProgress[parent.state.showId]
										.played
								);
							} else {
								console.info(
									'No metadata found locally and remotely, starting new session.'
								);
								loadEp(parent, parent.state.eps[0], null);
							}
						});
				});
			}
		}*/ else {
			throw new Error('Failed to load videodata.');
		}
	} catch (error) {
		console.error(error);
		parent.setState({
			error: true,
			status: 'Error 2: Failed to load videodata.',
		});
	}
};

/**
 * mirfetch getState
 * @param {this} parent - React Component wielding a state, a history as prop, firebase profile as prop, and several playing methods.
 * @returns {Promise<void>}
 */
export const getState = async parent => {
	if (!parent.props.mir) {
		return null;
	} else if (!parent.props.mir.play) {
		return null;
	}
	try {
		if (parent.state.torrent) {
			if (parent.props.mir.play) {
				if (
					parent.props.mir.play &&
					parent.props.mir.play.id === parent.state.showId
				) {
					return false;
				}
				console.info('Nyaa mode, found location state.');
				parent.setState({ status: 'Setting up...' });
				//getTorrent(parent, parent.props.mir.play);
			} else {
				if (
					parent.props.mir.play &&
					parent.props.mir.play.id === parent.state.showId
				) {
					return false;
				}
				console.info(
					'Nyaa mode, location state not found. Requesting metadata...'
				);
				parent.setState({ status: 'Fetching...' });
				//if (data) getTorrent(parent, { meta: data.Media });
			}
		} else if (parent.props.mir.play) {
			if (
				parent.props.mir.play &&
				parent.props.mir.play.id === parent.state.showId
			) {
				return false;
			}
			console.info('Location state found! No need for refetching.');
			parent.setState({ status: 'Setting up...' });
			await getSource(parent, parent.props.mir.play);
		} else {
			if (
				parent.props.mir.play &&
				parent.props.mir.play.id === parent.state.showId
			) {
				return false;
			}
			console.info('Location state not found! Refetching...');
			parent.setState({ status: 'Fetching...' });
			const data = await Anilist.get(entryQuery, {
				id: parent.props.mir.play.id,
			});
			if (data) await getSource(parent, { meta: data.Media });
		}
	} catch (error) {
		console.error(error);
		parent.setState({
			error: true,
			status: 'Error 1: Failed to fetch metadata',
		});
	}
	return null;
};
