import MapgisUiSliderPanel from "../../../ui/src/layout/panel/SliderPanel.vue";
import Markdown from "../../../ui/docs/api/panel/tab.md";

export default {
  title: "界面/Pro/面板/滑动面板",
  component: MapgisUiSliderPanel,
  argTypes: {
    values: [],
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiSliderPanel },
  data() {
    return {
      value: 0,
      cloudsduration: 0,
    };
  },
  mounted() {},
  methods: {
    changeMenu(menu) {
      console.log("当前选中菜单:", menu);
    },
  },
  template: `<div :style="{background: '#000', padding: '10px', height: '95vh'}">
    <mapgis-ui-slider-panel v-bind="$props" @change="changeMenu">
    </mapgis-ui-slider-panel>
    <mapgis-ui-slider-panel v-bind="$props" layout="horizontal" @change="changeMenu">
    </mapgis-ui-slider-panel>
  </div>`,
});

export const 滑动面板 = Template.bind({});
滑动面板.args = {
  values: [
    {
      title: "10F",
      key: 10,
    },
    {
      title: "9F",
      key: 9,
    },
    {
      title: "8F",
      key: 8,
    },
    {
      title: "7F",
      key: 7,
    },
    {
      title: "6F",
      key: 6,
    },
    {
      title: "5F",
      key: 5,
    },
    {
      title: "4F",
      key: 4,
    },
    {
      title: "3F",
      key: 3,
    },
    {
      title: "2F",
      key: 2,
    },
    {
      title: "1F",
      key: 1,
    },
    {
      title: "-1F",
      key: 0,
    },
  ],
};

滑动面板.parameters = {
  docs: {
    description: {
      component: Markdown,
    },
  },
};
