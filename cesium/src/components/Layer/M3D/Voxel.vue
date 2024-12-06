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
    },
  },
  mounted() {
    this.mount();
  },
  destroyed() {
    this.unmount();
  },
  methods: {
    mount() {
      this.initQuery();
    },
    unmount() {
      this.stopQuery();
    },
    formatter(time, unit) {
      const date = new Date(time);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const hour = date.getHours();
      const min = date.getMinutes();
      const second = date.getSeconds();
      switch (unit) {
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
    /**
     *  绑定属性查询
     */
    initQuery() {
      const { viewer, Cesium } = this;
      this.handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
      this.handler.setInputAction((movement) => {
        const voxelCell = viewer.scene.pickVoxel(movement.position);
        if (voxelCell instanceof Cesium.VoxelCell) {
          const featureproperties = voxelCell.metadata;
          if (featureproperties) {
            this.featureposition = {
              cartesian: viewer.scene.pickPosition(movement.position),
            };
            featureproperties.time = this.formatter(
              featureproperties.time,
              "hours"
            );
            this.featureproperties = featureproperties;
          }
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },
    stopQuery() {
      this.featureposition = undefined;
      this.handler &&
        this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },
    changeShow() {
      if (this.show) {
        this.initQuery();
      } else {
        this.stopQuery();
      }
    },
  },
};
</script>
