<template>
  <span />
</template>
<script>
import axios from "axios";
import plot from "@mapgis/webclient-plot";
const {PlotLayer2DGroup = Zondy.Plot.PlotLayer2DGroup,
  PlotLayer2D = Zondy.Plot.PlotLayer2D,
  SymbolManager = Zondy.Plot.SymbolManager,
  FabricLayer = Zondy.Plot.FabricLayer} = plot;

export default {
  name: "mapgis-2d-plot-layer",
  inject: ["map", "vueMap"],
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
    }, //点击回调事件
    pickPlot: {
      type: Function
    },
    // 标绘图层数据
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
    },
    // 三维贴地,0：贴地，1：贴模型，2：都贴，3： 都不贴
    classificationType: {
      type: Number,
      default: 3
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
    classificationType: {
      handler: function(val) {
        let layer = this.getLayer();
        if(layer) {
          layer.classificationType = this.classificationType;
        }
      },
      immediate: true
    },
    show: {
      handler: function(val) {
        let layer = this.getLayer();
        layer && layer.setVisible(val);
        // console.log("showww-2d", val);
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
      const { map } = this;
      const vm = this;
      let manager = this.getSymbolManager();
      if (!manager) {
        this.$message.warning("符号库未加载完成！");
        return;
      }
      manager.getSymbols().then(function() {
        let layer = vm.getLayer();
        if (!layer) {
          layer = new PlotLayer2D();
          layer.classificationType = vm.classificationType;
          window.vueMap.PlotLayerManager.addSource(
            vm.vueKey,
            vm.vueIndex,
            layer
          );
        }
        let layers = vm.getLayers();
        if (!layers) {
          let canvas;
          let MapManager = window.vueMap.MapManager.findSource(map.vueKey, map.vueIndex);
          if(!MapManager.options.canvas){
            canvas = new FabricLayer(map, PlotLayer2DGroup);
          }else {
            canvas = MapManager.options.canvas;
          }
          layers = canvas.getFabricCanvas();
          window.vueMap.PlotLayerGroupManager.addSource(
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
            timeout: 1000
          }).then(res => {
            vm.dataSourceCopy = res.data;
            vm.fromJSON(vm.dataSourceCopy);
          });
        } else {
          vm.fromJSON(vm.dataSourceCopy);
        }

        vm.$emit("loaded", { vueKey: vm.vueKey, vueIndex: vm.vueIndex, vm: vm });
      });
    },
    unmount() {
      let layer = this.getLayer();
      let layers = this.getLayers();

      if (layer && layers) {
        layers.removeLayer(layer);
        window.vueMap.PlotLayerGroupManager.deleteSource(
          this.vueKey,
          this.vueIndex
        );
        window.vueMap.PlotLayerManager.deleteSource(this.vueKey, this.vueIndex);
      }
    },
    getSymbolManager() {
      let PlotSymbolManager = window.PlotSymbolManager;
      return PlotSymbolManager;
    },
    getLayer() {
      let layerManager = window.vueMap.PlotLayerManager.findSource(
        this.vueKey,
        this.vueIndex
      );
      return layerManager && layerManager.source;
    },
    getLayers() {
      let PlotLayerGroupManager = window.vueMap.PlotLayerGroupManager.findSource(
        this.vueKey,
        this.vueIndex
      );
      return PlotLayerGroupManager && PlotLayerGroupManager.source;
    },
    /**
     * @description: 导出json对象
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
    },
    /**
     * @description: 获取图层Id
     * @return {String}
     */
    getLayerId() {
      let layer = this.getLayer();
      return layer && layer.getLayerId();
    }
  }
};
</script>
