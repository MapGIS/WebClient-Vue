import MapgisUiDecoration10 from "../../../ui/src/components/decoration/Decoration10.vue";

export default {
  title: "界面/科技风/装饰10",
  component: MapgisUiDecoration10,
  argTypes: {
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiDecoration10 },

  template: `<mapgis-ui-decoration10 v-bind="$props" style="width:400px; height:40px; background:#282c34;">
    </mapgis-ui-decoration10>`,
});

export const 装饰10 = Template.bind({});
装饰10.args = {

};
