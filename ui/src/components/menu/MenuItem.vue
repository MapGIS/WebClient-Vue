<script>
import MenuItem from "ant-design-vue/es/menu/MenuItem";
import { itemProps } from "ant-design-vue/es/vc-menu";

import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";

export default {
  name: "mapgis-ui-menu-item",
  wrapperUI: MenuItem,
  mixins: [AntdMixin, ThemeMixin],
  inheritAttrs: false,
  isMenuItem: true,
  props: itemProps
};
</script>
