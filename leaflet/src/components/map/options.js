export default {
  autoResize: {
    type: Boolean,
    default: true,
  },
  container: {
    type: [String, HTMLElement],
    default() {
      return `map-${("" + Math.random()).split(".")[1]}`;
    },
  },
  serverUrl: {
    type: String,
    default: "https://develop.smaryun.com:6163",
  },
  mapClass: {
    type: String,
    default: "leaflet-default-map",
  },
  crs: {
    type: [String, Object],
    default: "EPSG:3857",
  },
  minZoom: {
    type: Number,
    default: 0,
  },
  maxZoom: {
    type: Number,
    default: 20,
  },
  /* maxBounds: {
    type: Array,
    default() {
      return [
        [-179, -89],
        [179, 89]
      ];
    }
  }, */
  center: {
    type: [Object, Array],
    default: () => {
      return { lon: 0, lat: 0 };
    },
  },
  zoom: {
    type: Number,
    default: 0,
  },
  /*  bounds: {
    type: [Object, Array],
    default: undefined
  } */
};
