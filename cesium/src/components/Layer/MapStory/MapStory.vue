<template>
  <div>
    <project-panel ref="projectPanel"
                   @deleteFeature="$_deleteFeature"
                   @getCamera="$_getCamera"
                   @changeColor="$_changeColor"
                   @changeIcon="$_changeIcon"
                   @showFeature="$_showFeature"
                   @addFeature="$_addFeature"
                   @titleChanged="$_titleChanged"
                   @closeHoverPanel="$_closeHoverPanel"
                   @editProject="$_editProject"
                   :dataSource="dataSourceCopy"/>
    <mapgis-3d-draw :infinite="true" @drawcreate="$_drawCreate" @load="$_drawerLoaded"/>
  </div>
</template>

<script>
import projectPanel from "./projectPanel"
import mapStoryService from "./mapStoryService"

export default {
  name: "mapgis-3d-map-story-layer",
  mixins: [mapStoryService],
  components: {
    "project-panel": projectPanel
  },
  data() {
    return {
      drawer: undefined,
      currentFeatureType: undefined,
      currentPoints: undefined,
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
    $_drawCreate(Cartesian3Points, degreeArr, viewerDraw, radians) {
      this.currentPoints = degreeArr;
      switch (this.currentFeatureType) {
        case "rectangle":
          let e = this.viewer.entities.add({
            id: window.feature.id,
            rectangle: {
              coordinates: radians,
              material: Cesium.Color.RED,
            },
          });
          break;
        case "polygon":
          this.viewer.entities.add({
            id: window.feature.id,
            polygon: {
              hierarchy: new Cesium.PolygonHierarchy(Cartesian3Points),
              material: Cesium.Color.RED,
            }
          });
          break;
        case "polyline":
          this.viewer.entities.add({
            id: window.feature.id,
            polyline: {
              positions: Cartesian3Points,
              material: Cesium.Color.RED,
              width: 3
            }
          });
          break;
      }
      if (!this.$refs.projectPanel.showEditPanel) {
        this.drawer && this.drawer.stopDraw();
        this.$refs.projectPanel.showEditPanel = true;
      }
    },
    $_drawerLoaded(drawer) {
      this.drawer = drawer;
    },
    $_editProject(index) {
    },
    $_closeHoverPanel() {
      let vm = this;
      switch (this.currentFeatureType) {
        case "point":
          this.$_getBillBoardIcon(0, function (img) {
            vm.viewer.entities.add({
              id: window.feature.id,
              position: window.feature.camera.cartesian3Position,
              billboard: {
                image: img
              }
            });
          });
          window.feature.drawType = "point";
          break;
        case "polyline":
          this.currentPoints.push(this.currentPoints[0]);
          window.feature.camera.longLatPosition = this.$_getPolygonCenter(this.currentPoints);
          window.feature.drawType = "polyline";
          break;
        case "polygon":
          window.feature.camera.longLatPosition = this.$_getPolygonCenter(this.currentPoints);
          window.feature.drawType = "polygon";
          break;
        case "rectangle":
          window.feature.camera.longLatPosition = this.$_getRectangleCenter(this.currentPoints);
          window.feature.drawType = "rectangle";
          break;
      }
      this.$refs.projectPanel.$_addFeatureSet(window.feature);
      this.$refs.projectPanel.showEditPanel = false;
    },
    $_titleChanged(title) {
      if (window.feature) {
        window.feature.title = title;
      }
    },
    $_changeColor(color, id, type) {
      let entity = this.viewer.entities.getById(id);
      entity[type].material = Cesium.Color.fromCssColorString(color.hex);
    },
    $_getLayer(index, project, callBack) {
      const {map} = project.features[index];
      if (map) {
        const {vueKey, vueIndex} = map;
        if (vueKey && vueIndex) {
          let layerManager = window.vueCesium.OGCWMTSManager.findSource(vueKey, vueIndex);
          callBack(layerManager.source);
        }
      }
    },
    $_deleteFeature(index, id, project) {
      let vm = this;
      if (id) {
        this.viewer.entities.removeById(id);
      }
      this.$_getLayer(index, project, function (layer) {
        vm.viewer.imageryLayers.remove(layer);
      });
    },
    $_getCamera(currentFeature) {
      let camera = this.viewer.camera;
      currentFeature.camera.positionCartographic = {
        height: camera.positionCartographic.height,
        latitude: camera.positionCartographic.latitude,
        longitude: camera.positionCartographic.longitude
      };
      currentFeature.camera.heading = camera.heading;
      currentFeature.camera.pitch = camera.pitch;
      currentFeature.camera.roll = camera.roll;
    },
    $_changeIcon(icon, id) {
      let entity = this.viewer.entities.getById(id);
      this.$_getBillBoardIcon(icon, function (img) {
        entity.billboard.image = img;
      });
    },
    $_showFeature(id, flag, index, project) {
      if (id) {
        let entity = this.viewer.entities.getById(id);
        entity.show = flag;
      }
      this.$_getLayer(index, project, function (layer) {
        layer.show = flag;
      });
    },
    $_addFeature(feature) {
      let vm = this;
      this.currentFeatureType = feature.type;
      switch (feature.type) {
        case "point":
          this.$_addPoint(function (position, cartesian3Position) {
            if (!vm.$refs.projectPanel.showEditPanel) {
              feature.feature.baseUrl.geometry = cartesian3Position;
              feature.feature.camera.longLatPosition = [position.lng, position.lat, position.alt];
              feature.feature.camera.cartesian3Position = cartesian3Position;
              window.feature = feature.feature;
              vm.$_setCamera();
              vm.$refs.projectPanel.showEditPanel = true;
            }
          });
          break;
        case "polyline":
          window.feature = feature.feature;
          vm.$_setCamera();
          this.drawer && this.drawer.enableDrawLine(true);
          break;
        case "rectangle":
          window.feature = feature.feature;
          vm.$_setCamera();
          this.drawer && this.drawer.enableDrawRectangle(true);
          break;
        case "polygon":
          window.feature = feature.feature;
          vm.$_setCamera();
          this.drawer && this.drawer.enableDrawPolygon(true);
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