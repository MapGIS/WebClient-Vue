<script>
import { MRFS } from "@mapgis/webclient-es6-service";
import { DataSet } from "mapv";
import { MapvLayer } from "../../mapv/MapvLayer";

const { VFeature } = MRFS;

export default {
  name: "mapgis-3d-mapv-heater-layer",
  inject: ["Cesium", "webGlobe"],
  props: {
    geojson: {
      // 数据源
      type: Object
    },
    field: {
      // 统计的属性
      type: String,
      default: "count"
    },
    options: {
      // 热力图配置
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    /**
     * 转换数据
     * @param {object} geojson 数据源
     */
    $_convertGeojson(geojson) {
      return VFeature.resultToGeojson(geojson);
    },
    /**
     * 处理geojson
     * @param {object} geojson 数据源
     * @param {string} field 统计属性字段
     */
    $_handleGeojson(geojson, field) {
      if (!geojson || !field) return;
      const _geojson = !("features" in geojson)
        ? this.$_convertGeojson(geojson)
        : geojson;
      let _dataSet = [];

      if (_geojson.features.length) {
        _dataSet = _geojson.features.map(({ geometry, properties }) => {
          const { type, coordinates } = geometry;
          const { time, ...others } = properties;
          const timeValue = time ? Number(time) : 100 * Math.random();
          const fieldValue = properties[field] || 1;
          const count =
            typeof fieldValue === "number" && !isNaN(fieldValue)
              ? fieldValue
              : Number(fieldValue);
          return {
            geometry: {
              type,
              coordinates
            },
            time: timeValue,
            count,
            ...others
          };
        });
      }
      const dataSet = new DataSet(_dataSet);
      return dataSet;
    },
    /**
     * 更新mapv热力图层
     */
    $_updateMapvLayer() {
      if (!this.mapvLayer) {
        this.$_createMapvLayer();
      } else {
        this.mapvLayer.updateData(this.dataSource, this.selfOptions);
      }
    },
    /**
     * 创建mapv热力图层
     */
    $_createMapvLayer() {
      if (!this.geojson) return;
      this.dataSource = this.$_handleGeojson(this.geojson, this.field);
      this.mapvLayer = new MapvLayer(
        this.webGlobe.viewer,
        this.dataSource,
        this.selfOptions
      );
    },
    /**
     * 移除mapv热力图图层
     */
    $_removeMapvLayer() {
      if (this.mapvLayer) {
        this.mapvLayer.remove();
        this.mapvLayer.destroy();
        this.mapvLayer = null;
      }
    }
  },
  data: vm => ({
    dataSource: null
  }),
  computed: {
    // 配置
    selfOptions({ options }) {
      return {
        cesium: {
          postRender: true,
          postRenderFrame: 10
        },
        context: "2d",
        draw: "heatmap",
        minOpacity: 0,
        maxOpacity: 1,
        gradient: {
          "0.25": "rgb(0,0,255)",
          "0.55": "rgb(0,255,0)",
          "0.85": "rgb(241,241,15)",
          "1.0": "rgb(255,0,0)"
        },
        max: 100, // 最大权重值
        size: 20, // 每个热力点半径大小
        ...options
      };
    }
  },
  watch: {
    options: {
      deep: true,
      handler(o) {
        if (o) {
          this.$_updateMapvLayer();
        }
      }
    },
    geojson: {
      deep: true,
      handler(d) {
        if (!d || !d.features || !d.features.length) {
          this.$_removeMapvLayer();
        } else {
          this.$_updateMapvLayer();
        }
      }
    }
  },
  beforeDestroy() {
    this.$_removeMapvLayer();
  },
  created() {
    this.$_createMapvLayer();
  },
  render() {
    return null;
  }
};
</script>
