import MapgisUiTabs from "../../../ui/src/components/tabs/Tabs.vue";

export default {
  title: "界面/数据显示/标签页",
  component: MapgisUiTabs,
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
      <mapgis-ui-tab-pane key="1" tab="标题内容">
        Content of Tab Pane 1
      </mapgis-ui-tab-pane>
      <mapgis-ui-tab-pane key="2" tab="标题内容2" force-render>
        Content of Tab Pane 2
      </mapgis-ui-tab-pane>
      <mapgis-ui-tab-pane key="3" tab="标题内容3">
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
  <div>
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

const Template3 = (args, { argTypes }) => ({
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
    <mapgis-ui-tabs type="card">
      <mapgis-ui-tab-pane key="1" tab="可选页签1">
        Content of Tab Pane 1
      </mapgis-ui-tab-pane>
      <mapgis-ui-tab-pane key="2" tab="可选页签2">
        Content of Tab Pane 2
      </mapgis-ui-tab-pane>
      <mapgis-ui-tab-pane key="3" tab="可选页签3">
        Content of Tab Pane 3
      </mapgis-ui-tab-pane>
    </mapgis-ui-tabs>
  </div>
  `,
});

export const CardTabs = Template3.bind({});
CardTabs.args = {};