<template>
  <mapgis-ui-card
    v-show="visible"
    :style="outStyle"
    title="设置显示比例尺"
    class="mapgis-mvt-scale-card"
  >
    <a slot="extra" @click="handleClose">x</a>
    <mapgis-ui-slider range :min="0" :max="24" :marks="marks" v-model="value" />
    <mapgis-ui-divider>属性过滤</mapgis-ui-divider>
    <filter-action :layerid="layerid"/>
  </mapgis-ui-card>
</template>

<script>
import EditMixin from "./EditMixin";

import FilterAction from "./action/FilterAction.vue";

export default {
  name: "mapgis-mvt-scale",
  components: { FilterAction },
  inject: ["map", "mapbox"],
  mixins: [EditMixin],
  props: {
    outStyle: {
      type: Object,
      default: () => {
        return {
          left: "10px",
          top: "10px"
        };
      }
    },
    layerid: {
      type: String
    },
    visible: {
      type: Boolean
    }
  },
  model: {
    prop: "visible",
    event: "change-visible"
  },
  watch: {
    layerid(next) {
      this.value = this.getValue(next);
    },
    value(next) {
      this.onZoomChange(next);
    }
  },
  data() {
    return {
      show: true,
      value: this.getValue(),
      marks: {
        0: "0级",
        8: "8级",
        16: "16级",
        24: {
          style: {
            color: "#f50"
          },
          label: <strong>24级</strong>
        }
      }
    };
  },
  methods: {
    onZoomChange(zoom) {
      const { map, layerid } = this;
      zoom = zoom || [0, 24];
      let eventMin = {
        layertype: "root",
        layerprop: "minzoom",
        layervalue: zoom[0]
      };
      let eventMax = {
        layertype: "root",
        layerprop: "maxzoom",
        layervalue: zoom[1]
      };
      this.$_emitEvent(eventMin);
      this.$_emitEvent(eventMax);
      if (!map || !layerid) return;
      if (map.getLayer(layerid)) {
        map.setLayerZoomRange(layerid, zoom[0], zoom[1]);
      }
    },
    handleClose() {
      this.$emit("change-visible", false);
    },
    getValue(id) {
      const { map, layerid } = this;
      let value = [0, 24];
      id = id || layerid;
      if (map && layerid) {
        const layer = this.$_getLayer(layerid);
        if (!layer) return value;
        const { minzoom = 0, maxzoom = 24 } = layer;
        value = [minzoom, maxzoom];
      }
      return value;
    }
  }
};
</script>

<style lang="css">
.mapgis-mvt-scale-card {
  width: 200px;
  position: absolute;
  z-index: 1000;
  height: calc(100vh - 200px);
  overflow-y: scroll;
    /* 针对火狐浏览器 */
  scrollbar-color: transparent transparent;
  scrollbar-width: thin;
}
.mapgis-mvt-scale-card .action-type {
  width: 120px;
  text-align: center;
}
</style>
