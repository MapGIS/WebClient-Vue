import MapgisUiBorderbox3 from "../../../ui/src/components/svgborder/Borderbox3.vue";

export default {
  title: "界面/科技风/边框3",
  component: MapgisUiBorderbox3,
  argTypes: {},
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiBorderbox3 },

  template: `<mapgis-ui-borderbox3 v-bind="$props" style="width:600px; height:300px">
    </mapgis-ui-borderbox3>`,
});

export const 边框3 = Template.bind({});
边框3.args = {};
