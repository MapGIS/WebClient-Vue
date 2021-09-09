import MapgisUiPagination from "../../../ui/src/components/pagination/Pagination.vue";

export default {
  title: "界面/导航/分页",
  component: MapgisUiPagination,
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
  components: { MapgisUiPagination },
  data() {
    return {
      current: 2,
    };
  },
  template: `<mapgis-ui-pagination 
    v-model="current" :total="50" show-less-items >
  </mapgis-ui-pagination>`,
});

export const 基本 = Template.bind({});
基本.args = {};


const Template2 = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiPagination },
  data() {
    return {
      pageSize: 20,
      current: 4,
    };
  },
  watch: {
    pageSize(val) {
      console.log('pageSize', val);
    },
    current(val) {
      console.log('current', val);
    },
  },
  methods: {
    onShowSizeChange(current, pageSize) {
      console.log(current, pageSize);
    },
  },
  template: `<mapgis-ui-pagination
    show-size-changer
    :default-current="3"
    :total="500"
    @showSizeChange="onShowSizeChange"
  ></mapgis-ui-pagination>`,
});

export const 改变 = Template2.bind({});
改变.args = {};

const Template3 = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiPagination },
  template: `<mapgis-ui-pagination
    :total="85"
    :show-total="total => '总共 200 个'"
    :page-size="20"
    :default-current="1"
  ></mapgis-ui-pagination>`,
});

export const 总数 = Template3.bind({});
总数.args = {};
