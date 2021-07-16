<script>
import DirectoryTree from 'ant-design-vue/es/tree/DirectoryTree';
import { TreeProps } from "ant-design-vue/es/tree/Tree";
import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";

export const directoryTreeTypes = {
  ...TreeProps(),
  expandAction: PropTypes.oneOf([false, 'click', 'doubleclick', 'dblclick'])
};

export default {
  name: 'mapgis-ui-directory-tree',
  wrapperUI: DirectoryTree,
  mixins: [ThemeMixin, AntdMixin],
  inheritAttrs: false,
  model: {
    prop: 'checkedKeys',
    event: 'check'
  },
  props: directoryTreeTypes,
  computed: {
    addListeners() {
      const vm = this;
      return {
        'check': function () {
          vm.$emit('check', ...arguments);
        }
      };
    }
  }
};
</script>
