import Vue from "vue";

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

// "http://develop.smaryun.com:8899/static/libs/cdn/cesium/Cesium.js";
window.VueCesiumLibPath = "http://localhost:8888/static/libs/cdn/cesium-new/Cesium.js";

// "http://develop.smaryun.com:8899/static/libs/cdn/zondyclient/webclient-cesium-plugin.min.js"
window.VueCesiumPluginPath = "http://localhost:8888/static/libs/cdn/zondyclient/webclient-cesium-plugin.min.js";

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
