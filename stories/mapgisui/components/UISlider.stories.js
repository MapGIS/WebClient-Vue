import MapgisUiSlider from "../../../ui/src/components/slider/Slider.vue";

export default {
  title: "界面/滑动",
  component: MapgisUiSlider,
  argTypes: {
    "default-value": 30,
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiSlider },
  data() {
    return {
      value: 0,
    };
  },
  template: `<mapgis-ui-slider v-model="value" style="width: 120px;height:40px;">
    </mapgis-ui-slider>`,
});

export const Slider = Template.bind({});
Slider.args = {
  "default-value": 30,
};
