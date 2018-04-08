// TODO: Fix every single eslint-airbnb issue
import Cheerio from 'cheerio';
import Request from 'request-promise';

const Proxy2 = 'https://cors-anywhere.herokuapp.com/';

const URL = 'https://twist.moe';
/**
 * Twist.load() - Get the entire list of animes from Anime Twist
 */
const load = async () =>
{
  const output = [];
  const data = {
    uri: Proxy2 + URL,
    transform: body => Cheerio.load(body),
  };
  try
  {
    const source = await Request(data);
    const que = source('.series ul')
      .children('li')
      .each((key, index) =>
      {
        output.push({
          name: source(index).children('a')[1]
            ? source(index)
              .children('a')
              .text()
              .replace('ONGOING', '')
              .trim()
            : source(index)
              .children('a')
              .text()
              .trim(),
          ongoing: !!source(index).children('a')[1],
          link:
            Proxy2 +
            URL +
            source(index)
              .children('a')
              .attr('href'),
        });
      });
    if (que) return output;
  }
  catch (error)
  {
    return error;
  }
  return null;
};

/**
 * Twist.get ( query ) - Uses query to get an anime from the database of Anime Twist
 */
const get = async (query, ongoing) =>
{
  const output = [];
  const data = {
    uri: Proxy2 + query,
    transform: body => Cheerio.load(body),
  };
  try
  {
    const source = await Request(data);
    const que = source('div.episode-list ul')
      .children('li:not(:has(button))')
      .each(async (index, e) =>
      {
        const ep =
          parseInt(
            source(e)
              .find('a')
              .attr('data-episode'),
            10,
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
    if (que) return output;
  }
  catch (error)
  {
    return error;
  }
  return null;
};

const getSource = async (ep) =>
{
  const data = {
    uri: Proxy2 + ep,
    transform: body => Cheerio.load(body),
  };
  try
  {
    const source = await Request(data);
    if (source)
    {
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
      if (url) return decodeURI(urlX);
    }
  }
  catch (error)
  {
    return error;
  }
  return null;
};

/**
 * Twist API - a Anime Twist api-wrapper for JS applications. ES6+
 *
 */
const Twist = {
  get,
  load,
  getSource,
};

export default Twist;
