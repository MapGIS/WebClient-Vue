import MapgisUI from "../../../ui/src/index";
import StoryPanelLarge from "../../../ui/src/components/panel/StoryPanelLarge.vue";

export default {
  title: "界面/通用/图文关联界面",
  component: MapgisUiLayoutPro,
  argTypes: {
    mode: "admin",
  },
};

const Template = (args, { argTypes }) => ({
  template: `<mapgis-ui-story-panel-large></mapgis-ui-story-panel-large>`,
  components: { StoryPanelLarge },
  props: Object.keys(argTypes),
  data() {
    return {
    };
  },
});


export const 图文关联界面 = Template.bind({});
图文关联界面.args = {
  mode: "ribbon",
};
