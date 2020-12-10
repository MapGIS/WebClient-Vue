<script>
import IgsOptions from "./IgsOptions";
import mixinImageryProvider from "../ImageryProvider";
export default {
  name: "cesium-igs-doc-provider",
  mixins: [
    mixinImageryProvider,
    ...IgsOptions
  ],
};
</script>

