<template>
  <div>
    <slot>
      <div class="flood-analyse-box" v-show="showOptionsPannel">
        <mapgis-ui-row>
          <mapgis-ui-col :span="8">
            <p class="flood-title">最大淹没高度(米):</p>
          </mapgis-ui-col>
          <mapgis-ui-col :span="16">
            <mapgis-ui-input v-model="maxHeightCopy"/>
          </mapgis-ui-col>
        </mapgis-ui-row>
        <mapgis-ui-row>
          <mapgis-ui-col :span="8">
            <p class="flood-title">最小淹没高度(米):</p>
          </mapgis-ui-col>
          <mapgis-ui-col :span="16">
            <mapgis-ui-input v-model="startHeightCopy"/>
          </mapgis-ui-col>
        </mapgis-ui-row>
        <mapgis-ui-row>
          <mapgis-ui-col :span="8">
            <p class="flood-title">颜色:</p>
          </mapgis-ui-col>
          <mapgis-ui-col :span="12">
            <mapgis-ui-input class="flood-input" v-model="floodColorCopy"/>
          </mapgis-ui-col>
          <div v-if="showPicker" class="flood-color-picker">
            <colorPicker v-model="floodColorCopy" v-on:change="headleChangeColor"/>
          </div>
        </mapgis-ui-row>
        <mapgis-ui-row>
          <mapgis-ui-col :span="8">
            <p class="flood-title">洪水淹没速度:</p>
          </mapgis-ui-col>
          <mapgis-ui-col :span="12">
            <mapgis-ui-input class="flood-input" v-model="floodSpeedCopy"/>
          </mapgis-ui-col>
        </mapgis-ui-row>
        <mapgis-ui-row>
          <mapgis-ui-col :span="8">
            <p class="flood-title">反射光强度:</p>
          </mapgis-ui-col>
          <mapgis-ui-col :span="12">
            <mapgis-ui-input class="flood-input" v-model="specularIntensityCopy"/>
          </mapgis-ui-col>
        </mapgis-ui-row>
        <mapgis-ui-row>
          <mapgis-ui-col :span="8">
            <p class="flood-title">水波高度:</p>
          </mapgis-ui-col>
          <mapgis-ui-col :span="12">
            <mapgis-ui-input class="flood-input" v-model="amplitudeCopy"/>
          </mapgis-ui-col>
        </mapgis-ui-row>
        <mapgis-ui-row>
          <mapgis-ui-col :span="8">
            <p class="flood-title">水纹速度:</p>
          </mapgis-ui-col>
          <mapgis-ui-col :span="12">
            <mapgis-ui-input class="flood-input" v-model="animationSpeedCopy"/>
          </mapgis-ui-col>
        </mapgis-ui-row>
        <mapgis-ui-row>
          <mapgis-ui-col :span="8">
            <p class="flood-title">水纹频率:</p>
          </mapgis-ui-col>
          <mapgis-ui-col :span="12">
            <mapgis-ui-input class="flood-input" v-model="frequencyCopy"/>
          </mapgis-ui-col>
        </mapgis-ui-row>
        <!--      <mapgis-ui-row>-->
        <!--        <mapgis-ui-col :span="8">-->
        <!--          <p class="flood-title">绘制工具:</p>-->
        <!--        </mapgis-ui-col>-->
        <!--        <mapgis-ui-col :span="8">-->
        <!--          <mapgis-ui-select-->
        <!--              class="flood-select"-->
        <!--              :default-value="selectDefault"-->
        <!--              @change="$_selectChange"-->
        <!--          >-->
        <!--            <mapgis-ui-select-option v-for="(tool,index) in tools" :key="tool.name">{{ tool.value }}</mapgis-ui-select-option>-->
        <!--          </mapgis-ui-select>-->
        <!--        </mapgis-ui-col>-->
        <!--      </mapgis-ui-row>-->
        <mapgis-ui-row>
          <mapgis-ui-button class="flood-button start" type="primary" @click="$_startAnalyse" :disabled="!disabled">开始分析
          </mapgis-ui-button>
        </mapgis-ui-row>
      </div>
      <div class="flood-analyse-box" style="height: 127px;" v-show="showResultPannel">
        <mapgis-ui-row>
          <mapgis-ui-col :span="8">
            <p class="flood-title">最大淹没高度(米):</p>
          </mapgis-ui-col>
          <mapgis-ui-col :span="16">
            <mapgis-ui-input v-model="maxHeightCopy"/>
          </mapgis-ui-col>
        </mapgis-ui-row>
        <mapgis-ui-row>
          <mapgis-ui-col :span="8">
            <p class="flood-title">高度选择(米):</p>
          </mapgis-ui-col>
          <mapgis-ui-col :span="16">
            <mapgis-ui-slider v-model="currentHeightCopy" :min="Number(startHeightCopyTwo)" :max="Number(maxHeightCopy)"
                      :disabled="disabled"/>
          </mapgis-ui-col>
        </mapgis-ui-row>
        <mapgis-ui-row>
          <mapgis-ui-button class="flood-button back" style="right: 168px;" type="primary" @click="$_up" :disabled="upDisabled">{{upTitle}}</mapgis-ui-button>
          <mapgis-ui-button class="flood-button back" style="right: 95px;" type="primary" @click="$_down" :disabled="downDisabled">{{downTitle}}</mapgis-ui-button>
          <mapgis-ui-button class="flood-button back" @click="$_stopAnalyseToStart">停止分析</mapgis-ui-button>
        </mapgis-ui-row>
      </div>
    </slot>
  </div>
</template>

<script>
import ServiceLayer from "./BaseLayer";

export default {
  name: "mapgis-3d-flood",
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
    },
    showPicker: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    currentHeightCopy: {
      handler: function () {
        //开始分析后的下一帧，开启高度监听
        if (this.isFlood) {
          const {vueKey, vueIndex} = this;
          let webGlobe = window.CesiumZondy.getWebGlobe(vueKey);
          let floodAnalyse = window.floodAnalyse;
          if (floodAnalyse) {
            floodAnalyse.maxHeight = Number(this.currentHeightCopy);
            floodAnalyse.floodSpeed = Number(this.floodSpeedCopy);
            floodAnalyse.frequency = Number(this.frequencyCopy);
            floodAnalyse.animationSpeed = Number(this.animationSpeedCopy);
            floodAnalyse.amplitude = Number(this.amplitudeCopy);
            floodAnalyse.specularIntensity = Number(this.specularIntensityCopy);
            floodAnalyse.isDownFlood = Number(this.floodHeightCopyTwo) > Number(this.currentHeightCopy);
            //存储高度，方便下一次比较
            this.floodHeightCopyTwo = Number(this.currentHeightCopy);
          }
          if(this.currentHeightCopy === this.maxHeightCopy){
            this.upTitle = "上升";
            this.upDisabled = true;
            this.downDisabled = false;
          }else if(this.currentHeightCopy === parseInt(this.startHeightCopyTwo)){
            this.downTitle = "下降";
            this.upDisabled = false;
            this.downDisabled = true;
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
        this.currentHeightCopy = parseInt(Number(this.currentHeight));
      }
    },
    maxHeightCopy: {
      handler: function () {
        if(Number(this.maxHeightCopy) <= Number(this.currentHeightCopy)){
          this.maxHeightCopy = Number(this.currentHeightCopy);
          this.upDisabled = true;
        }
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
      showOptionsPannel: false,
      showResultPannel: false,
      startHeightCopy: 0,
      minHeightCopy: 0,
      startHeightCopyTwo: 0,
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
      isFlood: false,
      isPlayer: false,
      upTitle: "上升",
      downTitle: "下降",
      upDisabled: false,
      downDisabled: false,
    }
  },
  mounted() {
    let vm = this;
    window.CesiumZondy.getWebGlobeByInterval(function (webGlobe) {
      vm.$_init();
      vm.showOptionsPannel = true;
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
      let vm = this;
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
        let cat = Cesium.Cartographic.fromCartesian(positions[i]);
        height += cat.height;
        if (Number(this.startHeightCopy) === 0) {
          if (i === 0) {
            this.startHeightCopyTwo = cat.height;
          } else {
            if (cat.height < this.startHeightCopyTwo) {
              this.startHeightCopyTwo = cat.height;
            }
          }
        } else {
          this.startHeightCopyTwo = this.startHeightCopy;
        }
      }
      //极端洪水淹没平均高度
      this.currentHeightCopy = parseInt(height / cartographics.length);
      this.currentHeightCopyTwo = this.currentHeightCopy;
      //初始化新的洪水淹没分析
      let floodAnalyse = new Cesium.FloodAnalysis(webGlobe.viewer, positions, {
        //设置洪水淹没水体起始高度
        startHeight: Number(this.startHeightCopyTwo),
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
      window.floodAnalyse = floodAnalyse;
      //设置深度检测
      webGlobe.viewer.scene.globe.depthTestAgainstTerrain = true;
      //添加洪水淹没结果显示
      webGlobe.scene.VisualAnalysisManager.add(floodAnalyse);
      //一定是在下一帧，开启对currentHeightCopy的监听操作
      this.$nextTick(function () {
        this.showResultPannel = true;
        this.showOptionsPannel = false;
        //停止绘制
        window.drawElement.stopDrawing();
        this.isFlood = true;
      })
    },
    //开始洪水淹没分析
    $_startAnalyse() {
      //开始分析前先禁用进度条以及停止分析按钮
      this.disabled = false;
      this.$_initAnalysis(this.drawToolName, "$_floodAnalyse");
    },
    $_stopAnalyseToStart() {
      this.$_stopAnalyse();
      this.showResultPannel = false;
      this.showOptionsPannel = true;
      this.startHeightCopyTwo = 0;
      this.isPlayer = true;
    },
    $_up(){
      switch (this.upTitle){
        case "上升":
          this.$_playAnalyse(this.currentHeightCopy,this.maxHeightCopy,1);
          this.downDisabled = true;
          this.upTitle = "暂停";
          break;
        case "暂停":
          this.$_pause();
          this.downDisabled = false;
          this.upTitle = "上升";
          break;
        default:
          break;
      }
    },
    $_down(){
      switch (this.downTitle){
        case "下降":
          this.$_playAnalyse(this.startHeightCopyTwo,this.currentHeightCopy,-1);
          this.upDisabled = true;
          this.downTitle = "暂停";
          break;
        case "暂停":
          this.$_pause();
          this.upDisabled = false;
          this.downTitle = "下降";
          break;
        default:
          break;
      }
    },
    $_pause(){
      this.isPlayer = false;
    },
    //对外的playAnalyse
    playAnalyse(start,end,forward,rate,timeDiff){
      this.$_playAnalyse(start,end,forward,rate,timeDiff);
    },
    //对外的上升方法
    up(){
      this.$_playAnalyse(this.currentHeightCopy,this.maxHeightCopy,1);
    },
    //对外的下降方法
    down(){
      this.$_playAnalyse(this.startHeightCopyTwo,this.currentHeightCopy,-1);
    },
    //对外暂停听方法
    pause(){
      this.$_pause();
    },
    /**
     * 洪水分析上升或下降方法
     * @param start 起始点
     * @param end 结束点
     * @param start forward 向上为1，向下为-1
     * @param rate 上升或下降频率
     * @param timeDiff Cesium和现实时间的倍率
     * */
    $_playAnalyse(start,end,forward,rate,timeDiff){
      rate = rate || 20;
      timeDiff = timeDiff || 1.5;
      let i = 0;
      let vm = this;
      let distance = end - start;
      let speed = this.floodSpeedCopy / rate;
      let time = Math.ceil(distance / speed);
      speed = distance / time;
      let timeOut = parseInt(parseInt(((distance / this.floodSpeedCopy) / time) * 1000));
      //因为Cesium的事件计算和现实不一样，这里试出来大概是1.5倍
      timeOut = timeOut * timeDiff;
      this.isPlayer = true;
      let interval = setInterval(function () {
        i++;
        vm.currentHeightCopy = parseInt(Number((vm.currentHeightCopy + speed * forward).toFixed(4)));
        if(!vm.isPlayer){
          vm.isPlayer = true;
          clearInterval(interval);
        }
        if(i === time){
          vm.currentHeightCopy = parseInt(forward > 0 ? Number(end) : Number(start));
          clearInterval(interval);
        }
      },timeOut)
    },
    //停止洪水淹没分析
    $_stopAnalyse() {
      const {vueKey, vyeIndex} = this;
      //删除淹没分析
      webGlobe.scene.VisualAnalysisManager.removeAll();
      //停止绘制
      window.drawElement.stopDrawing();
      //删除管理对象
      window.CesiumZondy.FloodAnalyseManager.deleteSource(vueKey, vyeIndex);
      //启用开始分析按钮
      this.disabled = true;
      //高度置零
      this.currentHeight = 0;
      this.currentHeightCopy = 0;
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
  height: 364px;
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

.flood-analyse-box .currentHeight {
  padding-top: 0.5em;
  padding-left: 0.5em;
  text-align: left;
}

.flood-analyse-box .start {
  position: absolute;
  right: 1px;
  bottom: -32px;
}

.flood-analyse-box .back {
  position: absolute;
  right: -1px;
  bottom: -28px;
}
</style>