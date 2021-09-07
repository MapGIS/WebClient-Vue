import * as MapComponents from "./component";

import Vue from "vue";
import vcolorpicker from "vcolorpicker";
Vue.use(vcolorpicker);

const install = function(Vue, options) {
  options = options || {};

  for (let name in MapComponents) {
    const com = MapComponents[name];
    Vue.component(com.options ? com.options.name : com.name, com);
  }
};

if (typeof window !== "undefined" && window["Vue"]) {
  install(window["Vue"], {});
}

export * from "./component";

export default {
  install
};

window.Mapgis3d = MapComponents;
