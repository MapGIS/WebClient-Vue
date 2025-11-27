import * as Zondy from "@mapgis/webclient-es6-service";
import {
  Polygon,
  GeometryEngine,
  Point,
  SpatialReference
} from "@mapgis/webclient-common";

export class GeometryExp {
  static calculateBound(dots) {
    const bound = {
      xmin: dots[0][0],
      ymin: dots[0][1],
      xmax: dots[0][0],
      ymax: dots[0][1]
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
   * 计算单个多边形的label点
   * @private
   * @param {Polygon} polygon 多边形几何对象
   * @return {Point | null} 计算好的label点
   * */
  static getPolygonLabel(coordinates) {
    const polygon = new Polygon({ coordinates: [coordinates] });
    // 1 获取算法必要的参数
    const _coordinates = polygon.coordinates;
    // 1.1 获取多边形外包盒
    const _extent = polygon.extent;
    // 1.2 通过外包盒的最小最大Y值，计算一个在此区间内的Y值，通过此值来构造一个相交线来计算与多边形内外圈的交点
    let _middleY = (_extent.ymin + _extent.ymax) / 2;
    // 1.3 middleY构成的线可能会和多边形的内外圈有多个交点，先将这些点存起来，最终通过这些交点计算label点
    const _middleYCrossArray = [];
    // 1.4 middleY和多边形的内外圈的交点对象
    let _middleYCross = {
      // 如果多边形某个圈中的某个点在middleY构成的线上，则将该点的x坐标保存下来
      // 如果多边形的某个圈中的某个点不在middleY构成的线上，则将其和其前一个点连成一个的线段，将该线段和middleY构成的线的交点的x坐标保存下来
      x: undefined,
      // 如果多边形某个圈中的某个点在middleY构成的线上，则将其相邻的一个点的x坐标也保存下来
      x2: undefined,
      // 是否含有两个x坐标
      hasTwoXCoordinate: false
    };
    // 1.5 是否退出while循环的标志位
    let _exit = false;
    // 1.6 最终计算出的label点坐标，仅会计算出一个label点
    let _label;

    // 2 开始计算label点
    do {
      // 2.1 每次循环开始清空label点
      _label = [];

      // 2.2 如果内圈时凹多边形，label点有可能在多边形内，因此分别对多边形的外圈和内圈计算label点
      for (let i = 0; i < _coordinates.length; i++) {
        const _ringCoords = _coordinates[i];
        // 2.2.1 循环遍历多边形某个圈(外圈或内圈)的label点，循环下标从1开始，一次循环设计三个点，分别为_ringCoords[j-1]，_ringCoords[j]，_ringCoords[j+1]
        for (let j = 1; j < _ringCoords.length; j++) {
          // 2.2.2 只有在_ringCoords[j - 1]和_ringCoords[j]的y坐标的最小值小于middleY，
          // _ringCoords[j - 1]和_ringCoords[j]的y坐标的最大值大于middleY的情况下才进行label点的计算
          if (
            Math.min(_ringCoords[j - 1][1], _ringCoords[j][1]) <= _middleY &&
            Math.max(_ringCoords[j - 1][1], _ringCoords[j][1]) > _middleY
          ) {
            // 2.2.3 如果_ringCoords[j]的y坐标等于middleY
            if (_ringCoords[j][1] === _middleY) {
              _middleYCross = {
                x: undefined,
                x2: undefined,
                hasTwoXCoordinate: false
              };
              // 存储_ringCoords[j]的x坐标
              _middleYCross.x = _ringCoords[j][0];
              _middleYCross.hasTwoXCoordinate = false;
              // 如果_ringCoords[j]后面还一个点，也存储其x坐标
              if (j < _ringCoords.length - 1) {
                if (_ringCoords[j + 1][1] === _middleY) {
                  _middleYCross.hasTwoXCoordinate = true;
                  _middleYCross.x2 = _ringCoords[j + 1][0];
                }
              }
              _middleYCrossArray.push(_middleYCross);
            }
            // 2.2.4 如果_ringCoords[j - 1]的y坐标等于middleY，计算一个备选的label点
            else if (_ringCoords[j - 1][1] === _middleY) {
              _middleYCross = {
                x: undefined,
                x2: undefined,
                hasTwoXCoordinate: false
              };
              // 存储_ringCoords[j - 1]的x坐标
              _middleYCross.x = _ringCoords[j - 1][0];
              _middleYCross.hasTwoXCoordinate = false;
              if (j > 1) {
                // 存储_ringCoords[j - 2]的x坐标
                if (_ringCoords[j - 2] === _middleY) {
                  _middleYCross.hasTwoXCoordinate = true;
                  _middleYCross.x2 = _ringCoords[j - 2][0];
                }
              }
              _middleYCrossArray.push(_middleYCross);
            }
            // 2.2.4 如果_ringCoords[j]和_ringCoords[j - 1]的y坐标都不等于middleY
            else {
              _middleYCross = {
                x: undefined,
                x2: undefined,
                hasTwoXCoordinate: false
              };
              // 计算_ringCoords[j]和_ringCoords[j - 1]连成的线和middleY的交点的x坐标
              //          _ringCoords[j]
              //               /
              // _middleY ----交点 ---
              //             /
              //     _ringCoords[j - 1]
              _middleYCross.x =
                _ringCoords[j][0] -
                ((_ringCoords[j][0] - _ringCoords[j - 1][0]) /
                  (_ringCoords[j][1] - _ringCoords[j - 1][1])) *
                  (_ringCoords[j][1] - _middleY);
              _middleYCross.hasTwoXCoordinate = false;
              _middleYCrossArray.push(_middleYCross);
            }
          }
        }
      }

      // 2.3 开始计算label点
      // 2.3.1 一个区至少应和middleY构成的线有两个交点，只有一个或没有交点，则不具备计算label点的条件，退出while循环，返回null
      if (_middleYCrossArray.length >= 2) {
        // 2.3.1.1 对middleY构成的线上的交点，通过x坐标的值从大到小进行排序
        _middleYCrossArray.sort(function(A, B) {
          return (A.x ?? 0) - (B.x ?? 0);
        });

        // 2.3.1.2 通过交点计算label点坐标
        // 两个交点之间x的差值
        let _distance = 0;
        // 每次循环获取两个点，例如p1和2，计算两个点之间x坐标的差值，如果大于distance，则更新distance
        // 只有两个点x坐标的差值大于distance，才会通过两个交点的x坐标除以2来计算label点的x坐标，label点的y坐标就是middleY
        //     |----------------|
        //     |    |-----|     |
        //     |    |     |     |
        // ---p1---p2----p3----p4--
        //     |    |     |     |
        //     |    |-----|     |
        //     -----------------
        for (let i = 0; i < _middleYCrossArray.length - 1; i += 2) {
          let _x1 = _middleYCrossArray[i].x;
          let _x2 = _middleYCrossArray[i + 1].x;
          if (_x1 !== _x2) {
            if (Math.abs(_x1 - _x2) > _distance) {
              _distance = Math.abs(_x1 - _x2);
              if (_middleYCrossArray[i].hasTwoXCoordinate) {
                _x1 = Math.max(_x1, _middleYCrossArray[i].x2);
              }
              if (_middleYCrossArray[i + 1].hasTwoXCoordinate) {
                _x2 = Math.min(_x2, _middleYCrossArray[i + 1].x2);
              }
              _label[0] = (_x1 + _x2) / 2;
              _label[1] = _middleY;
              // 确定退出while循环
              _exit = true;
            }
          }
        }
        // 如果要退出循环，在判断label点是否在多边形内
        // 在多边形内，则退出while循环
        // 如果不在多边形内，则将middleY增加(extent.ymax - extent.ymin) / 101，继续循环寻找label点
        if (_exit) {
          const _isContains = GeometryEngine.contains(
            polygon,
            new Point({
              coordinates: [_label[0], _label[1]],
              spatialReference: SpatialReference.fromJSON(
                polygon.spatialReference
              )
            })
          );
          if (!_isContains) {
            _exit = false;
            _label = [];
          }
        }
      }
      // 2.3.2 交点数量小于2，不计算label点，并退出while循环
      else {
        _exit = true;
      }
      // 如果本次循环未找到label点则将middleY增加(extent.ymax - extent.ymin) / 101，继续循环寻找label点
      if (!_exit) {
        _middleY += (_extent.ymax - _extent.ymin) / 101;
      }
    } while (!_exit);

    // 3 返回寻找到的label点坐标
    if (_label.length === 0) {
      return null;
    }
    return new Point({
      coordinates: [_label[0], _label[1], 0],
      spatialReference: SpatialReference.fromJSON(polygon.spatialReference)
    });
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
  static creatRectangleByViewRectangle(rect) {
    return new Zondy.Common.Rectangle(
      rect.west,
      rect.south,
      rect.east,
      rect.north
    );
  }
  static creatRectByMinMax(xMin, yMin, xMax, yMax) {
    return new Zondy.Common.Rectangle(xMin, yMin, xMax, yMax);
  }
}
