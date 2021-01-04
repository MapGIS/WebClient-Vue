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

let MapboxDraw = require("@mapbox/mapbox-gl-draw");

import measureMixin from "./measureMixin";
import controlMixin from "../withControlEvents";

const measureEvents = {
  drawCreate: "draw.create"
  /*drawDelete: "draw.delete",
   drawUpdate: "draw.update" */
};

const measureModes = {
  measureLength: "measure-length",
  measureArea: "measure-area"
};

const measureEvent = {
  measureResult: "measureResult"
};

export default {
  name: "Measure",
  mixins: [measureMixin, controlMixin],

  provide () {
    const self = this;
    return {
      get measure () {
        // 提供给子组件popup或者插槽
        return self.measure;
      }
    };
  },

  props: {
    measureMode: {
      type: String,
      require: true
    }
  },

  data () {
    return {
      measure: undefined
    };
  },

  watch: {
    measureMode () {
      this.measure.deleteAll();
      this.measure.trash();
    }
  },

  mounted () {
    let draweroptions = {
      displayControlsDefault: true,
      defaultMode: "simple_select",
      controls: {
        point: false,
        line_string: false,
        polygon: false,
        trash: false,
        combine_features: false,
        uncombine_features: false
      }
    };

    this.measure = new MapboxDraw(draweroptions);
    // const eventNames = Object.keys(measureEvents);
  },

  methods: {
    enableMeasure () {
      this.$_addDrawControl(this.measure);
      this.$_emitEvent("added", { measure: this.measure });
      const eventNames = Object.keys(measureEvents);
      this.$_unbindDrawEvents();
      // this.$_unbindSelfEvents(eventNames);
      this.$_bindSelfEvents(eventNames);
    },

    $_bindSelfEvents (events) {
      if (events.length === 0) return;
      this.$_bindDrawEvents(
        measureEvents.drawCreate,
        this._updateLengthOrArea.bind(this)
      );
    },
  }
};
</script>
