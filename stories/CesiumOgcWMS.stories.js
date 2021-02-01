import MapgisWebGlobe from "../cesium/src/components/WebGlobe/WebGlobe.vue";
import MapgisOgcWmsLayer from "../cesium/src/components/Layer/OGC/OGCWMSLayer.vue";

export default {
  title: "三维/OGC-WMS",
  component: MapgisOgcWmsLayer,
  argTypes: {
    url: "http://develop.smaryun.com:6163/igs/rest/ogc/doc/北京市/WMSServer",
    options: {
      tilingScheme: "EPSG:4610",
    },
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisWebGlobe, MapgisOgcWmsLayer },
  template: `<mapgis-web-globe >
    <mapgis-3d-ogc-wms-layer v-bind="$props"/>
    <mapgis-3d-raster-layer url="http://t0.tianditu.com/DataServer?T=vec_w&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752" />
  </mapgis-web-globe>`,
});

export const EmptyGlobe = Template.bind({});
EmptyGlobe.args = {
  url: "http://develop.smaryun.com:6163/igs/rest/ogc/doc/北京市/WMSServer",
};
