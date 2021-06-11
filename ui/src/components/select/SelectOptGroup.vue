<script>
import Select from "ant-design-vue/es/select";
import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";

export const selectOptGroupTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default {
  name: "mapgis-ui-select-opt-group",
  wrapperUI: Select.OptGroup,
  isSelectOptGroup: true,
  mixins: [AntdMixin],
  inheritAttrs: false,
  props: selectOptGroupTypes,
  methods: {}
};
</script>
