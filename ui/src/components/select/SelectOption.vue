<script>
import Select from "ant-design-vue/es/select";
import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";

export const selectOptionTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  disabled: PropTypes.bool,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default {
  name: "mapgis-ui-select-option",
  wrapperUI: Select.Option,
  isSelectOption: true,
  mixins: [AntdMixin, ThemeMixin],
  inheritAttrs: false,
  props: selectOptionTypes,
  methods: {}
};
</script>
