<script>
import { ItemGroup } from "ant-design-vue/es/vc-menu";
import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";

export const MenuItemGroupProps = {
  renderMenuItem: PropTypes.func,
  index: PropTypes.number,
  className: PropTypes.string,
  subMenuKey: PropTypes.string,
  rootPrefixCls: PropTypes.string,
  disabled: PropTypes.bool.def(true),
  title: PropTypes.any
};

export default {
  name: "mapgis-ui-menu-item-group",
  wrapperUI: ItemGroup,
  mixins: [AntdMixin, ThemeMixin],
  inheritAttrs: false,
  isMenuItemGroup: true,
  props: MenuItemGroupProps,
  model: {
    prop: "selectedKeys",
    event: "selectChange"
  }
};
</script>
