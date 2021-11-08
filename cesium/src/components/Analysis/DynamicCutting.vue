<template>
  <div>
    <slot>
      <mapgis-ui-card class="dynamic-tool-bar" v-if="initSlider">
        <mapgis-ui-row>
          <mapgis-ui-col :span="8">
            <p class="flood-title">剖切距离(米):</p>
          </mapgis-ui-col>
          <mapgis-ui-col :span="16">
            <mapgis-ui-slider
              v-model="currentDistanceCopy"
              :defaultValue="currentDistance"
              :min="Number(startDistance)"
              :max="Number(endDistanceCopy)"
            />
          </mapgis-ui-col>
        </mapgis-ui-row>
      </mapgis-ui-card>
    </slot>
  </div>
</template>

<script>
import { getCesiumBaseObject } from "../Utils/util";
import BaseLayer from "./BaseLayer";
import { AnalysisManager } from "../WebGlobe/manager";

export default {
  name: "mapgis-3d-dynamic-cutting",
  mixins: [BaseLayer],
  props: {
    startDistance: {
      type: Number,
      default: 0
    },
    currentDistance: {
      type: Number,
      default: 0
    },
    endDistance: {
      type: Number,
      default: 0
    },
    direction: {
      type: String,
      default: "left"
    },
    color: {
      type: String,
      default: "#00FFFF"
    },
    opacity: {
      type: Number,
      default: 0.3
    },
    defaultCutIndex: {
      type: Number,
      default() {
        let dIndex;
        if (this.vueIndex instanceof Array) {
          dIndex = this.vueIndex[0];
        } else {
          dIndex = this.vueIndex;
        }
        return dIndex;
      }
    },
    vueIndex: {
      type: [Number, Array],
      required: true
    }
  },
  watch: {
    currentDistanceCopy: {
      handler: function f() {}
    }
  },
  inject: ["Cesium", "CesiumZondy", "webGlobe"],
  data() {
    return {
      //当前的迫切面的距离
      currentDistanceCopy: 0,
      //剖切开始距离
      startDistanceCopy: 0,
      //剖切结束距离
      endDistanceCopy: 0,
      initSlider: false
    };
  },
  mounted() {
    this.$_initProps();
    this.$_initWatch();
    this.$_mount();
  },
  destroyed() {
    this.$_unmount();
  },
  methods: {
    $_initWatch() {
      let vm = this;
      Object.keys(this.$props).forEach(function(key) {
        if (key !== "vueKey") {
          vm.$watch(key, function() {
            vm.$_unmount();
            vm.$_mount();
          });
        }
      });
    },
    $_initProps() {
      this.currentDistanceCopy = Number(this.currentDistance);
      this.startDistanceCopy = Number(this.startDistance);
      this.endDistanceCopy = Number(this.endDistance);
    },
    $_mount() {
      const { vueKey, vueIndex } = this;
      let Cesium = getCesiumBaseObject(this, "Cesium");
      let CesiumZondy = getCesiumBaseObject(this, "CesiumZondy");
      let vm = this;
      CesiumZondy.getWebGlobeByInterval(function(webGlobe) {
        vm.$_getM3DByInterval(function(m3d) {
          //模型加载完毕，抛出lioaded事件
          vm.$emit("loaded", vm);
          //进行剖切分析的面，从上往下切，Cesium.Cartesian3中第一个参数是左右，第二个参数是前后，第三个参数是上下
          let xDirect = 0;
          let yDirect = 0;
          let zDirect = 0;
          let m3dIndex = 0;
          for (let i = 0; i < m3d.length; i++) {
            if (Number(m3d[i].key) === vm.defaultCutIndex) {
              m3dIndex = i;
              break;
            }
          }
          let m3dBox = vm.$_getM3DBox(m3d[m3dIndex].source[0]);
          switch (vm.direction) {
            case "right":
              xDirect = 1.0;
              vm.endDistanceCopy = m3dBox.length;
              break;
            case "left":
              xDirect = -1.0;
              vm.endDistanceCopy = m3dBox.length;
              break;
            case "forward":
              yDirect = 1.0;
              vm.endDistanceCopy = m3dBox.width;
              break;
            case "back":
              yDirect = -1.0;
              vm.endDistanceCopy = m3dBox.width;
              break;
            case "top":
              zDirect = 1.0;
              vm.endDistanceCopy = m3dBox.height;
              break;
            case "bottom":
              zDirect = -1.0;
              vm.endDistanceCopy = m3dBox.height;
              break;
          }
          //初始化分析功能管理类
          let analysisManager = new CesiumZondy.Manager.AnalysisManager({
            viewer: webGlobe.viewer
          });
          CesiumZondy.AnalysisManager.addSource(
            vueKey,
            vueIndex instanceof Array ? vueIndex[0] : vueIndex,
            analysisManager
          );
          let color = Cesium.Color.fromCssColorString(vm.color);
          color = Cesium.Color.fromAlpha(color, vm.opacity);
          let dynaCuts = [],
            planes = [];
          for (let i = 0; i < m3d.length; i++) {
            //创建剖切对象实例
            let plane = new Cesium.ClippingPlane(
              new Cesium.Cartesian3(xDirect, yDirect, zDirect),
              0.0
            );
            let dynaCut;
            planes.push(plane);
            if (i === 0) {
              dynaCut = analysisManager.createDynamicCutting(
                [m3d[i].source[0]],
                [planes[i]],
                {
                  color: color
                }
              );
            } else {
              let color = Cesium.Color.fromCssColorString("#ffffff");
              color = Cesium.Color.fromAlpha(color, 0);
              dynaCut = analysisManager.createDynamicCutting(
                [m3d[i].source[0]],
                [planes[i]],
                {
                  color: color
                }
              );
            }
            dynaCuts.push(dynaCut);
            //设置切面回调函数
            dynaCuts[i].planes[0].plane.plane = new Cesium.CallbackProperty(
              function(date) {
                if (
                  vm.direction === "left" ||
                  vm.direction === "back" ||
                  vm.direction === "top"
                ) {
                  planes[i].distance =
                    vm.endDistanceCopy - vm.currentDistanceCopy;
                } else {
                  planes[i].distance = -vm.currentDistanceCopy;
                }
                vm.initSlider = true;
                return Cesium.Plane.transform(
                  plane,
                  m3d[m3dIndex].source[0].modelMatrix,
                  new Cesium.ClippingPlane(Cesium.Cartesian3.UNIT_X, 0.0)
                );
              },
              false
            );
          }
          CesiumZondy.DynamicCuttingManager.addSource(
            vueKey,
            vueIndex instanceof Array ? vueIndex[0] : vueIndex,
            dynaCuts
          );
        });
      });
    },
    $_unmount() {
      const { vueKey, vueIndex } = this;
      let index = vueIndex instanceof Array ? vueIndex[0] : vueIndex;
      let dynaCuts = CesiumZondy.DynamicCuttingManager.findSource(vueKey, index)
        .source;
      let analysisManager = CesiumZondy.AnalysisManager.findSource(
        vueKey,
        index
      ).source;
      for (let i = 0; i < dynaCuts.length; i++) {
        if (dynaCuts[i].hasOwnProperty("handler") && dynaCuts[i].handler) {
          analysisManager.deleteDynamicCutting(dynaCuts[i]);
        }
      }
      CesiumZondy.DynamicCuttingManager.deleteSource(vueKey, index);
      CesiumZondy.AnalysisManager.deleteSource(vueKey, index);
    }
  }
};
</script>

<style scoped>
.dynamic-tool-bar {
  position: absolute;
  top: 10px;
  left: 10px;
  width: 400px;
}
.dynamic-tool-bar .flood-title {
  margin-top: 0.7em;
}
</style>
