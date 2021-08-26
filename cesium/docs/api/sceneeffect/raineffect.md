# 雨组件

> mapgis-3d-rain-effect

## 属性

### `speed`

- **类型:** `Number`
- **默认值:** `1.0`
- **侦听属性**
- **描述:** 雨的速度，取值范围为[0,+∞]，数值越大，雨的速度越大

### `angle`

- **类型:** `Number`
- **默认值:** `0`
- **侦听属性**
- **描述:** 雨丝下落的角度，取值范围为[0,180]

### `enable`

- **类型:** `Boolean`
- **默认值:** `true`
- **侦听属性**
- **描述:** 控制雨组件的显示

## 雨组件使用方法

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
    <mapgis-3d-rain-effect :speed="speed" :angle="angle" :enable="enable" ref="rain">
    </mapgis-3d-rain-effect>
    <mapgis-ui-button @click="changeSpeed" class="changeSpeed">加快速度</mapgis-ui-button>
    <mapgis-ui-button @click="changeAngle" class="changeAngle">改变角度</mapgis-ui-button>
    <mapgis-ui-button @click="changeShow" class="changeShow">改变显示</mapgis-ui-button>
  </mapgis-web-scene>
</template>


<script>
export default {
  name: "rain_cesium",
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
      speed: 5.0,
      angle:0,
      enable:false,
    }
  },
  methods: {
    changeSpeed() {
      this.speed += 5;
    },
    changeAngle(){
      this.angle += 5;
      console.log("angle",this.angle)
    },
    changeShow() {
      let vm = this;
      vm.enable = !(vm.enable);
    }
  }
}
</script>

<style scoped>
.changeSpeed {
  position: absolute;
  top: 20px;
  left: 20px;
}
.changeAngle {
  position: absolute;
  top: 20px;
  left: 200px;
}
.changeShow {
  position: absolute;
  top: 20px;
  left: 400px;
}
</style>
```
