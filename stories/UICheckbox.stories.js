import MapgisUiCheckbox from "../ui/src/components/checkbox/Checkbox.vue";

export default {
  title: "界面/多选框",
  component: MapgisUiCheckbox,
  argTypes: {},
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiCheckbox },
  data() {
    return {};
  },
  template: `<mapgis-ui-checkbox>
      Checkbox
    </mapgis-ui-checkbox>`,
});

export const Checkbox = Template.bind({});
Checkbox.args = {};
