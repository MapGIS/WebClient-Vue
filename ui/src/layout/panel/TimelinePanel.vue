<template>
  <div>
    <mapgis-ui-card
        size="small"
        hoverable
        :style="{ width: `${width}px` }"
        class="mapgis-ui-timeline-panel"
    >
      <div class="timeline-current-time">{{ currentTime }}</div>  
      <mapgis-ui-slider
          class="timeline-slider"
          :style="sliderStyle"
          :tip-formatter="tipFormatter"
          :min="min"
          :max="max"
          :marks="marks"
          :step="step"
          v-model="sliderValueCopy"
          @change="sliderValueChange"
      />
      <div class="timeline-select">
        <mapgis-ui-select-panel
            label="播放间隔"
            v-model="intervalCopy"
            :selectOptions="intervalOptions"
            :placeholder="intervalPlaceholder"
            :wrapperCol="10"
            @change="intervalChange">
        </mapgis-ui-select-panel>
        <mapgis-ui-select-panel
            label="倍速播放"
            v-model="speedCopy"
            :selectOptions="speedOptions"
            :placeholder="speedPlaceholder"
            :wrapperCol="10"
            @change="speedChange">
        </mapgis-ui-select-panel>
      </div>
      <div class="timeline-toolbar">
        <mapgis-ui-iconfont
            v-if="!isPlayingCopy"
            type="mapgis-play-circle-fill"
            class="timeline-toolbar-main"
            @click.capture.stop="startPlay"
        />
        <mapgis-ui-iconfont
            v-else
            type="mapgis-zanting"
            :class="['timeline-toolbar-main', {disabled}]"
            @click.capture.stop="stopPlay"
        />
      </div>
      
      <!-- <mapgis-ui-row>
          <mapgis-ui-col :span="5">
            <div class="timeline-current-time">{{ currentTime }}</div>
          </mapgis-ui-col>
          <mapgis-ui-col :span="12">
            <mapgis-ui-slider
                class="timeline-slider"
                :style="sliderStyle"
                :tip-formatter="tipFormatter"
                :min="0"
                :max="playTime"
                v-model="sliderValueCopy"
            />
            
            <div class="timeline-toolbar">
              <mapgis-ui-iconfont
                  v-if="!isPlaying"
                  type="mapgis-play-circle-fill"
                  class="timeline-toolbar-main"
                  @click.capture.stop="startPlay"
              />
              <mapgis-ui-iconfont
                  v-else
                  type="mapgis-zanting"
                  class="timeline-toolbar-main"
                  @click.capture.stop="stopPlay"
              />
            </div>
          </mapgis-ui-col>
          <mapgis-ui-col :span="7">
            <div class="timeline-select">
              <mapgis-ui-select-panel
                  label="播放间隔"
                  v-model="interval"
                  :selectOptions="intervalOptions"
                  :placeholder="intervalPlaceholder"
                  :wrapperCol="10"
                  @change="intervalChange">
              </mapgis-ui-select-panel>
              <mapgis-ui-select-panel
                  label="倍速播放"
                  v-model="speedCopy"
                  :selectOptions="speedOptions"
                  :placeholder="speedPlaceholder"
                  :wrapperCol="10"
                  @change="speedChange">
              </mapgis-ui-select-panel>
            </div>
          </mapgis-ui-col>
      </mapgis-ui-row> -->

    </mapgis-ui-card>
  </div>
</template>

<script>
import moment from "moment";

export default {
  name: "mapgis-ui-timeline-panel",
  props: {
    /** 时间轴的宽度 */
    width: {
      type: Number,
      default: 500
    },
    currentTime: {
      type: String,
      default: '2022-02'
    },
    /** 滑动条样式 */
    sliderStyle: {
      type: Object,
      default: null
    },
    /** 滑动条的值 */
    sliderValue: {
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
    /** 选择的倍速大小 */
    speed: {
      type: String,
      default: '1x'
    },
    speedPlaceholder: {
      type: String,
      default: '1x'
    },
    /** 倍速选项 */
    speedOptions:{
      type: Array,
      default: ()=>{
          return ['5x','3x', '2x', '1.5x', '1x', '0.5x']
      }
    },
    /** 是否禁用暂停选项 */
    disabled:{
      type:Boolean,
      default:false
    }

  },
  model:{
    prop: 'sliderValue',
    event: 'change'
  },
  watch: {
    sliderValue: {
      handler(next) {
        this.sliderValueCopy = next
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
  },
  data() {
    return {
        sliderValueCopy: this.sliderValue,
        speedCopy: this.speed,
        intervalCopy: this.interval,

        isPlayingCopy: this.isPlaying,
        // timer: undefined,
    }
  },
  created() {
    moment.locale();
  },
  methods: {
    sliderValueChange(e) {
      this.$emit("change", e);
    },
    intervalChange(e) {
      this.$emit("intervalChange", e);
    },
    speedChange(e) {      
      this.$emit("speedChange", e);
    },
    startPlay(){
      const vm = this;
      this.isPlayingCopy = true;
      
      // if(vm.sliderValueCopy >= vm.playTime){
      //     vm.sliderValueCopy = 0
      // }

      // this.timer = window.setInterval(function(){
      //     if(vm.sliderValueCopy >= vm.playTime){
      //         if(vm.loopPlay){
      //           vm.sliderValueCopy = 0;
      //         }else{
      //           vm.isPlaying = false;
      //           window.clearInterval(vm.timer);
                
      //         }
      //     }else{
      //       vm.sliderValueCopy += 1 * parseFloat(vm.speedCopy);
      //     }

      // },1000)

      this.$emit('startPlay')
    },

    stopPlay(){
      // window.clearInterval(this.timer);
      this.isPlayingCopy = false;
      this.$emit('stopPlay')
    }
  }
}
</script>

<style scoped>
.mapgis-ui-timeline-panel {
  position: absolute;
  right: 10px;
  top: 10px;
  margin: 0px auto;
}

.timeline-toolbar {
  display: flex;
  width: 70px;
  margin: 0px auto;
}

.timeline-toolbar-main:hover {
  color: #49A8FF;
}

.timeline-toolbar-main {
  color: #1890ff;
}

.timeline-toolbar > .anticon {
  font-size: 22px;
}

.mapgis-ui-card-small > .mapgis-ui-card-body {
  padding: 6px 12px;
}

.timeline-starttime {
  position: absolute;
  left: 100px;
  font-size: 12px;
}

.timeline-endtime {
  position: absolute;
  right: 212px;
  bottom: 14px;
  font-size: 12px;
}

.timeline-setting {
  position: absolute;
  font-size: 18px;
  top: 4px;
  right: 4px;
}

.mapgis-ui-popover {
  background: transparent;
}

.mapgis-ui-popconfirm-style {
  display: inline;
}

.timeline-slider {
  width: 240px;
  margin-left: 90px;
}

.timeline-current-time {
  position: absolute;
  top: 15px;
  left: 11px;
  font-size: 22px;
}

.timeline-select {
  position: absolute;
  width: 186px;
  top: 2px;
  right: -39px;
  font-size: 14px;
}

::v-deep .mapgis-ui-select-panel {
  padding: 2px;
}

.disabled{
  cursor: not-allowed;
}
</style>