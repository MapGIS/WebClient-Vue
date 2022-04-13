> mapgis-3d-graph-theme-layer

## 属性

### `geojson`

- **类型:** `Object`
- **必选:**
- **侦听属性**
- **描述:** 必填项，标准的 geojson 地理数据结构。

### `type`

- **类型:** `String`
- **必选:**
- **侦听属性**
- **描述:** 统计图类型，可设置为"HorizontalColumn", "Pie", "VerticalColumn"。

### `attributeName`

- **类型:** `Array`
- **必选:**
- **非侦听属性**
- **描述:** 用于显示的属性名（统计字段）

### `attributeColor`

- **类型:** `Array<String>`
- **必选:**
- **非侦听属性**
- **描述:** 各个属性对应的颜色

### `width`

- **类型:** `Number`
- **可选:**
- **非侦听属性**
- **描述:** 显示柱状体或饼状的宽度
- **默认值:** 50000

### `addExtrudedHeight`

- **类型:** `Boolean`
- **可选:**
- **非侦听属性**
- **描述:** 是否为饼状体添加高度
- **默认值:** true

### `textFont`

- **类型:** `String`
- **可选:**
- **非侦听属性**
- **描述:** 标注字体
- **默认值:** "50px Helvetica"

### `textColor`

- **类型:** `String`
- **可选:**
- **非侦听属性**
- **描述:** 标注颜色
- **默认值:** "#008000"

### `textHeightOffset`

- **类型:** `Number`
- **可选:**
- **非侦听属性**
- **描述:** 字体高度的偏移值
- **默认值:** 10000

## 事件

### `@load`

- **Description:** 在 Mapgis3dGraphThemeLayer 加载完毕后发送该事件
- **Payload** Mapgis3dGraphThemeLayer 组件对象

### `@unload`

- **Description:** 关闭 Mapgis3dGraphThemeLayer 组件前发送该事件
- **Payload** Mapgis3dGraphThemeLayer 组件对象

### `@click`

- **Description:** 左击统计图时 发送该事件
- **Payload** 点击的统计图所在的 feature 属性

### `@hover`

- **Description:** 鼠标移至统计图上时 发送该事件
- **Payload** 鼠标经过的统计图所在的 feature 属性

## 示例

```vue
import axios from "axios";
<template>
  <mapgis-web-scene :style="{ height: '95vh' }">
    <mapgis-3d-graph-theme-layer
      v-if="geojson"
      :geojson="geojson"
      :type="type"
      :attributeName="attributeName"
      :attributeColor="attributeColor"
      :width="width"
      :addExtrudedHeight="addExtrudedHeight"
      :textFont="textFont"
      :textColor="textColor"
      :textHeightOffset="textHeightOffset"
      @load="load"
    />
  </mapgis-web-scene>
</template>
<script>
export default {
  data() {
    return {
      graphThemeLayer: undefined,
      geojson: {},
      type: "HorizontalColumn",
      attributeName: ["GDP_2007", "GDP_2008"],
      attributeColor: ["#FFB980", "#5AB1EF"],
      width: 50000,
      addExtrudedHeight: true,
      textFont: "50px Helvetica",
      textColor: "#008000",
      textHeightOffset: 10000,
    };
  },
  mounted() {
    this.initData();
  },
  methods: {
    async initData() {
      const vm = this;
      this.geojson = {};
      let result = await axios.get("./geojson/省级行政区x.geojson");
      const { data } = result;
      vm.geojson = { ...data };
      if (vm.graphThemeLayer) {
        vm.graphThemeLayer.addGraphLayer();
      }
    },
    load(graphThemeLayer) {
      this.graphThemeLayer = graphThemeLayer;
      this.initData();
    },
  },
};
</script>
```
