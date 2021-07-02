import MapgisUiTabs from "../ui/src/components/tabs/Tabs.vue";

export default {
  title: "界面/标签页",
  component: MapgisUiTabs,
  argTypes: {
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiTabs },
  data() {
    return {
    };
  },
  methods: {
  },
  template: `
  <div>
    <mapgis-ui-tabs default-active-key="1">
      <mapgis-ui-tab-pane key="1" tab="Tab 1">
        Content of Tab Pane 1
      </mapgis-ui-tab-pane>
      <mapgis-ui-tab-pane key="2" tab="Tab 2" force-render>
        Content of Tab Pane 2
      </mapgis-ui-tab-pane>
      <mapgis-ui-tab-pane key="3" tab="Tab 3">
        Content of Tab Pane 3
      </mapgis-ui-tab-pane>
    </mapgis-ui-tabs>
  </div>
  `,
});

export const Tabs = Template.bind({});
Tabs.args = {};

const Template2 = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiTabs },
  data() {
    return {
      mode: 'top'
    };
  },
  methods: {
  },
  template: `
  <div style="width: 500px">
    <mapgis-ui-radio-group v-model="mode" :style="{ marginBottom: '8px' }">
      <mapgis-ui-radio-button value="top">
        Horizontal
      </mapgis-ui-radio-button>
      <mapgis-ui-radio-button value="left">
        Vertical
      </mapgis-ui-radio-button>
    </mapgis-ui-radio-group>
    <mapgis-ui-tabs
      default-active-key="1"
      :tab-position="mode"
      :style="{ height: '200px' }"
    >
      <mapgis-ui-tab-pane v-for="i in 30" :key="i" :tab="i"> Content of tab {{ i }} </mapgis-ui-tab-pane>
    </mapgis-ui-tabs>
  </div>
  `,
});

export const SlideTabs = Template2.bind({});
SlideTabs.args = {};