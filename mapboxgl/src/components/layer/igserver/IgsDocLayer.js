import rasterLayer from "../RasterLayer";
import layerEvents from "../../../lib/layerEvents";
import { newGuid } from "../../util";
import igsOptions from "./igsOptions";

export default {
  name: "mapgis-igs-doc-layer",
  mixins: [rasterLayer],
  props: {
    ...igsOptions,
    serverName: {
      type: String,
      require: true,
    },
    layers: {
      type: String,
      default: null,
    },
    filters: {
      type: String,
      default: null,
    },
    igsMapStyle: {
      type: Object,
      default: null,
    },
    f: {
      type: String,
      default: "png",
    },
    proj: {
      type: String,
      default: null,
    },
    guid: {
      type: String,
      default: undefined,
    },
    dynamicTile: {
      type: Boolean,
      default: false,
    },
    isAntialiasing: {
      type: Boolean,
      default: false,
    },
    update: {
      type: Boolean,
      default: false,
    },
    mode: {
      type: String,
      default: null,
    },
    renderMode: {
      type: String,
      default: "raster",
    },
  },
  watch: {
    layers(next) {
      if (this.initial) return;
      this.changelayers();
    },
    dynamicTile(next) {
      if (this.initial) return;
      this.changelayers();
    },
    filters(next) {
      if (this.initial) return;
      this.changelayers();
    },
    renderMode(next) {
      if (this.initial) return;
      this.changelayers();
    },
  },
  methods: {
    changelayers() {
      this.$_deferredUnMount();
      this.$_deferredMount();
    },
    $_init() {
      let { url, domain, baseUrl, protocol, ip, port } = this;
      let { serverName, tileSize, dynamicTile } = this;
      let fixBaseUrl, docParam, suffixParams;
      if (url) {
        let url = this.url;
        if (url.indexOf("?") === -1) {
          url += "?";
          url += "bbox={bbox}";
        } else if (url.indexOf("bbox") === -1) {
          url += "&bbox={bbox}";
        }
        this._url = url;
        return;
      } else if (baseUrl) {
        if (baseUrl.indexOf("?") > -1) {
          const arr = this.baseUrl.split("?");
          fixBaseUrl = arr[0];
          if (arr && arr.length > 1) {
            suffixParams = arr[1];
          }
        } else {
          fixBaseUrl = this.baseUrl;
        }
      } else if (domain) {
        fixBaseUrl = `${domain}/igs/rest/mrms/docs/${serverName}`;
      } else {
        domain = `${protocol}://${ip}:${port}`;
        fixBaseUrl = `${domain}/igs/rest/mrms/docs/${serverName}`;
      }

      if (dynamicTile) {
        if (baseUrl) {
          this._url = baseUrl + `/{z}/{y}/{x}?size=${tileSize}`;
        } else {
          this._url = `${domain}/igs/rest/mrms/tile/${serverName}/{z}/{y}/{x}?size=${tileSize}`;
        }
      } else {
        docParam = this.$_initAllRequestParams(suffixParams).join("&");
        this._url = encodeURI(fixBaseUrl + "?" + docParam) + "&bbox={bbox}";
      }
    },
    $_initAllRequestParams(suffixParams) {
      let params = [];

      params.push("f=" + this.f);
      let guid = newGuid();
      params.push(("guid=" + this.guid) | guid);

      let width, height;
      width = height = this.tileSize;
      params.push("w=" + width);
      params.push("h=" + height);

      if (this.layers) {
        params.push("layers=" + this.layers);
      }
      if (this.filters) {
        params.push("filters=" + this.filters);
      }
      if (this.igsMapStyle) {
        params.push("style=" + JSON.stringify(this.igsMapStyle));
      }
      if (this.proj) {
        params.push("proj=" + this.proj);
      }
      if (this.mode) {
        params.push("mode=" + this.mode);
      }
      if (this.isAntialiasing !== null) {
        params.push("isAntialiasing=" + this.isAntialiasing);
      }
      if (this.dynamicTile !== null && this.isAntialiasing !== null) {
        params.push("cache=" + this.dynamicTile);
      }
      if (this.update !== null && this.isAntialiasing !== null) {
        params.push("update=" + this.update);
      }
      if (this.token) {
        params.push(this.token.key + "=" + this.token.value);
      }
      if (suffixParams) {
        params.push(suffixParams);
      }
      return params;
    },
    $_deferredMount() {
      this.$_init();

      let source;

      let renderMode = this.renderMode;
      // 根据renderMode，以不同的方式输出图片
      // 龚跃健-202407017
      if (renderMode === "image-map") {
        // image-map类型
        source = {
          url: this._url,
          ...this.source,
          rebaseRequestUrl(url, params) {
            const _sw = this.map
              .getCRS()
              .projection.project(this.map.getBounds()._sw);
            const _ne = this.map
              .getCRS()
              .projection.project(this.map.getBounds()._ne);
            const bound = [..._sw, ..._ne];
            const bbox = bound.toString();
            const [imageWidth, imageHeight] = params.imageSize;
            const split = url.split("&");
            split.forEach((part) => {
              if (part.includes("size=")) {
                url = url.replace(part, `size=${imageWidth},${imageHeight}`);
              }
              if (part.includes("w=")) {
                url = url.replace(part, `w=${imageWidth}`);
              }
              if (part.includes("h=")) {
                url = url.replace(part, `h=${imageHeight}`);
              }
              if (part.includes("bbox=")) {
                url = url.replace(part, `bbox=${bbox}`);
              }
            });
            return url;
          },
          type: "image-map",
        };
      } else {
        // 瓦片类型
        source = {
          type: "raster",
          tiles: [this._url],
          tileSize: this.tileSize,
          mapgisOffset: this.zoomOffset,
          ...this.source,
        };
      }

      this.map.on("dataloading", this.$_watchSourceLoading);
      try {
        this.map.addSource(this.sourceId || this.layerId, source);
      } catch (err) {
        if (this.replaceSource) {
          this.map.removeSource(this.sourceId || this.layerId);
          this.map.addSource(this.sourceId || this.layerId, source);
        }
      }
      this.$_addLayer();
      this.$_bindLayerEvents(layerEvents);
      this.map.off("dataloading", this.$_watchSourceLoading);
      this.initial = false;
    },
    $_deferredUnMount() {
      this.map.removeLayer(this.layerId);
      this.map.removeSource(this.sourceId || this.layerId);
      this.initial = true;
    },
  },
};
