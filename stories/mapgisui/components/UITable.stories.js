import MapgisUiTable from "../../../ui/src/components/table/Table.vue";

export default {
  title: "界面/数据显示/表格",
  component: MapgisUiTable,
  argTypes: {
    prefixCls: { table: { disable: true } },
    getPopupContainer: { table: { disable: true } },
    csp: { table: { disable: true } },
    locale: { table: { disable: true } },
    background: { table: { disable: true } },
    textColor: { table: { disable: true } },
    colorGroup: { table: { disable: true } },
    themeStyleChanged: { table: { disable: true } },
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiTable },
  data() {
    return {
      data: [
        {
          key: '1',
          name: 'John Brown',
          age: 32,
          address: 'New York No. 1 Lake Park',
          tags: ['nice', 'developer']
        },
        {
          key: '2',
          name: 'Jim Green',
          age: 42,
          address: 'London No. 1 Lake Park',
          tags: ['loser']
        },
        {
          key: '3',
          name: 'Joe Black',
          age: 32,
          address: 'Sidney No. 1 Lake Park',
          tags: ['cool', 'teacher']
        }
      ],
      columns: [
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: 'Age',
          dataIndex: 'age',
          key: 'age'
        },
        {
          title: 'Address',
          dataIndex: 'address',
          key: 'address'
        },
        {
          title: 'Tags',
          key: 'tags',
          dataIndex: 'tags',
          scopedSlots: { customRender: 'tags' }
        }
      ]
    };
  },
  methods: {
    handleDisabledChange(disabled) {
      this.disabled = disabled;
    }
  },
  template: `
  <mapgis-ui-table :columns="columns" :data-source="data"></mapgis-ui-table>
  `,
});

export const Table = Template.bind({});
Table.args = {};


const Template2 = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiTable },
  data() {
    return {
      data: [
        {
          key: '1',
          name: 'John Brown',
          age: 32,
          address: 'New York No. 1 Lake Park',
          tags: ['nice', 'developer']
        },
        {
          key: '2',
          name: 'Jim Green',
          age: 42,
          address: 'London No. 1 Lake Park',
          tags: ['loser']
        },
        {
          key: '3',
          name: 'Joe Black',
          age: 32,
          address: 'Sidney No. 1 Lake Park',
          tags: ['cool', 'teacher']
        }
      ],
      columns: [
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: 'Age',
          dataIndex: 'age',
          key: 'age'
        },
        {
          title: 'Address',
          dataIndex: 'address',
          key: 'address'
        },
        {
          title: 'Tags',
          key: 'tags',
          dataIndex: 'tags',
          scopedSlots: { customRender: 'tags' }
        }
      ],
      formLayout: 'inline',
    };
  },
  methods: {
    handleDisabledChange(disabled) {
      this.disabled = disabled;
    }
  },
  template: `
  <div>
    <mapgis-ui-form :layout="formLayout">
      <mapgis-ui-form-item
        label="字段A"
        :colon="false"
      >
        <mapgis-ui-input placeholder="input placeholder" />
      </mapgis-ui-form-item>
      <mapgis-ui-form-item
        label="字段B"
        :colon="false"
      >
        <mapgis-ui-input placeholder="input placeholder" />
      </mapgis-ui-form-item>
      <mapgis-ui-form-item>
        <mapgis-ui-button type="primary">提交提交提交提交</mapgis-ui-button>
      </mapgis-ui-form-item>
    </mapgis-ui-form>
    <div class="main">
      <mapgis-ui-table :columns="columns" :data-source="data">
        <a slot="name" slot-scope="text">{{ text }}</a>
      </mapgis-ui-table>
    </div>
  </div>
  `,
});

export const UI规范 = Template2.bind({});
UI规范.args = {};
