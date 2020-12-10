# WebGlobe

## Props


## Events

所有的事件的载荷payload都具有下面的结构

- `webGlobe` 初始化的WebGlobe地图容器
- `Cesium` 原生的Cesium对象
- `component` WebGlobe对应的Vue组件

### `@load`

- **Description:** 地图完整加载后回调事件
- **Payload** `{ webGlobe, component, Cesium }` 
  - `webGlobe` 初始化的WebGlobe地图容器
  - `Cesium` 原生的Cesium对象
  - `component` WebGlobe对应的Vue组件
