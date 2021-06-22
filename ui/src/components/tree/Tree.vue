<script>
import Tree from "ant-design-vue/es/tree";
import { TreeProps } from "ant-design-vue/es/tree/Tree";
import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";

export const treeProps = {
  ...TreeProps()
};

export default {
  name: "mapgis-ui-tree",
  wrapperUI: Tree,
  mixins: [AntdMixin, ThemeMixin],
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
