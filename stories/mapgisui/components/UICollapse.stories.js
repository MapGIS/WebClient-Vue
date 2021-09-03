import MapgisUiCollapse from "../../../ui/src/components/collapse/Collapse.vue";

export default {
  title: "界面/折叠面板",
  component: MapgisUiCollapse,
  argTypes: {
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiCollapse },
  data() {
    return {
      text: `A dog is a type of domesticated animal.Known for its loyalty and faithfulness,it can be found as a welcome guest in many households across the world.`
    };
  },
  methods: {
  },
  template: `
  <mapgis-ui-collapse>
    <mapgis-ui-collapse-panel key="1" header="This is panel header 1">
      <p>{{ text }}</p>
    </mapgis-ui-collapse-panel>
    <mapgis-ui-collapse-panel key="2" header="This is panel header 2" :disabled="false">
      <p>{{ text }}</p>
    </mapgis-ui-collapse-panel>
    <mapgis-ui-collapse-panel key="3" header="This is panel header 3" disabled>
      <p>{{ text }}</p>
    </mapgis-ui-collapse-panel>
  </mapgis-ui-collapse>
  `,
});

export const Collapse = Template.bind({});
Collapse.args = {};

const Template2 = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiCollapse },
  data() {
    return {
      text: `A dog is a type of domesticated animal.Known for its loyalty and faithfulness,it can be found as a welcome guest in many households across the world.`
    };
  },
  methods: {
  },
  template: `
  <mapgis-ui-collapse default-active-key="1">
    <mapgis-ui-collapse-panel key="1" header="This is panel header with arrow icon">
      <p>{{ text }}</p>
    </mapgis-ui-collapse-panel>
    <mapgis-ui-collapse-panel
      key="2"
      header="This is panel header with no arrow icon"
      :show-arrow="false"
    >
      <p>{{ text }}</p>
    </mapgis-ui-collapse-panel>
  </mapgis-ui-collapse>
  `,
});

export const HideArrow = Template2.bind({});
HideArrow.args = {};
