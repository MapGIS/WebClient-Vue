import MapgisUiBorderbox10 from "../../../ui/src/components/svgborder/Borderbox10.vue";

export default {
  title: "界面/科技风/边框10",
  component: MapgisUiBorderbox10,
  argTypes: {},
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiBorderbox10 },

  template: `<mapgis-ui-borderbox10 v-bind="$props" style="width:600px; height:300px; background: #000;">
    </mapgis-ui-borderbox10>`,
});

export const 边框10 = Template.bind({});
边框10.args = {};
