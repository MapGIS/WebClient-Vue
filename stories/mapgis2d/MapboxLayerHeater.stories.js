import MapgisHeaterLayer from "../../mapboxgl/src/components/layer/heater/HeaterLayer.vue";

export default {
  title: "二维/可视化/热力",
  component: MapgisHeaterLayer,
  argTypes: {
    field: "驻留时间",
    geojson:
      "http://develop.smaryun.com/static/data/geojson/chinamobile_1000.geojson",
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisHeaterLayer },
  data() {
    return {
      mapOptions: {
        crs: "EPSG:4326", //经纬度一定要设置crs参数
        maxBounds: [
          [-180, -90],
          [180, 90],
        ],
        zoom: 5,
        center: [107.19, 26.85],
      },
    };
  },
  template: `
    <mapgis-web-map v-bind="{...mapOptions}" style="height:60vh">
        <mapgis-rastertile-layer layerId="tdt" url="http://t0.tianditu.com/DataServer?T=vec_c&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752" />
        <mapgis-heater-layer  v-bind="$props" />
    </mapgis-web-map>
    `,
});

export const 热力 = Template.bind({});
热力.args = {
  field: "驻留时间",
  geojson:
      `http://${window.webclient.ip}/static/data/geojson/chinamobile_1000.geojson`,
};
