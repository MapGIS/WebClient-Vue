<script>
import Group from "ant-design-vue/es/input/Group";

import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";

export const inputGroupProps = {
  prefixCls: PropTypes.string,
  size: {
    validator: function validator(value) {
      return ['small', 'large', 'default'].includes(value);
    }
  },
  compact: Boolean
};

export default {
  name: "mapgis-ui-input-group",
  wrapperUI: Group,
  mixins: [AntdMixin, ThemeMixin],
  inheritAttrs: false,
  props: inputGroupProps,
  methods: {}
};
</script>
