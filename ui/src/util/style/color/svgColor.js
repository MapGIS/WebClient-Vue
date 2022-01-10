let colorKeywords = new Map([
  ["transparent", "rgba(0,0,0,0)"],
  ["black", "#000000"],
  ["silver", "#C0C0C0"],
  ["gray", "#808080"],
  ["white", "#FFFFFF"],
  ["maroon", "#800000"],
  ["red", "#FF0000"],
  ["purple", "#800080"],
  ["fuchsia", "#FF00FF"],
  ["green", "#008000"],
  ["lime", "#00FF00"],
  ["olive", "#808000"],
  ["yellow", "#FFFF00"],
  ["navy", "#000080"],
  ["blue", "#0000FF"],
  ["teal", "#008080"],
  ["aqua", "#00FFFF"],
  ["aliceblue", "#f0f8ff"],
  ["antiquewhite", "#faebd7"],
  ["aquamarine", "#7fffd4"],
  ["azure", "#f0ffff"],
  ["beige", "#f5f5dc"],
  ["bisque", "#ffe4c4"],
  ["blanchedalmond", "#ffebcd"],
  ["blueviolet", "#8a2be2"],
  ["brown", "#a52a2a"],
  ["burlywood", "#deb887"],
  ["cadetblue", "#5f9ea0"],
  ["chartreuse", "#7fff00"],
  ["chocolate", "#d2691e"],
  ["coral", "#ff7f50"],
  ["cornflowerblue", "#6495ed"],
  ["cornsilk", "#fff8dc"],
  ["crimson", "#dc143c"],
  ["cyan", "#00ffff"],
  ["darkblue", "#00008b"],
  ["darkcyan", "#008b8b"],
  ["darkgoldenrod", "#b8860b"],
  ["darkgray", "#a9a9a9"],
  ["darkgreen", "#006400"],
  ["darkgrey", "#a9a9a9"],
  ["darkkhaki", "#bdb76b"],
  ["darkmagenta", "#8b008b"],
  ["darkolivegreen", "#556b2f"],
  ["darkorange", "#ff8c00"],
  ["darkorchid", "#9932cc"],
  ["darkred", "#8b0000"],
  ["darksalmon", "#e9967a"],
  ["darkseagreen", "#8fbc8f"],
  ["darkslateblue", "#483d8b"],
  ["darkslategray", "#2f4f4f"],
  ["darkslategrey", "#2f4f4f"],
  ["darkturquoise", "#00ced1"],
  ["darkviolet", "#9400d3"],
  ["deeppink", "#ff1493"],
  ["deepskyblue", "#00bfff"],
  ["dimgray", "#696969"],
  ["dimgrey", "#696969"],
  ["dodgerblue", "#1e90ff"],
  ["firebrick", "#b22222"],
  ["floralwhite", "#fffaf0"],
  ["forestgreen", "#228b22"],
  ["gainsboro", "#dcdcdc"],
  ["ghostwhite", "#f8f8ff"],
  ["gold", "#ffd700"],
  ["goldenrod", "#daa520"],
  ["greenyellow", "#adff2f"],
  ["grey", "#808080"],
  ["honeydew", "#f0fff0"],
  ["hotpink", "#ff69b4"],
  ["indianred", "#cd5c5c"],
  ["indigo", "#4b0082"],
  ["ivory", "#fffff0"],
  ["khaki", "#f0e68c"],
  ["lavender", "#e6e6fa"],
  ["lavenderblush", "#fff0f5"],
  ["lawngreen", "#7cfc00"],
  ["lemonchiffon", "#fffacd"],
  ["lightblue", "#add8e6"],
  ["lightcoral", "#f08080"],
  ["lightcyan", "#e0ffff"],
  ["lightgoldenrodyellow", "#fafad2"],
  ["lightgray", "#d3d3d3"],
  ["lightgreen", "#90ee90"],
  ["lightgrey", "#d3d3d3"],
  ["lightpink", "#ffb6c1"],
  ["lightsalmon", "#ffa07a"],
  ["lightseagreen", "#20b2aa"],
  ["lightskyblue", "#87cefa"],
  ["lightslategray", "#778899"],
  ["lightslategrey", "#778899"],
  ["lightsteelblue", "#b0c4de"],
  ["lightyellow", "#ffffe0"],
  ["limegreen", "#32cd32"],
  ["linen", "#faf0e6"],
  ["magenta", "#ff00ff"],
  ["mediumaquamarine", "#66cdaa"],
  ["mediumblue", "#0000cd"],
  ["mediumorchid", "#ba55d3"],
  ["mediumpurple", "#9370db"],
  ["mediumseagreen", "#3cb371"],
  ["mediumslateblue", "#7b68ee"],
  ["mediumspringgreen", "#00fa9a"],
  ["mediumturquoise", "#48d1cc"],
  ["mediumvioletred", "#c71585"],
  ["midnightblue", "#191970"],
  ["mintcream", "#f5fffa"],
  ["mistyrose", "#ffe4e1"],
  ["moccasin", "#ffe4b5"],
  ["navajowhite", "#ffdead"],
  ["oldlace", "#fdf5e6"],
  ["olivedrab", "#6b8e23"],
  ["orange", "#ffa500"],
  ["orangered", "#ff4500"],
  ["orchid", "#da70d6"],
  ["palegoldenrod", "#eee8aa"],
  ["palegreen", "#98fb98"],
  ["paleturquoise", "#afeeee"],
  ["palevioletred", "#db7093"],
  ["papayawhip", "#ffefd5"],
  ["peachpuff", "#ffdab9"],
  ["peru", "#cd853f"],
  ["pink", "#ffc0cb"],
  ["plum", "#dda0dd"],
  ["powderblue", "#b0e0e6"],
  ["rosybrown", "#bc8f8f"],
  ["royalblue", "#4169e1"],
  ["saddlebrown", "#8b4513"],
  ["salmon", "#fa8072"],
  ["sandybrown", "#f4a460"],
  ["seagreen", "#2e8b57"],
  ["seashell", "#fff5ee"],
  ["sienna", "#a0522d"],
  ["skyblue", "#87ceeb"],
  ["slateblue", "#6a5acd"],
  ["slategray", "#708090"],
  ["slategrey", "#708090"],
  ["snow", "#fffafa"],
  ["springgreen", "#00ff7f"],
  ["steelblue", "#4682b4"],
  ["tan", "#d2b48c"],
  ["thistle", "#d8bfd8"],
  ["tomato", "#ff6347"],
  ["turquoise", "#40e0d0"],
  ["violet", "#ee82ee"],
  ["wheat", "#f5deb3"],
  ["whitesmoke", "#f5f5f5"],
  ["yellowgreen", "#9acd32"]
]);

const hexReg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
const rgbReg = /^(rgb|rgba|RGB|RGBA)/;
const rgbaReg = /^(rgba|RGBA)/;

/**
 * @description Color validator
 * @param {String} color Hex|Rgb|Rgba color or color keyword
 * @return {String|Boolean} Valid color Or false
 */
function validator(color) {
  let isHex = hexReg.test(color);
  let isRgb = rgbReg.test(color);

  if (isHex || isRgb) return color;

  color = getColorByKeyword(color);

  if (!color) {
    console.error("Color: Invalid color!");

    return false;
  }

  return color;
}

/**
 * @description Get color by keyword
 * @param {String} keyword Color keyword like red, green and etc.
 * @return {String|Boolean} Hex or rgba color (Invalid keyword will return false)
 */
function getColorByKeyword(keyword) {
  if (!keyword) {
    console.error("getColorByKeywords: Missing parameters!");

    return false;
  }

  if (!colorKeywords.has(keyword)) return false;

  return colorKeywords.get(keyword);
}

/**
 * @description Get the Rgb value of the color
 * @param {String} color Hex|Rgb|Rgba color or color keyword
 * @return {Array<Number>|Boolean} Rgb value of the color (Invalid input will return false)
 */
export function getRgbValue(color) {
  if (!color) {
    console.error("getRgbValue: Missing parameters!");

    return false;
  }

  color = validator(color);

  if (!color) return false;

  const isHex = hexReg.test(color);
  const isRgb = rgbReg.test(color);

  const lowerColor = color.toLowerCase();

  if (isHex) return getRgbValueFromHex(lowerColor);
  if (isRgb) return getRgbValueFromRgb(lowerColor);
}

/**
 * @description Get the rgb value of the hex color
 * @param {String} color Hex color
 * @return {Array<Number>} Rgb value of the color
 */
function getRgbValueFromHex(color) {
  color = color.replace("#", "");

  if (color.length === 3)
    color = Array.from(color)
      .map(hexNum => hexNum + hexNum)
      .join("");

  color = color.split("");

  return new Array(3)
    .fill(0)
    .map((t, i) => parseInt(`0x${color[i * 2]}${color[i * 2 + 1]}`));
}

/**
 * @description Get the rgb value of the rgb/rgba color
 * @param {String} color Hex color
 * @return {Array} Rgb value of the color
 */
function getRgbValueFromRgb(color) {
  return color
    .replace(/rgb\(|rgba\(|\)/g, "")
    .split(",")
    .slice(0, 3)
    .map(n => parseInt(n));
}

/**
 * @description Get the Rgba value of the color
 * @param {String} color Hex|Rgb|Rgba color or color keyword
 * @return {Array<Number>|Boolean} Rgba value of the color (Invalid input will return false)
 */
export function getRgbaValue(color) {
  if (!color) {
    console.error("getRgbaValue: Missing parameters!");

    return false;
  }

  const colorValue = getRgbValue(color);

  if (!colorValue) return false;

  colorValue.push(getOpacity(color));

  return colorValue;
}

/**
 * @description Get the opacity of color
 * @param {String} color Hex|Rgb|Rgba color or color keyword
 * @return {Number|Boolean} Color opacity (Invalid input will return false)
 */
export function getOpacity(color) {
  if (!color) {
    console.error("getOpacity: Missing parameters!");

    return false;
  }

  color = validator(color);

  if (!color) return false;

  const isRgba = rgbaReg.test(color);

  if (!isRgba) return 1;

  color = color.toLowerCase();

  return Number(
    color
      .split(",")
      .slice(-1)[0]
      .replace(/[)|\s]/g, "")
  );
}

/**
 * @description Convert color to Rgb|Rgba color
 * @param {String} color   Hex|Rgb|Rgba color or color keyword
 * @param {Number} opacity The opacity of color
 * @return {String|Boolean} Rgb|Rgba color (Invalid input will return false)
 */
export function toRgb(color, opacity) {
  if (!color) {
    console.error("toRgb: Missing parameters!");

    return false;
  }

  const rgbValue = getRgbValue(color);

  if (!rgbValue) return false;

  const addOpacity = typeof opacity === "number";

  if (addOpacity) return "rgba(" + rgbValue.join(",") + `,${opacity})`;

  return "rgb(" + rgbValue.join(",") + ")";
}

/**
 * @description Convert color to Hex color
 * @param {String} color Hex|Rgb|Rgba color or color keyword
 * @return {String|Boolean} Hex color (Invalid input will return false)
 */
export function toHex(color) {
  if (!color) {
    console.error("toHex: Missing parameters!");

    return false;
  }

  if (hexReg.test(color)) return color;

  color = getRgbValue(color);
  if (!color) return false;

  return (
    "#" +
    color
      .map(n => Number(n).toString(16))
      .map(n => (n === "0" ? "00" : n))
      .join("")
  );
}

/**
 * @description Get Color from Rgb|Rgba value
 * @param {Array<Number>} value Rgb|Rgba color value
 * @return {String|Boolean} Rgb|Rgba color (Invalid input will return false)
 */
export function getColorFromRgbValue(value) {
  if (!value) {
    console.error("getColorFromRgbValue: Missing parameters!");

    return false;
  }

  const valueLength = value.length;

  if (valueLength !== 3 && valueLength !== 4) {
    console.error("getColorFromRgbValue: Value is illegal!");

    return false;
  }

  let color = valueLength === 3 ? "rgb(" : "rgba(";

  color += value.join(",") + ")";

  return color;
}

/**
 * @description Deepen color
 * @param {String} color Hex|Rgb|Rgba color or color keyword
 * @return {Number} Percent of Deepen (1-100)
 * @return {String|Boolean} Rgba color (Invalid input will return false)
 */
export function darken(color, percent = 0) {
  if (!color) {
    console.error("darken: Missing parameters!");

    return false;
  }

  let rgbaValue = getRgbaValue(color);

  if (!rgbaValue) return false;

  rgbaValue = rgbaValue
    .map((v, i) => (i === 3 ? v : v - Math.ceil(2.55 * percent)))
    .map(v => (v < 0 ? 0 : v));

  return getColorFromRgbValue(rgbaValue);
}

/**
 * @description Brighten color
 * @param {String} color Hex|Rgb|Rgba color or color keyword
 * @return {Number} Percent of brighten (1-100)
 * @return {String|Boolean} Rgba color (Invalid input will return false)
 */
export function lighten(color, percent = 0) {
  if (!color) {
    console.error("lighten: Missing parameters!");

    return false;
  }

  let rgbaValue = getRgbaValue(color);

  if (!rgbaValue) return false;

  rgbaValue = rgbaValue
    .map((v, i) => (i === 3 ? v : v + Math.ceil(2.55 * percent)))
    .map(v => (v > 255 ? 255 : v));

  return getColorFromRgbValue(rgbaValue);
}

/**
 * @description Adjust color opacity
 * @param {String} color   Hex|Rgb|Rgba color or color keyword
 * @param {Number} Percent of opacity
 * @return {String|Boolean} Rgba color (Invalid input will return false)
 */
export function fade(color, percent = 100) {
  if (!color) {
    console.error("fade: Missing parameters!");

    return false;
  }

  const rgbValue = getRgbValue(color);

  if (!rgbValue) return false;

  const rgbaValue = [...rgbValue, percent / 100];

  return getColorFromRgbValue(rgbaValue);
}

export function filterNonNumber(array) {
  return array.filter(n => typeof n === "number");
}

export function mulAdd(nums) {
  nums = filterNonNumber(nums);

  return nums.reduce((all, num) => all + num, 0);
}

export function mergeSameStackData(item, series) {
  const stack = item.stack;

  if (!stack) return [...item.data];

  const stacks = series.filter(({ stack: s }) => s === stack);

  const index = stacks.findIndex(({ data: d }) => d === item.data);

  const datas = stacks.splice(0, index + 1).map(({ data }) => data);

  const dataLength = datas[0].length;

  return new Array(dataLength)
    .fill(0)
    .map((foo, i) => mulAdd(datas.map(d => d[i])));
}

export function getTwoPointDistance(pointOne, pointTwo) {
  const minusX = Math.abs(pointOne[0] - pointTwo[0]);

  const minusY = Math.abs(pointOne[1] - pointTwo[1]);

  return Math.sqrt(minusX * minusX + minusY * minusY);
}

export function getLinearGradientColor(ctx, begin, end, color) {
  if (!ctx || !begin || !end || !color.length) return;

  let colors = color;

  typeof colors === "string" && (colors = [color, color]);

  const linearGradientColor = ctx.createLinearGradient(...begin, ...end);

  const colorGap = 1 / (colors.length - 1);

  colors.forEach((c, i) => linearGradientColor.addColorStop(colorGap * i, c));

  return linearGradientColor;
}

export function getPolylineLength(points) {
  const lineSegments = new Array(points.length - 1)
    .fill(0)
    .map((foo, i) => [points[i], points[i + 1]]);

  const lengths = lineSegments.map(item => getTwoPointDistance(...item));

  return mulAdd(lengths);
}

export function getPointToLineDistance(point, linePointOne, linePointTwo) {
  const a = getTwoPointDistance(point, linePointOne);
  const b = getTwoPointDistance(point, linePointTwo);
  const c = getTwoPointDistance(linePointOne, linePointTwo);

  return (
    (0.5 * Math.sqrt((a + b + c) * (a + b - c) * (a + c - b) * (b + c - a))) / c
  );
}

export function initNeedSeries(series, config, type) {
  series = series.filter(({ type: st }) => st === type);

  series = series.map(item => deepMerge(deepClone(config, true), item));

  return series.filter(({ show }) => show);
}

export function radianToAngle(radian) {
  return (radian / Math.PI) * 180;
}

export function randomExtend(minNum, maxNum) {
  if (arguments.length === 1) {
    return parseInt(Math.random() * minNum + 1, 10);
  } else {
    return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
  }
}

/**
 * @description Get the coordinates of the specified radian on the circle
 * @param {Number} x      Circle x coordinate
 * @param {Number} y      Circle y coordinate
 * @param {Number} radius Circle radius
 * @param {Number} radian Specfied radian
 * @return {Array} Postion of point
 */
 export function getCircleRadianPoint (x, y, radius, radian) {
  return [x + Math.cos(radian) * radius, y + Math.sin(radian) * radius]
}