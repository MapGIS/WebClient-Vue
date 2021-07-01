<script>
import Grid from 'ant-design-vue/es/card/Grid';
import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";

export const gridProps = {
  prefixCls: PropTypes.string,
  hoverable: PropTypes.bool
};

export default {
  name: "mapgis-ui-card-grid",
  __ANT_CARD_GRID: true,
  wrapperUI: Grid,
  mixins: [AntdMixin, ThemeMixin],
  inheritAttrs: false,
  props: gridProps
};
</script>
