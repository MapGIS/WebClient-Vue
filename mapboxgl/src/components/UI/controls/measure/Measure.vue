<template>
  <div>
    <slot v-if="measure"></slot>
    <!-- slot for measureTool -->
    <slot name="measureTool" />
    <!-- slot for measureMarker -->
    <slot name="measureMarker" />
    <div class="mapgis-measure-control" v-show="enableControl">
      <mapgis-ui-space>
        <mapgis-ui-tooltip
          v-for="(item, i) in measures"
          :key="i"
          placement="bottom"
        >
          <template slot="title">
            <span>{{ item.tip }}</span>
          </template>
          <mapgis-ui-button
            shape="circle"
            :type="item.type"
            @click="item.click"
            :class="item.className"
          >
            <mapgis-ui-iconfont
              :type="item.icon"
              :class="item.className"
              theme="filled"
            />
          </mapgis-ui-button>
        </mapgis-ui-tooltip>
      </mapgis-ui-space>
      <mapgis-marker
        color="#ff0000"
        :coordinates="coordinates"
        v-if="coordinates.length > 0 && enableControl"
      >
        <div slot="marker" class="mapgis-measure-control-label">
          <div class="mapgis-measure-control-label-span">面积：{{ area }}</div>
          <div class="mapgis-measure-control-label-span">
            周长：{{ perimeter }}
          </div>
        </div>
      </mapgis-marker>
    </div>
  </div>
</template>

<script>
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import * as turf from "@turf/turf";

import * as MapboxDrawCom from "@mapbox/mapbox-gl-draw";
const MapboxDraw = MapboxDrawCom.default;

import measureMixin from "./measureMixin";
import controlMixin from "../withControlEvents";

import DefaultMeasureStyle from "./DefaultMeasureStyle";

const measureEvents = {
  // es6
  measureCreate: "draw.create",
  measureUpdate: "draw.update",
  measureResult: "measureResult",
  // brower
  measurecreate: "draw.create",
  measureupdate: "draw.update",
  measureresult: "measureresult"
};

const measureModes = {
  measureLength: "measure-length",
  measureArea: "measure-area"
};
const measureMethods = {
  geography: "geography",
  projection: "projection",
  both: "both"
};

export default {
  name: "mapgis-measure",
  mixins: [measureMixin, controlMixin],

  provide() {
    const self = this;
    return {
      get measure() {
        // 提供给子组件popup或者插槽
        return self.measure;
      }
    };
  },

  props: {
    editable: {
      type: Boolean,
      default: true
    },
    expandControl: {
      type: Boolean,
      default: false
    },
    enableControl: {
      type: Boolean,
      default: false
    },
    measureMode: {
      type: String,
      /* required: true, */
      default: ""
    },
    measureMethod: {
      type: String,
      default: "both" //geography按照地理坐标系计算长度和面积，projection按照投影坐标系计算长度和面积，both返回两种坐标系的计算结果
    },
    styles: {
      type: Array,
      default: () => DefaultMeasureStyle
    }
  },

  data() {
    return {
      initial: true,
      measure: undefined,
      oldStyles: DefaultMeasureStyle,
      area: 0,
      perimeter: 0,
      coordinates: [],
      innermeasureMode: "",
      measures: [
        {
          icon: "mapgis-huizhi1",
          type: "primary",
          tip: "展开",
          click: this.changeFold,
          className: "mapgis-measure-expand"
        },
        {
          icon: "mapgis-ruler",
          type: "primary",
          tip: "长度",
          click: this.toggleMeasureLength
        },
        {
          icon: "mapgis-area",
          type: "primary",
          tip: "面积",
          click: this.toggleMeasureArea
        },
        {
          icon: "mapgis-shanchu_dianji",
          type: "primary",
          tip: "清空图元",
          click: this.toggleMeasureDelete
        }
      ]
    };
  },

  watch: {
    measureMode() {
      const { measure, initial } = this;
      if (initial) return;
      if (measure) {
        // measure.deleteAll();
        // measure.trash();
      }
    },
    measureMethod() {
      this._updateLengthOrArea();
    },
    styles: {
      handler: function(news) {
        this.oldStyles = this.combineStyle(news);
      }
    }
  },

  mounted() {
    this.$_initMeasure();
    if (this.enableControl) {
      let position = this.position;
      if (this.expandControl) {
        this.changeFold();
      } else {
        let pos = position.split("-");
        document.querySelector(
          ".mapgis-measure-control > .mapgis-ui-space"
        ).style = pos[0] + ": 10px;" + pos[1] + ": 10px;";
      }
    }
  },

  beforeDestroy() {
    this.remove();
  },

  methods: {
    enableMeasure() {
      this.$_initMeasure();
      this.$_compareStyle();
      this.$_unbindDrawEvents();
      this.$_addMeasureControl(this.measure);
      this.$_emitEvent("added", { measure: this.measure });
      const eventNames = Object.keys(measureEvents);
      this.$_unbindMeasureEvents();
      this.$_bindSelfEvents(eventNames);
    },

    $_initMeasure() {
      const draweroptions = {
        displayControlsDefault: true,
        defaultMode: "simple_select",
        touchEnabled: false,
        boxSelect: false,
        controls: {
          point: false,
          line_string: false,
          polygon: false,
          trash: false,
          combine_features: false,
          uncombine_features: false
        },
        styles: this.oldStyles
      };
      this.measure = new MapboxDraw(draweroptions);

      const eventNames = Object.keys(measureEvents);
      this.$_bindSelfEvents(eventNames);

      this.initial = false;
    },

    $_bindSelfEvents(events) {
      if (events.length === 0) return;
      // asControl 本身是拥有 $_bindSelfEvents 方法的，但是这里的draw组件并不是遵循的mapbox-gl.js的事件机制，
      // 因此我们需要覆盖该方法, 按照对应的业务方式实现
      const vm = this;

      // 使用vue的this.$listeners方式来订阅用户指定的事件
      Object.keys(this.$listeners)
        .concat([
          "measureCreate",
          "measurecreate",
          "measureUpdate",
          "measureupdate"
        ])
        .forEach(eventName => {
          if (events.includes(eventName)) {
            this.$_bindMeasureEvents(
              measureEvents[eventName],
              vm.$_emitMeasureEvent.bind(vm, eventName)
            );
          }
        });
    },

    // 按照@mapgis/webclient-vue-mapboxgl的规范 发送事件 ，其实就是用{type：eventName}包装事件名
    $_emitMeasureEvent(eventName, eventData) {
      const vm = this;
      if (eventName === "measureCreate" || eventName === "measurecreate") {
        const result = vm._updateLengthOrArea();
        vm.$emit(measureEvents.measureresult, result);
        vm.$emit(measureEvents.measureResult, result);
        this.disableDrag();
        if (result.center) {
          const coords = result.center.geometry.coordinates;
          vm.coordinates = coords;
        }
        vm.area = result.geographyArea || "无";
        vm.perimeter = result.geographyPerimeter;
        if (!this.editable) {
          window.setTimeout(() => {
            vm.measure && vm.measure.changeMode("simple_select");
          }, 100);
        }
      }
      if (eventName === "measureUpdate" || eventName === "measureupdate") {
        const result = vm._updateLengthOrArea();
        vm.$emit(measureEvents.measureresult, result);
        vm.$emit(measureEvents.measureResult, result);
      }
      return vm.$_emitSelfEvent({ type: eventName }, eventData);
    },

    $_compareStyle() {
      let combines = this.combineStyle();
      this.changeMapStyle(combines);
      this.oldStyles = combines;
    },

    combineStyle(news) {
      let olds = this.oldStyles || DefaultMeasureStyle;
      news = news || this.styles;
      let combines = olds.filter(l => {
        return !news.find(f => f.id === l.id);
      });
      combines = combines.concat(news);
      return combines;
    },

    changeMapStyle(layers) {
      let { map } = this;
      layers.forEach(layer => {
        if (map.getLayer(layer)) {
          if (layer.filter) {
            map.setFilter(layer.id, layer.filter);
          }
          if (layer.paint) {
            Object.keys(layer.paint).forEach(key => {
              map.setPaintProperty(layer.id, key, layer.paint[key]);
            });
          }
          if (layer.layout) {
            Object.keys(layer.layout).forEach(key => {
              map.setLayoutProperty(layer.id, key, layer.layout[key]);
            });
          }
        }
      });
    },

    _updateLengthOrArea() {
      if (!this.measure) return;
      const { measureMode, innermeasureMode } = this;
      let data = this.measure.getAll();
      let geographyPerimeter,
        geographyArea,
        projectionPerimeter,
        projectionArea,
        center;
      if (data.features.length > 0) {
        let coordinates =
          data.features[data.features.length - 1].geometry.coordinates;
        let mercatorData = turf.toMercator(data);
        let mercatorCoordinate =
          mercatorData.features[mercatorData.features.length - 1].geometry
            .coordinates;
        if (
          measureMode === measureModes.measureLength ||
          innermeasureMode === measureModes.measureLength
        ) {
          console.log("measure length");
          center = turf.centroid(turf.lineString(coordinates));
          geographyPerimeter = turf.length(data) * 1000;
          projectionPerimeter = 0;
          for (let i = 1; i < mercatorCoordinate.length; i++) {
            let x = mercatorCoordinate[i][0] - mercatorCoordinate[i - 1][0];
            let y = mercatorCoordinate[i][1] - mercatorCoordinate[i - 1][1];
            projectionPerimeter += Math.sqrt(x * x + y * y);
          }
        } else if (
          measureMode === measureModes.measureArea ||
          innermeasureMode === measureModes.measureArea
        ) {
          console.log("measure area");
          center = turf.centroid(turf.polygon(coordinates));
          geographyPerimeter = turf.length(data) * 1000;
          geographyArea = turf.area(data);
          mercatorCoordinate =
            mercatorCoordinate[mercatorCoordinate.length - 1];
          projectionPerimeter = 0;
          for (let i = 1; i < mercatorCoordinate.length; i++) {
            let x = mercatorCoordinate[i][0] - mercatorCoordinate[i - 1][0];
            let y = mercatorCoordinate[i][1] - mercatorCoordinate[i - 1][1];
            projectionPerimeter += Math.sqrt(x * x + y * y);
          }
          projectionArea = 0;
          for (let j = 1; j < mercatorCoordinate.length; j++) {
            let s1 = mercatorCoordinate[j - 1][0] * mercatorCoordinate[j][1];
            let s2 = mercatorCoordinate[j][0] * mercatorCoordinate[j - 1][1];
            projectionArea += (s1 - s2) / 2;
          }
          projectionArea = Math.abs(projectionArea);
        }
        // turf计算结果单位，长度默认是千米，面积默认是平方米；本组件对外输出结果长度统一为米，面积统一为平方米
        if (this.measureMethod === measureMethods.geography) {
          return {
            geographyPerimeter: geographyPerimeter,
            geographyArea: geographyArea,
            coordinates: coordinates,
            center: center
          };
        } else if (this.measureMethod === measureMethods.projection) {
          return {
            projectionPerimeter: projectionPerimeter,
            projectionArea: projectionArea,
            coordinates: coordinates,
            center: center
          };
        } else if (this.measureMethod === measureMethods.both) {
          return {
            geographyPerimeter: geographyPerimeter,
            geographyArea: geographyArea,
            projectionPerimeter: projectionPerimeter,
            projectionArea: projectionArea,
            coordinates: coordinates,
            center: center
          };
        }
      }
    },

    remove() {
      this.$_unbindMeasureEvents();
      this.$_removeMeasureControl();

      this.$_emitEvent("removed");
    },

    changeFold(e) {
      // document.querySelector(".mapgis-ui-space").style="backgroundColor:black;";
      let space = document.querySelector(
        ".mapgis-measure-control > .mapgis-ui-space"
      );
      let width = getComputedStyle(space).width;
      if (width == "40px") {
        space.style =
          "width: 160px!important;overflow: hidden;transition: width .5s;";
      } else {
        space.style =
          "width: 40px!important;overflow: hidden;transition: width .5s;";
      }
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
    handleMeasureResult(e) {
      this.disableDrag();
      const coords = e.center.geometry.coordinates;
      this.coordinates = coords;
      this.area = e.geographyArea || "无";
      this.perimeter = e.geographyPerimeter;
    },
    toggleMeasureLength() {
      this.enableMeasure();
      this.coordinates = [];
      this.innermeasureMode = "measure-length";
      this.measure && this.measure.changeMode("draw_line_string");
    },
    toggleMeasureArea() {
      this.enableMeasure();
      this.coordinates = [];
      this.innermeasureMode = "measure-area";
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

<style>
.mapgis-measure-control > .mapgis-ui-space {
  width: 40px !important;
  overflow: hidden;
  transition: width 0.5s;
}

.mapgis-measure-expand.mapgis-ui-btn {
  width: 40px !important;
  height: 40px !important;
}
.mapgis-measure-expand.anticon {
  font-size: 19px !important;
}

.mapgis-measure-control {
  width: fit-content;
  position: absolute;
  /*top: 10px;*/
  /*left: 10px;*/
  z-index: 3000;
}

.mapgis-measure-control-label-span {
  background: #ffffff;
  color: #fbb03b;
}
</style>
