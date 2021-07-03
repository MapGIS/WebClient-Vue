<script>
import TextArea from "ant-design-vue/es/input/TextArea";
import inputProps from "ant-design-vue/es/input/inputProps";

import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";

export const textAreaProps = {
  ...inputProps,
  autosize: PropTypes.oneOfType([Object, Boolean]),
  autoSize: PropTypes.oneOfType([Object, Boolean]),
};
export default {
  name: "mapgis-ui-textarea",
  wrapperUI: TextArea,
  mixins: [AntdMixin, ThemeMixin],
  inheritAttrs: false,
  props: textAreaProps,
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
    }
  }
};
</script>
