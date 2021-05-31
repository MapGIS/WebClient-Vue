import Mapgis3dIgsTileLayer from "../cesium/src/components/Layer/IGServer/IgsTileLayer.vue";

export default {
  title: "三维/IGServer-瓦片图层",
  // component: Mapgis3dIgsTileLayer,
  argTypes: {
    id: "IGServer-Tle-Layer",
    baseUrl: "http://develop.smaryun.com:6163/igs/rest/mrms/tile/北京市",
    layerStyle: {
      visible: true,
      opacity: 1,
      zIndex: 2,
    },
    srs: "EPSG:4326",
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  template: `
    <mapgis-web-scene :cameraView="{
        destination: {
          x: -2409221.7854387695,
          y: 4705113.697479787,
          z: 4500333.6696071755,
        },
        orientation: {
          heading: 3.2694614177406143,
          pitch: -1.4832321184766042,
          roll: 3.1369303868636838,
        },
      }">
        <mapgis-3d-igs-tile-layer v-bind="$props" />
    </mapgis-web-scene >`,
});

export const Tile = Template.bind({});
Tile.args = {
  id: "IGServer-Tle-Layer",
  baseUrl: "http://develop.smaryun.com:6163/igs/rest/mrms/tile/北京市",
  layerStyle: {
    visible: true,
    opacity: 1,
    zIndex: 2,
  },
  srs: "EPSG:4326",
};
