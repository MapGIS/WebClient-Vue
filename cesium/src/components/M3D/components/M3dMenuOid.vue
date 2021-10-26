<template>
  <span> </span>
</template>

<script>
export default {
  name: "mapgis-3d-m3d-menu-oid",
  inject: ["Cesium", "CesiumZondy", "vueCesium", "viewer", "m3ds"],
  props: {
    version: {
      type: String
    },
    layerIndex: {
      type: Number
    }
  },
  data() {
    return {
      currentMenu: undefined
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
            analysisManager: new CesiumZondy.Manager.AnalysisManager({
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
      this.$emit("unload", { component: this });
    },
    $_highlightAction(movement) {
      const { vueKey, vueIndex, vueCesium, Cesium } = this;
      const { layerIndex, viewer, m3ds, version } = this;
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
            var title = current.feature.getProperty("name");
            var values = title.split("_");
            var vlueNumber = parseInt(values[2]);
            var idList = [vlueNumber];
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
            var title = current.feature.getProperty("name");
            var values = title.split("_");
            var vlueNumber = parseInt(values[2]);
            var idList = [vlueNumber];
            var options = {
              color: new Cesium.Color(255 / 255, 255 / 255, 0 / 255, 1),
              colorBlendMode: Cesium.Cesium3DTileColorBlendMode.REPLACE
            };
            analysisManager.stopCustomDisplay(currentLayer);
            analysisManager.startCustomDisplay(currentLayer, idList, options);
          }
        }
      } else if (version == "2.0") {
        var oid = viewer.scene.pickOid(movement.position);
        tileset.pickedOid = oid;
        tileset.pickedColor = new Cesium.Color(1.0, 1.0, 0.0, 0.6);
      }
    }
  }
};
</script>
