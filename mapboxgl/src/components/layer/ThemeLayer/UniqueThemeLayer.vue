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
    >
    </ThemePanel>
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
    /*
    * 修改单一属性的颜色的回调方法
    * @param colors 颜色信息
    * **/
    $_oneColorChangedCallBack(colors){
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
    },
    /*
    * 改变透明度的回调方法
    * @param opacity 透明度
    * **/
    $_opacityChangedCallBack(opacity){
      switch (this.dataType) {
        case "fill":
          this.layerVector.paint["fill-opacity"] = opacity;
          break;
        case "circle":
          this.layerVector.paint["circle-opacity"] = opacity;
          this.layerVector.paint["circle-stroke-opacity"] = opacity;
          break;
        case "line":
          this.layerVector.paint["line-opacity"] = opacity;
          break;
      }
    },
    /*
    * 多选框业务实现
    * @param checkBoxArr 多选框的选中状态数组，true为选中，false为未选中
    * @param index 当前点被点击的复选框的index
    * @param checkColor 当前点击的复选框的颜色
    * **/
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
            newColors.push([this.originColors.colors.stops[i][0], "#FFF"]);
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
            newColors.push(this.originColors.colors[(i + 1) * 2]);
            newColors.push("#FFF");
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
    /*
    * 字段选择的回调函数，在该回调函数中应该重置绘制参数this.layerVector.paint
    * @param colors 针对该字段的颜色信息
    * **/
    $_selectChangeCallBack(colors) {
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
    * 初始化专题图样式的业务逻辑
    * @param geojson geojson数据
    * @fillColors 处理好的颜色信息
    * **/
    $_initThemeCallBack(geojson, fillColors) {
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
    }
  }
}
</script>

<style scoped>
</style>