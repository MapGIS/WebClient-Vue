 <template>
  <div class="mapgis-3d-plot-animation">
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
      class="mapgis-3d-plot-animation-panel"
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
      class="mapgis-3d-plot-animation-panel"
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
        :enableEnd="false"
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
  name: "mapgis-3d-plot-animation",
  inject: ["viewer", "Cesium"],
  props: {
    vueKey: {
      type: String
    },
    vueIndex: {
      type: [Number, String]
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
          "wallColor",
          // "wallGradColor",
          "strokeStyle",
          // "fillGradColor",
          "fillStyle",
          "dimModHeight",
          "lineWidth"
        ];
      }
    }
  },
  data() {
    return {
      value: 0,
      plotId: undefined,
      scriptListCopy: undefined,
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
      let timeline = this.getPlotAnimation()
      timeline && timeline.seek(e * 1000);
    }
  },
  mounted() {
    this.mount();
  },
  destroyed() {
    this.clearTimeline();
  },
  methods: {
    setPick() {
      const vm = this;
      let layer = this.getLayer();
        layer.pickPlot = function(plot) {
        vm.plotId = plot.id;
        // console.log("plot", plot);
        let json = plot.getStyle();
        vm.nodeNames = Object.keys(json.nodeStyles);
        // console.log("plotId/nodeNames", vm.plotId, "/", vm.nodeNames);
      };
    },
    mount() {
      const vm = this;
      let layer = this.getLayer();
      layer.pickPlot = function(plot) {
        vm.plotId = plot.id;
        // console.log("plot", plot);
        let json = plot.getStyle();
        vm.nodeNames = Object.keys(json.nodeStyles);
        // console.log("plotId/nodeNames", vm.plotId, "/", vm.nodeNames);
      };
      layer.pickEventType = Cesium.ScreenSpaceEventType.RIGHT_CLICK;

      // this.manager =
      //   this.manager ||
      //   new SymbolManager("http://localhost:8895/标绘/symbols.json");

      // this.manager.getSymbols().then(function() {
      let layers = this.getLayers();

      let timeline = this.getPlotAnimation();
      if(!timeline) {
        timeline = new TimeLine(layers, {});
        window.vueCesium.PlotAnimationManager.addSource(vm.vueKey, vm.vueIndex, timeline);
      }
      if (this.scriptListCopy) {
        this.activeIndex = 0;
        timeline.fromJSON(JSON.parse(JSON.stringify(vm.scriptListCopy[vm.activeIndex])));
      } else {
        axios({
          method: "get",
          url: vm.data,
          timeout: 1000
        }).then(res => {
          vm.activeIndex = 0;
          vm.scriptListCopy = [res.data];
          timeline.fromJSON(JSON.parse(JSON.stringify(res.data)));
        });
      }

      this.$emit("loaded", this);
      // });
    },
    getLayer() {
      let layerManager = window.vueCesium.PlotLayerManager.findSource(
          this.vueKey,
          this.vueIndex
      );
      return layerManager && layerManager.source;
    },
    getLayers() {
      let PlotLayerGroupManager = window.vueCesium.PlotLayerGroupManager.findSource(
          this.vueKey,
          this.vueIndex
      );
      return PlotLayerGroupManager && PlotLayerGroupManager.source;
    },
    getPlotAnimation() {
      let PlotAnimationManager = window.vueCesium.PlotAnimationManager.findSource(
          this.vueKey,
          this.vueIndex
      );
      return PlotAnimationManager && PlotAnimationManager.source;
    },
    start() {
      let timeline = this.getPlotAnimation();
      timeline && timeline.restore();
    },
    backward() {
      let timeline = this.getPlotAnimation();
      if(timeline) {
      timeline.reversed(true);
      timeline.play();
      }
    },
    pause() {
      let timeline = this.getPlotAnimation();
      timeline && timeline.pause();
    },
    forward() {
      let timeline = this.getPlotAnimation();
      if(timeline) {
        this.showTimeline = true;
        this.forwardActive = true;
        timeline.reversed(false);
        timeline.play();
      }
    },
    clearTimeline() {
      let timeline = this.getPlotAnimation();
      if(timeline) {
        timeline.restore();
        timeline.clear();
      }
    },
    initTimeline() {
      let timeline = this.getPlotAnimation();
      if(timeline) {
        this.clearTimeline();
        timeline.fromJSON(JSON.parse(JSON.stringify(this.scriptListCopy[this.activeIndex])));
      }
    },
    end() {},
    setSpeed(e) {
      let timeline = this.getPlotAnimation();
      timeline && timeline.setSpeed(e);
    },
    playScript(e) {
      // console.log("--------play")
      let index = this.activeIndex;
      this.activeIndex = e ? e.index : this.activeIndex;
      if (index !== this.activeIndex) {
        this.initTimeline();
      } else {
        let timeline = this.getPlotAnimation();
        timeline && timeline.restore();
      }
      // // this.$refs.timeline.forward();
      // let timeline = this.getPlotAnimation();
      // timeline && timeline.restore();
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
      let timeline = this.getPlotAnimation();
      if(timeline) {
        this.scriptListCopy[this.activeIndex] = e.script;
        let data = JSON.parse(JSON.stringify(e.script.animations[e.index]));
        // 单图层
        const s = timeline.getAnimationById(data.featureIds);
        // console.log("修改动画", s);
        timeline.removeAnimation(s[0]);
        timeline.addAnimationObject(data);
      }
    },
    addScript(e) {
      let timeline = this.getPlotAnimation();
      if(timeline) {
        // const vm = this;
        this.scriptListCopy[this.activeIndex] = e.script;
        let data = JSON.parse(JSON.stringify(e.script.animations[e.index]));
        // console.log("adddddd", data);
        timeline.addAnimationObject(data);
      }
    }
  }
};
</script>

<style scoped>
.mapgis-3d-plot-animation-panel {
  /* position: absolute;
  top: 10px;
  left: 10px; */
  max-height: 550px;
  overflow-y: scroll;
}
</style>
