<template>
  <div>
    <!-- slot for toolbar -->
    <slot name="toolbar" />
    <!-- slot for toolbar-item -->
    <slot v-if="initial" />
    <mapgis-ui-card :customPosition="position" class="mapgis-3d-draw-control">
      <div v-show="enableControl">
        <mapgis-ui-space>
          <mapgis-ui-tooltip
            v-for="(item, i) in draws"
            :key="i"
            placement="bottom"
          >
            <template slot="title">
              <span>{{ item.tip }}</span>
            </template>
            <mapgis-ui-button
              shape="circle"
              :type="item.type"
              @click="item.click"
              :class="item.className"
            >
              <mapgis-ui-iconfont
                :type="item.icon"
                :class="item.className"
                theme="filled"
              />
            </mapgis-ui-button>
          </mapgis-ui-tooltip>
        </mapgis-ui-space>
      </div>
    </mapgis-ui-card>
  </div>
</template>

<style></style>

<script>
const drawEvents = {
  // es6
  drawCreate: "draw.create",
  // brower
  drawcreate: "draw.create"
};
export default {
  name: "mapgis-3d-draw",
  mixins: [],
  inject: ["Cesium", "vueCesium", "viewer"],
  props: {
    infinite: {
      type: Boolean,
      default: false
    },
    enableControl: {
      type: Boolean,
      default: false
    },
    position: {
      type: String,
      default: "top-right"
    },
    clampToGround: {
      type: Boolean,
      default: true
    },
    drawStyle: {
      type: Object,
      default: () => {
        return {};
      }
    },
    vueKey: {
      type: String,
      default: ""
    },
    vueIndex: {
      type: Number,
      default() {
        return Number((Math.random() * 100000000).toFixed(0));
      }
    }
  },
  data() {
    return {
      drawStyleCopy: {
        color: "#FF0000",
        opacity: 0.5,
        outlineWidth: 1,
        //边线颜色
        outlineColor: "#000000",
        //线宽
        width: 2
      },
      initial: false,
      drawOption: "",
      draws: [
        {
          icon: "mapgis-huizhidian2",
          type: "primary",
          tip: "画点",
          click: this.enableDrawPoint
        },
        {
          icon: "mapgis-huizhixian1",
          type: "primary",
          tip: "画线",
          click: this.enableDrawLine
        },
        {
          icon: "mapgis-huizhijuxing",
          type: "primary",
          tip: "画矩形",
          click: this.enableDrawRectangle
        },
        {
          icon: "mapgis-draw-polygon",
          type: "primary",
          tip: "画多边形",
          click: this.enableDrawPolygon
        },
        {
          icon: "mapgis-huizhiyuan1",
          type: "primary",
          tip: "画圆",
          click: this.enableDrawCircle
        },
        // {
        //   icon: "mapgis-icon_huizhiyuanxing",
        //   type: "primary",
        //   tip: "画半径",
        //   click: this.toggleRadius
        // },
        {
          icon: "mapgis-shanchu_dianji",
          type: "primary",
          tip: "删除绘制",
          click: this.removeEntities
        }
      ]
    };
  },

  created() {},
  mounted() {
    this.drawStyleCopy = Object.assign(this.drawStyleCopy, this.drawStyle);
    this.mount();
  },
  destroyed() {
    this.unmount();
  },
  watch: {
    //贴地
    clampToGround: {
      handler: function(newVal, oldVal) {
        this.unmount();
        this.mount();
      }
    },
    drawStyle: {
      handler: function() {
        this.drawStyleCopy = Object.assign(this.drawStyleCopy, this.drawStyle);
      },
      deep: true
    }
  },
  methods: {
    mount() {
      let vm = this;
      const { vueKey, vueIndex } = this;
      //轮询，直到webGlobe有值，才会显示slot，这是为了保证draw组件不在webscene组件里面也能正常使用
      let interval = setInterval(function() {
        let viewer = vm.getWebGlobe();
        if (viewer) {
          clearInterval(interval);
          vm.initial = true;
          vm.$emit("load", vm);
          window.vueCesium.DrawToolManager.addSource(vueKey, vueIndex, []);
        }
      }, 50);
    },

    unmount() {
      let { vueKey, vueIndex, vueCesium } = this;
      if (!vueCesium) {
        vueCesium = window.vueCesium;
      }
      let find = vueCesium.DrawToolManager.findSource(vueKey, vueIndex);
      //清空实体，删除Draw组件
      if (find) {
        this.removeEntities(true);
        vueCesium.DrawToolManager.deleteSource(vueKey, vueIndex);
      }
      //清空drawElement
      if (window.drawElement) {
        window.drawElement.stopDrawing();
      }
      delete window.drawElement;
      //抛出unload事件
      this.$emit("unload", this);
    },

    removeEntities(unmount) {
      let { vueKey, vueIndex } = this;

      let viewer = this.getWebGlobe();
      // 取得viewer后，清空当前绘制
      if (viewer) {
        let drawEntities = window.vueCesium.DrawToolManager.findSource(
          vueKey,
          vueIndex
        );
        if (drawEntities) {
          drawEntities = drawEntities.source;
          for (let i = 0; i < drawEntities.length; i++) {
            viewer.scene.primitives.remove(drawEntities[i]);
            viewer.entities.remove(drawEntities[i]);
          }
          drawEntities.source = [];
        }
      }
      //清空drawElement
      if (window.drawElement) {
        window.drawElement.stopDrawing();
      }
      if (!unmount) {
        if (this.drawOption.length > 0) {
          this[this.drawOption]();
        }
      }
    },
    getWebGlobe() {
      let viewerDraw;
      let { viewer, vueCesium, Cesium, vueKey, vueIndex } = this;
      if (!vueCesium) {
        vueCesium = window.vueCesium;
      }
      if (!Cesium) {
        Cesium = window.Cesium;
      }
      //当viewer存在，则表示在web-scene组件中，使用注入的webGlobe
      if (this.vueKey.length === 0) {
        viewerDraw = viewer;
      } else {
        //当viewer不存在，则表示要通过vueKey获取
        let GlobesManager = vueCesium.GlobesManager;
        if (
          GlobesManager.hasOwnProperty(this.vueKey) &&
          GlobesManager[this.vueKey].length > 0 &&
          GlobesManager[this.vueKey][0].hasOwnProperty("source")
        ) {
          viewerDraw = GlobesManager[this.vueKey][0].source;
        }
      }
      if (!this.infinite) {
        let drawEntities = window.vueCesium.DrawToolManager.findSource(
          vueKey,
          vueIndex
        );
        if (drawEntities) {
          drawEntities = drawEntities.source;
          for (let i = 0; i < drawEntities.length; i++) {
            viewerDraw.scene.primitives.remove(drawEntities[i]);
            viewerDraw.entities.remove(drawEntities[i]);
          }
          drawEntities.source = [];
        }
      }
      return viewerDraw;
    },
    getDrawElement(viewer) {
      if (window.drawElement) {
        window.drawElement.stopDrawing();
      }
      window.drawElement = new Cesium.DrawElement(viewer);
      return window.drawElement;
    },
    enableDrawPoint() {
      this.drawOption = "enableDrawPoint";
      let viewerDraw = this.getWebGlobe();
      const vm = this;
      let { vueCesium, Cesium, vueKey, vueIndex, drawStyleCopy } = this;
      if (!vueCesium) {
        vueCesium = window.vueCesium;
      }
      if (!Cesium) {
        Cesium = window.Cesium;
      }
      let drawElement = this.getDrawElement(viewerDraw);
      if (this.clampToGround) {
        drawElement.setGroundPrimitiveType("BOTH");
      } else {
        drawElement.setGroundPrimitiveType("NONE");
      }
      const outlineColor = new Cesium.Color.fromCssColorString(
        drawStyleCopy.outlineColor
      ).withAlpha(drawStyleCopy.opacity);
      const color = new Cesium.Color.fromCssColorString(
        drawStyleCopy.point?.color || drawStyleCopy.color
      ).withAlpha(drawStyleCopy.point?.alpha || drawStyleCopy.opacity);
      drawElement.startDrawingMarker({
        addDefaultMark: false,
        color: color,
        callback: function(result) {
          let position = result.position;
          let cartographic = Cesium.Cartographic.fromCartesian(position);
          let lng = Cesium.Math.toDegrees(cartographic.longitude);
          let lat = Cesium.Math.toDegrees(cartographic.latitude);
          let height = cartographic.height; //模型高度
          //添加点：经度、纬度、高程、名称、像素大小、颜色、外边线颜色、边线宽度
          let drawEntity = viewerDraw.entities.add({
            name: "点",
            position: Cesium.Cartesian3.fromDegrees(lng, lat, height),
            point: {
              // 点
              pixelSize: drawStyleCopy.point?.size || 10,
              color: color,
              outlineColor: outlineColor,
              outlineWidth: drawStyleCopy.outlineWidth
            }
          });
          if (!vm.infinite) {
            drawElement.stopDrawing();
          }
          let drawEntities = window.vueCesium.DrawToolManager.findSource(
            vueKey,
            vueIndex
          ).source;
          drawEntities.push(drawEntity);
          vm.$emit("drawCreate", position, [lng, lat, height], viewerDraw);
          vm.$emit("drawcreate", position, [lng, lat, height], viewerDraw);
        }
      });
    },
    enableDrawLine(disableDraw) {
      this.drawOption = "enableDrawLine";
      let viewerDraw = this.getWebGlobe();
      let { Cesium, vueKey, vueIndex, drawStyleCopy } = this;
      if (!Cesium) {
        Cesium = window.Cesium;
      }
      let vm = this;
      let drawElement = this.getDrawElement(viewerDraw);
      if (this.clampToGround) {
        drawElement.setGroundPrimitiveType("BOTH");
      } else {
        drawElement.setGroundPrimitiveType("NONE");
      }
      const color = new Cesium.Color.fromCssColorString(
        drawStyleCopy.line?.color || drawStyleCopy.color
      ).withAlpha(drawStyleCopy.line?.alpha || drawStyleCopy.opacity);
      drawElement.startDrawingPolyline({
        color: color,
        callback: function(result) {
          let positions = result.positions;
          let degreeArr = [];
          for (let i = 0; i < positions.length; i++) {
            let cartographic = Cesium.Cartographic.fromCartesian(positions[i]);
            let lng = Cesium.Math.toDegrees(cartographic.longitude);
            let lat = Cesium.Math.toDegrees(cartographic.latitude);
            let height = cartographic.height;
            degreeArr.push([lng, lat, height]);
          }
          if (!disableDraw || typeof disableDraw !== "boolean") {
            let polyline = new Cesium.DrawElement.PolylinePrimitive({
              id: "polyline",
              positions: positions,
              width: drawStyleCopy.line?.size || drawStyleCopy.width,
              geodesic: true
            });
            let drawEntity = viewerDraw.scene.primitives.add(polyline);
            let drawEntities = window.vueCesium.DrawToolManager.findSource(
              vueKey,
              vueIndex
            ).source;
            drawEntities.push(drawEntity);
          }
          if (!vm.infinite) {
            drawElement.stopDrawing();
          }
          vm.$emit("drawCreate", positions, degreeArr, viewerDraw);
          vm.$emit("drawcreate", positions, degreeArr, viewerDraw);
        }
      });
    },
    //绘制多边形
    enableDrawPolygon(disableDraw) {
      this.drawOption = "enableDrawPolygon";
      let viewerDraw = this.getWebGlobe();
      let { Cesium, vueKey, vueIndex } = this;
      if (!Cesium) {
        Cesium = window.Cesium;
      }
      let vm = this;
      let { drawStyleCopy } = this;
      let drawElement = this.getDrawElement(viewerDraw);
      if (this.clampToGround) {
        drawElement.setGroundPrimitiveType("BOTH");
      } else {
        drawElement.setGroundPrimitiveType("NONE");
      }
      const colorStyle = new Cesium.Color.fromCssColorString(
        drawStyleCopy.polygon?.color || drawStyleCopy.color
      ).withAlpha(drawStyleCopy.polygon?.alpha || drawStyleCopy.opacity);
      drawElement.startDrawingPolygon({
        color: colorStyle,
        callback: function(result) {
          let positions = result.positions;
          let degreeArr = [];
          for (let i = 0; i < positions.length; i++) {
            let cartographic = Cesium.Cartographic.fromCartesian(positions[i]);
            let lng = Cesium.Math.toDegrees(cartographic.longitude);
            let lat = Cesium.Math.toDegrees(cartographic.latitude);
            let height = cartographic.height;
            degreeArr.push([lng, lat, height]);
          }
          if (!disableDraw || typeof disableDraw !== "boolean") {
            let polygon = new Cesium.DrawElement.PolygonPrimitive({
              positions: positions,
              width: drawStyleCopy.polygon?.size || drawStyleCopy.width,
              material: Cesium.Material.fromType("Color", {
                color: colorStyle
              })
            });
            let drawEntity = viewerDraw.scene.primitives.add(polygon);
            let drawEntities = window.vueCesium.DrawToolManager.findSource(
              vueKey,
              vueIndex
            ).source;
            drawEntities.push(drawEntity);
          }
          if (!vm.infinite) {
            drawElement.stopDrawing();
          }
          vm.$emit("drawCreate", positions, degreeArr, viewerDraw);
          vm.$emit("drawcreate", positions, degreeArr, viewerDraw);
        }
      });
    },

    //绘制矩形
    enableDrawRectangle(disableDraw) {
      this.drawOption = "enableDrawRectangle";
      let viewerDraw = this.getWebGlobe();
      let { Cesium, vueKey, vueIndex, drawStyleCopy } = this;
      if (!Cesium) {
        Cesium = window.Cesium;
      }
      let vm = this;
      let drawElement = this.getDrawElement(viewerDraw);
      if (this.clampToGround) {
        drawElement.setGroundPrimitiveType("BOTH");
      } else {
        drawElement.setGroundPrimitiveType("NONE");
      }
      const colorStyle = new Cesium.Color.fromCssColorString(
        drawStyleCopy.polygon?.color || drawStyleCopy.color
      ).withAlpha(drawStyleCopy.polygon?.alpha || drawStyleCopy.opacity);

      drawElement.startDrawingExtent({
        color: colorStyle,
        callback: function(result) {
          let extent = result.extent;
          if (!disableDraw || typeof disableDraw !== "boolean") {
            let rectangle = new Cesium.DrawElement.ExtentPrimitive({
              extent: extent,
              material: Cesium.Material.fromType("Color", {
                color: colorStyle
              })
            });
            let drawEntity = viewerDraw.scene.primitives.add(rectangle);

            let drawEntities = window.vueCesium.DrawToolManager.findSource(
              vueKey,
              vueIndex
            ).source;
            drawEntities.push(drawEntity);
          }
          let radianPoints = [
            extent.west,
            extent.north,
            extent.east,
            extent.south
          ];
          let ellipsoid = viewerDraw.scene.globe.ellipsoid;
          let Cartesian3Points = Cesium.Cartesian3.fromRadiansArray(
            radianPoints,
            ellipsoid
          );
          let degreeArr = [];
          for (let i = 0; i < Cartesian3Points.length; i++) {
            let cartographic = Cesium.Cartographic.fromCartesian(
              Cartesian3Points[i]
            );
            let lng = Cesium.Math.toDegrees(cartographic.longitude);
            let lat = Cesium.Math.toDegrees(cartographic.latitude);
            let height = result.height;
            degreeArr.push([lng, lat, height]);
          }
          if (!vm.infinite) {
            drawElement.stopDrawing();
          }
          vm.$emit(
            "drawCreate",
            Cartesian3Points,
            degreeArr,
            viewerDraw,
            extent
          );
          vm.$emit(
            "drawcreate",
            Cartesian3Points,
            degreeArr,
            viewerDraw,
            extent
          );
        }
      });
    },

    //绘制圆
    enableDrawCircle() {
      this.drawOption = "enableDrawCircle";
      let viewerDraw = this.getWebGlobe();
      let { Cesium, vueKey, vueIndex, drawStyleCopy } = this;
      if (!Cesium) {
        Cesium = window.Cesium;
      }
      let vm = this;
      let drawElement = this.getDrawElement(viewerDraw);
      if (this.clampToGround) {
        drawElement.setGroundPrimitiveType("BOTH");
      } else {
        drawElement.setGroundPrimitiveType("NONE");
      }
      const colorStyle = new Cesium.Color.fromCssColorString(
        drawStyleCopy.polygon?.color || drawStyleCopy.color
      ).withAlpha(drawStyleCopy.polygon?.alpha || drawStyleCopy.opacity);
      drawElement.startDrawingCircle({
        color: colorStyle,
        callback: function(result) {
          let center = result.center;
          let radius = result.radius;
          console.log("circle", center);
          // alert(center.toString() + ' ' + radius.toString());
          var centerCartographic = Cesium.Cartographic.fromCartesian(center);
          let height = centerCartographic.height;
          let redCircle = new Cesium.DrawElement.CirclePrimitive({
            center: center,
            radius: radius,
            height: height,
            asynchronous: false,
            material: Cesium.Material.fromType("Color", {
              color: colorStyle
            })
          });
          if (!vm.infinite) {
            drawElement.stopDrawing();
          }
          let drawEntity = viewerDraw.scene.primitives.add(redCircle);

          let drawEntities = window.vueCesium.DrawToolManager.findSource(
            vueKey,
            vueIndex
          ).source;
          drawEntities.push(drawEntity);

          vm.$emit("drawCreate", center, radius, viewerDraw);
          vm.$emit("drawcreate", center, radius, viewerDraw);
        }
      });
    }
  }
};
</script>
<style scoped>
.mapgis-3d-draw-control {
  z-index: 1000;
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(255, 255, 255, 0);
}

::v-deep .mapgis-ui-card-body {
  padding: 0;
  background: rgba(255, 255, 255, 0);
}

::v-deep .mapgis-ui-card-bordered {
  border: unset;
}
</style>
