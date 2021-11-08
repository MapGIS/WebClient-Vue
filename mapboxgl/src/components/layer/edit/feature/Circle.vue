<template>
  <Feature :rules="rules" :layerid="layerid" @edit-change="onEditChange" />
</template>

<script>
import EditMixin from "../EditMixin";
import Feature from "./Feature.vue";

const CircleRules = [
  {
    title: "原点半径",
    icon: "mapgis-icon_huizhiyuanxing",
    type: "number",
    layerprop: "circle-radius",
    layertype: "paint",
    default: 5,
    minimum: 0
  },
  {
    title: "原点颜色",
    icon: "mapgis-bg-colors",
    type: "color",
    layerprop: "circle-color",
    layertype: "paint",
    default: "#000000"
  },
  {
    title: "原点透明",
    icon: "mapgis-opacity",
    type: "number",
    layerprop: "circle-opacity",
    layertype: "paint",
    default: 1,
    minimum: 0,
    maximum: 1
  },
  {
    title: "边线半径",
    icon: "mapgis-huizhiyuan1",
    type: "number",
    layerprop: "circle-stroke-width",
    layertype: "paint",
    default: 0,
    minimum: 0
  },
  {
    title: "边线颜色",
    icon: "mapgis-bg-colors",
    type: "color",
    layerprop: "circle-stroke-color",
    layertype: "paint",
    default: "#000000"
  },
  {
    title: "边线透明",
    icon: "mapgis-opacity",
    type: "number",
    layerprop: "circle-stroke-opacity",
    layertype: "paint",
    default: 1,
    minimum: 0,
    maximum: 1
  }
];

export default {
  name: "mapgis-mvt-editor-circle",
  mixins: [EditMixin],
  components: { Feature },
  data() {
    return {
      rules: CircleRules
    };
  },
  methods: {
    onEditChange(event) {
      this.$_emitEvent(event);
    }
  }
};
</script>
