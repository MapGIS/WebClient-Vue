import MapgisUiDatePicker from "../../../ui/src/components/date-picker/DatePicker.vue";

export default {
  title: "界面/空模板使用（忽略）",
  component: MapgisUiDatePicker,
  argTypes: {
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
  components: { MapgisUiDatePicker },
  data() {
    return {
    };
  },
  methods: {
  },
  template: `
  
  `,
});

export const BasicDatePicker = Template.bind({});
BasicDatePicker.args = {};
