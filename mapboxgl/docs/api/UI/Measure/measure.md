# Measure

## 属性

### `editable`

- **类型:** `Boolean`
- **默认值:** `true`
- **非侦听属性**
- **描述:** 控制双击结束测量时图形的编辑状态，为 false 时双击后创建图形为不可编辑状态

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

- **属性值:** `measure` 当前绘制组件对象
- **描述:** 当绘制组件添加后，向父组件传递当前绘制组件对象

### `@measureResult`

- **属性值:** `result` 测量结果，单位为 米|平方米；`coordinates` 被测量对象的坐标点集合
- **描述:** 向父组件传递测量结果和被测量对象的坐标点集合

### `@measureCreate`

- **属性值:** `result` 测量结果，单位为 米|平方米；`coordinates` 被测量对象的坐标点集合
- **描述:** 向父组件传递测量结果和被测量对象的坐标点集合

### `@removed`

- **描述:** 当移除绘制组件后，通知父组件已移除绘制组件

## 示例

```vue
<template>
  <mapgis-web-map
    class="main"
    :accessToken="accessToken"
    :mapStyle="mapStyle"
    :zoom="mapZoom"
    :center="outerCenter"
    :crs="mapCrs"
    @load="handleMapLoad"
  >
    <mapgis-measure
      position="top-left"
      :controls="controls"
      :measureMode="measureMode"
      ref="measure"
      @measurecreate="handleMeasureCreate"
      @measureresult="handleMeasureResult"
      @added="handleMeasureAdded"
    >
      <mapgis-ui-button-group class="mapgis-2d-measure-wrapper">
        <mapgis-ui-tooltip
          v-for="(item, i) in measures"
          :key="i"
          placement="bottom"
        >
          <template slot="title">
            <span>{{ item.tip }}</span>
          </template>
          <mapgis-ui-button
            circle
            size="small"
            :type="item.type"
            @click="item.click"
          >
            <mapgis-ui-iconfont :type="item.icon" />
          </mapgis-ui-button>
        </mapgis-ui-tooltip>
      </mapgis-ui-button-group>
      <mapgis-marker
        color="#ff0000"
        :coordinates="coordinates"
        v-if="coordinates.length > 0"
      >
        <div slot="marker" class="label">
          <div>面积：{{ area }}</div>
          <div>周长：{{ perimeter }}</div>
        </div>
      </mapgis-marker>
    </mapgis-measure>
  </mapgis-web-map>
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

      measureMode: "",
      coordinates: [],
      area: 0,
      perimeter: 0,
      measure: undefined,
      measures: [
        {
          icon: "mapgis-erweixian",
          type: "default",
          tip: "长度测量",
          click: this.toggleMeasureLength
        },
        {
          icon: "mapgis-erweiqu",
          type: "primary",
          tip: "面积测量",
          click: this.toggleMeasureArea
        },
        {
          icon: "mapgis-shanchudangqianziceng",
          type: "primary",
          tip: "删除测量",
          click: this.toggleMeasureDelete
        }
      ]
    };
  },
  created() {
    // 在组件中使用mapbox-gl.js的脚本库功能
    this.mapbox = Mapbox;
  },
  methods: {
    handleMapLoad(payload) {
      this.map = payload.map;
    },
    handleMeasureAdded(e) {
      let { measure } = e;
      this.measure = measure;
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
    enableMeasure() {
      const component = this.$refs.measure;
      if (component) {
        component.enableMeasure();
      }
    },
    handleMeasureCreate(e) {
      // this.measure && this.measure.deleteAll();
      console.log("绘制结果", e);
      this.disableDrag();
    },
    handleMeasureResult(e) {
      console.log("测量结果", e);
      this.disableDrag();
      const coords = e.center.geometry.coordinates;
      this.coordinates = coords;
      this.area = e.geographyArea || "无";
      this.perimeter = e.geographyPerimeter;
    },
    disableDrag() {
      const vm = this;
      vm.map.on("draw.selectionchange", e => {
        const { features, points } = e;
        const hasLine = features && features.length > 0;
        const hasPoints = points && points.length > 0;
        if (hasLine && !hasPoints) {
          // line clicked
          if (vm.measure.getMode() !== "direct_select") {
            vm.measure.changeMode("simple_select", { featureIds: [] });
            // vm.measure.changeMode('direct_select', { featureId: features[0].id });
          }
        } else if (hasLine && hasPoints) {
          // line vertex clicked
        } else if (!hasLine && !hasPoints) {
          // deselected
        }
      });
    },
    toggleMeasureLength() {
      this.enableMeasure();
      this.coordinates = [];
      this.measureMode = "measure-length";
      this.measure && this.measure.changeMode("draw_line_string");
    },
    toggleMeasureArea() {
      this.enableMeasure();
      this.coordinates = [];
      this.measureMode = "measure-area";
      this.measure && this.measure.changeMode("draw_polygon");
    },
    toggleMeasureDelete() {
      this.coordinates = [];
      this.enableMeasure();
      this.measure && this.measure.deleteAll();
    }
  }
};
</script>
```
