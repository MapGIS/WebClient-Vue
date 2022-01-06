import MapgisUiDecoration6 from "../../../ui/src/components/decoration/Decoration6.vue";

export default {
  title: "界面/科技风/装饰6",
  component: MapgisUiDecoration6,
  argTypes: {
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiDecoration6 },

  template: `<mapgis-ui-decoration6 v-bind="$props" style="width:300px; height:30px; background:#282c34;">
    </mapgis-ui-decoration6>`,
});

export const 装饰6 = Template.bind({});
装饰6.args = {

};
