import * as MapComponents from "./component";

import vcolorpicker from "vcolorpicker";

const install = function(Vue, options) {
  options = options || {};

  Vue.use(vcolorpicker);

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
