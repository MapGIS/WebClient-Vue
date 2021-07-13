<template>
  <div>
    <ThemePanel
        :data-source="dataSource"
        :fields="fields"
        :colors="colors"
        @change="$_selectChange"
        @checked="$_checked"
        @gradientChange="$_gradientChange"
        @lineColorChanged="$_lineColorChanged"
        @opacityChanged="$_opacityChanged"
        @oneColorChanged="$_oneColorChanged"
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
  props:{
    baseUrl: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      dataSource: [],
      fields: [],
      colors: [],
      dataType: "",
      dataCopy: undefined,
      selectKey: "",
      showVector: false,
      startColor: "#FFFFFF",
      endColor: "#FF0000",
      sourceVectorId: 'vector_source_id',
      layerVectorId: 'china_bound_id',
      sourceVector: {
        type: 'geojson',
        data: undefined
      },
      layerVector: {}
    }
  },
  mounted() {
    this.$_getVector();
  },
  methods: {
    $_oneColorChanged(index, color) {
      switch (this.dataType){
        case "fill":
          if (this.layerVector.paint["fill-color"].hasOwnProperty("stops")) {
            this.$set(this.layerVector.paint["fill-color"].stops[index], 1, color);
          } else if (!this.layerVector.paint["fill-color"].hasOwnProperty("stops") && this.layerVector.paint["fill-color"].indexOf("match") === 0) {
            this.$set(this.layerVector.paint["fill-color"], (index + 1) * 2 + 1, color);
          }
          break;
        case "circle":
          if (this.layerVector.paint["circle-color"].hasOwnProperty("stops")) {
            this.$set(this.layerVector.paint["circle-color"].stops[index], 1, color);
          } else if (!this.layerVector.paint["circle-color"].hasOwnProperty("stops") && this.layerVector.paint["fill-color"].indexOf("match") === 0) {
            this.$set(this.layerVector.paint["circle-color"], (index + 1) * 2 + 1, color);
          }
          break;
      }
      this.showVector = false;
      this.showVector = true;
    },
    $_opacityChanged(e) {
      this.showVector = false;
      switch (this.dataType){
        case "fill":
          this.layerVector.paint["fill-opacity"] = e;
          break;
        case "circle":
          this.layerVector.paint["circle-opacity"] = e;
          break;
      }
      this.showVector = true;
    },
    $_lineColorChanged(e) {
      this.showVector = false;
      switch (this.dataType){
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
      let colors = this.$_getColors(this.dataSource, startColor, endColor, this.selectKey);
      this.layerVector.paint["fill-color"] = colors;
      this.showVector = true;
    },
    $_checked(checkBoxArr) {
      let colors = [];
      for (let i = 0; i < checkBoxArr.length; i++) {
        if (checkBoxArr[i]) {
          colors.push(this.colors[i]);
        }
      }
      this.showVector = false;
      this.layerVector.paint["fill-color"] = colors;
      this.showVector = true;
    },
    $_selectChange(value) {
      if (value !== "") {
        this.showVector = false;
        let datas = this.$_getData(this.dataCopy.features, value);
        this.dataSource = datas;
        let colors = this.$_getColors(this.dataSource, this.startColor, this.endColor, value);
        console.log("colors",colors)
        this.selectKey = value;
        switch (this.dataType){
          case "fill":
            this.layerVector.paint["fill-color"] = colors;
            break;
          case "circle":
            this.layerVector.paint["circle-color"] = colors;
            break;
        }
        this.showVector = true;
      }
    },
    $_getData(features, value) {
      let datas = [];
      for (let i = 0; i < features.length; i++) {
        if (datas.indexOf(features[i].properties[value]) < 0) {
          datas.push(features[i].properties[value]);
        }
      }
      datas.sort(function (a, b) {
        return a - b;
      })
      return datas;
    },
    $_getFields(features) {
      let fields = [];
      Object.keys(features.properties).forEach(function (key) {
        fields.push(key);
      });
      return fields;
    },
    $_getColors(dataSource, startColor, endColor, key) {
      let iSString = false;
      for (let i = 0; i < dataSource.length; i++) {
        if (typeof dataSource[i] === 'string') {
          iSString = true;
          break;
        }
      }
      let gradient = new gradientColor(startColor, endColor, dataSource.length);
      let colors;
      if (iSString) {
        colors = ['match', ['get', key]];
        for (let i = 0; i < dataSource.length; i++) {
          if (dataSource[i] !== "") {
            colors.push(dataSource[i]);
            colors.push(gradient[i]);
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
        }
      }
      this.colors = gradient;
      return colors;
    },
    $_getVector() {
      let vm = this;
      FeatureService.get(this.baseUrl, function (result) {
        result = JSON.parse(result);
        console.log("result",result)
        vm.sourceVector.data = result;
        vm.dataCopy = result;
        vm.showVector = true;
        vm.fields = vm.$_getFields(result.features[0]);
        vm.selectKey = vm.fields[0];
        vm.dataSource = vm.$_getData(result.features, vm.selectKey);
        let colors = vm.$_getColors(vm.dataSource, "#FFFFFF", "#FF0000", vm.selectKey);
        if(result.features.length > 0 && (result.features[0].geometry.type === "MultiPolygon" || result.features[0].geometry.type === "Polygon")){
          vm.dataType = 'fill';
          vm.layerVector = {
            type: 'fill',
            source: 'vector_source_id', //必须和上面的layerVectorId一致
            paint: {
              'fill-antialias': true, //抗锯齿，true表示针对边界缝隙进行填充
              'fill-color': colors, //颜色
              'fill-opacity': 1.0, //透明度
              'fill-outline-color': '#000' //边线颜色，没错,确实没有边线宽度这个选项
            }
          }
        }else if(result.features.length > 0 && (result.features[0].geometry.type === "MultiPoint" || result.features[0].geometry.type === "Point")){
          vm.dataType = 'circle';
          vm.layerVector = {
            type: 'circle',
            source: 'vector_source_id', //必须和上面的layerVectorId一致
            paint: {
              'circle-color': colors, //颜色
              'circle-opacity': 1.0, //透明度
              'circle-radius': 2.0, //透明度
              'circle-stroke-color': '#000' ,//边线颜色，没错,确实没有边线宽度这个选项
              'circle-stroke-width': 1
            }
          }
        }
      }, function (e) {
        console.log(e);
      });
    }
  }
}
</script>

<style scoped>
</style>