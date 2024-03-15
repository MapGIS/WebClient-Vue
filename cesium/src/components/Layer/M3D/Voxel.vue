<template>
  <span>
    <mapgis-3d-feature-popup
      v-if="featureposition"
      :position="featureposition"
      :popupOptions="popupOptions"
    >
      <component
        :is="popupComponent"
        :properties="featureproperties"
        v-bind="popupConfig"
      />
    </mapgis-3d-feature-popup>
  </span>
</template>

<script>
import Tileset3dOptions from "./3DTilesetOptions";
import PopupMixin from "../Mixin/PopupMixin";

export default {
  name: "mapgis-3d-voxel-layer",
  inject: ["Cesium", "vueCesium", "viewer"],
  mixins: [PopupMixin],
  props: {
    ...Tileset3dOptions,
    popupOptions: {
      type: Object,
      default: () => {
        return { popupType: "card" };
      }
    }
  },
  data() {
    return {
      baseDate: new Date("0001-01-01T00:00:00Z").getTime(),
      featureposition: undefined,
      featureproperties: undefined,
      test: 0
    };
  },
  watch: {
    show() {
      this.changeShow();
    }
  },
  mounted() {
    this.mount();
  },
  destroyed() {
    this.unmount();
  },
  methods: {
    mount() {
      const { viewer, Cesium } = this;
      const { url } = this;
      const requestUrl = `${url}/nodes/0?f=json`;
      // 创建栅格体元图元
      this.voxel = new Cesium.VolumePixelPrimitive(requestUrl, {
        axisScale: new Cesium.Cartesian3(100, 100, 500),
        position: Cesium.Cartesian3.fromDegrees(114.4016, 30.467, 10),
        loaded: res => {
          viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(114.4016, 30.2, 20000),
            orientation: {
              pitch: Cesium.Math.toRadians(-30)
            },
            duration: 1
          });
          this.$emit("loaded", { metaData: res, voxel: this.voxel });
          this.initQuery();
        }
      });
      viewer.scene.primitives.add(this.voxel);
    },
    unmount() {
      const { viewer, Cesium } = this;
      viewer.scene.primitives.remove(this.voxel);
      this.stopQuery();
      this.$emit("unloaded");
    },
    formatter(value) {
      const date = new Date(value);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${year}-${month < 10 ? `0${month}` : month}-${
        day < 10 ? `0${day}` : day
      }`;
    },
    initQuery() {
      const { viewer, Cesium } = this;
      this.handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
      this.handler.setInputAction(movement => {
        const featureproperties = this.voxel.queryPropertyValue(
          movement.position
        );
        if (featureproperties) {
          this.featureposition = {
            cartesian: viewer.scene.pickPosition(movement.position)
          };
          featureproperties.time = this.formatter(
            featureproperties.time * 3600000 + this.baseDate
          );
          this.featureproperties = featureproperties;
        } else {
          this.featureposition = undefined;
          this.featureproperties = undefined;
        }
        this.featureposition = featureproperties
          ? {
              cartesian: viewer.scene.pickPosition(movement.position)
            }
          : undefined;
        this.featureproperties = featureproperties;
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },
    stopQuery() {
      this.featureposition = undefined;
      this.handler &&
        this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },
    changeShow() {
      this.voxel.show = this.show;
      if (this.show) {
        this.initQuery();
      } else {
        this.stopQuery();
      }
    }
  }
};
</script>
