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
  template: `<mapgis-web-globe v-bind="$props" style="height:95vh">
    <mapgis-ui-collapse-card :outStyle="outStyle" :position="position">
      <mapgis-ui-iconfont type="mapgis-map-pin" slot="icon-hiden" />
      <span slot="extra">
        <mapgis-ui-iconfont type="mapgis-map-pin" @click="hide" />
      </span>
      <mapgis-ui-button type="primary">销毁场景</mapgis-ui-button>
    </mapgis-ui-collapse-card>
    
    <mapgis-3d-raster-layer url="http://t0.tianditu.com/DataServer?T=vec_w&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752" />
    <mapgis-3d-raster-layer url="http://t1.tianditu.com/DataServer?T=cia_w&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752" />
  </mapgis-web-globe>`,
});

export const EmptyGlobe = Template.bind({});
EmptyGlobe.args = {};
