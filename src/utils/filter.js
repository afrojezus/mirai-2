/**
 *  AniList to Twist filterizer
 */

import bigfuck from './bigfuck';

export default (aniAL, twistData) => {
  const twistnames = twistData.map(s => {
    return s.name.toLowerCase();
  });
  if (aniAL[0].node) {
    return aniAL.filter(d =>
      twistnames.includes(bigfuck(d.node.title.romaji.toLowerCase()))
    );
  } else {
    return aniAL.filter(d =>
      twistnames.includes(bigfuck(d.title.romaji.toLowerCase()))
    );
  }
};
