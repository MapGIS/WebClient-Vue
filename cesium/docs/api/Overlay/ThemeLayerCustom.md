> mapgis-3d-theme-layer-custom

## 属性

### `vueKey`

- **类型:** `String`
- **可选**
- **非侦听属性**
- **默认值:** `default`
- **描述:** mapgis-web-scene 组件的 ID，当使用多个 mapgis-web-scene 组件时，需要指定该值，来唯一标识 mapgis-web-scene 组件，同时 mapgis-web-scene 插槽中的组件也需要传入相同的 vueKey，让组件知道应该作用于哪一个 mapgis-web-scene。

### `vueIndex`

- **类型:** `Number`
- **可选**
- **非侦听属性**
- **默认值:** `(Math.random() * 100000000).toFixed(0)`随机计算值
- **描述:** 当 mapgis-web-scene 插槽中使用了多个相同组件时，例如多个 mapgis-3d-igs-doc-layer 组件，用来区分组件的标识符。

### `baseUrl`

- **类型:** `String`
- **必选:**
- **侦听属性**
- **描述:** 必填项，标准的 geojson 地理数据文件。

### `layerId`

- **类型:** `String`
- **可选**
- **侦听属性**
- **默认值:**`矢量图层`
- **描述:** 专题图层的 Id。

### `type`

- **类型:** `String`
- **必选**
- **侦听属性**
- **默认值:**`uniform`
- **描述:** 三维专题图类型，包括`uniform`、`unique`、`range`、`gradual`、`random`。

### `field`

- **类型:** `String`
- **可选**
- **侦听属性**
- **默认值:**``
- **描述:** 三维专题图字段名称，用于专题图符号化绘制，在统一专题图、随机专题图中可隐藏，在单值专题图、分段专题图、渐变专题图中必须填写。

### `type`

- **类型:** `String`
- **必选**
- **非侦听属性**
- **默认值:**`uniform`
- **描述:** 三维专题图类型，包括`uniform`、`unique`、`range`、`random`。

### `themeOptions`

- **类型:** `Object`
- **必选:**
- **侦听属性**
- **默认值**
- **描述:** 必填项，专题图绘制规则。

### `filter`

- **类型:** `Object`
- **可选**
- **侦听属性**
- **默认值**
- **描述:** 必填项，外部可传入 filter，内部监听 filter 实现交互。

### `filterOptions`

- **类型:** `Object`
- **可选**
- **侦听属性**
- **默认值**
- **描述:** 必填项，外部可传入 filter，内部监听 filterOptions 实现样式变化。

### `autoReset`

- **类型:** `Boolean`
- **可选**
- **侦听属性**
- **默认值:**`true`
- **描述:** 专题图跳转，在加载专题图时，视角会飞行到专题图上，和 offsetHeight 大小有关。

### `offsetHeight`

- **类型:** `Number`
- **可选**
- **非侦听属性**
- **默认值:`4000`**
- **描述:** 专题图高度，当相机视角高度高于 offsetHeight，专题图不可见；低于 offsetHeight，专题图显示。

### `enableHighlight`

- **类型:** `Boolean`
- **可选**
- **非侦听属性**
- **默认值:`false`**
- **描述:** 将专题地图中指定的要素进行高亮显示

### `highlightStyle`

- **类型:** `Object`
- **必选:**
- **非侦听属性**
- **描述:** 将专题地图中指定的要素进行高亮显示

### `visible`

- **类型:** `Boolean`
- **可选:**
- **非侦听属性**
- **描述:** 控制专题地图是否显示
- **默认值:** true

## 事件

### `@load`

- **Description:** 在 Mapgis3dThemeLayerCustom 加载完毕后发送该事件
- **Payload** Mapgis3dThemeLayerCustom 组件对象

### `@unload`

- **Description:** 关闭 Mapgis3dThemeLayerCustom 组件前发送该事件
- **Payload** Mapgis3dThemeLayerCustom 组件对象

### `@bbox`

- **Description:** 解析数据时发送该事件
- **Payload** geojson 数据范围（包围盒）

### `@themeClick`

- **Description:** 左击专题图时 发送该事件
- **Payload** 点击的专题图所在的 entity 属性

### `@themeHover`

- **Description:** 鼠标移至专题图上时 发送该事件
- **Payload** 鼠标经过的专题图所在的 entity 属性

## 示例

```vue
import { Style } from "@mapgis/webclient-es6-service"; const { LineStyle,
PointStyle, FillStyle, Shadow } = Style;
<template>
  <mapgis-web-scene :style="{ height: '95vh' }">
    <mapgis-3d-theme-layer-custom
      v-bind="$props"
      @load="load"
      @unload="unload"
      @bbox="handlebbox"
      @themeClick="handleClick"
      @themeHover="handleHover"
    />
  </mapgis-web-scene>
</template>
<script>
export default {
  data() {
    return {
      baseUrl: "http://localhost:8895/geojson/420000_full.json",
      visible: true,
      themeOptions: {
        type: "range-value",
        field: "childrenNum",
        rangeValueInfos: [
          {
            start: 0,
            end: 3,
            symbolStyle: new FillStyle({
              color: "#ff0000",
              outlineColor: "#ff0000",
              outlineWidth: 1,
              opacity: 1,
            }),
          },
          {
            start: 3,
            end: 6,
            symbolStyle: new FillStyle({
              color: "#ff4b4b",
              outlineColor: "#ff4b4b",
              outlineWidth: 1,
              opacity: 1,
            }),
          },
          {
            start: 6,
            end: 9,
            symbolStyle: new FillStyle({
              color: "#ff8282",
              outlineColor: "#ff8282",
              outlineWidth: 1,
              opacity: 1,
            }),
          },
          {
            start: 9,
            end: 12,
            symbolStyle: new FillStyle({
              color: "#ffafaf",
              outlineColor: "#ffafaf",
              outlineWidth: 1,
              opacity: 1,
            }),
          },
          {
            start: 12,
            end: 15,
            symbolStyle: new FillStyle({
              color: "#ffdcdc",
              outlineColor: "#ffdcdc",
              outlineWidth: 1,
              opacity: 1,
            }),
          },
        ],
      },
    };
  },
  methods: {},
};
</script>
```
