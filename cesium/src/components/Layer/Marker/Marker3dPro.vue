<template>
  <!-- 设置三维标注点不参与深度检测 :disableDepthTestDistance="Number.POSITIVE_INFINITY"-->
  <mapgis-3d-marker
    :longitude="popupPosition.longitude"
    :latitude="popupPosition.latitude"
    :height="popupPosition.height"
    :iconUrl="img"
    :fid="marker.fid"
    :changeEvent="changeEvent"
    :farDist="200000000"
    :disableDepthTestDistance="Number.POSITIVE_INFINITY"
    @click="clickEvent"
    @mouseEnter="mouseOver"
    @mouseLeave="mouseOut"
  >
    <mapgis-3d-feature-popup
      :vue-key="vueKey"
      :position="{
        longitude: popupPosition.longitude,
        latitude: popupPosition.latitude,
        height: popupPosition.height
      }"
      :visible="showPopup"
      @change="changePopup"
    >
      <div slot="default">
        <slot
          name="popup"
          :marker="marker"
          :field-configs="fieldConfigs"
          :property-keys="propertyKeys"
        >
          <mapgis-3d-popup-iot :properties="properties" />
        </slot>
      </div>
    </mapgis-3d-feature-popup>
  </mapgis-3d-marker>
</template>

<script>
/**
 * cesium标注，弹出框使用@mapgis/webclient-vue-cesium里的popup
 */
export default {
  name: "mapgis-3d-marker-pro",
  inject: ["Cesium", "vueCesium", "viewer"],
  props: {
    vueKey: String,
    marker: {
      type: Object,
      required: true
    },
    fieldConfigs: {
      type: Array,
      required: false,
      default: () => []
    },
    // 当前显示弹出框的标注id
    currentMarkerId: {
      type: String,
      required: false
    },
    popupShowType: {
      type: String,
      default: "default"
    },
    popupToggleType: {
      type: String,
      default: "mouseenter"
    },
    // 以图标左上角为原点，增量方式与mapboxgl弹框的offset保持一致，x往右递增，y往下递增
    popupAnchor: {
      type: Object,
      default: () => {
        return { x: 0.5, y: 0 };
      }
    }
  },
  data() {
    return {
      showPopup: false,
      entityNames: []
    };
  },
  computed: {
    properties() {
      const obj = {};
      this.fieldConfigs.forEach(item => {
        if (this.marker.properties[item.showName]) {
          obj[item.showName] = this.marker.properties[item.showName];
        }
      });
      return obj;
    },
    img() {
      return this.marker.img;
    },
    popupPosition() {
      if (!this.marker) {
        return {};
      }
      const { coordinates } = this.marker;
      const height = coordinates.length > 2 ? Number(coordinates[2]) : 0;
      const position = {
        longitude: Number(coordinates[0]),
        latitude: Number(coordinates[1]),
        height: height
      };
      return position;
    },
    // 根据filedConfigs做一个过滤，去除不可见的
    propertyKeys() {
      const keys = Object.keys(this.marker.properties);
      return keys.filter(key => {
        const config = this.fieldConfigs.find(config => config.name === key);

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
    propertyName() {
      return function(key) {
        const config = this.fieldConfigs.find(config => config.name === key);

        if (config && Object.hasOwnProperty.call(config, "title")) {
          return config.title;
        }

        return key;
      };
    }
  },
  watch: {
    // 更换图片，更换地图上的标注
    img: {
      deep: true,
      handler() {
        this.updateMarker();
      }
    },
    currentMarkerId: {
      deep: true,
      immediate: true,
      handler() {
        // 当前显示弹出框的标注与组件内的id不一致时，隐藏弹出框
        if (this.currentMarkerId !== this.marker.fid) {
          this.showPopup = false;
        }
      }
    }
  },
  mounted() {
    const viewer = this.vueCesium.getViewer(this.vueKey) || this.viewer;
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
      this.$emit("popupload", this.marker.fid);
    },
    updateMarker() {
      /* let marker = { ...this.marker };
      marker.name = marker.fid;
      marker.center = marker.coordinates; */
    },
    changeEvent(enable) {
      this.showPopup = enable;
    },
    clickEvent(event) {
      if (this.popupToggleType === "mouseenter") return;
      const { changeEvent, fid } = event;
      if (this.popupShowType === "default") {
        if (changeEvent) {
          changeEvent(true);
        } else {
          this.showPopup = true;
        }
      } else {
        this.$emit("show-marker-detail", this.propertyKeys, fid);
      }

      this.$emit("marker-id", fid);
      this.$emit("mouseenter", event, fid);
    },
    mouseOver(event) {
      if (this.popupToggleType === "click") return;
      const { changeEvent, fid } = event;
      if (this.popupShowType === "default") {
        if (changeEvent) {
          changeEvent(true);
        } else {
          this.showPopup = true;
        }
      } else {
        this.$emit("show-marker-detail", this.propertyKeys, fid);
      }

      this.$emit("marker-id", fid);
      this.$emit("mouseenter", event, fid);
    },
    mouseOut(event) {
      if (this.popupToggleType === "click") return;
      const { changeEvent, fid } = event;
      if (changeEvent) {
        changeEvent(false);
      } else {
        this.showPopup = false;
      }
      this.$emit("mouseleave", event, fid);
    }
  }
};
</script>
