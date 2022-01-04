import MapgisUiBorderbox5 from "../../../ui/src/components/svgborder/Borderbox5.vue";

export default {
  title: "界面/科技风/边框5",
  component: MapgisUiBorderbox5,
  argTypes: {},
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiBorderbox5 },

  template: `<mapgis-ui-borderbox5 v-bind="$props" style="width:600px; height:300px; background: #000;">
    </mapgis-ui-borderbox5>`,
});

export const 边框5 = Template.bind({});
边框5.args = {};
