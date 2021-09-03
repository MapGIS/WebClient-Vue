<template>
  <Feature :rules="rules" :layerid="layerid" @edit-change="onEditChange" />
</template>

<script>
import EditMixin from "../EditMixin";
import Feature from "./Feature.vue";

const FillRules = [
  {
    title: "填充颜色",
    icon: "mapgis-bg-colors",
    type: "color",
    layerprop: "fill-color",
    layertype: "paint",
    default: "#000000"
  },
  {
    title: "填充符号",
    icon: "mapgis-Symbols-1",
    type: "sprite",
    layerprop: "fill-pattern",
    layertype: "paint"
  },
  {
    title: "抗锯齿",
    icon: "mapgis-line",
    type: "boolean",
    layerprop: "fill-antialias",
    layertype: "paint",
    default: true
  },
  {
    title: "填充透明",
    icon: "mapgis-opacity",
    type: "number",
    layerprop: "fill-opacity",
    layertype: "paint",
    default: 1,
    minimum: 0,
    maximum: 1
  },
  {
    title: "边线颜色",
    icon: "mapgis-bg-colors",
    type: "color",
    layerprop: "fill-outline-color",
    layertype: "paint",
    default: "#000000"
  }
];

export default {
  name: "mapgis-mvt-editor-fill",
  mixins: [EditMixin],
  components: { Feature },
  data() {
    return {
      rules: FillRules
    };
  },
  methods: {
    onEditChange(event) {
      this.$_emitEvent(event);
    }
  }
};
</script>
