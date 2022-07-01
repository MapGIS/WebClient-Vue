import Mapgis2dPlotAnimation from "../../mapboxgl/src/components/layer/2DPlot/plotAnimation.vue";
import Mapgis2dPlotLayer from "../../mapboxgl/src/components/layer/2DPlot/plotLayer.vue";
import { SymbolManager } from "@mapgis/webclient-es6-service";
import Markdown from "../../mapboxgl/docs/api/Layers/2DPlot/PlotAnimation.md";
import "../style/card.css";

export default {
  title: "二维/图层/标绘/态势推演",
  component: Mapgis2dPlotAnimation,
  argTypes: {},
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { Mapgis2dPlotAnimation, Mapgis2dPlotLayer },
  template: `<mapgis-web-map style="height:95vh" v-bind="{...mapOptions}" >
        <mapgis-rastertile-layer layerId="tdt" url="http://t0.tianditu.com/DataServer?T=vec_c&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752" />
        <mapgis-2d-plot-layer @loaded="handleLoad" :dataSource="jsonUrl" v-bind="$props" :symbolUrl="symbolUrl"></mapgis-2d-plot-layer>
        <mapgis-2d-plot-animation  v-bind="$props" :vueIndex="vueIndex1" :vueKey="vueKey1" v-if="vueIndex1 && vueKey1">
        </mapgis-2d-plot-animation>
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
        zoom: 8,
        center: [116.19, 35.01],
      },
      jsonUrl: `http://${window.webclient.staticIP}:8895/标绘/test.json`,
      symbolUrl: `http://${window.webclient.staticIP}:8895/标绘/symbols.json`,
      // jsonUrl: `http://localhost:8895/标绘/test.json`,
      // symbolUrl: `http://localhost:8895/标绘/symbols.json`,
    };
  },
  methods: {
    handleLoad(e) {
      const vm = this;
      let manager = new SymbolManager(this.symbolUrl);
      manager.getSymbols().then(function () {
        vm.vueIndex1 = e.vueIndex;
        vm.vueKey1 = e.vueKey;
      });
    },
  },
});

export const 态势推演 = Template.bind({});
态势推演.args = {
  // data: `http://${window.webclient.staticIP}:8895/标绘/animation.json`,
  data: `http://localost:8895/标绘/animation.json`,
};

态势推演.parameters = {
  docs: {
    description: {
      component: Markdown,
    },
  },
};
