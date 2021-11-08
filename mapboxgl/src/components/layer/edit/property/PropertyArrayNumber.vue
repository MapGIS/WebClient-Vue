<template>
  <mapgis-ui-space>
    <mapgis-ui-input-number
      class="mapgis-property-array-number-right"
      v-model="valuex"
      :min="minimum"
      :max="maximum"
      :size="size"
      @change="onChangeX"
    />
    <mapgis-ui-input-number
      class="mapgis-property-array-number-right"
      v-model="valuey"
      :min="minimum"
      :max="maximum"
      :size="size"
      @change="onChangeY"
    />
  </mapgis-ui-space>
</template>

<script>
import EditMixin from "../EditMixin";
export default {
  name: "mapgis-mvt-editor-property-number",
  mixins: [EditMixin],
  inject: ["map"],
  props: {
    rule: Object,
    minimum: { type: Number, default: -100 },
    maximum: { type: Number, default: 100 },
    size: { type: String, default: "small" }
  },
  watch: {
    layerid(next) {
      this.valuex = this.getValueX(next);
      this.valuey = this.getValueY(next);
    }
  },
  data() {
    return {
      valuex: this.getValueX(),
      valuey: this.getValueY()
    };
  },
  methods: {
    onChangeX(number) {
      const { map, rule, layerid, valuey } = this;
      let offset = [number, valuey];
      if (layerid && rule) {
        const { layertype, layerprop } = rule;
        if (rule.layertype === "paint") {
          map.setPaintProperty(layerid, layerprop, offset);
        } else if (rule.layertype === "layout") {
          map.setLayoutProperty(layerid, layerprop, offset);
        }
        let event = { layertype, layerprop, layervalue: offset };
        this.$_emitEvent(event);
      }
    },
    onChangeY(number) {
      const { map, rule, layerid, valuex } = this;
      let offset = [valuex, number];
      if (layerid && rule) {
        const { layertype, layerprop } = rule;
        if (rule.layertype === "paint") {
          map.setPaintProperty(layerid, layerprop, offset);
        } else if (rule.layertype === "layout") {
          map.setLayoutProperty(layerid, layerprop, offset);
        }
        let event = { layertype, layerprop, layervalue: offset };
        this.$_emitEvent(event);
      }
    },
    getValueX(id) {
      const { map, layerid, rule } = this;
      let value = undefined;
      id = id || layerid;
      if (map && layerid && rule) {
        const { layertype, layerprop } = rule;
        value = rule.default[0];
        const layer = this.$_getLayer(layerid);
        if (layer && layer[layertype] && layer[layertype][layerprop]) {
          value = layer[layertype][layerprop][0];
        }
      }
      return value;
    },
    getValueY(id) {
      const { map, layerid, rule } = this;
      let value = undefined;
      id = id || layerid;
      if (map && layerid && rule) {
        const { layertype, layerprop } = rule;
        value = rule.default[1];
        const layer = this.$_getLayer(layerid);
        if (layer && layer[layertype] && layer[layertype][layerprop]) {
          value = layer[layertype][layerprop][1];
        }
      }
      return value;
    }
  }
};
</script>

<style>
.mapgis-property-array-number-right {
  width: 90px !important;
}
</style>
