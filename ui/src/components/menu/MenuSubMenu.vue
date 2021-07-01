<script>
import SubMenu from "ant-design-vue/es/menu/SubMenu";
import { SubMenu as VcSubMenu } from "ant-design-vue/es/vc-menu";

import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";

export default {
  name: "mapgis-ui-sub-menu",
  wrapperUI: SubMenu,
  mixins: [AntdMixin, ThemeMixin],
  inheritAttrs: false,
  isSubMenu: true,
  props: VcSubMenu.props
};
</script>
