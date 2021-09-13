import MapgisUiButtonTooltip from "../../../ui/src/components/button/ButtonTooltip.vue";
import MarkDown from "../../../ui/docs/api/button/Button.md";
import Direction from "../../assets/direction.svg";

export default {
  title: "界面/通用/提示按钮",
  component: MapgisUiButtonTooltip,
  argTypes: {
    label: "一张图文字",
    zIndex: 2000,
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiButtonTooltip },
  data() {
    return {
      svg: Direction,
    };
  },
  methods: {},
  template: `
    <mapgis-ui-button-tooltip v-bind="$props" :icon="svg">
    </mapgis-ui-button-tooltip>
  `,
});

export const 提示按钮 = Template.bind({});

提示按钮.args = {
  label: "一张图文字",
  zIndex: 2000,
};

提示按钮.parameters = {
  docs: {
    description: {
      component: MarkDown,
    },
  },
};
