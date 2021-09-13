import MapgisUiEditableTable from "../../../ui/src/components/table/EditableTable.vue";

export default {
  title: "界面/数据显示/表格-编辑",
  component: MapgisUiEditableTable,
  argTypes: {
    title: "编辑表格",
    size: "small",
    tools: [
      { title: "工具栏1", icon: "mapgis-huizhi1", method: () => {} },
      { title: "工具栏2", icon: "mapgis-font-colors", method: () => {} },
      { title: "工具栏3", icon: "mapgis-translate", method: () => {} },
    ],
    loading: false,
    checkable: true,
    rowKey: "index",
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiEditableTable },
  data() {
    return {
      customdata: [
        {
          key: "1",
          name: "John Brown",
          age: 32,
          address: "New York No. 1 Lake Park",
          gender: "男",
        },
        {
          key: "2",
          name: "Jim Green",
          age: 42,
          address: "London No. 1 Lake Park",
          gender: "男",
        },
        {
          key: "3",
          name: "Joe Black",
          age: 32,
          address: "Sidney No. 1 Lake Park",
          gender: "男",
        },
      ],
      customcolumns: [
        {
          title: "Name",
          dataIndex: "name",
          type: "Input",
          key: "name",
          scopedSlots: { customRender: "name" },
        },
        {
          title: "Age",
          dataIndex: "age",
          type: "InputNumber",
          key: "age",
          scopedSlots: { customRender: "age" },
        },
        {
          title: "Address",
          dataIndex: "address",
          type: "Input",
          key: "address",
          scopedSlots: { customRender: "address" },
        },
        {
          title: "Address",
          dataIndex: "gender",
          type: "Select",
          props: {
            options: [
              {
                value: "男",
                title: "男",
              },
              {
                value: "女",
                title: "女",
              },
            ],
          },
          key: "gender",
          scopedSlots: { customRender: "gender" },
        },
      ],
    };
  },
  methods: {
    handleDisabledChange(disabled) {
      this.disabled = disabled;
    },
  },
  template: `
  <mapgis-ui-editable-table v-bind="$props" :columns="customcolumns" :data="customdata">
  </mapgis-ui-editable-table>
  `,
});

export const 编辑表格 = Template.bind({});
编辑表格.args = {
  title: "编辑表格",
  size: "small",
  tools: [
    { title: "工具栏1", icon: "mapgis-huizhi1", method: () => {} },
    { title: "工具栏2", icon: "mapgis-font-colors", method: () => {} },
    { title: "工具栏3", icon: "mapgis-translate", method: () => {} },
  ],
  loading: false,
  checkable: true,
  rowKey: "index",
};
