<template>
  <div>
    <slot>
      <mapgis-ui-group-tab
        title="模型"
        :has-top-margin="false"
      ></mapgis-ui-group-tab>
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
      <mapgis-ui-group-tab title="坐标轴"> </mapgis-ui-group-tab>
      <mapgis-ui-row class="axisCopy">
        <mapgis-ui-radio-group v-model="axisCopy">
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

      // radio样式
      radioStyle: {
        display: "block",
        height: "30px",
        lineHeight: "30px"
      },
      checkboxOptions: [],
      checked: [],
      vueIndexs: [],
      layerIndexs: []
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
          let id = vueIndex;
          let layerIndex = 0;
          if (id.includes(":")) {
            const strs = id.split(":");
            id = strs[0];
            layerIndex = strs[1];
          }
          // 确保vueIndexs和layerIndexs同步保存
          this.vueIndexs.push(id);
          this.layerIndexs.push(layerIndex);
          const obj = { label: title, value: id };
          this.checkboxOptions.push(obj);
        });
      },
      deep: true,
      immediate: true
    },
    checked: {
      deep: true,
      immediate: true,
      handler: function() {
        this.removeDynaCut();
        this.changeChecked();
      }
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
        this.changeChecked();
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
      // return new Cesium.GeoJsonDataSource.load(baseUrl, options);
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
      this.changeChecked();
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
      this.changeChecked();
    },

    changeChecked() {
      this.m3dIsReady().then(m3dSetArray => {
        if (m3dSetArray && m3dSetArray.length > 0) {
          const { xmin, ymin, xmax, ymax, height } = this._getM3DSetArrayRange(
            m3dSetArray
          );
          if (m3dSetArray.length == 1) {
            this.zoomToM3dLayerBySource(m3dSetArray[0]);
          } else if (m3dSetArray.length > 1) {
            // 如果多个m3d的最大包围盒长宽大于第一个m3d的长宽的五倍，则提示用户剖切效果可能不好
            const m1Range = this._getM3DSetArrayRange([m3dSetArray[0]]);
            const m1Box = this._getM3DSetArrayBox(m1Range);
            const maxBox = this._getM3DSetArrayBox({
              xmin,
              ymin,
              xmax,
              ymax,
              height
            });
            if (
              maxBox.xLength > m1Box.xLength * 5 &&
              maxBox.yLength > m1Box.yLength * 5
            ) {
              this.$message.warning("模型之间的距离太大，剖切效果可能不好");
            }
            this.viewer.camera.flyTo({
              destination: this.Cesium.Rectangle.fromDegrees(
                xmin,
                ymin,
                xmax,
                ymax
              )
            });
          }
          this.getMaxMinBySource({ xmin, ymin, xmax, ymax, height });
        }
      });
    },

    /**
     * 判断传入的m3d图层是否加载完毕
     */
    m3dIsReady() {
      const {
        vueCesium,
        vueKey,
        vueIndex,
        checked,
        vueIndexs,
        layerIndexs
      } = this;
      return new Promise((resolve, reject) => {
        if (checked.length > 0) {
          this.$_getM3DByInterval(
            function(m3ds) {
              if (m3ds && m3ds.length > 0) {
                const sources = [];
                for (let i = 0; i < m3ds.length; i++) {
                  const { key, source } = m3ds[i];
                  const index = vueIndexs.indexOf(key);
                  const layerIndex = layerIndexs[index];
                  sources.push(source[layerIndex]);
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
    clippingDirection() {
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
      this.m3dIsReady().then(() => {
        if (this.max == undefined || this.min == undefined) {
          return;
        }
        this.clearTimer();
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
      this.clearTimer();
      this.removeDynaCut();
    },

    /**
     * 开始分析分析
     */
    startClipping() {
      this.m3dIsReady().then(m3dSetArray => {
        this.clearTimer();
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
        const direction = this.clippingDirection();
        // 创建剖切对象实例
        dynamicSectionAnalysis.createModelCuttingPlane(direction, {
          distance: this.distanceCopy || 0,
          color: this.edgeColor(),
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
    edgeColor() {
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
    clearTimer() {
      if (this.timer) {
        window.clearInterval(this.timer);
        this.timer = null;
        this.readonly = false;
      }
    },

    /**
     * 跳转到模型范围，视角不变。基于source
     * @param source
     */
    zoomToM3dLayerBySource(source) {
      const { boundingSphere } = source;
      this.viewer.camera.viewBoundingSphere(
        boundingSphere,
        new Cesium.HeadingPitchRange(0.0, -0.5, boundingSphere.radius)
      );
      this.viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
    },

    /**
     * 获取剖切面离包围盒中心点的最大最小值
     */
    _getMaxMinByRange(range) {
      let m3dBox = this._getM3DSetArrayBox(range);
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
      let height;
      for (let i = 0; i < m3dSetArray.length; i++) {
        const m3d = m3dSetArray[i];
        const northeastCornerCartesian =
          m3d._root.boundingVolume.northeastCornerCartesian;
        const southwestCornerCartesian =
          m3d._root.boundingVolume.southwestCornerCartesian;
        //这里：东南角和西北角在外包盒子的同一平面上
        const p1 = this.$_degreeFromCartesian(southwestCornerCartesian); // 西南角
        const p2 = this.$_degreeFromCartesian(northeastCornerCartesian); // 东北角
        if (xmin == undefined || p1.longitude < xmin) {
          xmin = p1.longitude;
        }
        if (ymin == undefined || p1.latitude < ymin) {
          ymin = p1.latitude;
        }
        if (xmax == undefined || p2.longitude > xmax) {
          xmax = p2.longitude;
        }
        if (ymax == undefined || p2.latitude > ymax) {
          ymax = p2.latitude;
        }
        mHeight =
          m3d._root.boundingVolume.maximumHeight -
          m3d._root.boundingVolume.minimumHeight;
        if (height == undefined || mHeight > height) {
          height = mHeight;
        }
      }
      return { xmin, ymin, xmax, ymax, height };
    },

    /**
     * 获取多个M3D的最大包围盒(长宽高)
     */
    _getM3DSetArrayBox(range) {
      const { xmin, ymin, xmax, ymax, height } = range;
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
      return {
        xLength,
        yLength,
        height
      };
    }
  }
};
</script>
