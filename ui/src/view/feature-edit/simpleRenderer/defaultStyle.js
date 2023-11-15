// simpleMarkerSymbol
export const defaultSimpleMarkerStyle = {
  color: "rgba(255, 255, 255, 1)",
  size: 20,
  style: "circle",
  xoffset: 0,
  yoffset: 0,
  angle: 0,
  simpleLineStyle: {
    color: "rgba(255, 255, 255, 1)",
    width: 1,
    cap: "round",
    join: "round",
    miterLimit: 2,
    style: "solid",
  },
};

// textSymbol
export const defaultTextStyle = {
  color: "rgba(0, 0, 0, 1)",
  font: "宋体",
  xoffset: 0,
  yoffset: 0,
  horizontalAlignment: "center",
  verticalAlignment: "baseline",
  lineHeight: 1,
  text: "",
};

// pictureMarkerSymbol
export const defaultPictureMarkerStyle = {
  color: "rgba(255, 255, 255, 1)",
  width: 20,
  height: 20,
  url: "",
  xoffset: 0,
  yoffset: 0,
  angle: 0,
};

// simpleLineSymbol
export const defaultSimpleLineStyle = {
  color: "rgba(255, 255, 255, 1)",
  width: 1,
  cap: "round",
  join: "round",
  miterLimit: 2,
  style: "solid",
};

// simpleFillSymbol
export const defaultSimpleFillStyle = {
  color: "rgba(255, 255, 255, 0.25)",
  style: "solid",
  simpleLineStyle: {
    color: "rgba(255, 255, 255, 1)",
    width: 1,
    cap: "round",
    join: "round",
    miterLimit: 2,
    style: "solid",
  },
};
