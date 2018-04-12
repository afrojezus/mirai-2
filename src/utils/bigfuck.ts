// The great string of correction!

export default (animetitle: string) =>
  animetitle
    .replace('kantai-collection: kancolle', 'kantai collection')
    .replace('sen to chihiro no kamikakushi', 'spirited awaymovie')
    .replace('ookami kodomo no ame to yuki', 'wolf children')
    .replace('★', '')
    .replace('?', '')
    .replace('aho-girl', 'aho girl')
    .replace('.', '')
    .replace('†', ' ')
    .replace('houseki no kuni', 'houseki no kuni (tv)')
    .replace('macross frontier', 'macross f')
    .replace('macross delta', 'macross d')
    .replace('is <infinite stratos>', 'is: infinite stratos')
    .replace('is <infinite stratos> 2', 'is: infinite stratos 2');
