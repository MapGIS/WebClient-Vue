import MapgisUiBorderbox1 from "../../../ui/src/components/svgborder/Borderbox1.vue";

export default {
  title: "界面/科技风/边框1",
  component: MapgisUiBorderbox1,
  argTypes: {
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiBorderbox1 },

  template: `<mapgis-ui-borderbox1 v-bind="$props" style="width:600px; height:300px;background: #282c34;">
    </mapgis-ui-borderbox1>`,
});

export const 边框1 = Template.bind({});
边框1.args = {

};
