<script>
import Switch from "ant-design-vue/es/switch";

import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";

export const switchProps = {
  prefixCls: PropTypes.string,
  size: PropTypes.oneOf(['small', 'default', 'large']),
  disabled: PropTypes.bool,
  checkedChildren: PropTypes.any,
  unCheckedChildren: PropTypes.any,
  tabIndex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  checked: PropTypes.bool,
  defaultChecked: PropTypes.bool,
  autoFocus: PropTypes.bool,
  loading: PropTypes.bool
};

export default {
  name: "mapgis-ui-switch",
  __ANT_SWITCH: true,
  wrapperUI: Switch,
  mixins: [AntdMixin, ThemeMixin],
  inheritAttrs: false,
  props: switchProps,
  methods: {},
  model: {
    prop: 'checked',
    event: 'change'
  },
  computed: {
    addListeners() {
      const vm = this;
      return {
        // 这里确保组件配合 `v-model` 的工作
        'change.value': function(value) {
          vm.$emit('change.value', value);
        }
      };
    }
  }
};
</script>
