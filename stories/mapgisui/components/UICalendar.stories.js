import MapgisUiCalendar from "../../../ui/src/components/calendar/Calendar.vue";

export default {
  title: "界面/数据显示/日历",
  component: MapgisUiCalendar,
  argTypes: {
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiCalendar },
  data() {
    return {
    };
  },
  methods: {
    onPanelChange(value, mode) {
      console.log(value, mode);
    },
  },
  template: `
  <div :style="{ width: '300px', border: '1px solid #d9d9d9', borderRadius: '4px' }">
    <mapgis-ui-calendar :fullscreen="false" @panelChange="onPanelChange" />
  </div>
  `,
});

export const Calendar = Template.bind({});
Calendar.args = {};
