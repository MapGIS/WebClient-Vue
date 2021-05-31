import MapgisWebGlobe from "../cesium/src/components/WebGlobe/WebGlobe.vue";
import MapgisDocLayer from "../cesium/src/components/Layer/IGServer/IgsDocLayer";

export default {
  title: "三维/图层-地图文档",
  component: MapgisDocLayer,
  argTypes: {
    baseUrl:"http://develop.smaryun.com:6163/igs/rest/mrms/docs/北京市",
    layers: "exclude:1",
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
  template: `<mapgis-web-globe >
    <mapgis-3d-igs-doc-layer v-bind="$props"/>
  </mapgis-web-globe>`,
  data(){
    return {
    }
  },
  methods:{
  }
});

export const DocLayer = Template.bind({});
DocLayer.args = {
  baseUrl:"http://develop.smaryun.com:6163/igs/rest/mrms/docs/北京市",
  layers: "exclude:1",
  layerStyle: {
    visible: true,
    opacity: 1,
    zIndex: 10
  },
  vueIndex: 1,
  options: {}
};

