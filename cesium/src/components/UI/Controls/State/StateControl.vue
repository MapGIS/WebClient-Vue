<template>
  <div class="mapgis-web-scene-statebar">
    <span>
      经度:{{ longitude }}°，纬度:{{ latitude }}°， 海拔高度:{{
        height
      }}米，相机视角高度:{{ cameraHeight }}米
    </span>
    <span v-if="showHpr"></span>
    <span v-if="showSelectTileInfo"></span>
    <span v-if="showViewLevelInfo"></span>
  </div>
</template>

<script>
import VueOptions from "../../../Base/Vue/VueOptions";

export default {
  name: "mapgis-3d-statebar",
  mixins: [],
  inject: ["Cesium", "webGlobe"],
  props: {
    ...VueOptions,
    showHpr: {
      type: Boolean,
      default: false
    },
    showSelectTileInfo: {
      type: Boolean,
      default: false
    },
    showViewLevelInfo: {
      type: Boolean,
      default: false
    }
  },

  computed: {},

  data() {
    return {
      initial: true,
      control: undefined,
      viewLevel: 0,
      longitude: 0,
      latitude: 0,
      cameraHeight: 0,
      height: 0,
      selectedTile: undefined
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
    mount() {
      this.showPosition();
    },
    unmount() {
      const { webGlobe, vueKey, vueIndex } = this;
      let find = window.CesiumZondy.EventHandlerManager.findSource(
        vueKey,
        vueIndex
      );
      if (find) {
        find.source.destroy && find.source.destroy();
      }
      window.CesiumZondy.EventHandlerManager.deleteSource(vueKey, vueIndex);
    },
    showPosition() {
      const vm = this;
      let { Cesium, webGlobe, vueIndex, vueKey } = this;

      const { viewer } = webGlobe;

      if (vueKey && vueIndex) {
        let screenSpaceMouseEventHandler = new Cesium.ScreenSpaceEventHandler(
          viewer.scene.canvas
        );

        screenSpaceMouseEventHandler.setInputAction(movement => {
          // vm.updateViewLevel();
          // vm.selectTile(movement.endPosition);
          // vm.selectedTile = vm.selectTile(movement.endPosition);
          vm.updateShowInfo(movement.endPosition);
          lastScreenPos = movement.endPosition;
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        screenSpaceMouseEventHandler.setInputAction(() => {
          // vm.updateViewLevel();
          // vm.selectTile(lastScreenPos);
          // vm.selectedTile = vm.selectTile(lastScreenPos);
          vm.updateShowInfo(lastScreenPos);
        }, Cesium.ScreenSpaceEventType.WHEEL);
        window.CesiumZondy.EventHandlerManager.addSource(
          vueKey,
          vueIndex,
          screenSpaceMouseEventHandler
        );
      }

      let lastScreenPos;

      viewer.scene.globe.tileLoadProgressEvent.addEventListener(() => {
        vm.updateViewLevel();
      });
      viewer.camera.changed.addEventListener(() => {
        vm.updateViewLevel();
      });
    },
    selectTile(e) {
      let { Cesium, webGlobe } = this;
      let selectedTileTmp;
      const { viewer } = webGlobe;
      const ellipsoid = viewer.scene.globe.ellipsoid;

      let cartesian = viewer.scene.camera.pickEllipsoid(e, ellipsoid);
      if (Cesium.defined(cartesian)) {
        const cartographic = ellipsoid.cartesianToCartographic(cartesian);
        const tilesRendered =
          viewer.scene.globe._surface.tileProvider._tilesToRenderByTextureCount;
        for (
          let textureCount = 0;
          !selectedTileTmp && textureCount < tilesRendered.length;
          textureCount += 1
        ) {
          const tilesRenderedByTextureCount = tilesRendered[textureCount];
          if (Cesium.defined(tilesRenderedByTextureCount)) {
            for (
              let tileIndex = 0;
              !selectedTileTmp &&
              tileIndex < tilesRenderedByTextureCount.length;
              tileIndex += 1
            ) {
              const tile = tilesRenderedByTextureCount[tileIndex];
              if (Cesium.Rectangle.contains(tile.rectangle, cartographic)) {
                selectedTileTmp = tile;
              }
            }
          }
        }
      }
      return selectedTileTmp;
    },
    updateViewLevel() {
      let { Cesium, webGlobe } = this;
      const { viewer } = webGlobe;
      const tilesToRender =
        viewer.scene.globe._surface.tileProvider._tilesToRenderByTextureCount;
      for (let i = 0; i < tilesToRender.length; i += 1) {
        if (tilesToRender[i]) {
          for (
            let tileIndex = 0;
            tileIndex < tilesToRender[i].length;
            tileIndex += 1
          ) {
            if (
              Cesium.Rectangle.contains(
                tilesToRender[i][tileIndex].rectangle,
                viewer.camera.positionCartographic
              )
            ) {
              this.viewLevel = tilesToRender[i][tileIndex]._level;
            }
          }
        }
      }
    },
    updateShowInfo(screenPos) {
      let {
        viewLevel,
        height,
        Cesium,
        webGlobe,
        showHpr,
        showSelectTileInfo,
        showViewLevelInfo
      } = this;

      let vm = this;

      const { viewer } = webGlobe;
      let cartesian = viewer.getCartesian3Position(screenPos, cartesian);
      const ellipsoid = viewer.scene.globe.ellipsoid;
      const { camera } = viewer;
      let longlatHeight = "";
      if (cartesian) {
        const cartographic = ellipsoid.cartesianToCartographic(cartesian);
        this.longitude = Cesium.Math.toDegrees(cartographic.longitude).toFixed(
          4
        );
        this.latitude = Cesium.Math.toDegrees(cartographic.latitude).toFixed(4);
        this.cameraHeight = Math.ceil(
          camera.positionCartographic.height
        ).toFixed(0);
        this.height = Math.max(
          viewer.scene.globe.getHeight(cartographic),
          cartographic.height
        ).toFixed(0);
      }
      /* let strHpr = "";
      if (showHpr) {
        strHpr = ` heading：${Cesium.Math.toDegrees(camera.heading).toFixed(
          1
        )} pitch：${Cesium.Math.toDegrees(camera.pitch).toFixed(
          1
        )} roll：${Cesium.Math.toDegrees(camera.roll).toFixed(1)}`;
      }
      let selectTileInfo = "";
      if (showSelectTileInfo && selectedTile) {
        selectTileInfo = `，瓦片X:${selectedTile.x}，瓦片Y:${selectedTile.y}，瓦片级别:${selectedTile.level}，`;
      }
      if (height === undefined || height < -7000) {
        height = 0;
      }
      let level = "";
      if (showViewLevelInfo) {
        level = `当前地图级别:${viewLevel}`;
      }
      const iHtml = longlatHeight + strHpr + selectTileInfo + level;
      document.getElementById(elementId).innerHTML = iHtml; */
    }
  }
};
</script>

<style>
.mapgis-web-scene-statebar {
  position: absolute;
  height: fit-content;
  bottom: 0px;
  z-index: 9999;
  color: #f0efef;
  line-height: 30px;
  margin-left: 30%;
  font-size: 80%;
}
</style>
