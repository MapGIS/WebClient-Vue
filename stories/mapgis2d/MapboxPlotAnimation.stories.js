import Mapgis2dPlotAnimation from "../../mapboxgl/src/components/layer/2DPlot/plotAnimation.vue";
import Mapgis2dPlotLayer from "../../mapboxgl/src/components/layer/2DPlot/plotLayer.vue";
import plot from "@mapgis/webclient-plot";
const { SymbolManager = window.Zondy.Plot.FabricLayer } = plot;
import Markdown from "../../mapboxgl/docs/api/Layers/2DPlot/PlotAnimation.md";
import "../style/card.css";
import * as axios from "axios";

export default {
  title: "二维/图层/标绘/态势推演",
  component: Mapgis2dPlotAnimation,
  argTypes: {},
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { Mapgis2dPlotAnimation, Mapgis2dPlotLayer },
  template: `<mapgis-web-map @load="handle2dLoad" style="height:95vh" v-bind="{...mapOptions}" >
        <mapgis-rastertile-layer layerId="tdt" url="http://t0.tianditu.com/DataServer?T=vec_c&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752" />
        <mapgis-2d-plot-layer @loaded="handleLoad" :dataSource="jsonUrl" v-bind="$props" :symbolUrl="symbolUrl" v-if="manager"></mapgis-2d-plot-layer>
        <mapgis-2d-plot-animation :data="dataSource" :vueIndex="vueIndex1" :vueKey="vueKey1" v-if="vueIndex1">
        </mapgis-2d-plot-animation>
        <mapgis-ui-space :size="8"  style="top:10px;right:10px;position:absolute;background:#fff">
          <mapgis-ui-iconfont type="mapgis-daoru" @click="importClick"/>
          <input
              type="file"
              ref="importFile"
              v-show="false"
              @change="selectFile"
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
      jsonUrl: `http://${window.webclient.ip}:${window.webclient.port}/标绘/test.json`,
      symbolUrl: `http://${window.webclient.ip}:${window.webclient.port}/标绘/symbols.json`,
      dataUrl: `http://${window.webclient.ip}:${window.webclient.port}/标绘/animation.json`,
      // 打包时使用
      // jsonUrl: `http://${window.webclient.staticIP}:8086/storybook/标绘/test.json`,
      // symbolUrl: `http://${window.webclient.staticIP}:8086/storybook/标绘/symbols.json`,
      // dataUrl: `http://${window.webclient.staticIP}:8086/storybook/标绘/animation.json`,
      manager: undefined,
      dataSource: undefined,
      // jsonUrl: `http://localhost:8895/标绘/test.json`,
      // symbolUrl: `http://localhost:8895/标绘/symbols.json`,
    };
  },
  created() {
    this.manager = window.PlotSymbolManager;
    if (!this.manager) {
      this.manager = new SymbolManager(this.symbolUrl);
      window.PlotSymbolManager = this.manager;
    }
  },
  methods: {
    handle2dLoad(e) {
      let map = e.map;
      let bbox = [
        [116.2396164394222, 36.857699114405676],
        [119.38483688908019,33.044482287500756],
      ];
      map.fitBounds(bbox, {
        duration: 0,
      });
    },
    importClick() {
      this.$refs.importFile.click();
    },
    selectFile(e) {
      const vm = this;
      let reader = new FileReader();
      reader.readAsText(e.target.files[0], "UTF-8");
      reader.onload = function (res) {
        vm.jsonData = JSON.parse(res.target.result);
        vm.layer.fromJSON(vm.jsonData);
      };
    },
    handleLoad(e) {
      const vm = this;
      axios.get(vm.dataUrl).then((res) => {
        vm.dataSource = res.data;
        vm.vueIndex1 = e.vueIndex;
        vm.vueKey1 = e.vueKey;
        let vueMap = vm.vueMap || window.vueMap;
        if (!vueMap) return;
        let layerManager = vueMap.PlotLayerManager.findSource(
          vm.vueKey1,
          vm.vueIndex1
        );
        vm.layer = layerManager && layerManager.source;
      });
    },
  },
});

export const 态势推演 = Template.bind({});
态势推演.args = {
  // data: `http://localost:8895/标绘/animation.json`,
};

态势推演.parameters = {
  docs: {
    description: {
      component: Markdown,
    },
  },
};
