<script>
import Tree from "ant-design-vue/es/tree";
import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";

export const treeNodeTypes = {
  eventKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // Pass by parent `cloneElement`
    prefixCls: PropTypes.string,
    // className: PropTypes.string,
    root: PropTypes.object,
    // onSelect: PropTypes.func,

    // By parent
    expanded: PropTypes.bool,
    selected: PropTypes.bool,
    checked: PropTypes.bool,
    loaded: PropTypes.bool,
    loading: PropTypes.bool,
    halfChecked: PropTypes.bool,
    title: PropTypes.any,
    pos: PropTypes.string,
    dragOver: PropTypes.bool,
    dragOverGapTop: PropTypes.bool,
    dragOverGapBottom: PropTypes.bool,

    // By user
    isLeaf: PropTypes.bool,
    checkable: PropTypes.bool,
    selectable: PropTypes.bool,
    disabled: PropTypes.bool,
    disableCheckbox: PropTypes.bool,
    icon: PropTypes.any,
    dataRef: PropTypes.object,
    switcherIcon: PropTypes.any,
    label: PropTypes.any,
    value: PropTypes.any
};

export default {
  name: 'mapgis-ui-tree-node',
  __ANT_TREE_NODE: true,
  isTreeNode: 1,
  wrapperUI: Tree.TreeNode,
  mixins: [ThemeMixin, AntdMixin],
  inheritAttrs: false,
  props: treeNodeTypes
};

</script>
