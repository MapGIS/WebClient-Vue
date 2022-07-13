import MapgisClusterLayer from "../../mapboxgl/src/components/layer/cluster/ClusterLayer.vue";

export default {
  title: "二维/可视化/聚类",
  component: MapgisClusterLayer,
  argTypes: {
    geojson: "",
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisClusterLayer },
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
        mapStyle: {
          version: 8,
          name: "街道地图",
          metadata: {},
          sources: {},
          layers: [],
          sprite: `http://${window.webclient.igsIp}:${window.webclient.igsPort}/igs/rest/mrms/vtiles/sprite`,
          glyphs:
              `http://${window.webclient.igsIp}:${window.webclient.igsPort}/igs/rest/mrms/vtiles/fonts/{fontstack}/{range}.pbf`,
        },
      },
    };
  },
  template: `
    <mapgis-web-map v-bind="{...mapOptions}" style="height:95vh">
        <mapgis-rastertile-layer layerId="tdt" url="http://t0.tianditu.com/DataServer?T=vec_c&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752" />
        <mapgis-cluster-layer  v-bind="$props" />
    </mapgis-web-map>
    `,
});

export const 聚类 = Template.bind({});
聚类.args = {
  geojson:
      `http://${window.webclient.ip}:${window.webclient.port}/static/data/geojson/chinamobile_1000.geojson`,
};
