// import MapgisUiDatePicker from "../../../ui/src/components/date-picker/DatePicker.vue";
import MarkDown from "../../../ui/docs/api/iconfont/IconFont.md";

export default {
  title: "界面/通用/图标",
  // component: MapgisUiDatePicker,
  argTypes: {
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  // components: { MapgisUiDatePicker },
  data() {
    return {
    };
  },
  methods: {
  },
  template: `
  
  `,
});

export const 图标说明 = Template.bind({});
图标说明.args = {};
图标说明.parameters = {
  docs: {
    description: {
      component: MarkDown,
    },
  },
};
