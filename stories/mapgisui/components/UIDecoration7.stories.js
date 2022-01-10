import MapgisUiDecoration7 from "../../../ui/src/components/decoration/Decoration7.vue";

export default {
  title: "界面/科技风/装饰7",
  component: MapgisUiDecoration7,
  argTypes: {
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiDecoration7 },

  template: `<mapgis-ui-decoration7 v-bind="$props" style="width:150px; height:30px; background:#282c34;">
      装饰器文字描述
    </mapgis-ui-decoration7>`,
});

export const 装饰7 = Template.bind({});
装饰7.args = {

};
