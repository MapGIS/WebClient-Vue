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

axios.get("./config.json").then((res) => {
  let { data } = res;
  Object.keys(data).forEach((key) => {
    window[key] = data[key];
  });
});

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  viewMode: "docs", // docs
};
