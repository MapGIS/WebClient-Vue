<template>
  <div>
    <slot v-if="measure"></slot>
    <!-- slot for measureTool -->
    <slot name="measureTool" />
    <!-- slot for measureMarker -->
    <slot name="measureMarker" />
  </div>
</template>

<style></style>

<script>
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import * as turf from "@turf/turf";

import * as MapboxDrawCom from "@mapbox/mapbox-gl-draw";
const MapboxDraw = MapboxDrawCom.default;

import measureMixin from "./measureMixin";
import controlMixin from "../withControlEvents";

const measureEvents = {
  // es6
  measureCreate: "draw.create",
  measureUpdate: "draw.update",
  measureResult: "measureResult",
  // brower
  measurecreate: "draw.create",
  measureupdate: "draw.update",
  measureresult: "measureresult",
};

const measureModes = {
  measureLength: "measure-length",
  measureArea: "measure-area",
};

export default {
  name: "mapgis-measure",
  mixins: [measureMixin, controlMixin],

  provide () {
    const self = this;
    return {
      get measure () {
        // 提供给子组件popup或者插槽
        return self.measure;
      },
    };
  },

  props: {
    measureMode: {
      type: String,
      required: true,
      default: 'measure-length'
    }
  },

  data () {
    return {
      initial: true,
      measure: undefined,
    };
  },

  watch: {
    measureMode () {
      const { measure, initial } = this;
      if (initial) return;
      if (measure) {
        // measure.deleteAll();
        // measure.trash();
      }
    },
  },

  mounted () {
    let draweroptions = {
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
        uncombine_features: false,
      },
    };

    this.measure = new MapboxDraw(draweroptions);

    const eventNames = Object.keys(measureEvents);
    this.$_bindSelfEvents(eventNames);

    this.initial = false;
  },

  beforeDestroy () {
    this.remove();
  },

  methods: {
    enableMeasure () {
      this.$_addMeasureControl(this.measure);
      this.$_emitEvent("added", { measure: this.measure });
      const eventNames = Object.keys(measureEvents);
      this.$_unbindMeasureEvents();
      this.$_bindSelfEvents(eventNames);
    },

    $_bindSelfEvents (events) {
      if (events.length === 0) return;
      // asControl 本身是拥有 $_bindSelfEvents 方法的，但是这里的draw组件并不是遵循的mapbox-gl.js的事件机制，
      // 因此我们需要覆盖该方法, 按照对应的业务方式实现
      const vm = this;
      // 使用vue的this.$listeners方式来订阅用户指定的事件
      Object
        .keys(this.$listeners)
        .concat(['measureCreate', 'measurecreate', 'measureUpdate', 'measureupdate'])
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
    $_emitMeasureEvent (eventName, eventData) {
      const vm = this;
      if (eventName === 'measureCreate' || eventName === 'measurecreate') {
        const result = vm._updateLengthOrArea();
        vm.$emit(measureEvents.measureresult, result);
        vm.$emit(measureEvents.measureResult, result);
      }
      if (eventName === 'measureUpdate' || eventName === 'measureupdate') {
        const result = vm._updateLengthOrArea();
        vm.$emit(measureEvents.measureresult, result);
        vm.$emit(measureEvents.measureResult, result);
      }
      return vm.$_emitSelfEvent({ type: eventName }, eventData);
    },

    _updateLengthOrArea () {
      if (!this.measure) return;
      let data = this.measure.getAll();
      let perimeter, area, center;
      if (data.features.length > 0) {
        let coordinates =
          data.features[data.features.length - 1].geometry.coordinates;
        if (this.measureMode === measureModes.measureLength) {
          perimeter = turf.length(data);
          center = turf.centroid(turf.lineString(coordinates));
        } else if (this.measureMode === measureModes.measureArea) {
          perimeter = turf.length(data);
          area = turf.area(data);
          center = turf.centroid(turf.polygon(coordinates));
        }

        // turf计算结果单位，长度默认是千米，面积默认是平方米；本组件对外输出结果长度统一为米，面积统一为平方米
        return {
          perimeter: perimeter * 1000,
          area: area,
          coordinates: coordinates,
          center: center
        };
      }
    },

    remove () {
      this.$_unbindMeasureEvents();

      if (this.measure) {
        this.measure.deleteAll();
        this.measure.trash();
        this.measure = undefined;
      }

      this.removeSource("mapbox-gl-draw-hot");
      this.removeSource("mapbox-gl-draw-cold");

      this.$_emitEvent("removed");
    }
  }
};
</script>
