<script>
import Button from 'ant-design-vue/es/button/button';
import buttonTypes from 'ant-design-vue/es/button/buttonTypes';

import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";

export const buttonProps = {
  ...buttonTypes()
};

export default {
  name: "mapgis-ui-button",
  __ANT_BUTTON: true,
  wrapperUI: Button,
  mixins: [AntdMixin, ThemeMixin],
  inheritAttrs: false,
  props: buttonProps
};
</script>
