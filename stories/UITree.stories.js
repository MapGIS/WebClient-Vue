import MapgisUiTree from "../ui/src/components/tree/Tree.vue";

export default {
  title: "界面/树形控件",
  component: MapgisUiTree,
  argTypes: {
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiTree },
  data() {
    return {
      treeData: [{
        title: 'parent 1',
        key: '0-0',
        children: [{
          title: 'parent 1-0',
          key: '0-0-0',
          disabled: true,
          children: [{
            title: 'leaf',
            key: '0-0-0-0',
            disableCheckbox: true
          },
          {
            title: 'leaf',
            key: '0-0-0-1'
          }
          ]
        },
        {
          title: 'parent 1-1',
          key: '0-0-1',
          children: [{
            key: '0-0-1-0',
            scopedSlots: {
              title: 'title0010'
            }
          }]
        }
        ]
      }]
    };
  },
  methods: {
  },
  template: `
  <mapgis-ui-tree
    checkable
    :tree-data="treeData"
    :default-expanded-keys="['0-0-0', '0-0-1']"
    :default-selected-keys="['0-0-0', '0-0-1']"
    :default-checked-keys="['0-0-0', '0-0-1']"
  >
    <span slot="title0010" style="color: #1890ff">sss</span>
  </mapgis-ui-tree>
  `,
});

export const Tree = Template.bind({});
Tree.args = {};

const Template2 = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiTree },
  data() {
    return {
      treeData: [{
        title: '0-0',
        key: '0-0',
        children: [{
          title: '0-0-0',
          key: '0-0-0',
          children: [{
            title: '0-0-0-0',
            key: '0-0-0-0'
          },
          {
            title: '0-0-0-1',
            key: '0-0-0-1'
          },
          {
            title: '0-0-0-2',
            key: '0-0-0-2'
          }
          ]
        },
        {
          title: '0-0-1',
          key: '0-0-1',
          children: [{
            title: '0-0-1-0',
            key: '0-0-1-0'
          },
          {
            title: '0-0-1-1',
            key: '0-0-1-1'
          },
          {
            title: '0-0-1-2',
            key: '0-0-1-2'
          }
          ]
        },
        {
          title: '0-0-2',
          key: '0-0-2'
        }
        ]
      },
      {
        title: '0-1',
        key: '0-1',
        children: [{
          title: '0-1-0-0',
          key: '0-1-0-0'
        },
        {
          title: '0-1-0-1',
          key: '0-1-0-1'
        },
        {
          title: '0-1-0-2',
          key: '0-1-0-2'
        }
        ]
      },
      {
        title: '0-2',
        key: '0-2'
      }
      ],
      expandedKeys: ['0-0-0', '0-0-1'],
      autoExpandParent: true,
      checkedKeys: ['0-0-0'],
      selectedKeys: []
    };
  },
  watch: {
    checkedKeys(val) {
      console.log('onCheck', val);
    }
  },
  methods: {
    onExpand(expandedKeys) {
      console.log('onExpand', expandedKeys);
      // if not set autoExpandParent to false, if children expanded, parent can not collapse.
      // or, you can remove all expanded children keys.
      this.expandedKeys = expandedKeys;
      this.autoExpandParent = false;
    },
    onCheck(checkedKeys) {
      console.log('onCheck', checkedKeys);
      this.checkedKeys = checkedKeys;
    },
    onSelect(selectedKeys, info) {
      console.log('onSelect', info);
      this.selectedKeys = selectedKeys;
    }
  },
  template: `
  <mapgis-ui-tree
    v-model="checkedKeys"
    checkable
    :expanded-keys="expandedKeys"
    :auto-expand-parent="autoExpandParent"
    :selected-keys="selectedKeys"
    :tree-data="treeData"
    v-on:expand="onExpand"
    v-on:select="onSelect"
  />
  `,
});

export const ControlledTree = Template2.bind({});
ControlledTree.args = {};
