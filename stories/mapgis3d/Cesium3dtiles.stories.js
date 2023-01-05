import Mapgis3dTileset from "../../cesium/src/components/Layer/M3D/3dTileset.vue";

export default {
  title: "三维/数据图层/3DTiles",
  component: Mapgis3dTileset,
  argTypes: {
    url: `http://${window.webclient.igsIp}:${window.webclient.filePort}/3DData/ModelCache/3DTileset/1.0/dayantaresult/tileset.json`,
    opacity: 1.0,
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { Mapgis3dTileset },
  data() {
    return {
    };
  },
  methods: {
    handleMapload() {
      const vm = this;
      window.setTimeout(() => {
        vm.opacity = 1;
      }, 5000);
    },
  },
  template: `<mapgis-web-scene @load="handleMapload" style="height:95vh">
    <mapgis-3d-raster-layer url="http://t0.tianditu.com/DataServer?T=vec_w&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752" />
    <mapgis-3d-tileset v-bind="$props" />
    <mapgis-3d-statebar />
  </mapgis-web-scene>`,
});

export const 大雁塔 = Template.bind({});
大雁塔.args = {
  url: `http://${window.webclient.igsIp}:${window.webclient.filePort}/3DData/ModelCache/3DTileset/1.0/dayantaresult/tileset.json`,
  opacity: 1.0,
};
