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
  MeasureStickLengthTool: "MeasureStickLengthTool",
  MeasureStickAreaTool: "MeasureStickAreaTool",
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
    },
    type: {
      type: String
    }
  },
  data: vm => ({
    selfResult: null,
    resultOptions: null,
    selfResultMap: {
      [measureModeMap.MeasureLengthTool]: [
        {
          label: "空间距离",
          value: "cesiumLength",
          unit: "千米",
          type: "space"
        }
      ],
      [measureModeMap.MeasureStickLengthTool]: [
        {
          label: "贴地距离",
          value: "cesiumStickLength",
          unit: "千米",
          type: "tostick"
        }
      ],
      [measureModeMap.MeasureAreaTool]: [
        {
          label: "空间面积",
          value: "cesiumArea",
          unit: "平方公里",
          type: "space"
        }
      ],
      [measureModeMap.MeasureStickAreaTool]: [
        {
          label: "贴地面积",
          value: "cesiumStickArea",
          unit: "平方公里",
          type: "tostick"
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
