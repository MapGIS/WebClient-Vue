<template>
  <Feature :rules="rules" :layerid="layerid" @edit-change="onEditChange" />
</template>

<script>
import EditMixin from "../EditMixin";
import Feature from "./Feature.vue";

const LineRules = [
  {
    title: "颜色",
    type: "color",
    layerprop: "line-color",
    layertype: "paint",
    default: "#000000"
  },
  {
    title: "符号",
    type: "sprite",
    layerprop: "line-pattern",
    layertype: "paint"
  },
  {
    title: "透明度",
    type: "number",
    layerprop: "line-opacity",
    layertype: "paint",
    default: 1,
    minimum: 0,
    maximum: 1
  },
  {
    title: "线宽",
    type: "number",
    layerprop: "line-width",
    layertype: "paint",
    default: 1,
    minimum: 0
  },
  {
    title: "线头",
    type: "enum",
    layerprop: "line-cap",
    layertype: "layout",
    default: "butt"
  },
  {
    title: "拐角",
    type: "enum",
    layerprop: "line-join",
    layertype: "layout",
    default: "miter"
  }
];

export default {
  name: "mapgis-mvt-editor-line",
  mixins: [EditMixin],
  components: { Feature },
  data() {
    return {
      rules: LineRules
    };
  },
  methods: {
    onEditChange(event) {
      this.$_emitEvent(event);
    }
  }
};
</script>
