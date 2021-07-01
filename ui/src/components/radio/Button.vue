<script>
import RadioButton from 'ant-design-vue/es/radio/RadioButton';
import { radioProps } from './Radio.vue';

import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";

export const radioButtonProps = {
  ...radioProps
};

export default {
  name: "mapgis-ui-radio-button",
  wrapperUI: RadioButton,
  mixins: [AntdMixin, ThemeMixin],
  inheritAttrs: false,
  props: radioButtonProps
};
</script>
