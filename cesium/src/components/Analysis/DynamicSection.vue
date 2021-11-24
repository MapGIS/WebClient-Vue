<template>
  <div>
    <slot>
      <mapgis-ui-group-tab title="模型" :has-top-margin="false">
        <mapgis-ui-tooltip slot="handle" placement="bottomRight">
          <template slot="title">
            <span>{{ info }}</span>
          </template>
          <mapgis-ui-iconfont type="mapgis-info"></mapgis-ui-iconfont>
        </mapgis-ui-tooltip>
      </mapgis-ui-group-tab>
      <mapgis-ui-row class="model">
        <mapgis-ui-checkbox-group
          v-if="checkboxOptions.length > 0"
          @change="onCheckboxGroupChange"
        >
          <mapgis-ui-row
            v-for="(option, index) in checkboxOptions"
            :key="`model-${index}`"
          >
            <mapgis-ui-checkbox :value="option.value">
              {{ option.label }}
            </mapgis-ui-checkbox>
          </mapgis-ui-row>
        </mapgis-ui-checkbox-group>
        <div v-else>暂无数据！</div>
      </mapgis-ui-row>
      <mapgis-ui-group-tab title="坐标轴"> </mapgis-ui-group-tab>
      <mapgis-ui-row class="axis">
        <mapgis-ui-radio-group v-model="axisCopy" size="small">
          <mapgis-ui-radio value="X"> X轴 </mapgis-ui-radio>
          <mapgis-ui-radio value="Y"> Y轴 </mapgis-ui-radio>
          <mapgis-ui-radio value="Z"> Z轴 </mapgis-ui-radio>
        </mapgis-ui-radio-group>
      </mapgis-ui-row>
      <mapgis-ui-group-tab title="参数设置"></mapgis-ui-group-tab>
      <mapgis-ui-setting-form :label-width="72">
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
        <mapgis-ui-form-item label="剖切距离">
          <mapgis-ui-slider
            v-model="distanceCopy"
            :min="min"
            :max="max"
            @change="setDistance"
            :disabled="readonly"
          />
        </mapgis-ui-form-item>
      </mapgis-ui-setting-form>
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
      default: "rgb(200,200,200,0.5)"
    },
    time: {
      type: Number,
      default: 10
    },
    distance: {
      type: Number,
      default: 0
    }
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
        "多模型剖切适用于两个及以上模型，且模型之间在空间上有重叠部分，或者在某个面上有重叠部分，比如地面楼栋模型和楼栋地下管道模型"
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
        this.removeDynaCut();
      }
      vueCesium.DynamicSectionAnalysisManager.deleteSource(vueKey, vueIndex);
      this.$emit("unload", this);
      this.stopClipping();
    },
    onCheckboxGroupChange(val) {
      this.checked = [...val];
      this.removeDynaCut();
      this._getMaxMin();
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
     * 判断传入的m3d图层是否加载完毕
     */
    _m3dIsReady() {
      const { vueKey, checked } = this;
      return new Promise((resolve, reject) => {
        if (checked.length > 0) {
          this.$_getM3DByInterval(
            function(m3ds) {
              if (m3ds && m3ds.length > 0) {
                let sources = [];
                for (let i = 0; i < m3ds.length; i++) {
                  const { source } = m3ds[i];
                  sources = sources.concat(source);
                }
                resolve(sources);
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
      switch (this.axisCopy) {
        case "X":
          return new this.Cesium.Cartesian3(-1.0, 0.0, 0.0);
        case "Y":
          return new this.Cesium.Cartesian3(0.0, -1.0, 0.0);
        case "Z":
          return new this.Cesium.Cartesian3(0.0, 0.0, -1.0);
        default:
          return new this.Cesium.Cartesian3(-1.0, 0.0, 0.0);
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
      this.removeDynaCut();
    },

    /**
     * 开始分析
     */
    startClipping() {
      this._m3dIsReady().then(m3dSetArray => {
        this._clearTimer();
        this.removeDynaCut();
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
    removeDynaCut() {
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
      let m3dBox = this._getBoxXYZLength(range);
      const { xLength, yLength, height } = m3dBox;
      let max = 10000;
      let min = -max;
      let length = max - min;
      switch (this.axis) {
        case "X":
          length = xLength;
          break;
        case "Y":
          length = yLength;
          break;
        case "Z":
          length = height;
          break;
        default:
          break;
      }
      this.distanceCopy = length / 2;
      this.max = length;
      this.min = -length;
    },

    /**
     * 获取多个M3D的最大包围盒范围
     */
    _getM3DSetArrayRange(m3dSetArray) {
      let xmin;
      let ymin;
      let xmax;
      let ymax;
      let zmin;
      let zmax;
      for (let i = 0; i < m3dSetArray.length; i++) {
        const m3d = m3dSetArray[i];
        const range = this._getM3DSetRange(m3d);
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
     * 获取包围盒的长宽高
     */
    _getBoxXYZLength(range) {
      const { xmin, ymin, xmax, ymax, zmin, zmax } = range;
      // 西南角
      const nP1 = Cesium.Cartesian3.fromDegrees(xmin, ymin, 0);
      // 东北角
      const nP2 = Cesium.Cartesian3.fromDegrees(xmax, ymax, 0);
      // 西北角
      const nP3 = Cesium.Cartesian3.fromDegrees(xmin, ymax, 0);
      // 东南角
      const nP4 = Cesium.Cartesian3.fromDegrees(xmax, ymin, 0);
      //求出平面的长和宽
      let xLength = Cesium.Cartesian3.distance(nP4, nP1);
      let yLength = Cesium.Cartesian3.distance(nP3, nP1);
      const height = zmax - zmin;
      return {
        xLength,
        yLength,
        height
      };
    },
    /**
     * 获取一个m3d的包围盒范围
     */
    _getM3DSetRange(m3dSet) {
      const northeastCornerCartesian =
        m3dSet._root.boundingVolume.northeastCornerCartesian;
      const southwestCornerCartesian =
        m3dSet._root.boundingVolume.southwestCornerCartesian;
      //这里：东南角和西北角在外包盒子的同一平面上
      const p1 = this.$_degreeFromCartesian(southwestCornerCartesian); // 西南角
      const p2 = this.$_degreeFromCartesian(northeastCornerCartesian); // 东北角
      const xmin = p1.longitude;
      const ymin = p1.latitude;
      const xmax = p2.longitude;
      const ymax = p2.latitude;
      const zmin = m3dSet._root.boundingVolume.minimumHeight;
      const zmax = m3dSet._root.boundingVolume.maximumHeight;
      return { xmin, ymin, xmax, ymax, zmin, zmax };
    }
    /**
     * 判断多个m3d的包围盒是否存在交集，暂时只判断了，单个模型与其他模型的最大包围盒没有交集的情况
     */
    // _isM3DSetArrayBoxIntersect(m3dSetArray) {
    //   for (let i = 0; i < m3dSetArray.length; i++) {
    //     const m3dSet = m3dSetArray[i];
    //     const m3dSetCopy = [...m3dSetArray]; //拷贝m3dSetCopy
    //     m3dSetCopy.splice(i, 1);
    //     const rangeSingle = this._getM3DSetRange(m3dSet);
    //     const rangeArray = this._getM3DSetArrayRange(m3dSetCopy);
    //     // 如果当前的m3d包围盒与包含其他m3d的最大包围盒没有交集，则直接判断模型之间，有模型是单个的
    //     if (!this._isBoxsIntersect(rangeSingle, rangeArray)) {
    //       return false;
    //     }
    //   }
    //   return true;
    // },
    // /**
    //  * 判断两个包围盒是否有交集
    //  */
    // _isBoxsIntersect(range1, range2) {
    //   const xInterset = this._isIntersect(
    //     [range1.xmin, range1.xmax],
    //     [range2.xmin, range2.xmax]
    //   );
    //   const yInterset = this._isIntersect(
    //     [range1.xmin, range1.xmax],
    //     [range2.xmin, range2.xmax]
    //   );
    //   const zInterset = this._isIntersect(
    //     [range1.zmin, range1.zmax],
    //     [range2.zmin, range2.zmax]
    //   );
    //   return xInterset && yInterset && zInterset;
    // },
    // // 判断两个数值区间是否有相交
    // _isIntersect(arr1, arr2) {
    //   let start = [Math.min(...arr1), Math.min(...arr2)]; //区间的两个最小值
    //   let end = [Math.max(...arr1), Math.max(...arr2)]; //区间的两个最大值
    //   return Math.max(...start) <= Math.min(...end); //最大值里的最小值 是否 小于等于 最大值的最小值
    // }
  }
};
</script>

<style scoped>
::v-deep .mapgis-ui-checkbox-wrapper {
  font-size: 12px;
}

::v-deep .mapgis-ui-radio-wrapper {
  font-size: 12px;
}

.model {
  max-height: 100px;
  overflow-y: auto;
}
</style>
