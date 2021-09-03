<template>
  <!-- <div class="theme-panel-color-outer"> -->
  <mapgis-ui-button :size="size" :style="{ width: '100%' }">
    <colorPicker
      v-model="value"
      class="mapgis-property-color"
      @change="onChange"
    />
  </mapgis-ui-button>
  <!-- </div> -->
</template>

<script>
import EditMixin from "../EditMixin";

export default {
  name: "mapgis-mvt-editor-property-color",
  inject: ["map"],
  mixins: [EditMixin],
  components: {},
  props: {
    rule: Object,
    size: { type: String, default: "small" }
  },
  model: {
    prop: "color",
    event: "change"
  },
  watch: {
    layerid(next) {
      this.value = this.getValue(next);
    }
  },
  data() {
    return {
      visible: false,
      value: this.getValue(),
      suckerCanvas: null,
      suckerArea: [],
      isSucking: false
    };
  },
  methods: {
    onChange(color) {
      const { map, rule, layerid } = this;
      this.$emit("change", color);
      this.value = color;
      if (layerid && rule) {
        const { layertype, layerprop } = rule;
        if (rule.layertype === "paint") {
          map.setPaintProperty(layerid, layerprop, color);
        } else if (rule.layertype === "layout") {
          map.setLayoutProperty(layerid, layerprop, color);
        }
        let event = { layertype, layerprop, layervalue: color };
        this.$_emitEvent(event);
      }
    },
    openSucker() {},
    hide() {
      this.visible = false;
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
      if (typeof value === "object") {
        if (
          value.stops &&
          value.stops.length > 0 &&
          value.stops[0].length > 1
        ) {
          value = value.stops[0][1];
        }
      }
      return value;
    }
  }
};
</script>
<<<<<<< HEAD
=======

<style scoped>
.mapgis-property-color {
  width: 100%;
}

.mapgis-property-color-left {
  height: 30px;
  line-height: 30px;
  margin-left: -14px;
}

/deep/.theme-panel-line-color .colorBtn {
  width: 167px !important;
  height: 17px !important;
  margin-left: 5px;
  margin-top: 6px;
}

/deep/.theme-panel-color-outer {
  width: 180px;
  height: 32px;
  border: 1px solid var(--border-color-base);
  background-color: var(--component-background);
  border-radius: 4px;
}
</style>
>>>>>>> main
