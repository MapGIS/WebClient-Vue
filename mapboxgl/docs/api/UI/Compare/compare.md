# Compare

## 属性

### `orientation`

- **类型:** `String`
- **侦听属性**
- **默认值:** `vertical`
- **描述:** 卷帘显示方向。vertical(垂直方向) | horizontal(水平方向)

## 示例

```vue
<template>
  <mapgis-compare :orientation="orientation">
    <mapgis-web-map slot="beforeMap" v-bind="{ ...beforeMapOptions }">
      <mapgis-ogc-wmts-layer v-bind="{ ...beforeLayerOptions }">
      </mapgis-ogc-wmts-layer>
      <div
        style="
                    display: inline-flex;
                    position: absolute;
                    top: 20px;
                    left: 20px;
                    z-index: 9999;
                "
      >
        <div
          style="
                        padding: 6px 16px;
                        background: #fff;
                        border: 1px dashed #666;
                        font-size: 20px;
                        line-height: 20px;
                        text-align: center;
                        cursor: pointer;
                    "
          @click="handleVertical"
        >
          垂直
        </div>
        <div
          style="
                        padding: 6px 16px;
                        background: #fff;
                        border: 1px dashed #666;
                        font-size: 20px;
                        line-height: 20px;
                        text-align: center;
                        cursor: pointer;
                    "
          @click="handleHorizontal"
        >
          水平
        </div>
      </div>
    </mapgis-web-map>
    <mapgis-web-map slot="afterMap" v-bind="{ ...afterMapOptions }">
      <mapgis-ogc-wmts-layer v-bind="{ ...afterLayerOptions }">
      </mapgis-ogc-wmts-layer>
    </mapgis-web-map>
  </mapgis-compare>
</template>

<script>
export default {
  data() {
    return {
      orientation: "vertical",
      beforeMapOptions: {
        mapStyle: {
          version: 8,
          sources: {},
          layers: []
        },
        zoom: 2,
        center: [116.39, 40.2],
        crs: "EPSG:4326"
      },
      beforeLayerOptions: {
        layer: {},
        layerId: "ogcwmts_layerId",
        sourceId: "ogcwmts_sourceId",
        url:
          "http://t0.tianditu.com/DataServer?T=ter_c&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752"
      },
      afterMapOptions: {
        mapStyle: {
          version: 8,
          sources: {},
          layers: []
        },
        zoom: 2,
        center: [116.39, 40.2],
        crs: "EPSG:4326"
      },
      afterLayerOptions: {
        layer: {},
        layerId: "ogcwmts_layerId",
        sourceId: "ogcwmts_sourceId",
        url:
          "http://t0.tianditu.com/DataServer?T=vec_c&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752"
      }
    };
  },
  methods: {
    handleVertical() {
      this.orientation = "vertical";
    },
    handleHorizontal() {
      this.orientation = "horizontal";
    }
  }
};
</script>
```
