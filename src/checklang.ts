import strings from './strings.json';

interface Parent {
  setState: (state: object) => void;
}

export default (parent: Parent) => {
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
