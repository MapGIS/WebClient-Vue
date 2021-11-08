import MapgisUiTimePicker from "../../../ui/src/components/time-picker/TimePicker.vue";

export default {
  title: "界面/数据输入/时间选择框",
  component: MapgisUiTimePicker,
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
  components: { MapgisUiTimePicker },
  data() {
    return {
    };
  },
  methods: {
    onChange(time, timeString) {
      console.log(time, timeString);
    },
  },
  template: `
  <div>
    <mapgis-ui-time-picker use12-hours @change="onChange" />
    <mapgis-ui-time-picker use12-hours format="h:mm:ss A" @change="onChange" />
    <mapgis-ui-time-picker use12-hours format="h:mm a" @change="onChange" />
  </div>
  `,
});

export const 基本使用 = Template.bind({});
基本使用.args = {};
