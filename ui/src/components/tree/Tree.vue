<script>
import Tree from "ant-design-vue/es/tree";
import { TreeProps } from "ant-design-vue/es/tree/Tree";
import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";

export const treeProps = {
  ...TreeProps()
};

export default {
  name: "mapgis-ui-tree",
  wrapperUI: Tree,
  mixins: [AntdMixin],
  inheritAttrs: true,
  model: {
    prop: "checkedKeys",
    event: "check"
  },
  props: treeProps
  /*   computed: {
    addListeners() {
      const vm = this;
      return {
        check: function() {
          vm.$emit("check", ...arguments);
        }
      };
    }
  } */
};
</script>
