/**
 * Colorizer
 */
import Vibrant from 'node-vibrant';
import { Palette } from 'node-vibrant/lib/color';

const proxy = 'https://cors-anywhere.herokuapp.com/' as string;

/**
 * Colorizer(image)
 * @returns {Promise}
 * @param {String} image - Image source (URL)
 */
export default (image: string) => {
    return Vibrant.from(proxy + image)
        .getPalette()
        .then((palette: Palette) => {
            return palette;
        });
};
