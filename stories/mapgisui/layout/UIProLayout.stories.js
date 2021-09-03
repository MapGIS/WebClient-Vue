import MapgisUiLayoutPro from "../../../ui/src/layout/base/BaseLayout.vue";

export default {
  title: "界面/Pro/基础使用",
  component: MapgisUiRow,
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
  template: `<div id="components-layout-demo-basic">
    <mapgis-ui-layout-pro>

    </mapgis-ui-layout-pro>
  </div>`,
});

export const 基础使用 = Template.bind({});
基础使用.args = {};
