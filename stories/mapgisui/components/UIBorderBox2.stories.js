import MapgisUiBorderbox2 from "../../../ui/src/components/svgborder/Borderbox2.vue";

export default {
  title: "界面/科技风/边框2",
  component: MapgisUiBorderbox2,
  argTypes: {},
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiBorderbox2 },

  template: `<mapgis-ui-borderbox2 v-bind="$props" style="width:600px; height:300px; background: #000;">
    </mapgis-ui-borderbox2>`,
});

export const 边框2 = Template.bind({});
边框2.args = {};
