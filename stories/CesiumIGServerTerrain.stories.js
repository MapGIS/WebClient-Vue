import MapgisWebScene from "../cesium/src/components/WebGlobe/WebGlobe.vue";
import Mapgis3dIgsTerrain from "../cesium/src/components/Provider/TerrainProvider/IgsTerrainProvider.vue";

export default {
  title: "三维/地形-IGServer",
  component: Mapgis3dIgsTerrain,
  argTypes: {
    url: "http://develop.smaryun.com:6163/igs/rest/g3d/terrain",
    show: true,
    requestVertexNormals: false,
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisWebScene, Mapgis3dIgsTerrain },
  template: `<mapgis-web-scene
    libPath="http://localhost:7777/Cesium.js" 
    pluginPath="http://localhost:7777/webclient-cesium-plugin.min.js"
  >
    <mapgis-3d-raster-layer url="http://t1.tianditu.com/DataServer?T=vec_w&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752" />
    <mapgis-3d-igs-terrain v-bind="$props" @terrain-loaded="terrainLoaded"/>
    <mapgis-3d-statebar />
  </mapgis-web-scene>`,
  methods: {
    terrainLoaded: (e) => {
      console.log("地形回调", e);
    },
  },
});

/* export const 无法向量 = Template.bind({});
无法向量.args = {
  url: "http://develop.smaryun.com:6163/igs/rest/g3d/terrain",
  show: true,
  requestVertexNormals: false,
}; */

// http://192.168.21.191:6163/igs/rest/g3d/DEM250_3D
export const 有法向量 = Template.bind({});
有法向量.args = {
  url: "http://develop.smaryun.com:6163/igs/rest/g3d/250DEM_3D",
  show: true,
  requestVertexNormals: true,
};

/* export const 地形回调 = Template.bind({});
地形回调.args = {
  url: "http://develop.smaryun.com:6163/igs/rest/g3d/250DEM_3D",
  show: true,
  requestVertexNormals: false,
}; */
