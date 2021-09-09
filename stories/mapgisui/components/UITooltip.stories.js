import MapgisUiTooltip from "../../../ui/src/components/tooltip/Tooltip.vue";

export default {
  title: "界面/数据显示/文字提示",
  component: MapgisUiTooltip,
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
