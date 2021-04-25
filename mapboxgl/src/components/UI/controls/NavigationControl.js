import controlMixin from "./controlMixin";

export default {
  name: "mapgis-navigation",
  mixins: [controlMixin],

  props: {
    showCompass: {
      type: Boolean,
      default: true
    },
    showZoom: {
      type: Boolean,
      default: true
    }
  },

  created() {
    this.control = new this.mapbox.NavigationControl(this.$props);
    this.$_addControl();
  }
};
