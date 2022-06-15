import Mapgis2dPlotAnimation from "../../mapboxgl/src/components/layer/2DPlot/plotAnimation.vue";
import Mapgis2dPlotLayer from "../../mapboxgl/src/components/layer/2DPlot/plotLayer.vue";
import { SymbolManager } from "@mapgis/webclient-es6-service";
import "../style/card.css";
// import Markdown from "../../cesium/docs/api/layer/Graphic/GraphicLayer.md";

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
        <mapgis-2d-plot-animation  v-bind="$props" :layer="layer1" :layers="layers1" v-if="layer1 && layers1">
        </mapgis-2d-plot-animation>
  </mapgis-web-map>`,
  data() {
    return {
      layer1: undefined,
      layers1: undefined,
      mapOptions: {
        crs: "EPSG:4326", //经纬度一定要设置crs参数
        maxBounds: [
          [-180, -90],
          [180, 90],
        ],
        zoom: 5,
        center: [107.19, 26.85],
      },
      jsonUrl: "http://localhost:8895/标绘/test.json",
      symbolUrl: "http://localhost:8895/标绘/symbols.json",
    };
  },
  methods: {
    handleLoad(e) {
      const vm = this;
      let manager = new SymbolManager(this.symbolUrl);
      manager.getSymbols().then(function () {
        vm.layer1 = e.layer;
        vm.layers1 = e.component.layers;
      });
    },
  },
});

export const 态势推演 = Template.bind({});
态势推演.args = {
  data: "http://localhost:8895/标绘/animation.json",
};

// 态势推演.parameters = {
//   docs: {
//     description: {
//       component: Markdown,
//     },
//   },
// };
