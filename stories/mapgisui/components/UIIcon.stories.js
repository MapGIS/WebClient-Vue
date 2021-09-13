import MapgisUiIcon from "../../../ui/src/components/iconfont/IconSvgImg.vue";
import MarkDown from "../../../ui/docs/api/iconfont/iconsvgimg.md";
import Direction from "../../assets/direction.svg";
import Png from "../../assets/svg_global_select.png";

export default {
  title: "界面/通用/图标",
  component: MapgisUiIcon,
  argTypes: {},
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiIcon },
  data() {
    return {
      svg: Direction,
    };
  },
  methods: {},
  template: `
    <mapgis-ui-icon :icon="svg">
    </mapgis-ui-icon>
  `,
});

export const SVG = Template.bind({});
SVG.args = {};
SVG.parameters = {
  docs: {
    description: {
      component: MarkDown,
    },
  },
};

const TemplateImage = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiIcon },
  data() {
    return {
      png: Png,
    };
  },
  methods: {},
  template: `
    <mapgis-ui-icon :icon="png">
    </mapgis-ui-icon>
  `,
});

export const 图片 = TemplateImage.bind({});
图片.args = {};
图片.parameters = {
  docs: {
    description: {
      component: MarkDown,
    },
  },
};
