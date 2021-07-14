import { Legend, LegendItem } from "./base";
import { uuid } from "../util";
import { Sprite } from "../sprite/sprite";

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
    layers.forEach(layer => {
      const layerName = layer["source-layer"];
      if (this.checkVectorLayer(layer)) {
        if (layerName) {
          if (!layerObj[layerName]) {
            layerObj[layerName] = {
              layer,
              layerId: uuid(),
              layerName,
              legend: [],
              maxScale: 99999999,
              minScale: 0
            };
          }
          const item = this.getLegendItemByMap(layer);
          if (layerObj[layerName]) {
            layerObj[layerName].legend.push(item);
          }
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
    }
    legenditem.imageData = base64;
    legenditem.label = layer.id;
    return legenditem;
  }
}

export default MvtLegend;
