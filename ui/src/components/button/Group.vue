<script>
import ButtonGroup, { ButtonGroupProps } from 'ant-design-vue/es/button/button-group';

import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";

export default {
  name: "mapgis-ui-button-group",
  wrapperUI: ButtonGroup,
  mixins: [AntdMixin, ThemeMixin],
  inheritAttrs: false,
  props: ButtonGroupProps
};
</script>
