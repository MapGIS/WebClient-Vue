import MapgisUiBorderbox12 from "../../../ui/src/components/svgborder/Borderbox12.vue";

export default {
  title: "界面/科技风/边框12",
  component: MapgisUiBorderbox12,
  argTypes: {},
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiBorderbox12 },

  template: `<mapgis-ui-borderbox12 v-bind="$props" style="width:600px; height:300px; background: #000;">
    </mapgis-ui-borderbox12>`,
});

export const 边框12 = Template.bind({});
边框12.args = {};
