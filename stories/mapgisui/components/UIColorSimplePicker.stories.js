import MapgisUiColorSimplePicker from "../../../ui/src/components/color/ColorSimple.vue";

export default {
  title: "界面/颜色/简单选择",
  component: MapgisUiColorSimplePicker,
  argTypes: {
    change: { table: { disable: true } },
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiColorSimplePicker },
  data() {
    return {
    };
  },
  methods: {
    handleChange (value) {
      console.warn('【当前this】', this)
      console.warn('【当前选择颜色】', value.color)
      console.warn('【颜色列表】', value.colors)
    }
  },
  template: `
  <mapgs-ui-color-simple-picker @change="handleChange" :colors="colors"/>
  `,
});

export const 简单选择 = Template.bind({});
简单选择.args = {
  colors: [
    "#f5222d",
    "#fa541c",
    "#fa8c16",
    "#faad14",
    "#fadb14",
    "#a0d911",
    "#52c41a",
    "#13c2c2",
    "#1890ff",
    "#2f54eb",
    "#722ed1",
    "#eb2f96"
  ]
};
