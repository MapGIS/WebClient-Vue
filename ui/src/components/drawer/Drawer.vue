<script>
import Drawer from 'ant-design-vue/es/drawer';

import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";

export const drawerProps = {
  closable: PropTypes.bool.def(true),
  destroyOnClose: PropTypes.bool,
  getContainer: PropTypes.any,
  maskClosable: PropTypes.bool.def(true),
  mask: PropTypes.bool.def(true),
  maskStyle: PropTypes.object,
  wrapStyle: PropTypes.object,
  bodyStyle: PropTypes.object,
  headerStyle: PropTypes.object,
  drawerStyle: PropTypes.object,
  title: PropTypes.any,
  visible: PropTypes.bool,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).def(256),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).def(256),
  zIndex: PropTypes.number,
  prefixCls: PropTypes.string,
  placement: PropTypes.oneOf(['top', 'right', 'bottom', 'left']).def('right'),
  level: PropTypes.any.def(null),
  wrapClassName: PropTypes.string, // not use class like react, vue will add class to root dom
  handle: PropTypes.any,
  afterVisibleChange: PropTypes.func,
  keyboard: PropTypes.bool.def(true)
};

export default {
  name: "mapgis-ui-drawer",
  wrapperUI: Drawer,
  mixins: [AntdMixin, ThemeMixin],
  inheritAttrs: false,
  props: drawerProps,
  methods: {}
};
</script>
