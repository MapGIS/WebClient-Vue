<template>
  <mapgis-ui-row class="mapgis-property-number">
    <span class="mapgis-property-number-left">{{ rule.title }} </span>
    <mapgis-ui-input-number
      class="mapgis-property-number-right"
      v-model="value"
      :min="min"
      :max="max"
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
    min: { type: Number, default: 0 },
    max: { type: Number, default: 100 }
  },
  model: {
    prop: "number",
    event: "change"
  },
  data() {
    return {
      value: 0
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
