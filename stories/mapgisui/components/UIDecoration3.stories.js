import MapgisUiDecoration3 from "../../../ui/src/components/decoration/Decoration3.vue";

export default {
  title: "界面/科技风/装饰3",
  component: MapgisUiDecoration3,
  argTypes: {
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiDecoration3 },

  template: `<mapgis-ui-decoration3 v-bind="$props" style="width:300px; height:30px; background:#282c34;">
    </mapgis-ui-decoration3>`,
});

export const 装饰3 = Template.bind({});
装饰3.args = {

};
