<script>
import Checkbox from "ant-design-vue/es/checkbox/Checkbox";

import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";

export const checkboxProps = {
  prefixCls: PropTypes.string,
  defaultChecked: PropTypes.bool,
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  isGroup: PropTypes.bool,
  value: PropTypes.any,
  name: PropTypes.string,
  id: PropTypes.string,
  indeterminate: PropTypes.bool,
  type: PropTypes.string.def("checkbox"),
  autoFocus: PropTypes.bool
};

export default {
  name: "mapgis-ui-checkbox",
  wrapperUI: Checkbox,
  __ANT_CHECKBOX: true,
  mixins: [AntdMixin, ThemeMixin],
  inheritAttrs: false,
  props: checkboxProps,
  methods: {},
  model: {
    prop: 'checked',
    event: 'input'
  },
  computed: {
    addListeners() {
      const vm = this;
      return {
        input: function(value) {
          vm.$emit('input', value);
        }
      };
    }
  }
};
</script>
