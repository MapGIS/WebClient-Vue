<template>
  <mapgis-ui-switch v-model="value" :size="size" @change="onChange" />
</template>

<script>
import EditMixin from "../EditMixin";
export default {
  name: "mapgis-mvt-editor-property-boolean",
  mixins: [EditMixin],
  inject: ["map"],
  props: {
    rule: Object,
    minimum: { type: Number, default: 0 },
    maximum: { type: Number, default: 1000 },
    size: { type: String, default: "small" }
  },
  model: {
    prop: "boolean",
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
    onChange(boolean) {
      if (typeof boolean === "string") return;
      const { map, rule, layerid } = this;
      this.$emit("change", boolean);
      if (layerid && rule) {
        const { layertype, layerprop } = rule;
        if (rule.layertype === "paint") {
          map.setPaintProperty(layerid, layerprop, boolean);
        } else if (rule.layertype === "layout") {
          map.setLayoutProperty(layerid, layerprop, boolean);
        }
        let event = { layertype, layerprop, layervalue: boolean };
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
