<template>
  <div class="flood-analyse-box" v-if="initial">
    <a-row>
      <a-col :span="8">
        <p class="flood-title">最大淹没高度(米):</p>
      </a-col>
      <a-col :span="12">
        <a-slider v-model="currentHeightCopy" :min="0" :max="Number(maxHeightCopy)" :disabled="disabled"/>
      </a-col>
      <a-col :span="4">
        <a-input v-model="maxHeightCopy"/>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="8">
        <p class="flood-title">颜色:</p>
      </a-col>
      <a-col :span="12">
        <a-input class="flood-input" v-model="floodColorCopy"/>
      </a-col>
      <div class="flood-color-picker">
        <colorPicker v-model="floodColorCopy" v-on:change="headleChangeColor"/>
      </div>
    </a-row>
    <a-row>
      <a-col :span="8">
        <p class="flood-title">洪水淹没速度:</p>
      </a-col>
      <a-col :span="12">
        <a-input class="flood-input" v-model="floodSpeedCopy"/>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="8">
        <p class="flood-title">反射光强度:</p>
      </a-col>
      <a-col :span="12">
        <a-input class="flood-input" v-model="specularIntensityCopy"/>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="8">
        <p class="flood-title">水波高度:</p>
      </a-col>
      <a-col :span="12">
        <a-input class="flood-input" v-model="amplitudeCopy"/>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="8">
        <p class="flood-title">水纹速度:</p>
      </a-col>
      <a-col :span="12">
        <a-input class="flood-input" v-model="animationSpeedCopy"/>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="8">
        <p class="flood-title">水纹频率:</p>
      </a-col>
      <a-col :span="12">
        <a-input class="flood-input" v-model="frequencyCopy"/>
      </a-col>
    </a-row>
    <!--      <a-row>-->
    <!--        <a-col :span="8">-->
    <!--          <p class="flood-title">绘制工具:</p>-->
    <!--        </a-col>-->
    <!--        <a-col :span="8">-->
    <!--          <a-select-->
    <!--              class="flood-select"-->
    <!--              :default-value="selectDefault"-->
    <!--              @change="$_selectChange"-->
    <!--          >-->
    <!--            <a-select-option v-for="(tool,index) in tools" :key="tool.name">{{ tool.value }}</a-select-option>-->
    <!--          </a-select>-->
    <!--        </a-col>-->
    <!--      </a-row>-->
    <a-row>
      <a-col :span="8">
        <a-button class="flood-button" type="primary" @click="$_startAnalyse" :disabled="!disabled">开始分析</a-button>
      </a-col>
      <a-col :span="8">
        <a-button class="flood-button flood-button-stop" @click="$_stopAnalyse" :disabled="disabled">停止分析</a-button>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import ServiceLayer from "./ServiceLayer";

export default {
  name: "mapgis-3d-flood-no-slot",
  mixins: [ServiceLayer],
  props: {
    startHeight: {
      type: Number,
      default: 0
    },
    minHeight: {
      type: Number,
      default: 0
    },
    currentHeight: {
      type: Number,
      default: 0
    },
    maxHeight: {
      type: Number,
      default: 200
    },
    floodColor: {
      type: String,
      default: "#4e81bb"
    },
    floodSpeed: {
      type: Number,
      default: 30
    },
    specularIntensity: {
      type: Number,
      default: 1
    },
    amplitude: {
      type: Number,
      default: 10
    },
    animationSpeed: {
      type: Number,
      default: 0.01
    },
    frequency: {
      type: Number,
      default: 1000
    }
  },
  watch: {
    currentHeightCopy: {
      handler: function () {
        //开始分析后的下一帧，开启高度监听
        if (this.isFlood) {
          const {vueKey, vueIndex} = this;
          let webGlobe = window.CesiumZondy.getWebGlobe(vueKey);
          let floodAnalyseManager = window.CesiumZondy.FloodAnalyseManager.findSource(vueKey, vueIndex);
          if (floodAnalyseManager && floodAnalyseManager.hasOwnProperty("source") && floodAnalyseManager.source) {
            let floodAnalyse = floodAnalyseManager.source;
            floodAnalyse.maxHeight = Number(this.currentHeightCopy);
            floodAnalyse.floodSpeed = Number(this.floodSpeedCopy);
            floodAnalyse.frequency = Number(this.frequencyCopy);
            floodAnalyse.animationSpeed = Number(this.animationSpeedCopy);
            floodAnalyse.amplitude = Number(this.amplitudeCopy);
            floodAnalyse.specularIntensity = Number(this.specularIntensityCopy);
            floodAnalyse.isDownFlood = Number(this.floodHeightCopyTwo) > Number(this.currentHeightCopy);
            webGlobe.scene.requestRender();
            //存储高度，方便下一次比较
            this.floodHeightCopyTwo = this.currentHeightCopy;
          }
        }
      }
    },
    startHeight: {
      handler: function () {
        this.startHeightCopy = this.startHeight;
      }
    },
    minHeight: {
      handler: function () {
        this.minHeightCopy = this.minHeight;
      }
    },
    floodColor: {
      handler: function () {
        this.floodColorCopy = this.floodColor;
      }
    },
    maxHeight: {
      handler: function () {
        this.maxHeightCopy = this.maxHeight;
      }
    },
    floodSpeed: {
      handler: function () {
        this.floodSpeedCopy = this.floodSpeed;
      }
    },
    specularIntensity: {
      handler: function () {
        this.specularIntensityCopy = this.specularIntensity;
      }
    },
    amplitude: {
      handler: function () {
        this.amplitudeCopy = this.amplitude;
      }
    },
    animationSpeed: {
      handler: function () {
        this.animationSpeedCopy = this.animationSpeed;
      }
    },
    frequency: {
      handler: function () {
        this.frequencyCopy = this.frequency;
      }
    },
    currentHeight: {
      handler: function () {
        this.currentHeightCopy = this.currentHeight;
      }
    }
  },
  data() {
    return {
      selectDefault: 'startDrawingPolygon',
      drawToolName: "startDrawingPolygon",
      // tools: [{
      //   name: "startDrawingPolygon",
      //   value: "多边形工具"
      // }, {
      //   name: "startDrawingExtent",
      //   value: "矩形工具"
      // }],
      initial: false,
      startHeightCopy: 0,
      minHeightCopy: 0,
      currentHeightCopy: 0,
      currentHeightCopyTwo: 0,
      maxHeightCopy: 0,
      floodColorCopy: "#4e81bb",
      floodSpeedCopy: 0,
      specularIntensityCopy: 0,
      amplitudeCopy: 0,
      animationSpeedCopy: 0,
      frequencyCopy: 0,
      disabled: true,
      isFlood: false
    }
  },
  mounted() {
    let vm = this;
    window.CesiumZondy.getWebGlobeByInterval(function (webGlobe) {
      vm.$_init();
      vm.initial = true;
      vm.$emit("load", vm, webGlobe);
    }, this.vueKey)
  },
  methods: {
    //对外的开始分析方法
    startAnalyse() {
      this.$_startAnalyse();
    },
    //对外的停止分析方法
    stopAnalyse() {
      this.$_stopAnalyse();
    },
    //颜色拾取事件
    headleChangeColor(color) {
      this.floodColorCopy = color;
    },
    //由于无法改变props，因此复制这些值
    $_init() {
      let vm = this;
      Object.keys(this.$props).forEach(function (key) {
        vm[key + "Copy"] = vm.$props[key];
      });
    },
    // $_selectChange(value) {
    //   this.drawToolName = value;
    // },
    //开始洪水淹没分析
    $_floodAnalyse(webGlobe, positions) {
      //确保开始洪水分析后，不会触发currentHeightCopy的更新操作，不然会出现分析失灵的情况
      this.isFlood = false;
      //如果没有注入Cesium，则取得window上面的
      let {Cesium, vueKey, vueIndex} = this;
      if (!Cesium) {
        Cesium = window.Cesium;
      }
      //开始分析前，删除上一次分析
      if (webGlobe.scene.VisualAnalysisManager._visualAnalysisList.length > 0) {
        webGlobe.scene.VisualAnalysisManager.removeAll();
        window.CesiumZondy.FloodAnalyseManager.deleteSource(vueKey, vueIndex);
      }
      //将笛卡尔坐标转为经纬度坐标
      let cartographics = [], height = 0;
      for (let i = 0; i < positions.length; i++) {
        cartographics.push(Cesium.Cartographic.fromCartesian(positions[i]));
        height += Cesium.Cartographic.fromCartesian(positions[i]).height;
      }
      //极端洪水淹没平均高度
      this.currentHeightCopy = height / cartographics.length;
      this.currentHeightCopyTwo = this.currentHeightCopy;
      //初始化新的洪水淹没分析
      let floodAnalyse = new Cesium.FloodAnalysis(webGlobe.viewer, positions, {
        //设置洪水淹没水体起始高度
        startHeight: Number(this.startHeightCopy),
        //设置洪水淹没区域动画最低高度
        minHeight: Number(this.minHeightCopy),
        //设置洪水淹没区域最高高度
        maxHeight: Number(this.currentHeightCopy),
        //设置洪水上涨速度
        floodSpeed: Number(this.floodSpeedCopy),
        floodColor: Cesium.Color.fromCssColorString(this.floodColorCopy),
        //水纹频率 指波浪的个数
        frequency: Number(this.frequencyCopy),
        //水纹速度
        animationSpeed: Number(this.animationSpeedCopy),
        //水波的高度
        amplitude: Number(this.amplitudeCopy),
        // 指定光线强度
        specularIntensity: Number(this.specularIntensityCopy),
      });
      window.CesiumZondy.FloodAnalyseManager.addSource(vueKey, vueIndex, floodAnalyse);
      //设置深度检测
      webGlobe.viewer.scene.globe.depthTestAgainstTerrain = true;
      //添加洪水淹没结果显示
      webGlobe.scene.VisualAnalysisManager.add(floodAnalyse);
      //一定是在下一帧，开启对currentHeightCopy的监听操作
      this.$nextTick(function () {
        this.isFlood = true;
      })
    },
    //开始洪水淹没分析
    $_startAnalyse() {
      //开始分析前先禁用进度条以及停止分析按钮
      this.disabled = false;
      this.$_initAnalysis(this.drawToolName, "$_floodAnalyse");
    },
    //停止洪水淹没分析
    $_stopAnalyse() {
      if (webGlobe.scene.VisualAnalysisManager._visualAnalysisList.length > 0) {
        //删除淹没分析
        webGlobe.scene.VisualAnalysisManager.removeAll();
        //停止绘制
        window.drawElement.stopDrawing();
        //启用开始分析按钮
        this.disabled = true;
        //高度置零
        this.currentHeight = 0;
        this.currentHeightCopy = 0;
      }
    }
  }
}
</script>

<style scoped>
.flood-analyse-box {
  position: absolute;
  top: 10px;
  left: 10px;
  width: 376px;
  height: 326px;
  background: white;
  border-radius: 5px;
  padding: 10px;
}

.flood-title {
  text-align: left;
  margin-top: 0.3em;
}

.flood-input {
  width: 235px;
}

.flood-color-picker {
  position: absolute;
  right: 10px;
  top: 8px;
}

.flood-button {
  position: absolute;
  right: -140px;
}

.flood-button-stop {
  right: -117px;
}

.flood-select {
  position: absolute;
  left: 0;
  width: 235px;
}

.flood-analyse-box .ant-slider {
  margin: 10px 6px 10px;
}
</style>