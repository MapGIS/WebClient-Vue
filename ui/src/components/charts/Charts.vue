<template>
  <div
    :id="chartId"
    :ref="chartId"
    :option="echartOptions"
    :style="wrapperStyle"
  >
  </div>
</template>

<script>
import UniqueId from "lodash.uniqueid";
import theme from "./style/theme.json";
// import DefaultTheme from "./style/theme";

import * as echarts from "echarts/core";
/* import {
  init,
  use,
  registerMap,
  registerTheme,
  connect,
  disconnect
} from "echarts/core"; */
import { BarChart, PieChart } from "echarts/charts";
import {
  GridComponent,
  LegendComponent,
  TooltipComponent,
  TitleComponent
} from "echarts/components";
// 注意，新的接口中默认不再包含 Canvas 渲染器，需要显示引入，如果需要使用 SVG 渲染模式则使用 SVGRenderer
import { CanvasRenderer } from "echarts/renderers";

echarts.use([
  BarChart,
  PieChart,
  GridComponent,
  LegendComponent,
  TooltipComponent,
  TitleComponent,
  CanvasRenderer
]);

// 枚举事件类型
const ECHARTS_EVENTS = [
  "legendselectchanged",
  "legendselected",
  "legendunselected",
  "legendscroll",
  "datazoom",
  "datarangeselected",
  "timelinechanged",
  "timelineplaychanged",
  "restore",
  "dataviewchanged",
  "magictypechanged",
  "geoselectchanged",
  "geoselected",
  "geounselected",
  "pieselectchanged",
  "pieselected",
  "pieunselected",
  "mapselectchanged",
  "mapselected",
  "mapunselected",
  "axisareaselected",
  "focusnodeadjacency",
  "unfocusnodeadjacency",
  "brush",
  "brushselected",
  "rendered",
  "finished",
  "click",
  "dblclick",
  "mouseover",
  "mouseout",
  "mousemove",
  "mousedown",
  "mouseup",
  "globalout",
  "contextmenu"
];

export default {
  name: "mapgis-ui-charts",
  /*  provide: {
    [THEME_KEY]: "dark"
  }, */
  props: {
    headerTitle: {
      type: String,
      default: undefined
    },
    echartOptions: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chartId: UniqueId(`${this.$options.name.toLowerCase()}-`)
    };
  },
  computed: {
    wrapperStyle() {
      return {
        width: "100%",
        height: this.headerTitle ? "calc(100% - 24px)" : "100%"
      };
    }
  },
  created() {
    // echarts.registerTheme("mapgis-theme", theme);
  },
  mounted() {
    let mapgisChartDom = this.$refs[this.chartId];
    let mapgisChart = echarts.init(mapgisChartDom/* , "mapgis-theme" */);
    mapgisChart.setOption(this.echartOptions);

    const vm = this;
    ECHARTS_EVENTS.forEach(event => {
      /* mapgisChart.$on(event, params => {
        if (event === "click") {
        }
        vm.$emit(event, params);
      }); */
    });
  },
  methods: {
    // 获取echart实例
    _getEchart() {
      return this.mapgisChart;
    }
  }
};
</script>
