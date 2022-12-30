<script>
import Icon from "ant-design-vue/es/icon";
import createFromIconfontCN from "ant-design-vue/es/icon/IconFont";
import {
  getTwoToneColor,
  setTwoToneColor
} from "ant-design-vue/es/icon/twoTonePrimaryColor";
import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";

export const IconProps = {
  tabIndex: PropTypes.number,
  type: PropTypes.string,
  component: PropTypes.any,
  viewBox: PropTypes.any,
  spin: PropTypes.bool.def(false),
  rotate: PropTypes.number,
  theme: PropTypes.oneOf(["filled", "outlined", "twoTone"]),
  twoToneColor: PropTypes.string,
  role: PropTypes.string
};

export default {
  name: "mapgis-ui-ant-icon",
  wrapperUI: Icon,
  mixins: [AntdMixin, ThemeMixin],
  inheritAttrs: false,
  props: IconProps,
  createFromIconfontCN,
  getTwoToneColor,
  setTwoToneColor
};
</script>
