<template>
  <div class="mapgis-mvt-action-single">
    <mapgis-ui-row class="mapgis-mvt-action-single-control">
      <div class="mapgis-mvt-action-single-left">全部级别</div>
      <div class="mapgis-mvt-action-single-right">
        显示 <mapgis-ui-switch v-model="enable" />
      </div>
    </mapgis-ui-row>
    <mapgis-ui-divider />
    <div v-if="enable">
      <fill-style
        v-if="type == 'fill'"
        :layerid="layerid"
        @edit-change="onEditChange"
      />
      <line-style
        v-else-if="type == 'line'"
        :layerid="layerid"
        @edit-change="onEditChange"
      />
      <circle-style
        v-else-if="type == 'circle'"
        :layerid="layerid"
        @edit-change="onEditChange"
      />
    </div>
    <filter-action />
  </div>
</template>

<script>
import FilterAction from "./FilterAction.vue";
import CircleStyle from "../feature/Circle.vue";
import LineStyle from "../feature/Line.vue";
import FillStyle from "../feature/Fill.vue";
import EditMixin from "../EditMixin";

export default {
  name: "mapgis-mvt-action-single",
  components: { FilterAction, CircleStyle, LineStyle, FillStyle },
  mixins: [EditMixin],
  inject: ["map", "mapbox"],
  props: {
    layerid: {
      type: String
    }
  },
  data() {
    return {
      enable: true,
      type: undefined
    };
  },
  watch: {
    layerid: function(id) {
      const layer = this.$_getLayer(id);
      this.type = layer.type;
    }
  },
  methods: {
    onEditChange(event) {
      this.$_emitEvent(event);
    }
  }
};
</script>

<style>
.mapgis-mvt-action-single {
}
.mapgis-mvt-action-single-control {
  margin-top: 20px;
  width: 100%;
}
.mapgis-mvt-action-single-left {
  float: left;
}
.mapgis-mvt-action-single-right {
  float: right;
}
</style>
