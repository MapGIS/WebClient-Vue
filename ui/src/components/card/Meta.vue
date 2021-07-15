<script>
import Meta from 'ant-design-vue/es/card/Meta';

import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";

export const metaProps = {
  prefixCls: PropTypes.string,
  title: PropTypes.any,
  description: PropTypes.any
};

export default {
  name: "mapgis-ui-card-meta",
  wrapperUI: Meta,
  mixins: [AntdMixin, ThemeMixin],
  inheritAttrs: false,
  props: metaProps
};
</script>
