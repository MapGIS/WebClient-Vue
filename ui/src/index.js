// import "ant-design-vue/dist/antd.css";
import antDirective from "ant-design-vue/es/_util/antDirective";
import vcolorpicker from "vcolorpicker";
import * as UIComponents from "./component";
import * as Util from "./util/common";

import { setLayout, setLayoutSettingVisible } from "./util/emit/layout";
import { setTheme } from "./util/style/theme/set-theme";

import { default as MapgisUiMessage } from "./components/message/Message.js";
import { default as MapgisUiNotification } from "./components/notification/Notification.js";
import { default as ModalInstance } from "./components/modal";

const install = function(Vue, options) {
  options = options || {};
  let theme = options.theme || "light";
  let layout = options.layout || "admin";
  // require("./style.scss");
  require("./util/style/theme/antd.less");
  require("./style.scss");
  setLayout(layout);
  setTheme(theme);
  setLayoutSettingVisible(true);
  Vue.use(antDirective);
  Vue.use(vcolorpicker);
  for (let name in UIComponents) {
    const ui = UIComponents[name];
    Vue.component(ui.options ? ui.options.name : ui.name, ui);
  }

  Vue.prototype.$message = MapgisUiMessage;
  Vue.prototype.$notification = MapgisUiNotification;
  Vue.prototype.$info = ModalInstance.info;
  Vue.prototype.$success = ModalInstance.success;
  Vue.prototype.$error = ModalInstance.error;
  Vue.prototype.$warning = ModalInstance.warning;
  Vue.prototype.$confirm = ModalInstance.confirm;
  Vue.prototype.$destroyAll = ModalInstance.destroyAll;
};

if (typeof window !== "undefined" && window["Vue"]) {
  install(window["Vue"], { theme: "light" });
}

export * from "./component";
export { Util };

export { MapgisUiMessage, MapgisUiNotification, ModalInstance };
export default {
  Util,
  setTheme,
  setLayout,
  setLayoutSettingVisible,
  install
};

window.MapgisUi = UIComponents;
