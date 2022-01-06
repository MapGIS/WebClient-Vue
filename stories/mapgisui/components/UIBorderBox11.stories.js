import MapgisUiBorderbox11 from "../../../ui/src/components/svgborder/Borderbox11.vue";

export default {
  title: "界面/科技风/边框11",
  component: MapgisUiBorderbox11,
  argTypes: {
    title: "标题",
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiBorderbox11 },

  template: `<mapgis-ui-borderbox11 v-bind="$props" style="width:600px; height:500px; background: #000;">
    </mapgis-ui-borderbox11>`,
});

export const 边框11 = Template.bind({});
边框11.args = {
  title: "标题",
};
