export const LegendType = {
  PNG: "image/png",
  JPEG: "image/jpg",
  SVG: "image/svg+xml"
};

export class LegendItem {
  contentType;
  height;
  width;
  imageData;
  label;
  url;
  values;

  constructor(options) {
    options = options || {};
    const {
      contentType,
      height,
      width,
      imageData,
      label,
      url,
      values
    } = options;
    this.contentType = contentType || LegendType.PNG;
    this.height = height || 24;
    this.width = width || 24;
    this.imageData = imageData || undefined;
    this.label = label || undefined;
    this.url = url || undefined;
    this.values = values || [];
  }

  createCanvas(width, height) {
    let canvas = document.createElement("canvas");
    canvas.width = width || 24;
    canvas.height = height || 24;
    return canvas;
  }

  drawPoint(point) {
    let {
      cx,
      cy,
      r,
      stroke = "#000000",
      strokeWidth = 1,
      fill = "#000000",
      width = 24,
      height = 24
    } = point;
    let canvas = this.createCanvas(width, height);

    cx = cx || width / 2;
    cy = cy || height / 2;
    r = r || Math.min(cx, cy) / 2;

    let ctx = canvas.getContext("2d");

    ctx.beginPath();
    ctx.lineWidth = strokeWidth;
    ctx.strokeStyle = stroke;
    ctx.arc(cx, cy, r, 0, Math.PI * 2, false);
    ctx.stroke();

    ctx.fillStyle = fill;
    ctx.fill();

    let base64 = canvas.toDataURL("image/png", 1);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    return base64;
  }

  drawLine(line) {
    let {
      stroke = "#000000",
      strokeWidth = 8,
      strokeLineJoin = "round",
      width = 24,
      height = 24
    } = line;

    let canvas = this.createCanvas(width, height);

    let ctx = canvas.getContext("2d");
    let padding = 3;

    ctx.beginPath();
    ctx.moveTo(padding, height / 2);
    ctx.lineTo(width - padding, height / 2);
    ctx.closePath();
    ctx.lineWidth = strokeWidth;
    ctx.lineJoin = strokeLineJoin;
    ctx.strokeStyle = stroke;
    ctx.stroke();

    let base64 = canvas.toDataURL("image/png", 1);
    ctx.clearRect(
      0,
      0,
      canvas.width - 2 * strokeWidth,
      canvas.height - 2 * strokeWidth
    );
    return base64;
  }

  drawPolygon(polygon) {
    let {
      stroke = "#000000",
      strokeWidth = 0,
      fill = "#000000",
      width = 24,
      height = 24
    } = polygon;

    let canvas = this.createCanvas(width, height);

    let ctx = canvas.getContext("2d");
    let padding = strokeWidth;

    ctx.beginPath();
    ctx.lineWidth = strokeWidth;
    ctx.strokeStyle = stroke;
    ctx.fillStyle = fill;
    ctx.rect(padding, padding, width, height);
    ctx.stroke();
    ctx.fill();

    let base64 = canvas.toDataURL("image/png", 1);
    ctx.clearRect(
      0,
      0,
      canvas.width - 2 * strokeWidth,
      canvas.height - 2 * strokeWidth
    );
    return base64;
  }
}

export class Legend {
  layerId;
  layerName;
  layerType;
  legend;
  maxScale;
  minScale;

  constructor(options) {
    options = options || {};
    const {
      layerId,
      layerName,
      layerType,
      legend,
      maxScale,
      minScale
    } = options;
    this.layerId = layerId || "unkown";
    this.layerName = layerName || "unkown";
    this.layerType = layerType || "unkown";
    this.legend = legend || [];
    this.minScale = minScale || 0;
    this.maxScale = maxScale || 99999999;
  }

  addLegend(item) {
    this.legend.push(item);
  }
}
