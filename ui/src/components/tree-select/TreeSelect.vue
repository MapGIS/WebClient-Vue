<script>
import TreeSelect, { TreeSelectProps } from "ant-design-vue/es/tree-select";
import { SHOW_ALL, SHOW_PARENT, SHOW_CHILD } from 'ant-design-vue/es/vc-tree-select';
import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";


export default {
  name: "mapgis-ui-tree-select",
  wrapperUI: TreeSelect,
  mixins: [AntdMixin, ThemeMixin],
  inheritAttrs: false,
  SHOW_ALL: SHOW_ALL,
  SHOW_PARENT: SHOW_PARENT,
  SHOW_CHILD: SHOW_CHILD,
  model: {
    prop: 'value',
    event: 'change'
  },
  props: TreeSelectProps(),
  computed: {
    addListeners() {
      const vm = this;
      return {
        change: function(value) {
          vm.$emit('change', value);
        }
      };
    }
  }
};
</script>
