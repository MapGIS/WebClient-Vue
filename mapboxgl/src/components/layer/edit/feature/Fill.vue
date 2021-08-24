<template>
  <Feature :rules="rules" :layerid="layerid" @edit-change="onEditChange" />
</template>

<script>
import EditMixin from "../EditMixin";
import Feature from "./Feature.vue";

const FillRules = [
  {
    title: "颜色",
    icon: "mapgis-yansehecheng",
    type: "color",
    layerprop: "fill-color",
    layertype: "paint",
    default: "#000000"
  },
  {
    title: "符号",
    icon: "mapgis-yangshikuguanli",
    type: "sprite",
    layerprop: "fill-pattern",
    layertype: "paint"
  },
  {
    title: "抗锯齿",
    icon: "mapgis-xianpinghuayidongdian",
    type: "boolean",
    layerprop: "fill-antialias",
    layertype: "paint",
    default: true
  },
  {
    title: "透明度",
    icon: "mapgis-duibidutiaojie",
    type: "number",
    layerprop: "fill-opacity",
    layertype: "paint",
    default: 1,
    minimum: 0,
    maximum: 1
  },
  {
    title: "边线颜色",
    icon: "mapgis-yansehecheng",
    type: "color",
    layerprop: "fill-outline-color",
    layertype: "paint"
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
