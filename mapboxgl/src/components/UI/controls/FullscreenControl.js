import controlMixin from "./controlMixin";

export default {
  name: "mapbox-fullscreen-control",
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
