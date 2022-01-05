import MapgisUiDecoration12 from "../../../ui/src/components/decoration/Decoration12.vue";

export default {
  title: "界面/科技风/装饰12",
  component: MapgisUiDecoration12,
  argTypes: {
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiDecoration12 },

  template: `<mapgis-ui-decoration12 v-bind="$props" style="width:150px; height:150px; background:#282c34;">
    </mapgis-ui-decoration12>`,
});

export const 装饰12 = Template.bind({});
装饰12.args = {

};
