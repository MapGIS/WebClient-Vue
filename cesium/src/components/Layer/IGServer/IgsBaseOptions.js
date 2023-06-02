export default {
  url: { type: String, default: "" },
  protocol: { type: String, default: window.location.protocol.split(":")[0] },
  ip: { type: String, default: "" },
  port: { type: String, default: "" },
  serverName: { type: String, default: "" },
  domain: { type: String, default: "" },
  show: { type: Boolean, default: true }
};
