<template>
  <mapgis-ui-button :size="size" :style="{ width: '100%', padding: 0 }">
    <mapgis-ui-sketch-color-picker
      :size="size"
      :color="value"
      :disableAlpha="false"
      :showColorText="false"
      @input="onChange"
    ></mapgis-ui-sketch-color-picker>
  </mapgis-ui-button>
</template>

<script>
import EditMixin from "../EditMixin";

export default {
  name: "mapgis-mvt-editor-property-color",
  inject: ["map"],
  mixins: [EditMixin],
  components: {},
  props: {
    rule: Object,
    size: { type: String, default: "default" }
  },
  model: {
    prop: "color",
    event: "change"
  },
  watch: {
    layerid(next) {
      this.value = this.getValue(next);
    }
  },
  data() {
    return {
      visible: false,
      value: this.getValue(),
      suckerCanvas: null,
      suckerArea: [],
      isSucking: false
    };
  },
  methods: {
    onChange(e) {
      const color = `rgba(${e.rgba.r}, ${e.rgba.g}, ${e.rgba.b}, ${e.rgba.a})`;
      const { map, rule, layerid } = this;
      this.$emit("change", color);
      this.value = color;
      if (layerid && rule) {
        const { layertype, layerprop } = rule;
        if (rule.layertype === "paint") {
          map.setPaintProperty(layerid, layerprop, color);
        } else if (rule.layertype === "layout") {
          map.setLayoutProperty(layerid, layerprop, color);
        }
        let event = { layertype, layerprop, layervalue: color };
        this.$_emitEvent(event);
      }
    },
    openSucker() {},
    hide() {
      this.visible = false;
    },
    getValue(id) {
      const { map, layerid, rule } = this;
      let value = "#1890FF";
      id = id || layerid;
      if (map && layerid && rule) {
        const { layertype, layerprop } = rule;
        value = rule.default;
        const layer = this.$_getLayer(layerid);
        if (layer && layer[layertype] && layer[layertype][layerprop]) {
          value = layer[layertype][layerprop];
        }
      }
      if (typeof value === "object") {
        if (
          value.stops &&
          value.stops.length > 0 &&
          value.stops[0].length > 1
        ) {
          value = value.stops[0][1];
        }
      }
      return value;
    }
  }
};
</script>
