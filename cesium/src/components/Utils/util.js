import * as turf from "@turf/turf";

export const checkType = val =>
  Object.prototype.toString.call(val).slice(8, -1);

export const toKebabCase = str =>
  str
    .replace(new RegExp("[A-Z]", "g"), letter => `-${letter.toLowerCase()}`)
    .replace(new RegExp("^-"), "");
/**
 * 通过 class 名获取 Dom 元素。
 * @param {Array<Element>} htmlCollection Dom元素集合。
 * @param {String} className class 名称。
 */
export const getDocumentByClassName = (htmlCollection, className) => {
  let temp;
  const BreakException = {};
  try {
    Array.prototype.slice.call(htmlCollection).forEach(element => {
      if (element.className === className) {
        temp = element;
        throw BreakException;
      }
    });
  } catch (e) {
    if (e !== BreakException) throw e;
  }
  return temp;
};

/**
 * 判断传入的对象是否是方法。
 * @param {*} value
 * @returns {Boolean}
 */
export function isFunction(value) {
  return typeof value === "function";
}

/**
 * 是否有效数据
 * @param {*} v
 * @returns
 */
export function isDef(v) {
  return v !== undefined && v !== null;
}

/**
 * 校验数据的原始数据类型
 * @param {*} v
 * @returns {string}
 */
export function typeOf(v) {
  const _toString = Object.prototype.toString;
  let res;
  switch (_toString.call(v)) {
    case "[object Object]":
      res = "object";
      break;
    case "[object Array]":
      res = "array";
      break;
    case "[object Function]":
      res = "function";
      break;
    case "[object String]":
      res = "string";
      break;
    case "[object Number]":
      res = "number";
      break;
    case "[object Symbol]":
      res = "symbol";
      break;
    case "[object Undefined]":
      res = "undefined";
      break;
    case "[object Null]":
      res = "null";
      break;
    default:
      break;
  }
  return res;
}

/**
 * 是否空对象
 * @param {*} v
 * @returns {boolean}
 */
export function isEmptyObj(v) {
  return !isDef(v) || (typeOf(v, "object") && !Object.keys(v).length);
}

/**
 * 验证是否是经纬度。
 * @param {Number} longitude
 * @param {Number} latitude
 * @returns {Boolean}
 */
export function lnglatValidator(longitude, latitude) {
  // 经度，整数部分为0-180小数部分为0到6位
  //  const longreg = /^(-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,15})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,15}|180)$/
  const longreg = new RegExp(
    "^(-|\\+)?(((d|[1-9]d|1[0-7]d|0{1,3}).d{0,15})|(d|[1-9]d|1[0-7]d|0{1,3})|180.0{0,15}|180)$"
  );
  if (!longreg.test(longitude)) {
    return false;
  } // 纬度,整数部分为0-90小数部分为0到6位
  //  const latreg = /^(-|\+)?([0-8]?\d{1}\.\d{0,15}|90\.0{0,15}|[0-8]?\d{1}|90)$/
  const latreg = new RegExp(
    "^(-|\\+)?([0-8]?d{1}.d{0,15}|90.0{0,15}|[0-8]?d{1}|90)$"
  );
  if (!latreg.test(latitude)) {
    return false;
  }
  return true;
}

/**
 * 普通对象 {x: number, y: number } 转换为 Cesium.Cartesian2 对象
 * @param {Object} val
 * @returns {Object}
 */
export function makeCartesian2(val) {
  return val && new Cesium.Cartesian2(val.x, val.y);
}

/**
 * 普通对象 {x: number, y: number, z: number } 转换为 Cesium.Cartesian3 对象
 * @param {Object} val
 * @returns {Object}
 */
export function makeCartesian3(val) {
  if (val && Object.prototype.hasOwnProperty.call(val, "x")) {
    return new Cesium.Cartesian3(val.x, val.y, val.z);
  } else if (val && Object.prototype.hasOwnProperty.call(val, "lng")) {
    return Cesium.Cartesian3.fromDegrees(val.lng, val.lat, val.height);
  }
  return val;
}

/**
 * 普通数组 [lng, lat, height, ……，lng, lat, height] 转换为 Cesium.Cartesian3 数组
 * @param {Array} val
 * @returns {Array<Cartesian3>}
 */
export function makeCartesian3Array(vals) {
  if (vals && vals instanceof Array && vals[0] instanceof Cesium.Cartesian3) {
    return vals;
  }

  const coordinates = [];
  vals.forEach(item => {
    coordinates.push(item.lng);
    coordinates.push(item.lat);
    coordinates.push(item.height);
  });

  return coordinates.length >= 3
    ? Cesium.Cartesian3.fromDegreesArrayHeights(coordinates)
    : vals;
}

/**
 * 普通数组 [lng, lat, ……，lng, lat] 转换为 Cesium.Cartesian2 数组
 * @param {Array} vals
 * @returns {Array<Cartesian2>}
 */
export function makeCartesian2Array(vals) {
  const cartesian2Array = [];
  vals.forEach(item => {
    cartesian2Array.push(new Cesium.Cartesian2(item.x, item.y));
  });
  return cartesian2Array;
}

/**
 *
 * @param {Object} val
 */
export function makeQuaternion(val) {
  return val.x ? new Cesium.Quaternion(val.x, val.y, val.z, val.w) : val;
}

/**
 * 解析 HierarchyJson
 * @param {Object} val
 */
function parsePolygonHierarchyJson(val) {
  val.forEach(element => {
    element.positions = makeCartesian3Array(element.positions);
    if (element.holes) {
      parsePolygonHierarchyJson(element.holes);
    }
  });
}

/**
 * 普通数组或对象转 Cesium.PolygonHierarchy 对象。
 * @param {Object|Array} val
 */
export function makePolygonHierarchy(val) {
  if (val instanceof Array && val.length >= 3) {
    return new Cesium.PolygonHierarchy(makeCartesian3Array(val));
  }
  if (Cesium.defined(val.positions)) {
    val.positions = makeCartesian3Array(val.positions);
    parsePolygonHierarchyJson(val.holes);
  }

  return val;
}

/**
 * 普通对象 {near: number, nearValue: number, far: number, farValue: number} 转 Cesium.NearFarScalar 对象。
 * @param {Object} val
 * @returns {NearFarScalar}
 */
export function makeNearFarScalar(val) {
  return (
    val &&
    new Cesium.NearFarScalar(val.near, val.nearValue, val.far, val.farValue)
  );
}

/**
 * 普通对象 {near: number, far: number} 转 Cesium.DistanceDisplayCondition 对象。
 * @param {Object} val
 * @returns {DistanceDisplayCondition}
 */
export function makeDistanceDisplayCondition(val) {
  return val && new Cesium.DistanceDisplayCondition(val.near, val.far);
}

/**
 * 普通对象或数组 [r, g, b, a] 或字符串转 Cesium.Color 对象。
 * @param {String|Array|Object} val
 * @returns {Color}
 */
export function makeColor(val) {
  if (val instanceof Cesium.Color) {
    return val;
  } else if (val instanceof Array) {
    return new Cesium.Color(val[0], val[1], val[2], val[3]);
  } else if (typeof val === "string") {
    return Cesium.Color.fromCssColorString(val);
  }
  return val;
}

/**
 * 普通对象或数组 [r, g, b, a] 或字符串转 Material
 * @param {String|Array|Object} val
 */
export function makeMaterial(val) {
  // if (
  //   val instanceof Array ||
  //   (typeof val === 'string' && !/(.*)\.(jpg|bmp|gif|ico|pcx|jpeg|tif|png|raw|tga)$/.test(val))
  // ) {
  //   return makeColor(val)
  // }
  const regExp = new RegExp(
    "(.*)\\.(jpg|bmp|gif|ico|pcx|jpeg|tif|png|raw|tga)$"
  );
  if (val instanceof Array || (typeof val === "string" && !regExp.test(val))) {
    return makeColor(val);
  }
  // else if (val && val.hasOwnProperty('fabric')) {
  //   return new Cesium.Material({
  //     fabric: {
  //       type: 'Color',
  //       uniforms: {
  //         color: new Cesium.Color(1.0, 1.0, 0.0, 1.0)
  //       }
  //     }
  //   })
  // }
  return val;
}

/**
 * 普通对象 {west: number, south: number, east: number, north: number} 转 Cesium.Rectangle 对象。
 * @param {Object} val
 * @returns {Rectangle}
 */
export function makeRectangle(val) {
  // Entiy 的 rectangle 属性不能调用这个方法
  if (val instanceof Cesium.RectangleGraphics) {
    return val;
  }
  return (
    val &&
    Cesium.Rectangle.fromDegrees(val.west, val.south, val.east, val.north)
  );
}

/**
 * 普通对象 {x: number, y: number, width: number, height: number} 转 Cesium.BoundingRectangle 对象。
 * @param {Object} val
 * @returns {BoundingRectangle}
 */
export function makeBoundingRectangle(val) {
  return (
    val && new Cesium.BoundingRectangle(val.x, val.y, val.width, val.height)
  );
}

/**
 * 普通对象 {normal: number, distance: number} 转 Cesium.Plane 对象。
 * @param {Object} val
 * @returns {Plane}
 */
export function makePlane(val) {
  // Entiy 和 PlaneGraphics 都有个 plane 属性 要区别一下
  if (val instanceof Cesium.PlaneGraphics) {
    return val;
  }
  if (val) {
    Cesium.Cartesian3.normalize(makeCartesian3(val.normal), val.normal);
    return new Cesium.Plane(val.normal, val.distance);
  }
  return val;
}

/**
 * 普通对象转平移、旋转、缩放变换对象。
 * @param {*} val
 */
export function makeTranslationRotationScale(val) {
  return (
    val &&
    new Cesium.TranslationRotationScale(
      makeCartesian3(val.translation),
      makeQuaternion(val.rotation),
      makeCartesian3(val.scale)
    )
  );
}

export function makeOptions(val) {
  const cmpName = this.$options.name;
  switch (cmpName) {
    case "vc-datasource-geojson":
      const result = {};
      Object.assign(result, val);
      result &&
      result.markerColor &&
      (result.markerColor = makeColor(result.markerColor));
      result && result.stroke && (result.stroke = makeColor(result.stroke));
      result && result.fill && (result.fill = makeColor(result.fill));
      return result;
  }
  return val;
}

export function dirname(path) {
  if (typeof path !== "string") path = path + "";
  if (path.length === 0) return ".";
  var code = path.charCodeAt(0);
  var hasRoot = code === 47; /* / */
  var end = -1;
  var matchedSlash = true;
  for (var i = path.length - 1; i >= 1; --i) {
    code = path.charCodeAt(i);
    if (code === 47 /* / */) {
      if (!matchedSlash) {
        end = i;
        break;
      }
    } else {
      // We saw the first non-path separator
      matchedSlash = false;
    }
  }

  if (end === -1) return hasRoot ? "/" : ".";
  if (hasRoot && end === 1) {
    // return '//';
    // Backwards-compat fix:
    return "/";
  }
  return path.slice(0, end);
}

export function Platform() {
  var ua = navigator.userAgent;
  // var isWindowsPhone = /(?:Windows Phone)/.test(ua)
  const windowsPone = new RegExp("(?:Windows Phone)");
  var isWindowsPhone = windowsPone.test(ua);
  // var isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone
  const symbianOs = new RegExp("(?:SymbianOS)");
  var isSymbian = symbianOs.test(ua) || isWindowsPhone;
  // var isAndroid = /(?:Android)/.test(ua)
  const android = new RegExp("(?:Android)");
  var isAndroid = android.test(ua);
  // var isFireFox = /(?:Firefox)/.test(ua)
  const firefox = new RegExp("(?:Firefox)");
  var isFireFox = firefox.test(ua);
  // var isChrome = /(?:Chrome|CriOS)/.test(ua)
  const chrome = new RegExp("(?:Chrome|CriOS)");
  var isChrome = chrome.test(ua);

  // var isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua))
  const ipadOrplaybook = new RegExp("(?:iPad|PlayBook)");
  const mobile = new RegExp("(?:Mobile)");
  const tablet = new RegExp("(?:Tablet)");
  var isTablet =
    ipadOrplaybook.test(ua) ||
    (isAndroid && !mobile.test(ua)) ||
    (isFireFox && tablet.test(ua));
  // var isPhone = /(?:iPhone)/.test(ua) && !isTablet
  const iphone = new RegExp("(?:iPhone)");
  var isPhone = iphone.test(ua) && !isTablet;
  var isPc = !isPhone && !isAndroid && !isSymbian;
  return {
    isTablet: isTablet,
    isPhone: isPhone,
    isAndroid: isAndroid,
    isPc: isPc,
    isChrome: isChrome
  };
}

export function captureScreenshot(viewer, showSplitter = false) {
  const {when} = Cesium;
  const deferred = when.defer();
  const scene = viewer.scene;
  var removeCallback = scene.postRender.addEventListener(function () {
    removeCallback();
    try {
      const cesiumCanvas = viewer.scene.canvas;

      // If we're using the splitter, draw the split position as a vertical white line.
      let canvas = cesiumCanvas;
      // if (showSplitter) {
      //   canvas = document.createElement('canvas')
      //   canvas.width = cesiumCanvas.width
      //   canvas.height = cesiumCanvas.height

      //   const context = canvas.getContext('2d')
      //   context.drawImage(cesiumCanvas, 0, 0)

      //   const x = viewer.splitPosition * cesiumCanvas.width
      //   context.strokeStyle = this.terria.baseMapContrastColor
      //   context.beginPath()
      //   context.moveTo(x, 0)
      //   context.lineTo(x, cesiumCanvas.height)
      //   context.stroke()
      // }

      deferred.resolve(canvas.toDataURL("image/png"));
    } catch (e) {
      deferred.reject(e);
    }
  }, this);

  scene.render(viewer.clock.currentTime);

  return deferred.promise;
}

export function getAllAttribution(viewer) {
  const credits = viewer.scene.frameState.creditDisplay._currentFrameCredits.screenCredits.values.concat(
    viewer.scene.frameState.creditDisplay._currentFrameCredits.lightboxCredits
      .values
  );
  return credits.map(credit => credit.html);
}

/**
 * 取得Cesium、vueCesium或webGlobe对象，如果有注入就用注入，没有就用window上的
 * @param vm Object 组件的this对象
 * @param name String 对象名称
 * */
export function getCesiumBaseObject(vm, name) {
  let baseObject = vm[name];
  if (!baseObject) {
    baseObject = window[name];
    if (!baseObject) {
      throw new Error("未找到可用的" + name + "对象！");
    }
  }
  return baseObject;
}

/**
 * 获取数组最后一个元素
 * @param {array} array
 * @returns  元素
 */
export function last(array) {
  const length = array == null ? 0 : array.length;
  return length ? array[length - 1] : undefined;
}

/**
 * 随机生成一个guid
 * @returns {string}
 */
export const newGuid = function () {
  let guid = "";
  for (let i = 1; i <= 32; i++) {
    let n = Math.floor(Math.random() * 16.0).toString(16);
    guid += n;
    if (i === 8 || i === 12 || i === 16 || i === 20) {
      guid += "-";
    }
  }
  return guid;
};

/**
 * @description 生成UUID字符串
 */
export function uuid() {
  let d = new Date().getTime();
  if (window.performance && typeof window.performance.now === "function") {
    d += performance.now();
  }
  const UuidStr = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    // tslint:disable-next-line: no-bitwise
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    // tslint:disable-next-line: no-bitwise
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
  return UuidStr;
}

/**
 * @description 获取当前相机视角
 * @param viewer Cesium的viewer对象
 * @return 相机视角对象
 */
export function getCamera(viewer) {
  let camera = {
    positionCartographic: {}
  };
  camera.positionCartographic.height =
    viewer.camera.positionCartographic.height;
  camera.positionCartographic.longitude =
    viewer.camera.positionCartographic.longitude;
  camera.positionCartographic.latitude =
    viewer.camera.positionCartographic.latitude;
  camera.heading = viewer.scene.camera.heading;
  camera.pitch = viewer.scene.camera.pitch;
  camera.roll = viewer.scene.camera.roll;
  return camera;
}

export function getPolygonSamplePoints(options) {
  options = options || {};
  let {positions} = options;
  let {step} = options;
  if (!positions || !step) return;
  let line = turf.lineString(positions);
  let bbox = turf.bbox(line);
  let bboxPolygon = turf.bboxPolygon(bbox);
  let {coordinates} = bboxPolygon.geometry;
  let points = coordinates[0];
  let width = points[1][0] - points[0][0];
  let height = points[3][1] - points[0][1];
  let widthStep = width / step;
  let heightStep = height / step;
  let ps = [],result=[], startP = [points[0][0], points[0][1]];
  for (let i = 0; i < step; i++) {
    startP[0] = points[0][0];
    for (let j = 0; j < step; j++) {
      startP[0] += widthStep;
      ps.push([startP[0], startP[1]]);
    }
    startP[1] += heightStep;
  }
  let pArr = [];
  for (let i = 0; i < positions.length; i++) {
    pArr.push(positions[i]);
  }
  let polygon = turf.polygon([pArr]);
  for (let i = 0; i < ps.length; i++) {
    let point = turf.point([ps[i][0], ps[i][1]]);
    let flag = turf.booleanPointInPolygon(point, polygon);
    if (flag) {
      result.push(ps[i]);
    }
  }
  return result;
}
