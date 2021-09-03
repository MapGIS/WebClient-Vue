import MapgisUiDatePicker from "../../../ui/src/components/date-picker/DatePicker.vue";

export default {
  title: "界面/空模板",
  component: MapgisUiDatePicker,
  argTypes: {
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
