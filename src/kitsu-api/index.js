/**
 * Kitsu API for Mirai
 */

import Kitsu from './kitsu/kitsu';

export const kapi = new Kitsu();

const get = async (query, type) => {
    console.log(query, type)
    let subType = type.includes('MOVIE') ? 'movie' : type;
    try {
        // Get the most likely to be the same anime in both databases
        const { data } = await kapi.get(`anime`, {
            filter: {
                text: query
            },
            include: 'episodes'
        });
        const anime = data.filter(x => x.showType.match(subType));
        // Get episode metadata for it
        return getEpisodes(anime[0].id);
    } catch (err) {
        // Array of JSON:API errors: http://jsonapi.org/format/#error-objects
    if (err.errors) err.errors.forEach(error => { console.log(error) })
    }
}

const getEpisodes = async (query) => {
    try {
        const data = await kapi.get(`anime/${query}/episodes?page[limit]=20`);
        if (data.links.next) {
            const nextURL = decodeURI(data.links.next.split('https://kitsu.io/api/edge/')[1])
            const data2 = await kapi.get(nextURL);
            return [...data.data, ...data2.data].sort((a,b) => a.number - b.number);
        } else {
            return data.data.sort((a,b) => a.number - b.number)
        }
    } catch (err) {
        // Array of JSON:API errors: http://jsonapi.org/format/#error-objects
    if (err.errors) err.errors.forEach(error => { console.log(error) })
    return null;
    }
}

const addKitsuMetadata = async (title, eps, type) => {
    const twistData = Object.values(eps);
    try {
      const kmeta = await get(title, type);
      let o = [];
      for (let i=0; i < twistData.length; i++){
        let value = twistData[i];
        o.push({...value, synopsis: kmeta[i].synopsis, 
        thumb: kmeta[i].thumbnail,
      canon: kmeta[i].canonicalTitle,
    airdate: kmeta[i].airdate,
    season: kmeta[i].seasonNumber,
  duration: kmeta[i].length,
kitsuId: kmeta[i].id})
      }
      return o;
    } catch (error) {
      let u = [];
      for (let i=0; i < twistData.length; i++){
        let valueA = twistData[i];
        u.push({...valueA, synopsis: null, 
        thumb: null,
      canon: null,
    airdate: null,
    season: null,
  duration: null,
kitsuId: null})
      }
      return u;
    }
  }

export default {
    get,
    addKitsuMetadata
}