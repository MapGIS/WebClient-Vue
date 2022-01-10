import MapgisUiBorderbox9 from "../../../ui/src/components/svgborder/Borderbox9.vue";

export default {
  title: "界面/科技风/边框9",
  component: MapgisUiBorderbox9,
  argTypes: {},
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiBorderbox9 },

  template: `<mapgis-ui-borderbox9 v-bind="$props" style="width:600px; height:300px; background: #000;">
    </mapgis-ui-borderbox9>`,
});

export const 边框9 = Template.bind({});
边框9.args = {};
