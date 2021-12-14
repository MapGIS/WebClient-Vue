// @ts-nocheck
import * as Zondy from "@mapgis/webclient-es6-service";
import axios from "axios";
export default class DocumentCatalog {
  /**
   * 获取瓦片列表
   * @param {Object} param
   * @param {string} param.ip 服务器IP
   * @param {Number} param.port 服务端口
   */
  static getTiles({ ip, port }) {
    const url = `http://${ip}:${port}/igs/rest/mrcs/tiles?version=2&f=json`;
    const promise = new Promise((resolve, reject) => {
      axios.get(url).then(
        (res) => {
          const { data } = res;
          if (!data) {
            resolve(undefined);
          } else {
            resolve(data);
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
    return promise.then((data) => {
      return data;
    });
  }
  /**
   * 获取地图列表
   * @param {Object} param
   * @param {string} param.ip 服务器IP
   * @param {Number} param.port 服务端口
   */
  static getDocs({ ip, port }) {
    const url = `http://${ip}:${port}/igs/rest/mrcs/docs?version=2&f=json`;
    const promise = new Promise((resolve, reject) => {
      axios.get(url).then(
        (res) => {
          const { data } = res;
          if (!data) {
            resolve(undefined);
          } else {
            resolve(data);
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
    return promise.then((data) => {
      return data;
    });
  }
  static getDocInfo(option) {
    if (!option.serverName) {
      return null;
    }
    if (this.globalDocInfo[option.serverName]) {
      return this.globalDocInfo[option.serverName];
    }
    let domain = option.domain || null;
    if (!domain) {
      const protocol = option.protocol || "http";
      const ip = option.ip;
      const port = option.port;
      domain = `${protocol}://${ip}:${port}`;
    }
    const url = `${domain}/igs/rest/mrcs/docs/${
      option.serverName
    }?dataService=${option.serverName}&f=json&tree=true&guid=${
      option.guid || "__readonly_user__"
    }`;
    const self = this;
    const promise = new Promise((resolve, reject) => {
      axios.get(url).then(
        (res) => {
          const { data } = res;
          if (!data) {
            resolve(undefined);
          } else {
            for (let i = 0; i < data.MapInfos.length; i += 1) {
              const { CatalogLayer } = data.MapInfos[i];
              if (CatalogLayer) {
                data.MapInfos[i].CatalogLayer =
                  self.disposeDocInfo(CatalogLayer);
              }
            }
            self.globalDocInfo[option.serverName] = data;
            resolve(data);
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
    return promise.then((data) => {
      return data;
    });
  }
  static get3dDocInfo(option) {
    if (!option.serverName) {
      return null;
    }
    if (this.globalDocInfo[option.serverName]) {
      return this.globalDocInfo[option.serverName];
    }
    let domain = option.domain || null;
    if (!domain) {
      const protocol = option.protocol || "http";
      const ip = option.ip;
      const port = option.port;
      domain = `${protocol}://${ip}:${port}`;
    }
    const url = `${domain}/igs/rest/g3d/${option.serverName}/GetDocInfo`;
    const self = this;
    const promise = new Promise((resolve, reject) => {
      axios.get(url).then(
        (res) => {
          const { data } = res;
          if (!data) {
            resolve(undefined);
          } else {
            self.globalDocInfo[option.serverName] = data;
            resolve(data);
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
    return promise.then((data) => {
      return data;
    });
  }
  /**
   * 获取矢量地图或瓦片数据信息
   * @param {Object} param
   * @param {string} param.ip 服务器IP
   * @param {Number} param.port 服务端口
   * @param {string} param.name 服务名
   */
  static getMapInfoService({ ip, port, name }) {
    const url = `http://${ip}:${port}/igs/rest/mrms/info/${name}?guid=`;
    const promise = new Promise((resolve, reject) => {
      axios.get(url).then(
        (res) => {
          const { data } = res;
          if (!data) {
            resolve(undefined);
          } else {
            resolve(data);
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
    return promise.then((data) => {
      return data;
    });
  }
  /**
   * 递归给地图文档的图层赋值layerIndex
   * @param vectorInfo
   * @param layerIndex // 图层组的layerIndex赋值采用多级：上级layerIndex-i
   */
  static disposeDocInfo(vectorInfo, layerIndex) {
    if (!vectorInfo) {
      return [];
    }
    for (let i = 0; i < vectorInfo.length; i += 1) {
      const tip =
        layerIndex && layerIndex !== "" ? `${layerIndex}-${i}` : String(i);
      if (vectorInfo[i].Type === "Layer") {
        vectorInfo[i].layerIndex = tip;
      } else if (vectorInfo[i].Type === "Group") {
        const groupMapLayerInfo = vectorInfo[i].GroupMapLayerInfo;
        if (groupMapLayerInfo) {
          vectorInfo[i].GroupMapLayerInfo = this.disposeDocInfo(
            groupMapLayerInfo,
            tip
          );
        }
      }
    }
    return vectorInfo;
  }
  /**
   * 获取图层索引列表，匹配图层URL，支持按名称列表和行政区划代码列表
   * @param data      [in]       MapInfoCatalogLayer类型的数组
   * @param layerName [in]      图层名称列表：以逗号分隔，匹配图层URL
   * @param code      [in]      行政区代码列表：以逗号分隔，匹配图层URL
   * @param array     [out]     图层索引列表
   * @param urlArray  [int out] 图层URL列表
   * @returns                   图层索引列表
   */
  static getLayerIndexesByNamesOrCodes(
    data,
    layerName = "",
    code = "",
    array = [],
    urlArray = []
  ) {
    array = array || [];
    urlArray = urlArray || [];
    if (layerName !== "" || code !== "") {
      for (let i = 0; i < data.length; i += 1) {
        const { URL, layerIndex, GroupMapLayerInfo } = data[i];
        if (data[i].Type === "Layer") {
          if (code === "") {
            let layerNames = [];
            if (layerName.includes(",")) {
              layerNames = layerName.split(",");
            } else {
              layerNames = [layerName];
            }
            for (let j = 0; j < layerNames.length; j += 1) {
              if (
                URL &&
                URL.indexOf(layerNames[j]) === URL.length - layerNames[j].length
              ) {
                if (!urlArray.includes(URL)) {
                  urlArray.push(URL);
                  if (layerIndex) {
                    array.push(layerIndex);
                  }
                }
              }
            }
          } else if (layerName === "") {
            let codes = [];
            if (code.includes(",")) {
              codes = code.split(",");
            } else {
              codes = [code];
            }
            for (let j = 0; j < codes.length; j += 1) {
              if (URL && URL.includes(codes[j])) {
                if (!urlArray.includes(URL)) {
                  urlArray.push(URL);
                  if (layerIndex) {
                    array.push(layerIndex);
                  }
                }
              }
            }
          } else if (
            URL &&
            URL.indexOf(layerName) === URL.length - layerName.length &&
            URL.includes(code)
          ) {
            if (!urlArray.includes(URL)) {
              urlArray.push(URL);
              if (layerIndex) {
                array.push(layerIndex);
              }
            }
          }
        } else if (GroupMapLayerInfo && GroupMapLayerInfo.length > 0) {
          array = this.getLayerIndexesByNamesOrCodes(
            GroupMapLayerInfo,
            layerName,
            code,
            array,
            urlArray
          );
        }
      }
    } else {
      for (let i = 0; i < data.length; i += 1) {
        const { layerIndex, GroupMapLayerInfo } = data[i];
        if (data[i].Type === "Layer") {
          if (layerIndex) {
            array.push(layerIndex);
          }
        } else if (GroupMapLayerInfo && GroupMapLayerInfo.length > 0) {
          array = this.getLayerIndexesByNamesOrCodes(
            GroupMapLayerInfo,
            layerName,
            code,
            array,
            urlArray
          );
        }
      }
    }
    return array;
  }
  /**
   * 获取图层URL列表，匹配URL，支持按图层名和行政区划代码
   * @param data        [in]      MapInfoCatalogLayer类型的数组
   * @param layerName   [in]      图层名称列表：以逗号分隔，匹配图层URL
   * @param code        [in]      行政区代码列表:以逗号分隔，匹配图层URL
   * @param urlArray    [int out] 图层URL(GDBP)列表
   * @returns                     图层URL(GDBP)列表
   */
  static getLayerUrlsByNamesOrCodes(data, layerName, code, urlArray) {
    urlArray = urlArray || [];
    if (layerName !== "" || code !== "") {
      for (let i = 0; i < data.length; i += 1) {
        const { URL, GroupMapLayerInfo } = data[i];
        if (data[i].Type === "Layer") {
          if (code === "") {
            let layerNames = [];
            if (layerName.includes(",")) {
              layerNames = layerName.split(",");
            } else {
              layerNames = [layerName];
            }
            for (let j = 0; j < layerNames.length; j += 1) {
              if (
                URL &&
                URL.indexOf(layerNames[j]) === URL.length - layerNames[j].length
              ) {
                if (!urlArray.includes(URL)) {
                  urlArray.push(URL);
                }
              }
            }
          } else if (layerName === "") {
            let codes = [];
            if (code.includes(",")) {
              codes = code.split(",");
            } else {
              codes = [code];
            }
            for (let j = 0; j < codes.length; j += 1) {
              if (URL && URL.includes(codes[j])) {
                if (!urlArray.includes(URL)) {
                  urlArray.push(URL);
                }
              }
            }
          } else if (
            URL &&
            URL.indexOf(layerName) === URL.length - layerName.length &&
            URL.includes(code)
          ) {
            if (!urlArray.includes(URL)) {
              urlArray.push(URL);
            }
          }
        } else if (GroupMapLayerInfo && GroupMapLayerInfo.length > 0) {
          urlArray = this.getLayerUrlsByNamesOrCodes(
            GroupMapLayerInfo,
            layerName,
            code,
            urlArray
          );
        }
      }
    } else {
      for (let i = 0; i < data.length; i += 1) {
        const { URL, GroupMapLayerInfo } = data[i];
        if (data[i].Type === "Layer") {
          if (URL) {
            urlArray.push(URL);
          }
        } else if (GroupMapLayerInfo && GroupMapLayerInfo.length > 0) {
          urlArray = this.getLayerUrlsByNamesOrCodes(
            GroupMapLayerInfo,
            layerName,
            code,
            urlArray
          );
        }
      }
    }
    return urlArray;
  }
  /**
   * 根据图层索引列表获取图层列表
   * @param layerIdxs               [in]  图层索引列表，以逗号分隔.图层索引为igs返回的DocInfo中定义的索引,
   * 对图层进行查询、编辑时,通过该索引指定图层。
   * @param sourceLayerInfoArray    [in]  源图层信息列表，待过滤的图层
   * @param destLayerInfoArray      [in out]  目标图层列表，与layerIdxs对应的图层列表。
   * @returns 目标图层列表，与layerIdxs对应的图层列表。
   */
  static getLayersByIndexes(
    layerIdxs,
    sourceLayerInfoArray,
    destLayerInfoArray = []
  ) {
    // 图层索引号数组
    if (!layerIdxs || layerIdxs === "" || !sourceLayerInfoArray) {
      return [];
    }
    if (!destLayerInfoArray) {
      destLayerInfoArray = [];
    }
    let layerIdxsArr = [];
    if (layerIdxs.includes(",")) {
      layerIdxsArr = layerIdxs.split(",");
    } else {
      layerIdxsArr = [layerIdxs];
    }
    for (let i = 0; i < sourceLayerInfoArray.length; i += 1) {
      for (let m = 0; m < layerIdxsArr.length; m += 1) {
        if (layerIdxsArr[m] === sourceLayerInfoArray[i].layerIndex) {
          destLayerInfoArray.push(sourceLayerInfoArray[i]);
        }
      }
      if (sourceLayerInfoArray[i].Type === "Group") {
        const { GroupMapLayerInfo } = sourceLayerInfoArray[i];
        if (GroupMapLayerInfo) {
          destLayerInfoArray = this.getLayersByIndexes(
            layerIdxs,
            GroupMapLayerInfo,
            destLayerInfoArray
          );
        }
      }
    }
    return destLayerInfoArray;
  }
  /**
   * 获取图层URL列表，匹配URL，支持按图层名
   * @param data         [in]       MapInfoCatalogLayer类型的数组
   * @param names        [in]       图层名称列表：以逗号分隔，匹配图层URL
   * @param urlArray     [int out]  图层URL(GDBP)列表
   * @returns                       图层URL(GDBP)列表
   */
  static getLayerIndexesByNames(data, names, urlArray) {
    if (names === "") {
      return [];
    }
    urlArray = urlArray || [];
    let tempNames;
    if (names.includes(",")) {
      tempNames = names.split(",");
    } else {
      tempNames = [names];
    }
    for (let i = 0; i < data.length; i += 1) {
      if (data[i].Type === "Layer") {
        for (let j = 0; j < tempNames.length; j += 1) {
          const { URL } = data[i];
          if (URL && URL.indexOf(tempNames[j]) > 0) {
            if (!urlArray.includes(URL)) {
              urlArray.push(URL);
            }
          }
        }
      } else {
        const { GroupMapLayerInfo } = data[i];
        if (GroupMapLayerInfo) {
          urlArray = this.getLayerIndexesByNames(
            GroupMapLayerInfo,
            names,
            urlArray
          );
        }
      }
    }
    return urlArray;
  }
  /**
   * 根据范围或图层名列表筛选图层
   * @param {Array} data                    MapInfoCatalogLayer类型的数组
   * @param {Array|null} extent             范围
   * @param {Array|null} [layerNames]       图层名数组
   * @param {Array} [array]                 递归使用，可不传
   * @param {Array} [gdbps]                 递归使用，可不传
   * @returns                               图层列表
   */
  static getLayersByExtentOrName(data, extent, layerNames, array, gdbps) {
    if (!array) {
      array = [];
    }
    gdbps = gdbps || [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].Type === "Layer") {
        const range = data[i].ProjTransRange;
        if (range && extent) {
          if (
            range.xmax < extent[0] ||
            range.xmin > extent[2] ||
            range.ymax < extent[1] ||
            range.ymin > extent[3]
          ) {
            // eslint-disable-next-line no-continue
            continue;
          }
        }
        if (layerNames) {
          for (let j = 0; j < layerNames.length; j++) {
            if (
              data[j].URL.indexOf(layerNames[j]) ===
              data[j].URL.length - layerNames[j].length
            ) {
              if (gdbps.indexOf(data[j].URL) < 0) {
                array.push(data[j]);
                gdbps.push(data[j].URL);
              }
            }
          }
        } else if (gdbps.indexOf(data[i].URL) < 0) {
          array.push(data[i]);
          gdbps.push(data[i].URL);
        }
      } else if (data[i].GroupMapLayerInfo) {
        array = this.getLayersByExtentOrName(
          data[i].GroupMapLayerInfo,
          extent,
          layerNames,
          array,
          gdbps
        );
      }
    }
    return array;
  }
  /**
   * 获取图层信息
   * @param queryParam
   */
  static getLayerInfo(queryParam) {
    let { domain } = queryParam;
    if (!domain) {
      const protocol = queryParam.protocol;
      const ip = queryParam.ip;
      const port = queryParam.port;
      domain = `${protocol}://${ip}:${port}`;
    }
    const { layerType } = queryParam;
    let promise;
    if (layerType === "layer") {
      const vectorLayer = new Zondy.MRCS.VectorLayer({ domain });
      const { gdbp } = queryParam;
      promise = new Promise((resolve) => {
        vectorLayer.getLayerInfo(gdbp, (res) => {
          if (!res || !res.Range) {
            resolve(null);
          } else {
            const obj = {
              layerType,
              proName: res.SrName,
              extent: res.Range,
              FieldAtt: res.FieldAtt,
            };
            resolve(obj);
          }
        });
      });
    } else if (layerType === "vector") {
      const { serverName } = queryParam;
      const mapdoc = new Zondy.MRCS.MapDoc({
        domain,
        docName: serverName,
      });
      promise = new Promise((resolve) => {
        mapdoc.getMapInfo((res) => {
          if (!res || !res.range) {
            resolve(null);
          } else {
            const r = res.range.split(",");
            const extent = {
              xmin: Number(r[0]),
              ymin: Number(r[1]),
              xmax: Number(r[2]),
              ymax: Number(r[3]),
            };
            const obj = {
              layerType,
              proName: res.projtransName,
              extent,
            };
            resolve(obj);
          }
        });
      });
    } else if (layerType === "tile") {
      const { serverName } = queryParam;
      const tileLayer = new Zondy.MRCS.TileLayer({
        domain,
        tileName: serverName,
      });
      promise = new Promise((resolve) => {
        tileLayer.getTileInfo((res) => {
          if (!res || !res.TileInfo2) {
            resolve(null);
          } else {
            const { fullExtent } = res.TileInfo2;
            if (fullExtent) {
              const extent = {
                xmin: fullExtent.xmin,
                ymin: fullExtent.ymin,
                xmax: fullExtent.xmax,
                ymax: fullExtent.ymax,
              };
              const proName =
                res.TileInfo2.tileInfo.spatialReference.tileSRefInfo.Name;
              const tileSize =
                res.TileInfo2.tileInfo.cols || res.TileInfo2.tileInfo.rows;
              const { origin } = res.TileInfo2.tileInfo;
              const obj = {
                layerType,
                proName,
                extent,
                tileSize,
                origin,
              };
              resolve(obj);
            }
          }
        });
      });
    }
    if (promise) {
      return promise.then((Range) => {
        return Range;
      });
    }
    return null;
  }
}
// 地图文档图层信息
DocumentCatalog.globalDocInfo = {};
