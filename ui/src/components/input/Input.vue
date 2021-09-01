<script>
import Input from "ant-design-vue/es/input/Input";
import inputProps from "ant-design-vue/es/input/inputProps";
import PropTypes from "../../util/vue-types";

import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";

export default {
  name: "mapgis-ui-input",
  wrapperUI: Input,
  mixins: [AntdMixin, ThemeMixin],
  inheritAttrs: false,
  props: inputProps,
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
    }
  }
};
</script>
