<template>
  <mapgis-ui-row class="mapgis-property-color">
    <span class="mapgis-property-color-left">{{ rule.title }} </span>
    <mapgis-ui-popover v-model="visible" trigger="click">
      <a slot="content">
        <color-picker
          theme="light"
          :color="value"
          :sucker-hide="false"
          :sucker-canvas="suckerCanvas"
          :sucker-area="suckerArea"
          @changeColor="onChange"
          @openSucker="openSucker"
        />
      </a>
      <mapgis-ui-input class="mapgis-property-color-right" v-model="value" />
    </mapgis-ui-popover>
  </mapgis-ui-row>
</template>

<script>
import EditMixin from "../EditMixin";
import colorPicker from "@caohenghu/vue-colorpicker";

export default {
  name: "mapgis-mvt-editor-property-color",
  inject: ["map"],
  mixins: [EditMixin],
  components: {
    colorPicker
  },
  props: {
    rule: Object
  },
  model: {
    prop: "color",
    event: "change"
  },
  data() {
    return {
      visible: false,
      value: "#ffffff",
      suckerCanvas: null,
      suckerArea: [],
      isSucking: false
    };
  },
  methods: {
    onChange(event) {
      const color = event.hex;
      const { map, rule, layerid } = this;
      this.$emit("change", color);
      this.value = color;
      if (layerid && rule) {
        const { layertype, layerprop } = rule;
        if (rule.layertype === "paint") {
          map.setPaintProperty(layerid, layerprop, color);
          let event = { layertype, layerprop, layervalue: color };
          this.$_emitEvent(event);
        }
      }
    },
    openSucker() {},
    hide() {
      this.visible = false;
    }
  }
};
</script>

<style>
.mapgis-property-color {
  width: 100%;
}

.mapgis-property-color-left {
  float: left;
  height: 30px;
  line-height: 30px;
}

.mapgis-property-color-right {
  float: right;
  width: 160px;
}
</style>
