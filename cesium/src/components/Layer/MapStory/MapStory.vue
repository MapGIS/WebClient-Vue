<template>
  <div>
    <project-panel ref="projectPanel"
                   @addFeature="$_addFeature"
                   @titleChanged="$_titleChanged"
                   @closeHoverPanel="$_closeHoverPanel"
                   :dataSource="dataSourceCopy"/>
  </div>
</template>

<script>
import projectPanel from "./project/projectPanel"
import mapStoryService from "./mapStoryService"
import base64Image from "./img/base64Image"

export default {
  name: "mapgis-3d-map-story-layer",
  mixins: [mapStoryService],
  components: {
    "project-panel": projectPanel
  },
  data() {
    return {
      dataSourceCopy: []
    }
  },
  props: {
    dataSource: {
      type: Array
    }
  },
  watch: {
    dataSource: {
      handler: function () {
        this.dataSourceCopy = this.dataSource;
      },
      deep: true
    }
  },
  created() {
    this.dataSourceCopy = this.dataSource;
  },
  methods: {
    $_closeHoverPanel() {
      let vm = this;
      this.$refs.projectPanel.$_addFeatureSet(window.feature);
      let img = document.createElement("img");
      img.src = base64Image[0].value;
      img.onload = function () {
        vm.viewer.entities.add({
          position: window.feature.camera.cartesian3Position,
          billboard: {
            image: img
          }
        });
      }
    },
    $_titleChanged(title) {
      if (window.feature) {
        window.feature.title = title;
      }
    },
    $_addFeature(feature) {
      let vm = this;
      switch (feature.type) {
        case "point":
          this.$_addPoint(function (position, cartesian3Position) {
            if (!vm.$refs.projectPanel.showEditPanel) {
              feature.feature.baseUrl.geometry = cartesian3Position;
              feature.feature.camera.longLatPosition = [position.lat, position.lng, position.alt];
              feature.feature.camera.cartesian3Position = cartesian3Position;
              window.feature = feature.feature;
              vm.$refs.projectPanel.showEditPanel = true;
            }
          });
          break;
      }
    }
  },
  mounted() {
    this.$_initManager();
  }
}
</script>

<style scoped>

</style>