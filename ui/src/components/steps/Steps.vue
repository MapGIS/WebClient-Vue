<script>
import Steps from "ant-design-vue/es/steps/index";

import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";

var initDefaultProps = function initDefaultProps(propTypes, defaultProps) {
  Object.keys(defaultProps).forEach(function(k) {
    if (propTypes[k]) {
      propTypes[k].def && (propTypes[k] = propTypes[k].def(defaultProps[k]));
    } else {
      throw new Error("not have " + k + " prop");
    }
  });
  return propTypes;
};

var getStepsProps = function getStepsProps() {
  var defaultProps =
    arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var props = {
    prefixCls: PropTypes.string,
    iconPrefix: PropTypes.string,
    current: PropTypes.number,
    initial: PropTypes.number,
    labelPlacement: PropTypes.oneOf(["horizontal", "vertical"]).def(
      "horizontal"
    ),
    status: PropTypes.oneOf(["wait", "process", "finish", "error"]),
    size: PropTypes.oneOf(["default", "small"]),
    direction: PropTypes.oneOf(["horizontal", "vertical"]),
    progressDot: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    type: PropTypes.oneOf(["default", "navigation"])
  };
  return initDefaultProps(props, defaultProps);
};

export default {
  name: "mapgis-ui-steps",
  wrapperUI: Steps,
  mixins: [AntdMixin, ThemeMixin],
  inheritAttrs: false,
  props: getStepsProps({
    current: 0
  }),
  model: {
    prop: "current",
    event: "change"
  }
};
</script>
