import MapgisUiDrawer from "../ui/src/components/drawer/Drawer.vue";

export default {
  title: "界面/抽屉",
  component: MapgisUiDrawer,
  argTypes: {
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiDrawer },
  data() {
    return {
      visible: false,
    };
  },
  methods: {
    afterVisibleChange(val) {
      console.log('visible', val);
    },
    showDrawer() {
      this.visible = true;
    },
    onClose() {
      this.visible = false;
    },
  },
  template: `
  <div>
    <mapgis-ui-button type="primary" @click="showDrawer">
      Open
    </mapgis-ui-button>
    <mapgis-ui-drawer
      title="Basic Drawer"
      placement="right"
      :closable="false"
      :visible="visible"
      :after-visible-change="afterVisibleChange"
      @close="onClose"
    >
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </mapgis-ui-drawer>
  </div>
  `,
});

export const Drawer = Template.bind({});
Drawer.args = {};
