export function flyTo(globeView, webGlobe) {
  webGlobe.viewer.camera.flyTo(globeView);
}

export function flyToEx(globeView, webGlobe) {
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

  webGlobe.viewer.camera.flyToEx({
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
export function colorToCesiumColor(color, webGlobe) {
  let cesiumColor;
  if (color.includes("rgb")) {
    // 如果是rgb或者rgba
    const a = color.split("(")[1].split(")")[0];
    const arr = a.split(",");
    const cesiumRed = Number((Number(arr[0]) / 255).toFixed(2));
    const cesiumGreen = Number((Number(arr[1]) / 255).toFixed(2));
    const cesiumBlue = Number((Number(arr[2]) / 255).toFixed(2));
    const cesiumAlpha = Number(arr[3] ? arr[3] : 1);
    cesiumColor = webGlobe.getColor(
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
export function getCenterPosition(webGlobe) {
  const lnglat = getCartographic(webGlobe);
  if (lnglat) {
    const { longitude, latitude } = lnglat;
    const pi = Math.PI;
    const lng = (longitude * 180) / pi;
    const lat = (latitude * 180) / pi;
    const height = getCameraHeight(webGlobe);
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
export function getCartographic(webGlobe) {
  console.log("Cesium", Cesium);
  const pickEllipsoid = getPickEllipsoid(webGlobe);
  return pickEllipsoid
    ? Cesium.Ellipsoid.WGS84.cartesianToCartographic(pickEllipsoid)
    : null;
}

/**
 * 获取椭球坐标
 * @returns height
 */
export function getPickEllipsoid(webGlobe) {
  const { w, h } = getWebGlobeCanvasSize(webGlobe);
  return webGlobe.viewer.camera.pickEllipsoid(
    new Cesium.Cartesian2(w / 2, h / 2)
  );
}

/**
 * 获取三维场景画布高宽
 * @returns {w:number; h: number}
 */
export function getWebGlobeCanvasSize(webGlobe) {
  const { canvas } = webGlobe.viewer;
  return {
    w: canvas.clientWidth,
    h: canvas.clientHeight
  };
}

/**
 * 获取camera高度
 * @returns height
 */
export function getCameraHeight(webGlobe) {
  const { viewer } = webGlobe;
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
export function isLogarithmicDepthBufferEnable(webGlobe) {
  return webGlobe.viewer.scene.logarithmicDepthBuffer;
}

/**
 * 设置是否开启对数深度缓存区
 * @param {*} isEnable true:开启，false:关闭
 */
export function setLogarithmicDepthBufferEnable(isEnable, webGlobe) {
  webGlobe.viewer.scene.logarithmicDepthBuffer = isEnable;
}

/**
 * 判断当前是否开启了深度检测
 * @returns true:开启,false:关闭
 */
export function isDepthTestAgainstTerrainEnable(webGlobe) {
  return webGlobe.viewer.scene.globe.depthTestAgainstTerrain;
}

/**
 * 设置是否开启深度检测
 * @param {*} isEnable true:开启，false:关闭
 */
export function setDepthTestAgainstTerrainEnable(isEnable, webGlobe) {
  webGlobe.viewer.scene.globe.depthTestAgainstTerrain = isEnable;
}

/**
 * 判断当前是否开启了光照
 * @returns true:开启,false:关闭
 */
export function isEnableLighting(webGlobe) {
  return webGlobe.viewer.scene.globe.enableLighting;
}

/**
 * 设置光照
 * @param {*} isEnable true:开启，false:关闭
 */
export function setEnableLighting(isEnable, webGlobe) {
  webGlobe.viewer.scene.globe.depthTestAgainstTerrain = isEnable;
}

/**
 * 获取光照对象
 * @returns brightness对象
 */
export function getBrightness(webGlobe) {
  return webGlobe.viewer.scene.brightness;
}

/**
 * 获取光照对象的开启状态和Uniforms的brightness参数
 * @returns this.webGlobe.viewer.scene.brightness的enabled和uniforms.brightness值
 */
export function getBrightnessStatusAndUniformsBrightness(webGlobe) {
  const { enabled, uniforms } = webGlobe.viewer.scene.brightness;
  const { brightness } = uniforms;
  return { enabled, brightness };
}

/**
 * 设置光照对象的开启状态和Uniforms的brightness参数
 * @param {*} { enabled, brightness } this.webGlobe.viewer.scene.brightness的enabled和uniforms.brightness值组成的数组
 */
export function setBrightnessStatusAndUniformsBrightness(
  { enabled, brightness },
  webGlobe
) {
  const sceneBrightness = webGlobe.viewer.scene.brightness;
  sceneBrightness.enabled = enabled;
  sceneBrightness.uniforms.brightness = brightness;
}
