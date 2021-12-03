<template>
  <div>
    <project-panel ref="projectPanel"
                   @deleteFeature="$_deleteFeature"
                   @deleteProject="$_deleteProject"
                   @getCamera="$_getCamera"
                   @changeColor="$_changeColor"
                   @changeIcon="$_changeIcon"
                   @showFeature="$_showFeature"
                   @showProject="$_showProject"
                   @addMapToProject="$_addMapToProject"
                   @addFeature="$_addFeature"
                   @titleChanged="$_titleChanged"
                   @featureTitleChanged="$_featureTitleChanged"
                   @closeHoverPanel="$_closeHoverPanel"
                   @editProject="$_editProject"
                   @projectPreview="$_projectPreview"
                   @firstAddPicture="$_firstAddPicture"
                   :dataSource="dataSourceCopy"
                   :upProjectSet="projectSet"
                   :height="height"
                   :width="width"
                   :enablePreview="enablePreview"
                   :enableClose="enableClose"
    />
    <mapgis-3d-draw :infinite="false" @drawcreate="$_drawCreate" @load="$_drawerLoaded"/>
    <map-collection :key="index" v-for="(opt,index) in optArr" :options="opt"/>
    <map-collection :key="opt.vueIndex" v-for="(opt) in projectMaps" :options="opt"/>
    <template v-for="(popup) in popups">
      <mapgis-3d-popup
          :key="popup.vueIndex"
          :position='{"longitude":popup.lng,"latitude":popup.lat,"height":popup.alt}'
          :forceRender="true"
          v-model="popup.show"
          :vueIndex="popup.vueIndex"
      >
        <div class="mapgis-3d-map-story-small-popup-container">
          <slot name="content" :popup="popup">
            <div class="mapgis-3d-map-story-small-popup-title">
              {{ popup.title }}
              <mapgis-ui-base64-icon @click="$_toLarge(popup.feature)" class="mapgis-3d-map-story-small-popup-tolarge"
                                     width="20px" type="toLarge"/>
            </div>
            <mapgis-ui-carousel class="mapgis-3d-map-story-small-popup-carousel" autoplay>
              <div class="mapgis-3d-map-story-small-popup-img-div" :key="index + 10000"
                   v-for="(image, index) in popup.images">
                <img class="mapgis-3d-map-story-small-popup-img" :src="image" alt="">
              </div>
            </mapgis-ui-carousel>
          </slot>
        </div>
      </mapgis-3d-popup>
    </template>
  </div>
</template>

<script>
import projectPanel from "./projectPanel"
import mapCollection from "./mapCollection";
import mapStoryService from "./mapStoryService"
import Base64IconsKeyValue from "./Base64IconsKeyValue"

window.showPanels = {
  currentPage: "",
  showProjectEdit: false
}
export default {
  name: "mapgis-3d-map-story-layer",
  mixins: [mapStoryService],
  components: {
    "project-panel": projectPanel,
    "map-collection": mapCollection,
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
    },
    height: {
      type: Number
    },
    width: {
      type: Number
    },
    enablePreview: {
      type: Boolean,
      default: true
    },
    enableClose: {
      type: Boolean,
      default: true
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
  mounted() {
    this.$_initManager();
  },
  methods: {
    $_toLarge(feature) {
      this.$emit("projectPreview", [feature], false);
    },
    $_drawCreate(Cartesian3Points, degreeArr, viewerDraw, radians) {
      this.currentPoints = degreeArr;
      let center;
      switch (this.currentFeatureType) {
        case "rectangle":
          let points = [[Cesium.Math.toDegrees(radians.west), Cesium.Math.toDegrees(radians.south)], [Cesium.Math.toDegrees(radians.east), Cesium.Math.toDegrees(radians.north)]];
          center = this.$_getRectangleCenter(points);
          window.feature.center = center;
          this.viewer.entities.add({
            id: window.feature.id,
            rectangle: {
              coordinates: radians,
              material: Cesium.Color.RED,
            },
          });
          break;
        case "polygon":
          center = this.$_getPolygonCenter(degreeArr);
          window.feature.center = center;
          this.viewer.entities.add({
            id: window.feature.id,
            polygon: {
              hierarchy: new Cesium.PolygonHierarchy(Cartesian3Points),
              material: Cesium.Color.RED,
              fill: true
            }
          });
          break;
        case "polyline":
          let newPoints = degreeArr.concat([degreeArr[0]]);
          center = this.$_getPolygonCenter(newPoints);
          window.feature.center = center;
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
      this.$refs.projectPanel.currentProject.features.push(window.feature);
      this.$refs.projectPanel.$refs.projectP.showEditPanel = false;
    },
    $_drawerLoaded(drawer) {
      this.drawer = drawer;
    },
    $_firstAddPicture(feature) {
      let lnglatPosition;
      if (feature.center) {
        lnglatPosition = {
          lng: feature.center[0],
          lat: feature.center[1],
          alt: feature.center[2],
        };
      }else {
        lnglatPosition = this.$_cartesian3ToLongLat(feature.baseUrl.geometry);
      }
      this.popups.push({
        lng: lnglatPosition.lng,
        lat: lnglatPosition.lat,
        alt: 20,
        title: feature.title,
        images: feature.images,
        feature: feature,
        id: feature.id,
        show: feature.show,
        vueIndex: parseInt(String(Math.random() * 10000))
      });
    },
    $_projectPreview(features, enableFullScreen) {
      this.$emit("projectPreview", features, enableFullScreen);
    },
    $_editProject(index) {
      if (this.dataSource instanceof Array) {
        this.$refs.projectPanel.showProjectPanel = false;
        if (!this.enableClose) {
          window.showPanels.showProjectEdit = true;
          window.showPanels.currentPage = "projectEdit";
        }
        this.$refs.projectPanel.currentProject = this.projectSet[this.dataSource[index].uuid];
      }
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
                image: img,
                disableDepthTestDistance: Number.POSITIVE_INFINITY
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
      this.$refs.projectPanel.$refs.projectP.$_addFeatureSet(window.feature);
      this.$refs.projectPanel.$refs.projectP.showEditPanel = false;
    },
    $_titleChanged(title) {
      if (window.feature) {
        window.feature.title = title;
      }
    },
    $_featureTitleChanged(feature) {
      for (let i = 0; i < this.popups.length; i++) {
        if (this.popups[i].id === feature.id) {
          this.$set(this.popups[i], "title", feature.title);
          break;
        }
      }
    },
    $_changeColor(color, type, id, geometryType) {
      let entity = this.viewer.entities.getById(id);
      switch (geometryType) {
        case "polygon":
          if (entity.polygon) {
            entity[geometryType].material = new Cesium.Color.fromCssColorString(color.hex);
          } else if (entity.rectangle) {
            entity.rectangle.material = new Cesium.Color.fromCssColorString(color.hex);
          }
          break;
        case "polyline":
          entity[geometryType].material = new Cesium.Color.fromCssColorString(color.hex);
          break;
      }
    },
    $_getLayer(index, project, callBack, feature) {
      let map;
      if (feature) {
        map = feature.map;
      } else {
        map = project.features[index].map;
      }

      if (map) {
        const {vueKey, vueIndex} = map;
        if (vueKey && vueIndex) {
          let layerManager = window.vueCesium.OGCWMTSManager.findSource(vueKey, vueIndex);
          callBack(layerManager.source);
        }
      }
    },
    $_deleteProject() {
      this.popups = [];
    },
    $_deleteFeature(index, id, project, feature) {
      let vm = this;
      if (id) {
        this.viewer.entities.removeById(id);
      }
      this.$_getLayer(index, project, function (layer) {
        vm.viewer.imageryLayers.remove(layer);
      }, feature);
      for (let i = 0; i < this.popups.length; i++) {
        if (this.popups[i].id === feature.id) {
          this.popups.splice(i, 1);
          break;
        }
      }
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
    $_addEntity(feature, layerStyle, id) {
      let vm = this;
      switch (feature.type) {
        case "point":
          const {geometry} = feature;
          if (!geometry) {
            return;
          }
          const {x, y, z} = feature.geometry;
          if (x && y && z) {
            let img = document.createElement("img");
            let imgUrl = layerStyle.billboard.image;
            if (typeof imgUrl === 'number') {
              imgUrl = Base64IconsKeyValue[imgUrl].value;
            }
            img.src = imgUrl;
            img.onload = function () {
              vm.viewer.entities.add({
                id: id,
                position: new Cesium.Cartesian3(x, y, z),
                billboard: {
                  image: img,
                  disableDepthTestDistance: Number.POSITIVE_INFINITY
                }
              });
            }
          }
          break;
      }
    },
    $_showProject(project) {
      const {show, uuid} = project;
      if (show) {
        let newProject = this.projectSet[uuid];
        const {features, map} = newProject;
        for (let i = 0; i < features.length; i++) {
          let entity = this.viewer.entities.getById(features[i].id);
          const {layerStyle, baseUrl} = features[i];
          if (entity) {
            if (show) {
              if (layerStyle.hasOwnProperty("show") && layerStyle.show !== false) {
                entity.show = show;
                this.$_getLayer(i, newProject, function (layer) {
                  layer.show = show;
                });
              }
            } else {
              entity.show = show;
              this.$_getLayer(i, newProject, function (layer) {
                layer.show = show;
              });
            }
          } else {
            const {map} = features[i];
            this.$_addEntity(baseUrl, features[i].layerStyle, features[i].id);
            if (map) {
              this.optArr.push(map);
            }
          }
        }
        if (map) {
          const {vueKey, vueIndex, type} = map;
          if (vueKey && vueIndex && type) {
            let layer;
            switch (type) {
              case "WMTS":
                layer = window.vueCesium.OGCWMTSManager.findSource(vueKey, vueIndex);
                break;
            }
            if (!layer) {
              this.projectMaps.push(map);
            }
          }
        }
      } else {

      }
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
    $_addMapToProject(type, map) {
      map.vueKey = this.vueKey;
      map.vueIndex = new Date().getTime();
      let index, addMap = true;
      for (let i = 0; i < this.projectMaps.length; i++) {
        if (this.projectMaps[i].vueKey === map.vueKey && this.projectMaps[i].vueIndex === map.vueIndex) {
          index = i;
          addMap = false;
          break;
        }
      }
      if (addMap) {
        this.projectMaps.push(map);
      } else {
        this.$emit(this.projectMaps, index, map);
      }
    },
    $_addFeature(feature) {
      let vm = this;
      this.currentFeatureType = feature.type;
      switch (feature.type) {
        case "point":
          this.$_addPoint(function (position, cartesian3Position) {
            if (!vm.$refs.projectPanel.$refs.projectP.showEditPanel) {
              feature.feature.baseUrl.geometry = cartesian3Position;
              feature.feature.camera.longLatPosition = [position.lng, position.lat, position.alt];
              window.feature = feature.feature;
              vm.$_setCamera();
              vm.$refs.projectPanel.$refs.projectP.showEditPanel = true;
              vm.$_getBillBoardIcon(0, function (img) {
                vm.viewer.entities.add({
                  id: window.feature.id,
                  position: feature.feature.baseUrl.geometry,
                  billboard: {
                    image: img,
                    disableDepthTestDistance: Number.POSITIVE_INFINITY
                  }
                });
                vm.$refs.projectPanel.currentProject.features.push(window.feature);
                vm.$refs.projectPanel.$refs.projectP.showEditPanel = false;
              });
              window.feature.drawType = "point";
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
  }
}
</script>

<style scoped>
.mapgis-3d-map-story-small-popup-title {
  width: 100%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
  margin-bottom: 10px;
  padding-top: 10px;
  padding-left: 10px;
  padding-right: 40px;
  font-size: 14px;
  position: relative;
}

.mapgis-3d-map-story-small-popup-tolarge {
  position: absolute !important;
  top: 9px;
  right: 28px;
}

.mapgis-3d-map-story-small-popup-container {
  width: 260px;
  height: 200px;
}

.mapgis-3d-map-story-small-popup-carousel {
  width: 240px;
  height: 144px;
  margin: 0 10px;
}

.mapgis-3d-map-story-small-popup-img-div {
  width: 240px;
  height: 144px;
}

.mapgis-3d-map-story-small-popup-img {
  width: 240px;
  height: 144px;
}
</style>