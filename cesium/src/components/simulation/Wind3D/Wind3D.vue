<template>
  <div>
    <mapgis-ui-group-tab
      title="服务地址"
      id="title-space"
      :hasBottomMargin="false"
    />
    <mapgis-ui-form-model-item>
      <mapgis-ui-row>
        <mapgis-ui-col :span="24">
          <mapgis-ui-input v-model="baseUrl"></mapgis-ui-input>
        </mapgis-ui-col>
      </mapgis-ui-row>
    </mapgis-ui-form-model-item>
    <mapgis-ui-input-number-panel
      size="large"
      label="最大粒子数"
      :range="[minParticlesNumber, maxParticlesNumber]"
      :step="particlesNumberStep"
      v-model="particlesNumber"
      @change="setParticlesNumber"
    />
    <mapgis-ui-input-number-panel
      size="large"
      label="拖尾透明度"
      :range="[minFadeOpacity, maxFadeOpacity]"
      :step="fadeOpacityStep"
      v-model="fadeOpacity"
      @change="setFadeOpacity"
    />
    <mapgis-ui-input-number-panel
      size="large"
      label="粒子速度因子"
      :range="[minSpeedFactor, maxSpeedFactor]"
      :step="speedFactorStep"
      v-model="speedFactor"
      @change="setSpeedFactor"
    />
    <mapgis-ui-input-number-panel
      size="large"
      label="线宽"
      :range="[minLineWidth, maxLineWidth]"
      :step="lineWidthStep"
      v-model="lineWidth"
      @change="setLineWidth"
    />
    <mapgis-ui-setting-footer>
      <mapgis-ui-button type="primary" @click="addWind">
        添加风场
      </mapgis-ui-button>
      <mapgis-ui-button @click="removeWind">
        移除风场
      </mapgis-ui-button>
    </mapgis-ui-setting-footer>
  </div>
</template>

<script>
import VueOptions from "../../Base/Vue/VueOptions";

export default {
  name: "mapgis-3d-wind",
  inject: ["Cesium", "vueCesium", "viewer"],
  props: {
    ...VueOptions,
    /**
     * @type String
     * @description 数据服务基地址
     */
    baseUrl: {
      type: String,
      default: ''
    },
    /**
     * @type Number
     * @description 最大粒子数
     */
    particlesNumber: {
      type: Number,
      default: 150000
    },
    /**
     * @type Number
     * @description 最大粒子数下限
     */
    minParticlesNumber: {
      type: Number,
      default: 0
    },
    /**
     * @type Number
     * @description 最大粒子数上限
     */
    maxParticlesNumber: {
      type: Number,
      default: 200000
    },
    /**
     * @type Number
     * @description 最大粒子数的滑动条间隔
     */
    particlesNumberStep: {
      type: Number,
      default: 1000
    },
    /**
     * @type Number
     * @description 拖尾透明度
     */
    fadeOpacity: {
      type: Number,
      default: 95
    },
    /**
     * @type Number
     * @description 拖尾透明度下限
     */
    minFadeOpacity: {
      type: Number,
      default: 0
    },
    /**
     * @type Number
     * @description 拖尾透明度上限
     */
    maxFadeOpacity: {
      type: Number,
      default: 100
    },
    /**
     * @type Number
     * @description 拖尾透明度的滑动条间隔
     */
    fadeOpacityStep: {
      type: Number,
      default: 1
    },
    /**
     * @type Number
     * @description 粒子速度因子
     */
    speedFactor: {
      type: Number,
      default: 5
    },
    /**
     * @type Number
     * @description 粒子速度因子下限
     */
    minSpeedFactor: {
      type: Number,
      default: 1
    },
    /**
     * @type Number
     * @description 粒子速度因子上限
     */
    maxSpeedFactor: {
      type: Number,
      default: 10
    },
    /**
     * @type Number
     * @description 粒子速度因子的滑动条间隔
     */
    speedFactorStep: {
      type: Number,
      default: 1
    },
    /**
     * @type Number
     * @description 线宽
     */
    lineWidth: {
      type: Number,
      default: 2
    },
    /**
     * @type Number
     * @description 线宽下限
     */
    minLineWidth: {
      type: Number,
      default: 1
    },
    /**
     * @type Number
     * @description 线宽上限
     */
    maxLineWidth: {
      type: Number,
      default: 10
    },
    /**
     * @type Number
     * @description 线宽的滑动条间隔
     */
    lineWidthStep: {
      type: Number,
      default: 1
    }
  },
  watch: {},
  data() {
    return {};
  },
  created() {},
  mounted() {},
  destroyed() {
    this.removeWind()
  },
  methods: {
    /**
     * 添加风场可视化图层
     * */
    addWind() {
      const that = this
      if (this.baseUrl) {
        this.loadNetCDF(
          this.baseUrl
        ).then((data) => {
          viewer.scene.logarithmicDepthBuffer = true
          const windManager = new zondy.cesium.Wind3D(viewer, data, {
            //最大粒子数
            particlesNumber: that.particlesNumber,
            //拖尾透明度
            fadeOpacity: that.fadeOpacity / 100,
            //粒子速度因子
            speedFactor: that.speedFactor / 10,
            //线宽
            lineWidth: that.lineWidth,
            // 风场颜色
            colors: [
              [0.015686, 0.054902, 0.847059],
              [0.12549, 0.313725, 1.0],
              [0.254902, 0.588235, 1.0],
              [0.427451, 0.756863, 1.0],
              [0.52549, 0.85098, 1.0],
              [0.611765, 0.933333, 1.0],
              [0.686275, 0.960784, 1.0],
              [0.807843, 1.0, 1.0],
              [1.0, 0.996078, 0.278431],
              [1.0, 0.921569, 0.0],
              [1.0, 0.768627, 0.0],
              [1.0, 0.564706, 0.0],
              [1.0, 0.282353, 0.0],
              [1.0, 0.0, 0.0],
              [0.835294, 0.0, 0.0],
              [0.619608, 0.0, 0.0]
            ]
          })
          vueCesium.WindManager.addSource(that.vueKey, that.vueIndex, windManager)
          windManager.init()
        })
      } else {
        this.$message.warning("请填写风场可视化服务地址");
      }
    },
    /**
     * 解析风场可视化数据
     * @param {String} filePath 风场可视化数据地址
     * @return {Promise} 请求完毕后的promise对象
     * */
    loadNetCDF(filePath) {
      return new Promise(function (resolve, reject) {
        var request = new XMLHttpRequest()
        request.open('GET', filePath)
        request.responseType = 'arraybuffer'

        request.onload = function () {
          var arrayToMap = function (array) {
            return array.reduce(function (map, object) {
              map[object.name] = object
              return map
            }, {})
          }

          var NetCDF = new netcdfjs(request.response)
          var data = {}

          var dimensions = arrayToMap(NetCDF.dimensions)
          data.dimensions = {}
          data.dimensions.lon = dimensions['lon'].size
          data.dimensions.lat = dimensions['lat'].size
          data.dimensions.lev = dimensions['lev'].size

          var variables = arrayToMap(NetCDF.variables)
          var uAttributes = arrayToMap(variables['U'].attributes)
          var vAttributes = arrayToMap(variables['V'].attributes)

          data.lon = {}
          data.lon.array = new Float32Array(
            NetCDF.getDataVariable('lon').flat()
          )
          data.lon.min = Math.min(...data.lon.array)
          data.lon.max = Math.max(...data.lon.array)

          data.lat = {}
          data.lat.array = new Float32Array(
            NetCDF.getDataVariable('lat').flat()
          )
          data.lat.min = Math.min(...data.lat.array)
          data.lat.max = Math.max(...data.lat.array)

          data.lev = {}
          data.lev.array = new Float32Array(
            NetCDF.getDataVariable('lev').flat()
          )
          data.lev.min = Math.min(...data.lev.array)
          data.lev.max = Math.max(...data.lev.array)

          data.U = {}
          let U1 = NetCDF.getDataVariable('U').flat()
          data.U.array = new Float32Array(U1.length * 4)
          for (let i = 0; i < U1.length; i++) {
            data.U.array[i * 4] = U1[i]
            data.U.array[i * 4 + 1] = U1[i]
            data.U.array[i * 4 + 2] = U1[i]
            data.U.array[i * 4 + 3] = U1[i]
          }
          data.U.min = uAttributes['min'].value
          data.U.max = uAttributes['max'].value

          data.V = {}
          let V1 = NetCDF.getDataVariable('V').flat()
          data.V.array = new Float32Array(V1.length * 4)
          for (let i = 0; i < V1.length; i++) {
            data.V.array[i * 4] = V1[i]
            data.V.array[i * 4 + 1] = V1[i]
            data.V.array[i * 4 + 2] = V1[i]
            data.V.array[i * 4 + 3] = V1[i]
          }
          // data.V.array = new Float32Array(NetCDF.getDataVariable('V').flat());
          data.V.min = vAttributes['min'].value
          data.V.max = vAttributes['max'].value

          resolve(data)
        }

        request.send()
      })
    },
    /**
    * 获取风场可视化对象
    * @return {Object} 风场可视化对象
    * */
    getWind3D() {
      const windManager = vueCesium.WindManager.findSource(this.vueKey, this.vueIndex)
      if (windManager) {
        return windManager.source
      }
    },
    /**
     * 设置最大粒子数
     * @param {Number} value 最大粒子数
     * */
    setParticlesNumber(value) {
      const wind3D = this.getWind3D()
      if (wind3D) {
        wind3D.particlesNumber = value
      }
    },
    /**
     * 设置拖尾透明度
     * @param {Number} value 拖尾透明度
     * */
    setFadeOpacity(value) {
      const wind3D = this.getWind3D()
      if (wind3D) {
        wind3D.fadeOpacity = value / 100
      }
    },
    /**
     * 设置粒子速度因子
     * @param {Number} value 粒子速度因子
     * */
    setSpeedFactor(value) {
      const wind3D = this.getWind3D()
      if (wind3D) {
        wind3D.speedFactor = value / 10
      }
    },
    /**
     * 设置线宽
     * @param {Number} value 线宽
     * */
    setLineWidth(value) {
      const wind3D = this.getWind3D()
      if (wind3D) {
        wind3D.lineWidth = value
      }
    },
    /**
     * 移除风场可视化
     * */
    removeWind() {
      let wind3D = this.getWind3D()
      if (wind3D) {
        wind3D.remove()
        vueCesium.WindManager.deleteSource(this.vueKey, this.vueIndex)
        wind3D = undefined
      }
    }
  }
};
</script>
