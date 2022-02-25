<script>
import { isDef } from "../../../Utils/util";

export default {
  name: "mapgis-3d-cesium-heater-layer",
  inject: ["viewer","Cesium"],
  props: {
    dataSource: {
      // 数据源
      type: Object
    },
    bound: {
      // 图层范围
      type: Object
    },
    blur:{
      type:Number,
      default:0.85
    },
    radius:{
      type:Number,
      default:20
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
     * 获取原生热力图数据坐标和值的集合
     * @param {object} geojson geojson数据
     * @param { string} field 属性
     */
    $_getCesiumDataArr(geojson, field) {
      return geojson.features.map(
        ({ geometry: { coordinates }, properties }) => {
          const countValue = properties[field];
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
    $_removeCesiumHeater() {
      if (this.heaterInstance) {
        this.heaterInstance.removeLayer();
        this.heaterInstance = null;
        this.analysisManager = null;
      }
    },
    /**
     * 创建原生热力图层, 支持上层单独调用
     */
    $_createCesiumHeater() {
      if (!this.dataSource){
        return;
      }
      const dataSource = this.$_getCesiumDataArr(this.dataSource, this.field);
      const [min, max] = this.$_getCesiumDataRange(dataSource);
      this.heaterInstance = this.Cesium.CesiumHeatmap.create(this.viewer, this.bound, this.selfOptions);
      this.heaterInstance.setWGS84Data(min, max, dataSource);
    },
    /**
     * 更新热力图
     */
    $_updateCesiumHeater(value) {
      if (!value) {
        this.$_removeCesiumHeater();
      } else {
        this.$_createCesiumHeater();
      }
    }
  },
  computed: {
    // 配置
    selfOptions({ options }) {
      let heaterStyle = {radius:this.radius,blur:this.blur};
      return {
        minOpacity: 0,
        maxOpacity: 1,
        gradient: {
          "0.25": "rgb(0,0,255)",
          "0.55": "rgb(0,255,0)",
          "0.85": "rgb(241,241,15)",
          "1.0": "rgb(255,0,0)"
        },
        spacing: 1, // 边界周围的额外空间
        alpha: 1, // 透明度
        blur: 0.85, // 模糊值
        radius: 20, // 每个热力点半径大小
        useClustering: true, // 是否聚合
        ...options,
        ...heaterStyle
      }
    }
  },
  watch: {
    // todo 样式配置更新是否需要重新createHeatMap？有无提供只更新样式配置或者数据的方法？
    options: {
      deep: true,
      handler(o) {
        if (o) {
          this.$_removeCesiumHeater();

          this.$_createCesiumHeater();
        }
      }
    },
    bound: {
      deep: true,
      handler(v) {
        this.$_removeCesiumHeater();
        this.$_updateCesiumHeater(v);
      }
    },
    dataSource: {
      deep: true,
      handler(v) {
        this.$_removeCesiumHeater();
        this.$_updateCesiumHeater(v);
      }
    }
  },
  beforeDestroy() {
    this.$_removeCesiumHeater();
  },
  created() {
    this.$_createCesiumHeater();
  },
  render() {
    return null;
  }
};
</script>
