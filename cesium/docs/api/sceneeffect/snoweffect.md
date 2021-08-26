# 雪组件

> mapgis-3d-snow-effect

## 属性

### `enable`

- **类型:** `Boolean`
- **默认值:** `true`
- **侦听属性**
- **描述:** 控制雪组件的显示

## 雪组件使用方法

```vue
<template>
  <mapgis-web-scene
      lib-path="static/libs/cdn/cesium/Cesium.js"
      plugin-path="static/libs/cdn/zondyclient/webclient-cesium-plugin.min.js"
  >
    <mapgis-3d-ogc-wmts-layer
        :baseUrl="urlT"
        :wmtsLayer="layer"
        :tileMatrixSet="tileMatrixSetID"
        :format="format"
        :tilingScheme="srs"
        :token="token"
    />
    <mapgis-3d-igs-m3d
        :auto-reset="autoReset"
        :maximum-screen-space-error="maximumScreenSpaceError"
        :url="m3dUrl"
    >
    </mapgis-3d-igs-m3d>
    <mapgis-3d-snow-effect :enable="enable"></mapgis-3d-snow-effect>
    <mapgis-ui-button @click="changeShow" class="changeShow">改变显示</mapgis-ui-button>
  </mapgis-web-scene>
</template>


<script>
export default {
  name: "snowczm",
  data() {
    return {
      //天地图参数
      urlT: "http://t0.tianditu.gov.cn/img_c/wmts",
      tileMatrixSetID: "c",
      srs: "EPSG:4326",
      layer: "img",
      format: "tiles",
      token: {
        key: "tk",
        value: "f5347cab4b28410a6e8ba5143e3d5a35"
      },
      m3dUrl: "http://develop.smaryun.com:6163/igs/rest/g3d/ZondyModels",
      autoReset: true,
      maximumScreenSpaceError: 8,
      enable:true,
    }
  },
  methods:{
    changeShow() {
      let vm = this;
      vm.enable = !(vm.enable);
    }
  }
}
</script>

<style scoped>

.changeShow {
  position: absolute;
  top: 20px;
  left: 20px;
}
</style>
```
