import pathToString from '../convert/pathToString';
import pathToAbsolute from '../convert/pathToAbsolute';

/**
 * Split a path into an `Array` of sub-path strings.
 *
 * In the process, values are converted to absolute
 * for visual consistency.
 *
 * @param {svgpcNS.pathArray | string} pathInput the cubic-bezier parameters
 * @return {string[]} an array with all sub-path strings
 */
export default function splitPath(pathInput) {
  return pathToString(pathToAbsolute(pathInput), 0)
    .replace(/(m|M)/g, '|$1')
    .split('|')
    .map((s) => s.trim())
    .filter((s) => s);
}
