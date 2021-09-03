import MapgisUiTreeSelect from "../../../ui/src/components/tree-select/TreeSelect.vue";

export default {
  title: "界面/树形选择控件",
  component: MapgisUiTreeSelect,
  argTypes: {
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiTreeSelect },
  data() {
    return {
      value: undefined,
      treeData: [
        {
          title: 'Node1',
          value: '0-0',
          key: '0-0',
          children: [
            {
              value: '0-0-1',
              key: '0-0-1',
              scopedSlots: {
                // custom title
                title: 'title',
              },
            },
            {
              title: 'Child Node2',
              value: '0-0-2',
              key: '0-0-2',
            },
          ],
        },
        {
          title: 'Node2',
          value: '0-1',
          key: '0-1',
        },
      ]
    };
  },
  watch: {
    value(value) {
      console.log(value);
    },
  },
  methods: {
  },
  template: `
    <mapgis-ui-tree-select
      v-model="value"
      style="width: 100%"
      :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
      :tree-data="treeData"
      placeholder="Please select"
      tree-default-expand-all
    >
      <span v-if="key === '0-0-1'" slot="title" slot-scope="{ key, value }" style="color: #08c">
        Child Node1 {{ value }}
      </span>
    </mapgis-ui-tree-select>
  `,
});

export const TreeSelect = Template.bind({});
TreeSelect.args = {};
