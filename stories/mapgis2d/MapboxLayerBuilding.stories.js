import MapgisBuildingLayer from "../../mapboxgl/src/components/layer/building/BuildingLayer.vue";

export default {
  title: "二维/数据图层/3D/建筑白膜",
  component: MapgisBuildingLayer,
  argTypes: {
    geojson:{
      description:'[官方白膜文档](https://docs.mapbox.com/mapbox-gl-js/example/3d-buildings/)',
      type: { name: 'Object | String', required: false },
      table:{
        type: { summary: 'Object | String' },
        defaultValue: { summary: '必传' },
      },
      control:'object'
    },
    color: {
      description:'白膜颜色',
      type:{ name: 'String', required: false },
      defaultValue: '#ffffff',
      table:{
        type:{
          summary: 'String',
        },
        defaultValue: { summary: '#ffffff' },
      },
      control:'color'
    },
    field: {
      description:'白膜高度选取的字段',
      type:{ name: 'String', required: false },
      defaultValue: 'point_count',
      table:{
        type:{
          summary: 'String',
        },
        defaultValue: { summary: 'point_count' },
      },
      control:'text'
    },
    opacity: {
      description:'白膜透明度',
      defaultValue:0.85 ,
      type: { name: 'Number', required: false },
      table:{
        type: { summary: 'Number' },
        defaultValue: { summary: '0.85' },
      },
      control:'number'
    },
    heightScale: {
      description:'高程缩放比',
      defaultValue:1.0 ,
      type: { name: 'Number', required: false },
      table:{
        type: { summary: 'Number' },
        defaultValue: { summary: '1.0' },
      },
      control:'number'
    },
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
    <mapgis-web-map v-bind="{...mapOptions}" style="height:95vh">
        <mapgis-rastertile-layer layerId="tdt" url="http://t0.tianditu.com/DataServer?T=vec_c&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752" />
        <mapgis-building-layer  v-bind="$props" />
    </mapgis-web-map>
    `,
});

export const 建筑白膜 = Template.bind({});
建筑白膜.args = {
  // geojson: "http://develop.smaryun.com/static/data/geojson/building-500.geojson",
  geojson: `http://${window.webclient.ip}:${window.webclient.port}/static/data/geojson/building-500.geojson`,
  field: "height",
  heightScale: 2,
};
