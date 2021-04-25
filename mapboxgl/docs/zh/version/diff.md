# 对比分析

## 1.07 vs 4.25

| 文件                                        | 类型 | 10.5.2 (2021-01-07)     | 1.0.13 (2020-12)           | 10.5.2(按需引入)         | 1.0.13(按需引入)         | 备注                                                       |
| :------------------------------------------ | :--- | :---------------------- | :------------------------- | :----------------------- | :----------------------- | :--------------------------------------------------------- |
| layer\ogc\OgcWmsLayer.js                    | 修改 | mapgis-ogc-wms-layer    | mapbox-ogc-wms-layer       | MapgisOgcWmsLayer        | MapboxOgcWmsLayer        | props 内部宽度和高度按照国土提出的需求默认值统一升级成 512 |
| layer\ogc\OgcWmtsLayer.js                   | 修改 | mapgis-ogc-wms-layer    | mapbox-ogc-wms-layer       | MapgisOgcWmtsLayer       | MapboxOgcWmtsLayer       | props 内部宽度和高度按照国土提出的需求默认值统一升级成 512 |
| layer\ogc\OgcWfsLayer.vue                   | 新增 | mapgis-ogc-wfs-layer    | 无                         |                          |                          | 无                                                         |
| layer\CanvasLayer.js                        | 修改 | mapgis-canvas-layer     | mapbox-canvas-layer        | MapgisCanvasLayer        | MapboxCanvasLayer        | 新增 props 属性 delay                                      |
| layer\GeojsonLayer.js                       | 改名 | mapgis-geojson-layer    | mapbox-geojson-layer       | MapgisGeojsonLayer       | MapboxGeojsonLayer       |                                                            |
| layer\GoogleLayer.js                        | 改名 | mapgis-google-layer     | GoogleLayer                | MapgisGoogleLayer        | MapboxGoogleLayer        |                                                            |
| layer\ImageLayer.js                         | 改名 | mapgis-image-layer      | mapbox-image-layer         | MapgisImageLayer         | MapboxImageLayer         |                                                            |
| layer\layerMixin.js                         | 修改 |                         |                            |                          |                          | props 新增 url、mapgisOffset                               |
| layer\RasterLayer.js                        | 改名 | mapgis-rastertile-layer | mapbox-raster-layer        | MapgisRasterLayer        | MapboxRasterLayer        |                                                            |
| layer\VectorLayer.js                        | 改名 | mapgis-vector-layer     | mapbox-vector-layer        | MapgisVectorLayer        | MapboxVectorLayer        |                                                            |
| layer\VideoLayer.js                         | 改名 | mapgis-video-layer      | mapbox-video-layer         | MapgisVideoLayer         | MapboxVideoLayer         |                                                            |
| layer\igserver\IgsDocLayer.js               | 改名 | mapgis-igs-doc-layer    | mapbox-igs-doc-layer       | MapgisIgsDocLayer        | MapboxIgsDocLayer        |                                                            |
| layer\igserver\IgsTdtLayer.js               | 改名 | mapgis-igs-tdt-layer    | mapbox-igs-tdt-layer       | MapgisIgsTdtLayer        | MapboxIgsTdtLayer        |                                                            |
| layer\igserver\IgsTileLayer.js              | 改名 | mapgis-igs-tile-layer   | mapbox-igs-tile-layer      | MapgisIgsTileLayer       | MapboxIgsTileLayer       |                                                            |
| layer\igserver\IgsVectorLayer.js            | 改名 | mapgis-igs-vector-layer | mapbox-igs-vector-layer    | MapgisIgsVectorLayer     | MapboxIgsVectorLayer     |                                                            |
| layer\igserver\IgsWmsLayer.js               | 删除 |                         |                            |                          |                          | 请使用 layer\igserver\IgsWmsLayer.js 替代                  |
| layer\igserver\IgsWmtsLayer.js              | 删除 |                         |                            |                          |                          | 请使用 layer\igserver\IgsWmtsLayer.js 替代                 |
| map\GlMap.vue                               | 改名 | mapgis-web-map          | mapbox-map                 | MapgisWebMap             | MapboxMap                |                                                            |
| UI\Marker.vue                               | 改名 | mapgis-marker           | mapbox-marker              | MapgisMarker             | MapboxMarker             |                                                            |
| UI\Popup.vue                                | 改名 | mapgis-popup            | mapbox-popup               | MapgisPopup              | MapboxPopup              |                                                            |
| UI\controls\compare\CompareControl.vue      | 改名 | mapgis-compare          | mapbox-compare             | MapgisCompareControl     | MapboxCompareControl     | 实现了地图级别的内部 slot 机制                             |
| UI\controls\compare\CompareInnerControl.vue | 新增 | mapgis-compare-inner    |                            |                          |                          |                                                            |
| UI\controls\draw\BaseDraw.vue               | 改名 | mapgis-draw             | mapbox-base-draw           | MapgisDraw               | MapboxBaseDraw           |                                                            |
| UI\controls\measure\Measure.vue             | 改名 | mapgis-measure          | mapbox-base-measure        | MapgisMeasure            | MapboxMeasure            |                                                            |
| UI/controls/NavigationControl               | 改名 | mapgis-attribution      | mapbox-attribution-control | MapgisNavigationControl  | MapboxNavigationControl  |
| UI/controls/GeolocateControl                | 改名 | mapgis-geolocate        | mapbox-geolocate-control   | MapgisGeolocateControl   | MapboxGeolocateControl   |                                                            |
| UI/controls/FullscreenControl               | 改名 | mapgis-fullscreen       | mapbox-fullscreen-control  | MapgisFullscreenControl  | MapboxFullscreenControl  |                                                            |
| UI/controls/AttributionControl              | 改名 | mapgis-attribution      | mapbox-attribution-control | MapgisAttributionControl | MapboxAttributionControl |                                                            |
| UI/controls/MapgisScaleControl              | 改名 | mapgis-scale            | mapbox-scale-control       | MapgisScaleControl       | MapboxScaleControl       |                                                            |
| UI/controls/MapgisStateControl              | 改名 | mapgis-state            | StateControl               | MapgisStateControl       | MapboxStateControl       |                                                            |
| UI/controls/MapgisSearchControl             | 改名 | mapgis-search           | FullscreenControl          | MapgisSearchControl      | MapboxSearchControl      |                                                            |
