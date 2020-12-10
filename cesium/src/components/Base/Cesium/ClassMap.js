/**
 * Vue 组件名对应的 Cesium 类。
 * @const {Object}
 */
const ClassMap = {
  // 二、三维视图
  'vue-web-globe' : 'WebGlobe', //这是我们中地特有的封装，适应OCX的代码
  'vue-viewer': 'Viewer',
  // 影像
  'vue-layer-imagery': 'ImageryLayer',
  'vue-provider-imagery-mapbox': 'MapboxImageryProvider',
  'vue-provider-imagery-openstreetmap': 'OpenStreetMapImageryProvider',
  'vue-provider-imagery-tile-single': 'SingleTileImageryProvider',
  'vue-provider-imagery-tile-coordinates': 'TileCoordinatesImageryProvider',
  'vue-provider-imagery-tile-mapservice': 'TileMapServiceImageryProvider',
  'vue-provider-imagery-urltemplate': 'UrlTemplateImageryProvider',
  'vue-provider-imagery-wms': 'WebMapServiceImageryProvider',
  'vue-provider-imagery-wmts': 'WebMapTileServiceImageryProvider',
  'vue-provider-imagery-tianditu': 'TiandituImageryProvider',
  'vue-provider-imagery-tiledcache ': 'UrlTemplateImageryProvider',
  // 地形
  'vue-provider-terrain-cesium': 'CesiumTerrainProvider',
  // 实体
  'vue-entity': 'Entity',
  'vue-graphics-point': 'PointGraphics',
  'vue-graphics-polygon': 'PolygonGraphics',
  'vue-graphics-polyline': 'PolylineGraphics',
  // 数据源
  'vue-datasource-custom': 'CustomDataSource',
  'vue-datasource-czml': 'CzmlDataSource',
  'vue-datasource-geojson': 'GeoJsonDataSource',
  'vue-datasource-kml': 'KmlDataSource',
  // 图元集合
  'vue-collection-primitive': 'PrimitiveCollection',
  'vue-collection-primitive-billboard': 'BillboardCollection',
  'vue-collection-primitive-label': 'LabelCollection',
  'vue-collection-primitive-point': 'PointPrimitiveCollection',
  'vue-collection-primitive-polyline': 'PolylineCollection',
  // 几何体
  'vue-instance-geometry': 'GeometryInstance',
  'vue-geometry-circle': 'CircleGeometry',
  'vue-geometry-polyline': 'PolylineGeometry',
  'vue-geometry-polygon': 'PolygonGeometry'
}

export default ClassMap;
