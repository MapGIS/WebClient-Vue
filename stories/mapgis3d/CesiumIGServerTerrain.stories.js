import MapgisWebScene from "../../cesium/src/components/WebGlobe/WebGlobe.vue";
import Mapgis3dIgsTerrain from "../../cesium/src/components/Provider/TerrainProvider/IgsTerrainProvider.vue";

export default {
  title: "三维/数据图层/地形/MapGIS地形",
  component: Mapgis3dIgsTerrain,
  argTypes: {
    // url: "http://develop.smaryun.com:6163/igs/rest/g3d/terrain",
    url: `http://${window.webclient.igsIp}:${window.webclient.igsPort}/igs/rest/g3d/Scene:TwTerrain`,
    show: true,
    requestVertexNormals: false,
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisWebScene, Mapgis3dIgsTerrain },
  template: `<mapgis-web-scene style="height:95vh">
    <mapgis-3d-raster-layer url="http://t1.tianditu.com/DataServer?T=img_w&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752" />
    <mapgis-3d-igs-terrain v-bind="$props" @terrain-loaded="loaded"/>
    <mapgis-3d-statebar />
  </mapgis-web-scene>`,
  methods: {
      handleLoad(e) {
        const { component, Cesium } = e;
        Cesium.Ion.defaultAccessToken =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiM2Q0ZGMxYy1iZGZkLTQ4OWItODlhMy1iOWNkMDE0M2U3YWEiLCJpZCI6NTEzNSwiaWF0IjoxNjA2MjE0OTkyfQ.2aktNrUASlLsPwSFtkgKBTQLJTAnOTyjgKDRQmnafiE";
        const { viewer } = component;
        viewer.camera.setView({
          direction: {
            x: 0.4680575394156845,
            y: -0.8267033643312148,
            z: 0.31222377744109403,
          },
          position: {
            x: -674271.5790185562,
            y: 5530042.656916835,
            z: 3232882.3357299212,
          },
        });
        //视点跳转（经度，纬度，视角高度，方位角，俯仰角，翻滚角）
        viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(121,24,5900),
          orientation:{
            heading: Cesium.Math.toRadians(60),
            pitch: Cesium.Math.toRadians(-16),
            roll: 0,
          },
          duration:1
        })
      }
    },
});


/* export const 无法向量 = Template.bind({});
无法向量.args = {
  url: "http://develop.smaryun.com:6163/igs/rest/g3d/terrain",
  show: true,
  requestVertexNormals: false,
}; */

// http://192.168.21.191:6163/igs/rest/g3d/DEM250_3D
export const 带法向 = Template.bind({});
带法向.args = {
  // url: `http://${window.webclient.igsIp}:${window.webclient.igsPort}/igs/rest/g3d/250DEM_3D`,
  url: `http://${window.webclient.igsIp}:${window.webclient.igsPort}/igs/rest/g3d/Scene:TwTerrain`,
  show: true,
  requestVertexNormals: true,
};

/* export const 地形回调 = Template.bind({});
地形回调.args = {
  url: "http://develop.smaryun.com:6163/igs/rest/g3d/250DEM_3D",
  show: true,
  requestVertexNormals: false,
}; */
