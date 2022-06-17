<template>
  <div class="mapgis-2d-plot-animation">
    <mapgis-ui-plot-script-list
      v-if="scriptListCopy && showScriptList"
      :scriptList="scriptListCopy"
      @play="playScript"
      @click="clickList"
      @edit="editList"
      @addScript="addList"
      @removeScript="removeList"
      @import="importList"
      @export="exportList"
      class="mapgis-2d-plot-animation-panel"
    ></mapgis-ui-plot-script-list>
    <mapgis-ui-plot-script
      :script="scriptListCopy[activeIndex]"
      :plotId="plotId"
      :attrsItemOptions="attrsItemOptions"
      v-if="!showScriptList"
      @return="e => (showScriptList = e)"
      @play="playScript"
      @add="addScript"
      @change="scriptChange"
      @animationChange="animationChange"
      class="mapgis-2d-plot-animation-panel"
    ></mapgis-ui-plot-script>
    <slot
      name="timeline"
      :value="value"
      :change="e => { value = e;}"
      v-show="showTimeline"
      ref="timeline"
      :forwardActive="forwardActive"
      :start="start"
      :backward="backward"
      :pause="pause"
      :forward="forward"
      :end="end"
      :speedChange="setSpeed"
    >
      <mapgis-ui-plot-timeline
        :value="value"
        @change="e => { value = e;}"
        v-show="showTimeline"
        ref="timeline"
        :forwardActive="forwardActive"
        :duration="10"
        @start="start"
        @backward="backward"
        @pause="pause"
        @forward="forward"
        @end="end"
        @speedChange="setSpeed"
      ></mapgis-ui-plot-timeline>
    </slot>
  </div>
</template>

<script>
import { TimeLine, SymbolManager } from "@mapgis/webclient-es6-service";
import axios from "axios";

export default {
  name: "mapgis-2d-plot-animation",
  inject: ["map"],
  props: {
    layer: {
      type: Object,
      required: true
    },
    layers: {
      type: Object
    },
    data: {
      type: [String, Object, Array]
    },
    script: {
      type: [String, Object]
    },
    scriptList: {
      type: [String, Array]
    },
    attrsItemOptions: {
      type: Array,
      default: () => {
        return [
          "compareLineColor",
          "strokeStyle",
          // "fillGradColor",
          "fillStyle",
          "compareLineWidth",
          "lineWidth"
        ];
      }
    }
  },
  data() {
    return {
      timeline: undefined,
      value: 0,
      plotId: undefined,
      scriptListCopy: undefined,
      manager: undefined,
      forwardActive: false,
      showScriptList: true,
      showTimeline: false,
      activeIndex: undefined,
      nodeNames: undefined
    };
  },
  watch: {
    data: {
      handler: async function(e) {
        const vm = this;
        // let json;
        switch (typeof e) {
          case "string":
            break;
          case "object":
            if (e instanceof Object) {
              vm.scriptListCopy = [e];
            } else {
              vm.scriptListCopy = e;
            }
            break;
        }
      },
      deep: true,
      immediate: true
    },
    value(e) {
      this.timeline.seek(e * 1000);
    }
  },
  mounted() {
    this.mount();
  },
  destroyed() {
    this.clearTimeline();
  },
  methods: {
    mount() {
      const vm = this;
      this.layer.editable = true;
      this.layer.pickPlot = function(plot) {
        // console.log("plot", plot);
        vm.plotId = plot.element.featureId;
        let json = plot.getStyle();
        // console.log("plot.getStyle", json);
        vm.nodeNames = Object.keys(json.nodeStyles);
        // console.log("plotId/nodeNames", vm.plotId, "/", vm.nodeNames);
      };

      this.timeline = this.timeline || new TimeLine(this.layers, {});
      if (this.scriptListCopy) {
        this.activeIndex = 0;
        this.timeline.fromJSON(vm.scriptListCopy[vm.activeIndex]);
      } else {
        axios({
          method: "get",
          url: vm.data,
          timeout: 1000
        }).then(res => {
          vm.activeIndex = 0;
          vm.scriptListCopy = [res.data];
          vm.timeline.fromJSON(res.data);
        });
      }
    },
    start() {
      this.timeline.restore();
    },
    backward() {
      this.timeline.reversed(true);
      this.timeline.play();
    },
    pause() {
      this.timeline.pause();
    },
    forward() {
      this.showTimeline = true;
      this.forwardActive = true;
      this.timeline.reversed(false);
      this.timeline.play();
    },
    clearTimeline() {
      if (!this.timeline) return;
      this.timeline.restore();
      this.timeline.clear();
    },
    initTimeline() {
      this.clearTimeline();
      this.timeline &&
        this.timeline.fromJSON(this.scriptListCopy[this.activeIndex]);
    },
    end() {},
    setSpeed(e) {
      this.timeline.setSpeed(e);
    },
    playScript(e) {
      let index = this.activeIndex;
      this.activeIndex = e ? e.index : this.activeIndex;
      if (index !== this.activeIndex) {
        this.initTimeline();
      } else {
        this.timeline.restore();
      }
      // this.$refs.timeline.forward();
      this.forward();
    },
    clickList(e) {
      let index = this.activeIndex;
      this.showScriptList = false;
      this.activeIndex = e.index;
      if (index !== this.activeIndex) {
        this.initTimeline();
      }
    },
    editList(e) {
      this.activeIndex = e.index;
      this.scriptListCopy = e.list;
    },
    addList(scriptList) {
      this.showTimeline = false;
      this.scriptListCopy = scriptList;
      this.activeIndex = scriptList.length - 1;
      this.initTimeline();
    },
    removeList(scriptList) {
      this.scriptListCopy = scriptList;
      this.activeIndex =
        this.activeIndex > scriptList.length - 1
          ? scriptList.length - 1
          : this.activeIndex;
    },
    importList(scriptList) {
      this.scriptListCopy = scriptList;
    },
    exportList(scriptList) {
      this.$emit('export',scriptList) ;
    },
    scriptChange(e) {
      this.scriptListCopy[this.activeIndex] = e.script;
    },
    animationChange(e) {
      this.scriptListCopy[this.activeIndex] = e.script;
      let data = JSON.parse(JSON.stringify(e.script.animations[e.index]));
      // 单图层
      const s = this.timeline.getAnimationById(data.featureIds);
      // console.log("修改动画", s);
      this.timeline.removeAnimation(s[0]);
      this.timeline.addAnimationObject(data);
    },
    addScript(e) {
      // const vm = this;
      this.scriptListCopy[this.activeIndex] = e.script;
      let data = JSON.parse(JSON.stringify(e.script.animations[e.index]));
      // console.log("adddddd", data);
      this.timeline.addAnimationObject(data);
    }
  }
};
</script>

<style scoped>
.mapgis-2d-plot-animation-panel {
  /* position: absolute;
  top: 10px;
  left: 10px; */
  max-height: 550px;
  overflow-y: scroll;
  z-index: 1;
}
</style>
