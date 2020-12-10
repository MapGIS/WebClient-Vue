<script>
import Tileset from "./3DTileset";
export default {
  name: "cesium-igs-m3d",
  mixins: [Tileset],
  props: {
    layerRenderIndex: {
      type: Number,
      default: 0
    },
    layerIndex: {
      type: Number,
      default: 0
    },
    gdbpUrl: {
      type: String,
      default: ''
    },
    show: {
      type: Boolean,
      default: true
    },
    igserver: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    createCesiumObject () {
      const { $props, url } = this;
      const { layerRenderIndex } = this;
      const streamsUrl = url +
        '/GetDataStreams?sceneIndex=0&layerIndex=' +
        layerRenderIndex +
        '&Level=0&Row=0&Col=0'
        // + '&datatype=10&dataName=M3dTopInfoData&webGL=true&compress=false';
      const tileset = new Cesium.MapGISM3DSet({
        url: streamsUrl,
        igserver: true
      });
      return tileset;
    },
  },
};
</script>

