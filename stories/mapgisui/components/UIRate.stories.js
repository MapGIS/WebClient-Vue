import MapgisUiRate from "../../../ui/src/components/rate/Rate.vue";

export default {
  title: "界面/数据输入/评分",
  component: MapgisUiRate,
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
  components: { MapgisUiRate },
  data() {
    return {
    };
  },
  methods: {
  },
  template: `
  <mapgis-ui-rate :default-value="2.5" allow-half />
  `,
});

export const Rate = Template.bind({});
Rate.args = {};
