import Mapgis3dPlot from "../../cesium/src/components/Layer/3DPlot/Plot.vue";
import Mapgis3dPlotLayer from "../../cesium/src/components/Layer/3DPlot/PlotLayer.vue";
import Markdown from "../../cesium/docs/api/layer/3DPlot/Plot.md";
import "../style/card.css";

export default {
  title: "三维/图层/标绘/三维标绘",
  component: Mapgis3dPlot,
  argTypes: {},
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { Mapgis3dPlot, Mapgis3dPlotLayer },
  template: `<mapgis-web-scene style="height:95vh">
      <mapgis-3d-plot-layer @loaded="handleLoaded" :classificationType="classificationType" :dataSource="jsonUrl" v-bind="$props" v-if="manager"></mapgis-3d-plot-layer>
      <mapgis-3d-plot ref="plot" v-bind="$props" :vueIndex="vueIndex1" :vueKey="vueKey1" class="storybook-ui-card" @loaded="manager=true"/>
      <mapgis-ui-space :size="8"  style="top:10px;right:10px;position:absolute;background:#fff"  v-if="vueIndex1 && vueKey1">
        <mapgis-ui-iconfont type="mapgis-daoru" @click="importClick"/>
        <input
          type="file"
          ref="importFile"
          v-show="false"
          @change="selectFile"
        />
        <mapgis-ui-iconfont type="mapgis-daochu" @click="exportClick"/>
        <mapgis-ui-iconfont type="mapgis-shanchu" @click="deletePlot"/>
        <mapgis-ui-switch-panel
         label="图层编辑"
         v-model="editable"
         @changeChecked="edit"
         :isTitleBold="false"
         :hasTopMargin="false"
         :hasBottomMargin="false"
         size="small"
        />
      </mapgis-ui-space>
  </mapgis-web-scene>`,
  data() {
    return {
      vueIndex1: undefined,
      vueKey1: undefined,
      jsonUrl: `http://${window.webclient.ip}:${window.webclient.port}/标绘/test.json`,
      // jsonData: undefined,
      manager: undefined,
      classificationType: 3,
      editable: false,
    };
  },
  methods: {
    handleLoaded(e) {
      this.vueIndex1 = e.vueIndex;
      this.vueKey1 = e.vueKey;

      e.vm.viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(117.7646, 33.0881, 210000),
        orientation: {
          heading: Cesium.Math.toRadians(0),
          pitch: Cesium.Math.toRadians(-45),
          roll: 0,
        },
        duration: 1,
      });
    },
    getLayer() {
      let vueCesium = this.vueCesium || window.vueCesium;
      if (!vueCesium) return;
      let layerManager = window.vueCesium.PlotLayerManager.findSource(
        this.vueKey1,
        this.vueIndex1
      );
      return layerManager && layerManager.source;
    },
    edit(editable) {
      let layer = this.getLayer();
      layer.editable = editable;
    },
    /**
     * 导入功能
     */
    importClick() {
      this.$refs.importFile.click();
    },
    selectFile(e) {
      const vm = this;
      let reader = new FileReader();
      reader.readAsText(e.target.files[0], "UTF-8");
      reader.onload = function (res) {
        let jsonData = JSON.parse(res.target.result);
        let layer = vm.getLayer();
        layer && layer.fromJSON(jsonData);
      };
    },
    deletePlot() {
      this.$refs.plot.deletePlot();
    },
    /**
     * 导出功能
     */
    exportClick() {
      let layer = this.getLayer();
      let data = layer.toJSON();
      this.exportJSON(data, "test.json");
    },
    exportJSON(data, filename) {
      // console.log(data, "exportJSON");
      if (typeof data === "object") {
        data = JSON.stringify(data, undefined, 4);
      }
      var blob = new Blob([data], { type: "text/json" }),
        e = document.createEvent("MouseEvents"),
        a = document.createElement("a");
      a.download = filename;
      a.href = window.URL.createObjectURL(blob);
      a.dataset.downloadurl = ["text/json", a.download, a.href].join(":");
      e.initMouseEvent(
        "click",
        true,
        false,
        window,
        0,
        0,
        0,
        0,
        0,
        false,
        false,
        false,
        false,
        0,
        null
      );
      a.dispatchEvent(e);
    },
  },
});

export const 三维标绘 = Template.bind({});
三维标绘.args = {
  symbolUrl: `http://${window.webclient.ip}:${window.webclient.port}/标绘/symbols.json`,
  // 打包时使用
  // symbolUrl: `http://${window.webclient.staticIP}:8086/storybook/标绘/symbols.json`,
};

三维标绘.parameters = {
  docs: {
    description: {
      component: Markdown,
    },
  },
};
