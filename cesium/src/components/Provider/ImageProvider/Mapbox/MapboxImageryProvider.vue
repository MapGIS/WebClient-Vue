<script>
import {
  accessToken,
  format,
  ellipsoid,
  minimumLevel,
  maximumLevel,
  rectangle,
  credit
} from '../../../Base/Cesium/CesiumMixinProps'
import BaseProvider from '../ImageryProvider'
export default {
  name: 'vue-provider-imagery-mapbox',
  mixins: [
    accessToken,
    format,
    ellipsoid,
    minimumLevel,
    maximumLevel,
    rectangle,
    credit,
    BaseProvider
  ],
  props: {
    url: {
      type: String,
      default: 'https://api.mapbox.com/v4/'
    },
    mapId: String
  }
}
</script>
