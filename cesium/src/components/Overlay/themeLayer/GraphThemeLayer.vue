<template>
  <div></div>
</template>

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
    // 显示柱状体的高度，实际高度 = 属性字段值 * heightScale
    heightScale: {
      type: Number,
      default: 1
    },
    // 是否为饼状体添加高度
    addExtrudedHeight: {
      type: Boolean,
      default: true
    },
    // 标注字体
    textFont: {
      type: String,
      default: "50px Helvetica"
    },
    // 标注颜色
    textColor: {
      type: String,
      default: "#008000"
    },
    // 字体高度的偏移值
    textHeightOffset: {
      type: Number,
      default: 10000
    },
    // 字体高度的可见性，相机高度高于该值时文字不可见
    textScale: {
      type: Object,
      default: function() {
        return {
          near: 0,
          nearValue: 1,
          far: 5000000,
          farValue: 0
        }
      }
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
    geojson: {
      deep: true,
      handler() {
        if (this.geojson) {
          this.addGraphLayer();
        }
      }
    },
    heightScale: {
      deep: true,
      handler() {
        this.addGraphLayer();
      }
    },
    textScale : {
      deep: true,
      handler() {
        this.addGraphLayer();
      }
    }
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
      thematicMapLayer: undefined,
      handler: undefined
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
      this.handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
      this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
      this.handler.destroy();
      this.handler = undefined;
      this.$emit("unload", this);
    },
    addGraphLayer() {
      if (this.geojson && Object.keys(this.geojson).length > 0) {
        this.removeGraphLayer();
        const { Cesium, viewer } = this;
        this.thematicMapLayer = new Cesium.ThemeManager(viewer);
        this.thematicMapLayer.width = this.width;
        this.thematicMapLayer.heightScale = this.heightScale;
        this.thematicMapLayer.attributeName = this.attributeName;
        this.thematicMapLayer.addGeoGeometry = false;
        this.thematicMapLayer.attributeColor = this.ceisumColors;
        this.thematicMapLayer.textFont = this.textFont;
        this.thematicMapLayer.textColor = Cesium.Color.fromCssColorString(
          this.textColor
        );
        this.thematicMapLayer.textHeightOffset = this.textHeightOffset;
        const { near, nearValue, far, farValue } = this.textScale;
        let nearFarScalar = new Cesium.NearFarScalar(near, nearValue, far, farValue);
        this.thematicMapLayer.nearFarScalar = nearFarScalar;
        if (this.type === "Pie") {
          this.thematicMapLayer.addExtrudedHeight = this.addExtrudedHeight;
        }
        this.thematicMapLayer.addByGeoJson(this.geojson, this.type);
        
        let vm = this;
        this.handler = this.handler || new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        //增加hover事件
        this.handler.setInputAction(function (movement) {

          let pickedFeature = viewer.scene.pick(movement.endPosition);
          if (pickedFeature !== undefined) {
            vm.$emit('hover',pickedFeature); 
          }
          viewer.scene.requestRender();

        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        //增加click事件
        this.handler.setInputAction(function (movement) {

          let pickedFeature = viewer.scene.pick(movement.position);
          console.log('pickedFeature',pickedFeature);
          
          if (pickedFeature !== undefined) {
            vm.$emit('click',pickedFeature); 
          }
          viewer.scene.requestRender();

        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      }
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
