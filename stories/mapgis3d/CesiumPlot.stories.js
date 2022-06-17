import Mapgis3dPlot from "../../cesium/src/components/Layer/3DPlot/Plot.vue";
import Mapgis3dPlotLayer from "../../cesium/src/components/Layer/3DPlot/PlotLayer.vue";
import '../style/card.css'
// import Markdown from "../../cesium/docs/api/layer/Graphic/GraphicLayer.md";

export default {
  title: "三维/图层/标绘/三维标绘",
  component: Mapgis3dPlot,
  argTypes: {},
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { Mapgis3dPlot,Mapgis3dPlotLayer },
  template: `<mapgis-web-scene style="height:95vh">
        <mapgis-3d-plot-layer @loaded="handleLoaded" :dataSource="jsonUrl" v-bind="$props"></mapgis-3d-plot-layer>
        <mapgis-3d-plot v-bind="$props" :vueIndex="vueIndex" :vueKey="vueKey" v-if="vueIndex && vueKey" class="storybook-ui-card"/>
  </mapgis-web-scene>`,
  data() {
    return {
      layer1: undefined,
      vueIndex: undefined,
      vueKey: undefined,
      jsonUrl: "http://localhost:8895/标绘/test.json",
    };
  },
  methods: {
    handleLoaded(e) {
      this.vueIndex = e.vueIndex;
      this.vueKey = e.vueKey;
    },
  },
});

export const 三维标绘 = Template.bind({});
三维标绘.args = {
  symbolUrl: "http://localhost:8895/标绘/symbols.json",
};

// 三维标绘.parameters = {
//   docs: {
//     description: {
//       component: Markdown,
//     },
//   },
// };
