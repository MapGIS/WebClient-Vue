<script>
import Spin, { SpinProps } from 'ant-design-vue/es/spin/Spin';

import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";

export const spinProps = {
  ...SpinProps()
};
export default {
  name: "mapgis-ui-spin",
  wrapperUI: Spin,
  mixins: [AntdMixin, ThemeMixin],
  inheritAttrs: false,
  props: spinProps,
  methods: {}
};
</script>
