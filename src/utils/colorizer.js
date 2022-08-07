/**
 * Colorizer
 */
import * as Vibrant from "node-vibrant";

const proxy = "https://mirai-proxy.watermeloncornsyrup.workers.dev/?";

/**
 * Colorizer(image)
 * @returns {Promise}
 * @param {String} image - Image source (URL)
 */
const Colorizer = (image, useProxy = false) => {
  return Vibrant.from(useProxy ? proxy + image : image)
    .getPalette()
    .then(palette => {
      return palette;
    });
};
export default Colorizer;