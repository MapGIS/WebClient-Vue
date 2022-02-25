<template>
    <mapgis-ui-card
        size="small"
        hoverable
        :style="{ width: `${width}px` }"
        class="mapgis-ui-timeline-panel"
    >
      <div class="animationContainer">

        <mapgis-ui-iconfont
            :class="['reset-btn',{'reset-btn-active' : resetBtn === true}]"
            type="mapgis-crosshair"
            @click.capture.stop="resetSpeed"
        />

        <div class="speed-slider-toolbar">
          <span class="center-line"></span>
          <span class="minus speed-change-btn" @click.capture.stop="decelerate">-</span>
          <span class="plus speed-change-btn" @click.capture.stop="accelerate">+</span>
          <mapgis-ui-slider
              class="speed-slider"
              :tooltip-visible="false"
              :step="speedStep"
              :min="minSpeed"
              :max="maxSpeed"
              v-model="speedCopy"
              @change="speedChange"
          />
        </div>

        <div class="timeline-current-speed">{{ speedCopy }}x</div>  

        <div v-if="enableBackforward">
          <mapgis-ui-iconfont
            :class="['play-btn', {'btn-active' : backBtn === true}]"
            type="mapgis-arrow-left-filling"
            @click.capture.stop="backward"
          />
          <mapgis-ui-iconfont 
            :class="['play-btn', {'btn-active' : pauseBtn === true}]"
            type="mapgis-pause"
            @click.capture.stop="pause"
          />
          <mapgis-ui-iconfont 
            :class="['play-btn', {'btn-active' : forwardBtn === true}]"
            type="mapgis-arrow-right-filling"
            @click.capture.stop="forward"
          />
        </div>
        
        <div v-else>
          <mapgis-ui-iconfont
              v-if="!isPlayingCopy"
              type="mapgis-play-circle-fill"
              class="play-btn"
              @click.capture.stop="startPlay"
          />
          <mapgis-ui-iconfont
              v-else
              type="mapgis-zanting"
              :class="['play-btn', {'disabled' : disabled === true}]"
              @click.capture.stop="stopPlay"
          />
        </div>

        <div class="timeline-current-time" :style="{ width: `${curTimeWidth}px` }">{{ currentTime }}</div>

        <div class="timeline-select">
          <mapgis-ui-select-panel
              label="播放间隔"
              v-model="intervalCopy"
              :selectOptions="intervalOptions"
              :placeholder="intervalPlaceholder"
              :wrapperCol="10"
              @change="intervalChange">
          </mapgis-ui-select-panel>
        </div>

      </div>

      <mapgis-ui-slider
        class="timeline-slider"
        :tip-formatter="tipFormatter"
        :min="min"
        :max="max"
        :marks="marks"
        :step="step"
        v-model="valueCopy"
        @change="valueChange"
      />

    </mapgis-ui-card>
</template>

<script>
import moment from "moment";

export default {
  name: "mapgis-ui-timeline-panel",
  props: {
    /** 时间轴的宽度 */
    width: {
      type: Number,
      default: null
    },
    currentTime: {
      type: String,
      default: '2022-02'
    },
    curTimeWidth:{
      type: Number,
      default: null
    },
    /** 滑动条的值 */
    value: {
      type: Number,
      default: 0
    },
    min:{
      type: Number,
      default: 0 
    },
    max:{
      type: Number,
      default: 60 
    },
    /** 滑动条标记值 */
    marks: {
      type: Object,
    },
    /** 滑动条步长 */
    step: {
      type: Number || Null,
      default: 1
    },
    /** 滑动条格式化 */
    tipFormatter:{
      type: Function
    },
    isPlaying: {
      type: Boolean,
      default: false
    },
    /** 选择的时间间隔 */
    interval: {
      type: String,
      default: '月'
    },
    intervalPlaceholder:{
      type: String,
      default: '月'
    },
    /** 时间间隔选项 */
    intervalOptions:{
      type: Array,
      default: ()=>{
          return ['年', '月', '日', '时', '分', '秒']
      }
    },
    /** 倍速大小 */
    speed: {
      type: Number,
      default: 1
    },
    /** 倍速改变步长值 */
    speedStep: {
      type: Number,
      default: 1
    },
    /** 倍速最小值 */
    minSpeed: {
      type: Number,
      default: 0
    },
    /** 倍速最大值 */
    maxSpeed: {
      type: Number,
      default: 50
    },
    resetActive:{
      type:Boolean,
      default:false
    },
    enableBackforward: {
      type:Boolean,
      default:true
    },
    backActive:{
      type:Boolean,
      default:false
    },
    pauseActive:{
      type:Boolean,
      default:false
    },
    forwardActive:{
      type:Boolean,
      default:false
    },
    /** 是否禁用暂停选项 */
    disabled:{
      type:Boolean,
      default:false
    }

  },
  model:{
    prop: 'value',
    event: 'change'
  },
  watch: {
    value: {
      handler(next) {
        this.valueCopy = next
      },
      deep: true,
      immediate: true
    },
    speed: {
      handler(next) {
        this.speedCopy = next;
      },
      immediate: true
    },
    interval: {
      handler(next) {
        this.intervalCopy = next;
      },
      deep: true,
      immediate: true
    },
    isPlaying: {
      handler(next) {
        this.isPlayingCopy = next;
      },
      immediate:true
    },
    resetActive:{
      handler(next) {
        this.resetBtn = next;
      },
    },
    backActive:{
      handler(next) {
        this.backBtn = next;
      },
    },
    forwardActive:{
      handler(next) {
        this.forwardBtn = next;
      },
    },
    pauseActive:{
      handler(next) {
        this.pauseBtn = next;
      },
    }
  },
  data() {
    return {
        valueCopy: this.value,
        speedCopy: this.speed,
        intervalCopy: this.interval,

        isPlayingCopy: this.isPlaying,

        resetBtn: this.resetActive,
        backBtn: this.backActive,
        pauseBtn: this.pauseActive,
        forwardBtn: this.forwardActive,
    }
  },
  created() {
    moment.locale();
  },
  methods: {
    resetSpeed() {
      this.resetBtn = true;
      this.$emit('resetSpeed');
    },
    decelerate() {
      this.resetBtn = false;
      this.$emit('decelerate');
    },
    accelerate() {
      this.resetBtn = false;
      this.$emit('accelerate');
    },
    speedChange(e) {
      this.resetBtn = false;
      if (this.enableBackforward){
        if (e > 0){
           this.forward();
        }else if (e === 0){
          this.pause();
        } else {
          this.backward();
        }
      }
      this.$emit("speedChange", e);
    },
    backward() {
      this.backBtn = true;
      this.pauseBtn = false;
      this.forwardBtn = false;
      this.$emit("backward");
    },
    pause() {
      this.pauseBtn = true;
      this.backBtn = false;
      this.forwardBtn = false;
      this.$emit("pause");
    },
    forward() {
      this.forwardBtn = true;
      this.backBtn = false;
      this.pauseBtn = false;
      this.$emit("forward");
    },
    startPlay(){
      this.isPlayingCopy = true;
      this.$emit('startPlay')
    },
    stopPlay(){
      this.isPlayingCopy = false;
      this.$emit('stopPlay')
    },
    intervalChange(e) {
      this.$emit("intervalChange", e);
    },
    valueChange(e) {
      this.$emit("change", e);
    }
  }
}
</script>

<style scoped>
.mapgis-ui-timeline-panel {
  position: absolute;
  height: 62px;
  display: flex;
  padding: 0 !important;
}

::v-deep .mapgis-ui-card-small > .mapgis-ui-card-body {
  padding: 8px;
  display: flex;
  flex-wrap: wrap;
}

.animationContainer {
  display: flex;
  /*width: 676px;*/
  height: 32px;
}

.reset-btn {
  font-size: 32px;
  border: none
}

.reset-btn-active {
  color: #0081e2;
}

.speed-slider-toolbar{
  position: relative;
  width: 152px;
  margin-left: 20px;
}

.center-line {
  position: absolute;
  left: 50%;
  top: 6px;
  display: inline-block;
  width: 1px;
  height: 18px;
  background-color: hsl(0deg 17% 20% / 79%);
  z-index: 100;
  cursor: pointer;
}

.speed-change-btn {
  position: absolute;
  top: 0;
  font-size: 17px;
  color: hsl(0deg 17% 20% / 79%);
  z-index: 100;
  user-select: none;
  cursor: pointer;
}

.minus {
  left: 10px;

}

.plus {
  right: 10px;
}

.speed-slider {
  line-height: normal;
}

::v-deep .speed-slider >.mapgis-ui-select-selection--single {
  height: 30px;
}

::v-deep .mapgis-ui-slider {
  margin: 4px 6px 4px;
  padding: unset;
}

::v-deep .speed-slider >.mapgis-ui-slider-handle {
  border: unset;
  border-radius: 0;
  width: 6px;
  height: 22px;
  background: url("./slider.png");
  background-size: contain;
  outline: 0;
  margin-top: 0px;
}

::v-deep .speed-slider >.mapgis-ui-slider-rail {
  height: 22px;
}

::v-deep .speed-slider >.mapgis-ui-slider-track {
  height: 22px;
  background-color: unset;
}

::v-deep .mapgis-ui-slider:hover .mapgis-ui-slider-track{
  background-color: unset;
}

.timeline-current-speed{
  display: inline-block; 
  /* width: 64px;  */
  line-height: 32px; 
  margin-left: 6px;
}

.play-btn {
  font-size: 26px;
  margin-top: 3px;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 35px;
}

.btn-active {
  background-color: #33333347 !important;
  color: #0081e2;
}

.timeline-current-time {
  display: inline-block; 
  line-height: 32px; 
  margin-left: 20px;
  font-size: 19px;
  text-align:center;
}

.timeline-select {
  display: inline-block;
  width: 140px;
  overflow: hidden;
  margin-left: 20px;
}

::v-deep .mapgis-ui-select-panel {
  padding: 0px;
  width: 186px;
}

.disabled{
  cursor: not-allowed;
}

.timeline-slider {
  width: 100%;
}

</style>