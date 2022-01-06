import MapgisUiBorderbox7 from "../../../ui/src/components/svgborder/Borderbox7.vue";

export default {
  title: "界面/科技风/边框7",
  component: MapgisUiBorderbox7,
  argTypes: {},
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiBorderbox7 },

  template: `<mapgis-ui-borderbox7 v-bind="$props" style="width:600px; height:300px; background: #000;">
    </mapgis-ui-borderbox7>`,
});

export const 边框7 = Template.bind({});
边框7.args = {};
