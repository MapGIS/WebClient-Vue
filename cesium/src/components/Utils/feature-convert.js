export function calculateBound(dots) {
  const bound = {
    xmin: dots[0][0],
    ymin: dots[0][1],
    xmax: dots[0][0],
    ymax: dots[0][1],
  };
  for (let i = 0; i < dots.length; i += 1) {
    if (bound.xmin && dots[i][0] < bound.xmin) {
      bound.xmin = dots[i][0];
    }
    if (bound.ymin && dots[i][1] < bound.ymin) {
      bound.ymin = dots[i][1];
    }
    if (bound.xmax && dots[i][0] > bound.xmax) {
      bound.xmax = dots[i][0];
    }
    if (bound.ymax && dots[i][1] > bound.ymax) {
      bound.ymax = dots[i][1];
    }
  }
  return bound;
}

/**
 * IGServer数据结构转为GeoJSON数据结构
 * @param igsFeatures
 * @param useAlias 转换后的属性key值是否使用FldAlias，默认使用FldName
 */
export function featureIGSToFeatureGeoJSON(igsFeatures, useAlias) {
  const dataCount =
    igsFeatures.TotalCount > -1
      ? igsFeatures.TotalCount
      : igsFeatures.SFEleArray.length;
  const geojsonFeatures = {
    type: "FeatureCollection",
    features: [],
    dataCount,
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
              for (let l = 0; l < LineDots.length; l += 1) {
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
      coordinates,
    };

    const feature = {
      type: "Feature",
      properties,
      geometry,
      bound: { ...bound },
    };
    geojsonFeatures.features.push(feature);
  }
  return geojsonFeatures;
}

/**
 * GeoJSON数据结构转IGServer数据结构
 * @param geojsonFeatures
 */
export function featureGeoJSONTofeatureIGS(geojsonFeatures) {
  const FldAlias = [];
  const FldName = [];
  const FldType = [];
  let FldNumber = 0;
  const SFEleArray = [];
  if (geojsonFeatures.features.length > 0) {
    const pro = geojsonFeatures.features[0].properties;
    Object.keys(pro).forEach((key) => {
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
    FldType,
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
      bound = calculateBound([geometry.coordinates]);
      const Dot = {
        x: geometry.coordinates[0],
        y: geometry.coordinates[1],
      };
      PntGeom.push({
        Dot,
        GID: 0,
      });
    } else if (geometry.type === "LineString") {
      ftype = 2;
      bound = calculateBound(geometry.coordinates);
      const dots = [];
      for (let j = 0; j < geometry.coordinates.length; j += 1) {
        dots.push({
          x: geometry.coordinates[j][0],
          y: geometry.coordinates[j][1],
        });
      }
      LinGeom.push({
        GID: 0,
        Line: {
          Arcs: [
            {
              ArcID: 0,
              Dots: dots,
            },
          ],
        },
      });
    } else if (geometry.type === "Polygon") {
      ftype = 3;
      bound = calculateBound(geometry.coordinates[0]);
      const dots = [];
      for (let j = 0; j < geometry.coordinates[0].length; j += 1) {
        dots.push({
          x: geometry.coordinates[0][j][0],
          y: geometry.coordinates[0][j][1],
        });
      }
      RegGeom.push({
        GID: 0,
        Rings: [
          {
            Arcs: [
              {
                ArcID: 0,
                Dots: dots,
              },
            ],
          },
        ],
      });
    }
    const AttValue = [];
    const property = geojsonFeatures.features[i].properties;
    Object.keys(property).forEach((key) => {
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
        RegInfo: null,
      },
      bound,
      fGeom: {
        EntityGeom: [],
        LinGeom,
        PntGeom,
        RegGeom,
        StreamGeom: null,
        SurfaceGeom: [],
      },
      ftype,
    };

    SFEleArray.push(data);
  }
  const result = {
    AttStruct,
    SFEleArray,
    TotalCount: geojsonFeatures.dataCount || geojsonFeatures.features.length,
  };
  // const featureSet = new Zondy.Common.FeatureSet(result);
  return result;
}

/**
 * GeoJSON数据结构转IGServer数据结构，用于缓冲分析
 * @param geojsonFeatures
 */
export function featureGeoJSONTofeatureIGSForBuffer(geojsonFeatures) {
  const FldAlias = [];
  const FldName = [];
  const FldType = [];
  let FldNumber = 0;
  const SFEleArray = [];
  if (geojsonFeatures.features.length > 0) {
    const pro = geojsonFeatures.features[0].properties;
    Object.keys(pro).forEach((key) => {
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
  const AttStruct = new Zondy.Object.CAttStruct({
    FldAlias,
    FldName,
    FldNumber,
    FldType,
  });
  const sfGeometry = [];
  const attRows = [];
  for (let i = 0; i < geojsonFeatures.features.length; i += 1) {
    const PntGeom = [];
    const LinGeom = [];
    const RegGeom = [];
    let ftype = 0;
    let bound = {};
    const { geometry } = geojsonFeatures.features[i];
    if (geometry.type === "Point") {
      const pntGeo = new Zondy.Object.FeatureGeometry();
      const gPnt = new Zondy.Object.GPoint(
        geometry.coordinates[0],
        geometry.coordinates[1]
      );
      pntGeo.setPntGeom([gPnt]);
      sfGeometry.push(pntGeo);
    } else if (geometry.type === "LineString") {
      const dots = [];
      for (let j = 0; j < geometry.coordinates.length; j += 1) {
        const linePoint = new Zondy.Object.Point2D(
          geometry.coordinates[j][0],
          geometry.coordinates[j][1]
        );
        dots.push(linePoint);
      }
      const lineGeo = new Zondy.Object.FeatureGeometry();
      const gLine = new Zondy.Object.GLine(
        new Zondy.Object.AnyLine([new Zondy.Object.Arc(dots)])
      );
      lineGeo.setLine([gLine]);
      sfGeometry.push(lineGeo);
    } else if (geometry.type === "MultiLineString") {
      const gLine = [];
      for (let j = 0; j < geometry.coordinates.length; j += 1) {
        const dots = [];
        for (let c = 0; c < geometry.coordinates[j].length; c++) {
          dots.push({
            x: geometry.coordinates[j][c][0],
            y: geometry.coordinates[j][c][1],
          });
        }
        gLine.push(
          new Zondy.Object.GLine(
            new Zondy.Object.AnyLine([new Zondy.Object.Arc(dots)])
          )
        );
      }
      const lineGeo = new Zondy.Object.FeatureGeometry();
      lineGeo.setLine(gLine);
      sfGeometry.push(lineGeo);
    } else if (geometry.type === "Polygon") {
      const dots = [];
      for (let j = 0; j < geometry.coordinates[0].length; j += 1) {
        const polygonPoint = new Zondy.Object.Point2D(
          geometry.coordinates[0][j][0],
          geometry.coordinates[0][j][1]
        );
        dots.push(polygonPoint);
      }
      const regGeo = new Zondy.Object.FeatureGeometry();
      const gReg = new Zondy.Object.GRegion([
        new Zondy.Object.AnyLine([new Zondy.Object.Arc(dots)]),
      ]);
      regGeo.setRegGeom([gReg]);
      sfGeometry.push(regGeo);
    } else if (geometry.type === "MultiPolygon") {
      ftype = 3;
      bound = GeometryExp.calculateBound(geometry.coordinates[0]);
      const RegGeom = [];
      for (let j = 0; j < geometry.coordinates.length; j += 1) {
        const dots = [];
        for (let c = 0; c < geometry.coordinates[j][0].length; c++) {
          dots.push({
            x: geometry.coordinates[j][0][c][0],
            y: geometry.coordinates[j][0][c][1],
          });
        }
        RegGeom.push(new Zondy.Object.AnyLine([new Zondy.Object.Arc(dots)]));
      }
      const regGeo = new Zondy.Object.FeatureGeometry();
      const gReg = new Zondy.Object.GRegion(RegGeom);
      regGeo.setRegGeom([gReg]);
      sfGeometry.push(regGeo);
    }
    const AttValue = [];
    const property = geojsonFeatures.features[i].properties;
    Object.keys(property).forEach((key) => {
      if (key !== "geoCenter") {
        AttValue.push(property[key]);
      }
    });
    const dataRow = new Zondy.Object.CAttDataRow(AttValue, 1);
    attRows.push(dataRow);
  }
  return { AttStruct, sfGeometry, attRows };
}
