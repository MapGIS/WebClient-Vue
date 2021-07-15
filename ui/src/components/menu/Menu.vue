<script>
import Menu, { menuProps } from "ant-design-vue/es/menu/index";
import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";

export default {
  name: "mapgis-ui-menu",
  wrapperUI: Menu,
  mixins: [AntdMixin, ThemeMixin],
  inheritAttrs: false,
  props: menuProps,
  model: {
    prop: "selectedKeys",
    event: "selectChange"
  }
};
</script>
