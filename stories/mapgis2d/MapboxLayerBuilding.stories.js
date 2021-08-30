import MapgisBuildingLayer from "../../mapboxgl/src/components/layer/building/BuildingLayer.vue";

export default {
  title: "二维/图层-建筑白膜",
  component: MapgisBuildingLayer,
  argTypes: {
    geojson: "",
    field: "height",
    heightScale: 2,
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisBuildingLayer },
  data() {
    return {
      mapOptions: {
        crs: "EPSG:4326", //经纬度一定要设置crs参数
        maxBounds: [
          [-180, -90],
          [180, 90],
        ],
        zoom: 15.5,
        pitch: 60,
        center: [114.05, 22.51],
      },
    };
  },
  template: `
    <mapgis-web-map v-bind="{...mapOptions}" style="height:60vh">
        <mapgis-rastertile-layer layerId="tdt" url="http://t0.tianditu.com/DataServer?T=vec_c&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752" />
        <mapgis-building-layer  v-bind="$props" />
    </mapgis-web-map>
    `,
});

export const 小数据GEOJSON = Template.bind({});
小数据GEOJSON.args = {
  geojson: "http://develop.smaryun.com/static/data/geojson/building-500.geojson",
  field: "height",
  heightScale: 2,
};
