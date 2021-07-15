<template>
  <div>
    <ThemePanel
        :data-source="dataSource"
        :fields="fields"
        :colors="colors"
        :dataType="dataType"
        :checkBoxArr="checkBoxArr"
        @change="$_selectChange"
        @checked="$_checked"
        @gradientChange="$_gradientChange"
        @lineColorChanged="$_lineColorChanged"
        @opacityChanged="$_opacityChanged"
        @oneColorChanged="$_oneColorChanged"
        @radiusChanged="$_radiusChanged"
        @lineWidthChanged="$_lineWidthChanged"
    ></ThemePanel>
    <mapgis-vector-layer
        v-if="showVector"
        :layer="layerVector"
        :layer-id="layerVectorId"
        :source="sourceVector"
        :source-id="sourceVectorId"
    >
    </mapgis-vector-layer>
  </div>
</template>

<script>
import {UniqueThemeLayer, ThemeStyle} from "@mapgis/webclient-es6-mapboxgl"
import {MRFS} from "@mapgis/webclient-es6-service"
import ThemePanel from "./ThemePanel";

const {FeatureService} = MRFS;

function gradientColor(startColor, endColor, step) {
  let startRGB = colorRgb(startColor);//转换为rgb数组模式
  let startR = startRGB[0];
  let startG = startRGB[1];
  let startB = startRGB[2];

  let endRGB = colorRgb(endColor);
  let endR = endRGB[0];
  let endG = endRGB[1];
  let endB = endRGB[2];

  let sR = (endR - startR) / step;//总差值
  let sG = (endG - startG) / step;
  let sB = (endB - startB) / step;

  let colorArr = [];
  for (let i = 0; i < step; i++) {
    //计算每一步的hex值
    let hex = colorHex('rgb(' + parseInt((sR * i + startR)) + ',' + parseInt((sG * i + startG)) + ',' + parseInt((sB * i + startB)) + ')');
    colorArr.push(hex);
  }
  return colorArr;
}

// 将hex表示方式转换为rgb表示方式(这里返回rgb数组模式)
function colorRgb(sColor) {
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
};

// 将rgb表示方式转换为hex表示方式
function colorHex(rgb) {
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
}

export default {
  name: "mapgis-igs-unique-theme-layer",
  inject: ["mapbox", "map"],
  components: {
    ThemePanel
  },
  props: {
    baseUrl: {
      type: String
    },
    sourceId: {
      type: String
    },
    sourceLayer: {
      type: String
    }
  },
  data() {
    return {
      dataSource: [],
      checkBoxArr: [],
      fields: [],
      colors: [],
      originColors: [],
      allOriginColors: {},
      dataType: "",
      dataCopy: undefined,
      selectKey: "",
      showVector: false,
      startColor: "#FFFFFF",
      endColor: "#FF0000",
      sourceVectorId: 'unique_theme_source',
      layerVectorId: 'unique_theme_layer',
      sourceVector: {
        type: 'geojson',
        data: undefined
      },
      layerVector: {},
      showLayer: true
    }
  },
  watch:{
    baseUrl:{
      handler:function () {
        this.$_getFromGeoJSON();
      }
    },
    sourceId: {
      handler:function () {
        if(!this.sourceLayer){
          throw new Error("sourceLayer不能为空！");
        }else {
          this.$_getFromSource();
        }
      }
    }
  },
  mounted() {
    if (this.sourceId && this.sourceLayer) {
      this.$_getFromSource();
    } else if(this.baseUrl) {
      this.$_getFromGeoJSON();
    }
  },
  methods: {
    toggleLayer(){
      this.$_toggleLayer();
    },
    $_toggleLayer(){
      let show = this.showLayer ? "none" : "visible";
      this.showLayer = !this.showLayer;
      this.map.setLayoutProperty(this.layerVectorId, 'visibility', show);
    },
    $_lineWidthChanged(lineWidth) {
      this.$set(this.layerVector.paint, "line-width", lineWidth);
    },
    $_radiusChanged(radius) {
      this.$set(this.layerVector.paint, "circle-radius", radius);
    },
    $_getColorsFromOrigin(index, color) {
      let colors;
      let fillName = "";
      switch (this.dataType) {
        case "fill":
          fillName = "fill-color";
          break;
        case "circle":
          fillName = "circle-color";
          break;
        case "line":
          fillName = "line-color";
          break;
      }
      if (this.originColors.colors.hasOwnProperty("stops")) {
        colors = {};
        if(index !== null & index !== undefined){
          this.$set(this.originColors.colors.stops[index], 1, color);
        }
        let stops = [];
        for (let i = 0; i < this.originColors.checkArr.length; i++) {
          if (this.originColors.checkArr[i]) {
            stops.push(this.originColors.colors.stops[i]);
          }
        }
        colors.stops = stops;
        colors.property = this.originColors.colors.property;
      } else if (this.originColors.colors.indexOf("match") === 0) {
        if(index !== null & index !== undefined){
          this.$set(this.originColors.colors, (index + 1) * 2 + 1, color);
        }
        this.$set(this.originColors.colors, (index + 1) * 2 + 1, color);
        colors = []
        colors.push(this.originColors.colors[0], this.originColors.colors[1]);
        for (let i = 0; i < this.originColors.checkArr.length; i++) {
          if (this.originColors.checkArr[i]) {
            colors.push(this.originColors.colors[(i + 1) * 2], this.originColors.colors[(i + 1) * 2 + 1]);
          }
        }
        colors.push("#FFF");
      }
      return colors;
    },
    $_oneColorChanged(index, color) {
      let colors = this.$_getColorsFromOrigin(index, color);
      switch (this.dataType) {
        case "fill":
          this.layerVector.paint["fill-color"] = colors
          break;
        case "circle":
          this.layerVector.paint["circle-color"] = colors;
          break;
        case "line":
          this.layerVector.paint["line-color"] = colors;
          break;
      }
      this.showVector = false;
      this.showVector = true;
    },
    $_opacityChanged(e) {
      this.showVector = false;
      switch (this.dataType) {
        case "fill":
          this.layerVector.paint["fill-opacity"] = e;
          break;
        case "circle":
          this.layerVector.paint["circle-opacity"] = e;
          this.layerVector.paint["circle-stroke-opacity"] = e;
          break;
        case "line":
          this.layerVector.paint["line-opacity"] = e;
          break;
      }
      this.showVector = true;
    },
    $_lineColorChanged(e) {
      this.showVector = false;
      switch (this.dataType) {
        case "fill":
          this.layerVector.paint["fill-outline-color"] = e;
          break
        case "circle":
          this.layerVector.paint["circle-stroke-color"] = e;
          break
      }
      this.showVector = true;
    },
    $_gradientChange(startColor, endColor) {
      this.showVector = false;
      this.startColor = startColor;
      this.endColor = endColor;
      let colors = this.$_getColors(this.dataSource, startColor, endColor, this.selectKey, false,true);
      switch (this.dataType) {
        case "fill":
          this.layerVector.paint["fill-color"] = colors;
          break;
        case "circle":
          this.layerVector.paint["circle-color"] = colors;
          break;
        case "line":
          this.layerVector.paint["line-color"] = colors;
          break;
      }
      this.showVector = true;
    },
    $_checked(checkBoxArr, index, checkColor) {
      let colors = {}, newColors,
          next = false;
      if (this.originColors.colors.hasOwnProperty("stops")) {
        newColors = [];
        for (let i = 0; i < checkBoxArr.length; i++) {
          if (checkBoxArr[i]) {
            if (i === index) {
              this.originColors.colors.stops[i][1] = checkColor;
            }
            if (this.originColors.colors.stops[i]) {
              newColors.push(this.originColors.colors.stops[i]);
            }
          } else {
            this.originColors.checkArr[i] = false;
          }
        }
        colors.stops = newColors;
        colors.property = this.originColors.colors.property;
        next = colors.stops.length > 0;
      } else {
        newColors = [];
        newColors.push(this.originColors.colors[0], this.originColors.colors[1]);
        for (let i = 0; i < checkBoxArr.length; i++) {
          if (checkBoxArr[i]) {
            if (this.originColors.colors[(i + 1) * 2]) {
              newColors.push(this.originColors.colors[(i + 1) * 2]);
            }
            if (this.originColors.colors[(i + 1) * 2 + 1]) {
              if (i === index) {
                newColors.push(checkColor);
              } else {
                newColors.push(this.originColors.colors[(i + 1) * 2 + 1]);
              }
            }
          } else {
            this.originColors.checkArr[i] = false;
          }
        }
        if (newColors.length % 2 === 0) {
          newColors.push("#FFFFFF");
        }
        colors = newColors;
        next = colors.length > 2;
      }

      this.showVector = false;
      if (next) {
        switch (this.dataType) {
          case "fill":
            this.layerVector.paint["fill-color"] = colors;
            break;
          case "circle":
            this.layerVector.paint["circle-color"] = colors;
            break;
          case "line":
            this.layerVector.paint["line-color"] = colors;
            break;
        }
        this.showVector = true;
      }
    },
    $_selectChange(value) {
      if (value !== "") {
        let datas = this.$_getData(this.dataCopy.features, value);
        this.dataSource = datas;
        let colors = this.$_getColors(this.dataSource, this.startColor, this.endColor, value);
        this.checkBoxArr = this.originColors.checkArr;
        this.selectKey = value;
        if(this.checkBoxArr.indexOf(true) < 0){
          this.showVector = false;
        }else {
          this.showVector = false;
          switch (this.dataType) {
            case "fill":
              this.layerVector.paint["fill-color"] = colors;
              break;
            case "circle":
              this.layerVector.paint["circle-color"] = colors;
              break;
            case "line":
              this.layerVector.paint["line-color"] = colors;
              break;
          }
          this.showVector = true;
        }
      }
    },
    $_getData(features, value) {
      let datas = [], isSort = true;
      for (let i = 0; i < features.length; i++) {
        if (datas.indexOf(features[i].properties[value]) < 0) {
          if (typeof features[i].properties[value] !== 'number') {
            isSort = false;
          }
          if ((features[i].properties[value] || typeof features[i].properties[value] === 'number') && features[i].properties[value] !== "") {
            datas.push(features[i].properties[value]);
          }
        }
      }
      if (isSort) {
        datas.sort(function (a, b) {
          return a - b;
        });
      }
      return datas;
    },
    $_getFields(features) {
      let fields = [];
      Object.keys(features.properties).forEach(function (key) {
        fields.push(key);
      });
      return fields;
    },
    $_getColors(dataSource, startColor, endColor, key, noColor, clearColor) {
      let colors;
      if(this.allOriginColors.hasOwnProperty(key) && !clearColor){
        this.originColors = this.allOriginColors[key];
        colors = this.$_getColorsFromOrigin();
      }else{
        let iSString = false, checkArr = [];
        for (let i = 0; i < dataSource.length; i++) {
          if (typeof dataSource[i] === 'string') {
            iSString = true;
            break;
          }
        }
        let gradient = new gradientColor(startColor, endColor, dataSource.length),colorList = [];
        if (iSString) {
          colors = ['match', ['get', key]];
          for (let i = 0; i < dataSource.length; i++) {
            if (dataSource[i] !== "") {
              colors.push(dataSource[i]);
              colors.push(gradient[i]);
              colorList.push(gradient[i]);
              checkArr.push(true);
            }
          }
          colors.push("#FFFFFF");
        } else {
          colors = {
            "property": key,
            "stops": []
          };
          for (let i = 0; i < dataSource.length; i++) {
            colors.stops.push([dataSource[i], gradient[i]]);
            colorList.push(gradient[i]);
            checkArr.push(true);
          }
        }
        this.originColors = {
          checkArr: checkArr,
          colors: colors,
          colorList: colorList
        }
        this.allOriginColors[key] = this.originColors;
      }
      if (!noColor) {
        this.colors = this.originColors.colorList;
      }
      return colors;
    },
    $_initTheme(geojson) {
      this.sourceVector.data = geojson;
      this.dataCopy = geojson;
      this.showVector = true;
      this.fields = this.$_getFields(geojson.features[0]);
      this.selectKey = this.fields[0];
      this.dataSource = this.$_getData(geojson.features, this.selectKey);
      let fillColors = this.$_getColors(this.dataSource, "#FFFFFF", "#FF0000", this.selectKey);
      this.checkBoxArr = this.originColors.checkArr;
      if (geojson.features.length > 0 && (geojson.features[0].geometry.type === "MultiPolygon" || geojson.features[0].geometry.type === "Polygon")) {
        this.dataType = 'fill';
        this.layerVector = {
          type: 'fill',
          source: this.sourceVectorId, //必须和上面的layerVectorId一致
          paint: {
            'fill-antialias': true, //抗锯齿，true表示针对边界缝隙进行填充
            'fill-color': fillColors, //颜色
            'fill-opacity': 1.0, //透明度
            'fill-outline-color': '#000' //边线颜色，没错,确实没有边线宽度这个选项
          }
        }
      } else if (geojson.features.length > 0 && (geojson.features[0].geometry.type === "MultiPoint" || geojson.features[0].geometry.type === "Point")) {
        this.dataType = 'circle';
        this.layerVector = {
          type: 'circle',
          source: this.sourceVectorId, //必须和上面的layerVectorId一致
          paint: {
            'circle-color': fillColors, //颜色
            'circle-opacity': 1.0, //透明度
            'circle-stroke-opacity': 1.0, //透明度
            'circle-radius': 12.0, //透明度
            'circle-stroke-color': '#000',//边线颜色，没错,确实没有边线宽度这个选项
            'circle-stroke-width': 1
          }
        }
      } else if (geojson.features.length > 0 && geojson.features[0].geometry.type === "LineString") {
        this.dataType = 'line';
        this.layerVector = {
          type: 'line',
          source: this.sourceVectorId, //必须和上面的layerVectorId一致
          paint: {
            'line-color': fillColors, //颜色
            'line-opacity': 1.0, //透明度
            'line-width': 5
          }
        }
      }
      this.$emit("loaded",this);
    },
    $_getFromSource() {
      let features = this.map.queryRenderedFeatures({layers: [this.sourceLayer]});
      if(features.length === 0){
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
}
</script>

<style scoped>
</style>