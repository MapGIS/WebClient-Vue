<template>
  <mapgis-3d-mapv-layer
    v-if="mapvShow"
    :geojson="dataSource"
    :options="selfOptions"
    :count-field="field"
  />
</template>
<script>
import { isDef, isEmptyObj } from "../../../Utils/util";

const typeEnum = {
  MAPV: "MAPV",
  CESIUM: "CESIUM"
};

export default {
  name: "mapgis-3d-heater-layer",
  inject: ["webGlobe", "CesiumZondy"],
  props: {
    type: {
      // 热力图类型
      type: String,
      default: typeEnum.CESIUM,
      validator(value) {
        return Object.keys(typeEnum).includes(value);
      }
    },
    bound: {
      // 图层范围
      type: Object
    },
    dataSource: {
      // geojson
      type: Object
    },
    options: {
      // 热力图配置
      type: Object,
      default: () => ({})
    },
    field: {
      // 统计的属性
      type: String,
      default: "count"
    }
  },
  methods: {
    /**
     * 是否有效专题图数据
     */
    $_validHeater(geojson, bounds) {
      if (isEmptyObj(geojson)) {
        this.$message.error("GeoJson数据无效");
        return false;
      }
      if (!this.isMapv && !bounds) {
        this.$message.error("图层范围无效");
        return false;
      }
      return true;
    },
    /**
     * 获取原生热力图数据坐标和值的集合
     * @param geojson geojson数据
     */
    $_getCesiumDataArr(geojson) {
      return geojson.features.map(
        ({ geometry: { coordinates }, properties }) => {
          const countValue = properties[this.field];
          const value = isDef(countValue) ? countValue : 1;
          const [x, y] = Array.isArray(coordinates[0])
            ? coordinates[0][0]
            : coordinates;
          return {
            x,
            y,
            value
          };
        }
      );
    },
    /**
     * 获取原生热力图数据的值的范围
     * @param {object} data {x,y,value}
     * @returns {array} [min, max]
     */
    $_getCesiumDataRange(data) {
      const values = data.map(({ value }) => value);
      return [Math.min(...values) || 0, Math.max(...values) || 0];
    },
    /**
     * 移除原生热力图层, 支持上层单独调用
     */
    removeCesiumHeater() {
      if (this.heaterInstance) {
        this.heaterInstance.removeLayer();
        this.heaterInstance = null;
      }
    },
    /**
     * 创建原生热力图层, 支持上层单独调用
     * @param geojson geojson数据
     * @param bounds 图层范围
     */
    createCesiumHeater(geojson, bounds) {
      if (!this.$_validHeater(geojson, bounds)) return;
      const analysisManager = new this.CesiumZondy.Manager.AnalysisManager({
        viewer: this.webGlobe.viewer
      });
      if (!this.heaterInstance) {
        const data = this.$_getCesiumDataArr(geojson);
        const range = this.$_getCesiumDataRange(data);
        this.heaterInstance = analysisManager.createHeatMap(
          bounds,
          ...range,
          data,
          this.selfOptions
        );
      }
      return this.heaterInstance;
    },
    /**
     * 移除mapv热力图层, 支持上层单独调用
     * @param geojson geojson数据
     */
    removeMapvHeater() {
      this.mapvShow = false;
    },
    /**
     * 创建mapv热力图层, 支持上层单独调用
     */
    createMapvHeater(geojson) {
      if (!this.$_validHeater(geojson)) return;
      this.mapvShow = true;
    },
    /**
     * 移除热力图层, 支持上层单独调用
     */
    removeHeater() {
      this.removeMapvHeater();
      this.removeCesiumHeater();
    },
    /**
     * 创建热力图层, 支持上层单独调用
     * @param geojson geojson数据
     */
    createHeater(geojson, bound = this.bound) {
      if (this.isMapv) {
        this.createMapvHeater(geojson);
      } else {
        this.createCesiumHeater(geojson, bound);
      }
    }
  },
  data: vm => ({
    mapvShow: false
  }),
  computed: {
    // 是否是mapv热力图
    isMapv({ type }) {
      return type === "MAPV";
    },
    // 配置
    selfOptions({ isMapv, options }) {
      return {
        minOpacity: 0,
        maxOpacity: 1,
        gradient: {
          "0.25": "rgb(0,0,255)",
          "0.55": "rgb(0,255,0)",
          "0.85": "rgb(241,241,15)",
          "1.0": "rgb(255,0,0)"
        },
        ...(isMapv
          ? {
              cesium: {
                postRender: true,
                postRenderFrame: 10
              },
              context: "2d",
              draw: "heatmap",
              max: 100, // 最大权重值
              size: 20 // 每个热力点半径大小
            }
          : {
              spacing: 1, // 边界周围的额外空间
              alpha: 1, // 透明度
              blur: 0.85, // 模糊值
              radius: 20, // 每个热力点半径大小
              useClustering: true // 是否聚合
            }),
        ...options
      };
    }
  },
  watch: {
    dataSource: {
      deep: true,
      immediate: true,
      handler(d) {
        if (!d) {
          this.removeHeater();
        } else {
          this.createHeater(d);
        }
      }
    }
  },
  beforeDestroy() {
    this.removeHeater();
  }
};
</script>
<style lang="less" scoped></style>
