import EventBus from "../util/vue-types/event-bus-layout";
import EmitEvent from "../util/emit/layout";

export default {
  name: "Layout",
  props: {},
  data() {
    return {};
  },
  created() {
    this.initData();
  },
  mounted() {
    const vm = this;
    EventBus.$on("show-layout-setting", visible => {
      vm.$_handleShowLayoutSetting();
    });
    EventBus.$on("hide-layout-setting", visible => {
      vm.$_handleHideLayoutSetting();
    });
    EventBus.$on("change-layout", themeStyle => {
    });
  },
  methods: {
    ...EmitEvent,
    initData() {
      const showSetting = EventBus.$options.showSetting;
      const layout = EventBus.$options.layout;

      this.showSetting = showSetting;

      Object.keys(layout).forEach(key => {
        this[key] = layout[key];
      });
    },
    $_handleShowLayoutSetting() {},
    $_handleHideLayoutSetting() {}
  }
};
