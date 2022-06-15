import Mapgis3dPlotAnimation from "../../cesium/src/components/Layer/3DPlot/PlotAnimation.vue";
import Mapgis3dPlotLayer from "../../cesium/src/components/Layer/3DPlot/PlotLayer.vue";
import { SymbolManager } from "@mapgis/webclient-es6-service";
import "../style/card.css";
// import Markdown from "../../cesium/docs/api/layer/Graphic/GraphicLayer.md";

export default {
  title: "三维/图层/标绘/态势推演",
  component: Mapgis3dPlotAnimation,
  argTypes: {},
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { Mapgis3dPlotAnimation, Mapgis3dPlotLayer },
  template: `<mapgis-web-scene style="height:95vh" @load="handleLoad">
        <mapgis-3d-plot-layer @loaded="handleLoaded" :dataSource="jsonUrl" :symbolUrl="symbolUrl"></mapgis-3d-plot-layer>
        <mapgis-3d-plot-animation v-bind="$props" :layer="layer1" :layers="layers1" v-if="layer1 && layers1"/>
  </mapgis-web-scene>`,
  data() {
    return {
      layer1: undefined,
      layers1: undefined,
      Cesium: undefined,
      viewer: undefined,
      jsonUrl: "http://localhost:8895/标绘/test.json",
      symbolUrl: "http://localhost:8895/标绘/symbols.json",
    };
  },
  methods: {
    handleLoad(e) {
      const { component, Cesium } = e;
      this.Cesium = Cesium;
      this.viewer = component.viewer;
    },
    handleLoaded(e) {
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
