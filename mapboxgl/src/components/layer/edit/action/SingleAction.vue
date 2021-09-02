<template>
  <div class="mapgis-mvt-action-single">
    <!-- <mapgis-ui-row class="mapgis-mvt-action-single-control">
      <div class="mapgis-mvt-action-single-left">全部级别</div>
      <div class="mapgis-mvt-action-single-right">
        显示 <mapgis-ui-switch v-model="enable" />
      </div>
    </mapgis-ui-row>-->
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
      <symbol-style
        v-else-if="type == 'symbol'"
        :layerid="layerid"
        @edit-change="onEditChange"
      />
    </div>
    <filter-action :layerid="layerid" />
  </div>
</template>

<script>
import FilterAction from "./FilterAction.vue";
import CircleStyle from "../feature/Circle.vue";
import LineStyle from "../feature/Line.vue";
import FillStyle from "../feature/Fill.vue";
import SymbolStyle from "../feature/Symbol.vue";
import EditMixin from "../EditMixin";

export default {
  name: "mapgis-mvt-action-single",
  components: { FilterAction, CircleStyle, LineStyle, FillStyle, SymbolStyle },
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
      type: this.getType()
    };
  },
  watch: {
    layerid: function(id) {
      this.type = this.getType(id);
    }
  },
  methods: {
    onEditChange(event) {
      this.$_emitEvent(event);
    },
    getType(id) {
      id = id || this.layerid;
      const layer = this.$_getLayer(id);
      let type = layer ? layer.type : undefined;
      return type;
    }
  }
};
</script>

<style>
.mapgis-mvt-action-single {
  /* height: fit-content;
  overflow-y: scroll; */
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
