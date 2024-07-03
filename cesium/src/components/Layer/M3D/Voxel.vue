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
  computed: {
    timeScale() {
      switch (this.unit) {
        case "years": {
          return 31536000000;
        }
        case "months": {
          return 259200000;
        }
        case "weeks": {
          return 604800000;
        }
        case "days": {
          return 86400000;
        }
        case "hours": {
          return 3600000;
        }
        case "minutes": {
          return 60000;
        }
        case "seconds": {
          return 1000;
        }
        default: {
          return 1;
        }
      }
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
      this.voxel = new Cesium.VoxelPrimitive(requestUrl, {
        heightScale: 100,
        loaded: res => {
          const {
            variables: {
              time: { units }
            }
          } = res;
          const unitsArr = units.split(" since ");
          this.baseDate = new Date(unitsArr[1]).getTime(); // 获取基准时间
          this.unit = unitsArr[0]; // 获取时间单位
          this.$emit("loaded", { metaData: res, voxel: this.voxel });
          this.initQuery();
        }
      });
      viewer.scene.primitives.add(this.voxel);
    },
    unmount() {
      const { viewer } = this;
      viewer.scene.primitives.remove(this.voxel);
      this.stopQuery();
      this.$emit("unloaded");
    },
    formatter(time) {
      const date = new Date(time);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const hour = date.getHours();
      const min = date.getMinutes();
      const second = date.getSeconds();
      switch (this.unit) {
        case "years": {
          return `${year}`;
        }
        case "month": {
          return `${year}-${month < 10 ? `0${month}` : month}`;
        }
        case "weeks":
        case "days": {
          return `${year}-${month < 10 ? `0${month}` : month}-${
            day < 10 ? `0${day}` : day
          }`;
        }
        case "hours": {
          return `${year}-${month < 10 ? `0${month}` : month}-${
            day < 10 ? `0${day}` : day
          }  ${hour < 10 ? `0${hour}` : hour}`;
        }
        case "minutes": {
          return `${year}-${month < 10 ? `0${month}` : month}-${
            day < 10 ? `0${day}` : day
          }  ${hour < 10 ? `0${hour}` : hour}:${min < 10 ? `0${min}` : min}`;
        }
        case "seconds": {
          return `${year}-${month < 10 ? `0${month}` : month}-${
            day < 10 ? `0${day}` : day
          }  ${hour < 10 ? `0${hour}` : hour}:${min < 10 ? `0${min}` : min}:${
            second < 10 ? `0${second}` : second
          }`;
        }
        default: {
          break;
        }
      }
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
            featureproperties.time * this.timeScale + this.baseDate
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
