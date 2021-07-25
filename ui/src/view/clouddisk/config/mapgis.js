export const VERSION = "10.5.4";

export function getMapGISUrl() {
  const http = window.localStorage.getItem("mapgis_clouddisk_http") || "http";
  const ip = window.localStorage.getItem("mapgis_clouddisk_ip");
  const socket = window.localStorage.getItem("mapgis_clouddisk_socket");
  let url = window.localStorage.getItem("mapgis_clouddisk_url");

  if (url) return url;

  let href = window.location.href;
  let pathname = window.location.pathname;
  if (ip !== null && socket !== null) {
    url = "" + http + "://" + ip + ":" + socket;
  } else {
    url = "" + href.substring(0, href.indexOf(pathname));
  }

  return url;
}

export function getWebSocketUrl(payload = {}) {
  let { client } = payload;
  const id = window.localStorage.getItem("mapgis_clouddisk_id");
  const ip = window.localStorage.getItem("mapgis_clouddisk_ip");
  const socket = window.localStorage.getItem("mapgis_clouddisk_socket");
  const token = getMapgisToken();
  // const url = 'ws://' + ip + ':' + socket + '/message/rest/websocket?Authorization=' + token
  let url;
  // let href = window.location.href
  let hostname = window.location.hostname;
  // let pathname = window.location.pathname
  let port = window.location.port;
  client =
    (client || "mapgis_ui_global_upload_websocket_id_") + Math.random() * 1000;
  // let protocol = window.location.protocol
  if (ip !== null && socket !== null) {
    url =
      "" +
      "ws://" +
      ip +
      ":" +
      socket +
      `/message/rest/websocket/${id}/${client}?Authorization=` +
      token;
  } else {
    url =
      "" +
      "ws://" +
      hostname +
      ":" +
      port +
      `/message/rest/websocket/${id}/${client}?Authorization=` +
      token;
  }
  return url;
}

export function getMapGISUploadUrl() {
  const upload = "/clouddisk/rest/file/uploader/chunk";
  const http = window.localStorage.getItem("mapgis_clouddisk_http") || "http";
  const ip = window.localStorage.getItem("mapgis_clouddisk_ip");
  const socket = window.localStorage.getItem("mapgis_clouddisk_socket");
  // const url = '' + http + '://' + ip + ':' + socket + upload
  let url;
  let href = window.location.href;
  let pathname = window.location.pathname;
  if (ip !== null && socket !== null) {
    url = "" + http + "://" + ip + ":" + socket + upload;
  } else {
    url = "" + href.substring(0, href.indexOf(pathname)) + upload;
  }
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

export function getMapUser() {
  const name = window.localStorage.getItem("mapgis_clouddisk_user_name") || "";
  const key = window.localStorage.getItem("mapgis_clouddisk_user_key") || "";
  const keep =
    window.localStorage.getItem("mapgis_clouddisk_user_keep") || true;

  return {
    name: name,
    key: key,
    keep: keep
  };
}

export function getMapgisPath(path) {
  const storePath = window.localStorage.getItem("mapgis_clouddisk_path");
  if (path) {
    return path;
  } else {
    return storePath;
  }
}

export function getMapgisEncryptPath(path) {
  const encryptPath = window.localStorage.getItem(
    "mapgis_clouddisk_encryptpath"
  );
  if (path) {
    return path;
  } else {
    return encryptPath;
  }
}

export function getDownloadPath(download) {
  const storePath = window.localStorage.getItem(
    "mapgis_clouddisk_download_path"
  );
  if (download) {
    return download;
  } else {
    return storePath;
  }
}

export function setDownloadPath(download) {
  download &&
    window.localStorage.setItem("mapgis_clouddisk_download_path", download);
  return download;
}
