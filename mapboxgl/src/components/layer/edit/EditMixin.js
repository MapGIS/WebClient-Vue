export default {
  name: "mapgis-edit-mixin",
  inject: ["map", "mapbox"],
  props: {
    layerid: {
      type: String
    }
  },
  methods: {
    $_getLayer(id) {
      const { map, layerid } = this;
      id = id || layerid;
      if (!map) return undefined;
      return map.getLayer(layerid);
    },
    $_emitEvent(event) {
      const { layerid } = this;
      this.$emit("edit-change", { ...event, layerid });
    }
  }
};
