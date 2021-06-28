<script>
import RadioGroup from 'ant-design-vue/es/radio/Group';

import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";

export const radioGroupProps = {
  prefixCls: PropTypes.string,
  defaultValue: PropTypes.any,
  value: PropTypes.any,
  size: {
    'default': 'default',
    validator: function validator(value) {
      return ['large', 'default', 'small'].includes(value);
    }
  },
  options: {
    'default': function _default() {
      return [];
    },
    type: Array
  },
  disabled: Boolean,
  name: String,
  buttonStyle: PropTypes.string.def('outline')
};

export default {
  name: "mapgis-ui-radio-group",
  wrapperUI: RadioGroup,
  mixins: [AntdMixin, ThemeMixin],
  inheritAttrs: false,
  props: radioGroupProps,
  methods: {},
  model: {
    prop: 'value',
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
