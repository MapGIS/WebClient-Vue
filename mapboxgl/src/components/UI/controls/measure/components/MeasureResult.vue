<template>
  <div v-if="selfResult" class="measure-result">
    <div v-for="{ label, value } in selfResultOptions" :key="value">
      <span v-if="selfResult[value] !== undefined">
        {{ label }}：{{ selfResult[value] }}
      </span>
    </div>
  </div>
</template>
<script>
import { VPoint } from "../../../../util";
import { last } from "../../../../util/util";
import { measureModeMap } from "../store/enums";
import dep from "../store/dep";

export default {
  name: "measure-result",
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
    selfResult: {
      coordinates: [],
      projectionPerimeter: "",
      projectionArea: "",
      geographyPerimeter: "",
      geographyArea: ""
    },
    selfResultMap: {
      [measureModeMap.line]: [
        {
          label: "投影平面长度",
          value: "projectionPerimeter"
        },
        {
          label: "椭球实地长度",
          value: "geographyPerimeter"
        }
      ],
      [measureModeMap.polygon]: [
        {
          label: "投影平面周长",
          value: "projectionPerimeter"
        },
        {
          label: "投影平面面积",
          value: "projectionArea"
        },
        {
          label: "椭球实地周长",
          value: "geographyPerimeter"
        },
        {
          label: "椭球实地面积",
          value: "geographyArea"
        }
      ]
    }
  }),
  computed: {
    selfResultOptions({ selfResultMap, mode }) {
      return selfResultMap[mode];
    },
    unitOptions({ unit }) {
      return this.transUnit(unit);
    }
  },
  watch: {
    result: {
      deep: true,
      handler(nResult) {
        this.handleResult(nResult);
      }
    },
    unit() {
      this.handleResult(this.result);
    }
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
          perimeterUnit = "m";
          break;
        case "km":
          perimeterR = 1000;
          perimeterUnit = "km";
          break;
        case "米":
          perimeterR = 1;
          perimeterUnit = "米";
          break;
        case "千米":
          perimeterR = 1000;
          perimeterUnit = "千米";
          break;
        case "m²":
          areaR = 1;
          perimeterR = 1;
          perimeterUnit = "m";
          break;
        case "km²":
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
     * 处理测量结果并通知其他订阅者更新(marker组件)
     * @param {object|null} nResult 测量结果
     */
    handleResult(nResult) {
      let _result;
      if (nResult) {
        const {
          geographyPerimeter,
          geographyArea,
          projectionPerimeter,
          projectionArea,
          coordinates
        } = nResult;
        const { areaR, perimeterR, perimeterUnit, areaUnit } = this.unitOptions;
        let perimeter;
        if (projectionPerimeter !== undefined) {
          perimeter = `${this.precision(
            projectionPerimeter / perimeterR
          )} ${perimeterUnit}`;
        }
        let geoPerimeter;
        if (geographyPerimeter !== undefined) {
          geoPerimeter = `${this.precision(
            geographyPerimeter / perimeterR
          )} ${perimeterUnit}`;
        }

        switch (this.mode) {
          case measureModeMap.line:
            _result = {
              projectionPerimeter: perimeter,
              geographyPerimeter: geoPerimeter,
              coordinates: last(coordinates)
            };
            break;
          case measureModeMap.polygon: {
            let projArea;
            if (projectionArea !== undefined) {
              projArea = `${this.precision(
                projectionArea / areaR
              )} ${areaUnit}`;
            }
            let geoArea;
            if (geographyArea !== undefined) {
              geoArea = `${this.precision(geographyArea / areaR)} ${areaUnit}`;
            }

            _result = {
              projectionArea: projArea,
              geographyArea: geoArea,
              projectionPerimeter: perimeter,
              geographyPerimeter: geoPerimeter,
              coordinates: VPoint.getCenterOfGravityPoint(coordinates[0])
            };
            break;
          }
          default:
            break;
        }
      }

      this.selfResult = _result;
      this.notifyUpdate(_result);
    }
  }
};
</script>
