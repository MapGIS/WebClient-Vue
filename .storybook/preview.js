import Vue from "vue";
import axios from "axios";

import "@mapgis/mapbox-gl/dist/mapbox-gl.css";

import MapgisMapboxComponents from "../mapboxgl/src/main";
import MapgisCesiumComponents from "../cesium/src/main";

import "../ui/dist-libs/webclient-vue-ui.css";
import MapgisUIComponents from "../ui/src/index";

Vue.use(MapgisUIComponents, {});
Vue.use(MapgisMapboxComponents, {});
Vue.use(MapgisCesiumComponents, {});

window.webclient = {
  ip: "develop.smaryun.com",
  port: "6163",
};

window.glyphs = "igs/rest/mrcs/vtiles/fonts"; //java版igs用这个接口
// window.glyphs = "igs/rest/mrms/vtiles/fonts";//司马云用这个接口

window.VueCesiumLibPath =
  "./Cesium/Cesium.js";

window.VueCesiumPluginPath =
  "./Cesium/webclient-cesium-plugin.min.js";

async function initConfig() {
  const res = await axios.get("./config.json");
  const data = res.data;
  Object.keys(data).forEach((key) => {
    window[key] = data[key];
  });
  console.log('当前站点的环境配置是:', data);
}

initConfig();

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  viewMode: "canvas", // docs canvas
};
