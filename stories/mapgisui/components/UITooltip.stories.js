import MapgisUiTooltip from "../../../ui/src/components/tooltip/Tooltip.vue";

export default {
  title: "界面/文字提示",
  component: MapgisUiTooltip,
  argTypes: {
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiTooltip },
  data() {
    return {
    };
  },
  methods: {
  },
  template: `
  <mapgis-ui-tooltip>
    <template slot="title">
      prompt text
    </template>
    Tooltip will show when mouse enter.
  </mapgis-ui-tooltip>
  `,
});

export const Tooltip = Template.bind({});
Tooltip.args = {};
