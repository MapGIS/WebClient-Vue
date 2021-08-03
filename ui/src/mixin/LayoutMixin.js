import EventBus from "../util/vue-types/event-bus-layout";

export default {
  name: "Layout",
  props: {},
  data() {
    return {};
  },
  created() {},
  mounted() {
    EventBus.$on("change-layout", themeStyle => {});
  },
  methods: {}
};
