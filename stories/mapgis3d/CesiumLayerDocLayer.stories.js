import MapgisWebGlobe from "../../cesium/src/components/WebGlobe/WebGlobe.vue";
import MapgisDocLayer from "../../cesium/src/components/Layer/IGServer/IgsDocLayer";

export default {
  title: "三维/数据图层/影像/MapGIS",
  component: MapgisDocLayer,
  argTypes: {
    baseUrl: "http://develop.smaryun.com:6163/igs/rest/mrms/docs/Hubei4326",
    layers: "show:1,2,3,4,5,6,7,8,9,10",
    layerStyle: {
      visible: true,
      opacity: 1,
      zIndex: 10
    },
    vueIndex: 1,
    options: {}
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisWebGlobe, MapgisDocLayer },
  template: `<mapgis-web-scene style="height:95vh">
    <mapgis-3d-igs-doc-layer v-bind="$props"/>
  </mapgis-web-scene>`,
  data() {
    return {
    }
  },
  methods: {
  }
});

export const 地图服务 = Template.bind({});
地图服务.args = {
  baseUrl: `http://${window.webclient.igsIp}:${window.webclient.igsNetPort}/igs/rest/mrms/docs/Hubei4326`,
  layers: "show:1,2,3,4,5,6,7,8,9,10",
  layerStyle: {
    visible: true,
    opacity: 1,
    zIndex: 10
  },
  vueIndex: 1,
  options: {}
};

