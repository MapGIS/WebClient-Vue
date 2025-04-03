<template>
  <div class="mapgis-marker-3d">
    <mapgis-3d-feature-popup
      :vue-key="vueKey"
      :position="popupPosition"
      :properties="filterProperties"
      :visible="showPopup"
      :popupOptions="{ popupType: 'card' }"
      :componentWidth="popupWidth"
      @change="changeVisible"
    >
      <div slot="default" style="padding: 10px">
        <mapgis-3d-popup-iot :properties="filterProperties" />
      </div>
    </mapgis-3d-feature-popup>
  </div>
</template>

<script>
import MarkerManager from "./manager/MarkerManager";

export default {
  name: "mapgis-3d-marker-pro",
  inject: ["Cesium", "vueCesium", "viewer"],
  props: {
    vueKey: String,
    marker: {
      type: Object,
      required: true,
    },
    fieldConfigs: {
      type: Array,
      required: false,
      default: () => [],
    },
    // 当前显示弹出框的标注id
    currentMarkerId: {
      type: String,
      required: false,
    },
    popupShowType: {
      type: String,
      default: "default",
    },
    popupToggleType: {
      type: String,
      default: "mouseenter",
    },
    // 以图标左上角为原点，增量方式与mapboxgl弹框的offset保持一致，x往右递增，y往下递增
    popupAnchor: {
      type: Object,
      default: () => {
        return { x: 0.5, y: 0 };
      },
    },
    popupWidth: {
      type: Number,
      default: 280,
    },
  },
  data() {
    return {
      showPopup: false,
      entityNames: [],
      popupPosition: {},
    };
  },
  computed: {
    img() {
      return this.marker.img;
    },
    // 根据filedConfigs做一个过滤，去除不可见的
    propertyKeys() {
      const keys = Object.keys(this.marker.properties);
      return keys.filter((key) => {
        const config = this.fieldConfigs.find((config) => config.name === key);

        if (
          config &&
          Object.hasOwnProperty.call(config, "visible") &&
          !config.visible
        ) {
          return false;
        }

        return true;
      });
    },
    filterProperties() {
      if (this.marker && this.marker.properties) {
        const obj = {};
        for (const key in this.marker.properties) {
          if (key !== "specialLayerBound" && key !== "specialLayerId") {
            obj[key] = this.marker.properties[key];
          }
        }
        return obj;
      }
      return {};
    },
  },
  watch: {
    // 更换图片，更换地图上的标注
    img: {
      deep: true,
      handler(val) {
        this.updateMarkerImage(val);
      },
    },
    currentMarkerId: {
      deep: true,
      immediate: true,
      handler() {
        // 当前显示弹出框的标注与组件内的id不一致时，隐藏弹出框
        if (this.currentMarkerId !== this.marker.markerId) {
          if (this.popupShowType === "default") {
            this.showPopup = false;
          } else {
            this.$emit("show-marker-detail", null);
          }
        }
      },
    },
  },
  mounted() {
    const { Cesium, viewer } = this;
    this.markerManager = MarkerManager.getInstance(Cesium, viewer);
    this.updateMarker();
  },
  beforeDestroy() {},
  methods: {
    changePopup(val, popupId) {
      this.showPopup = val;
      if (!val) {
        this.$emit("change", "");
      }
      if (val && popupId) {
        this.changeStyle(popupId);
      }
    },
    changeStyle(popupId) {
      const popupDiv = document.getElementById(popupId);
      // 三维标注弹框默认显示在图标的正中间
      const popupTipContainer = popupDiv.getElementsByClassName(
        "cesium-popup-tip-container"
      );
      // 调整内容显示到中间位置
      const featurePopupContainer = popupDiv.getElementsByClassName(
        "mapgis-feature-popup-container"
      );
      for (let i = 0; i < featurePopupContainer.length; i++) {
        featurePopupContainer[i].style.paddingLeft = "20px";
      }
      // 暂时只针对一张图默认的标注图标做了调整
      // 图标上方位置 水平padding-left范围【2px,22px】，padding-to范围【0px,35px】,暂时只能从中间设置到顶点之间
      // margin-top范围【-45px,-10px】
      // padding: 35px 0px 0px 12px
      // margin: -45px 0px 0px 0px
      const { popupAnchor } = this;
      let { y } = popupAnchor;
      if (y > 0.5) {
        y = 0.5;
      }
      const paddingTop = Math.ceil(35 * (1 - y * 2));
      const paddingLeft = Math.ceil((22 - 2) * popupAnchor.x) + 2;
      const marginTop = -10 - paddingTop;
      for (let i = 0; i < popupTipContainer.length; i++) {
        popupTipContainer[
          i
        ].style.padding = `${paddingTop}px 0px 0px ${paddingLeft}px`;
      }
      const popupTip = document.getElementsByClassName("cesium-popup-tip");
      for (let i = 0; i < popupTip.length; i++) {
        popupTip[i].style.margin = `${marginTop}px 0px 0px 0px`;
      }
    },
    bindEvent() {
      this.$emit("popupload", this.marker.markerId);
    },
    updateMarker() {
      const marker = { ...this.marker };
      marker.mouseOver = (event) => {
        this.mouseOver(event, marker);
      };
      marker.mouseOut = (event) => {
        this.mouseOut(event, marker);
      };
      marker.leftClick = (event) => {
        this.leftClick(event, marker);
      };
      marker.name = marker.markerId;
      marker.center = marker.coordinates;
      this.markerManager.addGraphicMarker(marker);
    },
    updateMarkerImage(img) {
      this.markerManager.updateMarkerImage(img, this.marker?.markerId);
    },
    changeEvent(enable) {
      this.showPopup = enable;
    },
    mouseOver(event, marker) {
      if (this.popupToggleType === "click") return;
      const { changeEvent, markerId } = event;
      if (this.popupShowType === "default") {
        if (changeEvent) {
          changeEvent(true);
        } else {
          this.showPopup = true;
        }
      } else {
        this.$emit("show-marker-detail", this.propertyKeys, markerId);
      }

      this.$emit("marker-id", markerId);
      this.$emit("mouseenter", event, markerId);
    },
    mouseOut(event, marker) {
      if (this.popupToggleType === "click") return;
      const { changeEvent, markerId } = event;
      if (changeEvent) {
        changeEvent(false);
      } else {
        this.showPopup = false;
      }
      this.$emit("mouseleave", event, markerId);
    },
    leftClick(event, marker) {
      const { Cesium, viewer } = this;
      const { coordinates } = marker;
      const clickPosition = Cesium.Cartographic.fromCartesian(
        viewer.getCartesian3Position(event.position)
      );
      this.popupPosition = {
        longitude: Cesium.Math.toDegrees(clickPosition.longitude),
        latitude: Cesium.Math.toDegrees(clickPosition.latitude),
        height: clickPosition.height,
      };
      if (this.popupToggleType === "click") {
        this.$emit("marker-id", marker.markerId);
        if (this.popupShowType === "default") {
          this.showPopup = true;
        } else {
          this.$emit("show-marker-detail", this.propertyKeys, markerId);
        }
      }
    },
    changeVisible(val, popupId) {
      // console.log(val)
      // 用户点击弹出框关闭按钮，关闭弹框
      if (this.showPopup !== val) {
        this.showPopup = val;
      }
      if (val && popupId) {
        this.changeStyle(popupId);
      }
    },
  },
  beforeDestroy() {
    // 移除当前marker
    this.markerManager.removeGraphicById(this.marker.markerId);
  },
};
</script>
