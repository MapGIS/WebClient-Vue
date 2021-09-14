import MapgisUiTooltipButton from "../../../ui/src/components/button/TooltipButton.vue";
import MarkDown from "../../../ui/docs/api/button/Button.md";
import Direction from "../../assets/direction.svg";

export default {
  title: "界面/通用/提示按钮",
  component: MapgisUiTooltipButton,
  argTypes: {
    label: "一张图文字",
    zIndex: 2000,
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiTooltipButton },
  data() {
    return {
      svg: Direction,
    };
  },
  methods: {},
  template: `
    <mapgis-ui-tooltip-button v-bind="$props" :icon="svg">
    </mapgis-ui-tooltip-button>
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
