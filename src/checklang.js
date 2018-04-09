import strings from './strings';

export default parent => {
	const lang = localStorage.getItem('language');
	switch (lang) {
		case 'en-us':
			parent.setState({ lang: strings.enus });
			break;

		case 'nb-no':
			parent.setState({ lang: strings.nbno });
			break;

		case 'jp':
			parent.setState({ lang: strings.jp });
			break;

		default:
			break;
	}
};
