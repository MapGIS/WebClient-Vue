import MapgisUiDecoration2 from "../../../ui/src/components/decoration/Decoration2.vue";

export default {
  title: "界面/科技风/装饰2",
  component: MapgisUiDecoration2,
  argTypes: {
    reverse: false,
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiDecoration2 },

  template: `<mapgis-ui-decoration2 v-bind="$props" style="width:200px; height:200px; background:#282c34;">
    </mapgis-ui-decoration2>`,
});

export const 装饰2 = Template.bind({});
装饰2.args = {
  reverse: false,
};

export const 装饰2反向 = Template.bind({});
装饰2反向.args = {
  reverse: true,
};
