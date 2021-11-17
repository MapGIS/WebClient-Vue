<script>
import Tileset from "./3DTileset";
export default {
  name: "mapgis-3d-tileset",
  mixins: [Tileset],
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
  },
};
</script>

