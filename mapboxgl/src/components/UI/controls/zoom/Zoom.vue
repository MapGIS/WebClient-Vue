<template>
  <mapgis-ui-div class="mapgis-zoom-wrapper">
    <div class="mapgis-zoom-item" type="primary" @click="zoomin">
      <mapgis-ui-iconfont type="mapgis-plus" />
    </div>
    <div class="mapgis-zoom-item" type="primary" @click="zoomout">
      <mapgis-ui-iconfont type="mapgis-minus" />
    </div>
  </mapgis-ui-div>
</template>

<script>
export default {
  name: "mapgis-zoom",
  inject: ["mapbox", "map"],
  methods: {
    zoomin() {
      const { map } = this;
      map.zoomIn();
    },
    zoomout() {
      const { map } = this;
      map.zoomOut();
    }
  }
};
</script>
