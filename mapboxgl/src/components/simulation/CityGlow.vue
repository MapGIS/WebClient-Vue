<template>
  <div></div>
</template>

<script>
import layerMixin from "../layer/layerMixin";
import layerEvents from "../../lib/layerEvents";
import clonedeep from "lodash.clonedeep";

import { MRFS } from "@mapgis/webclient-es6-service";
const { QueryDocFeature, QueryLayerFeature } = MRFS;

export default {
  name: "mapgis-igs-feature-layer",
  mixins: [layerMixin],
  props: {
    baseUrl: {
      type: String,
      default: null
    },
    mapIndex: {
      type: Number,
      default: 0
    },
    layers: {
      type: [String, Array],
      default: null
    },
    tileFeaturesCount: {
      type: Number,
      default: 400
    },
    filter: {
      type: String,
      default: null
    },
    layerStyle: {
      type: Object,
      default: null
    },
    guid: {
      type: String,
      default: new Date().getTime().toString()
    }
  },
  methods: {
    $_init() {
      if (this.baseUrl) {
        let partUrl = this.$_initAllRequestParams().join("&");
        this._url = encodeURI(this.baseUrl + "?" + partUrl) + "&bbox={bbox}";
      } else if (this.url) {
        let url = this.url;
        if (url.indexOf("?") === -1) {
          url += "?";
          url += "bbox={bbox}&";
        } else if (url.indexOf("bbox") === -1) {
          url += "&bbox={bbox}&";
        }
        let partUrl = this.$_initAllRequestParams().join("&");
        url += partUrl;
        this._url = url;
        return;
      } else {
        let domain = this.domain;
        if (!domain) {
          domain = this.protocol + "://" + this.ip + ":" + this.port;
        }
        let tempUrl = domain + "/igs/rest/mrms/layers";
        let partUrl = this.$_initAllRequestParams().join("&");
        this._url = encodeURI(tempUrl + "?" + partUrl) + "&bbox={bbox}";
      }
    },
    $_initAllRequestParams() {
      let params = [];
      params.push("guid=" + this.guid);
      let gdbps;
      if (typeof this.gdbps === "string") {
        gdbps = this.gdbps;
      } else {
        gdbps = this.gdbps.toString();
      }
      params.push("gdbps=" + gdbps);

      if (this.filters) {
        params.push("filters=" + this.filters);
      }
      if (this.igsMapStyle) {
        params.push("style=" + JSON.stringify(this.igsMapStyle));
      }

      return params;
    },
    $_deferredMount() {
      /* this.$_init();
      let source = {
        type: "raster",
        tiles: [this._url],
        tileSize: this.tileSize,
        mapgisOffset: this.zoomOffset,
        ...this.source
      };

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
      this.initial = false; */
    }
  }
};
</script>
