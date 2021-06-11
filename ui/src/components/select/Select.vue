<script>
import Select, { SelectProps } from "ant-design-vue/es/select";
import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";

export const selectTypes = {
  ...SelectProps,
  showSearch: PropTypes.bool.def(false),
  transitionName: PropTypes.string.def("slide-up"),
  choiceTransitionName: PropTypes.string.def("zoom")
};

export default {
  name: "mapgis-ui-select",
  wrapperUI: Select,
  mixins: [AntdMixin],
  inheritAttrs: false,
  props: selectTypes,
  methods: {}
};
</script>
