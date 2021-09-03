import MapgisUiDatePicker from "../../../ui/src/components/date-picker/DatePicker.vue";
import moment from 'moment';

export default {
  title: "界面/数据输入/日期选择框",
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
  <div>
    <mapgis-ui-date-picker />
    <br />
    <mapgis-ui-month-picker style="margin:10px 0" placeholder="Select month" />
    <br />
    <mapgis-ui-range-picker style="margin-bottom:10px"  />
    <br />
    <mapgis-ui-week-picker placeholder="Select week" />
  </div>
  `,
});

export const DatePicker = Template.bind({});
DatePicker.args = {};

const Template2 = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiDatePicker },
  data() {
    return {
    };
  },
  methods: {
    moment,
    range(start, end) {
      const result = [];
      for (let i = start; i < end; i++) {
        result.push(i);
      }
      return result;
    },
    disabledDate(current) {
      // Can not select days before today and today
      return current && current < moment().endOf('day');
    },
    disabledDateTime() {
      return {
        disabledHours: () => this.range(0, 24).splice(4, 20),
        disabledMinutes: () => this.range(30, 60),
        disabledSeconds: () => [55, 56]
      };
    },
    disabledRangeTime(_, type) {
      if (type === 'start') {
        return {
          disabledHours: () => this.range(0, 60).splice(4, 20),
          disabledMinutes: () => this.range(30, 60),
          disabledSeconds: () => [55, 56]
        };
      }
      return {
        disabledHours: () => this.range(0, 60).splice(20, 4),
        disabledMinutes: () => this.range(0, 31),
        disabledSeconds: () => [55, 56]
      };
    }
  },
  template: `
  <div>
    <mapgis-ui-date-picker
      format="YYYY-MM-DD HH:mm:ss"
      :disabled-date="disabledDate"
      :disabled-time="disabledDateTime"
      :show-time="{ defaultValue: moment('00:00:00', 'HH:mm:ss') }"
    />
    <br />
    <mapgis-ui-month-picker style="margin:10px 0" :disabled-date="disabledDate" placeholder="Select month" />
    <br />
    <mapgis-ui-range-picker
      :disabled-date="disabledDate"
      :disabled-time="disabledRangeTime"
      :show-time="{
        hideDisabledOptions: true,
        defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
      }"
      format="YYYY-MM-DD HH:mm:ss"
    />
  </div>
  `,
});

export const DisabledDatePicker = Template2.bind({});
DisabledDatePicker.args = {};

const Template3 = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiDatePicker },
  data() {
    return {
      mode1: 'time',
      mode2: ['month', 'month'],
      value: []
    };
  },
  methods: {
    handleOpenChange1(open) {
      if (open) {
        this.mode1 = 'time';
      }
    },
    handleChange(value) {
      this.value = value;
    },
    handlePanelChange1(value, mode) {
      this.mode1 = mode;
    },
    handlePanelChange2(value, mode) {
      this.value = value;
      this.mode2 = [mode[0] === 'date' ? 'month' : mode[0], mode[1] === 'date' ? 'month' : mode[1]];
    }
  },
  template: `
  <div>
    <mapgis-ui-date-picker
      :mode="mode1"
      show-time
      v-on:openChange="handleOpenChange1"
      v-on:panelChange="handlePanelChange1"
    />
    <br />
    <mapgis-ui-range-picker
      :placeholder="['Start month', 'End month']"
      format="YYYY-MM"
      :value="value"
      :mode="mode2"
      style="margin-top: 10px"
      v-on:panelChange="handlePanelChange2" 
      v-on:change="handleChange"
    />
  </div>
  `,
});

export const ControlDatePicker = Template3.bind({});
ControlDatePicker.args = {};

const Template4 = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiDatePicker },
  data() {
    return {
      size: 'default'
    };
  },
  methods: {
  },
  template: `
  <div>
    <mapgis-ui-radio-group v-model="size">
      <mapgis-ui-radio-button value="large">
        Large
      </mapgis-ui-radio-button>
      <mapgis-ui-radio-button value="default">
        Default
      </mapgis-ui-radio-button>
      <mapgis-ui-radio-button value="small">
        Small
      </mapgis-ui-radio-button>
    </mapgis-ui-radio-group>
    <br /><br />
    <mapgis-ui-date-picker :size="size" />
    <br />
    <mapgis-ui-month-picker :size="size" style="margin: 10px 0" placeholder="Select Month" />
    <br />
    <mapgis-ui-range-picker :size="size" style="margin-bottom: 10px"/>
    <br />
    <mapgis-ui-week-picker :size="size" placeholder="Select Week" />
  </div>
  `,
});

export const SizeDatePicker = Template4.bind({});
SizeDatePicker.args = {};