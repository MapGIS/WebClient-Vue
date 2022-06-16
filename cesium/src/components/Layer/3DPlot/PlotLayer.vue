<template>
  <span />
</template>

<script>
import {
  PlotLayer3DGroup,
  PlotLayer3D,
  SymbolManager
} from "@mapgis/webclient-es6-service";
import axios from "axios";

export default {
  name: "mapgis-3d-plot-layer",
  inject: ["viewer", "Cesium"],
  props: {
    vueKey: {
      type: String,
      default: "default"
    },
    vueIndex: {
      type: Number,
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
      type: [String, Object, Array]
    },
    symbolUrl: {
      type: String
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
      layer: undefined,
      layers: undefined,
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
        if (!func || !this.layer) return;
        this.layer.pickPlot = func;
      },
      deep: true,
      immediate: true
    },
    pickEventType: {
      handler: function(type) {
        if (!type || !this.layer) return;
        this.layer.pickEventType = type;
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
      immediate: true
    },
    editable: {
      handler: function(val) {
        if (!this.layer) return;
        this.layer.editable = val;
      },
      immediate: true
    }
  },
  mounted() {
    this.mount();
  },
  destroyed() {
    // this.unmount();
  },
  methods: {
    mount() {
      const { viewer, Cesium } = this;
      const vm = this;
      let manager = new SymbolManager(this.symbolUrl);
      manager.getSymbols().then(function() {
        viewer.scene.globe.depthTestAgainstTerrain = false;
        vm.layers = vm.layers || new PlotLayer3DGroup(viewer);
        vm.layer = vm.layer || new PlotLayer3D(Cesium, viewer);
        vm.layers.addLayer(vm.layer);

        if (!vm.dataSourceCopy) {
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

        vm.$emit("loaded", { component: vm, layer: vm.layer });
      });
    },
    unmount(){
      this.layer.removeAll()
      this.layers.removeLayer(this.layer);
      this.layer = undefined;
      this.layers = undefined;
    },
    /**
     * @description: 导出图层数据(json对象)
     */
    toJSON() {
      return this.layer.toJSON();
    },
    /**
     * @description: 加载json对象
     * @param {Object} json json对象
     * @return {*}
     */
    fromJSON(json) {
      // const vm = this;
      // let manager = new SymbolManager(this.symbolUrl);
      // manager.getSymbols().then(function() {
      //   vm.layer.fromJSON(json);
      // });
      this.layer.fromJSON(json);
    },
    /**
     * @description: 添加标绘图元对象
     * @param {Object} plot
     * @return {*}
     */
    addPlot(plot) {
      this.layer.addPlot(plot);
    },
    /**
     * @description: 删除标绘图元对象
     * @param {Object} plot
     * @return {*}
     */
    removePlot(plot) {
      this.layer.removePlot(plot);
    },
    /**
     * @description 移除图层下的所有标绘图元
     */
    removeAll() {
      this.layer.removeAll();
    },
    /**
     * @description: 通过标绘图元id移除标绘图元对象
     * @param {String} id
     * @return {*}
     */
    removePlotByID(id) {
      this.layer.removePlotByID(id);
    },
    /**
     * @description: 根据标绘图元id获取标绘图元对象
     * @param {*} uid
     * @return {*}
     */
    getPlotByID(uid) {
      return this.layer.getPlotByID(uid);
    }
  }
};
</script>
