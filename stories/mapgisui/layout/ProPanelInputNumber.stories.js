import { setTheme } from "../../../ui/src/util/style/theme/set-theme";
import MapgisUiInputNumberPanel from "../../../ui/src/layout/panel/InputNumberPanel.vue";
import Markdown from "../../../ui/docs/api/panel/inputnumber.md";

export default {
  title: "界面/Pro/面板/数值面板",
  component: MapgisUiInputNumberPanel,
  argTypes: {
    label: "多行样式",
    range: [0, 10],
    tooltip: '',
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiInputNumberPanel },
  data() {
    return {
      value: 0,
      cloudsduration: 0,
    };
  },
  mounted() {
    /* setTheme("technology"); */
  },
  template: `<div>
      <mapgis-ui-input-number-panel v-bind="$props" size="medium">
      </mapgis-ui-input-number-panel>
      <br>
      <mapgis-ui-input-number-panel tooltip="这是提示">
      </mapgis-ui-input-number-panel>
      <br>
      <mapgis-ui-input-number-panel size="small" label="持续时间（毫秒）">
      </mapgis-ui-input-number-panel>
  </div>`,
});

export const 数值面板 = Template.bind({});
数值面板.args = { range: [0, 10], step: 1 };

数值面板.parameters = {
  docs: {
      description: {
          component: Markdown,
      },
  },
};
