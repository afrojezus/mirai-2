/**
 * Colorizer
 */
import * as Vibrant from 'node-vibrant';

const proxy = 'https://cors-anywhere.herokuapp.com/';

/**
 * Colorizer(image)
 * @returns {Promise}
 * @param {String} image - Image source (URL)
 */
export default image =>
  Vibrant.from(proxy + image)
    .getPalette()
    .then(palette =>
      palette);
