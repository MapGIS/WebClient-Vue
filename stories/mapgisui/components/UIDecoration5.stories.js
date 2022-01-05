import MapgisUiDecoration5 from "../../../ui/src/components/decoration/Decoration5.vue";

export default {
  title: "界面/科技风/装饰5",
  component: MapgisUiDecoration5,
  argTypes: {
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiDecoration5 },

  template: `<mapgis-ui-decoration5 v-bind="$props" style="width:300px; height:40px; background:#282c34;">
    </mapgis-ui-decoration5>`,
});

export const 装饰5 = Template.bind({});
装饰5.args = {

};
