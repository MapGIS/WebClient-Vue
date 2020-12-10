<script>
import RasterLayer from "../RasterLayer";
export default {
  name: "cesium-raster-layer",
  mixins: [RasterLayer],
  methods: {
    createCesiumObject () {
      const { $props } = this;
      const provider = new Cesium.UrlTemplateImageryProvider($props);
      return new Cesium.ImageryLayer(provider);
    }
  }
};
</script>
