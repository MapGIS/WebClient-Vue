import {
  makeDistanceDisplayCondition,
  makeCartesian2,
  makeCartesian2Array,
  makeCartesian3,
  makeColor,
  makeNearFarScalar,
  makeMaterial,
  makeCartesian3Array,
  makeRectangle,
  makeBoundingRectangle,
  makePlane,
  makePolygonHierarchy,
  makeTranslationRotationScale,
  makeQuaternion,
  makeOptions
} from '../../Utils/util'

/**
 * 特殊的 Props, 需要用 util 中提供的方法转换。
 */
const ClassProps = {
  distanceDisplayCondition: {
    handler: makeDistanceDisplayCondition
  },
  pixelOffset: {
    handler: makeCartesian2,
    deep: true
  },
  showBackground: {
    handler: makeCartesian2,
    deep: true
  },
  imageBasedLightingFactor: {
    handler: makeCartesian2
  },
  shape: {
    handler: makeCartesian2Array
  },
  shapePositions: {
    handler: makeCartesian2Array
  },
  position: {
    handler: makeCartesian3
  },
  eyeOffset: {
    handler: makeCartesian3,
    deep: true
  },
  alignedAxis: {
    handler: makeCartesian3,
    deep: true
  },
  dimensions: {
    handler: makeCartesian3
  },
  radii: {
    handler: makeCartesian3
  },
  center: {
    handler: makeCartesian3
  },
  innerRadii: {
    handler: makeCartesian3
  },
  origin: {
    handler: makeCartesian3
  },
  positions: {
    handler: makeCartesian3Array,
    exclude: '_callback'
  },
  polylinePositions: {
    handler: makeCartesian3Array,
    exclude: '_callback'
  },
  color: {
    handler: makeColor
  },
  outlineColor: {
    handler: makeColor
  },
  backgroundColor: {
    handler: makeColor
  },
  fillColor: {
    handler: makeColor
  },
  silhouetteColor: {
    handler: makeColor
  },
  lightColor: {
    handler: makeColor
  },
  glowColor: {
    handler: makeColor
  },
  clearColor: {
    handler: makeColor
  },
  scaleByDistance: {
    handler: makeNearFarScalar
  },
  translucencyByDistance: {
    handler: makeNearFarScalar
  },
  pixelOffsetScaleByDistance: {
    handler: makeNearFarScalar
  },
  material: {
    handler: makeMaterial
  },
  depthFailMaterial: {
    handler: makeMaterial
  },
  cutoutRectangle: {
    handler: makeRectangle
  },
  coordinates: {
    handler: makeRectangle
  },
  rectangle: {
    handler: makeRectangle
  },
  imageSubRegion: {
    handler: makeBoundingRectangle
  },
  colorToAlpha: {
    handler: makeColor
  },
  plane: {
    handler: makePlane
  },
  hierarchy: {
    handler: makePolygonHierarchy,
    exclude: '_callback'
  },
  polygonHierarchy: {
    handler: makePolygonHierarchy
  },
  nodeTransformations: {
    handler: makeTranslationRotationScale
  },
  orientation: {
    handler: makeQuaternion
  },
  options: {
    deep: true,
    handler: makeOptions
  }
}

export default ClassProps
