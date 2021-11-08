<template>
  <mapgis-ui-radio-group v-model="value" :size="size" @change="onChange">
    <mapgis-ui-radio-button
      class="mapgis-property-enum"
      :value="e.value"
      v-for="(e, i) in enums"
      :key="i"
    >
      <mapgis-ui-iconfont :type="e.icon" />
      {{ e.title }}
    </mapgis-ui-radio-button>
  </mapgis-ui-radio-group>
</template>

<script>
import EditMixin from "../EditMixin";
export default {
  name: "mapgis-mvt-editor-property-enum",
  mixins: [EditMixin],
  inject: ["map"],
  props: {
    rule: Object,
    enums: { type: Array, required: true },
    size: { type: String, default: "small" }
  },
  model: {
    prop: "enum",
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
      let enums = e.target.value;
      if (typeof enums != "string") return;
      const { map, rule, layerid } = this;
      this.$emit("change", enums);
      if (layerid && rule) {
        const { layertype, layerprop } = rule;
        if (rule.layertype === "paint") {
          map.setPaintProperty(layerid, layerprop, enums);
        } else if (rule.layertype === "layout") {
          map.setLayoutProperty(layerid, layerprop, enums);
        }
        let event = { layertype, layerprop, layervalue: enums };
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
.mapgis-property-enum span{
  font-size: 12px;
}
</style>
