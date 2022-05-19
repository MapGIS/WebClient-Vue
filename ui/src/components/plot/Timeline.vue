<template>
  <div class="plot-timeline-panel">
    <div class="timeline-setting-panel">
      <mapgis-ui-space>
        <mapgis-ui-iconfont
          :class="['play-btn', { 'btn-active': backBtn === true }]"
          type="mapgis-arrow-left-filling"
          @click.capture.stop="backward"
        />
        <mapgis-ui-iconfont
          :class="['play-btn', { 'btn-active': pauseBtn === true }]"
          type="mapgis-pause"
          @click.capture.stop="pause"
        />
        <mapgis-ui-iconfont
          :class="['play-btn', { 'btn-active': forwardBtn === true }]"
          type="mapgis-arrow-right-filling"
          @click.capture.stop="forward"
        />
      </mapgis-ui-space>

      <div
        class="timeline-current-time"
        :style="{ width: `${curTimeWidth}px` }"
      >
        {{ currentTime }}
      </div>

      <mapgis-ui-tooltip>
        <div class="timeline-current-speed">
          倍速
        </div>
        <template #title>
          <mapgis-ui-input-number
            v-model="speedCopy"
            :formatter="value => `${value}X`"
            :parser="value => value.replace('X', '')"
          />
        </template>
      </mapgis-ui-tooltip>

      <mapgis-ui-tooltip>
        <div class="timeline-select">
          播放间隔
        </div>
        <template #title>
          <mapgis-ui-select-panel
            :showLabel="false"
            v-model="intervalCopy"
            :selectOptions="intervalOptions"
            :placeholder="intervalPlaceholder"
            :wrapperCol="24"
            @change="intervalChange"
          />
        </template>
      </mapgis-ui-tooltip>
    </div>

    <div class="timeline-main">
      <div class="timeline-bar">
        <div
          class="time-tick time-tick-lg"
          v-for="item in [0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220]"
          :key="item"
        >
          <span class="time-mark">{{ item }}</span>
          <div
            class="time-tick time-tick-sm"
            v-for="item in [1, 2, 3, 4]"
            :key="item"
          />
          <div class="time-tick time-tick-md">
            <span class="time-mark">{{ item + 10 }}</span>
          </div>
          <div
            class="time-tick time-tick-sm"
            v-for="item in [5, 6, 7, 8]"
            :key="item"
          />
        </div>
        <div class="time-tick time-tick-lg">
          <span class="time-mark">240</span>
        </div>
        <div class="timeline-needle">
          <img src="./style/images/u196.png" class="timeline-needle-top" />
          <div class="timeline-needle-bottom"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import Div from "../div/Div.vue";

export default {
  name: "mapgis-ui-plot-timeline",
  props: {
    /** 时间轴的宽度 */
    width: {
      type: Number,
      default: null
    },
    currentTime: {
      type: String,
      default: "2022-02"
    },
    curTimeWidth: {
      type: Number,
      default: null
    },
    /** 滑动条的值 */
    value: {
      type: Number,
      default: 0
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 60
    },
    /** 滑动条标记值 */
    marks: {
      type: Object
    },
    /** 滑动条步长 */
    step: {
      type: Number || Null,
      default: 1
    },
    /** 滑动条格式化 */
    tipFormatter: {
      type: Function
    },
    isPlaying: {
      type: Boolean,
      default: false
    },
    /** 选择的时间间隔 */
    interval: {
      type: String,
      default: "月"
    },
    intervalPlaceholder: {
      type: String,
      default: "月"
    },
    /** 时间间隔选项 */
    intervalOptions: {
      type: Array,
      default: () => {
        return ["年", "月", "日", "时", "分", "秒"];
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
    resetActive: {
      type: Boolean,
      default: false
    },
    enableBackforward: {
      type: Boolean,
      default: true
    },
    backActive: {
      type: Boolean,
      default: false
    },
    pauseActive: {
      type: Boolean,
      default: false
    },
    forwardActive: {
      type: Boolean,
      default: false
    },
    /** 是否禁用暂停选项 */
    disabled: {
      type: Boolean,
      default: false
    }
  },
  model: {
    prop: "value",
    event: "change"
  },
  watch: {
    value: {
      handler(next) {
        this.valueCopy = next;
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
      immediate: true
    },
    resetActive: {
      handler(next) {
        this.resetBtn = next;
      }
    },
    backActive: {
      handler(next) {
        this.backBtn = next;
      }
    },
    forwardActive: {
      handler(next) {
        this.forwardBtn = next;
      }
    },
    pauseActive: {
      handler(next) {
        this.pauseBtn = next;
      }
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
      forwardBtn: this.forwardActive
    };
  },
  created() {
    moment.locale();
  },
  mounted() {
    let img = document.querySelector(".timeline-needle-top");
    let ele = document.querySelector(".timeline-needle");
    let bar = document.querySelector(".timeline-bar");

    ele.onmousedown =  function(ev) {
      // ele.setCapture();
      var initL = parseFloat(ele.style.left) || 0;
      var initX = ev.clientX - initL;
      console.log("initL", initL);

      img.onmousemove= function(ev) {
        var left = ev.clientX - initX;
        console.log("mousemove", ev, ele.style.left);
        ele.style.left = left + 'px';
      };

      ele.onmousemove= function(ev) {
        var left = ev.clientX - initX;
        console.log("mousemove", ev, ele.style.left);
        ele.style.left = left + 'px';
      };

      bar.onmousemove= function(ev) {
        var left = ev.clientX - initX;
        console.log("mousemove", ev, ele.style.left);
        ele.style.left = left + 'px';
      };

      document.onmouseup= function() {
        ele.onmousemove = null;
        bar.onmousemove = null;
        img.onmousemove = null;
        document.onmouseup = null;
        // ele.releaseCapture();
      };

    };
  },
  methods: {
    resetSpeed() {
      this.resetBtn = true;
      this.$emit("resetSpeed");
    },
    decelerate() {
      this.resetBtn = false;
      this.$emit("decelerate");
    },
    accelerate() {
      this.resetBtn = false;
      this.$emit("accelerate");
    },
    speedChange(e) {
      this.resetBtn = false;
      if (this.enableBackforward) {
        if (e > 0) {
          this.forward();
        } else if (e === 0) {
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
    startPlay() {
      this.isPlayingCopy = true;
      this.$emit("startPlay");
    },
    stopPlay() {
      this.isPlayingCopy = false;
      this.$emit("stopPlay");
    },
    intervalChange(e) {
      this.$emit("intervalChange", e);
    },
    valueChange(e) {
      this.$emit("change", e);
    }
  }
};
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
  border: none;
}

.reset-btn-active {
  color: #0081e2;
}

.speed-slider-toolbar {
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

::v-deep .speed-slider > .mapgis-ui-select-selection--single {
  height: 30px;
}

::v-deep .mapgis-ui-slider {
  margin: 4px 6px 4px;
  padding: unset;
}

::v-deep .speed-slider > .mapgis-ui-slider-handle {
  border: unset;
  border-radius: 0;
  width: 6px;
  height: 22px;
  /* background: url("./slider.png"); */
  background-size: contain;
  outline: 0;
  margin-top: 0px;
}

::v-deep .speed-slider > .mapgis-ui-slider-rail {
  height: 22px;
}

::v-deep .speed-slider > .mapgis-ui-slider-track {
  height: 22px;
  background-color: unset;
}

::v-deep .mapgis-ui-slider:hover .mapgis-ui-slider-track {
  background-color: unset;
}

.disabled {
  cursor: not-allowed;
}

.timeline-slider {
  width: 100%;
}
</style>
