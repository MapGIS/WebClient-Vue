<script>
import InputNumber, { InputNumberProps } from 'ant-design-vue/es/input-number';

import inputProps from "ant-design-vue/es/input/inputProps";

import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";

export default {
  name: "mapgis-ui-input-number",
  wrapperUI: InputNumber,
  mixins: [AntdMixin, ThemeMixin],
  inheritAttrs: false,
  props: InputNumberProps,
  methods: {},
  model: {
    prop: 'value',
    event: 'change'
  },
  computed: {
    addListeners() {
      const vm = this;
      return {
        // 这里确保组件配合 `v-model` 的工作
        'change': function(value) {
          vm.$emit('change', value);
        }
      };
    }
  }
};
</script>
