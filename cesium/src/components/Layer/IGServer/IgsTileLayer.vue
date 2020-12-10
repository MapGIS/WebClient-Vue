<script>
import IgsLayer from "../RasterLayer";
export default {
  name: "cesium-igs-tile-layer",
  mixins: [IgsLayer],
  props: {
    serverName: {
      type: String,
      default: null
    },
  },
  methods: {
    initUrl () {
      let _url = this.url;
      if (!this.url) {
        let domain = this.domain;
        if (!domain) {
          domain = this.protocol + "://" + this.ip + ":" + this.port;
        }
        _url = domain + "/igs/rest/mrms/tile/" + this.serverName;
      }
      return _url
    },
    createCesiumObject () {
      const url = this.initUrl();
      const { $props } = this;
      const options = { ...$props, url };
      const provider = CesiumZondy.Provider.IgsTileProvider(options);
      return new Cesium.ImageryLayer(provider || {});
    },
  },

};
</script>
