import Mapgis3dIgsTileLayer from "../../cesium/src/components/Layer/IGServer/IgsTileLayer.vue";

export default {
  title: "三维/数据图层/影像/MapGIS/瓦片服务",
  // component: Mapgis3dIgsTileLayer,
  argTypes: {
    id: "IGServer-Tle-Layer",
    baseUrl: "http://develop.smaryun.com:6163/igs/rest/mrms/tile/北京市",
    layerStyle: {
      visible: true,
      opacity: 1,
      zIndex: 2,
    },
    tilingScheme: "EPSG:4326",
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  template: `
    <mapgis-web-scene style="height:95vh" :cameraView="{
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

export const 瓦片服务 = Template.bind({});
瓦片服务.args = {
  id: "IGServer-Tle-Layer",
  baseUrl: `http://${window.webclient.igsIp}:${window.webclient.igsPort}/igs/rest/mrms/tile/OGC_4326_CHINA`,
  layerStyle: {
    visible: true,
    opacity: 1,
    zIndex: 2,
  },
  tilingScheme: "EPSG:4326",
};
