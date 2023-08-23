<template>
  <div>
    <mp-3d-marker-pro
      v-for="marker in markers"
      :vue-key="vueKey"
      :key="marker.fid"
      :marker="marker"
      :current-marker-id="currentMarkerId"
      :field-configs="fieldConfigs"
      :popupShowType="popupShowType"
      :popupToggleType="popupToggleType"
      :popupAnchor="popupAnchor"
      @marker-id="updateCurrentMarkerId"
      @mouseenter="mouseEnterEvent"
      @mouseleave="mouseLeaveEvent"
      @change="changePopup"
      @popupload="popupLoad"
      @show-marker-detail="showMarkerDetail"
    >
      <template slot="popup" slot-scope="slotProps">
        <slot name="popup" v-bind="slotProps"></slot>
      </template>
    </mp-3d-marker-pro>
  </div>
</template>

<script>
import Mp3dMarkerPro from "./Marker3dPro.vue";

export default {
  name: "mapgis-3d-marker-set-pro",
  components: { Mp3dMarkerPro },
  props: {
    vueKey: {
      type: String,
      default: "default"
    },
    markers: {
      type: Array,
      required: true
    },
    fieldConfigs: {
      type: Array,
      required: false,
      default: () => []
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
      currentMarkerId: ""
    };
  },
  methods: {
    updateCurrentMarkerId(id) {
      if (this.popupShowType === "default") {
        this.currentMarkerId = id;
      }
    },
    mouseEnterEvent(e, id) {
      this.$emit("mouseenter", e, id);
    },
    mouseLeaveEvent(e, id) {
      this.$emit("mouseleave", e, id);
    },
    popupLoad(fid) {
      this.$emit("popupload", fid);
    },
    changePopup(val) {
      if (this.popupShowType === "default") {
        this.currentMarkerId = val;
      }
    },
    showMarkerDetail(propertyKeys, fid) {
      const data = this.getPopupProperty(propertyKeys, fid);
      this.$emit("show-marker-detail", data);
    },
    getPopupProperty(propertyKeys, fid) {
      let detail = {};
      const marker = this.markers.find(item => item.fid === fid);
      propertyKeys.forEach(item => {
        let info = {};
        info[item] = marker.properties[item];
        detail = { ...info, ...detail };
      });
      return detail;
    }
  }
};
</script>
