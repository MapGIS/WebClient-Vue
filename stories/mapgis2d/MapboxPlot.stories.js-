import Mapgis2dPlot from "../../mapboxgl/src/components/layer/2DPlot/plot.vue";
import Mapgis2dPlotLayer from "../../mapboxgl/src/components/layer/2DPlot/plotLayer.vue";
import Markdown from "../../mapboxgl/docs/api/Layers/2DPlot/Plot.md";
import "../style/card.css";

export default {
  title: "二维/二维标绘/行业标绘/二维标绘",
  component: Mapgis2dPlot,
  argTypes: {},
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { Mapgis2dPlot, Mapgis2dPlotLayer },
  template: `<mapgis-web-map @load="handle2dLoad" style="height:95vh" v-bind="{...mapOptions}" >
        <mapgis-rastertile-layer layerId="tdt" url="http://t0.tianditu.com/DataServer?T=vec_c&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752" />
        <mapgis-2d-plot-layer @loaded="handleLoad" :dataSource="jsonUrl" v-bind="$props" v-if="manager"></mapgis-2d-plot-layer>
        <mapgis-2d-plot ref="plot" v-bind="$props" :vueIndex="vueIndex1" :vueKey="vueKey1" class="storybook-ui-card" @loaded="manager=true">
          <template #symbol="slotProps">
            <mapgis-ui-plot-symbol
              :data="slotProps.data"
              :format="slotProps.format"
              :baseUrl="slotProps.baseUrl"
              @click="slotProps.click"
              @search="slotProps.search"
              class="mapgis-2d-plot-panel"
              :useIGS="false"
            ></mapgis-ui-plot-symbol>
          </template>
        </mapgis-2d-plot>      
        <mapgis-ui-space :size="8"  style="top:10px;right:10px;position:absolute;background:#fff;z-index:1"  v-if="vueIndex1 && vueKey1">
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
  </mapgis-web-map>`,
  data() {
    return {
      vueIndex1: undefined,
      vueKey1: undefined,
      mapOptions: {
        crs: "EPSG:4326", //经纬度一定要设置crs参数
        maxBounds: [
          [-180, -90],
          [180, 90],
        ],
        zoom: 7,
        center: [116.19, 34.01],
      },
      jsonUrl: `${window.domain}/标绘/test.json`,
      manager: undefined,
      editable: true,
    };
  },
  methods: {
    handle2dLoad(e) {
      let map = e.map;
      let bbox = [
        [116.2396164394222, 36.857699114405676],
        [119.38483688908019, 33.044482287500756],
      ];
      map.fitBounds(bbox, {
        duration: 0,
      });
    },
    handleLoad(e) {
      this.vueIndex1 = e.vueIndex;
      this.vueKey1 = e.vueKey;
    },
    getLayer() {
      let vueMap = this.vueMap || window.vueMap;
      if (!vueMap) return;
      let layerManager = vueMap.PlotLayerManager.findSource(
        this.vueKey1,
        this.vueIndex1
      );
      return layerManager && layerManager.source;
    },
    edit(editable) {
      let layer = this.getLayer();
      layer.editable = editable;
    },
    deletePlot() {
      this.$refs.plot.deletePlot();
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
    /**
     * 导出功能
     */
    exportClick() {
      let layer = this.getLayer();
      let data = layer.toJSON();
      this.exportJSON(data, "test.json");
    },
    exportJSON(data, filename) {
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

export const 二维标绘 = Template.bind({});
二维标绘.args = {
  symbolUrl: `${window.domain}/标绘/symbols.json`,
  baseUrl: `${window.domain}/`,
  useIGS: false,
};

二维标绘.parameters = {
  docs: {
    description: {
      component: Markdown,
    },
  },
};
