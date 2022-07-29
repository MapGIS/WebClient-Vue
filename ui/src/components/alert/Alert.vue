<script>
import Alert from "ant-design-vue/es/alert/index";
import { AlertProps } from "ant-design-vue/es/alert/index";

// import inputProps from "ant-design-vue/es/input/inputProps";
import PropTypes from "../../util/vue-types";

import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";

export default {
  name: "mapgis-ui-alert",
  wrapperUI: Alert,
  mixins: [AntdMixin, ThemeMixin],
  props: {
    ...AlertProps
  },
  computed: {}
};
</script>
