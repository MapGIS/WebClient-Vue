import { Legend, LegendItem } from "./base";
import { uuid } from "../util";
import { Sprite } from "../sprite/sprite";

const RasterTileBase64 =
  "data:image/png;base64,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";

const FilterLayers = [
  "gl-draw-polygon-fill-inactive.cold",
  "gl-draw-polygon-fill-active.cold",
  "gl-draw-polygon-midpoint.cold",
  "gl-draw-polygon-stroke-inactive.cold",
  "gl-draw-polygon-stroke-active.cold",
  "gl-draw-line-inactive.cold",
  "gl-draw-line-active.cold",
  "gl-draw-polygon-and-line-vertex-stroke-inactive.cold",
  "gl-draw-polygon-and-line-vertex-inactive.cold",
  "gl-draw-point-point-stroke-inactive.cold",
  "gl-draw-point-inactive.cold",
  "gl-draw-point-stroke-active.cold",
  "gl-draw-point-active.cold",
  "gl-draw-polygon-fill-static.cold",
  "gl-draw-polygon-stroke-static.cold",
  "gl-draw-line-static.cold",
  "gl-draw-point-static.cold",
  "gl-draw-polygon-fill-inactive.hot",
  "gl-draw-polygon-fill-active.hot",
  "gl-draw-polygon-midpoint.hot",
  "gl-draw-polygon-stroke-inactive.hot",
  "gl-draw-polygon-stroke-active.hot",
  "gl-draw-line-inactive.hot",
  "gl-draw-line-active.hot",
  "gl-draw-polygon-and-line-vertex-stroke-inactive.hot",
  "gl-draw-polygon-and-line-vertex-inactive.hot",
  "gl-draw-point-point-stroke-inactive.hot",
  "gl-draw-point-inactive.hot",
  "gl-draw-point-stroke-active.hot",
  "gl-draw-point-active.hot",
  "gl-draw-polygon-fill-static.hot",
  "gl-draw-polygon-stroke-static.hot",
  "gl-draw-line-static.hot",
  "gl-draw-point-static.hot"
];

export class MvtLegend {
  /**
   * @type Sprite
   */
  sprite;

  constructor() {
    // standard legend
  }

  getLegend(options) {
    const { map } = options;
    if (map) {
      return this.getLegendByMap(map);
    }
  }

  getLegendByMap(map) {
    const legends = [];
    const layerObj = {};

    if (!map) {
      return legends;
    }

    const style = map.getStyle();
    const { layers } = style;
    layers
      .filter(l => FilterLayers.indexOf(l.id) < 0)
      .forEach(layer => {
        if (this.checkVectorLayer(layer)) {
          let title = layer["source-layer"] || layer.id;
          if (title) {
            if (!layerObj[title]) {
              layerObj[title] = {
                layer,
                layerId: uuid(),
                layerName: title,
                legend: [],
                maxScale: 99999999,
                minScale: 0
              };
            }
          } else if (layer.id) {
            layerObj[layer.id] = {
              layer,
              layerId: uuid(),
              layerName: title,
              legend: [],
              maxScale: 99999999,
              minScale: 0
            };
          }
          const item = this.getLegendItemByMap(layer);
          if (layerObj[title]) {
            layerObj[title].legend.push(item);
          }
        } else if (this.checkRasterLayer(layer)) {
          let title = layer.id;
          layerObj[title] = {
            layer,
            layerId: uuid(),
            layerName: title,
            legend: [],
            maxScale: 99999999,
            minScale: 0
          };
          const item = this.getLegendItemByMap(layer);
          if (layerObj[title]) {
            layerObj[title].legend.push(item);
          }
        }
      });

    Object.keys(layerObj).forEach(k => {
      const item = layerObj[k];
      // const { layerId, layerName, legend, maxScale, minScale } = item;
      const legend = new Legend(item);
      legends.push(legend);
    });

    return legends;
  }

  checkVectorLayer(layer) {
    let isValid = false;
    if (
      layer.type === "circle" ||
      layer.type === "line" ||
      layer.type === "fill"
    ) {
      isValid = true;
    }
    return isValid;
  }

  checkRasterLayer(layer) {
    let isValid = false;
    if (layer.type === "raster") {
      isValid = true;
    }
    return isValid;
  }

  getLegendItemByMap(layer) {
    const legenditem = new LegendItem();
    let base64;
    const paint = layer.paint;
    const layout = layer.layout;
    if (layer.type === "circle") {
      let point = {};
      if (layer.paint) {
        point.r = paint["circle-radius"];
        point.stroke = paint["circle-stroke-color"];
        point.strokeWidth = paint["circle-stroke-width"];
        point.fill = paint["circle-color"];
        base64 = legenditem.drawPoint(point);
      }
    } else if (layer.type === "line") {
      let line = {};
      if (layer.paint) {
        line.strokeWidth = paint["line-width"];
        line.stroke = paint["line-color"];
      }
      if (layout) {
        line.strokeLineJoin = layout["line-cap"];
      }
      if (paint && paint["line-pattern"]) {
        // base64 = this.sprite.getSpriteItem(style["line-pattern"]);
      } else {
        base64 = legenditem.drawLine(line);
      }
    } else if (layer.type === "fill") {
      let polygon = {};
      if (layer.paint) {
        polygon.stroke = paint["fill-outline-color"];
        polygon.fill = paint["fill-color"];
        if (paint && paint["fill-pattern"]) {
          // base64 = this.sprite.getSpriteItem(style["fill-pattern"]);
        } else {
          base64 = legenditem.drawPolygon(polygon);
        }
      }
    } else if (layer.type === "raster") {
      base64 = RasterTileBase64;
    }
    legenditem.imageData = base64;
    legenditem.label = layer.id;
    return legenditem;
  }
}

export default MvtLegend;
