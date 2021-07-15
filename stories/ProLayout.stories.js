import MapgisUiLayoutPro from "../ui/src/layout/base/BaseLayout.vue";

import './style/pro.css';

export default {
  title: "Pro/布局",
  component: MapgisUiLayoutPro,
  argTypes: {},
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiLayoutPro },
  data() {
    return {
      value: 0,
    };
  },
  template: `<mapgis-ui-layout-pro>
      <template slot="header">
      <div class="logo" />
      <mapgis-ui-menu
        theme="dark"
        mode="horizontal"
        :default-selected-keys="['2']"
        :style="{ lineHeight: '64px' }"
      >
        <mapgis-ui-menu-item key="1">
          nav 1
        </mapgis-ui-menu-item>
        <mapgis-ui-menu-item key="2">
          nav 2
        </mapgis-ui-menu-item>
        <mapgis-ui-menu-item key="3">
          nav 3
        </mapgis-ui-menu-item>
      </mapgis-ui-menu>
      </template>
    </mapgis-ui-layout-pro>`,
});

export const 基础使用 = Template.bind({});
基础使用.args = {};
