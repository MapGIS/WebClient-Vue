<script>
import IgsOptions from "./IgsOptions";
import mixinImageryProvider from "../ImageryProvider";
export default {
  name: "cesium-igs-tile-provider",
  mixins: [
    mixinImageryProvider,
    ...IgsOptions
  ],
};
</script>

