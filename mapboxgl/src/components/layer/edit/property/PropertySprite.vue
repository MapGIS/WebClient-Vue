<template>
  <mapgis-ui-sprite-select
    v-model="value"
    :url="sprite"
    @change="onChange"
    :size="size"
  />
</template>

<script>
import EditMixin from "../EditMixin";
export default {
  name: "mapgis-mvt-editor-property-number",
  mixins: [EditMixin],
  inject: ["map"],
  props: {
    rule: Object,
    minimum: { type: Number, default: 0 },
    maximum: { type: Number, default: 1000 },
    size: { type: String, default: "small" }
  },
  model: {
    prop: "number",
    event: "change"
  },
  watch: {
    layerid(next) {
      this.value = this.getValue(next);
    }
  },
  data() {
    return {
      value: this.getValue(),
      sprite: ""
    };
  },
  mounted() {
    let { map } = this;
    if (map) {
      let style = map.getStyle();
      if (!style) return;
      let { sprite } = style;
      this.sprite = sprite;
    }
  },
  methods: {
    onChange(sprite) {
      const { map, rule, layerid } = this;
      this.$emit("change", sprite);
      if (layerid && rule) {
        const { layertype, layerprop } = rule;
        if (rule.layertype === "paint") {
          map.setPaintProperty(layerid, layerprop, sprite);
        } else if (rule.layertype === "layout") {
          map.setLayoutProperty(layerid, layerprop, sprite);
        }
        let event = { layertype, layerprop, layervalue: sprite };
        this.$_emitEvent(event);
      }
    },
    getValue(id) {
      const { map, layerid, rule } = this;
      let value = undefined;
      id = id || layerid;
      if (map && layerid && rule) {
        const { layertype, layerprop } = rule;
        value = rule.default;
        const layer = this.$_getLayer(layerid);
        if (layer && layer[layertype] && layer[layertype][layerprop]) {
          value = layer[layertype][layerprop];
        }
      }
      return value;
    }
  }
};
</script>

<style></style>
