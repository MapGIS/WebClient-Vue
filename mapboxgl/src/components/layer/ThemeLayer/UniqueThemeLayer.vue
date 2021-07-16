<template>
  <div>
    <ThemePanel
        v-show="showPanel"
        :data-source="dataSource"
        :fields="fields"
        :colors="colors"
        :dataType="dataType"
        :checkBoxArr="checkBoxArr"
        @closePanel="$_closePanel"
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
        v-if="showVector && !useOriginLayer"
        :layer="layerVector"
        :layer-id="layerVectorId"
        :source="sourceVector"
        :source-id="sourceVectorId"
    >
    </mapgis-vector-layer>
  </div>
</template>

<script>
import ThemePanel from "./ThemePanel";
import BaseLayer from "./BaseLayer";

export default {
  name: "mapgis-igs-unique-theme-layer",
  inject: ["mapbox", "map"],
  mixins: [BaseLayer],
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
    layerId: {
      type: String
    },
    sourceLayer: {
      type: String
    },
    useOriginLayer: {
      type: Boolean,
      default: true
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
      showLayer: true,
      showPanel: true
    }
  },
  watch: {
    baseUrl: {
      handler: function () {
        this.$_removeLayer();
        this.$_getFromGeoJSON();
      }
    },
    sourceId: {
      handler: function () {
        if (!this.sourceLayer) {
          throw new Error("sourceLayer不能为空！");
        } else if (this.useOriginLayer) {
          throw new Error("请将useOriginLayer设为false！");
        } else {
          this.$_removeLayer();
          this.$_getFromSource(this.sourceLayer);
        }
      }
    },
    layerId: {
      handler: function () {
        if (!this.useOriginLayer) {
          throw new Error("请将useOriginLayer设为true！");
        } else {
          this.$_getFromSource(this.layerId);
        }
      }
    }
  },
  mounted() {
    this.$_mount();
  },
  destroyed() {
    this.$_removeLayer();
  },
  methods: {
    removeLayer() {
      this.$_removeLayer();
    },
    toggleLayer() {
      this.$_toggleLayer();
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
        if (index !== null & index !== undefined) {
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
        if (index !== null & index !== undefined) {
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
      this.$_changeOriginLayer();
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
      this.$_changeOriginLayer();
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
      this.$_changeOriginLayer();
      this.showVector = true;
    },
    $_gradientChange(startColor, endColor) {
      this.showVector = false;
      this.startColor = startColor;
      this.endColor = endColor;
      let colors = this.$_getColors(this.dataSource, startColor, endColor, this.selectKey, false, true);
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
      this.$_changeOriginLayer();
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
        this.$_changeOriginLayer();
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
        if (this.checkBoxArr.indexOf(true) < 0) {
          this.showVector = false;
        } else {
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
          this.$_changeOriginLayer();
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
    $_getColors(dataSource, startColor, endColor, key, noColor, clearColor) {
      let colors;
      if (this.allOriginColors.hasOwnProperty(key) && !clearColor) {
        this.originColors = this.allOriginColors[key];
        colors = this.$_getColorsFromOrigin();
      } else {
        let iSString = false, checkArr = [];
        for (let i = 0; i < dataSource.length; i++) {
          if (typeof dataSource[i] === 'string') {
            iSString = true;
            break;
          }
        }
        let gradient = this.$_gradientColor(startColor, endColor, dataSource.length), colorList = [];
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
      let layer = {
        layerId: this.layerVectorId,
        sourceId: this.sourceVectorId,
      }
      layer = {...this.layerVector, ...layer};
      this.$_changeOriginLayer();
      this.$emit("loaded", this, layer);
    }
  }
}
</script>

<style scoped>
</style>