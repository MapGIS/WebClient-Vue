<template>
  <Feature :rules="rules" :layerid="layerid" @edit-change="onEditChange" />
</template>

<script>
import EditMixin from "../EditMixin";
import Feature from "./Feature.vue";

const CircleRules = [
  {
    title: "属性字段",
    icon: "mapgis-translate",
    type: "string",
    layerprop: "text-field",
    layertype: "layout",
    default: ""
  },
  /* {
    title: "字体",
    icon: "mapgis-bg-colors",
    type: "string",
    layerprop: "text-font",
    layertype: "layout",
    default: ["微软雅黑", "微软雅黑"]
  }, */
  {
    title: "字体大小",
    icon: "mapgis-font-size",
    type: "number",
    layerprop: "text-size",
    layertype: "layout",
    default: 16,
    minimum: 0,
    maximum: 100
  },
  {
    title: "字体偏移",
    icon: "mapgis-font-colors",
    type: "array-number",
    layerprop: "text-offset",
    layertype: "layout",
    default: [0, 0],
    minimum: -100,
    maximum: 100
  },
  {
    title: "字体颜色",
    icon: "mapgis-bg-colors",
    type: "color",
    layerprop: "text-color",
    layertype: "paint",
    default: "#000000"
  },
  {
    title: "蒙片大小",
    icon: "mapgis-font-size",
    type: "number",
    layerprop: "text-halo-width",
    layertype: "paint",
    default: 0,
    minimum: 0,
    maximum: 40
  },
  {
    title: "蒙片颜色",
    icon: "mapgis-bg-colors",
    type: "color",
    layerprop: "text-halo-color",
    layertype: "paint",
    default: "rgba(0, 0, 0, 0)"
  },
  {
    title: "符号",
    icon: "mapgis-bg-colors",
    type: "sprite",
    layerprop: "icon-image",
    layertype: "layout",
    default: "#000000"
  },
  {
    title: "符号大小",
    icon: "mapgis-font-size",
    type: "number",
    layerprop: "icon-size",
    layertype: "layout",
    default: 1,
    minimum: 0,
    maximum: 10
  },
  {
    title: "符号偏移",
    icon: "mapgis-font-colors",
    type: "array-number",
    layerprop: "icon-offset",
    layertype: "layout",
    default: [0, 0],
    minimum: -100,
    maximum: 100
  }
];

export default {
  name: "mapgis-mvt-editor-symbol",
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
