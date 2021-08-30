<template>
  <mapgis-ui-collapse-card
    :outStyle="outStyle"
    :title="title"
    :iconshape="iconshape"
    mode="button"
    @click="fitBounds"
  >
    <div class="mapgis-fitbounds-wrapper" slot="icon-hiden" @click="fitBounds">
      <mapgis-ui-iconfont type="mapgis-fullscreen" />
    </div>
  </mapgis-ui-collapse-card>
</template>

<script>
export default {
  name: "mapgis-fitbounds",
  inject: ["mapbox", "map"],
  props: {
    outStyle: {
      type: Object,
      default: () => {
        return {
          right: "10px",
          bottom: "10px"
        };
      }
    },
    bounds: {
      type: Array,
      default: () => [-180, -90, 180, 90]
    },
    iconshape: {
      type: String,
      default: "circle" // 'round' ''
    }
  },
  data() {
    return {
      title: "缩放至全图范围"
    };
  },
  methods: {
    fitBounds() {
      const { map, bounds } = this;
      const bbox = [
        [bounds[0], bounds[1]],
        [bounds[2], bounds[3]]
      ];
      map.fitBounds(bbox, {
        padding: { top: 10, bottom: 10, left: 10, right: 10 }
      });
    }
  }
};
</script>

<style>
.mapgis-fitbounds-wrapper {
  width: 36px;
  height: 36px;
}
.mapgis-fitbounds-wrapper .anticon {
  font-size: 22px;
  margin: 5px;
}
</style>
