<template>
  <Feature :rules="rules" :layerid="layerid" @edit-change="onEditChange" />
</template>

<script>
import EditMixin from "../EditMixin";
import Feature from "./Feature.vue";

const CircleRules = [
  {
    title: "半径",
    type: "number",
    layerprop: "circle-radius",
    layertype: "paint",
    default: 5,
    minimum: 0
  },
  {
    title: "颜色",
    type: "color",
    layerprop: "circle-color",
    layertype: "paint",
    default: "#000000"
  },
  {
    title: "透明度",
    type: "number",
    layerprop: "circle-opacity",
    layertype: "paint",
    default: 1,
    minimum: 0,
    maximum: 1
  },
  {
    title: "边线半径",
    type: "number",
    layerprop: "circle-stroke-width",
    layertype: "paint",
    default: 0,
    minimum: 0
  },
  {
    title: "边线颜色",
    type: "color",
    layerprop: "circle-stroke-color",
    layertype: "paint",
    default: "#000000"
  },
  {
    title: "边线透明度",
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
