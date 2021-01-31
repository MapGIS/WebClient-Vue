import ZondyWebMap from "../mapboxgl/src/components/map/GlMap.vue";
import ZondyRasterLayer from "../mapboxgl/src/components/layer/RasterLayer.js";
// import ZondyBaseDraw from "../mapboxgl/src/components/UI/controls/draw/BaseDraw.vue";
import ZondyFixDraw from "../mapboxgl/src/components/UI/controls/drawfix/FixDraw.vue";
import "./style/draw.css";

export default {
  title: "交互/绘制",
  component: ZondyFixDraw,
  // english Our exports that end in "Data" are not stories.
  // 中文 Data后缀的内容不是故事，而是Vue组件的方法
  excludeStories: /vue.*$/,
  argTypes: {
    controls: {
      point: true,
      line_string: true,
      polygon: true,
      trash: true,
      combine_features: true,
      uncombine_features: true,
    },
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ZondyWebMap, ZondyRasterLayer, ZondyFixDraw },
  data: vueData,
  methods: vueMethods,
  template: `<zondy-web-map crs="EPSG:4326" :center="[116.39, 40.2]" :zoom="3">
    <zondy-raster-layer layerId="tdt" url="http://t0.tianditu.com/DataServer?T=vec_c&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752" />
      <zondy-fix-draw
          class="custom-draw-wrapper"
          position="top-left"
          v-bind:controls="controls"
      >
          <template v-slot:point>
            <div class="toolbar-item" >画点</div>
          </template >
          <template v-slot:line>
            <div class="toolbar-item" >画线</div>
          </template >
          <template v-slot:polygon>
            <div class="toolbar-item" >画区</div>
          </template >
          <template v-slot:delete>
            <div class="toolbar-item" >删除</div>
          </template >
      </zondy-fix-draw>
  </zondy-web-map>`,
});

export const Draw = Template.bind({});
Draw.args = {
  controls: {
    point: false,
    line_string: false,
    polygon: false,
    trash: false,
    combine_features: false,
    uncombine_features: false,
  },
};

export const vueData = function () {
  return {
    // drawer: undefined,
  };
};

export const vueMethods = {
  handleAdded: (e) => {
    console.log("added", e);
  },
};
