import MapgisUiRowFlex from "../../../ui/src/components/grid/RowFlex.vue";

export default {
  title: "界面/布局/弹性行",
  component: MapgisUiRowFlex,
  argTypes: {
    type: "horizontal",
    label: "标题",
    labelWidth: 120,
    labelAlign: "left",
    contentAlign: "left",
    align: "middle",
    justify: "start",
    gutter: 0,
    span: [5, 19],
    colon: true,
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiRowFlex },
  data() {
    return {
      value: 0,
    };
  },
  template: `
    <mapgis-ui-row-flex v-bind="$props">
      <mapgis-ui-input v-mode="value" />
    </mapgis-ui-row-flex>
  `,
});

export const 基础使用 = Template.bind({});
基础使用.args = {
  type: "horizontal",
  label: "标题",
  labelWidth: 120,
  labelAlign: "left",
  contentAlign: "left",
  align: "middle",
  justify: "start",
  gutter: 0,
  span: [5, 19],
  colon: true,
};

export const 竖直方向 = Template.bind({});
竖直方向.args = {
  type: "vertical",
  label: "标题",
  /* labelWidth: 240, */
  labelAlign: "left",
  contentAlign: "left",
  align: "bottom",
  justify: "center",
  gutter: 20,
  span: [5, 19],
  colon: true,
};
