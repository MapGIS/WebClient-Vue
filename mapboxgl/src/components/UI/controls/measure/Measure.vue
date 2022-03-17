<template>
  <div>
    <slot v-if="measure"></slot>
    <!-- slot for measureTool -->
    <slot name="measureTool">
      <div v-show="enableControl">
        <measure-tool :result="measureResult" v-if="isAdvanceControl" />
        <mapgis-ui-space v-if="!isAdvanceControl">
          <mapgis-ui-tooltip
            v-for="(item, i) in toolbarBtns"
            :key="i"
            placement="bottom"
          >
            <span slot="title">{{ item.tip }}</span>
            <mapgis-ui-button
              shape="circle"
              @click="item.click(item)"
              :type="item.type"
              :style="btnStyle(item)"
            >
              <mapgis-ui-iconfont :type="item.icon" theme="filled" />
            </mapgis-ui-button>
          </mapgis-ui-tooltip>
        </mapgis-ui-space>
      </div>
    </slot>
    <!-- slot for measureMarker -->
    <slot name="measureMarker">
      <measure-marker>
        <template slot="popup" slot-scope="slotProps">
          <slot name="popup" v-bind="slotProps"></slot>
        </template>
      </measure-marker>
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
const MapboxDraw = MapboxDrawCom.default;

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
    enableControl: {
      type: Boolean,
      default: false
    },
    isAdvanceControl: {
      type: Boolean,
      default: false
    },
    measureMode: {
      type: String,
      validator(value) {
        return !value || oneOf(value, Object.keys(measureTypeToModeMap));
      }
    },
    // geography按照地理坐标系计算长度和面积，
    // projection按照投影坐标系计算长度和面积，both返回两种坐标系的计算结果
    measureMethod: {
      type: String,
      default: measureMethodMap.both,
      validator(value) {
        return oneOf(value, Object.keys(measureMethodMap));
      }
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
      selfMeasureMode: undefined,
      measureResult: null,
      toolbarBtns: [
        {
          icon: "mapgis-ruler",
          type: "primary",
          tip: "长度",
          click: this.enableLengthMeasure
        },
        {
          icon: "mapgis-area",
          type: "primary",
          tip: "面积",
          click: this.enableAreaMeasure
        },
        {
          icon: "mapgis-shanchu_dianji",
          type: "primary",
          tip: "清空图元",
          click: this.remove
        }
      ],
      showTip: true
    };
  },

  computed: {
    coordinates({ measureResult }) {
      return measureResult && measureResult.center
        ? measureResult.center.geometry.coordinates
        : [];
    },
    controlStyle({ position, isAdvanceControl }) {
      const [first, secend] = position.split("-");
      return {
        width: "fit-content",
        position: "absolute",
        maxHeight: "100%",
        overflowX: "hidden",
        overflowY: "auto",
        zIndex: 1000,
        top: "10px",
        left: "10px",
        [first]: "10px",
        [secend]: "10px",
        background: isAdvanceControl ? "#fff" : "transparent"
      };
    },
    btnStyle() {
      return () => ({
        width: "32px !important",
        height: "32px !important"
      });
    }
  },

  watch: {
    measureMode(mode) {
      if (this.initial) return;
      if (this.measure) {
        this.selfMeasureMode = measureTypeToModeMap[mode];
        // measure.deleteAll();
        // measure.trash();
      }
    },
    measureMethod() {
      this.$_updateLengthOrArea();
    },
    styles(nStyle) {
      this.combineStyle(nStyle);
    }
  },

  mounted() {
    this.$_initMeasure();
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
    /**
     * 更新测量面积和长度
     */
    $_updateLengthOrArea() {
      if (!this.measure) return;
      const data = this.measure.getAll();
      let geographyPerimeter = 0;
      let geographyArea = 0;
      let projectionPerimeter = 0;
      let projectionArea = 0;
      let center = null;

      if (data.features.length) {
        geographyPerimeter = turf.length(data) * 1000;
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
          // this.disableDrag();
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
        styles: this.measureStyle
      };
      this.measure = new MapboxDraw(draweroptions);
      this.$_bindSelfEvents(Object.keys(measureEvents));
      this.initial = false;
    },
    /**
     * 更改测量图层样式
     */
    $_changeMapStyle() {
      this.changeMapStyle(this.measureStyle);
    },

    //
    $_handleMapMeasureRemove() {
      this.showTip = false;
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

    /**
     * 改变测量工具样式
     */
    changeMapStyle(styles) {
      const { map } = this;
      styles.forEach(layer => {
        if (map.getLayer(layer)) {
          const { id, filter, paint, layout } = layer;
          if (filter) {
            map.setFilter(id, filter);
          }
          if (paint) {
            Object.entries(paint).forEach(([key, value]) => {
              map.setPaintProperty(id, key, value);
            });
          }
          if (layout) {
            Object.entries(layout).forEach(([key, value]) => {
              map.setLayoutProperty(id, key, value);
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
          if (mode === measureModeMap.line || mode === measureModeMap.polygon) {
            this.selfMeasureMode = mode;
          }
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
      this.$_unbindEditEvents();
      this.$_addMeasureControl(this.measure);
      this.$_emitEvent("added", { measure: this.measure });
      this.$_unbindMeasureEvents();
      this.$_bindSelfEvents(Object.keys(measureEvents));
      this.showTip = true;
    },
    /**
     * 移除测量组件和事件解绑
     */
    remove() {
      this.measureResult = null;
      this.changeMode();
      this.$_unbindMeasureEvents();
      this.$_removeMeasureControl();
      this.$_emitEvent("removed");
    },
    /**
     * 禁止拖拽
     */
    disableDrag() {
      const vm = this;
      vm.map.on("draw.selectionchange", e => {
        const { features, points } = e;
        const hasLine = features && features.length > 0;
        const hasPoints = points && points.length > 0;
        if (hasLine && !hasPoints) {
          // line clicked
          if (vm.measure.getMode() !== measureModeMap.direct) {
            vm.measure.changeMode(measureModeMap.simple, { featureIds: [] });
            // vm.changeMode(measureModeMap.direct, {
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
    /**
     * 处理测量结果
     */
    handleMeasureResult(e) {
      this.disableDrag();
      this.measureResult = e;
    },
    startMeasure(mode) {
      this.enableMeasure();
      this.changeMode(mode);
    },
    // enableToolbar() {
    //   this.toolbarVisible = !this.toolbarVisible;
    // },
    enableLengthMeasure() {
      this.remove();
      this.startMeasure("draw_line_string");
    },
    enableAreaMeasure() {
      this.remove();
      this.startMeasure("draw_polygon");
    }
  }
};
</script>
