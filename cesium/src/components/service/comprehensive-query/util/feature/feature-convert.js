import * as Zondy from "@mapgis/webclient-es6-service";
import { GeometryExp } from "../objects/geometry";
class GGeometryPoint {
  constructor(coors, crs) {
    this.coors = [NaN, NaN];
    this.coors = coors;
    this.geoCRS = crs;
  }
  get type() {
    return "Point";
  }
  get coordinates() {
    return this.coors;
  }
  get crs() {
    return this.geoCRS;
  }
  toFeatureGeometry() {
    const [x, y] = this.coordinates;
    const point = new Zondy.Common.GPoint(x, y);
    return new Zondy.Common.FeatureGeometry({ PntGeom: [point] });
  }
  toTangram() {
    const [x, y] = this.coordinates;
    return new Zondy.Common.Point2D(x, y);
  }
}
class GGeometryLine {
  constructor(coors, crs) {
    this.coors = [];
    this.coors = coors;
    this.geoCRS = crs;
  }
  get type() {
    return "LineString";
  }
  get coordinates() {
    return this.coors;
  }
  get crs() {
    return this.geoCRS;
  }
  toFeatureGeometry() {
    const coords = this.coordinates.map(([x, y]) => {
      return new Zondy.Common.Point2D(x, y);
    });
    const arc = new Zondy.Common.Arc(coords);
    const anyLine = new Zondy.Common.AnyLine([arc]);
    const gline = new Zondy.Common.GLine(anyLine);
    return new Zondy.Common.FeatureGeometry({ LinGeom: [gline] });
  }
  toTangram() {
    const coords = this.coordinates.map(([x, y]) => {
      return new Zondy.Common.Point2D(x, y);
    });
    return new Zondy.Common.PolyLine(coords);
  }
}
class GGeometryPolygon {
  constructor(coors, crs) {
    this.coors = [];
    this.coors = coors;
    this.geoCRS = crs;
  }
  get type() {
    return "Polygon";
  }
  get coordinates() {
    return this.coors;
  }
  get crs() {
    return this.geoCRS;
  }
  toFeatureGeometry() {
    const arcs = this.coordinates.map(line => {
      const coords = line.map(([x, y]) => {
        return new Zondy.Common.Point2D(x, y);
      });
      return new Zondy.Common.Arc(coords);
    });
    const anyLine = new Zondy.Common.AnyLine(arcs);
    const gRegion = new Zondy.Common.GRegion([anyLine]);
    return new Zondy.Common.FeatureGeometry({ RegGeom: [gRegion] });
  }
  toTangram() {
    const coords = this.coordinates[0].map(([x, y]) => {
      return new Zondy.Common.Point2D(x, y);
    });
    return new Zondy.Common.Polygon(coords);
  }
}
class GGeometryMultiPolygon {
  constructor(coors, crs) {
    this.coors = [];
    this.coors = coors;
    this.geoCRS = crs;
  }
  get type() {
    return "MultiPolygon";
  }
  get coordinates() {
    return this.coors;
  }
  get crs() {
    return this.geoCRS;
  }
  toFeatureGeometry() {
    const arcs = this.coordinates[0].map(line => {
      const coords = line.map(([x, y]) => {
        return new Zondy.Common.Point2D(x, y);
      });
      return new Zondy.Common.Arc(coords);
    });
    const anyLine = new Zondy.Common.AnyLine(arcs);
    const gRegion = new Zondy.Common.GRegion([anyLine]);
    return new Zondy.Common.FeatureGeometry({ RegGeom: [gRegion] });
  }
  toTangram() {
    const coords = this.coordinates[0][0].map(([x, y]) => {
      return new Zondy.Common.Point2D(x, y);
    });
    return new Zondy.Common.Polygon(coords);
  }
}
export default class FeatureConvert {
  /**
   * IGServer数据结构转为GeoJSON数据结构
   * @param igsFeatures
   * @param useAlias 转换后的属性key值是否使用FldAlias，默认使用FldName
   */
  static featureIGSToFeatureGeoJSON(igsFeatures, useAlias) {
    const dataCount =
      igsFeatures.TotalCount > -1
        ? igsFeatures.TotalCount
        : igsFeatures.SFEleArray.length;
    const geojsonFeatures = {
      type: "FeatureCollection",
      features: [],
      dataCount
    };
    if (!igsFeatures.SFEleArray) {
      return geojsonFeatures;
    }
    const tags = igsFeatures.AttStruct.FldName;
    const alias = igsFeatures.AttStruct.FldAlias;
    const fldType = igsFeatures.AttStruct.FldType;
    for (let i = 0; i < igsFeatures.SFEleArray.length; i += 1) {
      const sfele = igsFeatures.SFEleArray[i];
      const { ftype, FID, bound, AttValue, fGeom } = sfele;
      const properties = { fid: FID };
      if (AttValue && tags) {
        for (let a = 0; a < AttValue.length; a += 1) {
          const val = AttValue[a];
          let tag = tags[a];
          if (useAlias) {
            // 如果要求使用别名，那有别名的地方使用别名，没有的使用字段名
            tag = alias && alias[a] && alias[a] !== "" ? alias[a] : tags[a];
          }
          if (
            val !== null &&
            fldType &&
            ["int", "double", "float", "long", "number"].includes(fldType[a])
          ) {
            properties[tag] = Number(val);
          } else {
            properties[tag] = val;
          }
        }
      }
      let coordinates = [];
      let type = "";
      if (ftype === 1) {
        // 点
        if (fGeom.PntGeom) {
          const { Dot } = fGeom.PntGeom[0];
          if (Dot) {
            coordinates = [Dot.x, Dot.y];
          }
        }
        type = "Point";
      } else if (ftype === 2) {
        // 线
        if (fGeom.LinGeom) {
          const { Line } = fGeom.LinGeom[0];
          if (Line) {
            const { Arcs } = Line;
            if (Arcs) {
              const LineDots = Arcs[0].Dots;
              if (LineDots) {
                for (let l = 0; l < LineDots.length; i += 1) {
                  const coord = [LineDots[l].x, LineDots[l].y];
                  coordinates.push(coord);
                }
              }
            }
          }
        }
        type = "LineString";
      } else if (ftype === 3) {
        // 面
        if (fGeom.RegGeom) {
          const { Rings } = fGeom.RegGeom[0];
          if (Rings) {
            const { Arcs } = Rings[0];
            if (Arcs) {
              for (let p = 0; p < Arcs.length; p += 1) {
                const arc = [];
                const PolygonDots = Arcs[p].Dots;
                if (PolygonDots) {
                  for (let d = 0; d < PolygonDots.length; d += 1) {
                    const coord = [PolygonDots[d].x, PolygonDots[d].y];
                    arc.push(coord);
                  }
                  coordinates.push(arc);
                }
              }
            }
          }
        }
        type = "Polygon";
      }
      const geometry = {
        type,
        coordinates
      };
      const feature = {
        type: "Feature",
        properties,
        geometry,
        bound: Object.assign({}, bound)
      };
      geojsonFeatures.features.push(feature);
    }
    return geojsonFeatures;
  }
  /**
   * GeoJSON数据结构转IGServer数据结构
   * @param geojsonFeatures
   */
  static featureGeoJSONTofeatureIGS(geojsonFeatures) {
    const FldAlias = [];
    const FldName = [];
    const FldType = [];
    let FldNumber = 0;
    const SFEleArray = [];
    if (geojsonFeatures.features.length > 0) {
      const pro = geojsonFeatures.features[0].properties;
      Object.keys(pro).forEach(key => {
        if (key !== "geoCenter") {
          FldAlias.push(null);
          FldName.push(key);
          FldNumber += 1;
          if (typeof pro[key] === "string") {
            FldType.push("string");
          } else if (typeof pro[key] === "number") {
            FldType.push("double");
          }
        }
      });
    }
    const AttStruct = {
      FldAlias,
      FldName,
      FldNumber,
      FldType
    };
    for (let i = 0; i < geojsonFeatures.features.length; i += 1) {
      const PntGeom = [];
      const LinGeom = [];
      const RegGeom = [];
      let ftype = 0;
      let bound = {};
      const { geometry } = geojsonFeatures.features[i];
      if (geometry.type === "Point") {
        ftype = 1;
        bound = GeometryExp.calculateBound([geometry.coordinates]);
        const Dot = {
          x: geometry.coordinates[0],
          y: geometry.coordinates[1]
        };
        PntGeom.push({
          Dot,
          GID: 0
        });
      } else if (geometry.type === "LineString") {
        ftype = 2;
        bound = GeometryExp.calculateBound(geometry.coordinates);
        const dots = [];
        for (let j = 0; j < geometry.coordinates.length; j += 1) {
          dots.push({
            x: geometry.coordinates[j][0],
            y: geometry.coordinates[j][1]
          });
        }
        LinGeom.push({
          GID: 0,
          Line: {
            Arcs: [
              {
                ArcID: 0,
                Dots: dots
              }
            ]
          }
        });
      } else if (geometry.type === "Polygon") {
        ftype = 3;
        bound = GeometryExp.calculateBound(geometry.coordinates[0]);
        const dots = [];
        for (let j = 0; j < geometry.coordinates[0].length; j += 1) {
          dots.push({
            x: geometry.coordinates[0][j][0],
            y: geometry.coordinates[0][j][1]
          });
        }
        RegGeom.push({
          GID: 0,
          Rings: [
            {
              Arcs: [
                {
                  ArcID: 0,
                  Dots: dots
                }
              ]
            }
          ]
        });
      }
      const AttValue = [];
      const property = geojsonFeatures.features[i].properties;
      Object.keys(property).forEach(key => {
        if (key !== "geoCenter") {
          AttValue.push(property[key]);
        }
      });
      const data = {
        AttValue,
        FID: i,
        GraphicInfo: {
          AnnInfo: null,
          InfoType: null,
          LinInfo: null,
          PntInfo: null,
          RegInfo: null
        },
        bound,
        fGeom: {
          EntityGeom: [],
          LinGeom,
          PntGeom,
          RegGeom,
          StreamGeom: null,
          SurfaceGeom: []
        },
        ftype
      };
      SFEleArray.push(data);
    }
    const result = {
      AttStruct,
      SFEleArray,
      TotalCount: geojsonFeatures.dataCount || geojsonFeatures.features.length
    };
    const featureSet = new Zondy.Common.FeatureSet(result);
    return featureSet;
  }
  static featureGeoJSONToTangram(obj) {
    const { type } = obj;
    switch (type) {
      case "FeatureCollection":
        return this.toTangram(obj);
      case "Feature":
        return this.featureToTangram(obj);
      default:
        return undefined;
    }
  }
  static toTangram(featureGeoJSON) {
    const { features } = featureGeoJSON;
    return features.map(feature => this.featureToTangram(feature));
  }
  static featureToTangram(gFeature) {
    const { geometry } = gFeature;
    return this.geometryToTangram(geometry);
  }
  static geometryToTangram(gGeometry) {
    const { type, coordinates } = gGeometry;
    let geometry;
    switch (type) {
      case "Point":
        geometry = new GGeometryPoint(coordinates);
        break;
      case "LineString":
        geometry = new GGeometryLine(coordinates);
        break;
      case "Polygon":
        geometry = new GGeometryPolygon(coordinates);
        break;
      case "MultiPolygon":
        geometry = new GGeometryMultiPolygon(coordinates);
        break;
      default:
        throw new Error(`未实现类型:${type}`);
    }
    return geometry.toTangram();
  }
}
