// import "ant-design-vue/dist/antd.css";
import antDirective from "ant-design-vue/es/_util/antDirective";
import vcolorpicker from "vcolorpicker";
import infiniteScroll from "vue-infinite-scroll";
import * as UIComponents from "./component";
import * as Util from "./util/common";

import { setLayout, setLayoutSettingVisible } from "./util/emit/layout";
import { setTheme } from "./util/style/theme/set-theme";

import { default as MapgisUiMessage } from "./components/message/Message.js";
import { default as MapgisUiNotification } from "./components/notification/Notification.js";
import { default as ModalInstance } from "./components/modal";
import { default as MapgisUiForm } from "./components/form/Form.vue";
import { default as MapgisUiEmpty } from "./components/empty/Empty.vue";

import { default as IconFont } from "./components/iconfont/Icon.vue";

import { default as zhCN } from "./components/locale/zh_CN";

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
  Vue.use(infiniteScroll);
  for (let name in UIComponents) {
    const ui = UIComponents[name];
    Vue.component(ui.options ? ui.options.name : ui.name, ui);
  }

  const MapgisUiIconFont = IconFont.createFromIconfontCN({});
  Vue.component("mapgis-ui-iconfont", MapgisUiIconFont);

  Vue.prototype.$form = MapgisUiForm;
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

export { zhCN };

export { MapgisUiMessage, MapgisUiNotification, ModalInstance, MapgisUiEmpty };
export default {
  Util,
  setTheme,
  setLayout,
  setLayoutSettingVisible,
  install
};

window.MapgisUi = UIComponents;
