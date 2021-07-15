<template>
  <mapgis-ui-row class="mapgis-property-number">
    <span class="mapgis-property-number-left">{{ rule.title }} </span>
    <mapgis-ui-input-number
      class="mapgis-property-number-right"
      v-model="value"
      :min="minimum"
      :max="maximum"
      @change="onChange"
    />
  </mapgis-ui-row>
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
    maximum: { type: Number, default: 1000 }
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
      const { map, rule, layerid } = this;
      this.$emit("change", number);
      if (layerid && rule) {
        const { layertype, layerprop } = rule;
        if (rule.layertype === "paint") {
          map.setPaintProperty(layerid, layerprop, number);
          let event = { layertype, layerprop, layervalue: number };
          this.$_emitEvent(event);
        }
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
.mapgis-property-number {
  width: 100%;
}

.mapgis-property-number-left {
  float: left;
  height: 30px;
  line-height: 30px;
}

.mapgis-property-number-right {
  float: right;
  width: 160px;
}
</style>
