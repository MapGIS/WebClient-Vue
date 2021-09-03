import MapgisUiRow from "../../../ui/src/components/grid/Row.vue";
import MapgisUiCol from "../../../ui/src/components/grid/Col.vue";

import '../../style/layout.css';

export default {
  title: "界面/布局",
  component: MapgisUiRow,
  argTypes: {},
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiRow, MapgisUiCol },
  data() {
    return {
      value: 0,
    };
  },
  template: `<div id="components-layout-demo-basic">
    <mapgis-ui-layout>
      <mapgis-ui-layout-header>Header</mapgis-ui-layout-header>
      <mapgis-ui-layout-content>Content</mapgis-ui-layout-content>
      <mapgis-ui-layout-footer>Footer</mapgis-ui-layout-footer>
    </mapgis-ui-layout>

    <mapgis-ui-layout>
      <mapgis-ui-layout-header>Header</mapgis-ui-layout-header>
      <mapgis-ui-layout>
        <mapgis-ui-layout-sider>Sider</mapgis-ui-layout-sider>
        <mapgis-ui-layout-content>Content</mapgis-ui-layout-content>
      </mapgis-ui-layout>
      <mapgis-ui-layout-footer>Footer</mapgis-ui-layout-footer>
    </mapgis-ui-layout>

    <mapgis-ui-layout>
      <mapgis-ui-layout-header>Header</mapgis-ui-layout-header>
      <mapgis-ui-layout>
        <mapgis-ui-layout-content>Content</mapgis-ui-layout-content>
        <mapgis-ui-layout-sider>Sider</mapgis-ui-layout-sider>
      </mapgis-ui-layout>
      <mapgis-ui-layout-footer>Footer</mapgis-ui-layout-footer>
    </mapgis-ui-layout>

    <mapgis-ui-layout>
      <mapgis-ui-layout-sider>Sider</mapgis-ui-layout-sider>
      <mapgis-ui-layout>
        <mapgis-ui-layout-header>Header</mapgis-ui-layout-header>
        <mapgis-ui-layout-content>Content</mapgis-ui-layout-content>
        <mapgis-ui-layout-footer>Footer</mapgis-ui-layout-footer>
      </mapgis-ui-layout>
    </mapgis-ui-layout>
  </div>`,
});

export const 基础使用 = Template.bind({});
基础使用.args = {};
