# Measure

## 属性

### `measureMode`

- **类型:** `String`
- **必传**
- **非侦听属性**
- **描述:** 测量方式。measure-length(长度测量) | measure-area(面积测量)

### `measureMethod`

- **类型:** `String`
- **默认值:** `both`
- **侦听属性**
- **描述:** 计算方法。both（返回两种方式计算的结果） | geography(按照地理坐标系计算) | projection(按照投影坐标系计算)

## 槽

### `measureTool`

- **描述:** 自定义测量组件插槽

### `measureMarker`

- **描述:** 自定义测量组件标注插槽

## 事件

### `@added`

- **属性值:** `drawer` 当前绘制组件对象
- **描述:** 当绘制组件添加后，向父组件传递当前绘制组件对象

### `@measureResult`

- **属性值:** `result` 测量结果，单位为 米|平方米；`coordinates` 被测量对象的坐标点集合
- **描述:** 向父组件传递测量结果和被测量对象的坐标点集合

### `@removed`

- **描述:** 当移除绘制组件后，通知父组件已移除绘制组件

## 示例

```vue
<template>
  <mapbox-map
    class="main"
    :accessToken="accessToken"
    :mapStyle="mapStyle"
    :zoom="mapZoom"
    :center="outerCenter"
    :crs="mapCrs"
  >
    <mapbox-measure
      class="custom-draw-wrapper"
      position="bottom-left"
      :measureMode="measureMode"
      measureMethod="geography"
      @added="handleAdded"
      @measureResult="getMeasureResult"
    >
      <el-button-group slot="measureTool">
        <el-tooltip
          v-for="(item, i) in buttons"
          :key="i"
          class="item"
          effect="dark"
          :content="item.tip"
          placement="bottom"
        >
          <el-button circle size="small" :type="item.type" @click="item.click">
            <icon-font :type="item.icon" />
          </el-button>
        </el-tooltip>
      </el-button-group>
      <div slot="measureMarker">
        <mapbox-marker
          v-for="(item, i) in measureMarkers"
          :key="'measuer-marker-' + i"
          :coordinates="item.coordinates"
        >
          <div slot="marker" :style="item.style">{{ item.text }}</div>
        </mapbox-marker>
      </div>
    </mapbox-measure>
  </mapbox-map>
</template>

<script>
const measureModes = {
  measureLength: "measure-length",
  measureArea: "measure-area"
};
export default {
  name: "MeasureExample",
  data() {
    return {
      accessToken:
        "pk.eyJ1IjoicGFybmRlZWRsaXQiLCJhIjoiY2o1MjBtYTRuMDhpaTMzbXhpdjd3YzhjdCJ9.sCoubaHF9-nhGTA-sgz0sA", // 使用mapbox样式需要的秘钥
      mapStyle: "mapbox://styles/mapbox/light-v9", // 地图样式
      mapZoom: 3, // 地图初始化级数
      outerCenter: [130, 30], // 地图显示中心
      mapCrs: "EPSG:3857",

      buttons: [
        {
          icon: "icon-measurelength",
          type: "default",
          tip: "长度测量",
          click: this.toggleMeasureLength
        },
        {
          icon: "icon-measurearea",
          type: "default",
          tip: "面积测量",
          click: this.toggleMeasureArea
        },
        {
          icon: "icon-trash",
          type: "default",
          tip: "删除",
          click: this.toggleDelete
        }
      ],
      measureMode: null,
      measureMarkers: []
    };
  },
  components: {
    MapboxMap,
    MapboxMeasure,
    MapboxMarker,
    IconFont
  },
  created() {
    // 在组件中使用mapbox-gl.js的脚本库功能
    this.mapbox = Mapbox;
  },
  methods: {
    handleAdded(e) {
      let { drawer } = e;
      this.drawer = drawer;
    },
    getMeasureResult(result) {
      console.log(result);
      let formateResult;
      let marker;
      switch (this.measureMode) {
        case measureModes.measureLength:
          formateResult = (result.result / 1000).toFixed(2);
          marker = {
            coordinates: result.coordinates[result.coordinates.length - 1],
            text: formateResult + "千米",
            style: "color:red"
          };
          this.measureMarkers.push(marker);
          break;
        case measureModes.measureArea:
          formateResult = (result.result / 1000000).toFixed(2);
          marker = {
            coordinates: this.getCenterOfGravityPoint(result.coordinates[0]),
            text: formateResult + "平方千米",
            style: "color:red"
          };
          this.measureMarkers.push(marker);
          break;
      }
    },
    getCenterOfGravityPoint(lnglats) {
      let area = 0.0; // 多边形面积
      let Gx = 0.0;
      let Gy = 0.0; // 重心的x、y
      for (let i = 1; i <= lnglats.length; i++) {
        const iLat = lnglats[i % lnglats.length][1];
        const iLng = lnglats[i % lnglats.length][0];
        const nextLat = lnglats[i - 1][1];
        const nextLng = lnglats[i - 1][0];
        const temp = (iLat * nextLng - iLng * nextLat) / 2.0;
        area += temp;
        Gy += (temp * (iLat + nextLat)) / 3.0;
        Gx += (temp * (iLng + nextLng)) / 3.0;
      }
      return [Gx / area, Gy / area];
    },
    toggleMeasureLength() {
      if (this.measureMode !== measureModes.measureLength) {
        this.measureMarkers = [];
      }
      this.measureMode = measureModes.measureLength;
      this.drawer && this.drawer.changeMode("draw_line_string");
    },
    toggleMeasureArea() {
      if (this.measureMode !== measureModes.measureArea) {
        this.measureMarkers = [];
      }
      this.measureMode = measureModes.measureArea;
      this.drawer && this.drawer.changeMode("draw_polygon");
    },
    toggleDelete() {
      this.measureMarkers = [];
      this.drawer && this.drawer.deleteAll();
    }
  }
};
</script>

<style lang="css">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
}

.main {
  height: 100vh;
  width: 100%;
}

.button {
  border: #000 2px solid;
  height: 30px;
  text-align: center;
}
</style>
```
