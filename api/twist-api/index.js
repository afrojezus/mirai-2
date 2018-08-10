const Proxy2 = 'https://cors-anywhere.herokuapp.com/';

// Use feed url instead for much safer keeping
const APIURL = 'https://twist.moe/feed/anime?format=json';
// const APIEPURL = 'https://twist.moe/feed/episodes?format=json';

/**
 * Twist.load() - Get the entire list of animes from Anime Twist
 */
const load = async () => {
  const output = [];
  try {
    const sourceAPI = await fetch(Proxy2 + APIURL);
    const sourceJSON = await sourceAPI.json();
    const { items } = sourceJSON;
    const que = items.map((element, index) => {
      return output.push({
        name: element.title,
        ongoing: element['anime:ongoing'],
        link: element.link,
        mal: element['mal:id'],
        kitsu: element['kitsu:id'],
        twist: element['animetwist:id'],
      });
    });
    if (que) {
      return output;
    }
  } catch (error) {
    return error;
  }
  return null;
};

/**
 * Twist API - a Anime Twist api-wrapper for JS applications. ES6+
 *
 */
const Twist = {
  load,
};

export default Twist;
