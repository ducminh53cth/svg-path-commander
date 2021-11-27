/**
 * Reverses all segments and their values from a `pathArray`
 * which consists of only C (cubic-bezier) path commands.
 *
 * @param {svgpcNS.pathArray} path the source `pathArray`
 * @returns {svgpcNS.pathArray} the reversed `pathArray`
 */
export default function reverseCurve(path) {
  const rotatedCurve = path.slice(1)
    .map((x, i, curveOnly) => (!i
      ? path[0].slice(1).concat(x.slice(1))
      : curveOnly[i - 1].slice(-2).concat(x.slice(1))))
    .map((x) => x.map((_, i) => x[x.length - i - 2 * (1 - (i % 2))]))
    .reverse();

  // @ts-ignore
  return [['M'].concat(rotatedCurve[0].slice(0, 2))]
    // @ts-ignore
    .concat(rotatedCurve.map((x) => ['C'].concat(x.slice(2))));
}
