import MapgisUiBorder from "../../../ui/src/components/border/Border.vue";

export default {
  title: "界面/其他/边框",
  component: MapgisUiBorder,
  argTypes: {
    type: "border1",
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiBorder },
  template: `<mapgis-ui-border v-bind="$props" style="width:400px; height:300px">
    </mapgis-ui-border>`,
});

export const Border = Template.bind({});
Border.args = {
  type: "border1",
};
