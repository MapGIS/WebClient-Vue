import {
  MAPGIS_MESSAGES,
  mergeLocaleMessage,
  initi18n
} from "../../ui/language";
import * as MapComponents from "./component";
import * as UIComponents from "./ui";

const install = function(Vue, options) {
  initi18n(Vue, options);

  require("@mapgis/mapbox-gl/dist/mapbox-gl.css");

  for (let name in UIComponents) {
    const ui = UIComponents[name];
    Vue.component(ui.options ? ui.options.name : ui.name, ui);
  }

  for (let name in MapComponents) {
    const com = MapComponents[name];
    Vue.component(com.options ? com.options.name : com.name, com);
  }
};

if (typeof window !== "undefined" && window["Vue"]) {
  install(window["Vue"], {});
}

export default {
  lang: MAPGIS_MESSAGES,
  locale: mergeLocaleMessage,
  install
};
