import Cheerio from 'cheerio';
import Request from 'request-promise';

const Proxy2 = 'https://cors-anywhere.herokuapp.com/';

const URL = 'https://twist.moe';

// Use feed url instead for much safer keeping
const APIURL = 'https://twist.moe/feed/anime?format=json';
const APIEPURL = 'https://twist.moe/feed/episodes?format=json';

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
 * Twist.get ( query ) - Uses query to get an anime from the database of Anime Twist
 */
const get = async (query, ongoing) => {
  const output = [];
  const data = {
    uri: Proxy2 + query,
    transform: (body) => Cheerio.load(body),
  };
  try {
    /*const sourceAPI = await fetch(Proxy2 + APIEPURL + '&malID=' + query);
	const sourceJSON = await sourceAPI.json();
	console.log(sourceJSON);*/
    const source = await Request(data);
    const que = source('div.episode-list ul')
      .children('li:not(:has(button))')
      .each(async (index, e) => {
        const ep =
          parseInt(
            source(e)
              .find('a')
              .attr('data-episode'),
            10
          ) + 1;
        const name = `Episode ${ep}`;
        const link = `https://twist.moe${source(e)
          .find('a')
          .attr('href')}`;
        const provider = 'Twist';
        output.push({
          name,
          link,
          ep,
          provider,
          ongoing,
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

const getSource = async (ep) => {
  const data = {
    uri: Proxy2 + ep,
    transform: (body) => Cheerio.load(body),
  };
  try {
    const source = await Request(data);
    if (source) {
      const video = source('body')
        .children('section')
        .children('main')
        .children('vi-player')
        .children('noscript')
        .text();
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
 * Twist API - a Anime Twist api-wrapper for TS applications. ES6+
 *
 */
const Twist = {
  get,
  load,
  getSource,
};

export default Twist;
