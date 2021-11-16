<template>
  <div>
    <mapgis-3d-popup v-model="show" :position="position" :forceRender="true">
      <mapgis-3d-story-popup :feature="feature"> </mapgis-3d-story-popup>
    </mapgis-3d-popup>
  </div>
</template>

<script>
import VueOptions from "../../Base/Vue/VueOptions";
import Mapgis3dStoryPopup from "../../Layer/MapStory/ui/storyPanelLarge.vue";

export default {
  name: "mapgis-3d-m3d-menu-props",
  inject: ["Cesium", "vueCesium", "viewer", "m3ds"],
  components: {
    Mapgis3dStoryPopup
  },
  props: {
    ...VueOptions,
    version: {
      type: String
    },
    layerIndex: {
      type: Number
    },
    gdbp: {
      type: String
    },
    ip: {
      type: String
    },
    port: {
      type: String
    }
  },
  data() {
    return {
      feature: { geometry: {}, properties: {} },
      currentMenu: undefined,
      position: {
        longitude: 0,
        latitude: 0,
        height: 0
      },
      oid: undefined,
      properties: {},
      show: false
    };
  },
  created() {},
  mounted() {
    this.mount();
  },
  destroyed() {
    this.unmount();
  },
  methods: {
    createCesiumObject() {
      return new Promise(
        resolve => {
          resolve();
        },
        reject => {}
      );
    },
    mount() {
      const vm = this;
      const { Cesium, vueIndex, vueKey, vueCesium } = this;
      const { viewer } = this;

      let highlight = this.createCesiumObject();
      highlight.then(res => {
        vueCesium.G3DManager.addSource(vueKey, vueIndex, this, {
          version_0_0: {
            current: {
              feature: undefined,
              originalColor: new Cesium.Color()
            },
            currentLayer: undefined,
            analysisManager: new window.CesiumZondy.Manager.AnalysisManager({
              viewer: viewer
            })
          },
          version_2_0: {}
        });

        let findViewers = vueCesium.ViewerManager.findAllSource(vueKey);
        if (findViewers && findViewers.length > 0) {
          let handler = findViewers[0].options.ScreenSpaceEventHandler;
          if (!handler) {
            handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
          } else {
            handler.removeInputAction(
              vm.$_highlightAction,
              Cesium.ScreenSpaceEventType.LEFT_CLICK
            );
          }
          handler.setInputAction(
            vm.$_highlightAction,
            Cesium.ScreenSpaceEventType.LEFT_CLICK
          );
        }
      });

      if (viewer.isDestroyed()) return;
    },
    unmount() {
      const { vueCesium, vueKey, vueIndex } = this;
      let find = vueCesium.G3DManager.findSource(vueKey, vueIndex);
      if (find && find.options) {
      }
      this.$emit("unload", { component: this });
      vueCesium.G3DManager.deleteSource(vueKey, vueIndex);
    },
    $_highlightAction(movement) {
      const vm = this;
      const { vueKey, vueIndex, vueCesium, Cesium } = this;
      const { layerIndex, viewer, m3ds, version, gdbp } = this;
      let tileset;
      if (m3ds) {
        tileset = m3ds[layerIndex];
      } else {
        tileset = viewer.scene.layers.getM3DLayer(layerIndex);
      }
      if (!tileset) {
        return;
      }

      if (version == "0.0" || version == "1.0") {
        let find = vueCesium.G3DManager.findSource(vueKey, vueIndex);
        if (find && find.options && find.options.version_0_0) {
          let {
            current,
            currentLayer,
            analysisManager
          } = find.options.version_0_0;
          //根据鼠标点击位置选择对象
          let pickedFeature = viewer.scene.pick(movement.position);

          //判断current对象中要素有值，该值和鼠标点击位置不相同
          if (
            Cesium.defined(current.feature) &&
            current.feature !== pickedFeature
          ) {
            currentLayer = [current.feature.tileset];
            let title = current.feature.getProperty("name");
            let values = title.split("_");
            let vlueNumber = parseInt(values[2]);
            let idList = [vlueNumber];
            analysisManager.stopCustomDisplay(currentLayer);
            current.feature = undefined;
          }

          //判断点击位置是否有值，该值和鼠标点击位置不相同
          if (
            Cesium.defined(pickedFeature) &&
            current.feature !== pickedFeature
          ) {
            current.feature = pickedFeature;
            currentLayer = [current.feature.tileset];
            let title = current.feature.getProperty("name");
            let values = title.split("_");
            let vlueNumber = parseInt(values[2]);
            let idList = [vlueNumber];
            let options = {
              color: new Cesium.Color(255 / 255, 255 / 255, 0 / 255, 1),
              colorBlendMode: Cesium.Cesium3DTileColorBlendMode.REPLACE
            };
            analysisManager.stopCustomDisplay(currentLayer);
            analysisManager.startCustomDisplay(currentLayer, idList, options);

            let ellipsoid = viewer.scene.globe.ellipsoid;
            let center = current.feature.tileset.boundingSphere.center;
            let cartographic = ellipsoid.cartesianToCartographic(center);
            let lat = Cesium.Math.toDegrees(cartographic.latitude);
            let lng = Cesium.Math.toDegrees(cartographic.longitude);
            let height = cartographic.height;

            vm.position.longitude = lng;
            vm.position.latitude = lat;
            vm.position.height = height;
            vm.oid = vlueNumber;
            vm.$_query(vlueNumber, gdbp);
          } else if (
            Cesium.defined(pickedFeature) &&
            current.feature == pickedFeature
          ) {
          } else {
            vm.show = false;
          }
        }
      } else if (version == "2.0") {
        let oid = viewer.scene.pickOid(movement.position);
        tileset.pickedOid = oid;
        tileset.pickedColor = new Cesium.Color(1.0, 1.0, 0.0, 0.6);
      }
    },
    $_query(oid, gdbp) {
      if (!oid) return;
      const vm = this;
      const { vueCesium, ip, port } = this;
      var queryParam = new window.CesiumZondy.Query.G3DDocQuery();
      queryParam.gdbp = encodeURI(gdbp);
      queryParam.structs =
        '{"IncludeAttribute":true,"IncludeGeometry":true,"IncludeWebGraphic":false}';
      queryParam.objectIds = oid;
      queryParam.serverIp = ip;
      queryParam.serverPort = port;
      queryParam.queryG3DFeature(
        result => {
          if (result != null) {
            let keys = result.AttStruct.FldName;
            let values = result.SFEleArray[0].AttValue;
            let properties = {};
            keys.forEach((k, i) => {
              properties[k] = values[i];
            });
            vm.properties = properties;
            vm.feature = {
              geometry: vm.feature.geometry,
              properties: properties
            };
            vm.show = true;
          }
        },
        e => {
          alert("error");
        },
        "post"
      );
    }
  }
};
</script>
