import "ant-design-vue/dist/antd.css";
import antDirective from "ant-design-vue/es/_util/antDirective";

import * as UIComponents from "./component";

const install = function(Vue, options) {
  require("./style.scss");
  Vue.use(antDirective);
  for (let name in UIComponents) {
    const ui = UIComponents[name];
    Vue.component(ui.options ? ui.options.name : ui.name, ui);
  }
};

if (typeof window !== "undefined" && window["Vue"]) {
  install(window["Vue"], {});
}

export * from "./component";

export default {
  install
};
