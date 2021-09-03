import MapgisUiSteps from "../../../ui/src/components/steps/Steps.vue";

export default {
  title: "界面/步骤条",
  component: MapgisUiSteps,
  argTypes: {},
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiSteps },
  data() {
    return {
      current: 0,
    };
  },
  template: `<mapgis-ui-steps :current="current">
    <mapgis-ui-step>
      <!-- <span slot="title">Finished</span> -->
      <template slot="title">
        Finished
      </template>
      <span slot="description">This is a description.</span>
    </mapgis-ui-step>
    <mapgis-ui-step title="In Progress" sub-title="Left 00:00:08" description="This is a description." />
    <mapgis-ui-step title="Waiting" description="This is a description." />
  </mapgis-ui-steps>`,
});

export const 基本 = Template.bind({});
基本.args = {};

const Template2 = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiSteps },
  template: `<mapgis-ui-steps direction="vertical" :current="1">
  <mapgis-ui-step title="Finished" description="This is a description." />
  <mapgis-ui-step title="In Progress" description="This is a description." />
  <mapgis-ui-step title="Waiting" description="This is a description." />
</mapgis-ui-steps>`,
});

export const 垂直 = Template2.bind({});
垂直.args = {};

const Template3 = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiSteps },
  data() {
    return {
      current: 0,
      stepStyle: {
        marginBottom: "60px",
        boxShadow: "0px -1px 0 0 #e8e8e8 inset",
      },
    };
  },
  template: `<div>
    <mapgis-ui-steps v-model="current" type="navigation" size="small" :style="stepStyle">
      <mapgis-ui-step
        title="Step 1"
        sub-title="00:00:05"
        status="finish"
        description="This is a description."
      />
      <mapgis-ui-step
        title="Step 2"
        sub-title="00:01:02"
        status="process"
        description="This is a description."
      />
      <mapgis-ui-step
        title="Step 3"
        sub-title="waiting for longlong time"
        status="wait"
        description="This is a description."
      />
      </mapgis-ui-steps>
      <mapgis-ui-steps v-model="current" type="navigation" :style="stepStyle">
        <mapgis-ui-step status="finish" title="Step 1" />
        <mapgis-ui-step status="process" title="Step 2" />
        <mapgis-ui-step status="wait" title="Step 3" />
        <mapgis-ui-step status="wait" title="Step 4" />
      </mapgis-ui-steps>
      <mapgis-ui-steps v-model="current" type="navigation" size="small" :style="stepStyle">
        <mapgis-ui-step status="finish" title="finish 1" />
        <mapgis-ui-step status="finish" title="finish 2" />
        <mapgis-ui-step status="process" title="current process" />
        <mapgis-ui-step status="wait" title="wait" disabled />
      </mapgis-ui-steps>
    </div>`,
});

export const 导航步骤 = Template3.bind({});
导航步骤.args = {};
