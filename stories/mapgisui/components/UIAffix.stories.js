import MapgisUiAffix from "../../../ui/src/components/affix/Affix.vue";
// import MarkDown from "../../../ui/docs/guide/base.md";

export default {
  title: "界面/固钉",
  component: MapgisUiAffix,
  argTypes: {
    offsetTop: 10,
    offsetBottom: 10,
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiAffix },
  data() {
    return {
      value: 0,
    };
  },
  template: `<div style="height:400px;">
    <mapgis-ui-affix v-bind="$props">
      <button type="primary" @click="top += 10">
        固定位置
      </button>
    </mapgis-ui-affix>
  </div>`,
});

export const Slider = Template.bind({});
Slider.args = {
  offsetTop: 10,
  offsetBottom: 10,
};

// Slider.parameters = {
//   docs: {
//     description: {
//       component: MarkDown,
//     },
//   },
// };
