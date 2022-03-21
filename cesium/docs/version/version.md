# 更新说明

## 10.5.5.12

```sh
# 公网
yarn add @mapgis/webclient-es6-service@10.5.5-1
yarn add @mapgis/webclient-vue-cesium@10.5.5-3
yarn add @mapgis/webclient-vue-mapboxgl@10.5.5-5
yarn add @mapgis/webclient-vue-ui@10.5.5-3

# 内网 中地源 内网版本号要超前一些
yarn config set registry http://192.168.11.130:4873/
yarn add @mapgis/webclient-es6-service@10.5.5-3
yarn add @mapgis/webclient-vue-cesium@10.5.5-3
yarn add @mapgis/webclient-vue-mapboxgl@10.5.5-8
yarn add @mapgis/webclient-vue-ui@10.5.5-4
```

### 问题修复列表

| 分类     | 文件                   | bug 号 | 问题描述                                                |
| -------- | ---------------------- | ------ | ------------------------------------------------------- |
| 功能改进 | webclient-vue-mapboxgl | 无     |                                                         |
| 功能改进 | webclient-vue-cesium   | 无     | M3D 缺乏子图层控制能力                                  |
| 新增功能 | webclient-vue-cesium   | 无     | 一张图粒子特效下沉到 mapgis-vue-cesium 中               |
| 新增功能 | webclient-vue-cesium   | 无     | 新增动态标绘图层                                        |
| 新增功能 | webclient-vue-mapboxgl | 无     | 新增动态标绘图层                                        |
| 新增功能 | webclient-vue-ui       | 无     | 新增综合查询面板                                        |
| 功能改进 | webclient-vue-cesium   | 无     | mapgis-3d-Marker 需要鼠标移入移出事件                   |
| 性能优化 | webclient-vue-cesium   | 无     | 一张图三维热力图组件下沉到 mapgis-vue-cesium 中         |
| 性能优化 | webclient-vue-cesium   | 无     | 一张图三维量算组件下沉到 mapgis-vue-cesium 中           |
| 性能优化 | webclient-vue-mapboxgl | 无     | 一张图二维量算组件下沉到 mapgis-vue-mapboxgl 中         |
| 新增功能 | webclient-vue-cesium   | 无     | cesium 组件 mapgis-3d-draw 提供样式修改和贴地贴模型功能 |
| 新增功能 | webclient-vue-cesium   | 无     | 三维 cesium 缺少 Igserver 要素图层组件                  |
| 性能优化 | webclient-vue-cesium   | 无     | 一张图可视域分析下沉到 mapgis-vue-cesium 中             |
| 性能优化 | webclient-vue-cesium   | 无     | 一张图通视分析下沉到 mapgis-vue-cesium 中               |
| 性能优化 | webclient-vue-cesium   | 无     | 一张图阴影分析下沉到 mapgis-vue-cesium 中               |
| 性能优化 | webclient-vue-cesium   | 无     | 一张图天际线分析下沉到 mapgis-vue-cesium 中             |
| 性能优化 | webclient-vue-mapboxgl | 无     | mapgis-3d-vectortile-layer 没有排序能力                 |
| 新增功能 | webclient-vue-cesium   | 无     | 一张图剖面分析下沉到 mapgis-vue-cesium 中               |
| 新增功能 | webclient-vue-cesium   | 无     | 一张图填挖方分析下沉到 mapgis-vue-cesium 中             |
| 新增功能 | webclient-vue-cesium   | 无     | 一张图洪水淹没分析下沉到 mapgis-vue-cesium 中           |
| 新增功能 | webclient-vue-cesium   | 无     | 一张图等值线分析下沉到 mapgis-vue-cesium 中             |
| 新增功能 | webclient-vue-cesium   | 无     | 一张图坡向分析下沉到 mapgis-vue-cesium 中               |
| 新增功能 | webclient-vue-cesium   | 无     | 一张图坡度分析下沉到 mapgis-vue-cesium 中               |
| 新增功能 | webclient-vue-cesium   | 无     | 一张图剖切分析下沉到 mapgis-vue-cesium 中               |
| 性能优化 | webclient-vue-mapboxgl | 无     | geojson 的没有自定义 popup tip 的能力                   |
| 新增功能 | webclient-vue-mapboxgl | 无     | 没有默认的放大缩小的组件                                |
| 新增功能 | webclient-vue-mapboxgl | 无     | 没有默认的缩放值范围的组件                              |
| 新增功能 | webclient-vue-ui       | 无     | 一张图抽象 UI 下沉到 mapgis-vue-ui 中                   |
| 新增功能 | Cesium.js              | 无     | 缺少矢量地图文档加载接口                                |

### 接口更新列表

| 分类 | 文件                      | 接口名                                          | 接口类型 | 更新说明                                                |
| ---- | ------------------------- | ----------------------------------------------- | -------- | ------------------------------------------------------- |
| 新增 | webclient-vue-mapboxgl.js | mapgis-state                                    | 类       | 新增状态栏组件                                          |
| 新增 | webclient-vue-cesium.js   | mapgis-3d-igs-m3d                               | 属性     | 新增动态子图层可见性控制参数 layers                     |
| 新增 | webclient-vue-cesium.js   | mapgis-3d-dynamic-marker-layer                  | 类       | 新增动态标绘图层组件                                    |
| 新增 | webclient-vue-mapboxgl.js | mapgis-dynamic-marker-layer                     | 类       | 新增动态标绘图层组件                                    |
| 新增 | webclient-vue-cesium.js   | mouseEnter                                      | 枚举     | 新增鼠标移入事件                                        |
| 新增 | webclient-vue-cesium.js   | mouseLeave                                      | 枚举     | 新增鼠标移出事件                                        |
| 新增 | webclient-vue-cesium.js   | IgsFeatureLayer.                                | 类       | 新增 igs 要素查询组件                                   |
| 新增 | webclient-vue-cesium.js   | mapgis-3d-vectortile-layer.layerStyle           | 属性     | 新增矢量瓦片图层的图层排序能力                          |
| 新增 | webclient-vue-mapboxgl.js | mapgis-geojson-layer.customPopup                | 属性     | 新增 geojsonlayer 的自定义 Popup（JSX）能力             |
| 新增 | webclient-vue-mapboxgl.js | mapgis-geojson-layer.customTips                 | 属性     | 新增 geojsonlayer 的自定义 Tips（JSX）能力              |
| 新增 | webclient-vue-mapboxgl.js | mapgis-zoom                                     | 类       | 新增二维的放大缩小组件 mapgis-zoom                      |
| 新增 | webclient-vue-mapboxgl.js | mapgis-fitbounds                                | 类       | 新增二维的缩放至范围组件 mapgis-fitbounds               |
| 新增 | webclient-vue-ui.js       | mapgis-ui-icon                                  | 类       | 新增 mapgis-vue-ui 组件 mapgis-ui-icon                  |
| 新增 | webclient-vue-ui.js       | mapgis-ui-tooltip-button                        | 类       | 新增 mapgis-vue-ui 组件 mapgis-ui-tooltip-button        |
| 新增 | webclient-vue-ui.js       | mapgis-ui-command-card                          | 类       | 新增 mapgis-vue-ui 组件 mapgis-ui-command-card          |
| 新增 | webclient-vue-ui.js       | mapgis-ui-editable-table                        | 类       | 新增 mapgis-vue-ui 组件 mapgis-ui-editable-table        |
| 新增 | webclient-vue-ui.js       | mapgis-ui-row-flex                              | 类       | 新增 mapgis-vue-ui 组件 mapgis-ui-row-flex              |
| 新增 | webclient-vue-ui.js       | mapgis-ui-toolbar                               | 类       | 新增 mapgis-vue-ui 组件 mapgis-ui-toolbar               |
| 新增 | webclient-vue-ui.js       | mapgis-ui-toolbar-space                         | 类       | 新增 mapgis-vue-ui 组件 mapgis-ui-toolbar-space         |
| 新增 | webclient-vue-ui.js       | mapgis-ui-toolbar-title                         | 类       | 新增 mapgis-vue-ui 组件 mapgis-ui-toolbar-title         |
| 新增 | webclient-vue-ui.js       | mapgis-ui-toolbar-command                       | 类       | 新增 mapgis-vue-ui 组件 mapgis-ui-toolbar-command       |
| 新增 | webclient-vue-ui.js       | mapgis-ui-toolbar-command-group                 | 类       | 新增 mapgis-vue-ui 组件 mapgis-ui-toolbar-command-group |
| 新增 | Cesium.js                 | Cesium.WebSceneControl.appendMapGISVectorDocMap | 方法     | 加载 MapGIS 矢量地图文档                                |
| 新增 | Cesium.js                 | Cesium.WebSceneControl.removeMapGISVectorDocMap | 方法     | 移除 MapGIS 矢量地图文档                                |
