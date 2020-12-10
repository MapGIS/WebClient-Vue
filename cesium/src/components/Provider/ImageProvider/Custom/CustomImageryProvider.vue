<script>
import {
  url,
  subdomains,
  credit,
  minimumLevel,
  maximumLevel,
  rectangle,
  tilingScheme,
  ellipsoid,
  tileWidth,
  tileHeight,
  getFeatureInfoFormats,
  enablePickFeatures
} from "../../../Base/Cesium/CesiumMixinProps";
import mixinImageryProvider from "../ImageryProvider";
export default {
  name: "vue-provider-imagery-urltemplate",
  mixins: [
    url,
    subdomains,
    credit,
    minimumLevel,
    maximumLevel,
    rectangle,
    tilingScheme,
    ellipsoid,
    tileWidth,
    tileHeight,
    getFeatureInfoFormats,
    enablePickFeatures,
    mixinImageryProvider
  ],
  props: {
    pickFeaturesUrl: String | Object,
    urlSchemeZeroPadding: Object,
    hasAlphaChannel: {
      type: Boolean,
      default: true
    },
    customTags: Object
  }
};
</script>

