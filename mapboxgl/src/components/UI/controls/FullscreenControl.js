import controlMixin from "./controlMixin";

export default {
  name: "mapgis-fullscreen",
  mixins: [controlMixin],

  props: {
    container: {
      type: HTMLElement,
      default: undefined
    }
  },

  created() {
    this.control = new this.mapbox.FullscreenControl(this.$props);
    this.$_addControl();
  }
};
