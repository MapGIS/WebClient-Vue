<script>
import Col from "ant-design-vue/es/grid/Col";

import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";

var stringOrNumber = PropTypes.oneOfType([PropTypes.string, PropTypes.number]);

export var ColSize = PropTypes.shape({
  span: stringOrNumber,
  order: stringOrNumber,
  offset: stringOrNumber,
  push: stringOrNumber,
  pull: stringOrNumber
}).loose;

var objectOrNumber = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.number,
  ColSize
]);

export const ColProps = {
  span: stringOrNumber,
  order: stringOrNumber,
  offset: stringOrNumber,
  push: stringOrNumber,
  pull: stringOrNumber,
  xs: objectOrNumber,
  sm: objectOrNumber,
  md: objectOrNumber,
  lg: objectOrNumber,
  xl: objectOrNumber,
  xxl: objectOrNumber,
  prefixCls: PropTypes.string,
  flex: stringOrNumber
};

export default {
  name: "mapgis-ui-col",
  wrapperUI: Col,
  mixins: [AntdMixin, ThemeMixin],
  inheritAttrs: false,
  props: ColProps
};
</script>
