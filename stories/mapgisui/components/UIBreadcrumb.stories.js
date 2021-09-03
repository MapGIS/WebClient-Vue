import MapgisUiBreadcrumb from "../../../ui/src/components/breadcrumb/Breadcrumb.vue";

export default {
  title: "界面/导航/面包屑",
  component: MapgisUiBreadcrumb,
  argTypes: {},
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiBreadcrumb },
  data() {
    return {};
  },
  template: `<mapgis-ui-breadcrumb v-bind="$props">
      <mapgis-ui-breadcrumb-item>中国</mapgis-ui-breadcrumb-item>
      <mapgis-ui-breadcrumb-item>
        <a href="">武汉</a>
      </mapgis-ui-breadcrumb-item>
      <mapgis-ui-breadcrumb-item>
        <a href="">洪山区</a>
      </mapgis-ui-breadcrumb-item>
      <mapgis-ui-breadcrumb-item>
        中地数码
      </mapgis-ui-breadcrumb-item>
    </mapgis-ui-breadcrumb>`,
});

export const Breadcrumb = Template.bind({});
Breadcrumb.args = {};
