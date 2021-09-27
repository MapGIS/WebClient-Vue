import { Geometry } from "./Geometry";
import { extend } from "@mapgis/webclient-es6-service/common";
import * as H from "@turf/helpers";
import * as T from "@turf/turf";

class VPoint extends Geometry {
  static getPointsCoordinates(FeatureSet) {
    let pointsArr = [];
    for (let i = 0; i < FeatureSet.length; i++) {
      for (let j = 0; j < FeatureSet[i].geometry.length; j++) {
        pointsArr.push(FeatureSet[i].geometry[j].coordinates);
      }
    }
    return pointsArr;
  }
  static getPointsCenter(pointsArr) {
    let centers = [],
      center;
    for (let i = 0; i < pointsArr.length; i++) {
      centers.push(H.point(pointsArr[i]));
    }
    center = T.center(T.featureCollection(centers));
    return center;
  }
  /**
   * 获取多边形重心
   * @param lnglats
   * @returns {number[]}
   */
  static getCenterOfGravityPoint(lnglats) {
    let area = 0.0; // 多边形面积
    let Gx = 0.0;
    let Gy = 0.0; // 重心的x、y
    for (let i = 1; i <= lnglats.length; i += 1) {
      const iLat = lnglats[i % lnglats.length][1];
      const iLng = lnglats[i % lnglats.length][0];
      const nextLat = lnglats[i - 1][1];
      const nextLng = lnglats[i - 1][0];
      const temp = (iLat * nextLng - iLng * nextLat) / 2.0;
      area += temp;
      Gy += (temp * (iLat + nextLat)) / 3.0;
      Gx += (temp * (iLng + nextLng)) / 3.0;
    }
    return [Gx / area, Gy / area];
  }
  constructor(options) {
    super();
    this.type = "Point";
    extend(this, options);
  }
}

export { VPoint };
