<script>
import ConfigProvider from 'ant-design-vue/es/config-provider';

import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";

export const configProviderProps = {
  getPopupContainer: PropTypes.func,
  prefixCls: PropTypes.string,
  renderEmpty: PropTypes.func,
  csp: PropTypes.object,
  autoInsertSpaceInButton: PropTypes.bool,
  locale: PropTypes.object,
  pageHeader: PropTypes.object,
  transformCellText: PropTypes.func
};

export default {
  name: "mapgis-ui-config-provider",
  wrapperUI: ConfigProvider,
  mixins: [AntdMixin, ThemeMixin],
  inheritAttrs: false,
  props: configProviderProps,
  methods: {}
};
</script>
