<script>
import Card from "ant-design-vue/es/card/Card";
import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";

export const cardProps = {
  prefixCls: PropTypes.string,
  title: PropTypes.any,
  extra: PropTypes.any,
  bordered: PropTypes.bool.def(true),
  bodyStyle: PropTypes.object,
  headStyle: PropTypes.object,
  loading: PropTypes.bool.def(false),
  hoverable: PropTypes.bool.def(false),
  type: PropTypes.string,
  size: PropTypes.oneOf(["default", "small"]),
  actions: PropTypes.any,
  tabList: PropTypes.array,
  tabProps: PropTypes.object,
  tabBarExtraContent: PropTypes.any,
  activeTabKey: PropTypes.string,
  defaultActiveTabKey: PropTypes.string
};

export default {
  name: "mapgis-ui-card",
  wrapperUI: Card,
  mixins: [AntdMixin],
  inheritAttrs: false,
  props: cardProps
};
</script>
