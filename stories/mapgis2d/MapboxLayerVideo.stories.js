import MapgisWebMap from "../../mapboxgl/src/components/map/GlMap.vue";
import MapgisRasterLayer from "../../mapboxgl/src/components/layer/RasterLayer.js";
import MapgisVideoLayer from "../../mapboxgl/src/components/layer/VideoLayer.js";

export default {
  title: "二维/图层/视频图层",
  component: MapgisVideoLayer,
  // english Our exports that end in "Data" are not stories.
  // 中文 Data后缀的内容不是故事，而是Vue组件的方法
  excludeStories: /.*Data$/,
  argTypes: {
    delay: true,
    layer: {},
    layerId: "video_layer_id",
    source: {},
    sourceId: "video_source_id",
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisWebMap, MapgisRasterLayer, MapgisVideoLayer },
  methods: actionsData,
  template: `<mapgis-web-map crs="EPSG:4326" :center="[-122.514426, 37.562984]" :zoom="17" style="height:60vh">
    <mapgis-rastertile-layer layerId="tdt" url="http://t0.tianditu.com/DataServer?T=vec_c&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752" />
    <mapgis-video-layer v-bind="$props" @added="handCanvasLoad" />
  </mapgis-web-map>`,
});

export const 视频图层 = Template.bind({});
视频图层.args = {
  delay: true,
  layer: {
    source: "video_source_id",
    type: "raster",
  },
  layerId: "video_layer_id",
  source: {
    type: "video",
    urls: [
      `http://${window.webclient.ip}/static/data/video/drone.mp4`,
      `http://${window.webclient.ip}/static/data/video/drone.webm`,
    ],
    coordinates: [
      [-122.51596391201019, 37.56238816766053],
      [-122.51467645168304, 37.56410183312965],
      [-122.51309394836426, 37.563391708549425],
      [-122.51423120498657, 37.56161849366671],
    ],
  },
  sourceId: "video_source_id",
};

export const actionsData = {
  handCanvasLoad: (e) => {},
};
