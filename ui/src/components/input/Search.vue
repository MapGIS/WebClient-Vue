<script>
import Search from "ant-design-vue/es/input/Search";
import inputProps from "ant-design-vue/es/input/inputProps";

import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";

export const inputSearchProps = {
  ...inputProps,
  enterButton: PropTypes.any
};

export default {
  name: "mapgis-ui-input-search",
  wrapperUI: Search,
  mixins: [AntdMixin, ThemeMixin],
  inheritAttrs: false,
  props: {
    ...inputSearchProps,
    autoWidth: { type: Boolean, default: false }
  },
  methods: {},
  model: {
    prop: 'value',
    event: 'change.value'
  },
  computed: {
    uiClass() {
      return this.autoWidth
        ? 'mapgis-ui-input-auto-width'
        : '';
    },
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
