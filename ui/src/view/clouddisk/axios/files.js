import API from "./API";
import md5 from "js-md5";

import { getMapGISUrl, getMapgisToken, getMapgisPath } from "../config/mapgis";

export function dirnavigation(folderDir) {
  const api = new API();
  const url = getMapGISUrl();
  const token = getMapgisToken();
  // const path = getMapgisPath()
  folderDir = folderDir === "" ? "-1" : folderDir;
  folderDir = folderDir || getMapgisPath();

  api.setBaseUrl(url);
  api.setAuthorization(token);
  return api.get("/clouddisk/rest/file/dirnavigation?folderDir=" + folderDir);
}

export function createfolder(folderDir) {
  const api = new API();
  const url = getMapGISUrl();
  const token = getMapgisToken();

  api.setAuthorization(token);
  api.setContentType("application/json");

  /* return axios({
    method: "post",
    data: {
      folderDir: folderDir
    },
    headers: {
      Authorization: token,
      "Content-Type": "application/json"
    },
    url: url + "/clouddisk/rest/file/createfolder"
  }); */
}

// 重命名
export function renameFile(formdata) {
  console.log(formdata.newFileName);
  const url = getMapGISUrl();
  const api = new API();
  const token = getMapgisToken();

  api.setBaseUrl(url);
  api.setAuthorization(token);
  api.setContentType("application/x-www-form-urlencoded");
  return api.post(url + "/clouddisk/rest/file/rename", formdata);
}

// 彻底删除文件(夹)
export function deleteFile(formdata) {
  const url = getMapGISUrl();
  const api = new API();
  const token = getMapgisToken();

  api.setBaseUrl(url);
  api.setAuthorization(token);
  api.setContentType("application/x-www-form-urlencoded");
  return api.post(url + "/clouddisk/rest/file/deleteForce", formdata);
}
// 获取文件(文件夹)资源属性
export function attributes(srcUrl, isFolder) {
  const url = getMapGISUrl();
  const api = new API();
  const token = getMapgisToken();
  api.setBaseUrl(url);
  api.setAuthorization(token);
  return api.get("/clouddisk/rest/file/attribute", {
    srcUrl: srcUrl,
    isFolder: isFolder
  });
}

/* export function getFilesByUser(user) {
    return api.get('user/user/download/files.json');
} */
// 枚举组织结构_中地
export function getFilesByOrganization(pGroupId) {
  const url = getMapGISUrl();
  const api = new API();
  const token = getMapgisToken();
  api.setBaseUrl(url);
  api.setAuthorization(token);
  const group = "pGroupId=" + (pGroupId || -1);
  return api.get("/clouddisk/rest/userGroups?" + group);
}

// 枚举组织结构_第三方
export function getOrganization() {
  const url = getMapGISUrl();
  const api = new API();
  const token = getMapgisToken();
  api.setBaseUrl(url);
  api.setAuthorization(token);
  let otherToken = window.localStorage.getItem("clouddisk_sz_token") || "qwer";
  // const group = 'pGroupId=' + (pGroupId || -1)
  return api.get("/clouddisk/rest/userGroups/third?token=" + otherToken);
}

// 获取组织下面的用户列表_第三方
export function getUsersByOrganization(groupId) {
  const url = getMapGISUrl();
  const api = new API();
  const token = getMapgisToken();
  api.setBaseUrl(url);
  api.setAuthorization(token);
  let otherToken = window.localStorage.getItem("clouddisk_sz_token") || "qwer";
  return api.get(
    "/clouddisk/rest/userGroups/users/third?groupId=" +
      groupId +
      "&token=" +
      otherToken
  );
}

// 合并文件
export function mergeSimpleUpload(folderDir) {
  const url = getMapGISUrl();
  const api = new API();
  const token = getMapgisToken();
  api.setBaseUrl(url);
  api.setAuthorization(token);
  api.setContentType("application/x-www-form-urlencoded");
  return api.post(url + "/clouddisk/rest/file/uploader/mergeFile", folderDir);
  // return api.post(url + '/clouddisk/rest/file/uploader/mergeFile?folderDir=' +
  //   folderDir.folderDir + '&totalSize=' + folderDir.totalSize + '&type=' + folderDir.type +
  //   '&identifier=' + folderDir.identifier + '&filename=' + folderDir.filename +
  //   '&prelocation=' + folderDir.prelocation)
}

// 复制
export function copyFile(srcUrl) {
  const url = getMapGISUrl();
  const api = new API();
  const token = getMapgisToken();
  api.setBaseUrl(url);
  api.setAuthorization(token);
  api.setContentType("application/x-www-form-urlencoded");
  return api.post(url + "/clouddisk/rest/file/copy", srcUrl);
}

// 剪切
export function cutFile(srcUrl) {
  const url = getMapGISUrl();
  const api = new API();
  const token = getMapgisToken();
  api.setBaseUrl(url);
  api.setAuthorization(token);
  api.setContentType("application/x-www-form-urlencoded");
  return api.post(url + "/clouddisk/rest/file/cut", srcUrl);
}

// 按条件获取文件资源列表
export function getFileByFactor(folderDir, extCategorys) {
  const url = getMapGISUrl();
  const api = new API();
  const token = getMapgisToken();
  api.setBaseUrl(url);
  api.setAuthorization(token);
  const isCate = !!extCategorys;

  if (!isCate) {
    const base = url + "/clouddisk/rest/file/search?folderDir=" + folderDir;
    return api.get(base);
  }
  return api.get(url + "/clouddisk/rest/file/search", {
    folderDir: folderDir,
    extCategorys: extCategorys
  });
}

// 获取保密文件
export function getSecrecyFile(folderDir) {
  const url = getMapGISUrl();
  const api = new API();
  const token = getMapgisToken();
  api.setBaseUrl(url);
  api.setAuthorization(token);
  return api.get(url + "/clouddisk/rest/file/dirnavigation/encrypt", {
    folderDir: folderDir
  });
}
// 获取回收站文件资源
export function getFileByRecycle(folderDir) {
  const url = getMapGISUrl();
  const api = new API();
  const token = getMapgisToken();
  api.setBaseUrl(url);
  api.setAuthorization(token);
  return api.get(url + "/clouddisk/rest/file/dirnavigation/recycle", {
    folderDir: folderDir
  });
}
// 移动文件到回收站
export function moveFilesToRecycle(formdata) {
  const url = getMapGISUrl();
  const api = new API();
  const token = getMapgisToken();

  api.setBaseUrl(url);
  api.setAuthorization(token);
  api.setContentType("application/x-www-form-urlencoded");
  return api.post(url + "/clouddisk/rest/file/moverecycle", formdata);
}

// 加密文件
export function encryptFile(formdata) {
  const url = getMapGISUrl();
  const api = new API();
  const token = getMapgisToken();

  api.setBaseUrl(url);
  api.setAuthorization(token);
  api.setContentType("application/x-www-form-urlencoded");
  return api.post(url + "/clouddisk/rest/file/encrypt", formdata);
}
// 解密文件
export function decipherFile(formdata) {
  const url = getMapGISUrl();
  const api = new API();
  const token = getMapgisToken();

  api.setBaseUrl(url);
  api.setAuthorization(token);
  api.setContentType("application/x-www-form-urlencoded");
  return api.post(url + "/clouddisk/rest/file/deciphering", formdata);
}
// 恢复文件资源从回收站
export function recoveFileFromTrash(formdata) {
  const url = getMapGISUrl();
  const api = new API();
  const token = getMapgisToken();

  api.setBaseUrl(url);
  api.setAuthorization(token);
  api.setContentType("application/x-www-form-urlencoded");
  return api.post(url + "/clouddisk/rest/file/resumerecycle", formdata);
}

// 下载文件夹
export function getFileDownloadFileUrl(srcUrl) {
  const url =
    getMapGISUrl() +
    "/clouddisk/rest/file/download?isFolder=true&srcUrl=" +
    srcUrl;
  return url;
}
// 下载文件
export function getFileDownloadUrl(srcUrl) {
  const url = getMapGISUrl() + "/clouddisk/rest/file/download?srcUrl=" + srcUrl;
  return url;
}
// 下载客户端
export function getDownloadExeUri(platfrom = "win") {
  let fix = "/clouddisk/rest/system/download/soft/" + platfrom;
  let prefix = platfrom === "win" ? ".exe" : ".mac";
  let name = "中地云盘" + prefix;
  const url = getMapGISUrl() + fix;
  return { url: url, name: name };
}
/**
 * @description 针对web端header里面携带auth的问题进行对应的auth移动到get的明码请求地址中
 * @param {String} srcUrl 请求地址
 * @param {Boolean} isFolder 是否是文件夹
 */
export function getFileDownloadUrlWithAuth(srcUrl, isFolder) {
  isFolder = isFolder || false;
  const token = getMapgisToken();
  const url =
    getMapGISUrl() +
    "/clouddisk/rest/file/download?isFolder=" +
    isFolder +
    "&srcUrl=" +
    srcUrl +
    "&Authorization=" +
    token;
  return url;
}

// 获取预览文件url
export function getFilePreviewUrlWithAuth(file) {
  const token = getMapgisToken();

  let fileUrl = encodeURIComponent(file.url);
  let fileExt = file.ext;
  let fileTitle = md5(fileUrl);
  // let fileTitle = 'MapGISCloudDisk服务接口-201907-v1.0'
  let index = fileExt.indexOf(".");
  fileExt = index < 0 ? "." + fileExt : fileExt;

  let previewUrl = getMapGISUrl() + "/onlineview/rest/onlinePreview?url=";
  let urlaaa =
    getMapGISUrl() +
    "/clouddisk/rest/file/download?isFolder=false&srcUrl=" +
    fileUrl;
  let urlbbb = "&Authorization=" + token;
  let urlccc = "&fullfilename=" + fileTitle + fileExt;
  let urlddd = urlaaa + urlbbb + urlccc;
  let urleee = encodeURIComponent(urlddd);
  let url = previewUrl + urleee;

  return url;
}

// 获取工程样式文件
export function downloadStyle(srcUrl) {
  const url = getMapGISUrl();
  const api = new API();
  const token = getMapgisToken();

  api.setBaseUrl(url);
  api.setAuthorization(token);
  api.setContentType("application/x-www-form-urlencoded");
  return api.get(url + "/clouddisk/rest/file/download", { srcUrl: srcUrl });
}

/**
 * 工程保存接口
 * @param {*} folderDir 文件保存的全路径
 * @param {*} fileName 文件全名，带后缀.style
 * @param {*} identifier 文件唯一标志，一般为文件md5，需要和上传md5一致
 * @example http://192.168.80.107:9084/clouddisk/rest/file/project/save?
 * folderDir=31893a07-64fa-401d-8442-205453d7c33c/20200325/
 * &identifier=31893a07-64fa-401d-8442-205453d7c332&fileName=test.style
 */
export function getSaveStyleUrl(folderDir, fileName, identifier) {
  const Authorization = getMapgisToken();
  const url =
    getMapGISUrl() +
    "/clouddisk/rest/file/project/save?" +
    "folderDir=" +
    folderDir +
    "&fileName=" +
    fileName +
    "&Authorization=" +
    Authorization; // +
  // '&identifier=' + identifier
  return url;
}

// 保存工程文件的Json格式
export function saveJsonFile(folderDir, fileName, fileAttribute, data) {
  const url = getMapGISUrl();
  const api = new API();
  const token = getMapgisToken();
  let identifier = md5(folderDir + "/" + fileName);

  api.setBaseUrl(url);
  api.setAuthorization(token);
  api.setContentType("application/json");
  api.setTransformRequest(function(data) {
    let json = JSON.stringify(data);
    return json;
  });
  return api.post(
    url +
      "/clouddisk/rest/file/project/save?" +
      "autoCreateDirs=" +
      true +
      "&folderDir=" +
      folderDir +
      "&fileName=" +
      fileName +
      "&attribute=" +
      fileAttribute +
      "&identifier=" +
      identifier,
    data
  );
}

// 导入二维矢量数据
export function importVector(formdata) {
  const url = getMapGISUrl();
  const api = new API();
  const token = getMapgisToken();

  api.setBaseUrl(url);
  api.setAuthorization(token);
  api.setContentType("application/x-www-form-urlencoded");
  return api.post(url + "/clouddisk/rest/tools/vector/import", formdata);
}

/**
 * 导出二维矢量数据到云盘
 * @param {*} convertType 转换类型  "wt"（MapGIS67格式），"shp"，"json"
 * @param {*} srcUrl 资源URL源地址，只支持显示为已导入的GIS数据
 * @param {*} destPath 资源URL目标路径
 * @param {*} destFileName 资源URL目标名称
 */
export function exportVector(convertType, srcUrl, destPath, destFileName) {
  // console.warn('接口', convertType, srcUrl, destPath, destFileName)
  const url = getMapGISUrl();
  const api = new API();
  const token = getMapgisToken();

  api.setBaseUrl(url);
  api.setAuthorization(token);
  return api.get(
    url +
      "/clouddisk/rest/tools/vector/export?convertType=" +
      convertType +
      "&srcUrl=" +
      srcUrl +
      "&destPath=" +
      destPath +
      "&destFileName=" +
      destFileName
  );
}

// 获取外部业务数据表的元数据
export function getMetadata(srcUrl) {
  const url = getMapGISUrl();
  const api = new API();
  const token = getMapgisToken();

  api.setBaseUrl(url);
  api.setAuthorization(token);
  return api.get(
    url + "/clouddisk/rest/tools/dataset/oracle/schema?srcUrl=" + srcUrl
  );
}

// 获取外部业务数据表的表格数据
export function getTableData(formdata) {
  const url = getMapGISUrl();
  const api = new API();
  const token = getMapgisToken();

  api.setBaseUrl(url);
  api.setAuthorization(token);
  return api.get(url + "/clouddisk/rest/tools/dataset/oracle/query", formdata);
}

// 获取外部业务数据表的表格数据的导出地址
export function exportTableData(formdata) {
  let url =
    getMapGISUrl() +
    "/clouddisk/rest/tools/dataset/oracle/export?fields=" +
    formdata.fields +
    "&srcUrl=" +
    formdata.srcUrl;
  return url;
}

// 获取pg数据属性预览的属性表的元数据
export function getPGMetadata(dataStoreUrl, path, name, sref) {
  const api = new API();
  if (sref) {
    return api.get(
      dataStoreUrl +
        "/datastore/rest/dataset/pg/schema" +
        path +
        "?tableNames=" +
        name +
        "&sref=" +
        sref
    );
  } else {
    return api.get(
      dataStoreUrl +
        "/datastore/rest/dataset/pg/schema" +
        path +
        "?tableNames=" +
        name
    );
  }
}

// 获取pg数据属性预览的属性表的表格数据
export function getPGTableData(dataStoreUrl, path, formdata) {
  const api = new API();
  return api.get(
    dataStoreUrl + "/datastore/rest/dataset/pg/query" + path,
    formdata
  );
}

// 新接口用于获取空间数据的元数据及图形边界（可对接本地或外部的空间数据）
export function getGeoMetadata(gdbp, epsg) {
  const url = getMapGISUrl();
  const api = new API();
  const token = getMapgisToken();

  api.setBaseUrl(url);
  api.setAuthorization(token);
  if (epsg) {
    return api.get(
      url +
        "/giscore/dataconvert/rest/geodataset/schema?epsg=" +
        epsg +
        "&gdbp=" +
        gdbp
    );
  } else {
    return api.get(
      url + "/giscore/dataconvert/rest/geodataset/schema?gdbp=" + gdbp
    );
  }
}

// 新接口用于空间数据的属性/空间数据查询（可对接本地或外部的空间数据）
export function getGeoTableData(formdata) {
  const url = getMapGISUrl();
  const api = new API();
  const token = getMapgisToken();

  api.setBaseUrl(url);
  api.setAuthorization(token);
  return api.get(url + "/giscore/dataconvert/rest/geodataset/query", formdata);
}

// 按条件获取文件资源列表
export function getFileByWebsocketCallback(folderDir) {
  const url = getMapGISUrl();
  const api = new API();
  const token = getMapgisToken();
  api.setBaseUrl(url);
  api.setAuthorization(token);

  return api.get(url + "/clouddisk/rest/file/search", {
    srcUrl: folderDir,
    pageNo: 1,
    pageSize: 5000,
    sorts: "update_time desc"
  });
}
