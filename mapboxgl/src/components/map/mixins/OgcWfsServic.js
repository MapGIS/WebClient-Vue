import { BaseServer } from "@mapgis/webclient-es6-service";
import { parse } from "fast-xml-parser";

const { IgsServiceBase } = BaseServer;

export default {
  name: "mapgis-ogc-wfs-service",
  inject: ["map"],
  mounted() {
    //取得地图文档id
    this.mapId = this._url.substr(
      this._url.indexOf("doc") + 4,
      this._url.indexOf("/WFSServer") - this._url.indexOf("doc") - 4
    );
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
    post(url, data, fn, error) {
      let xhr = new XMLHttpRequest();
      xhr.open("POST", url, true);
      // 添加http头，发送信息至服务器时内容编码类型
      xhr.setRequestHeader("Content-Type", "raw");
      xhr.onreadystatechange = function(data) {
        if (
          xhr.readyState === 4 &&
          (xhr.status === 200 || xhr.status === 304)
        ) {
          fn.call(this, xhr.responseText);
        } else if (
          xhr.readyState === 4 &&
          xhr.status !== 200 &&
          xhr.status !== 304
        ) {
          error.call(this, xhr.responseText);
        }
      };
      xhr.send(data);
    },
    //将一个要素从xml形式转化为Object形式
    _xmlToResult(xmlObj, mapId) {
      //定义一个返回结果对象
      let result = {};
      //遍历要素
      Object.keys(xmlObj).forEach(function(key) {
        //取得attributeName
        let attributeName = key.substr(mapId.length + 1),
          posList;
        result[attributeName] = [];
        //如果返回的为Reg即多边形坐标，进行处理
        if (key === mapId + ":Reg") {
          //取得数据
          let surfaceMember =
            xmlObj[key]["gml:MultiSurface"]["gml:surfaceMember"];
          if (surfaceMember instanceof Array) {
            let polygons = [];
            for (let i = 0; i < surfaceMember.length; i++) {
              let polygon = {};
              if (
                surfaceMember[i]["gml:Polygon"].hasOwnProperty("gml:exterior")
              ) {
                let exteriorPos = surfaceMember[i]["gml:Polygon"][
                  "gml:exterior"
                ]["gml:LinearRing"]["gml:posList"].split(" ");
                polygon.exterior = [];
                for (let i = 0; i <= exteriorPos.length; i += 2) {
                  polygon.exterior.push([
                    Number(exteriorPos[i]),
                    Number(exteriorPos[i + 1])
                  ]);
                }
              }
              if (
                surfaceMember[i]["gml:Polygon"].hasOwnProperty("gml:interior")
              ) {
                let interiorPos = surfaceMember[i]["gml:Polygon"][
                  "gml:interior"
                ]["gml:LinearRing"]["gml:posList"].split(" ");
                polygon.interior = [];
                for (let i = 0; i <= interiorPos.length; i += 2) {
                  polygon.interior.push([
                    Number(interiorPos[i]),
                    Number(interiorPos[i + 1])
                  ]);
                }
              }
              polygons.push(polygon);
              result[attributeName] = polygons;
            }
          } else {
            posList = surfaceMember["gml:Polygon"]["gml:exterior"][
              "gml:LinearRing"
            ]["gml:posList"].split(" ");
            //重新拼装
            for (let i = 0; i < posList.length; i += 2) {
              result[attributeName].push([
                Number(posList[i + 1]),
                Number(posList[i + 1])
              ]);
            }
          }
        } else if (key === mapId + ":Pnt") {
          //如果返回的为Pnt即点坐标，进行处理
          //取得坐标数据
          posList = xmlObj[key]["gml:Point"]["gml:pos"].split(" ");
          result[attributeName] = [Number(posList[0]), Number(posList[1])];
        } else if (key === mapId + ":Lin") {
          //如果返回的为Lin即线坐标，进行处理
          //取得坐标数据
          posList = xmlObj[key]["gml:MultiCurve"]["gml:curveMember"][
            "gml:LineString"
          ]["gml:posList"].split(" ");
          result[attributeName] = [];
          for (let i = 0; i < posList.length; i += 2) {
            result[attributeName].push([
              Number(posList[i]),
              Number(posList[i + 1])
            ]);
          }
        } else {
          result[attributeName] = xmlObj[key];
        }
      });
      return result;
    },
    _query(param, onSuccess, onError) {
      //拼接GetFeature的url
      let wfsUrl = this._url + "&REQUEST=GetFeature",
        vm = this;
      //转换参数为WFS需要的的参数
      param = param.formatParameter("typename", this.map.crs.epsgCode);
      //将参数转换为url
      Object.keys(param).forEach(function(key) {
        wfsUrl += "&" + key + "=" + param[key];
      });
      // let igsService = new IgsServiceBase(wfsUrl,{
      //   eventListeners: {
      //     processCompleted: function (data) {
      //       console.log("这是回调函数")
      //       let parser = new DOMParser();
      //       let xmlDoc = parser.parseFromString(data,"text/xml");
      //       if(onSuccess){
      //         onSuccess(xmlDoc);
      //       }
      //     }
      //   }
      // });
      // console.log("igsService",igsService)
      // igsService.processAsync();
      this.get(
        wfsUrl,
        function(data) {
          //转换xml为json对象
          let json = parse(data),
            //定义返回对象
            results = {},
            //取得返回的features数据
            featureObjXML = json["wfs:FeatureCollection"]["gml:featureMembers"];
          //遍历数据，数据以layerId分隔
          Object.keys(featureObjXML).forEach(function(key) {
            //取得layerId
            let layerId = key.substr(vm.mapId.length + 1, key.length);
            //取得每层layerId的数据
            results[layerId] = [];
            //当查询到的结果为多个时，返回值数组
            if (featureObjXML[key] instanceof Array) {
              //遍历每一层的要素对象
              for (let i = 0; i < featureObjXML[key].length; i++) {
                //将结果转换为Object形式
                results[layerId].push(
                  vm._xmlToResult(featureObjXML[key][i], vm.mapId)
                );
              }
            } else {
              //当查询到的结果为一个时，返回对象
              results[layerId].push(
                vm._xmlToResult(featureObjXML[key], vm.mapId)
              );
            }
          });
          if (onSuccess) {
            onSuccess(results);
          }
        },
        function(data) {
          if (onError) {
            onError(data);
          }
        }
      );
    },
    $_queryByRectangleWFS(rectangleParameter, onSuccess, onError) {
      this._query(rectangleParameter, onSuccess, onError);
    },
    $_queryBySQLWFS(sqlParameter, onSuccess, onError) {
      this._query(sqlParameter, onSuccess, onError);
    },
    $_queryByObjectIdsWFS(objectIdsParameter, onSuccess, onError) {
      this._query(objectIdsParameter, onSuccess, onError);
    },
    $_queryByGeometryWFS(geometryParameter, onSuccess, onError) {
      this._query(geometryParameter, onSuccess, onError);
    },
    $_addWFS(features, layer, onSuccess, onError) {
      console.log(features);
      let xml =
          "<wfs:Transaction xmlns='http://www.someserver.com/myns' xmlns:gml='http://www.opengis.net/gml'   xmlns:" +
          this.mapId +
          "='http://www.mapgis.com.cn'  xmlns:wfs='http://www.opengis.net/wfs' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xsi:schemaLocation='http://www.someserver.com/myns http://www.someserver.com/wfs/cwwfs.cgirequest=describefeaturetype http://www.opengis.net/wfs ../wfs/1.0.0/WFS-transaction.xsd'>",
        vm = this;
      for (let i = 0; i < features.length; i++) {
        xml += "<wfs:Insert>";
        xml += "<" + vm.mapId + ":" + layer + ">";
        xml += "<" + vm.mapId + ":" + "WKB_GEOM>" + "<gml:";
        if (features[i].geometry.type !== "Point") {
          xml += features[i].geometry.type.toLowerCase();
        } else {
          xml += features[i].geometry.type;
        }
        xml += ">";
        let pos = features[i].geometry.coordinates;
        if (features[i].geometry.type === "Point") {
          xml +=
            "<gml:coordinates>" + pos[0] + " " + pos[1] + "</gml:coordinates>";
        } else if (features[i].geometry.type === "LineString") {
          xml += "<gml:coordinates>";
          for (let i = 0; i < pos.length; i++) {
            xml += pos[i].join(",") + " ";
          }
          xml = xml.substr(0, xml.length - 1);
          xml += "</gml:coordinates>";
        } else if (features[i].geometry.type === "Polygon") {
          xml += "<gml:exterior><gml:linearring><gml:posList>";
          for (let i = 0; i < pos[0].length; i++) {
            xml += pos[0][i].join(" ") + " ";
          }
          xml = xml.substr(0, xml.length - 1);
          xml += "</gml:posList></gml:linearring></gml:exterior>";
        }
        xml += "</gml:";
        if (features[i].geometry.type !== "Point") {
          xml += features[i].geometry.type.toLowerCase();
        } else {
          xml += features[i].geometry.type;
        }
        xml += ">" + "</" + vm.mapId + ":" + "WKB_GEOM>";
        Object.keys(features[i].attributes).forEach(function(key) {
          xml +=
            "<" +
            vm.mapId +
            ":" +
            key +
            ">" +
            features[i].attributes[key] +
            "</" +
            vm.mapId +
            ":" +
            key +
            ">";
        });
        xml += "</" + vm.mapId + ":" + layer + ">" + "</wfs:Insert>";
      }
      xml += "</wfs:Transaction>";
      console.log(xml);
      console.log(this._url);
      this.post(this.url, xml, function(data) {
        console.log("添加成功", data);
      });
      console.log(xml);
    },
    $_updateWFS(features, layer, onSuccess, onError) {
      let xml =
        "<wfs:Transaction xmlns='http://www.someserver.com/myns' xmlns:gml='http://www.opengis.net/gml' xmlns:ogc='http://www.opengis.net/ogc'   xmlns:" +
        this.mapId +
        "='http://www.mapgis.com.cn'  xmlns:wfs='http://www.opengis.net/wfs' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xsi:schemaLocation='http://www.someserver.com/myns http://www.someserver.com/wfs/cwwfs.cgirequest=describefeaturetype http://www.opengis.net/wfs ../wfs/1.0.0/WFS-transaction.xsd'>";
      let vm = this;
      for (let i = 0; i < features.length; i++) {}
      xml +=
        "<wfs:Update typeName='" +
        this.mapId +
        ":" +
        layer +
        "'><wfs:Property>";
      console.log(features[0]);
      Object.keys(features[0].attributes).forEach(function(key) {
        xml +=
          "<wfs:" +
          key +
          ">" +
          vm.mapId +
          ":" +
          features[0].attributes[key] +
          "</wfs:" +
          key +
          ">";
      });
      xml += "</wfs:Property>";
      xml +=
        "<ogc:Filter><ogc:GmlObjectId gml:id='" +
        layer +
        ".163'/></ogc:Filter>";
      xml += "</wfs:Update></wfs:Transaction>";
      this.post(this.url, xml, function(data) {
        console.log("添加成功", data);
      });
    },
    $_deleteWFS(objectIds, layer, onSuccess, onError) {}
  }
};
