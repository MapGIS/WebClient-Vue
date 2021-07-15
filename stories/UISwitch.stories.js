import MapgisUiSwitch from "../ui/src/components/switch/Switch.vue";

export default {
  title: "界面/开关",
  component: MapgisUiSwitch,
  argTypes: {
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiSwitch },
  data() {
    return {
      disabled: true
    };
  },
  methods: {
    onToggle() {
      this.disabled = !this.disabled;
    }
  },
  template: `
  <div>
    <mapgis-ui-switch default-checked :disabled="disabled" style="margin-bottom:5px" />
    <br />
    <mapgis-ui-button type="primary" v-on:click="onToggle">
      Toggle disabled
    </mapgis-ui-button>
  </div>
  `,
});

export const Switch = Template.bind({});
Switch.args = {};

const Template2 = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiSwitch },
  data() {
    return {
    };
  },
  methods: {
  },
  template: `
  <div>
    <mapgis-ui-switch loading default-checked />
    <br />
    <mapgis-ui-switch size="small" loading />
  </div>
  `,
});

export const LoadingSwitch = Template2.bind({});
LoadingSwitch.args = {};