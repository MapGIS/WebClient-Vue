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

/* axios.get("./config.json").then((res) => {
  let { data } = res;
  Object.keys(data).forEach((key) => {
    window[key] = data[key];
  });
}); */

/* window.webclient = {
  ip: "192.168.21.192",
  port: "6163",
}; */
window.webclient = {
  ip: "192.168.81.177",
  port: "8089",
};

window.glyphs = "igs/rest/mrcs/vtiles/fonts"; //java版igs用这个接口
// window.glyphs = "igs/rest/mrms/vtiles/fonts";//司马云用这个接口

// window.VueCesiumLibPath = "http://localhost:8895/cesium/Cesium.js";
// window.VueCesiumPluginPath =
//   "http://192.168.82.89:8086/static/libs/cdn/zondyclient/webclient-cesium-plugin.js";

  window.VueCesiumLibPath =
  "http://192.168.81.177:8059/static/libs/cdn/cesium/Cesium.js";
  
window.VueCesiumPluginPath =
  "http://192.168.81.177:8059/static/libs/cdn/cesium/webclient-cesium-plugin.min.js";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  viewMode: "canvas", // docs
};
