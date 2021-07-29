<template>
  <mapgis-ui-row class="mapgis-property-sprite">
    <mapgis-ui-col span="6">
      <span class="mapgis-property-sprite-left">{{ rule.title }} </span>
    </mapgis-ui-col>
    <mapgis-ui-col span="6">
      <mapgis-ui-sprite-select
        v-model="value"
        url="http://localhost:6163/igs/rest/mrms/vtiles/sprite"
        @change="onChange"
      />
    </mapgis-ui-col>
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
    onChange(sprite) {
      const { map, rule, layerid } = this;
      this.$emit("change", sprite);
      if (layerid && rule) {
        const { layertype, layerprop } = rule;
        if (rule.layertype === "paint") {
          map.setPaintProperty(layerid, layerprop, sprite);
          let event = { layertype, layerprop, layervalue: sprite };
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
.mapgis-property-sprite {
  width: 100%;
}

.mapgis-property-sprite-left {
  height: 30px;
  line-height: 30px;
}
</style>
