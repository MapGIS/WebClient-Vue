<template>
  <div
    :class="{
      'mapgis-ui-color-pick-panel-sm': size == 'small',
      'mapgis-ui-color-pick-panel-transparent': transparent,
      'mapgis-ui-color-pick-panel': true
    }"
    :style="colorStyle"
  >
    <mapgis-ui-row>
      <mapgis-ui-col
        :span="labelCol"
        :class="{
          'mapgis-ui-color-pick-panel-label': true,
          'mapgis-ui-color-pick-panel-label-sm': size == 'small',
          'mapgis-ui-color-pick-panel-label-lg': size == 'large'
        }"
      >
        <label>{{ label }}</label>
      </mapgis-ui-col>
      <mapgis-ui-col :span="wrapperCol">
        <mapgis-ui-sketch-color-picker
          :color="color"
          :disableAlpha="disableAlpha"
          @input="inputChange"
          :size="size"
        />
      </mapgis-ui-col>
    </mapgis-ui-row>
  </div>
</template>

<script>
export default {
  name: "mapgis-ui-color-pick-panel",
  props: {
    label: {
      type: String,
      default: "标题"
    },
    color: {
      type: String,
      required: true,
      default: "rgb(255,255,102)"
    },
    disableAlpha: {
      type: Boolean,
      default: true
    },
    colorStyle: {
      type: Object
    },
    labelCol: {
      type: Number,
      default: 6
    },
    wrapperCol: {
      type: Number,
      default: 18
    },
    size: {
      type: String, //small default large
      default: "default"
    },
    transparent: {
      type: Boolean,
      default: false
    }
  },
  model: {
    prop: 'color',
    event: 'change'
  },
  methods: {
    inputChange(e) {
      this.$emit("input", e);
      this.$emit("change", e.hex);
      console.log('e.rgba', e.hex);
    }
  }
};
</script>
