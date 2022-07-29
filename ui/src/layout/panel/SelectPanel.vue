<template>
  <div
    :class="{
      'mapgis-ui-select-panel': true,
      'mapgis-ui-select-panel-transparent': transparent
    }"
  >
    <mapgis-ui-row>
      <mapgis-ui-col :span="labelCol" class="left" v-if="showLabel">
        <div class="label-sm">
          {{ label }}
        </div>
      </mapgis-ui-col>
      <mapgis-ui-col :span="wrapperCol" class="right-panel">
        <template v-if="selectOptions.constructor == Array">
          <mapgis-ui-select v-model="selected" size="default">
            <mapgis-ui-select-option v-for="item in selectOptions" :key="item">
              {{ item }}
            </mapgis-ui-select-option>
          </mapgis-ui-select>
        </template>
        <template v-else-if="selectOptions.constructor == Object">
          <mapgis-ui-select v-model="selected" size="default">
            <mapgis-ui-select-option
              v-for="(value, key) in selectOptions"
              :key="key"
            >
              {{ value }}
            </mapgis-ui-select-option>
          </mapgis-ui-select>
        </template>
      </mapgis-ui-col>
    </mapgis-ui-row>
  </div>
</template>

<script>
export default {
  name: "mapgis-ui-select-panel",
  props: {
    label: {
      type: String,
      default: "标题"
    },
    showLabel: {
      type: Boolean,
      default: true
    },
    value: {
      type: [String, Number],
      default: ""
    },
    selectOptions: {
      type: [Array, Object],
      default: () => {
        return [];
      }
    },
    labelCol: {
      type: Number,
      default: 8
    },
    wrapperCol: {
      type: Number,
      default: 16
    },
    transparent: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    value(next) {
      this.selected = next;
    },
    selected(next) {
      this.$emit("change", next);
    }
  },
  model: {
    prop: "value",
    event: "change"
  },
  data() {
    return {
      selected: this.selectOptions.constructor == Array ? this.value : this.selectOptions[this.value],
    };
  },
  methods: {}
};
</script>

<style scoped></style>
