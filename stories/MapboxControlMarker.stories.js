import MapgisWebMap from "../mapboxgl/src/components/map/GlMap.vue";
import MapgisRasterLayer from "../mapboxgl/src/components/layer/RasterLayer.js";
import MapgisMarker from "../mapboxgl/src/components/UI/Marker.vue";

export default {
  title: "二维/交互-Marker",
  component: MapgisMarker,
  // english Our exports that end in "Data" are not stories.
  // 中文 Data后缀的内容不是故事，而是Vue组件的方法
  excludeStories: /.*Data$/,
  argTypes: {
    color: "#37495E",
    offset: [20, 20],
    coordinates: [110, 30],
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisWebMap, MapgisRasterLayer, MapgisMarker },
  methods: actionsData,
  template: `<mapgis-web-map crs="EPSG:4326" :center="[116.39, 40.2]" :zoom="3" style="height:60vh">
    <mapgis-rastertile-layer layerId="tdt" url="http://t0.tianditu.com/DataServer?T=vec_c&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752" />
    <mapgis-marker v-bind="$props">
      <div slot="marker" style="background: #ffffff;padding: 6px;border: 3px solid #ccc;border-radius: 3px;">内部自定义槽</div>
    </mapgis-marker>
  </mapgis-web-map>`,
});

export const Marker = Template.bind({});
Marker.args = {
  color: "#37495E",
  offset: [20, 20],
  coordinates: [110, 30],
};

export const actionsData = {
  onEventName: (e) => {},
};
