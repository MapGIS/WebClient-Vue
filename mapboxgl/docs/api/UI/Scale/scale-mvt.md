# 比例尺

> mapgis-custom-scale

## 示例

::: demo

```html
<template>
  <mapgis-web-map class="mapgis-2d-map" v-bind="{ ...mapOptions }">
    <mapgis-custom-scale :outStyle="scaleStyle" />
  </mapgis-web-map>
</template>

<script>
  export default {
    components: {
      "mapgis-web-map": window.Mapgis2d.MapgisWebMap,
      "mapgis-custom-scale": window.Mapgis2d.MapgisCustomScale
    },
    data() {
      return {
        mapOptions: {
          crs: "EPSG:4326", //经纬度一定要设置crs参数
          maxBounds: [
            [-180, -90],
            [180, 90]
          ],
          zoom: 2.5,
          center: [110, 30],
          //设置地图样式信息
          mapStyle:
            "http://develop.smaryun.com:6163/igs/rest/mrms/vtiles/styles/OSM全中国经纬度.json"
        },
        scaleStyle: {
          position: "absolute",
          zIndex: 9000,
          left: "10px",
          bottom: "20px",
          maxHeight: "150px",
          width: "220px"
        }
      };
    },
    methods: {
      hideCollapseScale() {
        if (this.$refs.collapsescale) {
          this.$refs.collapsescale.hide();
        }
      }
    }
  };
</script>

<style>
  .mapgis-2d-map {
    height: 350px;
  }
</style>
```

:::

## 属性

### `outStyle`

- **类型:** `Object`
- **默认值:** `{ left: "10px", top: "10px" }`
- **非侦听属性**
- **描述:** 图例默认显示位置与大小

## 方法

### update

- **描述:** 强行刷新渲染比例尺
