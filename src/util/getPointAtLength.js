import getSegCubicLength from './getSegCubicLength';
import getPointAtSegLength from './getPointAtSegLength';
import pathToCurve from '../convert/pathToCurve';

/**
 * Returns [x,y] coordinates of a point at a given length of a shape.
 *
 * @param {string | svgpcNS.pathArray} path the `pathArray` to look into
 * @param {number} length the length of the shape to look at
 * @returns {number[]} the requested [x,y] coordinates
 */
export default function getPointAtLength(path, length) {
  let totalLength = 0;
  let segLen;
  let data;
  let result;
  // @ts-ignore
  return pathToCurve(path).map((seg, i, curveArray) => {
    data = i ? curveArray[i - 1].slice(-2).concat(seg.slice(1)) : seg.slice(1);
    // @ts-ignore
    segLen = i ? getSegCubicLength.apply(0, data) : 0;
    totalLength += segLen;

    if (i === 0) {
      result = { x: data[0], y: data[1] };
    } else if (totalLength > length && length > totalLength - segLen) {
      // @ts-ignore
      result = getPointAtSegLength.apply(0, data.concat(1 - (totalLength - length) / segLen));
    } else {
      result = null;
    }

    return result;
  }).filter((x) => x).slice(-1)[0]; // isolate last segment
}
