// import withRegistration from "../../../lib/withRegistration";
import withEvents from "../../../../lib/withEvents";
import withSelfEvents from "../../withSelfEvents";

export default {
  mixins: [withEvents, withSelfEvents],

  inject: ["mapbox", "map", "actions"],

  props: {
    position: {
      type: String,
      default: "top-right"
    }
  },

  beforeDestroy() {
    if (this.map && this.drawer) {
      // this.map.removeControl(this.drawer);
    }
  },

  methods: {
    $_addControl() {
      try {
        this.map.addControl(this.drawer, this.position);
      } catch (err) {
        this.$_emitEvent("error", { error: err });
        return;
      }
      this.$_emitEvent("added", { drawer: this.drawer });
    }
  }
};
