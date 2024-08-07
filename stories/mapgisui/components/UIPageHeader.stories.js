import MapgisUiPageHeader from "../../../ui/src/components/pageheader/PageHeader.vue";

export default {
  title: "界面/导航/页头",
  component: MapgisUiPageHeader,
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
  components: { MapgisUiPageHeader },
  data() {
    return {
      value: 0,
    };
  },
  template: `<mapgis-ui-page-header
    style="border: 1px solid rgb(235, 237, 240)"
    title="Title"
    sub-title="This is a subtitle"
    @back="() => $router.go(-1)"
  >
    <template slot="extra">
      <mapgis-ui-button key="3">
        Operation
      </mapgis-ui-button>
      <mapgis-ui-button key="2">
        Operation
      </mapgis-ui-button>
      <mapgis-ui-button key="1" type="primary">
        Primary
      </mapgis-ui-button>
    </template>
    <mapgis-ui-descriptions size="small" :column="3">
      <mapgis-ui-descriptions-item label="Created">
        Lili Qu
      </mapgis-ui-descriptions-item>
      <mapgis-ui-descriptions-item label="Association">
        <a>421421</a>
      </mapgis-ui-descriptions-item>
      <mapgis-ui-descriptions-item label="Creation Time">
        2017-01-10
      </mapgis-ui-descriptions-item>
      <mapgis-ui-descriptions-item label="Effective Time">
        2017-10-10
      </mapgis-ui-descriptions-item>
      <mapgis-ui-descriptions-item label="Remarks">
        Gonghu Road, Xihu District, Hangzhou, Zhejiang, China
      </mapgis-ui-descriptions-item>
    </mapgis-ui-descriptions>
  </mapgis-ui-page-header>`,
});

export const 基本 = Template.bind({});
基本.args = {};
