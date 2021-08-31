import MapgisWebMap from "../../mapboxgl/src/components/map/GlMap.vue";
import MapgisRasterLayer from "../../mapboxgl/src/components/layer/RasterLayer.js";
import MapgisMarker from "../../mapboxgl/src/components/UI/Marker.vue";
import MapgisPopup from "../../mapboxgl/src/components/UI/Popup.vue";

export default {
  title: "二维/交互/Popup",
  component: MapgisPopup,
  // english Our exports that end in "Data" are not stories.
  // 中文 Data后缀的内容不是故事，而是Vue组件的方法
  excludeStories: /.*Data$/,
  argTypes: {
    anchor: "top",
    show: true,
    offset: [0, 0],
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisWebMap, MapgisRasterLayer, MapgisMarker, MapgisPopup },
  methods: actionsData,
  template: `<mapgis-web-map crs="EPSG:4326" :center="[116.39, 40.2]" :zoom="3" style="height:60vh">
    <mapgis-rastertile-layer layerId="tdt" url="http://t0.tianditu.com/DataServer?T=vec_c&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752" />
    <mapgis-marker :coordinates="[110, 30]" color="#F3F5F7" >
      <div slot="marker" style="background:#ffffff;padding:6px;border:3px solid #ccc;border-radius:3px;">点击弹出Popup</div>
      <mapgis-popup v-bind="$props">
        <div class="custom">
          绑定Marker显示
          <p/>
          <span>继续补充其他视图</span>
        </div>
      </mapgis-popup>
    </mapgis-marker>
  </mapgis-web-map>`,
});

export const Popup = Template.bind({});
Popup.args = {
  anchor: "top",
  show: true,
  offset: [0, 0],
};

export const actionsData = {
  handCanvasLoad: (e) => {},
};
