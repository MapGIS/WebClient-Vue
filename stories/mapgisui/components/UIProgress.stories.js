import MapgisUiProgress from "../../../ui/src/components/progress/Progress.vue";

export default {
  title: "界面/反馈/进度条",
  component: MapgisUiProgress,
  argTypes: {
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiProgress },
  data() {
    return {
    };
  },
  methods: {
  },
  template: `
  <div>
    <mapgis-ui-progress :percent="30" />
    <mapgis-ui-progress :percent="50" status="active" />
    <mapgis-ui-progress :percent="70" status="exception" />
    <mapgis-ui-progress :percent="100" />
    <mapgis-ui-progress :percent="50" :show-info="false" />
  </div>
  `,
});

export const Progress = Template.bind({});
Progress.args = {};

const Template2 = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiProgress },
  data() {
    return {
      percent: 0,
    };
  },
  methods: {
    increase() {
      let percent = this.percent + 10;
      if (percent > 100) {
        percent = 100;
      }
      this.percent = percent;
    },
    decline() {
      let percent = this.percent - 10;
      if (percent < 0) {
        percent = 0;
      }
      this.percent = percent;
    },
  },
  template: `
  <div>
    <mapgis-ui-progress type="circle" :percent="percent" />
    <mapgis-ui-button-group>
      <mapgis-ui-button icon="minus" @click="decline" />
      <mapgis-ui-button icon="plus" @click="increase" />
    </mapgis-ui-button-group>
  </div>
  `,
});

export const CircleProgress = Template2.bind({});
CircleProgress.args = {};
