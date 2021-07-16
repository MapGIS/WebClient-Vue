import FeatureService from "../../map/mixins/FeatureService";

export default {
  inject: ["mapbox", "map"],
  props: {
  },
  data() {
    return {};
  },
  methods: {
    $_gradientColor(startColor, endColor, step){
      let startRGB = this.$_colorRgb(startColor);//转换为rgb数组模式
      let startR = startRGB[0];
      let startG = startRGB[1];
      let startB = startRGB[2];

      let endRGB = this.$_colorRgb(endColor);
      let endR = endRGB[0];
      let endG = endRGB[1];
      let endB = endRGB[2];

      let sR = (endR - startR) / step;//总差值
      let sG = (endG - startG) / step;
      let sB = (endB - startB) / step;

      let colorArr = [];
      for (let i = 0; i < step; i++) {
        //计算每一步的hex值
        let hex = this.$_colorHex('rgb(' + parseInt((sR * i + startR)) + ',' + parseInt((sG * i + startG)) + ',' + parseInt((sB * i + startB)) + ')');
        colorArr.push(hex);
      }
      return colorArr;
    },
    $_colorRgb(sColor){
      let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
      sColor = sColor.toLowerCase();
      if (sColor && reg.test(sColor)) {
        if (sColor.length === 4) {
          let sColorNew = "#";
          for (let i = 1; i < 4; i += 1) {
            sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
          }
          sColor = sColorNew;
        }
        //处理六位的颜色值
        let sColorChange = [];
        for (let i = 1; i < 7; i += 2) {
          sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
        }
        return sColorChange;
      } else {
        return sColor;
      }
    },
    $_colorHex(rgb){
      let _this = rgb;
      let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
      if (/^(rgb|RGB)/.test(_this)) {
        let aColor = _this.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
        let strHex = "#";
        for (let i = 0; i < aColor.length; i++) {
          let hex = Number(aColor[i]).toString(16);
          hex = hex < 10 ? 0 + '' + hex : hex;// 保证每个rgb的值为2位
          if (hex === "0") {
            hex += hex;
          }
          strHex += hex;
        }
        if (strHex.length !== 7) {
          strHex = _this;
        }
        return strHex;
      } else if (reg.test(_this)) {
        let aNum = _this.replace(/#/, "").split("");
        if (aNum.length === 6) {
          return _this;
        } else if (aNum.length === 3) {
          let numHex = "#";
          for (let i = 0; i < aNum.length; i += 1) {
            numHex += (aNum[i] + aNum[i]);
          }
          return numHex;
        }
      } else {
        return _this;
      }
    },
    $_toggleLayer() {
      let show = this.showLayer ? "none" : "visible";
      this.showLayer = !this.showLayer;
      this.map.setLayoutProperty(this.layerVectorId, 'visibility', show);
    },
    $_closePanel() {
      this.showPanel = false;
      this.$_toggleLayer();
    },
    $_removeLayer() {
      let layer = this.map.getLayer(this.layerVectorId);
      if (layer) {
        this.map.removeLayer(this.layerVectorId);
      }
    },
    $_mount(){
      if (this.sourceId && this.sourceLayer) {
        if (this.useOriginLayer) {
          throw new Error("请将useOriginLayer设为false！");
        } else {
          this.$_getFromSource(this.sourceLayer);
        }
      } else if (this.layerId) {
        if (!this.useOriginLayer) {
          throw new Error("请将useOriginLayer设为true！");
        } else {
          this.$_getFromSource(this.layerId);
        }
      } else if (this.baseUrl) {
        this.$_getFromGeoJSON();
      }
    },
    $_lineWidthChanged(lineWidth) {
      this.$set(this.layerVector.paint, "line-width", lineWidth);
    },
    $_radiusChanged(radius) {
      this.$set(this.layerVector.paint, "circle-radius", radius);
    },
    $_getFields(features) {
      let fields = [];
      Object.keys(features.properties).forEach(function (key) {
        fields.push(key);
      });
      return fields;
    },
    $_changeOriginLayer() {
      let vm = this;
      if (this.useOriginLayer) {
        Object.keys(this.layerVector.paint).forEach(function (key) {
          vm.map.setPaintProperty(vm.layerId, key, vm.layerVector.paint[key]);
        });
      }
    },
    $_getFromSource(layerId) {
      let features = this.map.queryRenderedFeatures({layers: [layerId]});
      if (features.length === 0) {
        return;
      }
      let featureCollection = {
        features: [],
        type: "FeatureCollection"
      };
      for (let i = 0; i < features.length; i++) {
        featureCollection.features.push({
          geometry: features[i].geometry,
          properties: features[i].properties,
          type: "Feature"
        });
      }
      this.$_initTheme(featureCollection);
    },
    $_getFromGeoJSON() {
      let vm = this;
      FeatureService.get(this.baseUrl, function (result) {
        result = JSON.parse(result);
        vm.$_initTheme(result);
      }, function (e) {
        console.log(e);
      });
    }
  }
};
