<template>
  <span>
    <mapgis-ui-statistic title="提示" value="请点击场景模型！" />
  </span>
</template>

<script>
import VueOptions from "../../../Base/Vue/VueOptions";

export default {
  name: "mapgis-3d-m3d-menu-highlight",
  inject: ["Cesium", "vueCesium", "viewer", "m3ds"],
  props: {
    ...VueOptions,
    version: {
      type: String,
    },
    layerIndex: {
      type: Number,
    },
  },
  data() {
    return {
      currentMenu: undefined,
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
        (resolve) => {
          resolve();
        },
        (reject) => {}
      );
    },
    mount() {
      const vm = this;
      const { Cesium, vueIndex, vueKey, vueCesium } = this;
      const { viewer } = this;

      let highlight = this.createCesiumObject();
      highlight.then((res) => {
        vueCesium.G3DManager.addSource(vueKey, vueIndex, this, {
          version_0_0: {
            current: {
              feature: undefined,
              originalColor: new Cesium.Color(),
            },
            currentLayer: undefined,
            analysisManager: new window.CesiumZondy.Manager.AnalysisManager({
              viewer: viewer,
            }),
          },
          version_2_0: {},
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

      //根据鼠标点击位置选择对象
      let pickedFeature = viewer.scene.pick(movement.position);

      if (version == "0.0" || version == "1.0") {
        let find = vueCesium.G3DManager.findSource(vueKey, vueIndex);
        if (find && find.options && find.options.version_0_0) {
          let { current, currentLayer, analysisManager } =
            find.options.version_0_0;

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
              colorBlendMode: Cesium.Cesium3DTileColorBlendMode.REPLACE,
            };
            analysisManager.stopCustomDisplay(currentLayer);
            analysisManager.startCustomDisplay(currentLayer, idList, options);
          }
        }
      } else {
        if (pickedFeature) {
          // 修改说明：M3D2.1已弃用viewer.scene.pickOid方法，后面统一从feature上获取要素id，高亮统一使用Cesium3DTileStyle设置
          // 修改人:龚跃健
          // 修改日期：2024-11-22
          const { tilesetVersion } = tileset.version;
          let id;
          let conditions;
          if (tilesetVersion === "2.1") {
            id = pickedFeature.getProperty("tid");
            conditions = [["${tid} === ${id}", "rgba(255, 255, 0, 0.6)"]];
          } else {
            id = pickedFeature.getProperty("OID");
            conditions = [["${OID} === ${id}", "rgba(255, 255, 0, 0.6)"]];
          }
          tileset.style = new Cesium.Cesium3DTileStyle({
            defines: {
              id,
            },
            color: {
              conditions,
            },
          });
        }
      }
    },
  },
};
</script>
