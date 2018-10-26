import cheerio from 'cheerio';
import requestPromise from 'request-promise';

// Twist API-wrapper for the application. Nallown hasn't done shit on that end for other sites (understandably so), but in case they open up for ways to stream the content.

const Proxy2 = 'https://cors.io/?';

// Use feed url instead for much safer keeping
const APIURL = 'https://twist.moe/feed/anime?format=json';
const APIEPURL = 'https://twist.moe/feed/episodes?format=json&kitsuId=';
const APIEPURL_EXPERIMENTAL = 'https://twist.moe/api/anime/';

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
        twist: element['animetwist:id'],
        slug: element['animetwist:slug']
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
 * Twist.loadEpisodeList() - Get the episode list of a anime from Anime Twist
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
 * Twist.loadEpisodeListEX() - Get the episode list of a anime from Anime Twist (with the new API)
 */
const loadEpisodeListEX = async (slug: string): Promise<Array<[{}]>> => {
  const output: any = [];
  try {
    const sourceAPI = await fetch(Proxy2 + APIEPURL_EXPERIMENTAL + slug);
    const sourceJSON = await sourceAPI.json();
    // tslint:disable-next-line:no-console
    console.log(sourceJSON);
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
 * Twist.fetchSource_Hack() - Get the source video of a anime from Anime Twist (old method, risky!!!)
 * @param link
 */
// tslint:disable-next-line:variable-name
const fetchSource_Hack = async (link: string) => {
  // tslint:disable-next-line:no-console
  console.log(Proxy2 + link);
  const data = {
    uri: Proxy2 + link,
    transform: (body: CheerioElement) => cheerio.load(body)
  };
  try {
    const source = await requestPromise(data);
    // tslint:disable-next-line:no-console
    console.log(source);
    if (source) {
      const video = source('body')
        .children('section')
        .children('main')
        .children('vi-player')
        .children('noscript')
        .text();
      // tslint:disable-next-line:no-console
      console.log(video);
      const srcParsed = source.parseHTML(video);
      const src = source(srcParsed)
        .eq(1)
        .attr('src');
      const url = decodeURI(`https://twist.moe${src}`);
      const urlX = url.includes('https://twist.moe ')
        ? url.replace('https://twist.moe ', 'https://twist.moe')
        : url;
      if (url) {
        return decodeURI(urlX);
      }
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
  loadEpisodeList,
  loadEpisodeListEX,
  fetchSource_Hack
};

export default Twist;
