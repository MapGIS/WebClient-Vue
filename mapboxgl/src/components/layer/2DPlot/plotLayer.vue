<template>
  <span />
</template>
<script>
import {
  PlotLayer2DGroup,
  PlotLayer2D,
  SymbolManager
} from "@mapgis/webclient-es6-service";
import { FabricLayer } from "@mapgis/webclient-es6-mapboxgl";
import axios from "axios";

export default {
  name: "mapgis-2d-plot-layer",
  inject: ["map"],
  props: {
    //点击回调事件
    pickPlot: {
      type: Function
    },
    // 标绘图层数据
    dataSource: {
      type: [String, Object, Array]
    },
    // 标绘图层的可见性
    show: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      layer: undefined,
      layers: undefined,
      dataSourceCopy: undefined
    };
  },
  watch: {
    dataSource: {
      handler: async function(json) {
        if (!json) return;
        if (!this.layer) this.layer = this.layer || new PlotLayer2D();

        if (typeof json === "string") {
          let data = await this.$_getData(json);
          return this.fromJSON(data);
        }
        this.dataSourceCopy = json;
        this.fromJSON(json);
      },
      deep: true,
      immediate: true
    },
    pickPlot: {
      handler: function(func) {
        if (!func || !this.layer) return;
        this.layer.pickPlot = func;
      },
      deep: true,
      immediate: true
    },
    show: {
      handler: function(val) {
        if (!this.layer || !this.layers) return;
        if (val) {
          this.layers.removeLayer(this.layer);
          this.layers.addLayer(this.layer);
        } else {
          this.layers.removeLayer(this.layer);
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.mount();
  },
  methods: {
    mount() {
      const { map } = this;
      const vm = this;
      let manager = new SymbolManager(
        "http://localhost:8895/标绘/symbols.json"
      );
      manager.getSymbols().then(function() {
        const canvas = new FabricLayer(map, PlotLayer2DGroup);
        vm.layers = vm.layers || canvas.getFabricCanvas();
        vm.layer = vm.layer || new PlotLayer2D();
        vm.layers.addLayer(vm.layer);
        
        vm.$emit("loaded", { component: vm, layer: vm.layer });
      });
    },
    async $_getData(url) {
      const res = await axios({
        method: "get",
        url: url,
        dataType: "text",
        timeout: 1000
      });
      this.dataSourceCopy = res.data;
      return res.data;
    },
    /**
     * @description: 导出json对象
     */
    toJSON() {
      return this.layer && this.layer.toJSON();
    },
    /**
     * @description: 加载json对象
     * @param {Object} json json对象
     * @return {*}
     */
    fromJSON(json) {
      // console.log("fromJSON", json);
      // const vm = this;
      // let manager = new SymbolManager(
      //   "http://localhost:8895/标绘/symbols.json"
      // );
      // manager.getSymbols().then(function() {
      //   vm.layer && vm.layer.fromJSON(json);
      // });
      this.layer && this.layer.fromJSON(json);
    },
    /**
     * @description: 添加标绘图元对象
     * @param {Object} plot
     * @return {*}
     */
    addPlot(plot) {
      this.layer && this.layer.addPlot(plot);
    },
    /**
     * @description: 删除标绘图元对象
     * @param {Object} plot
     * @return {*}
     */
    removePlot(plot) {
      this.layer && this.layer.removePlot(plot);
    },
    /**
     * @description: 通过标绘图元id移除标绘图元对象
     * @param {String} id
     * @return {*}
     */
    removePlotByID(id) {
      this.layer && this.layer.removePlotByID(id);
    },
    /**
     * @description: 根据标绘图元id获取标绘图元对象
     * @param {*} uid
     * @return {*}
     */
    getPlotByID(uid) {
      return this.layer && this.layer.getPlotByID(uid);
    },
    /**
     * @description: 获取图层Id
     * @return {String}
     */
    getLayerId() {
      return this.layer && this.layer.getLayerId();
    }
  }
};
</script>
