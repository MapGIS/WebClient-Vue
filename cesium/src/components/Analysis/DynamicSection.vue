<template>
  <div>
    <slot>
      <mapgis-ui-group-tab title="模型">
        <mapgis-ui-tooltip slot="tip" placement="top">
          <template slot="title">
            <span>{{ info }}</span>
          </template>
          <mapgis-ui-iconfont type="mapgis-info"></mapgis-ui-iconfont>
        </mapgis-ui-tooltip>
      </mapgis-ui-group-tab>
      <mapgis-ui-row class="model">
        <mapgis-ui-checkbox-group
          v-if="checkboxOptions.length > 0"
          @change="_onCheckboxGroupChange"
        >
          <mapgis-ui-row
            v-for="(option, index) in checkboxOptions"
            :key="`model-${index}`"
          >
            <mapgis-ui-checkbox :value="option.value" style="line-height:32px;" >
              {{ option.label }}
            </mapgis-ui-checkbox>
          </mapgis-ui-row>
        </mapgis-ui-checkbox-group>
        <div v-else>暂无数据！</div>
      </mapgis-ui-row>
      <mapgis-ui-group-tab title="剖切方向">
        <mapgis-ui-checkbox
          slot="handle"
          placement="bottomRight"
          class="checkbox"
          :checked="reverse"
          @change="_onCheckboxChange"
        >
          逆向
        </mapgis-ui-checkbox>
      </mapgis-ui-group-tab>
      <mapgis-ui-row class="axis">
        <mapgis-ui-radio-group v-model="axisCopy" size="small">
          <mapgis-ui-radio value="X"> X轴 </mapgis-ui-radio>
          <mapgis-ui-radio value="Y"> Y轴 </mapgis-ui-radio>
          <mapgis-ui-radio value="Z"> Z轴 </mapgis-ui-radio>
        </mapgis-ui-radio-group>
      </mapgis-ui-row>
      <mapgis-ui-group-tab title="参数设置"></mapgis-ui-group-tab>
      <mapgis-ui-setting-form :layout="layout" size="default">
        <mapgis-ui-form-item label="剖面颜色">
          <mapgis-ui-sketch-color-picker
            :color.sync="colorCopy"
            :disableAlpha="false"
            class="colorCopy-picker"
          >
          </mapgis-ui-sketch-color-picker>
        </mapgis-ui-form-item>
        <mapgis-ui-form-item label="动画时间">
          <mapgis-ui-input-number
            v-model="timeCopy"
            :min="0"
            style="width: 100%"
          />
        </mapgis-ui-form-item>
        
        <!-- <mapgis-ui-form-item label="剖切距离">
          <mapgis-ui-slider
            v-model="distanceCopy"
            :min="min"
            :max="max"
            @change="setDistance"
            :disabled="readonly"
          />
        </mapgis-ui-form-item> -->
      </mapgis-ui-setting-form>
      <mapgis-ui-input-number-panel
          size="large"
          label="剖切距离"
          :range="[min, max]"
          v-model="distanceCopy"
          @change="setDistance"
          :disabled="readonly"
        />
      <mapgis-ui-setting-footer>
        <mapgis-ui-button type="primary" @click="startClipping">
          分析
        </mapgis-ui-button>
        <mapgis-ui-button type="primary" @click="animation">
          动态效果
        </mapgis-ui-button>
        <mapgis-ui-button @click="stopClipping"> 清除 </mapgis-ui-button>
      </mapgis-ui-setting-footer>
    </slot>
  </div>
</template>

<script>
import { makeColor } from "../Utils/util";
import BaseLayer from "./BaseLayer";

export default {
  name: "mapgis-3d-dynamic-section",
  inject: ["Cesium", "vueCesium", "viewer"],
  mixins: [BaseLayer],
  props: {
    // 模型集合
    models: {
      type: Array,
      default: () => []
    },
    axis: {
      type: String,
      default: "X"
    },
    color: {
      type: String,
      default: "rgba(200,200,200,0.5)"
    },
    time: {
      type: Number,
      default: 10
    },
    distance: {
      type: Number,
      default: 0
    },
    layout: {
      type: String,
      default: "vertical" // 'horizontal' 'vertical' 'inline'
    },
  },
  data() {
    return {
      // 默认坐标轴
      axisCopy: "X",

      // 默认裁剪边缘颜色
      colorCopy: "rgb(200,200,200,0.5)",

      // 默认动画时间
      timeCopy: 10,

      // 默认剖切距离
      distanceCopy: 0,

      // 最大剖切距离
      max: 10000,

      // 最小剖切距离
      min: -10000,

      // 时间轴
      timer: null,

      // slider滑块是否禁用
      readonly: false,

      // checkbox选项合集
      checkboxOptions: [],

      // 选择项
      checked: [],

      // 提示信息
      info:
        "模型剖切支持对多个模型图层同时进行剖切分析,通常这些图层描述的是用户感兴趣的同一个空间内不同的构成元素，如：一个图层描述地上模型层，一个描述地下模型层，可以通过剖切分析同时剖切地上地下模型，以查看地上地下模型内部结构。",
      reverse: false
    };
  },
  watch: {
    models: {
      handler: function(layers) {
        this.checkboxOptions = [];
        this.vueIndexs = [];
        this.layerIndexs = [];
        layers.forEach(layer => {
          const { title, vueIndex } = layer;
          const obj = { label: title, value: vueIndex };
          this.checkboxOptions.push(obj);
        });
        this._removeDynaCut();
      },
      deep: true,
      immediate: true
    },
    axis: {
      immediate: true,
      handler: function() {
        this.axisCopy = this.axis;
      }
    },
    color: {
      immediate: true,
      handler: function() {
        this.colorCopy = this.color;
      }
    },
    time: {
      immediate: true,
      handler: function() {
        this.timeCopy = this.time;
      }
    },
    distance: {
      immediate: true,
      handler: function() {
        this.distanceCopy = this.distance;
      }
    },
    axisCopy: {
      deep: true,
      immediate: true,
      handler: function() {
        this._getMaxMin();
        this.startClipping();
      }
    }
  },
  created() {},
  mounted() {
    this.mount();
  },
  destroyed() {
    this.unmount();
  },
  methods: {
    async createCesiumObject() {
      const { baseUrl, options } = this;
      return new Promise(
        resolve => {
          resolve();
        },
        reject => {}
      );
    },
    mount() {
      const { viewer, vueCesium, vueKey, vueIndex } = this;
      const vm = this;
      let promise = this.createCesiumObject();
      promise.then(function(dataSource) {
        vm.$emit("load", vm);
        vueCesium.DynamicSectionAnalysisManager.addSource(
          vueKey,
          vueIndex,
          dataSource,
          {
            dynamicSectionAnalysis: null
          }
        );
      });
      this._getMaxMin();
    },
    unmount() {
      let { vueCesium, vueKey, vueIndex } = this;
      let find = vueCesium.DynamicSectionAnalysisManager.findSource(
        vueKey,
        vueIndex
      );
      if (find) {
        this._removeDynaCut();
      }
      vueCesium.DynamicSectionAnalysisManager.deleteSource(vueKey, vueIndex);
      this.$emit("unload", this);
      this.stopClipping();
    },
    _onCheckboxGroupChange(val) {
      this.checked = [...val];
      this._removeDynaCut();
      this._getMaxMin();
    },
    _onCheckboxChange(e) {
      this.reverse = e.target.checked;
      // 选择切换后，重新进行分析
      this.startClipping();
    },
    /**
     * 获取剖切距离的最大最小值
     */
    _getMaxMin() {
      this._m3dIsReady().then(m3dSetArray => {
        if (m3dSetArray && m3dSetArray.length > 0) {
          const range = this._getM3DSetArrayRange(m3dSetArray);
          this._getMaxMinByRange(range);
        }
      });
    },

    /**
     * 判断传入的m3d、Cesium3DTileset图层是否加载完毕
     */
    _m3dIsReady() {
      const { vueKey, checked } = this;
      return new Promise((resolve, reject) => {
        if (checked.length > 0) {
          this.$_getAll3DTileSetArray(
            function(m3ds) {
              if (m3ds && m3ds.length > 0) {
                resolve(m3ds);
              } else {
                reject(null);
              }
            },
            vueKey,
            checked
          );
        } else {
          reject(null);
        }
      });
    },

    /**
     * 剖切方向，Cesium.Cartesian3中第一个参数是左右，第二个参数是前后，第三个参数是上下
     */
    _clippingDirection() {
      let direction = -1;
      if (this.reverse) {
        direction = 1;
      }
      switch (this.axisCopy) {
        case "X":
          return new this.Cesium.Cartesian3(direction, 0.0, 0.0);
        case "Y":
          return new this.Cesium.Cartesian3(0.0, direction, 0.0);
        case "Z":
          return new this.Cesium.Cartesian3(0.0, 0.0, direction);
        default:
          return new this.Cesium.Cartesian3(direction, 0.0, 0.0);
      }
    },
    /**
     * 设置剖切距离
     */
    setDistance(value) {
      let { vueCesium, vueKey, vueIndex } = this;
      let find = vueCesium.DynamicSectionAnalysisManager.findSource(
        vueKey,
        vueIndex
      );
      let { options } = find;
      let { dynamicSectionAnalysis } = options;
      if (dynamicSectionAnalysis) {
        // 设置剖切面距离
        dynamicSectionAnalysis.distance = value;
      }
    },
    /**
     * 动画设置
     */
    animation() {
      this._m3dIsReady().then(() => {
        if (this.max == undefined || this.min == undefined) {
          return;
        }
        this._clearTimer();
        this.distanceCopy = this.min;
        const self = this;
        this.timer = window.setInterval(() => {
          if (self.readonly === false) {
            self.readonly = true;
          }
          const step = ((self.max - self.min) * 2) / (self.timeCopy * 10);
          self.distanceCopy += step;
          if (self.distanceCopy >= self.max) {
            self.distanceCopy = self.min;
          }
          self.setDistance(self.distanceCopy);
        }, 100);
      });
    },
    /**
     * 结束分析
     */
    stopClipping() {
      this._clearTimer();
      this._removeDynaCut();
    },

    /**
     * 开始分析
     */
    startClipping() {
      this._removeDynaCut();
      this._clearTimer();
      this._m3dIsReady().then(m3dSetArray => {
        let { vueCesium, vueKey, vueIndex } = this;
        let find = vueCesium.DynamicSectionAnalysisManager.findSource(
          vueKey,
          vueIndex
        );
        let { options } = find;
        let { dynamicSectionAnalysis } = options;
        const { viewer } = this;

        dynamicSectionAnalysis =
          dynamicSectionAnalysis ||
          new this.Cesium.CuttingTool(viewer, m3dSetArray);
        // 剖切方向
        const direction = this._clippingDirection();
        // 创建剖切对象实例
        dynamicSectionAnalysis.createModelCuttingPlane(direction, {
          distance: this.distanceCopy || 0,
          color: this._edgeColor(),
          // 剖切辅助面的宽高缩放比(基于模型球的半径)
          scaleHeight: 2.0,
          scaleWidth: 2.0
        });
        vueCesium.DynamicSectionAnalysisManager.changeOptions(
          vueKey,
          vueIndex,
          "dynamicSectionAnalysis",
          dynamicSectionAnalysis
        );
      });
    },
    /**
     * RGB/RGBA转Cesium内部颜色值
     * @param {string} colorCopy rgb/rgba颜色值
     */
    _edgeColor() {
      const { colorCopy } = this;
      return makeColor(colorCopy);
    },
    /**
     * 移除动态剖切对象
     */
    _removeDynaCut() {
      let { vueCesium, vueKey, vueIndex } = this;
      let find = vueCesium.DynamicSectionAnalysisManager.findSource(
        vueKey,
        vueIndex
      );
      let { options } = find || {};
      let { dynamicSectionAnalysis } = options || {};
      if (dynamicSectionAnalysis) {
        dynamicSectionAnalysis.removeAll();
        dynamicSectionAnalysis = null;
        vueCesium.DynamicSectionAnalysisManager.changeOptions(
          vueKey,
          vueIndex,
          "dynamicSectionAnalysis",
          dynamicSectionAnalysis
        );
      }
    },

    /**
     * 清除时间计时器
     */
    _clearTimer() {
      if (this.timer) {
        window.clearInterval(this.timer);
        this.timer = null;
        this.readonly = false;
      }
    },

    /**
     * 获取剖切面离包围盒中心点的最大最小值
     */
    _getMaxMinByRange(range) {
      const { xmin, ymin, xmax, ymax, zmin, zmax } = range;
      let max = 10000;
      let min = -max;
      let length = max - min;
      switch (this.axisCopy) {
        case "X":
          this.min = xmin;
          this.max = xmax;
          this.distanceCopy = (xmin + xmax) / 2;
          break;
        case "Y":
          this.min = ymin;
          this.max = ymax;
          this.distanceCopy = (ymin + ymax) / 2;
          break;
        case "Z":
          const height = zmax - zmin;
          this.min = -height;
          this.max = height;
          this.distanceCopy = 0;
          break;
        default:
          break;
      }
    },
    /**
     * 获取多个M3D的最大包围盒范围(以最大包围盒中心点为原点)
     */
    _getM3DSetArrayRange(m3dSetArray) {
      let xmin;
      let ymin;
      let xmax;
      let ymax;
      let zmin;
      let zmax;
      const boundingSphere = this.Cesium.AlgorithmLib.mergeLayersBoundingSphere(
        m3dSetArray
      );
      for (let i = 0; i < m3dSetArray.length; i++) {
        const m3d = m3dSetArray[i];
        const range = this._getM3DSetRange(m3d, boundingSphere);
        if (!range) {
          continue;
        }
        if (xmin == undefined || range.xmin < xmin) {
          xmin = range.xmin;
        }
        if (ymin == undefined || range.ymin < ymin) {
          ymin = range.ymin;
        }
        if (xmax == undefined || range.xmax > xmax) {
          xmax = range.xmax;
        }
        if (ymax == undefined || range.ymax > ymax) {
          ymax = range.ymax;
        }
        if (zmin == undefined || range.zmin < zmin) {
          zmin = range.zmin;
        }
        if (zmax == undefined || range.zmax > zmax) {
          zmax = range.zmax;
        }
      }
      return { xmin, ymin, xmax, ymax, zmin, zmax };
    },
    /**
     * 获取一个m3d的包围盒范围(以最大包围盒中心点为原点)
     */
    _getM3DSetRange(m3dSet, boundingSphere) {
      // m3dSet.debugShowBoundingVolume = true;
      // 如果模型未加载完，这里transform为undefined
      // const transform = m3dSet._transform;
      const layersBoundingSphereCenter = boundingSphere.center;
      const layersBoundingSphereRadius = boundingSphere.radius;
      const transform = m3dSet._root.computedTransform;
      let xmin, ymin, xmax, ymax, zmin, zmax;
      if (!transform) {
        return null;
      }
      const inverseMatrix = Cesium.Matrix4.inverse(
        transform,
        new Cesium.Matrix4()
      );

      if (m3dSet.constructor.name == "Cesium3DTileset") {
        let range = { xmin, ymin, xmax, ymax, zmin, zmax };
        Object.keys(range).forEach(item => {
          if (item == "xmin" || item == "ymin")
            range[item] = -layersBoundingSphereRadius;
          if (item == "xmax" || item == "ymax")
            range[item] = layersBoundingSphereRadius;
          if (item == "zmin")
            range[item] = -layersBoundingSphereRadius/2;
          if (item == "zmax")
            range[item] = layersBoundingSphereRadius/2;
        })
        return range;
      }

      // 东北角
      const northeastCornerCartesian =
        m3dSet._root.boundingVolume.northeastCornerCartesian;
      // 东北角本地坐标
      const northeastCornerLocal = Cesium.Matrix4.multiplyByPoint(
        inverseMatrix,
        northeastCornerCartesian,
        new Cesium.Cartesian3()
      );
      // 西南角
      const southwestCornerCartesian =
        m3dSet._root.boundingVolume.southwestCornerCartesian;
      // 西南角本地坐标
      const southwestCornerLocal = Cesium.Matrix4.multiplyByPoint(
        inverseMatrix,
        southwestCornerCartesian,
        new Cesium.Cartesian3()
      );
      zmin = m3dSet._root.boundingVolume.minimumHeight;
      zmax = m3dSet._root.boundingVolume.maximumHeight;
      // 模型中心点本地坐标
      // const centerLocal = {
      //   x: (northeastCornerLocal.x + southwestCornerLocal.x) / 2,
      //   y: (northeastCornerLocal.y + southwestCornerLocal.y) / 2,
      //   z: (zmin + zmax) / 2
      // };
      // 模型中心点世界坐标
      // const center = Cesium.Matrix4.multiplyByPoint(
      //   transform,
      //   new Cesium.Cartesian3(centerLocal.x, centerLocal.y, centerLocal.z),
      //   new Cesium.Cartesian3()
      // );
      // this.viewer.entities.add({
      //   position: center,
      //   point: {
      //     color: Cesium.Color.GREEN,
      //     pixelSize: 20
      //   }
      // });

      // 多个模型合并包围盒中心点
      // this.viewer.entities.add({
      //   position: layersBoundingSphereCenter,
      //   point: {
      //     color: Cesium.Color.RED,
      //     pixelSize: 20
      //   }
      // });

      // 多个模型合并包围盒中心点本地坐标
      const layersBoundingSphereCenterLocal = Cesium.Matrix4.multiplyByPoint(
        inverseMatrix,
        layersBoundingSphereCenter,
        new Cesium.Cartesian3()
      );

      xmin = southwestCornerLocal.x - layersBoundingSphereCenterLocal.x;
      ymin = southwestCornerLocal.y - layersBoundingSphereCenterLocal.y;
      xmax = northeastCornerLocal.x - layersBoundingSphereCenterLocal.x;
      ymax = northeastCornerLocal.y - layersBoundingSphereCenterLocal.y;
      return { xmin, ymin, xmax, ymax, zmin, zmax };
    }
  }
};
</script>

<style scoped>
::v-deep .mapgis-ui-checkbox-wrapper {
  /* font-size: 12px; */
}

::v-deep .mapgis-ui-radio-wrapper {
  /* font-size: 12px; */
}

.model {
  max-height: 100px;
  overflow-y: auto;
}

.checkbox {
  /* font-size: 12px; */
}
</style>
