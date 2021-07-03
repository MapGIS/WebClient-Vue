<script>
import DropdownButton, {
  DropdownButtonProps
} from "ant-design-vue/es/dropdown/dropdown-button";
import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";

export default {
  name: "mapgis-ui-dropdown-button",
  wrapperUI: DropdownButton,
  mixins: [AntdMixin, ThemeMixin],
  inheritAttrs: false,
  props: DropdownButtonProps,
  model: {
    prop: "visible",
    event: "visibleChange"
  }
};
</script>
