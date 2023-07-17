<template>
  <div class="insar-point-popup-wrapper">
    <span class="monitor-title">沉降数据</span>
    <div class="insar-echarts" :ref="id" v-show="showEcharts" />
    <span class="monitor-tips" v-show="!showEcharts">暂无数据</span>
  </div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "mapgis-3d-insar-point-popup",
  props: {
    properties: {
      type: Object,
      default: () => {}
    },
    // 气泡框配置
    componentWidth: {
      type: [Number, String],
      default: 580
    }
  },
  data() {
    return {
      id: Math.floor(Math.random() * 100000),
      showEcharts: true
    };
  },
  watch: {
    properties: {
      deep: true,
      immediate: true,
      handler(val) {
        if (!val) {
          this.showEcharts = false;
        } else {
          this.drawEcharts(val);
        }
      }
    }
  },
  methods: {
    drawEcharts(data) {
      const excludeProperties = ["VEL", "mpLayer", "fid", "HEIGHT"];
      const xData = [];
      const yData = [];
      Object.keys(data).forEach(item => {
        if (!excludeProperties.includes(item)) {
          xData.push(item);
          yData.push(data[item]);
        }
      });
      if (this.myCharts) {
        this.$nextTick(() => {
          this.resizeEcharts(xData, yData);
        });
      } else {
        this.$nextTick(() => {
          this.drawEchart(xData, yData);
        });
      }
    },
    drawEchart(xData, yData) {
      const echartsDom = this.$refs[this.id];
      if (!echartsDom) return;
      this.myCharts = echarts.init(echartsDom, null, {
        renderer: "canvas",
        useDirtyRect: false,
        width: echartsDom.clientWidth,
        height: echartsDom.clientHeight
      });
      const option = {
        grid: {
          top: "10%",
          left: "6%",
          right: "6%",
          bottom: "8%"
        },
        tooltip: {
          trigger: "axis"
          /* position: function (pt) {
              return [pt[0], '10%'];
            } */
        },
        xAxis: {
          type: "category",
          data: xData,
          axisLine: {
            show: true
          },
          textStyle: {
            color: "#fff"
          },
          axisLabel: {
            color: "#fff"
          }
        },
        yAxis: {
          type: "value",
          axisLine: {
            show: true
          },
          textStyle: {
            color: "#fff"
          },
          axisLabel: {
            color: "#fff"
          },
          splitLine: {
            lineStyle: {
              color: "#6a6969",
              type: "dashed"
            }
          }
        },
        series: [
          {
            data: yData,
            type: "line"
          }
        ]
      };
      this.myCharts.setOption(option);
    },
    resizeEcharts(xData, yData) {
      let option = this.myCharts.getOption();
      option.xAxis.data = xData;
      option.series[0].data = yData;
      this.myCharts.setOption(option);
      this.myCharts.resize();
    }
  }
};
</script>

<style lang="scss" scoped>
.insar-point-popup-wrapper {
  display: flex;
  flex-direction: column;
  height: 400px;
  .monitor-title {
    color: var(--text-color);
  }
  .insar-echarts {
    flex: 1;
  }
  .monitor-tips {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--text-color);
  }
}</style
>>
