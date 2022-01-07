<template><div></div></template>
<script>
export default {
  name: "mapgis-3d-graph-theme-layer",
  inject: ["viewer", "Cesium"],
  props: {
    // 数据源
    geojson: {
      type: Object
    },
    // 统计的属性字段
    attributeName: {
      type: Array
    },
    // 各个属性对应的颜色
    attributeColor: {
      type: Array
    },
    // 统计图类型：VerticalColumn，HorizontalColumn，Pie
    type: {
      type: String
    },
    // 显示柱状体或饼状的宽度
    width: {
      type: Number,
      default: 50000
    },
    // 是否为饼状体添加高度
    addExtrudedHeight: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    ceisumColors() {
      const { Cesium } = this;
      const colorArr = [...this.attributeColor];
      const ceisumColors = colorArr.map(item => {
        let cesiumColor = Cesium.Color.fromCssColorString(item);
        return cesiumColor;
      });
      return ceisumColors;
    }
  },
  watch: {
    // geojson: {
    //   deep: true,
    //   handler() {
    //     if (this.geojson) {
    //       this.addGraphLayer();
    //     }
    //   }
    // },
    // type: {
    //   deep: true,
    //   handler() {
    //     if (this.geojson) {
    //       this.addGraphLayer();
    //     }
    //   }
    // }
  },
  data() {
    return {
      thematicMapLayer: undefined
    };
  },
  created() {
    this.mount();
  },
  methods: {
    async createCesiumObject() {
      return new Promise(
        resolve => {
          resolve();
        },
        reject => {}
      );
    },
    mount() {
      const vm = this;
      let promise = this.createCesiumObject();
      promise.then(function() {
        vm.$emit("load", vm);
      });
    },
    unmount() {
      this.removeGraphLayer();
      this.$emit("unload", this);
    },
    addGraphLayer() {
      this.removeGraphLayer();
      const { Cesium, viewer } = this;
      this.thematicMapLayer = new Cesium.ThemeManager(viewer);
      this.thematicMapLayer.width = this.width;
      this.thematicMapLayer.attributeName = this.attributeName;
      this.thematicMapLayer.addGeoGeometry = false;
      this.thematicMapLayer.attributeColor = this.ceisumColors;
      if (this.type === "Pie") {
        this.thematicMapLayer.addExtrudedHeight = this.addExtrudedHeight;
      }
      this.thematicMapLayer.addByGeoJson(this.geojson, this.type);
    },
    removeGraphLayer() {
      if (this.thematicMapLayer) {
        this.thematicMapLayer.remove();
      }
    }
  },
  beforeDestroy() {
    this.unmount();
  }
};
</script>
