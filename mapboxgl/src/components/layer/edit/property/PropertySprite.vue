<template>
  <mapgis-ui-row class="mapgis-property-sprite">
    <mapgis-ui-col :span="7">
      <mapgis-ui-iconfont :type="rule.icon" />
      <span class="mapgis-property-sprite-left">{{ rule.title }} </span>
    </mapgis-ui-col>
    <mapgis-ui-col :span="17">
      <mapgis-ui-sprite-select
        v-model="value"
        :url="sprite"
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

<style>
.mapgis-property-sprite {
  width: 100%;
}

.mapgis-property-sprite-left {
  height: 30px;
  line-height: 30px;
}
</style>
