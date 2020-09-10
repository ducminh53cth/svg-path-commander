import isPathArray from './isPathArray.js'

export default function(pathInput){
  return isPathArray(pathInput) && pathInput.every(x=>x[0] === x[0].toUpperCase())
}