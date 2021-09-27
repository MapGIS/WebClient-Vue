import DefaultMeasureStyle from "../DefaultMeasureStyle";

export const measureEvents = {
  // es6
  measureCreate: "draw.create",
  measureUpdate: "draw.update",
  measureResult: "measureResult",
  // brower
  measurecreate: "draw.create",
  measureupdate: "draw.update",
  measureresult: "measureresult"
};

export const measureSelfEvents = {
  measurecreate: "measurecreate",
  measureCreate: "measureCreate",
  measureupdate: "measureupdate",
  measureUpdate: "measureUpdate"
};

export const measureModeMap = {
  line: "draw_line_string",
  polygon: "draw_polygon",
  direct: "direct_select",
  simple: "simple_select"
};

export const measureTypeToModeMap = {
  "measure-length": measureModeMap.line,
  "measure-area": measureModeMap.polygon
};

export const measureMethodMap = {
  geography: "geography",
  projection: "projection",
  both: "both"
};

export const lineTypeMap = {
  solid: "实线",
  dashed: "虚线"
};

export const paintTypeMap = {
  line: "line",
  circle: "circle",
  fill: "fill"
};

export const defaultStyle = DefaultMeasureStyle;
