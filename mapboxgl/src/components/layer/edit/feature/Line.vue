<template>
  <Feature :rules="rules" :layerid="layerid" @edit-change="onEditChange" />
</template>

<script>
import EditMixin from "../EditMixin";
import Feature from "./Feature.vue";

const LineRules = [
  {
    title: "边线颜色",
    icon: "mapgis-bg-colors",
    type: "color",
    layerprop: "line-color",
    layertype: "paint",
    default: "#000000"
  },
  {
    title: "边线符号",
    icon: "mapgis-Symbols-1",
    type: "sprite",
    layerprop: "line-pattern",
    layertype: "paint"
  },
  {
    title: "边线透明",
    icon: "mapgis-opacity",
    type: "number",
    layerprop: "line-opacity",
    layertype: "paint",
    default: 1,
    minimum: 0,
    maximum: 1
  },
  {
    title: "边线线宽",
    icon: "mapgis-join-2",
    type: "number",
    layerprop: "line-width",
    layertype: "paint",
    default: 1,
    minimum: 0
  },
  {
    title: "边线线头",
    icon: "mapgis-line",
    type: "enum",
    layerprop: "line-cap",
    layertype: "layout",
    enums: [
      {
        icon: "mapgis-join-1",
        value: "butt",
        title: "尖头"
      },
      {
        icon: "mapgis-join-3",
        value: "round",
        title: "圆头"
      },
      {
        icon: "mapgis-join-2",
        value: "square",
        title: "平头"
      }
    ],
    default: "butt"
  },
  {
    title: "边线拐角",
    icon: "mapgis-join-2",
    type: "enum",
    enums: [
      {
        icon: "mapgis-join-1",
        value: "miter",
        title: "棱拐"
      },
      {
        icon: "mapgis-join-3",
        value: "round",
        title: "圆拐"
      },
      {
        icon: "mapgis-join-2",
        value: "bevel",
        title: "平拐"
      }
    ],
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
