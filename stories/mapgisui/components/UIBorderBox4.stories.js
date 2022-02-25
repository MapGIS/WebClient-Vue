import MapgisUiBorderbox4 from "../../../ui/src/components/svgborder/Borderbox4.vue";

export default {
  title: "界面/科技风/边框4",
  component: MapgisUiBorderbox4,
  argTypes: {
    reverse: false,
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiBorderbox4 },

  template: `<mapgis-ui-borderbox4 v-bind="$props" style="width:600px; height:300px">
    </mapgis-ui-borderbox4>`,
});

export const 边框4 = Template.bind({});
边框4.args = {
  reverse: false,
};

export const 边框4反向 = Template.bind({});
边框4反向.args = {
  reverse: true,
};
