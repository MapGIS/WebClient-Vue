import MapgisUiDecoration9 from "../../../ui/src/components/decoration/Decoration9.vue";

export default {
  title: "界面/科技风/装饰9",
  component: MapgisUiDecoration9,
  argTypes: {
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiDecoration9 },

  template: `<mapgis-ui-decoration9 v-bind="$props" style="width:150px; height:150px; background:#282c34;">
      66%
    </mapgis-ui-decoration9>`,
});

export const 装饰9 = Template.bind({});
装饰9.args = {

};
