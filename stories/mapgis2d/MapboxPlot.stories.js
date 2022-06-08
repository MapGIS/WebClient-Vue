import Mapgis2dPlot from "../../mapboxgl/src/components/layer/2DPlot/plot.vue";
import Mapgis2dPlotLayer from "../../mapboxgl/src/components/layer/2DPlot/plotLayer.vue";
import '../style/card.css'
// import Markdown from "../../cesium/docs/api/layer/Graphic/GraphicLayer.md";

export default {
  title: "二维/图层/标绘",
  component: Mapgis2dPlot,
  argTypes: {},
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { Mapgis2dPlot,Mapgis2dPlotLayer },
  template: `<mapgis-web-map style="height:95vh" v-bind="{...mapOptions}" >
        <mapgis-rastertile-layer layerId="tdt" url="http://t0.tianditu.com/DataServer?T=vec_c&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752" />
        <mapgis-2d-plot-layer @loaded="handleLoad" :dataSource="jsonUrl"></mapgis-2d-plot-layer>
        <mapgis-2d-plot  v-bind="$props" :layer="layer1" v-if="layer1" class="storybook-ui-card">
          <template #symbol="slotProps">
            <mapgis-ui-plot-symbol
              :data="slotProps.data"
              @click="slotProps.click"
              @search="slotProps.search"
              ></mapgis-ui-plot-symbol>
          </template>
        </mapgis-2d-plot>
  </mapgis-web-map>`,
  data() {
    return {
      layer1: undefined,
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
    };
  },
  methods: {
    handleLoad(e) {
      this.layer1 = e.layer;
    },
  },
});

export const 二维标绘 = Template.bind({});
二维标绘.args = {
  symbolUrl: "http://localhost:8895/标绘/symbols.json",
};

// 二维标绘.parameters = {
//   docs: {
//     description: {
//       component: Markdown,
//     },
//   },
// };
