<script>
import Menu from "ant-design-vue/es/menu/index";
import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";

export const MenuDividerProps = {
  disabled: {
    type: Boolean,
    default: true
  },
  rootPrefixCls: String
};

export default {
  name: "mapgis-ui-menu-divider",
  wrapperUI: Menu.Divider,
  mixins: [AntdMixin, ThemeMixin],
  inheritAttrs: false,
  props: MenuDividerProps,
};
</script>
