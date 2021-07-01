<script>
import { TabPane } from "ant-design-vue/es/tabs";

import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";

export const tabPaneProps = {
  active: PropTypes.bool,
  destroyInactiveTabPane: PropTypes.bool,
  forceRender: PropTypes.bool,
  placeholder: PropTypes.any,
  rootPrefixCls: PropTypes.string,
  tab: PropTypes.any,
  closable: PropTypes.bool,
  disabled: PropTypes.bool
};

export default {
  name: "mapgis-ui-tab-pane",
  __ANT_TAB_PANE: true,
  wrapperUI: TabPane,
  mixins: [AntdMixin, ThemeMixin],
  inheritAttrs: false,
  props: tabPaneProps
};
</script>
