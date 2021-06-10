import enLocale from "./en";
import zhLocale from "./zh";
import antdZhCN from "ant-design-vue/es/locale/zh_CN";
import antdEnUS from "ant-design-vue/es/locale/en_US";
import VueI18n from "vue-i18n";

function deepCopy(obj) {
  if (getType(obj) === "nomal") {
    return obj;
  } else {
    // tslint:disable-next-line: prefer-const
    let newObj = getType(obj) === "Object" ? {} : [];
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        newObj[key] = deepCopy(obj[key]);
      }
    }
    return newObj;
  }
}
let MAPGIS_GLOBEL_I18N;
let i18n = {};
const messages = {
  en: { ...antdEnUS, ...enLocale },
  zh: { ...antdZhCN, ...zhLocale }
};
export function currentLanguage() {
  lang = lang || navigator.browserLanguage || "zh";
  lang = lang.indexOf("zh") >= 0 ? "zh" : lang.indexOf("en") >= 0 ? "en" : "zh";
  return lang;
}
export function geti18n(n) {
  return i18n;
}
export function mergeLocaleMessage(message) {
  i18n.mergeLocaleMessage && i18n.mergeLocaleMessage(i18n.locale, message);
}
export const MAPGIS_MESSAGES = deepCopy(messages);
export function initi18n(Vue, options) {
  options = options || {};
  if (options.i18n) {
    i18n = options.i18n;
    i18n.mergeLocaleMessage && i18n.mergeLocaleMessage("en", lang.en);
    i18n.mergeLocaleMessage && i18n.mergeLocaleMessage("zh", lang.zh);
  } else if (!Vue.prototype.hasOwnProperty("$i18n")) {
    Object.defineProperty(Vue.prototype, "$i18n", {
      get: function get() {
        if (!MAPGIS_GLOBEL_I18N && this.$root && this.$root.$options.i18n) {
          MAPGIS_GLOBEL_I18N = this.$root.$options.i18n;
        }
        return MAPGIS_GLOBEL_I18N || i18n;
      }
    });
    Vue.use(VueI18n);
    i18n = new VueI18n({
      locale: currentLanguage(),
      fallbackLocale: "zh",
      messages
    });
  }
  if (options.locale) {
    setLocale(options.locale);
  }
}

export default i18n;
