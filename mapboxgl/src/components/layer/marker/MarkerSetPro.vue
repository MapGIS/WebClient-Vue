<template>
  <div>
    <mapgis-marker-pro
      v-for="marker in markers"
      :key="marker.markerId"
      :marker="marker"
      :field-configs="fieldConfigs"
      @mouseenter="mouseEnterEvent"
      @mouseleave="mouseLeaveEvent"
    >
      <template slot="popup" slot-scope="slotProps">
        <slot name="popup" v-bind="slotProps"></slot>
      </template>
    </mapgis-marker-pro>
  </div>
</template>

<script>
import MapgisMarkerPro from "./MarkerPro.vue";

export default {
  name: "mapgis-marker-set-pro",
  components: { MapgisMarkerPro },
  props: {
    markers: {
      type: Array,
      required: true
    },
    fieldConfigs: {
      type: Array,
      required: false,
      default: () => []
    },
    popupToggleType: {
      type: String,
      default: () => "mouseenter"
    }
  },
  data() {
    return {
      prePopup: undefined
    };
  },
  methods: {
    mouseEnterEvent(e, id) {
      if (this.popupToggleType === "click") return;
      if (this.prePopup && this.prePopup.isOpen()) {
        this.prePopup.remove();
      }
      e.marker.togglePopup();
      this.prePopup = e.marker.getPopup();

      this.$emit("mouseenter", e, id);
    },
    mouseLeaveEvent(e, id) {
      this.$emit("mouseleave", e, id);
    }
  }
};
</script>
