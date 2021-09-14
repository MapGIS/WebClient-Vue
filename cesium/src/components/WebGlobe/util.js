export function flyTo(globeView, webGlobe) {
    webGlobe.viewer.camera.flyTo(globeView);
}

export function flyToEx(globeView, webGlobe) {
    let {destination, orientation} = globeView;
    let {x, y, z} = destination;
    let {heading, pitch} = orientation;
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
export function colorToCesiumColor(color,webGlobe) {
    let cesiumColor
    if (color.includes('rgb')) {
        // 如果是rgb或者rgba
        const a = color.split('(')[1].split(')')[0]
        const arr = a.split(',')
        const cesiumRed = Number((Number(arr[0]) / 255).toFixed(2))
        const cesiumGreen = Number((Number(arr[1]) / 255).toFixed(2))
        const cesiumBlue = Number((Number(arr[2]) / 255).toFixed(2))
        const cesiumAlpha = Number(arr[3] ? arr[3] : 1)
        cesiumColor = webGlobe.getColor(
            cesiumRed,
            cesiumGreen,
            cesiumBlue,
            cesiumAlpha
        )
    }
    return cesiumColor
}

/**
 * 获取当前摄像机的位置
 * @returns {null|{lng: number, lat: number, height: *}}
 */
export function getCenterPosition(webGlobe) {
    const lnglat = getCartographic(webGlobe);
    if (lnglat) {
        const {longitude, latitude} = lnglat
        const pi = Math.PI
        const lng = (longitude * 180) / pi
        const lat = (latitude * 180) / pi
        const height = getCameraHeight(webGlobe);
        return {
            lng,
            lat,
            height
        }
    }
    return null;
}


/**
 * 获取地理坐标
 * @returns 地理坐标
 */
export function getCartographic(webGlobe) {
    console.log("Cesium",Cesium);
    const pickEllipsoid = getPickEllipsoid(webGlobe)
    return pickEllipsoid
        ? Cesium.Ellipsoid.WGS84.cartesianToCartographic(pickEllipsoid)
        : null
}


/**
 * 获取椭球坐标
 * @returns height
 */
export function getPickEllipsoid(webGlobe) {
    const {w, h} = getWebGlobeCanvasSize(webGlobe);
    return webGlobe.viewer.camera.pickEllipsoid(
        new Cesium.Cartesian2(w / 2, h / 2)
    )
}


/**
 * 获取三维场景画布高宽
 * @returns {w:number; h: number}
 */
export function getWebGlobeCanvasSize(webGlobe) {
    const {canvas} = webGlobe.viewer;
    return {
        w: canvas.clientWidth,
        h: canvas.clientHeight
    }
}

/**
 * 获取camera高度
 * @returns height
 */
export function getCameraHeight(webGlobe) {
    const {viewer} = webGlobe;
    return viewer
        ? viewer.scene.globe.ellipsoid.cartesianToCartographic(
            viewer.camera.position
        ).height
        : 0
}




