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

- **类型:** `Array`
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
      addExtrudedHeight: true
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
    }
  }
};
</script>
```
