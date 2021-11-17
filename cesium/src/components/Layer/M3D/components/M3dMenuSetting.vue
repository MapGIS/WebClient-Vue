<template>
  <div class="mapgis-3d-m3d-menu-setting">
    <mapgis-3d-scene-setting layout="vertical"> </mapgis-3d-scene-setting>
  </div>
</template>

<script>
import VueOptions from "../../../Base/Vue/VueOptions";
import Mapgis3dSeneSetting from "../../../SceneEffect/SceneSetting";

export default {
  name: "mapgis-3d-m3d-menu-setting",
  inject: ["Cesium", "vueCesium", "viewer", "m3ds"],
  components: { Mapgis3dSeneSetting },
  props: {
    ...VueOptions,
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
      } else if (version == "2.0") {
      }
    }
  }
};
</script>

<style>
.mapgis-3d-m3d-menu-setting > .mapgis-3d-scene-setting {
  display: block;
  position: relative;
  height: 100%;
}
</style>
