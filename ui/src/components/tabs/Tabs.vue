<script>
import Tabs from "ant-design-vue/es/tabs";

import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";

export const tabsProps = {
  prefixCls: PropTypes.string,
  activeKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  defaultActiveKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  hideAdd: PropTypes.bool.def(false),
  tabBarStyle: PropTypes.object,
  tabBarExtraContent: PropTypes.any,
  destroyInactiveTabPane: PropTypes.bool.def(false),
  type: PropTypes.oneOf(['line', 'card', 'editable-card']),
  tabPosition: PropTypes.oneOf(['top', 'right', 'bottom', 'left']).def('top'),
  size: PropTypes.oneOf(['default', 'small', 'large']),
  animated: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  tabBarGutter: PropTypes.number,
  renderTabBar: PropTypes.func
};

export default {
  name: "mapgis-ui-tabs",
  wrapperUI: Tabs,
  mixins: [AntdMixin, ThemeMixin],
  inheritAttrs: false,
  props: tabsProps,
  methods: {},
  model: {
    prop: 'activeKey',
    event: 'change'
  },
  computed: {
    addListeners() {
      const vm = this;
      return {
        change: function(value) {
          vm.$emit('change', value);
        }
      };
    }
  }
};
</script>
