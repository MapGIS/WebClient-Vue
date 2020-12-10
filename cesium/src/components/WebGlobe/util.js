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
