import MapgisWebGlobe from "../../cesium/src/components/WebGlobe/WebGlobe.vue";
import "../style/scene.css";

export default {
  title: "三维/场景/地图场景",
  component: MapgisWebGlobe,
  argTypes: {},
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
  },
  template: `<mapgis-web-scene v-bind="$props" style="height:95vh" @load="load">
    <mapgis-ui-collapse-card :outStyle="outStyle" :position="position" ref="card">
      <mapgis-ui-iconfont type="mapgis-map-pin" slot="icon-hiden" />
      <span slot="extra">
        <mapgis-ui-iconfont type="mapgis-map-pin" @click="hide" />
      </span>
      <mapgis-ui-button type="primary" @click="remove">销毁场景</mapgis-ui-button>
    </mapgis-ui-collapse-card>
    
    <mapgis-3d-raster-layer url="http://t0.tianditu.com/DataServer?T=vec_w&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752" />
    <mapgis-3d-raster-layer url="http://t1.tianditu.com/DataServer?T=cia_w&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752" />
  </mapgis-web-scene>`,
});

export const EmptyGlobe = Template.bind({});
EmptyGlobe.args = {};
