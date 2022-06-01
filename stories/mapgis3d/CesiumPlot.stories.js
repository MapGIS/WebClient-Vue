import {
  PlotLayer3DGroup,
  PlotLayer3D,
} from "@mapgis/webclient-es6-service";
import Mapgis3dPlot from "../../cesium/src/components/Layer/3DPlot/Plot.vue";
// import Markdown from "../../cesium/docs/api/layer/Graphic/GraphicLayer.md";
import axios from "axios";

export default {
  title: "三维/图层/标绘",
  component: Mapgis3dPlot,
  argTypes: {},
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { Mapgis3dPlot },
  template: `<mapgis-web-scene style="height:95vh" @load="handleLoad">
      <mapgis-3d-plot v-bind="$props" :layer="layer1"/>
  </mapgis-web-scene>`,
  data() {
    return {
      layer1: undefined,
      Cesium: undefined,
      viewer: undefined
    };
  },
  methods: {
    handleLoad(e){
      const { component,Cesium } = e;
      this.Cesium = Cesium;
      this.viewer = component.viewer;
      // console.log('eee',e);
      let plotLayerMap = new PlotLayer3DGroup(this.viewer);
      this.layer1 = new PlotLayer3D(this.Cesium, this.viewer);
      plotLayerMap.addLayer(this.layer1);

      this.getData();
    },

    async getData(){
      const res = await axios({
        method: "get",
        url: 'http://localhost:8895/标绘/test.json',
        dataType: "text",
        timeout: 1000
      });
      console.log('res',res);
      this.layer1.fromJSON(res.data);
    }
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
