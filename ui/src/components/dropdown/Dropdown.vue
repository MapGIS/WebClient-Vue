<script>
import Dropdown from "ant-design-vue/es/dropdown/dropdown";
import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";
import getDropdownProps from './getDropdownProps';

let defaultDropdownProps = getDropdownProps();

export const DropdownProps = {
  ...defaultDropdownProps,
  prefixCls: PropTypes.string,
  mouseEnterDelay: PropTypes.number.def(0.15),
  mouseLeaveDelay: PropTypes.number.def(0.1),
  placement: defaultDropdownProps.placement.def("bottomLeft")
};

export default {
  name: "mapgis-ui-dropdown",
  wrapperUI: Dropdown,
  mixins: [AntdMixin, ThemeMixin],
  inheritAttrs: false,
  props: DropdownProps,
  model: {
    prop: "visible",
    event: "visibleChange"
  }
};
</script>
