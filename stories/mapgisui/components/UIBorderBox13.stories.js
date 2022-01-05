import MapgisUiBorderbox13 from "../../../ui/src/components/svgborder/Borderbox13.vue";

export default {
  title: "界面/科技风/边框13",
  component: MapgisUiBorderbox13,
  argTypes: {},
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiBorderbox13 },

  template: `<mapgis-ui-borderbox13 v-bind="$props" style="width:600px; height:300px; background: #000;">
    </mapgis-ui-borderbox13>`,
});

export const 边框13 = Template.bind({});
边框13.args = {};
