<template>
  <div
    :class="{
      'mapgis-ui-input-number-panel': true,
      'mapgis-ui-input-number-panel-sm': size == 'small',
      'mapgis-ui-input-number-panel-md': size == 'medium'
    }"
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
          <mapgis-ui-slider v-model="number" :min="range[0]" :max="range[1]" :step="step">
          </mapgis-ui-slider>
        </mapgis-ui-col>
        <mapgis-ui-col v-bind="wrapperCol" class="right-panel">
          <div class="right range">{{ range[0] }} ~ {{ range[1] }}</div>
          <mapgis-ui-input-number
            autoWidth
            class="right"
            size="small"
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
      <mapgis-ui-col :span="16">
        <mapgis-ui-slider
          class="slide-hover"
          v-model="number"
          :min="range[0]"
          :max="range[1]"
          :step="step"
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
          <div class="range-sm">{{ range[0] }} ~ {{ range[1] }}</div>
        </mapgis-ui-space>
      </mapgis-ui-col>
      <mapgis-ui-col :span="8">
        <mapgis-ui-input-number
          autoWidth
          size="small"
          v-model="number"
          :min="range[0]"
          :max="range[1]"
          :step="step"
        >
        </mapgis-ui-input-number>
      </mapgis-ui-col>
    </mapgis-ui-row>
    <mapgis-ui-form-model-item :label="label" v-else>
        <mapgis-ui-space>
          <mapgis-ui-slider
              v-model="number"
              :min="range[0]"
              :max="range[1]"
              :step="step"
          />
          <mapgis-ui-input-number
              v-model="number"
              :min="range[0]"
              :max="range[1]"
              :step="step"
              size="small"
          />
        </mapgis-ui-space>
      </mapgis-ui-form-model-item>
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
    step: {
      type: Number,
      default: 1
    },
    labelCol: {
      type: Object,
      default: () => {
        return { span: 14 };
      }
    },
    wrapperCol: {
      type: Object,
      default: () => {
        return { span: 10 };
      }
    }
  },
  data() {
    return {
      number: this.value || 0
    };
  },
  model: {
    prop: "value",
    event: "change"
  },
  watch: {
    number(next) {
      this.$emit("change", next);
    }
  },
  mounted() {},
  methods: {
    changeChecked(e) {}
  }
};
</script>
