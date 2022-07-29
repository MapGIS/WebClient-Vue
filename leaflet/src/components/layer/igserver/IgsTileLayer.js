import rasterLayer from "../RasterLayer";
import igsOptions from "./igsOptions";

export default {
  name: "mapgis-igs-tile-layer",
  mixins: [rasterLayer],
  props: {
    ...igsOptions,
    serverName: {
      type: String,
      require: true,
    },
  },
  data() {
    return {
      url: "",
    };
  },
  methods: {
    $_init() {
      let { domain, baseUrl, protocol, ip, port } = this;
      let { serverName, zoomOffset = 0 } = this;
      let fixBaseUrl;
      if (baseUrl) {
        if (baseUrl.indexOf("?") > -1) {
          fixBaseUrl = this.baseUrl.split("?")[0];
        } else {
          fixBaseUrl = this.baseUrl;
        }
      } else if (domain) {
        fixBaseUrl = `${domain}/igs/rest/mrms/tile/${serverName}`;
      } else {
        domain = `${protocol}://${ip}:${port}`;
        fixBaseUrl = `${domain}/igs/rest/mrms/tile/${serverName}`;
      }

      this.url = encodeURI(fixBaseUrl) + "/{z}/{y}/{x}";
    },
  },
};
