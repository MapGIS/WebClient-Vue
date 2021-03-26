<script>
import RasterLayer from "../RasterLayer";
export default {
  name: "mapgis-3d-rastertile-layer",
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
