import * as Zondy from '@mapgis/webclient-es6-service';
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
        return new Zondy.Common.Rectangle(rect.west, rect.south, rect.east, rect.north);
    }
    static creatRectByMinMax(xMin, yMin, xMax, yMax) {
        return new Zondy.Common.Rectangle(xMin, yMin, xMax, yMax);
    }
}
