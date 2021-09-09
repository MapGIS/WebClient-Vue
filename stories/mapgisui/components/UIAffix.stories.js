import MapgisUiAffix from "../../../ui/src/components/affix/Affix.vue";
// import MarkDown from "../../../ui/docs/guide/base.md";

export default {
  title: "界面/导航/固钉",
  component: MapgisUiAffix,
  argTypes: {
    offsetTop: 10,
    offsetBottom: 10,
    prefixCls: { table: { disable: true } },
    getPopupContainer: { table: { disable: true } },
    csp: { table: { disable: true } },
    locale: { table: { disable: true } },
    background: { table: { disable: true } },
    textColor: { table: { disable: true } },
    colorGroup: { table: { disable: true } },
    themeStyleChanged: { table: { disable: true } },
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
