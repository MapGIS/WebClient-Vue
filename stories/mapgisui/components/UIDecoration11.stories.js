import MapgisUiDecoration11 from "../../../ui/src/components/decoration/Decoration11.vue";

export default {
  title: "界面/科技风/装饰11",
  component: MapgisUiDecoration11,
  argTypes: {
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiDecoration11 },

  template: `<mapgis-ui-decoration11 v-bind="$props" style="width:200px; height:60px; background:#282c34;">
      自定义标题
    </mapgis-ui-decoration11>`,
});

export const 装饰11 = Template.bind({});
装饰11.args = {

};
