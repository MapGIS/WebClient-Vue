import MapgisUiDecoration4 from "../../../ui/src/components/decoration/Decoration4.vue";

export default {
  title: "界面/科技风/装饰4",
  component: MapgisUiDecoration4,
  argTypes: {
    reverse: false,
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiDecoration4 },

  template: `<mapgis-ui-decoration4 v-bind="$props" style="width:200px;height:200px; background:#282c34;">
    </mapgis-ui-decoration4>`,
});

export const 装饰4 = Template.bind({});
装饰4.args = {
  reverse: false,
};

export const 装饰4反向 = Template.bind({});
装饰4反向.args = {
  reverse: true,
};
