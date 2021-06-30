// import "ant-design-vue/dist/antd.css";
import antDirective from "ant-design-vue/es/_util/antDirective";

import * as UIComponents from "./component";
import { setTheme } from "./util/style/theme/set-theme";

import { default as MapgisUiMessage } from "./components/message/Message.js";
import { default as MapgisUiNotification } from "./components/notification/Notification.js";

const install = function(Vue, options) {
  options = options || {};
  let theme = options.theme || "light";
  // require("./style.scss");
  require("./util/style/theme/antd.less");
  require("./style.scss");
  setTheme(theme);
  Vue.use(antDirective);
  for (let name in UIComponents) {
    const ui = UIComponents[name];
    Vue.component(ui.options ? ui.options.name : ui.name, ui);
  }

  Vue.prototype.$message = MapgisUiMessage;
  Vue.prototype.$notification = MapgisUiNotification;
};

if (typeof window !== "undefined" && window["Vue"]) {
  install(window["Vue"], { theme: "light" });
}

export * from "./component";

export default {
  setTheme,
  install
};
