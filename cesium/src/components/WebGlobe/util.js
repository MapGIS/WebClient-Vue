export function flyTo(globeView, viewer) {
  viewer.camera.flyTo(globeView);
}

export function flyToEx(globeView, viewer) {
  let { destination, orientation } = globeView;
  let { x, y, z } = destination;
  let { heading, pitch } = orientation;
  let center,
    range = 1.0;

  if (x > 180 || x < -180 || y > 180 || y < -180) {
    center = new Cesium.Cartesian3(x, y, z);
  } else {
    center = new Cesium.Cartesian3.fromDegrees(x, y, z);
  }

  viewer.camera.flyToEx({
    target: center,
    offset: new Cesium.HeadingPitchRange(heading, pitch, range)
  });
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

/**
 * RGB/RGBA转Cesium内部颜色值
 * @param color rgb/rgba字符串
 * @returns {*}
 */
export function colorToCesiumColor(color) {
  let cesiumColor;
  if (color.includes("rgb")) {
    // 如果是rgb或者rgba
    const a = color.split("(")[1].split(")")[0];
    const arr = a.split(",");
    const cesiumRed = Number((Number(arr[0]) / 255).toFixed(2));
    const cesiumGreen = Number((Number(arr[1]) / 255).toFixed(2));
    const cesiumBlue = Number((Number(arr[2]) / 255).toFixed(2));
    const cesiumAlpha = Number(arr[3] ? arr[3] : 1);
    cesiumColor = new Cesium.Color(
      cesiumRed,
      cesiumGreen,
      cesiumBlue,
      cesiumAlpha
    );
  }
  return cesiumColor;
}

/**
 * 获取当前摄像机的位置
 * @returns {null|{lng: number, lat: number, height: *}}
 */
export function getCenterPosition(viewer) {
  const lnglat = getCartographic(viewer);
  if (lnglat) {
    const { longitude, latitude } = lnglat;
    const pi = Math.PI;
    const lng = (longitude * 180) / pi;
    const lat = (latitude * 180) / pi;
    const height = getCameraHeight(viewer);
    return {
      lng,
      lat,
      height
    };
  }
  return null;
}

/**
 * 获取地理坐标
 * @returns 地理坐标
 */
export function getCartographic(viewer) {
  // console.log("Cesium", Cesium);
  const pickEllipsoid = getPickEllipsoid(viewer);
  return pickEllipsoid
    ? Cesium.Ellipsoid.WGS84.cartesianToCartographic(pickEllipsoid)
    : null;
}

/**
 * 获取椭球坐标
 * @returns height
 */
export function getPickEllipsoid(viewer) {
  const { w, h } = getWebGlobeCanvasSize(viewer);
  return viewer.camera.pickEllipsoid(new Cesium.Cartesian2(w / 2, h / 2));
}

/**
 * 获取三维场景画布高宽
 * @returns {w:number; h: number}
 */
export function getWebGlobeCanvasSize(viewer) {
  const { canvas } = viewer;
  return {
    w: canvas.clientWidth,
    h: canvas.clientHeight
  };
}

/**
 * 获取camera高度
 * @returns height
 */
export function getCameraHeight(viewer) {
  return viewer
    ? viewer.scene.globe.ellipsoid.cartesianToCartographic(
        viewer.camera.position
      ).height
    : 0;
}

/**
 * 判断当前是否开启了对数深度缓存区
 * @returns true:开启,false:关闭
 */
export function isLogarithmicDepthBufferEnable(viewer) {
  return viewer.scene.logarithmicDepthBuffer;
}

/**
 * 判断当前浏览器是否支持开启对数深度缓存区
 * @returns true:支持,false:不支持
 */
export function isLogarithmicDepthBufferSupport() {
  if(navigator.userAgent.indexOf("Linux") > 0 && navigator.userAgent.indexOf("Firefox") > 0){
    return false
  } else {
    return true
  }
}

/**
 * 设置是否开启对数深度缓存区
 * @param {*} isEnable true:开启，false:关闭
 */
export function setLogarithmicDepthBufferEnable(isEnable, viewer) {
  viewer.scene.logarithmicDepthBuffer = isEnable;
}

/**
 * 判断当前是否开启了深度检测
 * @returns true:开启,false:关闭
 */
export function isDepthTestAgainstTerrainEnable(viewer) {
  return viewer.scene.globe.depthTestAgainstTerrain;
}

/**
 * 设置是否开启深度检测
 * @param {*} isEnable true:开启，false:关闭
 */
export function setDepthTestAgainstTerrainEnable(isEnable, viewer) {
  viewer.scene.globe.depthTestAgainstTerrain = isEnable;
}

/**
 * 判断当前是否开启了光照
 * @returns true:开启,false:关闭
 */
export function isEnableLighting(viewer) {
  return viewer.scene.globe.enableLighting;
}

/**
 * 设置光照
 * @param {*} isEnable true:开启，false:关闭
 */
export function setEnableLighting(isEnable, viewer) {
  viewer.scene.globe.enableLighting = isEnable;
}

/**
 * 获取光照对象
 * @returns brightness对象
 */
export function getBrightness(viewer) {
  return viewer.scene.brightness;
}

/**
 * 获取光照对象的开启状态和Uniforms的brightness参数
 * @returns this.webGlobe.viewer.scene.brightness的enabled和uniforms.brightness值
 */
export function getBrightnessStatusAndUniformsBrightness(viewer) {
  const { enabled, uniforms } = viewer.scene.brightness;
  const { brightness } = uniforms;
  return { enabled, brightness };
}

/**
 * 设置光照对象的开启状态和Uniforms的brightness参数
 * @param {*} { enabled, brightness } this.webGlobe.viewer.scene.brightness的enabled和uniforms.brightness值组成的数组
 */
export function setBrightnessStatusAndUniformsBrightness(
  { enabled, brightness },
  viewer
) {
  const sceneBrightness = viewer.scene.brightness;
  sceneBrightness.enabled = enabled;
  sceneBrightness.uniforms.brightness = brightness;
}

/**
 * 设置探照灯效果
 * @param {Object} light 探照灯参数对象
 */
export function setLight(light, viewer) {
  viewer.scene.light = light;
}

/**
 * 获取light对象
 * @returns light对象
 */
export function getLight(viewer) {
  return viewer.scene.light;
}

/**
 * 设置DynamicAtmosphereLighting值
 * @param {Boolean} dynamicAtmosphereLighting
 */
export function setDynamicAtmosphereLighting(
  dynamicAtmosphereLighting,
  viewer
) {
  viewer.scene.globe.dynamicAtmosphereLighting = dynamicAtmosphereLighting;
}

/**
 * 获取DynamicAtmosphereLighting值
 * @returns DynamicAtmosphereLighting值
 */
export function getDynamicAtmosphereLighting(viewer) {
  return viewer.scene.globe.dynamicAtmosphereLighting;
}

/**
 * 设置DynamicAtmosphereLightingFromSun值
 * @param {Boolean} DynamicAtmosphereLightingFromSun
 */
export function setDynamicAtmosphereLightingFromSun(
  dynamicAtmosphereLightingFromSun,
  viewer
) {
  viewer.scene.globe.dynamicAtmosphereLightingFromSun = dynamicAtmosphereLightingFromSun;
}

/**
 * 获取DynamicAtmosphereLightingFromSun值
 * @returns DynamicAtmosphereLightingFromSun值
 */
export function getDynamicAtmosphereLightingFromSun(viewer) {
  return viewer.scene.globe.dynamicAtmosphereLightingFromSun;
}
