import MapgisUiD3ColorPicker from "../../../ui/src/components/color-picker/D3ColorPicker.vue";
import Markdown from "../../../ui/docs/api/color/d3color.md";

export default {
  title: "界面/颜色/D3色板",
  component: MapgisUiD3ColorPicker,
  argTypes: {
    type: "interpolates",
    size: "small",
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiD3ColorPicker },
  data() {
    return {};
  },
  methods: {
    handleChange(color) {
      console.warn("【当前色板】", color);
    },
  },
  template: `
  <mapgis-ui-d3-colorpick @change="handleChange" v-bind="$props"/>
  `,
});

export const 插值色板 = Template.bind({});
插值色板.args = {
  type: "interpolates",
  size: "small",
};

插值色板.parameters = {
  docs: {
    description: {
      component: Markdown,
    },
  },
};

export const 分段色板 = Template.bind({});
分段色板.args = {
  type: "schemes",
  size: "small",
};

分段色板.parameters = {
  docs: {
    description: {
      component: Markdown,
    },
  },
};
