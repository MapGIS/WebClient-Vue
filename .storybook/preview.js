import Vue from "vue";
import axios from "axios";

import "@mapgis/mapbox-gl/dist/mapbox-gl.css";
import MapgisMapboxComponents from "./components/mapbox";
import MapgisCesiumComponents from "./components/cesium";
// import AntdUIComponents from "./components/ui";

import "../ui/dist-libs/webclient-vue-ui.css";
import MapgisUIComponents from "../ui/src/index";

// Vue.use(AntdUIComponents, {});
Vue.use(MapgisUIComponents, {});
Vue.use(MapgisMapboxComponents, {});
Vue.use(MapgisCesiumComponents, {});

/* axios.get("./config.json").then((res) => {
  let { data } = res;
  Object.keys(data).forEach((key) => {
    window[key] = data[key];
  });
}); */

window.webclient = {
  ip: "localhost",
  port: "8895",
};

window.glyphs = "igs/rest/mrcs/vtiles/fonts";//java版igs用这个接口
// window.glyphs = "igs/rest/mrms/vtiles/fonts";//司马云用这个接口

window.VueCesiumLibPath =
    "http://localhost:8081/cesium/Cesium.js";
window.VueCesiumPluginPath =
    "http://localhost:8081/cesium/webclient-cesium-plugin.js";


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
