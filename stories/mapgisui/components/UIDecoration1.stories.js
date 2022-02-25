import MapgisUiDecoration1 from "../../../ui/src/components/decoration/Decoration1.vue";

export default {
  title: "界面/科技风/装饰1",
  component: MapgisUiDecoration1,
  argTypes: {
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiDecoration1 },

  template: `<mapgis-ui-decoration1 v-bind="$props" style="width:200px; height:50px; background:#282c34;">
    </mapgis-ui-decoration1>`,
});

export const 装饰1 = Template.bind({});
装饰1.args = {

};
