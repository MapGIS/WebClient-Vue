import MapgisCityGrow from "../../mapboxgl/src/components/simulation/CityGrow.vue";

export default {
  title: "二维/可视化/城市生长",
  component: MapgisCityGrow,
  argTypes: {
    vectortile: {},
    field: "height",
    heightScale: 2,
    time: 60,
    fps: 60,
    width: "600px",
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisCityGrow },
  data() {
    return {
      mapOptions: {
        crs: "EPSG:4326", //经纬度一定要设置crs参数
        maxBounds: [
          [-180, -90],
          [180, 90],
        ],
        pitch: 60,
        zoom: 12,
        center: [114.0411, 22.5502],
      },
    };
  },
  methods: {
    handleGrow() {
      this.$refs.citygrow.startGrow();
    },
  },
  template: `
    <mapgis-web-map v-bind="{...mapOptions}">
      <mapgis-ui-button @click="handleGrow" type="primary" :style="{position: 'absolute', zIndex:3000}">
        城市生长
      </mapgis-ui-button>
        <mapgis-rastertile-layer v-if="false" layerId="tdt" url="http://t0.tianditu.com/DataServer?T=vec_c&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752" />
        <mapgis-city-grow ref="citygrow"  v-bind="$props" />
    </mapgis-web-map>
    `,
});

export const 城市生长 = Template.bind({});
城市生长.args = {
  vectortile: {
    sourceLayer: "白模",
    url:
      "http://localhost:6163/igs/rest/mrms/tile/动态要素图层/{z}/{y}/{x}?type=cpbf",
  },
  field: "height",
  heightScale: 2,
  time: 60,
  fps: 60,
  width: 600,
};
