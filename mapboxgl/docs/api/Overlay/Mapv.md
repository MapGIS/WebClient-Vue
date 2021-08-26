# Mapv

> mapgis-mapv-layer

## 属性

All common [layers props](/zh/api/Layers/README.md#props)

### `geojson`

- **类型:** `Object`
- **侦听属性**
- **描述:** 必填项，标准的 geojson 地理数据结构。

### `options`

- **类型:** `Object`
- **默认值:** `{ mapboxgl: { roam: true }, series: [{ coordinateSystem: 'mapboxgl', type: 'lines' }] }`
- **侦听属性**
- **描述:** options 参数参考 Mapv 框架的原生 API 创建。
- **默认值:**

  ```js
  var options = {
    context: "2d",
    draw: "heatmap"
  };
  ```

  ### `countField`

- **类型:** `String`
- **侦听属性**
- **默认值:** "count"
- **描述:** countField 是 geojson 对象中的 count 属性的属性名称，若不传入 countField，则默认 geojson 对象中 count 属性名称为“count”。

## 示例

```vue
<template>
  <mapgis-web-map
    class="main"
    :center="center"
    :accessToken="accessToken"
    :zoom="zoom"
    :map-style="mapStyle"
  >
    <mapgis-navigation-control position="top-right" />
    <mapgis-mapv-layer v-bind="{ ...mapoption }" />
  </mapgis-web-map>
</template>
<script>
import { MapgisWebMap, MapgisMavLayer } from "@mapgis/webclient-vue-mapboxgl";
import { BaseServer } from "@mapgis/webclient-es6-service";

export default {
  components: { MapgisWebMap, MapgisEcharts, BaseServer },
  data() {
    return {
      mapStyle: "mapbox://styles/mapbox/dark-v9",
      accessToken:
        "pk.eyJ1IjoicGFybmRlZWRsaXQiLCJhIjoiY2o1MjBtYTRuMDhpaTMzbXhpdjd3YzhjdCJ9.sCoubaHF9-nhGTA-sgz0sA",
      center: [114.321317, 30.398428],
      zoom: 3,
      mapoption: {
        options: {
          context: "2d",
          fillStyle: "rgba(55, 50, 250, 0.8)",
          size: 40,
          globalAlpha: 0.5,
          label: {
            show: true,
            fillStyle: "white",
            shadowColor: "yellow",
            font: "15px Arial",
            shadowBlur: 10
          },
          gradient: {
            0: "rgba(49, 54, 149, 0)",
            0.2: "rgba(69,117,180, 0.7)",
            0.3: "rgba(116,173,209, 0.7)",
            0.4: "rgba(171,217,233, 0.7)",
            0.5: "rgba(224,243,248, 0.7)",
            0.6: "rgba(254,224,144,0.7)",
            0.7: "rgba(253,174,97,0.7)",
            0.8: "rgba(244,109,67,0.8)",
            0.9: "rgba(215,48,39,0.8)",
            0.95: "rgba(165, 0, 38,0.8)"
          },
          shadowColor: "rgba(255, 255, 50, 1)",
          shadowBlur: 10,
          max: 100,
          draw: "grid"
        },
        geojson: {}
      }
    };
  },
  mounted() {
    this.initData();
  },
  methods: {
    initData() {
      this.geojson = {};
      let randomCount = 500;
      let data = [];
      while (randomCount--) {
        data.push({
          geometry: {
            type: "Point",
            coordinates: [75 + Math.random() * 50, 20.3 + Math.random() * 20]
          },
          properties: {
            count: 30 * Math.random()
          }
        });
      }
      this.geojson = {
        features: data
      };
    }
  }
};
</script>
<style lang="css">
.main {
  height: 600px;
  width: 100%;
}
</style>
```
