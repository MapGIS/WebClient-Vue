<script>
import Tileset from "./3DTileset";
export default {
  name: "mapgis-3d-3dtiles-layer",
  mixins: [Tileset],
  watch: {
    opacity(next) {
      if (next >= 0 && next <= 1) {
        this.changeOpacity(next);
      }
    },
  },
  methods: {
    createCesiumObject() {
      const { $props, url } = this;
      const { headers } = $props;
      let urlSource = undefined;

      if (headers) {
        urlSource = new Cesium.Resource({ url: url, headers: headers });
      } else {
        urlSource = url;
      }

      let options = { ...$props, url: urlSource };
      const tileset = new Cesium.Cesium3DTileset(options);
      return tileset;
    },
    changeOpacity(opacity) {
      const { vueKey, vueIndex } = this;
      const vm = this;
      let find = vueCesium.Tileset3DManager.findSource(vueKey, vueIndex);
      if (find) {
        let tileset = find.source;
        if (!tileset) return;

        tileset.style = new Cesium.Cesium3DTileStyle({
          color: `color('#FFFFFF', ${opacity})`,
        });
      }
    },
  },
};
</script>

