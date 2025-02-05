/**
 * Returns a clone of an existing `pathArray`.
 *
 * @param {SVGPathCommander.pathArray | SVGPathCommander.pathSegment} path the source `pathArray`
 * @returns {any} the cloned `pathArray`
 */
export default function clonePath(path) {
  return path.map((x) => (Array.isArray(x) ? [...x] : x));
}
