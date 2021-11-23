import SVGPCO from '../options/options';

import pathToAbsolute from '../convert/pathToAbsolute';
import pathToRelative from '../convert/pathToRelative';
import pathToString from '../convert/pathToString';

import parsePathString from '../parser/parsePathString';
import reversePath from '../process/reversePath';

import clonePath from '../process/clonePath';
import splitPath from '../process/splitPath';
import optimizePath from '../process/optimizePath';
import normalizePath from '../process/normalizePath';
import transformPath from '../process/transformPath';
import getPathBBox from '../util/getPathBBox';

/**
 * Creates a new SVGPathCommander instance.
 *
 * @author thednp <https://github.com/thednp/svg-path-commander>
 */
export default class SVGPathCommander {
  /**
   * @param {string} pathValue the path string
   * @param {object} config instance options
   */
  constructor(pathValue, config) {
    const options = config || {};

    let { round } = SVGPCO;
    const { round: roundOption } = options;
    if (+roundOption === 0 || roundOption === false) {
      round = 0;
    }

    const { decimals } = round && (options || SVGPCO);

    // set instance options
    /** @type {number | boolean | undefined} */
    this.round = round === 0 ? 0 : decimals;
    // ZERO | FALSE will disable rounding numbers

    /** @type {SVGPC.pathArray} */
    this.segments = parsePathString(pathValue);

    /** * @type {string} */
    this.pathValue = pathValue;

    return this;
  }

  /**
   * Convert path to absolute values
   * @public
   */
  toAbsolute() {
    const { segments } = this;
    this.segments = pathToAbsolute(segments);
    return this;
  }

  /**
   * Convert path to relative values
   * @public
   */
  toRelative() {
    const { segments } = this;
    this.segments = pathToRelative(segments);
    return this;
  }

  /**
   * Reverse the order of the segments and their values.
   * @param {boolean | number} onlySubpath option to reverse all sub-paths except first
   * @public
   */
  reverse(onlySubpath) {
    this.toAbsolute();

    const { segments } = this;
    const subPath = splitPath(this.pathValue).length > 1 && splitPath(this.toString());
    const absoluteMultiPath = subPath && clonePath(subPath)
      .map((x, i) => {
        if (onlySubpath) {
          return i ? reversePath(x) : parsePathString(x);
        }
        return reversePath(x);
      });

    let path = [];
    if (subPath) {
      path = absoluteMultiPath.flat(1);
    } else {
      path = onlySubpath ? segments : reversePath(segments);
    }

    this.segments = clonePath(path);
    return this;
  }

  /**
   * Normalize path in 2 steps:
   * * convert `pathArray`(s) to absolute values
   * * convert shorthand notation to standard notation
   * @public
   */
  normalize() {
    const { segments } = this;
    this.segments = normalizePath(segments);
    return this;
  }

  /**
   * Optimize `pathArray` values:
   * * convert segments to absolute and/or relative values
   * * select segments with shortest resulted string
   * * round values to the specified `decimals` option value
   * @public
   */
  optimize() {
    const { segments } = this;

    this.segments = optimizePath(segments, this.round);
    return this;
  }

  /**
   * Transform path using values from an `Object` defined as `transformObject`.
   * @see SVGPC.transformObject for a quick refference
   *
   * @param {SVGPC.transformObject} source a `transformObject`as described above
   * @public
   */
  transform(source) {
    if (!source || typeof source !== 'object' || (typeof source === 'object'
      && !['translate', 'rotate', 'skew', 'scale'].some((x) => x in source))) return this;

    const transform = source || {};
    const { segments } = this;

    // if origin is not specified
    // it's important that we have one
    if (!transform.origin) {
      const BBox = getPathBBox(segments);
      transform.origin = [BBox.cx, BBox.cy, BBox.cx];
    }

    this.segments = transformPath(segments, transform);
    return this;
  }

  /**
   * Rotate path 180deg horizontally
   * @public
   */
  flipX() {
    this.transform({ rotate: [180, 0, 0] });
    return this;
  }

  /**
   * Rotate path 180deg vertically
   * @public
   */
  flipY() {
    this.transform({ rotate: [0, 180, 0] });
    return this;
  }

  /**
   * Export the current path to be used
   * for the `d` (description) attribute.
   * @public
   * @return {String} the path string
   */
  toString() {
    return pathToString(this.segments, this.round);
  }
}