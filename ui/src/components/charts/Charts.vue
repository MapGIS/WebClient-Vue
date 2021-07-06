<template>
  <div
    :id="chartId"
    :ref="chartId"
    :option="echartOptions"
    :style="wrapperStyle"
  ></div>
</template>

<script>
import { addListener, removeListener } from "resize-detector";
import debounce from "lodash/debounce";
import UniqueId from "lodash.uniqueid";
import theme from "./style/theme.json";
import china from "./style/china.json";
import EchartsMixin from "./ChartsMixin";
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
import {
  BarChart,
  PieChart,
  LineChart,
  SankeyChart,
  PictorialBarChart,
  EffectScatterChart,
  MapChart,
  CustomChart
} from "echarts/charts";

import {
  GridComponent,
  LegendComponent,
  TooltipComponent,
  PolarComponent,
  DataZoomComponent,
  GeoComponent,
  TitleComponent
} from "echarts/components";
// 注意，新的接口中默认不再包含 Canvas 渲染器，需要显示引入，如果需要使用 SVG 渲染模式则使用 SVGRenderer
import { CanvasRenderer } from "echarts/renderers";

echarts.use([
  LineChart,
  BarChart,
  PieChart,
  SankeyChart,
  CustomChart,
  EffectScatterChart,
  PictorialBarChart,
  MapChart,

  GridComponent,
  LegendComponent,
  TooltipComponent,
  DataZoomComponent,
  TitleComponent,
  PolarComponent,
  GeoComponent,

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
  mixins: [EchartsMixin],
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
      chartId: UniqueId(`${this.$options.name.toLowerCase()}-`),
      resizeEvent: undefined,
      mapgisChart: undefined
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
  provide() {
    return {
      get resize() {
        return this.resizeEvent;
      }
    };
  },
  created() {
    echarts.registerTheme("mapgis-theme", theme);
    echarts.registerMap("china", china);
    this.extendEcharts();
  },
  destroyed() {
    this.unbindResize();
  },
  mounted() {
    let mapgisChartDom = this.$refs[this.chartId];
    let mapgisChart = echarts.init(mapgisChartDom, "mapgis-theme");
    mapgisChart.setOption(this.echartOptions);
    this.mapgisChart = mapgisChart;

    const vm = this;
    this.bindResize();
    ECHARTS_EVENTS.forEach(event => {
      /* mapgisChart.$on(event, params => {
        if (event === "click") {
        }
        vm.$emit(event, params);
      }); */
    });
    this.resize();
  },
  methods: {
    // 获取echart实例
    _getEchart() {
      return this.mapgisChart;
    },
    resize() {
      const { width, height } = this.$el.style;
      const { offsetHeight, offsetWidth } = this.$el;
      this.mapgisChart.resize();
    },
    bindResize() {
      const vm = this;
      this.resizeEvent = debounce(
        () => {
          vm.resize();
        },
        100,
        { leading: true }
      );
      addListener(this.$el, this.resizeEvent);
    },
    unbindResize() {
      removeListener(this.$el, this.resizeEvent);
    }
  }
};
</script>
