import MapgisWebScene from "../../cesium/src/components/WebGlobe/WebGlobe.vue";
import Mapgis3dArcgisTileLayer from "../../cesium/src/components/Layer/ArcGISServer/ArcGISTileLayer";
import Mapgis3dIgsM3d from "../../cesium/src/components/M3D/M3d.vue";
import Mapgis3dHeaterLayer from "../../cesium/src/components/Overlay/themeLayer/heater/HeaterStory.vue";

export default {
  title: "三维/可视化/热力图",
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: {
    MapgisWebScene,
    "mapgis-3d-arcgis-tile-layer": Mapgis3dArcgisTileLayer,
    "mapgis-3d-igs-m3d": Mapgis3dIgsM3d,
    "mapgis-3d-heater-layer": Mapgis3dHeaterLayer,
  },
  data() {
    return {
      showHeaterLayer: false,
      m3dUrl: "http://develop.smaryun.com:6163/igs/rest/g3d/ZondyModels",
      autoReset: true,
      maximumScreenSpaceError: 8,
      baseUrl:
        "http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer",
      layerStyle: {
        visible: true,
        opacity: 1,
        zIndex: 2,
      },
      tilingScheme: "EPSG:4326",
    };
  },
  template: `
      <mapgis-web-scene @load="showHeaterLayer = true">
        <mapgis-3d-igs-m3d
          v-if="enableM3D"
          :autoReset="autoReset"
          :maximumScreenSpaceError="maximumScreenSpaceError"
          :url="m3dUrl" />
        <mapgis-3d-arcgis-tile-layer
          v-else
          :baseUrl="baseUrl"
          :layer-style="layerStyle"
          :tilingScheme="tilingScheme"/>
        <mapgis-3d-heater-layer v-if="showHeaterLayer" />
      </mapgis-web-scene>
    `,
});

export const mapv = Template.bind({});
mapv.args = {
  enableM3D: false,
};
