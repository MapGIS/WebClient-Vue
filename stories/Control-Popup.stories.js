import ZondyWebMap from "../mapboxgl/src/components/map/GlMap.vue";
import ZondyRasterLayer from "../mapboxgl/src/components/layer/RasterLayer.js";
import ZondyMarker from "../mapboxgl/src/components/UI/Marker.vue";
import ZondyPopup from "../mapboxgl/src/components/UI/Popup.vue";

export default {
  title: "交互/Popup",
  component: ZondyPopup,
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
  components: { ZondyWebMap, ZondyRasterLayer, ZondyMarker, ZondyPopup },
  methods: actionsData,
  template: `<zondy-web-map crs="EPSG:4326" :center="[116.39, 40.2]" :zoom="3">
    <zondy-raster-layer layerId="tdt" url="http://t0.tianditu.com/DataServer?T=vec_c&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752" />
    <zondy-marker :coordinates="[110, 30]" color="#F3F5F7" >
      <div slot="marker" style="background:#ffffff;padding:6px;border:3px solid #ccc;border-radius:3px;">点击弹出Popup</div>
      <zondy-popup v-bind="$props">
        <div class="custom">
          绑定Marker显示
          <p/>
          <span>继续补充其他视图</span>
        </div>
      </zondy-popup>
    </zondy-marker>
  </zondy-web-map>`,
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
