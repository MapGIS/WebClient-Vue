import Mapgis3dGraphThemeLayer from "../../cesium/src/components/Overlay/themeLayer/GraphThemeLayer.vue";
import Markdown from "../../cesium/docs/api/Overlay/GraphThemeLayer.md";
import axios from "axios";

export default {
  title: "三维/可视化/专题图/统计",
  component: Mapgis3dGraphThemeLayer,
  argTypes: {
    type: {
      description: "类型",
      table: {
        defaultValue: {
          summary: "HorizontalColumn",
        },
      },
      control: {
        type: "select",
        options: ["HorizontalColumn", "Pie", "VerticalColumn"],
      },
    },
    attributeName: {
      description: "用于显示的属性名（统计字段）",
      table: {
        defaultValue: {
          summary: "['GDP_2007', 'GDP_2008']",
        },
      },
      control: {
        type: "array",
      },
    },
    attributeColor: {
      description: "各个属性对应的颜色",
      table: {
        defaultValue: {
          summary: "['#FFB980', '#5AB1EF']",
        },
      },
      control: {
        type: "array",
      },
    },
    width: {
      description: "显示柱状体或饼状的宽度",
      table: {
        defaultValue: {
          summary: "50000",
        },
      },
      control: {
        type: "text",
      },
    },
    addExtrudedHeight: {
      description: "是否为饼状体添加高度",
      table: {
        defaultValue: {
          summary: "true",
        },
      },
      control: {
        type: "boolean",
      },
    },
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  watch: {
    geojson: {
      deep: true,
      handler() {
        this.geojsonCopy = JSON.parse(JSON.stringify(this.geojson));
      },
    },
  },
  mounted() {
    this.initData();
  },
  data() {
    return {
      geojsonCopy: {},
      graphThemeLayer: undefined,
    };
  },
  methods: {
    async initData() {
      const vm = this;
      this.geojsonCopy = {};
      let result = await axios.get("./geojson/省级行政区x.geojson");
      const { data } = result;
      vm.geojsonCopy = { ...data };
      if (vm.graphThemeLayer) {
        vm.graphThemeLayer.addGraphLayer();
      }
    },
    load(graphThemeLayer) {
      this.graphThemeLayer = graphThemeLayer;
      this.initData();
    },
    click(feature) {
      console.log('clickfeature',feature.id.feature);

    },
    hover(feature) {
      // console.log('hover',feature);
    },
  },
  template: `
      <mapgis-web-scene :style="{height: '95vh'}">
        <mapgis-3d-graph-theme-layer v-if="geojsonCopy" :geojson="geojsonCopy" :type="type" 
        :attributeName="attributeName" 
        :attributeColor="attributeColor"
        :width="width" 
        :heightScale="heightScale"
        :addExtrudedHeight="addExtrudedHeight" 
        :textFont="textFont"
        :textColor="textColor" 
        :textHeightOffset="textHeightOffset"
        :textScale="textScale"
        @click="click"
        @hover="hover"
        @load="load"/>
        <mapgis-3d-statebar />
      </mapgis-web-scene>
    `,
});

export const 统计 = Template.bind({});
统计.args = {
  geojson: {},
  type: "HorizontalColumn",
  attributeName: ["GDP_2007", "GDP_2008"],
  attributeColor: ["#FFB980", "#5AB1EF"],
  width: 50000,
  heightScale: 1,
  addExtrudedHeight: true,
  textFont: "50px Helvetica",
  textColor: "#008000",
  textHeightOffset: 10000,
  textScale: {
    near: 0,
    nearValue: 1,
    far: 5000000,
    farValue: 0
  }
};
统计.parameters = {
  docs: {
    description: {
      component: Markdown,
    },
  },
};
