import MapgisWebGlobe from "../../cesium/src/components/WebGlobe/WebGlobe.vue";

export default {
  title: "三维/场景/地图场景",
  component: MapgisWebGlobe,
  argTypes: {
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisWebGlobe },
  template: `<mapgis-web-globe v-bind="$props" :style="{height: '95vh'}">
    <mapgis-3d-raster-layer url="http://t0.tianditu.com/DataServer?T=vec_w&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752" />
    <mapgis-3d-raster-layer url="http://t1.tianditu.com/DataServer?T=cia_w&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752" />
  </mapgis-web-globe>`
});

export const EmptyGlobe = Template.bind({});
EmptyGlobe.args = {
};
