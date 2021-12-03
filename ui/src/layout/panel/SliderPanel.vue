<template>
  <div class="mapgis-ui-slider-panel">
    <div class="mapgis-ui-slider-panel-background"></div>
    <div class="mapgis-ui-slider-panel-content">
      <div class="mapgis-ui-slider-panel-value">
        <div
          :class="{
            'mapgis-ui-slider-panel-value-vertical': layout == 'vertical',
            'mapgis-ui-slider-panel-value-horizontal': layout == 'horizontal'
          }"
        >
          <div
            :class="{
              'mapgis-ui-slider-panel-item': true,
              'mapgis-ui-slider-panel-item-active':
                (v.key || v.key >= 0) && v.key == key
            }"
            v-for="(v, i) in innervalues"
            :key="i"
            @click="() => handleClick(v)"
          >
            <span v-if="v.title">{{ v.title }}</span>
          </div>
        </div>
        <div class="mapgis-ui-slider-panel-anchor">
          <mapgis-ui-slider
            :tip-formatter="null"
            vertical
            v-model="key"
            :marks="marks"
            :min="min"
            :max="max"
          />
          <!-- <div class="mapgis-ui-slider-panel-anchor-line">
            <div class="mapgis-ui-slider-panel-anchor-icon"></div>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "mapgis-ui-slider-panel",
  props: {
    layout: {
      type: String,
      default: "vertical" // 'horizontal' 'vertical' 'inline'
    },
    size: {
      type: String,
      default: "default" //default small
    },
    value: {
      type: String
    },
    values: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      key: undefined,
      innervalues: [],
      marks: {},
      min: 0,
      max: 10
    };
  },
  model: {
    prop: "value",
    event: "change"
  },
  watch: {},
  mounted() {
    this.innervalues = this.fixValues();
  },
  methods: {
    fixValues() {
      let empty = { title: undefined, key: undefined };
      let result = this.values;
      let marks = {};
      let min = Number.MAX_VALUE;
      let max = Number.MIN_VALUE;
      result.forEach(v => {
        marks[v.key] = v.key;
        if (v.key >= max) {
          max = v.key;
        }
        if (v.key <= min) {
          min = v.key;
        }
      });
      this.min = min - 1;
      this.max = max + 0;
      this.marks = marks;
      result.push(empty);
      this.innervalues = result.splice(0, 0, empty);
      return result;
    },
    handleClick(v) {
      const { title, key } = v;
      if (title || key) {
        this.key = key;
      }
    },
    handleScoll() {
      let style = {
        bottom: "55%",
        top: auto,
        transform: "translateY(50%)"
      };
    },
    formatter(value) {
      console.log("value", value);
      return `${value}%`;
    }
  }
};
</script>
