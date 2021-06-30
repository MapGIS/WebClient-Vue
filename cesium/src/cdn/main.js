import * as MapComponents from "./cdn_component";

const install = function(Vue, options) {
  for (let name in MapComponents) {
    let com = MapComponents[name];
    if (name === "colorPicker") {
      com = MapComponents[name][name];
    }
    Vue.component(com.options ? com.options.name : com.name, com);
  }
};

if (typeof window !== "undefined" && window["Vue"]) {
  install(window["Vue"], {});
}

export * from "./cdn_component";

export default {
  install
};
