const chartOptions = ({ x, y }) => {
  return {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "line",
        lineStyle: {
          color: "#41aeff",
          type: "solid"
        }
      },
      textStyle: {
        fontSize: 10
      }
    },
    title: {
      show: false
    },
    toolbox: {
      feature: {
        saveAsImage: {
          type: "png",
          show: true,
          title: "保存为图片"
        },
        restore: { show: true, title: "刷新" }
      }
    },
    grid: {
      top: 20,
      left: 25,
      right: 0,
      bottom: 20,
      contentLabel: false
    },
    xAxis: {
      show: false,
      data: x,
      axisLabel: {
        rotate: 60
      }
    },
    yAxis: {
      min: 0,
      max: 1,
      splitLine: {
        lineStyle: {
          color: "#d9d9d9",
          type: "dotted"
        }
      }
    },
    series: [
      {
        type: "line",
        data: y,
        smooth: true,
        itemStyle: {
          color: "#40a9ff"
        }
      }
    ]
  };
};

export default chartOptions;
