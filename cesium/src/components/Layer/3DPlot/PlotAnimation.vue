<template>
  <div class="mapgis-3d-plot-animation">
    <mapgis-ui-plot-script-list
      v-if="scriptListCopy && showScriptList"
      :scriptList="scriptListCopy"
      @play="playScript"
      @click="clickList"
      @edit="editList"
      @addScript="addList"
      @remove="removeList"
      @import="importList"
      @export="exportList"
      class="mapgis-3d-plot-animation-panel"
    ></mapgis-ui-plot-script-list>
    <mapgis-ui-plot-script
      :script="scriptListCopy[activeIndex]"
      :plotId="plotId"
      :attrsItemOptions="attrsItemOptions"
      :attrsItemColorOptions="attrsItemColorOptions"
      :vueKey="vueKey"
      :vueIndex="vueIndex"
      :is3dLayer="true"
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
      :min="minValue"
      :max="maxValue"
      :change="
        e => {
          value = e;
        }
      "
      v-show="showTimeline"
      :duration="totalTime"
      :enableEnd="false"
      :speed="speed"
      :interval="interval"
      :intervalOptions="['时', '分', '秒']"
      :start="start"
      :backward="backward"
      :pause="pause"
      :forward="forward"
      :speedChange="setSpeed"
      :intervalChange="setInterval"
    >
      <mapgis-ui-plot-timeline
        :value="value"
        :min="minValue"
        :max="maxValue"
        @change="
          e => {
            value = e;
          }
        "
        v-show="showTimeline"
        ref="timeline"
        :duration="totalTime"
        :enableEnd="false"
        :speed="speed"
        :interval="interval"
        :intervalOptions="['时', '分', '秒']"
        @start="start"
        @backward="backward"
        @pause="pause"
        @forward="forward"
        @speedChange="setSpeed"
        @intervalChange="setInterval"
      ></mapgis-ui-plot-timeline>
    </slot>
  </div>
</template>

<script>
import axios from "axios";
import plot from "@mapgis/webclient-plot";
const {TimeLine = window.Zondy.Plot.TimeLine } = plot;

export default {
  name: "mapgis-3d-plot-animation",
  inject: ["viewer", "Cesium"],
  props: {
    /**
     * 标绘图层的vueKey
     */
    vueKey: {
      type: String
    },
    /**
     * 标绘图层的vueIndex
     */
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
    },
    attrsItemColorOptions: {
      type: Array,
      default: () => {
        return [
          "wallColor",
          // "wallGradColor",
          "strokeStyle",
          // "fillGradColor",
          "fillStyle"
        ];
      }
    },
    showTimeline: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      value: 0,
      minValue: 0,
      maxValue: 60,
      plotId: undefined,
      scriptListCopy: undefined,
      showScriptList: true,
      activeIndex: undefined,
      nodeNames: undefined,
      totalTime: 240,
      interval: "未设置",
      speed: 1
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
            if (e instanceof Array) {
              vm.scriptListCopy = e;
              // console.log('dtaaa',e);
            } else {
              vm.scriptListCopy = [e];
            }
            break;
        }
      },
      deep: true,
      immediate: true
    }
    // vueIndex(val) {
    //   let layer = this.getLayer();
    //   if (layer) {
    //     this.setPick();
    //     this.initPlotAnimation();
    //   }
    // }
    // value(e) {
    //   let timeline = this.getPlotAnimation();
    //   timeline && timeline.seek(e * 1000);
    // }
  },
  mounted() {
    this.mount();
  },
  destroyed() {
    this.unmount();
  },
  methods: {
    mount() {
      let layer = this.getLayer();
      if (layer) {
        this.setPick();
        this.initPlotAnimation();
      } else {
        this.$message.warning("请先加载标绘图层!");
      }
    },
    unmount() {
      this.clearTimeline();
      window.vueCesium.PlotAnimationManager.deleteSource(
        this.vueKey,
        this.vueIndex
      );
    },
    setPick() {
      const vm = this;
      let layer = this.getLayer();
      layer.pickPlot = function(plot) {
        // console.log("plot-animation-3d", plot);
        let json = plot.getStyle();
        vm.nodeNames = Object.keys(json.nodeStyles);
        vm.plotId = plot.id;
        // console.log("plotId/nodeNames", vm.plotId, "/", vm.nodeNames);
      };
      // layer.pickEventType = Cesium.ScreenSpaceEventType.RIGHT_CLICK;
    },
    initPlotAnimation() {
      const vm = this;
      let layers = this.getLayers();

      let timeline = this.getPlotAnimation();
      if (!timeline) {
        timeline = new TimeLine(layers, {});
        window.vueCesium.PlotAnimationManager.addSource(
          vm.vueKey,
          vm.vueIndex,
          timeline
        );
      }
      if (this.scriptListCopy) {
        this.activeIndex = 0;
        timeline.fromJSON(
          JSON.parse(JSON.stringify(vm.scriptListCopy[vm.activeIndex]))
        );
      } else {
        axios.defaults.withCredentials = true;
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
    },
    start() {
      if (this.$refs.timeline) {
        this.$refs.timeline.stopPlay();
      } else {
        this.$emit("reset");
      }
      let timeline = this.getPlotAnimation();
      timeline && timeline.restore();
      this.speed = 1;
      this.interval = "未设置";
    },
    backward() {
      let timeline = this.getPlotAnimation();
      if (timeline) {
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
      if (timeline) {
        this.totalTime = timeline.getTotalTime() / 1000;
        // console.log("this.totalTime", this.totalTime);
        timeline.reversed(false);
        timeline.play();
      }
    },
    clearTimeline() {
      let timeline = this.getPlotAnimation();
      if (timeline) {
        timeline.restore();
        this.speed = 1;
        this.interval = "未设置";
        timeline.clear();
      }
    },
    initTimeline() {
      let timeline = this.getPlotAnimation();
      if (timeline) {
        this.clearTimeline();
        timeline.fromJSON(
          JSON.parse(JSON.stringify(this.scriptListCopy[this.activeIndex]))
        );
      }
    },
    setSpeed(e) {
      let timeline = this.getPlotAnimation();
      timeline && timeline.setSpeed(e);
      this.speed = e;
    },
    setInterval(e) {
      let timeline = this.getPlotAnimation();
      if (!timeline) return;
      this.interval = e;
      let totalTime = timeline.getTotalTime() / 1000;
      switch (e) {
        case "时":
          this.speed = totalTime / 4;
          break;
        case "分":
          this.speed = totalTime / 240;
          break;
        case "秒":
          this.speed = totalTime / (240 * 60);
          break;
      }
    },
    playScript(e) {
      const vm = this;
      let index = this.activeIndex;
      this.activeIndex = e ? e.index : this.activeIndex;
      if (index !== this.activeIndex) {
        this.initTimeline();
      } else {
        let timeline = this.getPlotAnimation();
        timeline && timeline.restore();
        timeline && timeline.setSpeed(this.speed);
      }
      if (this.value >= this.maxValue) {
        this.value = this.minValue;
      }
      /** 设置延时是为了让时间轴内部的value更改生效后再执行播放操作 */
      setTimeout(() => {
        /** 判断时间轴是否使用插槽实现 */
        if (vm.$refs.timeline) {
          vm.$refs.timeline.forward();
        } else {
          vm.$emit("play");
        }
      }, 50);

      // this.forward();
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
      this.scriptListCopy = scriptList;
      this.activeIndex = scriptList.length - 1;
      this.initTimeline();
    },
    removeList(scriptList) {
      this.scriptListCopy = scriptList;
      if (scriptList.length == 0) {
        this.activeIndex = undefined;
        return;
      }
      this.activeIndex =
        this.activeIndex > scriptList.length - 1
          ? scriptList.length - 1
          : this.activeIndex;
    },
    importList(scriptList) {
      this.scriptListCopy = scriptList;
    },
    exportList(scriptList) {
      this.$emit("export", scriptList);
    },
    scriptChange(e) {
      this.scriptListCopy[this.activeIndex] = e.script;
    },
    animationChange(e) {
      let timeline = this.getPlotAnimation();
      if (timeline) {
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
      if (timeline) {
        // const vm = this;
        this.scriptListCopy[this.activeIndex] = e.script;
        let data = JSON.parse(JSON.stringify(e.script.animations[e.index]));
        // console.log("adddddd", data);
        timeline.addAnimationObject(data);
      }
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
