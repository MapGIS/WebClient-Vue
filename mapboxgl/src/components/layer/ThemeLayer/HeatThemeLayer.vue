<template>
  <div>
    <ThemePanel
        v-show="showPanel"
        :title="title"
        :checkBoxArr="checkBoxArr"
        :colors="colors"
        :data-source="dataSource"
        :dataType="dataType"
        :fields="fields"
        :panelProps="panelPropsDefault"
        :textFonts="textFonts"
        :themeDefaultType="themeDefaultType"
        :themeType="themeTypeArr"
        @change="$_selectChange"
        @gradientChange="$_gradientChange"
        @heatRadiusChanged="$_heatRadiusChanged"
        @opacityChanged="$_opacityChanged"
        @themeTypeChanged="$_themeTypeChanged"
    >
    </ThemePanel>
  </div>
</template>

<script>
import ThemePanel from "./ThemePanel";
import BaseLayer from "./BaseLayer";

export default {
  name: "mapgis-igs-heat-theme-layer",
  inject: ["mapbox", "map"],
  mixins: [BaseLayer],
  components: {
    ThemePanel
  },
  props: {
    themeDefaultType: {
      type: String,
      default: "热力专题图"
    },

  },
  data() {
    return {
      title: "热力专题图",
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
      layerVector: {},
      showLayer: true,
      panelPropsDefault: {},
      themeType: "heatmap",
      heatMapLayerId: undefined,
    }
  },
  created() {
    this.$_formatProps();
  },
  mounted() {
    this.$_mount();
  },
  destroyed() {
    this.$_removeLayer();
  },
  methods: {
    $_changeOriginLayer() {
    },
    /*
    * 初始化专题图样式的业务逻辑
    * @param geojson geojson数据
    * @fillColors 处理好的颜色信息
    * **/
    $_initThemeCallBack(geojson) {
      window.map = this.map;
      this.defaultValue = this.$_getValidHeatFieldFromGeoJson(geojson);
      this.$set(this.panelPropsDefault, "defaultValue", this.defaultValue)
      //隐藏原图层
      this.map.setLayoutProperty(this.layerIdCopy, "visibility", "none");
      if (geojson.features.length > 0 && (geojson.features[0].geometry.type === "MultiPoint" || geojson.features[0].geometry.type === "Point")) {
        this.dataType = 'heatmap';
        this.heatMapLayerId = this.layerIdCopy + "_" + this.themeType;
        let colorGradient = this.getGradientColors(true);
        window.layerVector = {
          id: this.heatMapLayerId,
          type: 'heatmap',
          source: this.source_vector_Id, //必须和上面的layerId一致
          layout: {},
          paint: {
            "heatmap-weight": [
              "interpolate",
              ["linear"],
              ["get", this.defaultValue],
              0,
              0,
              1,
              0.9,
              2,
              0.93,
              3,
              0.94,
              4.8,
              1
            ],
            "heatmap-intensity": [
              "interpolate",
              ["linear"],
              ["zoom"],
              0,
              3,
              9,
              5
            ],
            "heatmap-color": [
              "interpolate",
              ["linear"],
              ["heatmap-density"],
              0,
              "rgba(255,255,255,0)",
            ].concat(colorGradient),
            // Adjust the heatmap radius by zoom level
            "heatmap-radius": this.heatMapRadius
            //     [
            //   "interpolate",
            //   ["linear"],
            //   ["zoom"],
            //   0,
            //   2,
            //   1,
            //   4,
            //   2,
            //   8,
            //   3,
            //   16,
            //   4,
            //   32,
            //   5,
            //   64,
            //   6,
            //   128,
            //   7,
            //   256,
            //   8,
            //   512,
            //   9,
            //   1024,
            //   10,
            //   2048,
            //   11,
            //   4096
            // ]
            ,
            // Transition from heatmap to circle layer by zoom level
            "heatmap-opacity": this.opacity
            //     [
            //   "interpolate",
            //   ["linear"],
            //   ["zoom"],
            //   5,
            //   0.95,
            //   6,
            //   0
            // ]
          }
        }

        window.originLayer[this.heatMapLayerId] = window.layerVector;
        this.extraLayer.push({
          key: "heatmapLayer",
          value: this.heatMapLayerId
        });
        this.map.addLayer(window.layerVector);
      }
    },

    $_gradientChange(colorsArr) {
      const {heatMapLayerId} = this;
      let steps = [];
      let level = 1 / colorsArr.length;
      colorsArr.forEach((color, i) => {
        debugger
        steps.push(i * level);
        steps.push(color);
      })
      console.log("steps",steps);
      let colorrules = [
        "interpolate",
        ["linear"],
        ["heatmap-density"],
      ].concat(steps);
      this.$_setPaintProperty("heatmap-color", colorrules, heatMapLayerId, window.originLayer[heatMapLayerId]);
    },

    $_heatRadiusChanged(heatRadius) {
      const {heatMapLayerId} = this;
      this.$_setPaintProperty("heatmap-radius", heatRadius, heatMapLayerId, window.originLayer[heatMapLayerId]);
    },

    $_opacityChanged(opacity) {
      const {heatMapLayerId} = this;
      this.$_setPaintProperty("heatmap-opacity", opacity, heatMapLayerId, window.originLayer[heatMapLayerId]);
    },

    $_selectChange(value) {
      const {heatMapLayerId} = this;
      let weightRules = [
        "interpolate",
        ["linear"],
        ["get", value],
        0,
        0,
        1000,
        1
      ];
      this.$_setPaintProperty("heatmap-weight", weightRules, heatMapLayerId, window.originLayer[heatMapLayerId]);
    },

    /*
    * 取得color列表的方法，该方法必须返回一个originColors对象
    * @param colors 一个空的mapbox绘制规则对象，调用者需要自行指定绘制规则
    * @param dataSource 要素信息，绘制规则使用
    * @param startColor 渐变开始颜色，可自行指定
    * @param endColor 渐变结束颜色，可自行指定
    * @param key 绘制规则针对的关键字
    * **/
    $_getColorsCallBack(colors, dataSource, startColor, endColor, key) {
      let iSString = false, checkArr = [], colorList = [];
      for (let i = 0; i < dataSource.length; i++) {
        if (typeof dataSource[i] === 'string') {
          iSString = true;
          break;
        }
      }
      let gradient = this.$_gradientColor(startColor, endColor, dataSource.length);
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
      return {
        checkArr: checkArr,
        colors: colors,
        colorList: colorList
      }
    },

    /*
   * 从data里面获取colors信息，如果index, color有值，则更新colors，此方法必须被重载
   * @param index 被改变颜色的数据index
   * @param color 被改变的颜色
   * **/
    $_getColorsFromOriginCallBack(index, color) {
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
        if (index !== null && index !== undefined) {
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
        if (index !== null && index !== undefined) {
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
    getGradientColors(tag) {
      if (tag) {
        let originColor = ["#0000FF", "#00FFFF", "#00FF00", "#FFFF00", "#FF0000"];
        let steps = [];
        for (let i = 0; i < originColor.length-1; i++) {
          let colors = this.$_gradientColor(originColor[i],originColor[i+1],10);
          let level = ((i+2)*0.2 - (i+1)*0.2) / colors.length;
          colors.forEach((color, j) => {
            let stop = (i+1)*0.2 + j * level;
            steps.push(stop);
            steps.push(color);
          })
        }
        return steps;
      }
    }
  }
}


</script>

<style scoped>

</style>