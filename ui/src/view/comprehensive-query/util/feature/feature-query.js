var __awaiter =
  (this && this.__awaiter) ||
  function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function(resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
// @ts-nocheck
import * as Zondy from "@mapgis/webclient-es6-service";
import axios from "axios";
import DocumentCatalog from "../catalog/document";
import DataSourceCatalog from "../catalog/data-source";
export default class FeatureQuery {
  /**
   * 查询通用接口
   * @param {object} option
   * @param {object} [option.isDataStoreQuery] 是否为DataStore的查询
   * @param {boolean} combine 是否走聚合查询方式。不涉及分页的，走IGS默认的，设置为向前光标速度更快；聚合查询做了优化，查询速度 比IGS默认的快速，支持属性聚合
   */
  static query(option, combine, is3D) {
    return __awaiter(this, void 0, void 0, function*() {
      if (!option) {
        return null;
      }
      if (option.isEsGeoCode) {
        // es地名地址查询
        return this.dataStoreEsGeoCode(option);
      }
      if (option.isDataStoreQuery) {
        // datastore
        return this.dataStorePgQueryFeature(option);
      } // igs
      return this.igsQuery(option, combine, is3D);
    });
  }
  static isDataStoreQuery(option) {
    return __awaiter(this, void 0, void 0, function*() {
      const { ip, port, gdbp } = option;
      let isDataStoreQuery = false;
      let DNSName = "";
      if (
        gdbp &&
        gdbp.indexOf("MapGisLocal") === -1 &&
        gdbp.indexOf("@") > -1
      ) {
        const result = yield DataSourceCatalog.getDataSource({
          ip,
          port,
          isDetail: true
        });
        const dsName = gdbp.split("@")[1].split("/")[0];
        if (result && result.length > 0) {
          for (let i = 0; i < result.length; i++) {
            if (result[i].Name === dsName && result[i].Type === "DBPG") {
              isDataStoreQuery = true;
              DNSName = result[i].DNSName;
              break;
            }
          }
        }
      }
      return {
        isDataStoreQuery,
        DNSName
      };
    });
  }
  /**
   * igs要素查询
   * @param option 详见igsQueryFeature和igsOnemapQueryFeature的option
   * @param {boolean} combine 是否走聚合查询方式。不涉及分页的，走IGS默认的，设置为向前光标速度更快；聚合查询做了优化，查询速度 比IGS默认的快速，支持属性聚合
   * @param {boolean} is3D 是否为三维要素查询。
   * @returns {Promise<void>}
   */
  static igsQuery(option, combine, is3D) {
    return __awaiter(this, void 0, void 0, function*() {
      if (!is3D && option.docName && option.layerIdxs !== undefined) {
        // 参数是否含有文档名和图层索引号
        const docInfo = yield DocumentCatalog.getDocInfo({
          serverName: option.docName,
          ip: option.ip,
          port: option.port
        });
        const data =
          docInfo === null || docInfo === void 0
            ? void 0
            : docInfo.MapInfos[Number(option.mapIndex) || 0].CatalogLayer;
        const layerName = option.layerName || "";
        const code = option.code || "";
        if (data && option.layerIdxs === "") {
          option.layerIdxs = DocumentCatalog.getLayerIndexesByNamesOrCodes(
            data,
            layerName,
            code,
            [],
            []
          ).join(",");
        }
      }
      if (combine) {
        option.combine = combine;
        return this.igsCombineQueryFeature(option);
      }
      if (is3D) {
        return this.igsQuery3DFeature(option);
      }
      return this.igsQueryFeature(option);
    });
  }
  /**
   * igs要素查询
   * @param {object} option
   * @param {string}[option.domain=null] igs服务地址域名 （domain和[protocol，ip，port]，二选一）
   * @param {string}[option.protocol=window.location.protocol.split(':')[0]] igs服务地址网络协议 （domain和[protocol，ip，port]，二选一）
   * @param {string}[option.ip =null] igs服务地址ip （domain和[protocol，ip，port]，二选一）
   * @param {string}[option.port=null] igs服务地址port （domain和[protocol，ip，port]，二选一）
   * //矢量文档和矢量图层要素查询公共参数
   * @param {string} [option.f="geojson"] 返回结果的格式,缺省xml(json|xml|geojson),geojson格式结果中不包含labelDots信息。
   * @param {Object} [option.geometry] 空间查询条件（例如：point，circle，rect，line，polygon等）
   * @param {string} [option.where] 属性查询条件（例如：id = 8）
   * @param {Number} [option.page=0] 返回的要素分页的页数，默认返回第0页
   * @param {Number} [option.pageCount=10] 要素结果集每页的记录数量，默认为20条/页
   *
   * @param {Boolean} [option.CompareRectOnly=false] 指定查询规则rule参数
   * @param {Boolean} [option.EnableDisplayCondition=false] 指定查询规则rule参数
   * @param {Boolean} [option.Intersect=true] 指定查询规则rule参数
   * @param {Boolean} [option.MustInside=false] 指定查询规则rule参数
   *
   * @param {Boolean} [option.IncludeAttribute=true]  指定查询结果的结构structs参数
   * @param {Boolean} [option.IncludeGeometry=true]  指定查询结果的结构structs参数
   * @param {Boolean} [option.IncludeWebGraphic=false] 指定查询结果的结构structs参数
   *
   * @param {string} [option.objectIds] 需要查询的要素Id号（说明：当此参数有值时，将忽略其他查询参数。）
   * @param {string} [option.orderField] 排序字段名称
   * @param {Boolean} [option.rtnLabel=true] 是否计算Label点
   * @param {Boolean} [option.isAsc=false] 按照字段进行排列时，是否升序排列
   * @param {string} [option.cursorType=“forward”] 游标类型 forward为向前光标 其他为向前向后
   * @param {string} [option.guid=“__readonly_user__”] 唯一id，可缺省
   * @param {string} [option.fields] 指定结果字段
   * @param {Number} [option.coordPrecision=2] coordPrecision坐标点的精度
   * 矢量图层的查询参数
   * @param {string} [option.gdbp] 图层的gdbp地址，多个图层用逗号分隔
   * @param {string} [option.srsIds] 投影参考系，多个图层用半角逗号分隔
   * 矢量文档的要素查询
   * @param {string} [option.docName] 文档名称</param>
   * @param {Number} [option.mapIndex] 地图在文档下得序号（一般值为0）
   * @param {string} [option.layerIdxs] 要查询的图层索引(多个请用','分隔),单个索引支持组的情况，比如0-0-1-2，前面三级就是组的索引
   * 时空云的必须参数
   * @param {string} [option.dataService] 时空云文档名
   */
  static igsQueryFeature(option) {
    let queryParam;
    if (option.gdbp) {
      // 矢量图层
      queryParam = new Zondy.MRFS.QueryByLayerParameter(option.gdbp);
      queryParam.proj = option.srsIds;
    } else {
      // 矢量文档
      queryParam = new Zondy.MRFS.QueryParameter();
    }
    queryParam.resultFormat = option.f || "geojson";
    queryParam.geometry = option.geometry || null;
    queryParam.where = option.where || null;
    queryParam.pageIndex = option.page || 0;
    queryParam.recordNumber = option.pageCount || 10;
    queryParam.rule = new Zondy.MRFS.QueryFeatureRule({
      CompareRectOnly:
        option.CompareRectOnly !== undefined ? option.CompareRectOnly : false,
      EnableDisplayCondition:
        option.EnableDisplayCondition !== undefined
          ? option.EnableDisplayCondition
          : false,
      Intersect: option.Intersect !== undefined ? option.Intersect : true,
      MustInside: option.MustInside !== undefined ? option.MustInside : false
    });
    queryParam.struct = new Zondy.MRFS.QueryFeatureStruct({
      IncludeAttribute:
        option.IncludeAttribute !== undefined ? option.IncludeAttribute : true,
      IncludeGeometry:
        option.IncludeGeometry !== undefined ? option.IncludeGeometry : true,
      IncludeWebGraphic:
        option.IncludeWebGraphic !== undefined
          ? option.IncludeWebGraphic
          : false
    });
    queryParam.objectIds = option.objectIds || null;
    queryParam.orderField = option.orderField || null;
    queryParam.rtnLabel =
      option.rtnLabel !== undefined ? option.rtnLabel : true;
    queryParam.isAsc = option.isAsc !== undefined ? option.isAsc : false;
    queryParam.cursorType = option.cursorType || "forward";
    queryParam.guid = option.guid || "__readonly_user__";
    queryParam.fields = option.fields || "";
    queryParam.coordPrecision =
      option.coordPrecision || option.coordPrecision === 0
        ? option.coordPrecision
        : 2;
    let domain = option.domain || null;
    if (!domain) {
      const protocol =
        option.protocol || window.location.protocol.split(":")[0];
      const ip = option.ip;
      const port = option.port;
      domain = `${protocol}://${ip}:${port}`;
    }
    let queryService;
    if (option.gdbp && !option.docName) {
      // 矢量图层
      queryService = new Zondy.MRFS.QueryLayerFeature(queryParam, {
        domain
      });
    } else {
      // 矢量文档
      if (!option.docName || !option.layerIdxs) {
        return null;
      }
      // 文档名
      const { docName } = option;
      // 文档索引
      const mapIndex = option.mapIndex || 0;
      // 图层索引号
      const layerIdxs =
        option.layerIdxs || option.layerIdxs === "0" ? option.layerIdxs : "*";
      // 时空云文档名
      const dataService = option.dataService || option.docName;
      queryParam.partUrl = `docs/${docName}/${mapIndex}/${layerIdxs}/query?dataService=${dataService}`;
      queryService = new Zondy.MRFS.QueryDocFeature(
        queryParam,
        docName,
        layerIdxs,
        {
          domain
        }
      );
    }
    const promise = new Promise((resolve, reject) => {
      queryService.query(
        res => {
          if (!res) {
            resolve(undefined);
          } else {
            resolve(res);
          }
        },
        error => {
          window.console.log(error);
          reject(error);
        }
      );
    });
    return promise.then(res => {
      return res;
    });
  }
  /**
   * igs要素聚合查询
   * @param {object} option
   * @param {string}[option.domain=null] igs服务地址域名 （domain和[protocol，ip，port]，二选一）
   * @param {string}[option.protocol=window.location.protocol.split(':')[0]] igs服务地址网络协议 （domain和[protocol，ip，port]，二选一）
   * @param {string}[option.ip =null] igs服务地址ip （domain和[protocol，ip，port]，二选一）
   * @param {string}[option.port=null] igs服务地址port （domain和[protocol，ip，port]，二选一）
   * 矢量文档和矢量图层要素查询公共参数
   * @param {string} [option.f="geojson"] 返回结果的格式,缺省xml(json|xml|geojson)
   * @param {boolean} [option.compress] 当f="geojson"有效
   * @param {number} [option.level] 当f="geojson"有效
   * @param {Object} [option.geometry] 几何类型的图形参数,包含geometryType几何类型（例如：point，circle，rect，line，polygon等）
   * @param {string} [option.where] 查询条件（例如：id = 8）
   * @param {Number} [option.page=0] 返回的要素分页的页数，默认返回第0页
   * @param {Number} [option.pageCount=10] 要素结果集每页的记录数量，默认为20条/页
   *
   * @param {Boolean} [option.CompareRectOnly=false] 指定查询规则rule参数
   * @param {Boolean} [option.EnableDisplayCondition=false] 指定查询规则rule参数
   * @param {Boolean} [option.Intersect=true] 指定查询规则rule参数
   * @param {Boolean} [option.MustInside=false] 指定查询规则rule参数
   *
   * @param {Boolean} [option.IncludeAttribute=true]  指定查询结果的结构structs参数
   * @param {Boolean} [option.IncludeGeometry=true]  指定查询结果的结构structs参数
   * @param {Boolean} [option.IncludeWebGraphic=false] 指定查询结果的结构structs参数
   *
   * @param {string} [option.objectIds] 需要查询的要素Id号（说明：当此参数有值时，将忽略其他查询参数。）
   * @param {string} [option.orderField] 排序字段名称
   * @param {Boolean} [option.rtnLabel=true] 是否计算Label点
   * @param {Boolean} [option.isAsc=false] 按照字段进行排列时，是否升序排列
   * @param {string} [option.cursorType=“forward”] 游标类型 forward为向前光标 其他为向前向后
   * @param {string} [option.guid=“__readonly_user__”] 唯一id，可缺省
   * @param {string} [option.fields] 指定结果字段
   * @param {Number} [option.coordPrecision=2] coordPrecision坐标点的精度
   * @param {Boolean} [option.combine=true]
   * 矢量图层的查询参数
   * @param {string} [option.gdbp] 图层的gdbp地址，多个图层用逗号分隔
   * @param {string} [option.srsIds] 投影参考系，多个图层用半角逗号分隔
   * 矢量文档的要素查询
   * @param {string} [option.docName] 文档名称</param>
   * @param {Number} [option.mapIndex] 地图在文档下得序号（一般值为0）
   * @param {string} [option.layerIdxs] 要查询的图层索引(多个请用','分隔),单个索引支持组的情况，比如0-0-1-2，前面三级就是组的索引
   * 时空云的必须参数
   * @param {string} [option.dataService] 时空云文档名
   */
  static igsCombineQueryFeature(option) {
    const queryParam = {};
    queryParam.f = option.f || "geojson";
    if (queryParam.f === "geojson") {
      queryParam.compress =
        option.compress !== undefined ? option.compress : false;
      queryParam.level = option.level || option.level === 0 ? option.level : 8;
    }
    if (option.geometry) {
      queryParam.geometryType = option.geometry.getGeometryType();
      queryParam.geometry = option.geometry.toString();
    }
    queryParam.where = option.where || undefined;
    queryParam.page = option.page || 0;
    queryParam.pageCount = option.pageCount || 10;
    const rule = new Zondy.MRFS.QueryFeatureRule({
      CompareRectOnly:
        option.CompareRectOnly !== undefined ? option.CompareRectOnly : false,
      EnableDisplayCondition:
        option.EnableDisplayCondition !== undefined
          ? option.EnableDisplayCondition
          : false,
      Intersect: option.Intersect !== undefined ? option.Intersect : true,
      MustInside: option.MustInside !== undefined ? option.MustInside : false
    });
    queryParam.rule = rule.toJSON();
    const structs = new Zondy.MRFS.QueryFeatureStruct({
      IncludeAttribute:
        option.IncludeAttribute !== undefined ? option.IncludeAttribute : true,
      IncludeGeometry:
        option.IncludeGeometry !== undefined ? option.IncludeGeometry : true,
      IncludeWebGraphic:
        option.IncludeWebGraphic !== undefined
          ? option.IncludeWebGraphic
          : false
    });
    queryParam.structs = structs.toJSON();
    queryParam.objectIds = option.objectIds || undefined;
    queryParam.orderField = option.orderField || undefined;
    queryParam.rtnLabel =
      option.rtnLabel !== undefined ? option.rtnLabel : true;
    queryParam.isAsc = option.isAsc !== undefined ? option.isAsc : false;
    queryParam.cursorType = option.cursorType || "forward";
    queryParam.guid = option.guid || "__readonly_user__";
    queryParam.fields = option.fields || "";
    queryParam.coordPrecision =
      option.coordPrecision || option.coordPrecision === 0
        ? option.coordPrecision
        : 2;
    queryParam.combine = option.combine !== undefined ? option.combine : true;
    let domain = option.domain || null;
    if (!domain) {
      const protocol =
        option.protocol || window.location.protocol.split(":")[0];
      const ip = option.ip;
      const port = option.port;
      domain = `${protocol}://${ip}:${port}`;
    }
    let url;
    if (option.gdbp) {
      // 矢量图层
      queryParam.gdbp = option.gdbp;
      queryParam.srsIds = option.srsIds;
      url = `${domain}/onemap/layer/query`;
    } else {
      // 矢量文档
      // option.layerIdxs下面已经做了判断这里不做处理
      // if (!option.docName || !option.layerIdxs) {
      if (!option.docName) {
        return null;
      }
      // 文档名
      const { docName } = option;
      // 文档索引
      const mapIndex = option.mapIndex || 0;
      // 图层索引号
      const layerIdxs =
        option.layerIdxs || option.layerIdxs === "0" ? option.layerIdxs : "*";
      url = `${domain}/onemap/docs/${docName}/${mapIndex}/${layerIdxs}/query`;
    }
    const promise = new Promise((resolve, reject) => {
      axios.get(url, { params: queryParam }).then(
        res => {
          const { data } = res;
          if (!data) {
            reject("undefined");
          } else {
            resolve(data);
          }
        },
        error => {
          reject(error);
        }
      );
    });
    return promise.then(data => {
      return data;
    });
  }
  /**
   * igs三维要素查询
   * @param {object} option
   * @param {string}[option.ip =null] igs服务地址ip （domain和[protocol，ip，port]，二选一）
   * @param {string}[option.port=null] igs服务地址port （domain和[protocol，ip，port]，二选一）
   * //矢量文档和矢量图层要素查询公共参数
   * @param {string} [option.f="geojson"] 返回结果的格式,缺省xml(json|xml|geojson)
   * @param {Object} [option.geometry] 几何类型的图形参数,包含geometryType几何类型（例如：point，circle，rect，line，polygon等）
   * @param {string} [option.where] 查询条件（例如：id = 8）
   * @param {Number} [option.page=0] 返回的要素分页的页数，默认返回第0页
   * @param {Number} [option.pageCount=10] 要素结果集每页的记录数量，默认为20条/页
   *
   * @param {Boolean} [option.CompareRectOnly=false] 指定查询规则rule参数
   * @param {Boolean} [option.EnableDisplayCondition=false] 指定查询规则rule参数
   * @param {Boolean} [option.Intersect=true] 指定查询规则rule参数
   * @param {Boolean} [option.MustInside=false] 指定查询规则rule参数
   *
   * @param {Boolean} [option.IncludeAttribute=true]  指定查询结果的结构structs参数
   * @param {Boolean} [option.IncludeGeometry=true]  指定查询结果的结构structs参数
   * @param {Boolean} [option.IncludeWebGraphic=false] 指定查询结果的结构structs参数
   *
   * @param {string} [option.objectIds] 需要查询的要素Id号（说明：当此参数有值时，将忽略其他查询参数。）
   * @param {string} [option.orderField] 排序字段名称
   * @param {Boolean} [option.rtnLabel=true] 是否计算Label点
   * @param {Boolean} [option.isAsc=false] 按照字段进行排列时，是否升序排列
   * @param {string} [option.cursorType=“forward”] 游标类型 forward为向前光标 其他为向前向后
   * @param {string} [option.guid=“__readonly_user__”] 唯一id，可缺省
   * 矢量图层的查询参数
   * @param {string} [option.gdbp] 图层的gdbp地址，多个图层用逗号分隔
   * 矢量文档的要素查询
   * @param {string} [option.docName] 文档名称</param>
   * @param {string} [option.layerIdxs] 要查询的图层索引(多个请用','分隔),单个索引支持组的情况，比如0-0-1-2，前面三级就是组的索引
   */
  static igsQuery3DFeature(option) {
    let queryParam;
    if (option.gdbp) {
      // 矢量图层
      queryParam = new Zondy.MRFS.QueryByLayerParameter(option.gdbp);
    } else {
      // 矢量文档
      queryParam = new Zondy.MRFS.QueryParameter();
    }
    queryParam.resultFormat = option.f || "geojson";
    if (option.geometry) {
      queryParam.geometryType =
        option.geometryType && option.geometryType !== ""
          ? option.geometryType
          : option.geometry.getGeometryType();
      queryParam.geometry = option.geometry.toString();
    }
    queryParam.where = option.where || null;
    queryParam.page = option.page || 0;
    queryParam.pageCount = option.pageCount || 10;
    queryParam.rule = new Zondy.MRFS.QueryFeatureRule({
      CompareRectOnly:
        option.CompareRectOnly !== undefined ? option.CompareRectOnly : false,
      EnableDisplayCondition:
        option.EnableDisplayCondition !== undefined
          ? option.EnableDisplayCondition
          : false,
      Intersect: option.Intersect !== undefined ? option.Intersect : true,
      MustInside: option.MustInside !== undefined ? option.MustInside : false
    });
    queryParam.struct = new Zondy.MRFS.QueryFeatureStruct({
      IncludeAttribute:
        option.IncludeAttribute !== undefined ? option.IncludeAttribute : true,
      IncludeGeometry:
        option.IncludeGeometry !== undefined ? option.IncludeGeometry : true,
      IncludeWebGraphic:
        option.IncludeWebGraphic !== undefined
          ? option.IncludeWebGraphic
          : false
    });
    queryParam.objectIds = option.objectIds || null;
    queryParam.orderField = option.orderField || null;
    queryParam.rtnLabel =
      option.rtnLabel !== undefined ? option.rtnLabel : true;
    queryParam.isAsc = option.isAsc !== undefined ? option.isAsc : false;
    queryParam.cursorType = option.cursorType || "forward";
    queryParam.guid = option.guid || "__readonly_user__";
    let queryService;
    if (option.gdbp) {
      // 矢量图层
      queryService = new Zondy.G3D.G3DMapDoc(
        Object.assign(
          { ip: option.ip, port: option.port, gdbp: option.gdbp },
          queryParam
        )
      );
    } else {
      // 矢量文档
      if (!option.docName || !option.layerIdxs) {
        return null;
      }
      // 文档名
      const { docName } = option;
      // 图层索引号
      const layerIdxs =
        option.layerIdxs || option.layerIdxs === "0" ? option.layerIdxs : "*";
      queryService = new Zondy.G3D.G3DMapDoc(
        Object.assign(
          { ip: option.ip, port: option.port, docName, layerindex: layerIdxs },
          queryParam
        )
      );
    }
    const promise = new Promise(resolve => {
      queryService.GetFeature(res => {
        if (!res) {
          resolve(undefined);
        } else {
          resolve(res);
        }
      });
    });
    return promise.then(res => {
      return res;
    });
  }

  /**
   * @param {object} option
   * @param {string}[option.url=null] 图层资源的路径，可能是gdbp、filePath
   * @param {object}[option.mapResource=null] 地图文档的资源，与urls二选一，mapResource优先，示例："{"url": "/root/wuhan.mapx","mapIndex ": 0,"layerId": "string"}"
   * @param {string}[option.where=null] 属性条件,类SQL语句,Example: where=name='中国'
   * @param {string}[option.outFields=null] 输出属性字段，可为*表示所有，多个用英文逗号分隔
   * @param {string}[option.objectIds=null] 过滤id，多个用英文逗号分隔
   * @param {string}[option.geometry=null] 空间几何条件,根据geometryType参数类型确定其格式，参考示例stringExamples:
                                           geometry=xmin,ymin,xmax,ymax - rect
                                           geometry=x0,y0,x1,y1,x2,y2,x0,y0 - polygon
                                           geometry=x0,y0,x1,y1 - line
                                           geometry=x,y,radius - circle
                                           geometry=x,y - point
   * @param {string}[option.geometryType=null] 几何类型,点查询:point,线查询:line,圆查询:circle,矩形查询:rect,多边形查询:polygon.Enum: "point" "line" "circle" "rect" "polygon"
   * @param {string}[option.distance=null] 几何缓冲的距离，geometry为point、line时有效
   * @param {string}[option.geometryPrecision=null] 返回要素几何信息中坐标xy的精度
   * @param {string}[option.spatialRel=null] 几何条件的空间判定规则，Intersects(相交)、EnvelopeIntersects(外包矩形相交)、Contains(包含)、Disjoint(相离).Enum: "Intersects" "EnvelopeIntersects" "Contains" "Disjoint"
   * @param {string}[option.returnGeometry=false] 是否返回几何，默认为true.Enum: "true" "false"
   * @param {string}[option.returnAttribute=true] 返回属性，默认为true.Enum: "true" "false"
   * @param {string}[option.returnStyle=false] 返回图形参数信息，默认为false.Enum: "true" "false"
   * @param {string}[option.returnIdsOnly=false] 只返回id，默认为false.Enum: "true" "false"
   * @param {string}[option.returnCountOnly=false] 只返回条数，默认为false.Enum: "true" "false"
   * @param {string}[option.returnExtentOnly=false] 只返回范围，默认为false.Enum: "true" "false"
   * @param {string}[option.orderByFields=null] 排序字段,格式: fieldName [ASC|DESC],可不填[ASC|DESC]，默认升序.Example: orderByFields=fieldName DESC
   * @param {Object}[option.outStatistics=null] 计算一个或多个基于字段的统计信息结构(注记类图层不支持该参数),统计类型包括:FUNCTION_MAX/FUNCTION_MIN/FUNCTION_SUM/FUNCTION_AVG/FUNCTION_COUNT/FUNCTION_MAX_OID，示例："[{"statisticType": "FUNCTION_SUM","onStatisticField": "field1","outStatisticFieldName":"fieldName1"}]"
   * @param {string}[option.groupByFieldsForStatistics=null] 分组统计的字段信息,格式为field1,field2
   * @param {Number}[option.page=0] 返回的要素分页的页数，默认返回第0页
   * @param {Number}[option.pageCount=10] 要素结果集每页的记录数量，默认为20条/页
   * @param {string}[option.returnZ=false] 是否返回Z轴，默认为false.Enum: "true" "false"
   * @param {string}[option.is6xAcls=null] 图层资源的路径是filePath且后缀是.wt时，需要指定图层资源是否是6x注记，默认为6x点.Enum: "true" "false"
   * @param {string}[option.inSrs='WGS1984 度'] 输入几何的坐标系，示例:EPSG:4326或者WGS1984 度"
   * @param {string}[option.outSrs='WGS1984 度'] 输出几何的坐标系，示例:EPSG:4326或者WGS1984 度"
   */
  static igsQueryResourceServer(option) {
    const queryParam = {};
    queryParam.f = option.f || "json";
    if (option.geometry) {
      queryParam.geometryType =
        option.geometryType && option.geometryType !== ""
          ? option.geometryType
          : option.geometry.getGeometryType();
      queryParam.geometry = option.geometry.toString();
    }
    queryParam.where = option.where || null;
    queryParam.returnGeometry = option.returnGeometry || true;
    queryParam.returnAttribute = option.returnAttribute || true;
    queryParam.returnStyle = option.returnStyle || false;
    queryParam.returnIdsOnly = option.returnIdsOnly || false;
    queryParam.returnCountOnly = option.returnCountOnly || false;
    queryParam.returnExtentOnly = option.returnExtentOnly || false;

    queryParam.objectIds = option.objectIds || null;
    queryParam.outFields = option.outFields || null;
    queryParam.url = option.url || null;
    queryParam.mapResource = option.mapResource || null;
    queryParam.distance = option.distance || null;
    queryParam.geometryPrecision = option.geometryPrecision || null;
    queryParam.spatialRel = option.spatialRel || null;
    queryParam.orderByFields = option.orderByFields || null;
    queryParam.outStatistics = option.outStatistics || null;
    queryParam.groupByFieldsForStatistics =
      option.groupByFieldsForStatistics || null;
    const resultRecordCount = option.pageSize || 10;
    let resultOffset = 0;
    if (option.page > 1) {
      resultOffset = (option.page - 1) * resultRecordCount;
    }
    queryParam.resultRecordCount = resultRecordCount;
    queryParam.resultOffset = resultOffset;
    queryParam.returnZ = option.returnZ || false;
    queryParam.is6xAcls = option.is6xAcls || null;
    queryParam.inSrs = option.inSrs || "WGS1984_度";
    queryParam.outSrs = option.outSrs || "WGS1984_度";
    let domain = option.domain || null;
    if (!domain) {
      const protocol =
        option.protocol || window.location.protocol.split(":")[0];
      const ip = option.ip;
      const port = option.port;
      domain = `${protocol}://${ip}:${port}`;
    }
    const url = `${domain}/igs/rest/services/system/ResourceServer/tempData/features/query`;
    const promise = new Promise(resolve => {
      axios.get(url, { params: { ...queryParam } }).then(res => {
        if (!res || !res.data) {
          resolve(undefined);
        } else {
          resolve(res.data);
        }
      });
    });
    return promise.then(res => {
      return res;
    });
  }

  /**
   * dataStore要素查询
   * @param option 详见dataStorePgQueryFeature的option
   * @returns {Promise<*>}
   */
  // public static async dataStoreQuery(option: FeatureQueryParam) {
  //   let gdbpArray: string[] = []
  //   if (!option.gdbp) {
  //     return null
  //   }
  //   if (option.gdbp.includes(',')) {
  //     gdbpArray = option.gdbp.split(',')
  //   } else {
  //     gdbpArray = [option.gdbp]
  //   }
  //   debugger
  //   return Promise.all(
  //     gdbpArray.map((gdbp) => {
  //       return this.dataStorePgQueryFeature(gdbp, option)
  //     })
  //   )
  // }
  /**
   * dataStore pg的要素查询
   * @param option - {Object} 查询条件
   * @param {string} [option.domain=null] dataStore服务地址域名 （domain和[protocol，ip，port]，二选一）
   * @param {string} [option.protocol=window.location.protocol.split(':')[0]] dataStore服务地址网络协议 （domain和[protocol，ip，port]，二选一）
   * @param {string} [option.ip =null] dataStore服务地址ip （domain和[protocol，ip，port]，二选一）
   * @param {string} [option.port=null] dataStore服务地址port （domain和[protocol，ip，port]，二选一）
   * @param {Boolean} [option.includeProperites = true] 查询结果中是否包含属性
   * @param {String} [option.pageCount] 每页大小。默认10
   * @param {String} [option.page] 页码，从1开始
   * @param {String} [option.where] 属性条件 （例如：id>5,id<10）
   * @param {String} [option.fields] 统计计算中用于分组字段名列表
   * @param {String} [option.geometry] 几何信息，圆、多边形等
   * @param {String} [option.geoFormat="wkt"] 几何类型，wkt、wkb、geojson、自定义等
   * @param {String} [option.sref] 动态投影坐标系 ID，支持 MapGIS 和 EPSG 标准编号，其中 MapGIS 只支持当前库中自带的坐标系的 ID，EPSG 标准请 使用 EPSG:4326 格式，若指定了该参数，则系统认为 geometry 的坐标系为此坐标系
   */
  static dataStorePgQueryFeature(
    // gdbp: string,
    option
  ) {
    const queryParam = {};
    const vecStr = option.gdbp.split("/");
    const libName = option.DNSName.split("/")[1];
    const schemas = option.gdbp.split("@")[1].split("/")[1];
    const tableName = vecStr[vecStr.length - 1];
    queryParam.path = `${libName}/${schemas}/${tableName}`;
    queryParam.pageNo = option.page !== undefined ? option.page : 1;
    queryParam.pageSize = option.pageCount || 10;
    queryParam.includeProperites = true;
    if (option.geometry) {
      queryParam.geoFormat = "wkt";
      const geometryType = option.geometry.getGeometryType();
      const arr = [];
      let str;
      if (geometryType === "rect") {
        arr.push(`${option.geometry.xmin} ${option.geometry.ymin}`);
        arr.push(`${option.geometry.xmin} ${option.geometry.ymax}`);
        arr.push(`${option.geometry.xmax} ${option.geometry.ymax}`);
        arr.push(`${option.geometry.xmax} ${option.geometry.ymin}`);
        arr.push(`${option.geometry.xmin} ${option.geometry.ymin}`);
        str = arr.join(",");
        queryParam.geometry = `POLYGON(( ${str}))`;
      } else if (geometryType === "polygon" || geometryType === "polygon") {
        const { pointArr } = option.geometry;
        for (let i = 0; i < pointArr.length; i += 1) {
          arr.push(`${pointArr[i].x} ${pointArr[i].y}`);
        }
        str = arr.join(",");
        if (geometryType === "polygon") {
          queryParam.geometry = `POLYGON(( ${str}))`;
        } else if (geometryType === "line") {
          queryParam.geometry = `LINESTRING(${str})`;
        }
      } else if (geometryType === "point") {
        queryParam.geometry = `POINT(${option.geometry.x} ${option.geometry.y})`;
      }
    }
    if (option.where) {
      queryParam.filter = option.where;
    }
    if (option.fields) {
      queryParam.fields = option.fields;
    }
    queryParam.sref = option.sref;
    let domain = option.domain || null;
    queryParam.ip = option.ip;
    queryParam.port = option.port;
    if (!domain) {
      const protocol =
        option.protocol || window.location.protocol.split(":")[0];
      domain = `${protocol}://${queryParam.ip}:${queryParam.port}`;
    }
    queryParam.domain = domain;
    const promise = new Promise((resolve, reject) => {
      new Zondy.PostGIS.PostgisQueryService(queryParam).query(
        res => {
          if (!res || !res.features) {
            reject("undefined");
          } else {
            resolve(res);
          }
        },
        error => {
          reject(error);
        }
      );
    });
    return promise.then(res => {
      return res;
    });
  }
  /**
   * dataStore es的地名地址查询
   * @param option - {Object} 查询条件
   * @param {string} [option.domain=null] dataStore服务地址域名 （domain和[protocol，ip，port]，二选一）
   * @param {string} [option.protocol=window.location.protocol.split(':')[0]] dataStore服务地址网络协议 （domain和[protocol，ip，port]，二选一）
   * @param {string} [option.ip =null] dataStore服务地址ip （domain和[protocol，ip，port]，二选一）
   * @param {string} [option.port=null] dataStore服务地址port （domain和[protocol，ip，port]，二选一）
   * @param {String} [option.libName] 数据库名
   * @param {String} [option.pageCount] 每页大小。默认10
   * @param {String} [option.page] 页码，从1开始
   * @param {String} [option.province] 省约束信息
   * @param {String} [option.city] 市约束信息
   * @param {String} [option.bbox] 矩形范围信息
   * @param {String} [option.hotGroup] 数据分类
   * @param {Boolean} [option.decode] 是否为逆地理编码
   * @param {Number} [option.lon] 经度
   * @param {Number} [option.lat] 纬度
   * @param {Number} [option.dis=0.1] 查询范围半径
   * @param {Number} [option.typeName] 表单名
   */
  static dataStoreEsGeoCode(option) {
    const queryParam = {};
    queryParam.indexName = option.libName;
    queryParam.pageNo = option.page !== undefined ? option.page : 1;
    queryParam.pageSize = option.pageCount || 10;
    queryParam.province = option.province;
    queryParam.city = option.city;
    queryParam.bbox = option.bbox;
    queryParam.geometry = option.geometry;
    queryParam.typeName = option.typeName;
    let domain = option.domain || null;
    const ip = option.ip;
    const port = option.port;
    if (!domain) {
      const protocol =
        option.protocol || window.location.protocol.split(":")[0];
      domain = `${protocol}://${ip}:${port}`;
    }
    queryParam.domain = domain;
    const { decode } = option;
    let fun;
    if (decode) {
      queryParam.lon = option.lon;
      queryParam.lat = option.lat;
      queryParam.dis = option.dis;
      fun = Zondy.ElasticSearch.ESGeoDecode;
    } else {
      queryParam.keyWord = option.where || "";
      fun = Zondy.ElasticSearch.ESGeoCode;
    }
    const promise = new Promise((resolve, reject) => {
      new fun(queryParam).query(
        res => {
          if (!res || !res.t) {
            reject("undefined");
          } else {
            resolve(res.t);
          }
        },
        error => {
          reject(error);
        }
      );
    });
    return promise.then(res => {
      return res;
    });
  }
}
