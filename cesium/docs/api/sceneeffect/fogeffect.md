# 雾组件

> mapgis-3d-fog-effect

## 属性

### `alpha`

- **类型:** `Number`
- **默认值:** `0`
- **侦听属性**
- **描述:** 控制雾的透明度，取值范围为[0,1]，值越大，雾的透明度越低。

### `enable`

- **类型:** `Boolean`
- **默认值:** `true`
- **侦听属性**
- **描述:** 控制雾组件的显示

## 雾组件使用方法

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
    <mapgis-3d-fog-effect :alpha="alpha" :enable="enable"></mapgis-3d-fog-effect>
    <mapgis-ui-button @click="changeAlpha" class="changeAlpha">改变透明度</mapgis-ui-button>
    <mapgis-ui-button @click="changeShow" class="changeShow">改变显示</mapgis-ui-button>
  </mapgis-web-scene>
</template>


<script>
export default {
  name: "fogczm",
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
      alpha:0.1,
    }
  },
  methods:{
    changeShow() {
      let vm = this;
      vm.enable = !(vm.enable);
    },
    changeAlpha(){
      this.alpha += .05;
      console.log("alpha",this.alpha)
    },
  }
}
</script>

<style scoped>
.changeAlpha {
  position: absolute;
  top: 20px;
  right: 20px;
}
.changeShow {
  position: absolute;
  top: 20px;
  right: 200px;
}
</style>
```
