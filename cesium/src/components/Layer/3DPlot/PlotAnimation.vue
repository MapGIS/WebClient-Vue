<template>
  <div class="plot-animation">
    <mapgis-ui-plot-script
      :animationList="script"
      :defaultAnimation="defaultAnimation"
      :name="scriptName"
    ></mapgis-ui-plot-script>
    <mapgis-ui-plot-timeline
      v-model="value"
      @start="start"
      @backward="backward"
      @pause="pause"
      @forward="forward"
      @end="end"
      @speedChange="setSpeed"
    ></mapgis-ui-plot-timeline>
  </div>
</template>

<script>
import { TimeLine, SymbolManager } from "@mapgis/webclient-es6-service";
import axios from "axios";

export default {
  name: "mapgis-3d-plot-animation",
  inject: ["viewer", "Cesium"],
  props: {
    layer: {
      type: Object,
      required: true
    },
    layers: {
      type: Object
    },
    data: {
      type: [String, Object],
      required: true
    }
  },
  data() {
    return {
      timeline: undefined,
      value: 0,
      plotId: undefined,
      script: undefined,
      defaultAnimation: undefined,
      scriptName: undefined
    };
  },
  mounted() {
    this.mount();
  },
  methods: {
    mount() {
      const vm = this;
      this.layer.pickPlot = async function(plot) {
        vm.plotId = plot.id;
        console.log("plotId", vm.plotId);
      };
      this.layer.pickEventType = Cesium.ScreenSpaceEventType.RIGHT_CLICK;
      let manager = new SymbolManager(
        "http://localhost:8895/标绘/symbols.json"
      );
      manager.getSymbols().then(function() {
        vm.timeline = new TimeLine(vm.layers, {});
        axios.get(vm.data).then(res => {
          // console.log("timeline", vm.data, res.data);

          vm.timeline.fromJSON(res.data);
        });
      });
    },
    start() {
      this.timeline.restore();
    },
    backward() {
      this.timeline.play();
      this.timeline.reversed(true);
    },
    pause() {
      this.timeline.pause();
    },
    forward() {
      this.timeline.play();
      this.timeline.reversed(false);
    },
    end() {},
    setSpeed(e) {
      this.timeline.setSpeed(e);
    }
  }
};
</script>

<style scoped></style>
