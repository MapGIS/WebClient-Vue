<template>
  <mapgis-ui-input-number
    class="mapgis-property-number-right"
    :style="{ width: '100%' }"
    v-model="value"
    :min="minimum"
    :max="maximum"
    :size="size"
    @change="onChange"
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
      value: this.getValue()
    };
  },
  methods: {
    onChange(number) {
      const { minimum, maximum } = this;
      if (typeof number === "string") return;
      if (number > maximum || number < minimum) return;
      const { map, rule, layerid } = this;
      this.$emit("change", number);
      if (layerid && rule) {
        const { layertype, layerprop } = rule;
        if (rule.layertype === "paint") {
          map.setPaintProperty(layerid, layerprop, number);
        } else if (rule.layertype === "layout") {
          map.setLayoutProperty(layerid, layerprop, number);
        }
        let event = { layertype, layerprop, layervalue: number };
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

<style>
.mapgis-property-number-right {
  width: 100%;
}
</style>
