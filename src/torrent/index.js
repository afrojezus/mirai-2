// fetch anime from nyaa
// fetch file from nyaa
// TODO: Fix every single eslint-airbnb issue
import * as W from 'webtorrent';
import Cheerio from 'cheerio';
import Request from 'request-promise';

const prx = 'https://cors-anywhere.herokuapp.com/';

// WebTorrent temp client
const client = new W();

/**
 * getList
 * @param anime
 * @returns {Promise<array>}
 */
const getList = async (anime) => {
  const array = [];
  const data = {
    uri: `${prx}https://nyaa.si/user/HorribleSubs?f=2&c=1_2&q=${anime}`,
    transform: (body) => Cheerio.load(body),
  };
  const l = await Request(data);
  try {
    if (l) {
      const list = l('tbody')
        .children('tr.success')
        .each((k, i) => {
          const title = l(i)
            .children('td:nth-child(2)')
            .children('a')[2]
            ? l(i)
                .children('td:nth-child(2)')
                .children('a:nth-child(2)')
                .text()
                .trim()
            : l(i)
                .children('td:nth-child(2)')
                .children('a')
                .text()
                .trim();
          const quality = title.match('1080p')
            ? 1080
            : title.match('720p') ? 720 : title.match('480p') ? 480 : 'N/A';
          return array.push({
            title,
            torrent: `${prx}https://nyaa.si${l(i)
              .children('td:nth-child(3)')
              .children('a')
              .attr('href')}`,
            quality,
          });
        });
      if (list) return array;
    }
  } catch (error) {
    return error;
  }
  return null;
};

/**
 * getSource
 * @param torrent
 * @returns {Promise<void>}
 */
const getSource = (torrent, callback) =>
  client.add(torrent, (t) => {
    t.files.forEach((file) => callback(t, file));
  });

/**
 * destroyClient
 */
const destroyClient = (torrent) => client.remove(torrent);

export default {
  getList,
  getSource,
  destroyClient,
};
