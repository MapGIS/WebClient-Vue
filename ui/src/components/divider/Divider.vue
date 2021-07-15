<script>
import Divider from 'ant-design-vue/es/divider';

import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";

export const dividerProps = {
  prefixCls: PropTypes.string,
  type: PropTypes.oneOf(['horizontal', 'vertical', '']).def('horizontal'),
  dashed: PropTypes.bool,
  orientation: PropTypes.oneOf(['left', 'right', 'center'])
};

export default {
  name: "mapgis-ui-divider",
  wrapperUI: Divider,
  mixins: [AntdMixin, ThemeMixin],
  inheritAttrs: false,
  props: dividerProps,
  methods: {}
};
</script>
