<script>
import Badge from 'ant-design-vue/es/badge/Badge';

import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";

export const badgeProps = {
  /** Number to show in badge */
  count: PropTypes.any,
  showZero: PropTypes.bool,
  /** Max count to show */
  overflowCount: PropTypes.number,
  /** whether to show red dot without number */
  dot: PropTypes.bool,
  prefixCls: PropTypes.string,
  scrollNumberPrefixCls: PropTypes.string,
  status: PropTypes.oneOf(['success', 'processing', 'default', 'error', 'warning']),
  color: PropTypes.string,
  text: PropTypes.string,
  offset: PropTypes.array,
  numberStyle: PropTypes.object.def(function () {
    return {};
  }),
  title: PropTypes.string
};

export default {
  name: "mapgis-ui-badge",
  wrapperUI: Badge,
  mixins: [AntdMixin, ThemeMixin],
  inheritAttrs: false,
  props: badgeProps,
  methods: {}
};
</script>
