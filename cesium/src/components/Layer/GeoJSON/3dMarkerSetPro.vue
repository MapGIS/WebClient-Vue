<template>
  <div>
    <mp-3d-marker-pro
      v-for="marker in markers"
      :vue-key="vueKey"
      :key="marker.fid"
      :marker="marker"
      :current-marker-id="currentMarkerId"
      :field-configs="fieldConfigs"
      @marker-id="updateCurrentMarkerId"
      @mouseenter="mouseEnterEvent"
      @mouseleave="mouseLeaveEvent"
      @change="changePopup"
      @popupload="popupLoad"
    >
      <template slot="popup" slot-scope="slotProps">
        <slot name="popup" v-bind="slotProps"></slot>
      </template>
    </mp-3d-marker-pro>
  </div>
</template>

<script>
import Mp3dMarkerPro from './3dMarkerPro.vue'

export default {
  name: 'Mp3dMarkerSetPro',
  components: { Mp3dMarkerPro },
  props: {
    vueKey: {
      type: String,
      default: 'default'
    },
    markers: {
      type: Array,
      required: true
    },
    fieldConfigs: {
      type: Array,
      required: false,
      default: () => []
    }
  },
  data() {
    return {
      currentMarkerId: ''
    }
  },
  methods: {
    updateCurrentMarkerId(id) {
      this.currentMarkerId = id
    },
    mouseEnterEvent(e, id) {
      this.$emit('mouseenter', e, id)
    },
    mouseLeaveEvent(e, id) {
      this.$emit('mouseleave', e, id)
    },
    popupLoad(fid) {
      this.$emit('popupload', fid)
    },
    changePopup(val) {
      this.currentMarkerId = val
    }
  }
}
</script>
