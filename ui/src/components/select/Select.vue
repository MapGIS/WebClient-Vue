<script>
import Select, { SelectProps } from "ant-design-vue/es/select";
import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";

export const selectTypes = {
  ...SelectProps,
  showSearch: PropTypes.bool.def(false),
  transitionName: PropTypes.string.def("slide-up"),
  choiceTransitionName: PropTypes.string.def("zoom")
};

export default {
  name: "mapgis-ui-select",
  wrapperUI: Select,
  mixins: [AntdMixin, ThemeMixin],
  inheritAttrs: false,
  props: {
    ...selectTypes,
    long: { type: Boolean, default: false }
  },
  model: {
    prop: "value",
    event: "change"
  },
  methods: {},
  computed: {
    uiStyle() {
      return this.long
        ? {
            width: "100%"
          }
        : {};
    },
    addListeners() {
      const vm = this;
      return {
        change: function(value) {
          vm.$emit("change", value);
        }
      };
    }
  }
};
</script>
