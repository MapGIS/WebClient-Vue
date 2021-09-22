<template>
  <div>
    <slot v-if="measure"></slot>
    <!-- slot for measureTool -->
    <slot name="measureTool" />
    <!-- slot for measureMarker -->
    <slot name="measureMarker">
      <measure-marker />
    </slot>
  </div>
</template>

<script>
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import * as turf from "@turf/turf";

import * as MapboxDrawCom from "@mapbox/mapbox-gl-draw";
import { last, oneOf } from "../../../util/util";
import MeasureTool from "./components/MeasureTool.vue";
import MeasureMarker from "./components/MeasureMarker.vue";
import measureMixin from "./measureMixin";
import controlMixin from "../withControlEvents";
import {
  defaultStyle,
  measureSelfEvents,
  measureEvents,
  measureMethodMap,
  measureModeMap,
  measureTypeToModeMap
} from "./store/enums";

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
  components: {
    MeasureTool,
    MeasureMarker
  },
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
      default: () => defaultStyle
    }
  },

  data() {
    return {
      initial: true,
      measure: undefined,
      measureStyle: defaultStyle,
      selfMeasureMode: "",
      measureResult: null
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
    styles(nStyle) {
      this.combineStyle(nStyle);
    }
  },

  mounted() {
    this.$_initMeasure();
    if (this.enableControl) {
      let position = this.position;
      let pos = position.split("-");
      document.querySelector(
        // ".mapgis-measure-control > .mapgis-ui-space"
        ".mapgis-measure-control"
      ).style = pos[0] + ": 10px;" + pos[1] + ": 10px;";
      // if (this.expandControl) {
      //   this.changeFold();
      // } else {
      //   let pos = position.split("-");
      //   document.querySelector(
      //     ".mapgis-measure-control > .mapgis-ui-space"
      //   ).style = pos[0] + ": 10px;" + pos[1] + ": 10px;";
      // }
    }
  },

  beforeDestroy() {
    this.remove();
  },

  methods: {
    /**
     * 设置双击结束后图形编辑状态
     */
    $_setEditable() {
      if (!this.editable) {
        const timer = setTimeout(() => {
          this.changeMode();
          clearTimeout(timer);
        }, 100);
      }
    },
    /**
     * 派发测量结果事件
     */
    $_emitMeasureResult(result = this.measureResult) {
      this.$emit(measureEvents.measureresult, result);
      this.$emit(measureEvents.measureResult, result);
    },
    /**
     * 获取周长
     */
    $_getPerimeter(coordinate, perimeter = 0) {
      let _perimeter = perimeter;
      for (let i = 1, prevCoord = coordinate[0]; i < coordinate.length; i++) {
        const coord = coordinate[i];
        const [x1, y1] = prevCoord;
        const [x, y] = coord;
        _perimeter += Math.sqrt(Math.pow(x - x1, 2) + Math.pow(y - y1, 2));
        prevCoord = [...coord];
      }
      return _perimeter;
    },
    /**
     * 获取面积
     */
    $_getArea(coordinate, area = 0) {
      let _area = area;
      for (let i = 1, prevCoord = coordinate[0]; i < coordinate.length; i++) {
        const coord = coordinate[i];
        const [x1, y1] = prevCoord;
        const [x, y] = coord;
        _area += (x1 * y - x * y1) / 2;
        prevCoord = [...coord];
      }
      return Math.abs(_area);
    },

        const { coordinates } = last(data.features).geometry;
        const { coordinates: mercatorCoordinate } = last(
          turf.toMercator(data).features
        ).geometry;
        switch (this.selfMeasureMode) {
          case measureModeMap.line:
            center = turf.centroid(turf.lineString(coordinates));
            projectionPerimeter = this.$_getPerimeter(mercatorCoordinate);
            break;
          case measureModeMap.polygon: {
            const lastCoord = last(mercatorCoordinate);
            projectionPerimeter = this.$_getPerimeter(lastCoord);
            projectionArea = this.$_getArea(lastCoord);
            center = turf.centroid(turf.polygon(coordinates));
            geographyArea = turf.area(data);
            break;
          }
          default:
            break;
        }
        // turf计算结果单位，长度默认是千米，面积默认是平方米；
        // 本组件对外输出结果长度统一为米，面积统一为平方米
        let result;
        switch (this.measureMethod) {
          case measureMethodMap.geography:
            result = {
              geographyPerimeter,
              geographyArea,
              coordinates,
              center
            };
            break;
          case measureMethodMap.projection:
            result = {
              projectionPerimeter,
              projectionArea,
              coordinates,
              center
            };
            break;
          default:
            result = {
              geographyPerimeter,
              geographyArea,
              projectionPerimeter,
              projectionArea,
              coordinates,
              center
            };
            break;
        }

        this.measureResult = { ...result };
      }
    },
    /**
     * 按照@mapgis/webclient-vue-mapboxgl的规范发送事件 ，其实就是用{type：eventName}包装事件名
     */
    $_emitMeasureEvent(eventName, eventData) {
      switch (eventName) {
        case measureSelfEvents.measureCreate:
        case measureSelfEvents.measurecreate:
          this.disableDrag();
          this.$_setEditable();
          break;
        case measureSelfEvents.measureUpdate:
        case measureSelfEvents.measureupdate:
          break;
        default:
          break;
      }
      this.$_updateLengthOrArea();
      this.$_emitMeasureResult();
      return this.$_emitSelfEvent({ type: eventName }, eventData);
    },
    /**
     * 重写$listeners, 添加自定义事件
     * asControl本身是拥有 $_bindSelfEvents 方法的，但是这里的draw组件并不是遵循的mapbox-gl.js的事件机制，因此我们需要覆盖该方法, 按照对应的业务方式实现
     * 使用vue的this.$listeners方式来订阅用户指定的事件
     * @param {array} events 事件集合
     */
    $_bindSelfEvents(events) {
      if (!events.length) return;
      Object.keys(this.$listeners)
        .concat(Object.keys(measureSelfEvents))
        .forEach(eventName => {
          if (events.includes(eventName)) {
            this.$_bindMeasureEvents(
              measureEvents[eventName],
              this.$_emitMeasureEvent.bind(this, eventName)
            );
          }
        });
    },
    /**
     * 初始化绘制工具并注册自定义事件
     */
    $_initMeasure() {
      const draweroptions = {
        displayControlsDefault: true,
        defaultMode: measureModeMap.simple,
        styles: this.measureStyle,
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
    /**
     * 更改测量图层样式
     */
    $_changeMapStyle() {
      this.changeMapStyle(this.measureStyle);
    },
    /**
     * 融合样式
     * @param {array} 样式数据
     * @return {array} 整合后的样式集合
     */
    combineStyle(newStyles = []) {
      this.measureStyle = this.measureStyle
        .filter(l => !newStyles.find(f => f.id === l.id))
        .concat(newStyles);
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
    /**
     * 改变绘制类型
     */
    changeMode(mode = measureModeMap.simple, options) {
      try {
        if (this.measure) {
          this.selfMeasureMode = mode;
          this.measure.changeMode(mode, options);
        }
      } catch (e) {}
    },
    /**
     * 启用测量工具
     */
    enableMeasure() {
      this.$_initMeasure();
      this.$_changeMapStyle();
      this.$_unbindDrawEvents();
      this.$_addMeasureControl(this.measure);
      this.$_emitEvent("added", { measure: this.measure });
      this.$_unbindMeasureEvents();
      this.$_bindSelfEvents(Object.keys(measureEvents));
    },
    /**
     * 移除测量组件和事件解绑
     */
    remove() {
      this.measureResult = null;
      this.$_unbindMeasureEvents();
      this.$_removeMeasureControl();

      this.$_emitEvent("removed");
    },

    // changeFold(e) {
    //   // document.querySelector(".mapgis-ui-space").style="backgroundColor:black;";
    //   let space = document.querySelector(
    //     ".mapgis-measure-control > .mapgis-ui-space"
    //   );
    //   let width = getComputedStyle(space).width;
    //   if (width == "40px") {
    //     space.style =
    //       "width: 160px!important;overflow: hidden;transition: width .5s;";
    //   } else {
    //     space.style =
    //       "width: 40px!important;overflow: hidden;transition: width .5s;";
    //   }
    // },
    disableDrag() {
      const vm = this;
      vm.map.on("draw.selectionchange", e => {
        const { features, points } = e;
        const hasLine = features && features.length > 0;
        const hasPoints = points && points.length > 0;
        if (hasLine && !hasPoints) {
          // line clicked
          if (mode !== measureModeMap.direct) {
            vm.changeMode(measureModeMap.simple, { featureIds: [] });
            // vm.measure.changeMode(measureModeMap.simple, { featureIds: [] });
            // vm.measure.changeMode(measureModeMap.direct, {
            //   featureId: features[0].id
            // });
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
  width: 120px !important;
  overflow: hidden;
  /*transition: width 0.5s;*/
}

/*.mapgis-measure-expand.mapgis-ui-btn {*/
/*  width: 40px !important;*/
/*  height: 40px !important;*/
/*}*/
/*.mapgis-measure-expand.anticon {*/
/*  font-size: 19px !important;*/
/*}*/

.mapgis-measure-control {
  width: fit-content;
  /* position: absolute; */
  /*top: 10px;*/
  /*left: 10px;*/
  z-index: 3000;
}
</style>
