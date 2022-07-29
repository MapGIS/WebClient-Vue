<template>
  <div class="plot-animation-panel">
    <mapgis-ui-group-tab title="动画事件设置" />

    <mapgis-ui-setting-form
      layout="horizontal"
      size="default"
      :labelWidth="80"
      wrapperWidth="auto"
      :colon="true"
    >
      <mapgis-ui-form-item label="动画类型">
        <mapgis-ui-select-panel
          v-model="animationTypeCopy"
          @change="changeType"
          :showLabel="false"
          :wrapperCol="24"
          :selectOptions="Object.keys(animationList)"
        />
      </mapgis-ui-form-item>
      <mapgis-ui-form-item label="开始时间">
        <mapgis-ui-input-number
          v-model="animationCopy[animationTypeCopy].startTime"
          @change="changeStartTime"
        />
      </mapgis-ui-form-item>

      <mapgis-ui-form-item label="动画时长">
        <mapgis-ui-input-number
          v-model="animationCopy[animationTypeCopy].duration"
          @change="changeTime"
        />
      </mapgis-ui-form-item>

      <mapgis-ui-form-item label="初始状态">
        <mapgis-ui-input-number
          :min="0"
          :max="1"
          :step="0.01"
          v-model="animationCopy[animationTypeCopy].startRatio"
          @change="changeStartRatio"
        />
      </mapgis-ui-form-item>

      <mapgis-ui-form-item label="结束状态">
        <mapgis-ui-input-number
          :min="0"
          :max="1"
          :step="0.01"
          v-model="animationCopy[animationTypeCopy].endRatio"
          @change="changeEndRatio"
        />
      </mapgis-ui-form-item>

      <mapgis-ui-form-item label="重复播放">
        <mapgis-ui-switch-panel
          v-model="animationCopy[animationTypeCopy].loop"
          @change="changeLoop"
          label=""
          size="small"
          :hasBottomMargin="false"
          :hasTopMargin="false"
        />
      </mapgis-ui-form-item>
    </mapgis-ui-setting-form>

  </div>
</template>

<script>
export default {
  name: "mapgis-ui-plot-animation",
  props: {
    animation:{
      type: Object,
      required: true
    },
    animationList:{
      type: Object,
      required: true
    }
  },
  model:{
    prop: "animation",
    event: "change"
  },
  watch: {
    animation: {
      handler: function(obj) {
        this.animationTypeCopy = Object.keys(obj)[0];
        // this.animationCopy = obj[this.animationTypeCopy]; 
        this.animationCopy = obj; 
      },
      deep: true,
      immediate: true
    },
    animationCopy: {
      handler: function(obj) {
        // let animation={};
        // animation[`${this.animationTypeCopy}`] = obj;
        this.$emit('change',this.animationCopy);
      },
      deep: true,
      immediate: true
    },
    animationTypeCopy: {
      handler: function(str) {
        // let animation={};
        // animation[`${this.animationTypeCopy}`] = this.animationCopy;
        this.animationCopy ={ [str]: this.animationList[str]} 
      }
    }
  },
  data() {
    return {
      animationCopy: undefined,
      animationTypeCopy: undefined
    };
  },
  methods: {
    changeType(e){
      this.$emit('changeType',{type: e, data: this.animationCopy})
    },
    changeStartTime(e){
      this.$emit('changeStartTime',{startTime: e, data: this.animationCopy})
    },
    changeTime(e){
      this.$emit('changeTime',{duration: e, data: this.animationCopy})
    },
    changeStartRatio(e){
      this.$emit('changeStartRatio',{startRatio: e, data: this.animationCopy})
    },
    changeEndRatio(e){
      this.$emit('changeEndRatio',{endRatio: e, data: this.animationCopy})
    },
    changeLoop(e){
      this.$emit('changeLoop',{loop: e, data: this.animationCopy})
    }
  }
};
</script>

