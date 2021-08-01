<template>
  <mapgis-ui-row class="mapgis-property-number">
    <mapgis-ui-col span="7">
      <mapgis-ui-iconfont :type="rule.icon" />
      <span class="mapgis-property-string-left">{{ rule.title }} </span>
    </mapgis-ui-col>
    <mapgis-ui-col span="17">
      <mapgis-ui-input
        class="mapgis-property-string-right"
        v-model="value"
        @change="onChange"
      />
    </mapgis-ui-col>
  </mapgis-ui-row>
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
.mapgis-property-number {
  width: 100%;
}

.mapgis-property-string-left {
  height: 30px;
  line-height: 30px;
}

.mapgis-property-string-right {
  width: 100%;
}
</style>
