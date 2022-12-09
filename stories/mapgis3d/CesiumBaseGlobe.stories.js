import MapgisWebGlobe from "../../cesium/src/components/WebGlobe/WebGlobe.vue";
import "../style/scene.css";

export default {
  title: "三维/场景控制/场景/三维球面",
  component: MapgisWebGlobe,
  argTypes: {
    homeButton: false,
    navigationHelpButton: false,
    sceneModePicker: false,
    animation: false,
    baseLayerPicker: false,
    fullscreenButton: false,
    vrButton: false,
    geocoder: false,
    timeline: false,
    cameraView: {
      type: Object,
      default: function () {
        return {
          /* destination: {
            x: -5087907.392038159,
            y: 14207074.175879652,
            z: 3655215.2541255946
          },
          orientation: {
            heading: 6.1827568973283045,
            pitch: -1.2409374391413084,
            roll: 0.0003114284469649675
          } */
        };
      }
    }
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisWebGlobe },
  data() {
    return {
      outStyle: {
        position: "absolute",
        zIndex: 700,
        width: "200px",
        padding: "10px",
        left: "10px",
        top: "10px",
      },
      position: "top-left",
      info: "{}"
    };
  },
  methods: {
    load(e) {
      console.log("地图场景加载", window.viewer);
    },
    hide() {
      this.$refs.card && this.$refs.card.hide();
    },
    remove() {
      let viewer = window.viewer;
      viewer.scene.primitives.removeAll();
      viewer.scene.primitives.destroy();
      viewer.entities.removeAll();
      // viewer.destroy();
    },
    camera() {
      let viewer = window.viewer;
      let view = viewer.camera.getView();
      delete view.endTransform;
      delete view.positionWC;
      let info = JSON.stringify(view);
      this.info = info;
    },
  },
  template: `<mapgis-web-scene v-bind="$props" style="height:95vh" @load="load">
    <mapgis-ui-collapse-card :outStyle="outStyle" :position="position" ref="card">
      <mapgis-ui-iconfont type="mapgis-map-pin" slot="icon-hiden" />
      <span slot="extra">
        <mapgis-ui-iconfont type="mapgis-map-pin" @click="hide" />
      </span>
      <mapgis-ui-button size="small" type="primary" @click="remove">销毁场景</mapgis-ui-button>
      <mapgis-ui-button size="small" type="primary" @click="camera">场景视角</mapgis-ui-button>
      <mapgis-ui-textarea :autoSize='{"minRows":5,"maxRows":10}' v-model="info" placeholder="相机视角"></mapgis-ui-textarea>
    </mapgis-ui-collapse-card>
    
    <mapgis-3d-raster-layer url="http://t0.tianditu.com/DataServer?T=vec_w&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752" />
    <mapgis-3d-raster-layer url="http://t1.tianditu.com/DataServer?T=cia_w&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752" />
  </mapgis-web-scene>`,
});

export const 三维球面 = Template.bind({});
三维球面.args = {
  homeButton: false,
  navigationHelpButton: false,
  sceneModePicker: false,
  animation: false,
  baseLayerPicker: false,
  fullscreenButton: false,
  vrButton: false,
  geocoder: false,
  timeline: false,
  cameraView: {
    "destination": { "x": -2526389.3359068986, "y": 11433026.459723352, "z": 4315159.693765257 },
    "orientation": { "heading": 6.2728601782499815, "pitch": -1.2663199109196879, "roll": 6.283182807671632 }
  }
};
