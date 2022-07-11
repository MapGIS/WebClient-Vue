<template>
  <span />
</template>

<script>
import axios from "axios";
import plot from "@mapgis/webclient-plot";
const { SymbolManager,PlotLayer3DGroup,PlotLayer3D } = plot;

export default {
  name: "mapgis-3d-plot-layer",
  inject: ["viewer", "Cesium"],
  props: {
    vueKey: {
      type: String,
      default: "default"
    },
    vueIndex: {
      type: [Number, String],
      default() {
        return Number((Math.random() * 100000000).toFixed(0));
      }
    },
    //点击回调事件
    pickPlot: {
      type: Function
    },
    // 点击事件
    pickEventType: {
      type: Number,
      default() {
        const { Cesium } = this;
        return Cesium.ScreenSpaceEventType.LEFT_CLICK;
      }
    },
    // 标绘图层json对象
    dataSource: {
      type: [String, Object]
    },
    // 标绘图层的可见性
    show: {
      type: Boolean,
      default: true
    },
    // 标绘图层的可编辑性
    editable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dataSourceCopy: undefined
    };
  },
  watch: {
    dataSource: {
      handler: async function(json) {
        if (!json) return;
        if (typeof json === "object") {
          this.dataSourceCopy = json;
        }
      },
      deep: true,
      immediate: true
    },
    pickPlot: {
      handler: function(func) {
        let layer = this.getLayer();
        if (!func || !layer) return;
        layer.pickPlot = func;
      },
      deep: true,
      immediate: true
    },
    pickEventType: {
      handler: function(type) {
        let layer = this.getLayer();
        if (!type || !layer) return;
        layer.pickEventType = type;
      },
      deep: true,
      immediate: true
    },
    show: {
      handler: function(val) {
        let layer = this.getLayer();
        layer && layer.setVisible(val);
        // console.log("showww-3d", val);
      },
      immediate: true
    },
    editable: {
      handler: function(val) {
        let layer = this.getLayer();
        if (!layer) return;
        layer.editable = val;
      },
      immediate: true
    }
  },
  mounted() {
    this.mount();
  },
  destroyed() {
    this.unmount();
  },
  methods: {
    mount() {
      this.initLayer();
    },
    unmount() {
      let layer = this.getLayer();
      let layers = this.getLayers();

      if (layer && layers) {
        layer.removeAll();
        layers.removeLayer(layer);
        window.vueCesium.PlotLayerManager.deleteSource(
          this.vueKey,
          this.vueIndex
        );
        window.vueCesium.PlotLayerGroupManager.deleteSource(
          this.vueKey,
          this.vueIndex
        );
      }
    },
    initLayer() {
      const { viewer, Cesium } = this;
      const vm = this;
      let manager = this.getSymbolManager();
      if (!manager) {
        this.$message.warning("符号库未加载完成！");
        return;
      }
      manager.getSymbols().then(function() {
        viewer.scene.globe.depthTestAgainstTerrain = false;
        let layer = window.vueCesium.PlotLayerManager.findSource(
          vm.vueKey,
          vm.vueIndex
        );
        if (!layer) {
          layer = new PlotLayer3D(Cesium, viewer);
          window.vueCesium.PlotLayerManager.addSource(
            vm.vueKey,
            vm.vueIndex,
            layer
          );
        }
        let layers = window.vueCesium.PlotLayerGroupManager.findSource(
          vm.vueKey,
          vm.vueIndex
        );
        if (!layers) {
          layers = new PlotLayer3DGroup(viewer);
          window.vueCesium.PlotLayerGroupManager.addSource(
            vm.vueKey,
            vm.vueIndex,
            layers
          );
        }
        layers.addLayer(layer);

        if (!vm.dataSourceCopy) {
          axios.defaults.withCredentials = true;
          axios({
            method: "get",
            url: vm.dataSource,
            dataType: "text",
            timeout: 2000
          }).then(res => {
            vm.dataSourceCopy = res.data;
            vm.fromJSON(JSON.parse(JSON.stringify(vm.dataSourceCopy)));
            vm.$emit("loaded", { vueKey: vm.vueKey, vueIndex: vm.vueIndex });
          });
        } else {
          vm.fromJSON(JSON.parse(JSON.stringify(vm.dataSourceCopy)));
          vm.$emit("loaded", { vueKey: vm.vueKey, vueIndex: vm.vueIndex });
        }
      });
    },
    getSymbolManager() {
      let PlotSymbolManager = window.PlotSymbolManager;
      return PlotSymbolManager;
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
    /**
     * @description: 导出图层数据(json对象)
     */
    toJSON() {
      let layer = this.getLayer();
      return layer && layer.toJSON();
    },
    /**
     * @description: 加载json对象
     * @param {Object} json json对象
     * @return {*}
     */
    fromJSON(json) {
      let layer = this.getLayer();
      layer && layer.fromJSON(json);
    },
    /**
     * @description: 添加标绘图元对象
     * @param {Object} plot
     * @return {*}
     */
    addPlot(plot) {
      let layer = this.getLayer();
      layer && layer.addPlot(plot);
    },
    /**
     * @description: 删除标绘图元对象
     * @param {Object} plot
     * @return {*}
     */
    removePlot(plot) {
      let layer = this.getLayer();
      layer && layer.removePlot(plot);
    },
    /**
     * @description 移除图层下的所有标绘图元
     */
    removeAll() {
      let layer = this.getLayer();
      layer && layer.removeAll();
    },
    /**
     * @description: 通过标绘图元id移除标绘图元对象
     * @param {String} id
     * @return {*}
     */
    removePlotByID(id) {
      let layer = this.getLayer();
      layer && layer.removePlotByID(id);
    },
    /**
     * @description: 根据标绘图元id获取标绘图元对象
     * @param {*} uid
     * @return {*}
     */
    getPlotByID(uid) {
      let layer = this.getLayer();
      return layer && layer.getPlotByID(uid);
    }
  }
};
</script>
