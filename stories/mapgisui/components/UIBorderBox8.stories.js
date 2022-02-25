import MapgisUiBorderbox8 from "../../../ui/src/components/svgborder/Borderbox8.vue";

export default {
  title: "界面/科技风/边框8",
  component: MapgisUiBorderbox8,
  argTypes: {
    reverse: false,
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiBorderbox8 },

  template: `<mapgis-ui-borderbox8 v-bind="$props" style="width:600px; height:300px; background: #000;">
    </mapgis-ui-borderbox8>`,
});

export const 边框8 = Template.bind({});
边框8.args = {
  reverse: false,
};

export const 边框8反向 = Template.bind({});
边框8反向.args = {
  reverse: true,
};
