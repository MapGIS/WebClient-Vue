<template>
  <div v-if="result" :class="prefixCls">
    <mapgis-ui-row-flex
      v-for="item in selfResultOptions"
      :key="item.value"
      :title="item.label"
    >
      {{ selfResult[item.value] }}
    </mapgis-ui-row-flex>
  </div>
</template>
<script>
import { VPoint } from "../../../../util";
import { last } from "../../../../util/util";
import dep from "../store/dep";
import { measureModeMap } from "../store/enums";

export default {
  name: "MeasureResult",
  props: {
    mode: {
      type: String,
      default: measureModeMap.line
    },
    unit: {
      type: String
    },
    result: {
      type: Object
    }
  },
  data: vm => ({
    prefixCls: "measure-result",
    selfResult: {
      planeLength: "",
      ellipsoidLength: "",
      planePerimeter: "",
      planeArea: "",
      ellipsoidPerimeter: "",
      ellipsoidArea: ""
    },
    selfResultMap: {
      [measureModeMap.line]: [
        {
          label: "投影平面长度",
          value: "planeLength"
        },
        {
          label: "椭球实地长度",
          value: "ellipsoidLength"
        }
      ],
      [measureModeMap.polygon]: [
        {
          label: "投影平面周长",
          value: "planePerimeter"
        },
        {
          label: "投影平面面积",
          value: "planeArea"
        },
        {
          label: "椭球实地周长",
          value: "ellipsoidPerimeter"
        },
        {
          label: "椭球实地面积",
          value: "ellipsoidArea"
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
    result(obj) {
      this.handleResult(obj);
    },
    deep: true
  },
  methods: {
    /**
     * 单位转换
     */
    transUnit(unit) {
      let areaR = 1;
      let perimeterR = 1;
      let perimeterUnit = "";
      let areaUnit = unit;

      switch (unit) {
        case "m":
          perimeterR = 1;
          break;
        case "km":
          perimeterR = 1000;
          break;
        case "米":
          perimeterR = 1;
          break;
        case "千米":
          perimeterR = 1000;
          break;
        case "m2":
          areaR = 1;
          perimeterR = 1;
          perimeterUnit = "m";
          break;
        case "km2":
          areaR = Math.pow(1000, 2);
          perimeterR = 1000;
          perimeterUnit = "km";
          break;
        case "平方米":
          areaR = 1;
          perimeterR = 1;
          perimeterUnit = "米";
          break;
        case "平方千米":
          areaR = Math.pow(1000, 2);
          perimeterR = 1000;
          perimeterUnit = "千米";
          break;
        default:
          break;
      }

      return {
        areaR,
        perimeterR,
        perimeterUnit,
        areaUnit
      };
    },
    /**
     * 保留2位小数
     */
    precision(n, p = 2) {
      return n.toFixed(p);
    },
    /**
     * 保存格式化后的结果并通知更新(marker组件)
     */
    notifyUpdate(result) {
      dep.setResult(result);
      dep.notify();
    },
    /**
     * 处理测量结果
     */
    handleResult({
      geographyPerimeter,
      geographyArea,
      projectionPerimeter,
      projectionArea,
      coordinates
    }) {
      const { areaR, perimeterR, perimeterUnit, areaUnit } = this.transUnit(
        this.unit
      );
      const perimeter = `${this.precision(
        projectionPerimeter / perimeterR
      )} ${perimeterUnit}`;
      const geoPerimeter = `${this.precision(
        geographyPerimeter / perimeterR
      )} ${perimeterUnit}`;

      let _coordinates;

      switch (this.mode) {
        case measureModeMap.line:
          _coordinates = last(coordinates);

          this.selfResult = {
            planeLength: perimeter,
            ellipsoidLength: geoPerimeter
          };
          break;
        case measureModeMap.polygon: {
          _coordinates = VPoint.getCenterOfGravityPoint(coordinates[0]);

          const planeArea = `${this.precision(
            projectionArea / areaR
          )} ${areaUnit}`;
          const ellipsoidArea = `${this.precision(
            geographyArea / areaR
          )} ${areaUnit}`;

          this.selfResult = {
            planeArea,
            ellipsoidArea,
            planePerimeter: perimeter,
            ellipsoidPerimeter: geoPerimeter
          };
          break;
        }
        default:
          break;
      }

      this.notifyUpdate({
        perimeter,
        area: planeArea,
        coordinates: _coordinates
      });
    }
  }
};
</script>
<style lang="less" scoped></style>
