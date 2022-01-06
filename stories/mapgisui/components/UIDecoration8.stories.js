import MapgisUiDecoration8 from "../../../ui/src/components/decoration/Decoration8.vue";

export default {
  title: "界面/科技风/装饰8",
  component: MapgisUiDecoration8,
  argTypes: {
    reverse: false,
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiDecoration8 },

  template: `<mapgis-ui-decoration8 v-bind="$props" style="width:300px; height:50px; background:#282c34;">
    </mapgis-ui-decoration8>`,
});

export const 装饰8 = Template.bind({});
装饰8.args = {
  reverse: false,
};

export const 装饰8反向 = Template.bind({});
装饰8反向.args = {
  reverse: true,
};
