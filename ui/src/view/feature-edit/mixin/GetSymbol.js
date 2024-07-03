import {
  SimpleRenderer,
  SimpleMarkerSymbol,
  SimpleLineSymbol,
  Color,
  TextSymbol,
  Font,
  PictureMarkerSymbol,
  SimpleFillSymbol,
  ClassBreakRenderer
} from "@mapgis/webclient-common";

export default {
  methods: {
    getColor(color) {
      if (!color) return undefined;
      const str = "rgba(";
      const colorStr = color.slice(str.length, color.length - 1);
      const colorArr = colorStr.split(",");
      return new Color(
        Number(colorArr[0]),
        Number(colorArr[1]),
        Number(colorArr[2]),
        Number(colorArr[3])
      );
    },
    formatSimpleLine(layerFeatureItem) {
      const { color, width, cap, join, miterLimit, style } = layerFeatureItem;
      const feature = {
        color: `rgba(${color.red},${color.green},${color.blue},${color.alpha})`,
        width,
        cap,
        join,
        miterLimit,
        style
      };
      return feature;
    },

    getSimpleLineSymbol(lineStyle) {
      const width = Number(lineStyle.width) || 1;
      const color =
        this.getColor(lineStyle.color) || new Color(255, 255, 255, 1);
      const cap = lineStyle.cap || "round";
      const join = lineStyle.join || "round";
      const miterLimit = Number(lineStyle.miterLimit) || 2;
      const style = lineStyle.style || "solid";
      return new SimpleLineSymbol({
        width,
        color,
        cap,
        join,
        miterLimit,
        style
      });
    },

    formatSimpleMarker(layerFeatureItem) {
      const {
        color,
        size,
        style,
        xoffset,
        yoffset,
        angle,
        outline
      } = layerFeatureItem;
      const feature = {
        color: `rgba(${color.red},${color.green},${color.blue},${color.alpha})`,
        size,
        style,
        xoffset,
        yoffset,
        angle,
        simpleLineStyle: this.formatSimpleLine(outline)
      };
      return feature;
    },

    getSimpleMarkerSymbol(simpleMarkerStyle) {
      const color =
        this.getColor(simpleMarkerStyle.color) || new Color(255, 255, 255, 1);
      const size = Number(simpleMarkerStyle.size) || 20;
      const style = simpleMarkerStyle.style || "circle";
      const xoffset = Number(simpleMarkerStyle.xoffset) || 0;
      const yoffset = Number(simpleMarkerStyle.yoffset) || 0;
      const angle = Number(simpleMarkerStyle.angle) || 0;
      const outline = this.getSimpleLineSymbol(
        simpleMarkerStyle.simpleLineStyle
      );
      return new SimpleMarkerSymbol({
        color,
        size,
        style,
        xoffset,
        yoffset,
        angle,
        outline
      });
    },

    formatText(layerFeatureItem) {
      const {
        color,
        font,
        xoffset,
        yoffset,
        horizontalAlignment,
        verticalAlignment,
        lineHeight,
        text
      } = layerFeatureItem;
      return {
        color: `rgba(${color.red},${color.green},${color.blue},${color.alpha})`,
        font: font.family,
        xoffset,
        yoffset,
        horizontalAlignment,
        verticalAlignment,
        lineHeight,
        text
      };
    },

    getTextSymbol(textStyle) {
      const color = this.getColor(textStyle.color) || new Color(0, 0, 0, 1);
      const font = new Font({
        family: textStyle.font || "宋体",
        size: 24,
        style: "normal",
        weight: "normal"
      });
      const horizontalAlignment = textStyle.horizontalAlignment || "center";
      const lineHeight = textStyle.lineHeight || 1;
      const text = textStyle.text || "";
      const verticalAlignment = textStyle.verticalAlignment || "baseline";
      const xoffset = Number(textStyle.xoffset) || 0;
      const yoffset = Number(textStyle.yoffset) || 0;
      return new TextSymbol({
        color,
        font,
        horizontalAlignment,
        lineHeight,
        text,
        verticalAlignment,
        xoffset,
        yoffset
      });
    },

    formatPictureMarker(layerFeatureItem) {
      const {
        angle,
        color,
        height,
        url,
        width,
        xoffset,
        yoffset
      } = layerFeatureItem;
      return {
        color: `rgba(${color.red},${color.green},${color.blue},${color.alpha})`,
        width,
        height,
        url,
        xoffset,
        yoffset,
        angle
      };
    },

    getPictureMarkerSymbol(pictureMarkerStyle) {
      const color =
        this.getColor(pictureMarkerStyle.color) || new Color(255, 255, 255, 1);
      const width = pictureMarkerStyle.width || 20;
      const height = pictureMarkerStyle.height || 20;
      const url = pictureMarkerStyle.url || "";
      const xoffset = pictureMarkerStyle.xoffset || 0;
      const yoffset = Number(pictureMarkerStyle.yoffset) || 0;
      const angle = Number(pictureMarkerStyle.angle) || 0;
      return new PictureMarkerSymbol({
        color,
        width,
        height,
        url,
        xoffset,
        yoffset,
        angle
      });
    },

    formatSimpleFill(layerFeatureItem) {
      const { style, color, outline } = layerFeatureItem;
      const feature = {
        color: `rgba(${color.red},${color.green},${color.blue},${color.alpha})`,
        style,
        simpleLineStyle: this.formatSimpleLine(outline)
      };
      return feature;
    },

    getSimpleFillSymbol(simpleFillStyle) {
      const color =
        this.getColor(simpleFillStyle.color) || new Color(255, 255, 255, 0.25);
      const style = simpleFillStyle.style;
      const outline = this.getSimpleLineSymbol(simpleFillStyle.simpleLineStyle);
      return new SimpleFillSymbol({
        color,
        style,
        outline
      });
    },

    getClass(style, featureType) {
      if (featureType == "Reg") {
        return "solid-Reg";
      } else if (featureType == "Lin") {
        return "solid-Lin";
      } else {
        return `${style}-${featureType}`;
      }
    }
  }
};
