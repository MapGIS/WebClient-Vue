import MapgisTrackerLayer from "../../mapboxgl/src/components/layer/tracker/TrackerLayer.vue";

export default {
  title: "二维/可视化/轨迹跟踪",
  component: MapgisTrackerLayer,
  argTypes: {
    geojson: `http://${window.webclient.ip}:${window.webclient.port}/static/data/geojson/tracker.geojson`,
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisTrackerLayer },
  data() {
    return {
      mapOptions: {
        crs: "EPSG:4326", //经纬度一定要设置crs参数
        maxBounds: [
          [-180, -90],
          [180, 90],
        ],
        pitch: 60,
        zoom: 14,
        center: [113.138846100467276, 23.0022126002313598],
      },
    };
  },
  template: `
    <mapgis-web-map v-bind="{...mapOptions}" style="height:95vh">
        <mapgis-rastertile-layer layerId="tdt" url="http://t0.tianditu.com/DataServer?T=vec_c&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752" />
        <mapgis-tracker-layer  v-bind="$props" />
    </mapgis-web-map>
    `,
});

export const 轨迹跟踪 = Template.bind({});
轨迹跟踪.args = {
  geojson: `http://${window.webclient.ip}:${window.webclient.port}/static/data/geojson/tracker.geojson`,
};
