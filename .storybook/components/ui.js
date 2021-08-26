import * as UIComponents from "./ui_coms";
import MapgisUiIconFont from "../../ui/src/components/iconfont/Icon.vue";
import MapgisUi from "../../ui/src/index";

const install = function (Vue, options) {
  for (let name in UIComponents) {
    const com = UIComponents[name];
    Vue.component(com.options ? com.options.name : com.name, com);

    const IconFont = MapgisUiIconFont.createFromIconfontCN({
      // scriptUrl: "//at.alicdn.com/t/font+1738253_h86hmqsk0q.js",
      scriptUrl: "http://localhost:8888/fonts/iconfont.js",
    });
    Vue.component("mapgis-ui-iconfont", IconFont);
    Vue.use(MapgisUi);
  }
};

if (typeof window !== "undefined" && window["Vue"]) {
  install(window["Vue"], {});
}

export default {
  install
};
