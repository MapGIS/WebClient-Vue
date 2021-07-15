import EventBus from "../util/vue-types/event-bus";
import { getDerivedColorsByTextColor } from "../util/style/color/serialColors";

export default {
  name: "Theme",
  props: {
    background: String,
    textColor: String,
    colorGroup: Array
  },
  data() {
    return {
      backgroundData: "",
      textColorsData: "",
      collapseCardBackgroundData: "",
      collapseCardHeaderBgData: "",
      tablePopupBgData: "",
      colorGroupsData: []
    };
  },
  created() {
    this.initThemeData();
    this.registerPropListener();
  },
  mounted() {
    EventBus.$on("change-theme", themeStyle => {
      const $props = this.getSelfProps();
      $props.forEach(prop => {
        const dataName = this.getDataNameOfProp(prop);
        this[dataName] = themeStyle[prop];
      });
      this.collapseCardHeaderBgData = themeStyle["collapseCardHeaderBg"];
      this.collapseCardBackgroundData = themeStyle["collapseCardBackground"];
      this.tablePopupBgData = themeStyle["messageBackground"];

      this.$emit("themeStyleChanged");
    });
  },
  methods: {
    getBackgroundStyle() {
      return {
        background: this.backgroundData
      };
    },

    collapseCardBackgroundStyle() {
      return {
        background: this.collapseCardBackgroundData
      };
    },

    collapseCardHeaderBgStyle() {
      return {
        background: this.collapseCardHeaderBgData
      };
    },

    tablePopupBgStyle() {
      return {
        background: this.tablePopupBgData
      };
    },

    getTextColorStyle() {
      return {
        color: this.textColorsData
      };
    },

    headingTextColorStyle() {
      return {
        color: getDerivedColorsByTextColor(this.textColorsData, 0.85)
      };
    },

    secondaryTextColorStyle() {
      return {
        color: getDerivedColorsByTextColor(this.textColorsData, 0.45)
      };
    },

    disabledTextColorStyle() {
      return {
        color: getDerivedColorsByTextColor(this.textColorsData, 0.25)
      };
    },

    getBackground() {
      return this.backgroundData;
    },

    getTextColor() {
      return this.textColorsData;
    },

    getColorStyle() {
      return function(index) {
        return {
          color: this.colorGroupsData[index]
        };
      };
    },

    getColor() {
      return function(index) {
        return this.colorGroupsData[index];
      };
    },

    initThemeData() {
      const theme = EventBus.$options.theme || {};
      const $props = this.getSelfProps();
      $props.forEach(prop => {
        const dataName = this.getDataNameOfProp(prop);
        this[dataName] = this[prop] || theme[prop];
      });
      this.collapseCardHeaderBgData =
        this.background || theme["collapseCardHeaderBg"];
      this.collapseCardBackgroundData =
        this.background || theme["collapseCardBackground"];
      this.tablePopupBgData = this.background || theme["messageBackground"];
    },

    registerPropListener() {
      const theme = EventBus.$options.theme || {};
      const vm = this;
      const $props = this.getSelfProps();
      $props.forEach(prop => {
        this.$watch(prop, function(next) {
          const dataName = this.getDataNameOfProp(prop);
          vm[dataName] = next;
          if (prop === "background") {
            vm.collapseCardBackgroundData =
              next || theme["collapseCardBackground"];
            vm.collapseCardHeaderBgData = next || theme["collapseCardHeaderBg"];
            vm.tablePopupBgData = next || theme["messageBackground"];
          }
        });
      });
    },

    getSelfProps() {
      return Object.keys(this.$props);
    },

    getDataNameOfProp(prop) {
      switch (prop) {
        case "textColor":
          return "textColorsData";
        case "colorGroup":
          return "colorGroupsData";
        default:
          return `${prop}Data`;
      }
    }
  }
};
