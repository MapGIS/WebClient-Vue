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
  collapsedWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  // ant-design-vue中的theme只有light和dark两种样式，科技风technology传进来控制台会报错，但不会影响代码运行
  theme: PropTypes.oneOf(["light", "dark"]).def("dark")
};

export default {
  name: "mapgis-ui-layout-sider",
  wrapperUI: LayoutSider,
  mixins: [AntdMixin, ThemeMixin],
  inheritAttrs: false,
  props: LayoutSiderProps
};
</script>
