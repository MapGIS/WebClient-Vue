import wfsService from "./OgcWfsServic";
import { MRFS, Common } from "@mapgis/webclient-es6-service";

const {
  QueryDocFeature,
  QueryFeatureRule,
  QueryFeatureStruct,
  QueryParameter,
  QueryByLayerParameter,
  EditDocFeature,
  QueryLayerFeature,
  EditLayerFeature
} = MRFS;

const {
  Point2D,
  PolyLine,
  Rectangle,
  Polygon,
  MultiPolygon,
  GPoint,
  FeatureGeometry,
  CPointInfo,
  WebGraphicsInfo,
  Feature,
  FeatureSet,
  CAttStruct,
  GLine,
  CLineInfo,
  Arc,
  AnyLine,
  GRegion,
  CRegionInfo,
  extend
} = Common;

import {
  BaseParameter,
  GeometryParameter,
  SQLParameter,
  ObjectIdsParameter,
  RectangleParameter,
  VFeature,
  VPoint,
  VMultiPoint,
  VPolyline,
  VMultiPolyline,
  VPolygon,
  VMultiPolygon
} from "../../util";

export default {
  name: "mapgis-feature-service",
  mixins: [wfsService],
  created() {
    this._initParam();
  },
  render(createElement, context) {},
  props: {
    url: {
      type: String
    }
  },
  mounted() {
    let vm = this;
    this.$watch("url", function() {
      vm._initParam();
    });
    this.$emit("loaded", this);
  },
  methods: {
    get(url, fn, error) {
      // XMLHttpRequest对象用于在后台与服务器交换数据
      var xhr = new XMLHttpRequest();
      xhr.open("GET", url, true);
      xhr.onreadystatechange = function() {
        // readyState == 4说明请求已完成
        if ((xhr.readyState == 4 && xhr.status == 200) || xhr.status == 304) {
          // 从服务器获得数据
          fn.call(this, xhr.responseText);
        } else if (
          xhr.readyState === 4 &&
          xhr.status !== 200 &&
          xhr.status !== 304
        ) {
          error.call(this, xhr.responseText);
        }
      };
      xhr.send();
    },
    _initParam() {
      //取得ip，port，mapId（地图文档名称）
      this._url = this.url;
      let urls = this._url.split("http://");
      this._ip = urls[1].split(":")[0];
      let arr = urls[1].split(":")[1].split("/");
      this._port = arr[0];
      this._mapId = arr[arr.length - 1];
    },
    //通过OID查询要素
    _queryByObjectIds(objectIdsParameter, onSuccess, onError) {
      this._queryFeatures(objectIdsParameter, onSuccess, onError);
    },
    //通过SQL语句查询要素
    _queryBySQL(sqlParameter, onSuccess, onError) {
      this._queryFeatures(sqlParameter, onSuccess, onError);
    },
    //根据bbox查询
    _queryByRectangle(sqlParameter, onSuccess, onError) {},
    //通过几何查询要素，可以联合SQL语句查询
    _queryByGeometry(rectangleParamter, onSuccess, onError) {
      this._queryFeatures(rectangleParamter, onSuccess, onError);
    },
    /*查询要素公共方法
     * author 杨琨
     * param param BaseParameter 查询参数
     * param onSuccess Function 成功回调方法
     * param onError Function 失败回调方法
     * */
    _queryFeatures(parammeter, onSuccess, onError) {
      parammeter = BaseParameter.formatParam(parammeter);
      let param = { ...parammeter };

      //定义变量
      let vm = this,
        rule,
        queryParam,
        queryStruct,
        geometry,
        layers,
        deleteArr,
        queryService;
      //取得图层id，即要查询哪些图层，分为文档要素查询（layerId为0,1,2...）和矢量图层要素插叙（layerId为gdbp1,gdbp2,...）
      layers = param.layers;
      if (typeof layers === "string") {
        layers = layers.split(",");
      }
      //确定要被删除的属性，用完后被丢弃，例如layer，相交规则，返回格式等
      deleteArr = [
        "layers",
        "pagination",
        "orderBy",
        "spatialRelationType",
        "EnableDisplayCondition",
        "MustInside",
        "CompareRectOnly",
        "Intersect",
        "IncludeGeometry",
        "IncludeAttribute",
        "IncludeWebGraphic"
      ];
      //处理传入的param，将某些属性名改为zondy接口要求的
      Object.keys(param).forEach(function(key) {
        switch (key) {
          case "pagination":
            param["recordNumber"] = param.pagination;
            break;
          case "orderBy":
            param["orderField"] = param.orderBy;
            break;
          case "spatialRelationType":
            param["MustInside"] = param.spatialRelationType === "MustInside";
            param["Intersect"] = param.spatialRelationType === "Intersect";
            break;
          case "objectIds":
            param.objectIds = param.objectIds.join(",");
        }
      });
      //如果有几何参数，则进行处理，点、线、区、或者bbox
      if (
        (param.hasOwnProperty("geometry") && param.geometry) ||
        (param.hasOwnProperty("rectangle") && param.rectangle.length > 0)
      ) {
        //初始化几何查询规则参数
        rule = new QueryFeatureRule({
          //是否将要素的可见性计算在内
          EnableDisplayCondition: param.enableDisplayCondition,
          //是否完全包含
          MustInside: param.MustInside,
          //是否仅比较要素的外包矩形
          CompareRectOnly: param.compareRectOnly,
          //是否相交
          Intersect: param.Intersect
        });
        if (!param.hasOwnProperty("geometry") && param.rectangle.length > 0) {
          //bbox查询
          geometry = new Rectangle(
            param.rectangle[0],
            param.rectangle[1],
            param.rectangle[2],
            param.rectangle[3]
          );
          delete param.rectangle;
        } else if (param.geometry.type === "Point") {
          //点查询
          geometry = new Point2D(
            param.geometry.coordinates[0],
            param.geometry.coordinates[1],
            {
              nearDis: "0.001"
            }
          );
          delete param.geometry;
        } else if (
          param.geometry.type === "LineString" ||
          param.geometry.type === "Polygon"
        ) {
          //线查询或单个多边形查询
          let pointArr = [];
          for (let i = 0; i < param.geometry.coordinates.length; i++) {
            pointArr.push(
              new Point2D(
                param.geometry.coordinates[i][0],
                param.geometry.coordinates[i][1]
              )
            );
          }
          switch (param.geometry.type) {
            case "LineString":
              geometry = new PolyLine(pointArr);
              break;
            case "Polygon":
              geometry = new Polygon(pointArr);
              break;
          }
          delete param.geometry;
        } else if (param.geometry.type === "MultiPolygon") {
          //线查询或单个多边形查询
          let polygons = [];
          for (let i = 0; i < param.geometry.coordinates.length; i++) {
            let polygon = [],
              coordinates = param.geometry.coordinates[i];
            for (let j = 0; j < coordinates.length; j++) {
              polygon.push(new Point2D(coordinates[j][0], coordinates[j][1]));
            }
            polygons.push(new Polygon(polygon));
          }
          geometry = new MultiPolygon(polygons);
          delete param.geometry;
        }
      }
      //初始化查询返回结果显示参数
      queryStruct = new QueryFeatureStruct({
        IncludeGeometry: param.IncludeGeometry,
        IncludeAttribute: param.IncludeAttribute,
        IncludeWebGraphic: param.IncludeWebGraphic
      });
      //初始化zondy前端接口的查询参数
      let reg = new RegExp("^[0-9]+$");
      if (layers.length <= 0) {
        throw new Error("请填写您要查询的图层");
      } else if (reg.test(layers[0])) {
        queryParam = new QueryParameter();
        //初始化要素服务
        queryService = new QueryDocFeature(
          queryParam,
          this._mapId,
          layers.join(","),
          {
            ip: vm._ip,
            port: vm._port
          }
        );
      } else if (
        typeof layers[0] === "string" &&
        layers[0].indexOf("gdbp") > -1
      ) {
        queryParam = new QueryByLayerParameter(layers);
        //初始化要素服务
        queryService = new QueryLayerFeature(queryParam, {
          ip: vm._ip,
          port: vm._port
        });
      } else {
        throw new Error("请填写正确的图层Id或gdbp地址");
      }
      //如果有几何查询条件，则传给queryParam
      if (geometry) {
        queryParam.geometry = geometry;
        queryParam.rule = rule;
      }
      //指定返回内容
      queryParam.struct = queryStruct;
      let extendParam = { ...param };
      //删除不必要的选项
      for (let i = 0; i < deleteArr.length; i++) {
        if (extendParam.hasOwnProperty(deleteArr[i])) {
          delete extendParam[deleteArr[i]];
        }
      }
      //将额外的查询参数赋值给queryParam
      extend(queryParam, extendParam);
      //开始查询
      queryService.query(
        function(res) {
          onSuccess(res);
        },
        function(error) {
          onError(error);
        }
      );
    },
    /*处理要素，根据数据库的字段类型进行处理，将要素转为zondy的要素格式，并返回要素集合
     * author 杨琨
     * param result Object 指定数据源下指定GDB中的字段类型
     * param features [Feature] 一组要素对象
     * return 要素集合
     * */
    _getFeatureSet(result, features) {
      let fldType = [];
      let FldType = result.FieldAtt.FldType;
      for (let i = 0; i < FldType.length; i++) {
        fldType.push(FldType[i].substr(3, FldType[i].length).toLowerCase());
      }
      result.FieldAtt.FldType = fldType;
      //初始化要素集合
      let featureSet = new FeatureSet({
        AttStruct: new CAttStruct(result.FieldAtt)
      });
      //循环处理要素
      for (let i = 0; i < features.length; i++) {
        //确定是否含有集合对象
        let hasGeometry =
            features[i].hasOwnProperty("geometry") && features[i].geometry,
          geometry,
          geometryArr,
          polyline;
        //初始化字段值数组
        let attValue = [];
        //如果某个字段有值，则加入数组，否则放入null
        for (let j = 0; j < result.FieldAtt.FldName.length; j++) {
          if (
            features[i].attributes.hasOwnProperty(result.FieldAtt.FldName[j])
          ) {
            attValue.push(features[i].attributes[result.FieldAtt.FldName[j]]);
          } else {
            attValue.push(null);
          }
        }
        //初始化一个要素对象
        let feature = new Feature({
            AttValue: attValue
          }),
          ftype;
        //如果有几何对象，根据类型（点线面等）进行处理，并设置
        if (hasGeometry) {
          let geomType = features[i].geometryType,
            fGeom,
            webGraphicInfo,
            styleInfo,
            anyLine,
            point,
            points,
            arc,
            gRegion;
          geometry = features[i].geometry;
          switch (geomType) {
            case "Point":
              geometryArr = [];
              for (let j = 0; j < geometry.length; j++) {
                point = new GPoint(
                  geometry[j].coordinates[0],
                  geometry[j].coordinates[1]
                );
                geometryArr.push(point);
              }
              fGeom = new FeatureGeometry({ PntGeom: geometryArr });
              ftype = 1;
              if (features[i].style) {
                styleInfo = new CPointInfo(features[i].style);
                webGraphicInfo = new WebGraphicsInfo({
                  InfoType: 1,
                  PntInfo: styleInfo
                });
              }
              break;
            case "LineString":
              geometryArr = [];
              for (let j = 0; j < geometry.length; j++) {
                points = [];
                for (let k = 0; k < geometry[j].coordinates.length; k++) {
                  points.push(
                    new Point2D(
                      geometry[j].coordinates[k].x,
                      geometry[j].coordinates[k].y
                    )
                  );
                }
                arc = new Arc(points);
                anyLine = new AnyLine([arc]);
                polyline = new GLine(anyLine);
                geometryArr.push(polyline);
              }
              fGeom = new FeatureGeometry({ LinGeom: geometryArr });
              ftype = 2;
              if (features[i].style) {
                styleInfo = new CLineInfo(features[i].style);
                webGraphicInfo = new WebGraphicsInfo({
                  InfoType: 2,
                  LinInfo: styleInfo
                });
              }
              break;
            case "Polygon":
              geometryArr = [];
              for (let j = 0; j < geometry.length; j++) {
                anyLine = [];
                let exteriorArr = [];
                for (let k = 0; k < geometry[j].exterior.length; k++) {
                  exteriorArr.push(
                    new Point2D(
                      geometry[j].exterior[k].x,
                      geometry[j].exterior[k].y
                    )
                  );
                }
                anyLine.push(new AnyLine([new Arc(exteriorArr)]));
                for (let k = 0; k < geometry[j].interior.length; k++) {
                  let interiorArr = [];
                  for (let m = 0; m < geometry[j].interior[k].length; m++) {
                    interiorArr.push(
                      new Point2D(
                        geometry[j].interior[k][m].x,
                        geometry[j].interior[k][m].y
                      )
                    );
                  }
                  anyLine.push(new AnyLine([new Arc(interiorArr)]));
                }
                gRegion = new GRegion(anyLine);
                geometryArr.push(gRegion);
              }
              fGeom = new FeatureGeometry({ RegGeom: geometryArr });
              ftype = 3;
              if (features[i].style) {
                styleInfo = new CRegionInfo(features[i].style);
                webGraphicInfo = new WebGraphicsInfo({
                  InfoType: 3,
                  RegInfo: styleInfo
                });
              }
              break;
          }
          feature.fGeom = fGeom;
          feature.GraphicInfo = webGraphicInfo;
          feature.ftype = ftype;
        }
        //更新时，需要FID，新增时不需要
        if (features[i].FID) {
          feature.setFID(features[i].FID);
        }
        //添加要素
        featureSet.addFeature(feature);
      }
      //返回要素集合
      return featureSet;
    },
    /*根据layer取得要素服务，分为0,1,2,...和gdbp1,gdbp2,gdbp3,....两种形式
     * author 杨琨
     * param layer String 图层id或者gdbp地址
     * return 要素服务对象
     * */
    _getFeatureService(layer) {
      let service;
      if (layer.indexOf("gdbp") >= 0) {
        //如过含有gdbp则用EditLayerFeature
        service = new EditLayerFeature(layer);
      } else {
        //如过是1,2,3,...则用EditDocFeature
        service = new EditDocFeature(this._mapId, layer, {
          ip: this._ip,
          port: this._port
        });
      }
      return service;
    },
    /*添加要素
     * author 杨琨
     * param features [Feature] 要添加的要素数组
     * param layer String 要添加的要素所在的图层，仅为单个图层
     * param onSuccess Function 成功回调函数
     * param onError Function 失败回调函数
     * */
    _add(features, layer, onSuccess, onError) {
      let me = this,
        service;
      //取得数据库字段信息
      this.$_getFieldAtt(layer, function(result) {
        //获取要素集合
        let featureSet = me._getFeatureSet(result, features);
        //获取服务
        service = me._getFeatureService(layer);
        //添加要素
        service.add(featureSet, onSuccess, onError);
      });
    },
    /*更新要素
     * author 杨琨
     * param features [Feature] 要添加的要素数组
     * param layer String 要更新要素所在的图层，仅为单个图层
     * param onSuccess Function 成功回调函数
     * param onError Function 失败回调函数
     * */
    $_updateFeature(features, layer, onSuccess, onError) {
      let me = this,
        service;
      //取得数据库字段信息
      this.$_getFieldAtt(layer, function(result) {
        //获取要素集合
        let featureSet = me._getFeatureSet(result, features);
        //获取服务
        service = me._getFeatureService(layer);
        //更新要素
        service.update(featureSet, onSuccess, onError);
      });
    },
    /*删除要素
     * author 杨琨
     * param objectIds [Number] 要删除的要素OID数组
     * param layer String 要删除要素所在的图层，仅为单个图层
     * param onSuccess Function 成功回调函数
     * param onError Function 失败回调函数
     * */
    _delete(objectIds, layer, onSuccess, onError) {
      objectIds = objectIds.join(",");
      let service = this._getFeatureService(layer);
      service.deletes(objectIds, onSuccess, onError);
    },
    /*取得单个图层所对应的数据库信息
     * author 杨琨
     * param layer Number 图层编号，从0开始
     * param callback Function 回调函数
     * */
    $_getLayerInfo(layer, callback) {
      this.get(
        "http://" +
          this._ip +
          ":" +
          this._port +
          "/igs/rest/mrcs/docs/" +
          this._mapId +
          "/0/" +
          layer +
          "?f=json",
        function(result) {
          result = JSON.parse(result);
          let url = result.URL;
          callback(url);
        }
      );
    },
    /*取得单个图层所对应的数据库的信息
     * author 杨琨
     * param layer String 数据库地址，例如gdbp://MapGISLocalPlus/wuhan_new/sfcls/武汉市
     * param callback Function 回调函数
     * */
    $_getGDBPInfo(url, callback) {
      this.get(
        "http://" +
          this._ip +
          ":" +
          this._port +
          "/igs/rest/mrcs/layerinfo?gdbpUrl=" +
          url,
        function(result) {
          result = JSON.parse(result);
          callback(result);
        }
      );
    },
    $_getDocInfo(callback, docId) {
      docId = !docId ? "0" : docId;
      debugger;
      this.get(
        "http://" +
          this._ip +
          ":" +
          this._port +
          "/igs/rest/mrcs/docs/" +
          this._mapId +
          "/" +
          docId +
          "/layers?f=json",
        function(result) {
          result = JSON.parse(result);
          callback(result);
        }
      );
    },
    /*取得数据库字段信息，新增要素或更新要素要使用到
     * author 杨琨
     * param layer String 图层Id或数据库地址
     * param callback Function 回调函数
     * */
    $_getFieldAtt(layer, callback) {
      let me = this;
      if (layer.indexOf("gdbp") >= 0) {
        //取得图层对应的数据库信息
        this.$_getGDBPInfo(layer, callback);
      } else {
        //取得图层信息
        this.$_getLayerInfo(layer, function(url) {
          me.$_getGDBPInfo(url, callback);
        });
      }
    },
    //对外方法，根据bbox查询要素
    $_queryByRectangle(rectangleParameter, onSuccess, onError) {
      if (this._url.indexOf("WFSServer") > -1) {
        this.$_queryByRectangleWFS(rectangleParameter, onSuccess, onError);
      } else {
        this._queryByGeometry(rectangleParameter, onSuccess, onError);
      }
    },
    //对外方法，根据SQL查询要素
    $_queryBySQL(sqlParameter, onSuccess, onError) {
      if (this._url.indexOf("WFSServer") > -1) {
        this.$_queryBySQLWFS(sqlParameter, onSuccess, onError);
      } else {
        this._queryBySQL(sqlParameter, onSuccess, onError);
      }
    },
    //对外方法，根据ObjectIds查询要素
    $_queryByObjectIds(objectIdsParameter, onSuccess, onError) {
      if (this._url.indexOf("WFSServer") > -1) {
        this.$_queryByObjectIdsWFS(objectIdsParameter, onSuccess, onError);
      } else {
        this._queryByObjectIds(objectIdsParameter, onSuccess, onError);
      }
    },
    //对外方法，根据几何查询要素
    $_queryByGeometry(geometryParameter, onSuccess, onError) {
      if (this._url.indexOf("WFSServer") > -1) {
        this.$_queryByGeometryWFS(geometryParameter, onSuccess, onError);
      } else {
        this._queryByGeometry(geometryParameter, onSuccess, onError);
      }
    },
    //对外方法，添加要素
    $_add(features, layer, onSuccess, onError) {
      if (this._url.indexOf("WFSServer") > -1) {
        this.$_addWFS(features, layer, onSuccess, onError);
      } else {
        this._add(features, layer, onSuccess, onError);
      }
    },
    //对外方法，更新要素
    $_update(features, layer, onSuccess, onError) {
      if (this._url.indexOf("WFSServer") > -1) {
        this.$_updateWFS(features, layer, onSuccess, onError);
      } else {
        this.$_updateFeature(features, layer, onSuccess, onError);
      }
    },
    //对外方法，删除要素
    $_delete(objectIds, layer, onSuccess, onError) {
      if (this._url.indexOf("WFSServer") > -1) {
      } else {
        this._delete(objectIds, layer, onSuccess, onError);
      }
    },
    $_FSCheckParam(param, onSuccess, onError, callback) {
      function check(param) {
        let checkObj = {
          layers: "Array",
          pageIndex: "Number",
          pagination: "Number",
          resultFormat: "String",
          IncludeAttribute: "Boolean",
          IncludeGeometry: "Boolean",
          IncludeWebGraphic: "Boolean",
          orderBy: "String",
          isAsc: "Boolean",
          proj: "String",
          fields: "String",
          coordPrecision: "Number"
        };
        Object.keys(checkObj).forEach(function(key) {
          if (param.hasOwnProperty(key)) {
            if (!(param[key] instanceof checkObj[key])) {
              throw new Error(key + "的类型错误，必须为" + checkObj[key]);
            }
          }
        });
      }
      if (!(onSuccess instanceof Function) || !(onError instanceof Function)) {
        throw new Error("回调方法不是函数");
      }
      if (!param) {
        throw new Error("查询参数不能为空");
      }
      if (!(param instanceof Object)) {
        throw new Error("查询参数类型非法，必须为Object对象");
      }
      check(param);
      callback(param, onSuccess, onError);
    },
    $_getGeometryParameter(options) {
      return new GeometryParameter(options);
    },
    $_getSQLParameter(options) {
      return new SQLParameter(options);
    },
    $_getObjectIdsParameter(options) {
      return new ObjectIdsParameter(options);
    },
    $_getRectangleParameter(options) {
      return new RectangleParameter(options);
    },
    $_getFeature(options) {
      return new VFeature(options);
    },
    $_fromGeoJSON(geoJSON) {
      return VFeature.fromGeoJSON(geoJSON);
    },
    $_fromQueryResult(result) {
      return VFeature.fromQueryResult(result);
    },
    $_toAntTableData(result) {
      return VFeature.toAntTableData(result);
    },
    $_getPoint(options) {
      return new VPoint(options);
    },
    $_getMultiPoint(options) {
      return new VMultiPoint(options);
    },
    $_getPolyline(options) {
      return new VPolyline(options);
    },
    $_getMultiPolyline(options) {
      return new VMultiPolyline(options);
    },
    $_getPolygon(options) {
      return new VPolygon(options);
    },
    $_getMultiPolygon(options) {
      return new VMultiPolygon(options);
    },
    $_getPolylinesCoordinates(Features) {
      return new VPolyline.getPolylinesCoordinates(Features);
    },
    $_getPolylinesCenter(lineArr) {
      return new VPolyline.getPolylinesCenter(lineArr);
    },
    $_getPointsCoordinates(Features) {
      return new VPoint.getPointsCoordinates(Features);
    },
    $_getPointsCenter(pointsArr) {
      return new VPoint.getPointsCenter(pointsArr);
    },
    $_getPolygonsCoordinates(Features) {
      return new VPolygon.getPolygonsCoordinates(Features);
    },
    $_getPolygonsCenter(polygonsArr) {
      return new VPolygon.getPolygonsCenter(polygonsArr);
    }
  }
};
