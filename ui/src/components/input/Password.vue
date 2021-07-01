<script>
import Password from "ant-design-vue/es/input/Password";
import inputProps from "ant-design-vue/es/input/inputProps";

import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";

export const inputPasswordProps = {
  ...inputProps,
  prefixCls: PropTypes.string.def('ant-input-password'),
  inputPrefixCls: PropTypes.string.def('ant-input'),
  action: PropTypes.string.def('click'),
  visibilityToggle: PropTypes.bool.def(true)
};

export default {
  name: "mapgis-ui-input-password",
  wrapperUI: Password,
  mixins: [AntdMixin, ThemeMixin],
  inheritAttrs: false,
  props: inputPasswordProps,
  methods: {},
  model: {
    prop: 'value',
    event: 'change.value'
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
    },
    addProps() {
      return {
        prefixCls: this.prefixCls || 'mapgis-ui-input-password',
        inputPrefixCls: this.inputPrefixCls || 'mapgis-ui-input'
      };
    }
  }
};
</script>
