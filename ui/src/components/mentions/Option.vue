<script>
import Option, { OptionProps } from 'ant-design-vue/es/vc-mentions/src/Option';

import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";

export const mentionsOptionProps = {
  ...OptionProps
};

export default {
  name: "mapgis-ui-mentions-option",
  wrapperUI: Option,
  mixins: [AntdMixin, ThemeMixin],
  inheritAttrs: false,
  props: mentionsOptionProps,
  methods: {}
};
</script>
