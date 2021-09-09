import MapgisUiSlider from "../../../ui/src/components/slider/Slider.vue";

export default {
  title: "界面/数据输入/滑动输入条",
  component: MapgisUiSlider,
  argTypes: {
    defaultValue: 30,
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
  components: { MapgisUiSlider },
  data() {
    return {
      // value: 0,
    };
  },
  template: `<mapgis-ui-slider :default-value="defaultValue" style="width: 120px;height:40px;">
    </mapgis-ui-slider>`,
});

export const Slider = Template.bind({});
Slider.args = {
  defaultValue: 30,
};
