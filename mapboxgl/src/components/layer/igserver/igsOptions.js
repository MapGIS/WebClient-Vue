export default {
  url: {
    type: String,
    default: null
  },
  baseUrl: {
    type: String,
    default: null
  },
  domain: {
    type: String,
    default: null
  },
  protocol: {
    type: String,
    default: location.protocol.split(":")[0] || "http"
  },
  ip: {
    type: String,
    default: "localhost"
  },
  port: {
    type: String,
    default: "6163"
  },
  tileSize: {
    type: Number,
    default: 512
  },
  zoomOffset: {
    type: Number,
    default: 0
  }
};
