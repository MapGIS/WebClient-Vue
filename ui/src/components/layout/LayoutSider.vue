<script>
import LayoutSider, { SiderProps } from "ant-design-vue/es/layout/Sider";

import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";

export const LayoutSiderProps = {
  ...SiderProps,
  collapsible: false,
  defaultCollapsed: false,
  reverseArrow: false,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  collapsedWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};

export default {
  name: "mapgis-ui-layout-sider",
  wrapperUI: LayoutSider,
  mixins: [AntdMixin, ThemeMixin],
  inheritAttrs: false,
  props: LayoutSiderProps
};
</script>
