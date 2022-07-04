import Mapgis3dPlot from "../../cesium/src/components/Layer/3DPlot/Plot.vue";
import Mapgis3dPlotLayer from "../../cesium/src/components/Layer/3DPlot/PlotLayer.vue";
import Markdown from "../../cesium/docs/api/layer/3DPlot/Plot.md";
import '../style/card.css'

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
        <mapgis-3d-plot v-bind="$props" :vueIndex="vueIndex1" :vueKey="vueKey1" v-if="vueIndex1 && vueKey1" class="storybook-ui-card"/>
  </mapgis-web-scene>`,
  data() {
    return {
      vueIndex1: undefined,
      vueKey1: undefined,
      jsonUrl: `http://${window.webclient.staticIP}:8895/标绘/test.json`,
    };
  },
  methods: {
    handleLoaded(e) {
      this.vueIndex1 = e.vueIndex;
      this.vueKey1 = e.vueKey;
    },
  },
});

export const 三维标绘 = Template.bind({});
三维标绘.args = {
  // symbolUrl: `http://${window.webclient.staticIP}:8895/标绘/symbols.json`,
  symbolUrl: `http://${window.webclient.staticIP}:8086/storybook/标绘/symbols.json`,
};

三维标绘.parameters = {
  docs: {
    description: {
      component: Markdown,
    },
  },
};
