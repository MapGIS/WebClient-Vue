<template>
  <mapgis-ui-input
    class="mapgis-property-string-right"
    v-model="value"
    @change="onChange"
  />
</template>

<script>
import EditMixin from "../EditMixin";
export default {
  name: "mapgis-mvt-editor-property-string",
  mixins: [EditMixin],
  inject: ["map"],
  props: {
    rule: Object
  },
  model: {
    prop: "string",
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
    onChange(e) {
      let string = e.target.value;
      const { map, rule, layerid } = this;
      this.$emit("change", string);
      if (layerid && rule) {
        const { layertype, layerprop } = rule;
        if (rule.layertype === "paint") {
          map.setPaintProperty(layerid, layerprop, string);
        } else if (rule.layertype === "layout") {
          map.setLayoutProperty(layerid, layerprop, string);
        }
        let event = { layertype, layerprop, layervalue: string };
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
.mapgis-property-string-right {
  width: 100%;
}
</style>
