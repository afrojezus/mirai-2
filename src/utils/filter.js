/**
 *  AniList to Twist filterizer
 */

import bigfuck from './bigfuck';

export default (aniAL, twistData) =>
{
  const twistnames = twistData.map(s =>
    s.name.toLowerCase());
  if (aniAL[0].node)
  {
    return aniAL.filter(d =>
      twistnames.includes(bigfuck(d.node.title.romaji.toLowerCase())));
  }
  return aniAL.filter(d =>
    twistnames.includes(bigfuck(d.title.romaji.toLowerCase())));
};
