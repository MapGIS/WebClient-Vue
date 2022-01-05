import MapgisUiBorderbox6 from "../../../ui/src/components/svgborder/Borderbox6.vue";

export default {
  title: "界面/科技风/边框6",
  component: MapgisUiBorderbox6,
  argTypes: {},
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiBorderbox6 },

  template: `<mapgis-ui-borderbox6 v-bind="$props" style="width:600px; height:300px; background: #000;">
    </mapgis-ui-borderbox6>`,
});

export const 边框6 = Template.bind({});
边框6.args = {};
