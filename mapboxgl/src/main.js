import "ant-design-vue/dist/antd.css";
import antDirective from "ant-design-vue/es/_util/antDirective";

import * as MapComponents from "./component";
import * as UIComponents from "./ui";

const install = function(Vue, options) {
  const { ui } = options;
  if (ui) {
    Vue.use(antDirective);
    for (let name in UIComponents) {
      const ui = UIComponents[name];
      Vue.component(ui.options ? ui.options.name : ui.name, ui);
    }
  }

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
