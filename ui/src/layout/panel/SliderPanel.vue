<template>
  <div
    :class="{
      'mapgis-ui-slider-panel': true,
      'mapgis-ui-slider-panel-vertical': layout == 'vertical',
      'mapgis-ui-slider-panel-horizontal': layout == 'horizontal'
    }"
  >
    <div class="mapgis-ui-slider-panel-background"></div>
    <div class="mapgis-ui-slider-panel-content">
      <div
        v-if="layout == 'vertical'"
        class="mapgis-ui-slider-panel-value"
        ref="horizontal"
      >
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
            <mapgis-ui-tooltip placement="left">
              <span slot="title">{{ v.title }}</span>
              <div v-if="v.title" class="mapgis-ui-slider-panel-item-span">
                {{ customLabel ? customLabel(v.title) : v.title }}
              </div>
            </mapgis-ui-tooltip>
          </div>
        </div>
        <div class="mapgis-ui-slider-panel-anchor">
          <mapgis-ui-slider
            :tip-formatter="null"
            :vertical="layout == 'vertical'"
            v-model="key"
            :marks="marks"
            :min="min"
            :max="max"
            @change="handleSlider"
          />
        </div>
      </div>
      <div
        v-if="layout == 'horizontal'"
        class="mapgis-ui-slider-panel-value"
        ref="horizontal"
      >
        <div class="mapgis-ui-slider-panel-value-horizontal-wrapper">
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
              <mapgis-ui-tooltip placement="top">
                <span slot="title">{{ v.title }}</span>
                <div v-if="v.title" class="mapgis-ui-slider-panel-item-span">
                  {{ customLabel ? customLabel(v.title) : v.title }}
                </div>
              </mapgis-ui-tooltip>
            </div>
          </div>
          <div class="mapgis-ui-slider-panel-anchor">
            <mapgis-ui-slider
              :tip-formatter="null"
              :vertical="layout == 'vertical'"
              :marks="marks"
              :value="key"
              :min="min"
              :max="max"
              @change="handleSlider"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import clonedeep from "lodash.clonedeep";
export default {
  name: "mapgis-ui-slider-panel",
  props: {
    layout: {
      type: String,
      default: "vertical" // 'horizontal' 'vertical' 'inline'
    },
    size: {
      type: String,
      default: "default" // default small
    },
    value: {
      type: String
    },
    values: {
      type: Array,
      default: () => []
    },
    customLabel: {
      type: Function
      /*  default: (label) => {
        let show = label;
        let reg = new RegExp(/-(\S*)?楼?F?/g);
        let res = reg.exec(label);
        if (res && res.length > 0) {
          show = res[res.length - 1];
        }
        return show;
      } */
    }
  },
  data() {
    return {
      key: undefined,
      sliderkey: undefined,
      sortkeys: [],
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
  watch: {
    values: function(next) {
      this.innervalues = this.fixValues();
    }
  },
  mounted() {
    this.innervalues = this.fixValues();
    this.bindScroll();
  },
  methods: {
    fixValues() {
      const { layout } = this;
      let empty = { title: undefined, key: undefined };
      let result = clonedeep(this.values);
      let marks = {};
      let min = Number.MAX_VALUE;
      let max = Number.MIN_VALUE;
      result = result.map(v => {
        let key = typeof v.key === "string" ? parseInt(v.key) : v.key;
        v.key = key;
        marks[v.key] = ""; // v.key;
        if (key >= max) {
          max = key;
        }
        if (key <= min) {
          min = key;
        }
        return v;
      });
      this.min = min - 1;
      this.max = max + 0;
      this.marks = marks;
      result.push(empty);
      if (layout == "vertical") {
        let temp = result.reverse();
        temp.push(empty);
        result = temp;
        this.innervalues = temp;
      } else if (layout == "horizontal") {
        this.innervalues = result.splice(0, 0, empty);
      }

      return result;
    },
    bindScroll() {
      if (this.layout == "horizontal") {
        let horizontal = this.$refs.horizontal;
        horizontal.addEventListener("wheel", evt => {
          evt.preventDefault();
          horizontal.scrollLeft += evt.deltaY;
        });
      }
    },
    handleClick(v) {
      const { title, key } = v;
      if (title || key) {
        this.key = key;
        this.sliderkey = key;
        this.sortkeys = [];
        this.$emit("change", key);
      }
    },
    handleScoll() {
      let style = {
        bottom: "55%",
        top: auto,
        transform: "translateY(50%)"
      };
    },
    handleSlider(value) {
      this.key = value;
      let keys = [];
      this.innervalues.forEach(v => {
        if (v.key <= value) {
          keys.push(v.key);
        }
      });
      this.$emit("changeSlider", keys);
      this.sortkeys = keys;
    },
    computeStyle() {
      const { layout } = this;
      if (layout == "vertical") {
      } else if (layout == "horizontal") {
      }
    },
    formatter(value) {
      return `${value}%`;
    }
  }
};
</script>
