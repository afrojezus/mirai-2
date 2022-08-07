/**
 *  AniList to Twist filterizer
 */

// Does not work anymore after the encryption update, only a stub.

//import bigfuck from './bigfuck';

const Twister = (aniAL, twistData) => {
  return aniAL;
  /*
  const twistnames = twistData.map(s => {
   return s.name.toLowerCase()
  })
  if (aniAL[0].node) {
    return aniAL.filter(d => twistnames.includes(bigfuck(d.node.title.romaji.toLowerCase())));
  } else {
    return aniAL.filter(d => twistnames.includes(bigfuck(d.title.romaji.toLowerCase())));
  }*/
};

export default Twister;
