import MapgisCityGlow from "../../mapboxgl/src/components/simulation/CityGlow.vue";

export default {
  title: "二维/可视化/城市生长",
  component: MapgisCityGlow,
  argTypes: {},
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisCityGlow },
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
  template: `
    <mapgis-web-map v-bind="{...mapOptions}">
        <mapgis-rastertile-layer layerId="tdt" url="http://t0.tianditu.com/DataServer?T=vec_c&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752" />
        <mapgis-city-glow  v-bind="$props" />
    </mapgis-web-map>
    `,
});

export const 城市生长 = Template.bind({});
城市生长.args = {};
