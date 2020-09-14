import getPointAtSegLength from '../util/getPointAtSegLength.js'
import getMedianPoint from '../util/getMedianPoint.js'

export default function(x1, y1, x2, y2) {
  var t = 0.5,
      p0 = [x1,y1],
      p1 = [x2,y2],
      p2 = getMedianPoint(p0, p1, t),
      p3 = getMedianPoint(p1, p2, t),
      p4 = getMedianPoint(p2, p3, t),
      p5 = getMedianPoint(p3, p4, t),
      p6 = getMedianPoint(p4, p5, t),
      cp1 = getPointAtSegLength.apply(0, p0.concat( p2, p4, p6, t)), 
      cp2 = getPointAtSegLength.apply(0, p6.concat( p5, p3, p1, 0));

  return [cp1.x, cp1.y, cp2.x, cp2.y, x2, y2]
}