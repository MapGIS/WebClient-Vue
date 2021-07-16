export function getMapGISUrl() {
  const url = window.localStorage.getItem("mapgis_clouddisk_url");
  return url;
}

export function getMapgisToken(token) {
  const storeToken = window.localStorage.getItem("mapgis_clouddisk_token");
  if (token) {
    const trueToken = token.split("Bearer ");
    if (trueToken.length <= 1) return storeToken;
    return trueToken[1] || storeToken;
  } else {
    return storeToken;
  }
}

export function getMapgisPath(path) {
  const storePath = window.localStorage.getItem("mapgis_clouddisk_path");
  if (path) {
    return path;
  } else {
    return storePath;
  }
}
