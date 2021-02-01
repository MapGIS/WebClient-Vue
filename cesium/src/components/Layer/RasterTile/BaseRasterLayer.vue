<script>
import RasterLayer from "../RasterLayer";
export default {
  name: "zondy-3d-raster-layer",
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
