<template>
  <div v-if="selfResult" class="measure-result">
    <div v-for="{ label, value, unit } in selfResultOptions" :key="value">
      {{ label }}：{{ selfResult[value] }} {{ unit }}
    </div>
  </div>
</template>
<script>
export const measureModeMap = {
  MeasureLengthTool: "MeasureLengthTool",
  MeasureAreaTool: "MeasureAreaTool",
  TriangulationTool: "TriangulationTool"
};

export default {
  name: "measure-3d-result",
  props: {
    mode: {
      type: String
    },
    result: {
      type: Object
    }
  },
  data: vm => ({
    selfResult: null,
    selfResultMap: {
      [measureModeMap.MeasureLengthTool]: [
        {
          label: "直线距离",
          value: "cesiumLength",
          unit: "千米"
        }
      ],
      [measureModeMap.MeasureAreaTool]: [
        {
          label: "空间面积",
          value: "cesiumArea",
          unit: "平方公里"
        }
      ],
      [measureModeMap.TriangulationTool]: [
        {
          label: "高差",
          value: "verticalDiatance",
          unit: "米"
        },
        {
          label: "水平距离",
          value: "horizontalDiatance",
          unit: "米"
        }
      ]
    }
  }),
  computed: {
    selfResultOptions({ selfResultMap, mode }) {
      return selfResultMap[mode];
    }
  },
  watch: {
    result: {
      deep: true,
      handler(nResult) {
        this.selfResult = nResult;
      }
    }
  }
};
</script>
<style lang="less" scoped></style>
