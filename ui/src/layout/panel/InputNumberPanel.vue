<template>
  <div
    :class="{
      'mapgis-ui-input-number-panel': true,
      'mapgis-ui-input-number-panel-transparent': transparent,
      'mapgis-ui-input-number-panel-sm': size == 'small',
      'mapgis-ui-input-number-panel-md': size == 'medium'
    }"
    :style="panelStyle"
  >
    <div v-if="size == 'large'">
      <mapgis-ui-row>
        <mapgis-ui-col v-bind="labelCol" class="left">
          <div class="label">
            {{ label }}
            <mapgis-ui-tooltip v-if="tooltip">
              <template slot="title">{{ tooltip }}</template>
              <mapgis-ui-iconfont type="mapgis-info-circle" />
            </mapgis-ui-tooltip>
          </div>
        </mapgis-ui-col>
        <mapgis-ui-col v-bind="wrapperCol" class="right-range">
          <div class="right range" v-show="rangeShow">{{ range[0] }} ~ {{ range[1] }}</div>
        </mapgis-ui-col>
      </mapgis-ui-row>
      <mapgis-ui-row>
        <mapgis-ui-col v-bind="labelCol" class="left">
          <mapgis-ui-slider v-model="number" :min="range[0]" :max="range[1]" :step="step">
          </mapgis-ui-slider>
        </mapgis-ui-col>
        <mapgis-ui-col v-bind="wrapperCol" class="right-panel">
          <!-- <div class="right range" v-show="rangeShow">{{ range[0] }} ~ {{ range[1] }}</div> -->
          <mapgis-ui-input-number
            autoWidth
            class="right"
            v-model="number"
            :min="range[0]"
            :max="range[1]"
            :step="step"
          >
          </mapgis-ui-input-number>
        </mapgis-ui-col>
      </mapgis-ui-row>
    </div>
    <mapgis-ui-row v-if="size == 'small'">
      <mapgis-ui-col v-bind="labelCol">
        <mapgis-ui-slider
          class="slide-hover"
          v-model="number"
          :min="range[0]"
          :max="range[1]"
          :step="step"
          v-show="slider"
        >
        </mapgis-ui-slider>
        <mapgis-ui-space>
          <div class="label-sm">
            {{ label }}
            <mapgis-ui-tooltip v-if="tooltip">
              <template slot="title">{{ tooltip }}</template>
              <mapgis-ui-iconfont type="mapgis-info-circle" />
            </mapgis-ui-tooltip>
          </div>
          <div class="range-sm" v-show="rangeShow">{{ range[0] }} ~ {{ range[1] }}</div>
        </mapgis-ui-space>
      </mapgis-ui-col>
      <mapgis-ui-col v-bind="wrapperCol">
        <mapgis-ui-input-number
          autoWidth
          v-model="number"
          :min="range[0]"
          :max="range[1]"
          :step="step"
        >
        </mapgis-ui-input-number>
      </mapgis-ui-col>
    </mapgis-ui-row>
    <mapgis-ui-row v-if="size == 'medium' ">
      <mapgis-ui-col v-bind="wrapperCol" >
         <div class="label-md"> {{ label }} </div>
      </mapgis-ui-col>
      <mapgis-ui-col v-bind="labelCol">
        <mapgis-ui-space>
          <mapgis-ui-slider
              v-model="number"
              :min="range[0]"
              :max="range[1]"
              :step="step"
              v-show="slider"
          />
          <mapgis-ui-input-number
              v-model="number"
              :min="range[0]"
              :max="range[1]"
              :step="step"
          />
        </mapgis-ui-space>
      </mapgis-ui-col>
    </mapgis-ui-row>
  </div>
</template>

<script>
export default {
  name: "mapgis-ui-input-number-panel",
  props: {
    size: {
      type: String,
      default: "large" // small large medium
    },
    label: {
      type: String,
      default: "标题"
    },
    value: {
      type: Number,
      default: 0
    },
    tooltip: {
      type: String
    },
    range: {
      type: Array,
      default: () => [0, 100]
    },
    rangeShow:{
      type:Boolean,
      default:true
    },
    step: {
      type: Number,
      default: 1
    },
    labelCol: {
      type: Object,
      default: () => {
        return { span: 16 };
      }
    },
    wrapperCol: {
      type: Object,
      default: () => {
        return { span: 8 };
      }
    },
    panelStyle: {
      type: Object,
    },
    slider:{
      type:Boolean,
      default:true
    },
    transparent: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      number: this.value || 0,
    };
  },
  model: {
    prop: "value",
    event: "change"
  },
  watch: {
    number(next) {
      this.$emit("change", next);
    },
    value(next) {
      this.number = next;
    },
  },
  mounted() {},
  methods: {
    changeChecked(e) {}
  }
};
</script>
