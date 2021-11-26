import MapgisUiTabPanel from "../../../ui/src/layout/panel/TabPanel.vue";
import Markdown from "../../../ui/docs/api/panel/tab.md";

export default {
  title: "界面/Pro/面板/页面面板",
  component: MapgisUiTabPanel,
  argTypes: {
    tabs: [],
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiTabPanel },
  data() {
    return {
      value: 0,
      cloudsduration: 0,
    };
  },
  mounted() {},
  methods: {
    changeMenu(menu) {
      console.log("当前选中菜单:", menu);
    },
  },
  template: `<div>
    <mapgis-ui-tab-panel v-bind="$props" @change="changeMenu">
    </mapgis-ui-tab-panel>
  </div>`,
});

export const 页面面板 = Template.bind({});
页面面板.args = {
  tabs: [
    {
      type: "highlight",
      title: "高亮",
      icon: "mapgis-target-lock",
    },
    {
      type: "oid",
      title: "OID查询",
      icon: "mapgis-bullseye",
    },
    {
      type: "properties",
      title: "属性查询",
      icon: "mapgis-table",
    },
    {
      type: "explosion",
      title: "爆炸",
      icon: "mapgis-api",
    },
    {
      type: "bloom",
      title: "泛光",
      icon: "mapgis-highlight",
    },
    {
      type: "dynamic",
      title: "扫描",
      icon: "mapgis-wifi",
    },
  ],
};

页面面板.parameters = {
  docs: {
    description: {
      component: Markdown,
    },
  },
};
