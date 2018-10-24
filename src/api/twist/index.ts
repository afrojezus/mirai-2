// Twist API-wrapper for the application. Nallown hasn't done shit on that end for other sites (understandably so), but in case they open up for ways to stream the content.

const Proxy2 = 'https://crossorigin.me/';

// Use feed url instead for much safer keeping
const APIURL = 'https://twist.moe/feed/anime?format=json';
const APIEPURL = 'https://twist.moe/feed/episodes?format=json&kitsuId=';

/**
 * Twist.load() - Get the entire list of animes from Anime Twist
 */
const load = async (): Promise<Array<[{}]>> => {
  const output: any = [];
  try {
    const sourceAPI = await fetch(Proxy2 + APIURL);
    const sourceJSON = await sourceAPI.json();
    const { items } = sourceJSON;
    const que = items.map((element: any, index: number) => {
      return output.push({
        title: element.title,
        ongoing: element['anime:ongoing'],
        link: element.link,
        mal: element['mal:id'],
        kitsu: element['kitsu:id'],
        twist: element['animetwist:id']
      });
    });
    if (que) {
      return output;
    }
  } catch (error) {
    return error;
  }
  return [];
};

/**
 * Twist.loadEpisodeList() - Get the episode ist of a anime from Anime Twist
 */
const loadEpisodeList = async (id: number): Promise<Array<[{}]>> => {
  const output: any = [];
  try {
    const sourceAPI = await fetch(Proxy2 + APIEPURL + id);
    const sourceJSON = await sourceAPI.json();
    const { items } = sourceJSON;
    const que = items.map((element: any, index: number) => {
      return output.push({
        title: element.title,
        episode: element['episode:number'],
        link: element.link,
        mal: element['mal:id'],
        kitsu: element['kitsu:id'],
        twist: element['animetwist:id']
      });
    });
    if (que) {
      return output;
    }
  } catch (error) {
    return error;
  }
  return [];
};

/**
 * Twist API - a Anime Twist api-wrapper for JS applications. ES6+
 *
 */
const Twist = {
  load,
  loadEpisodeList
};

export default Twist;
