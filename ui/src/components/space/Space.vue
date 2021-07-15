<script>
import Space, { SpaceProps } from "ant-design-vue/es/space/index";
import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";

export const AllSpaceProps = {
  ...SpaceProps,
  size: "small",
  direction: "horizontal"
};

export default {
  name: "mapgis-ui-space",
  wrapperUI: Space,
  mixins: [AntdMixin, ThemeMixin],
  inheritAttrs: false,
  props: AllSpaceProps
};
</script>
