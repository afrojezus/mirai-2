/**
 * Colorizer
 */
import Vibrant from "node-vibrant";

const proxy = "https://cors-anywhere.herokuapp.com/" as string;

/**
 * Colorizer(image)
 * @returns {Promise}
 * @param {String} image - Image source (URL)
 */
export default async (image: string) => {
    const palette = await Vibrant.from(proxy + image)
        .getPalette();
    return palette;
};
