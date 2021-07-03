<script>
import Row from 'ant-design-vue/es/grid/Row';

import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";

export const RowProps = {
  gutter: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.array]),
  type: PropTypes.oneOf(['flex']),
  align: PropTypes.oneOf(['top', 'middle', 'bottom', 'stretch']),
  justify: PropTypes.oneOf(['start', 'end', 'center', 'space-around', 'space-between']),
  prefixCls: PropTypes.string,
  gutter: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.array]).def(0)
};

export default {
  name: "mapgis-ui-row",
  wrapperUI: Row,
  mixins: [AntdMixin, ThemeMixin],
  inheritAttrs: false,
  props: RowProps,
};
</script>
