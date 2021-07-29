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
      const style = map.getStyle();
      if (!style) return undefined;
      const { layers } = style;
      let find = layers.find(l => {
        return l.id == id;
      });
      return find ? find : map.getLayer(layerid);
    },
    $_emitEvent(event) {
      const { layerid } = this;
      this.$emit("edit-change", { ...event, layerid });
    }
  }
};
