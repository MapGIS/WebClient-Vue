import Vue from "vue";
import axios from "axios";

import "@mapgis/mapbox-gl/dist/mapbox-gl.css";
import MapgisMapboxComponents from "./components/mapbox";
import MapgisCesiumComponents from "./components/cesium";
// import AntdUIComponents from "./components/ui";

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

window.webclient = {
  ip: "develop.smaryun.com",
  port: "6163",
};

window.glyphs = "igs/rest/mrcs/vtiles/fonts"; //java版igs用这个接口
// window.glyphs = "igs/rest/mrms/vtiles/fonts";//司马云用这个接口

window.VueCesiumLibPath =
  "http://192.168.82.89:8086/static/libs/cdn/cesium-new/Cesium.js";

window.VueCesiumPluginPath =
  "http://192.168.82.89:8086/static/libs/cdn/cesium-new/webclient-cesium-plugin.min.js";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  viewMode: "docs", // docs canvas
};
