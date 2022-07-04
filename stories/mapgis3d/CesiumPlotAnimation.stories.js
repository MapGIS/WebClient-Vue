import Mapgis3dPlotAnimation from "../../cesium/src/components/Layer/3DPlot/PlotAnimation.vue";
import Mapgis3dPlotLayer from "../../cesium/src/components/Layer/3DPlot/PlotLayer.vue";
import { SymbolManager } from "@mapgis/webclient-es6-service";
import Markdown from "../../cesium/docs/api/layer/3DPlot/PlotAnimation.md";
import "../style/card.css";

export default {
  title: "三维/图层/标绘/态势推演",
  component: Mapgis3dPlotAnimation,
  argTypes: {},
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { Mapgis3dPlotAnimation, Mapgis3dPlotLayer },
  template: `<mapgis-web-scene style="height:95vh">
        <mapgis-3d-plot-layer @loaded="handleLoaded" :dataSource="jsonUrl" :symbolUrl="symbolUrl"></mapgis-3d-plot-layer>
        <mapgis-3d-plot-animation v-bind="$props" :vueIndex="vueIndex1" :vueKey="vueKey1" v-if="vueKey1 && vueIndex1"/>
  </mapgis-web-scene>`,
  data() {
    return {
      vueIndex1: undefined,
      vueKey1: undefined,
      // jsonUrl: `http://${window.webclient.staticIP}:8895/标绘/test.json`,
      // symbolUrl: `http://${window.webclient.staticIP}:8895/标绘/symbols.json`,
      jsonUrl: `http://${window.webclient.staticIP}:8086/storybook/标绘/test.json`,
      symbolUrl: `http://${window.webclient.staticIP}:8086/storybook/标绘/symbols.json`,
    };
  },
  methods: {
    handleLoaded(e) {
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
  data: `http://${window.webclient.staticIP}:8086/storybook/标绘/animation.json`,
  // data: `http://localhost:8895/标绘/animation.json`,
};

态势推演.parameters = {
  docs: {
    description: {
      component: Markdown,
    },
  },
};
