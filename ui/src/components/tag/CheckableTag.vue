<script>
import CheckableTag from 'ant-design-vue/es/tag/CheckableTag';

import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";

export const checkableTagProps = {
  prefixCls: PropTypes.string,
  checked: Boolean
};

export default {
  name: "mapgis-ui-checkable-tag",
  wrapperUI: CheckableTag,
  mixins: [AntdMixin, ThemeMixin],
  inheritAttrs: false,
  props: checkableTagProps,
  methods: {},
  model: {
    prop: 'checked'
  }
};
</script>
