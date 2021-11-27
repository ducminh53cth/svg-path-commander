/**
 * Returns the [x,y] projected coordinates for a given an [x,y] point
 * and an [x,y,z] perspective origin point.
 *
 * Equation found here =>
 * http://en.wikipedia.org/wiki/3D_projection#Diagram
 * Details =>
 * https://stackoverflow.com/questions/23792505/predicted-rendering-of-css-3d-transformed-pixel
 *
 * @param {svgpcNS.CSSMatrix} m the transformation matrix
 * @param {Number[]} point2D the initial [x,y] coordinates
 * @param {number[]} origin the initial [x,y] coordinates
 * @returns {Number[]} the projected [x,y] coordinates
 */
export default function projection2d(m, point2D, origin) {
  const point3D = m.transformPoint({
    x: point2D[0], y: point2D[1], z: 0, w: 1,
  });
  const originX = origin[0] || 0;
  const originY = origin[1] || 0;
  const originZ = origin[2] || 0;
  const relativePositionX = point3D.x - originX;
  const relativePositionY = point3D.y - originY;
  const relativePositionZ = point3D.z - originZ;

  return [
    relativePositionX * (Math.abs(originZ) / Math.abs(relativePositionZ)) + originX,
    relativePositionY * (Math.abs(originZ) / Math.abs(relativePositionZ)) + originY,
  ];
}
