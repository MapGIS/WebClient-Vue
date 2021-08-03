<template>
  <div>
    <ThemePanel
        v-if="!resetPanel"
        v-show="showPanel"
        :title="title"
        :data-source="dataSource"
        :fields="fields"
        :labelFields="allFields"
        :colors="colors"
        :dataType="dataType"
        :checkBoxArr="checkBoxArr"
        :icons="icons"
        :panelProps="panelPropsDefault"
        :textFonts="textFonts"
        :themeDefaultType="themeDefaultType"
        :themeType="themeTypeArrCopy"
        :iconUrl="iconUrl"
        @closePanel="$_closePanel"
        @change="$_selectChange"
        @checked="$_checked"
        @gradientChange="$_gradientChange"
        @lineColorChanged="$_lineColorChanged"
        @opacityChanged="$_opacityChanged"
        @oneColorChanged="$_oneColorChanged"
        @iconSizeChanged="$_radiusChanged"
        @radiusChanged="$_radiusChanged"
        @lineWidthChanged="$_lineWidthChanged"
        @singleChanged="$_singleChanged"
        @selectTextChanged="$_selectTextChanged"
        @fontColorChanged="$_fontColorChanged"
        @haloColorChanged="$_haloColorChanged"
        @haloWidthChanged="$_haloWidthChanged"
        @fontSizeChanged="$_fontSizeChanged"
        @xOffsetChanged="$_xOffsetChanged"
        @yOffsetChanged="$_yOffsetChanged"
        @yOffsetTextChanged="$_yOffsetTextChanged"
        @xOffsetTextChanged="$_xOffsetTextChanged"
        @textPaddingChanged="$_textPaddingChanged"
        @textRotationChanged="$_textRotationChanged"
        @lineStyleChanged="$_lineStyleChanged"
        @clickIcon="$_clickIcon"
        @iconLoaded="$_iconLoaded"
        @outerLineOpacityChanged="$_outerLineOpacityChanged"
        @outerLineColorChanged="$_outerLineColorChanged"
        @fontChanged="$_fontChanged"
        @themeTypeChanged="$_themeTypeChanged"
    >
    </ThemePanel>
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
    panelProps: {
      type: Object,
      default() {
        return {}
      }
    },
    themeDefaultType: {
      type: String,
      default: "单值专题图"
    }
  },
  data(){
    return {
      themeType: "unique",
      panelPropsDefault: {},
      title: "单值专题图"
    }
  },
  created() {
    this.$_formatProps();
  },
  mounted() {
    window.map = this.map;
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
    $_outerLineColorChanged(color) {
      switch (this.dataType) {
        case "fill":
          this.$_setPaintProperty("line-color",color,this.lineId, this.lineLayer);
          break;
        case "circle":
          this.$_setPaintProperty("circle-stroke-color",color,this.layerIdCopy + "_" + this.$_getThemeName(), window.originLayer[this.layerIdCopy + "_" + this.$_getThemeName()]);
          break;
      }
    },
    $_lineWidthChanged(lineWidth) {
      switch (this.dataType){
        case "fill":
          this.$_setPaintProperty("line-width",lineWidth,this.lineId, this.lineLayer);
          break;
        case "line":
          this.$_setPaintProperty("line-width", lineWidth);
          break;
        case "circle":
          this.$_setPaintProperty("circle-stroke-width", lineWidth);
          break;
      }
    },
    $_outerLineOpacityChanged(opacity){
      switch (this.dataType) {
        case "fill":
          this.$_setPaintProperty("line-opacity",opacity,this.lineId, this.lineLayer);
          break;
        case "circle":
          this.$_setPaintProperty("circle-stroke-opacity",opacity,this.layerIdCopy + "_" + this.$_getThemeName(), window.originLayer[this.layerIdCopy + "_" + this.$_getThemeName()]);
          break;
      }
    },
    $_fontChanged(font){
      this.textFont = font;
      this.$_setLayOutProperty("text-font",[this.textFont],this.textId,this.textLayer);
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
            window.originLayer[this.layerIdCopy + "_" + this.$_getThemeName()].paint["fill-color"] = colors;
            break;
          case "circle":
            window.originLayer[this.layerIdCopy + "_" + this.$_getThemeName()].paint["circle-color"] = colors;
            break;
          case "line":
            window.originLayer[this.layerIdCopy + "_" + this.$_getThemeName()].paint["line-color"] = colors;
            break;
        }
        this.$_changeOriginLayer();
        this.showVector = true;
        this.changeLayerProp = true;
        this.changeLayerId = this.layerIdCopy;
      }
    },
    /*
    * 字段选择的回调函数，在该回调函数中应该重置绘制参数window.originLayer[this.layerIdCopy + "_" + this.$_getThemeName()].paint
    * @param colors 针对该字段的颜色信息
    * **/
    $_selectChangeCallBack(colors) {
      switch (this.dataType) {
        case "fill":
          window.originLayer[this.layerIdCopy + "_" + this.$_getThemeName()].paint["fill-color"] = colors;
          break;
        case "circle":
          window.originLayer[this.layerIdCopy + "_" + this.$_getThemeName()].paint["circle-color"] = colors;
          break;
        case "line":
          window.originLayer[this.layerIdCopy + "_" + this.$_getThemeName()].paint["line-color"] = colors;
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
        window.originLayer[this.layerIdCopy + "_" + this.$_getThemeName()] = {
          id: this.layerIdCopy + "_单值专题图",
          type: 'fill',
          source: this.source_vector_Id, //必须和上面的layerVectorId一致
          layout: {
            'visibility': "visible"
          },
          paint: {
            'fill-antialias': true, //抗锯齿，true表示针对边界缝隙进行填充
            'fill-color': fillColors, //颜色
            'fill-opacity': this.opacity, //透明度
            'fill-outline-color': '#fff' //边线颜色，没错,确实没有边线宽度这个选项
          }
        }
        this.$_addLineLayer();
      } else if (geojson.features.length > 0 && (geojson.features[0].geometry.type === "MultiPoint" || geojson.features[0].geometry.type === "Point")) {
        this.dataType = 'circle';
        window.originLayer[this.layerIdCopy + "_" + this.$_getThemeName()] = {
          id:  this.layerIdCopy + "_单值专题图",
          type: 'circle',
          source: this.source_vector_Id, //必须和上面的layerVectorId一致
          layout: {
            'visibility': "visible"
          },
          paint: {
            'circle-color': fillColors, //颜色
            'circle-opacity': this.opacity, //透明度
            'circle-stroke-opacity': this.outerLineOpacity, //透明度
            'circle-radius': this.radius, //透明度
            'circle-stroke-color': this.outerLineColor,//边线颜色，没错,确实没有边线宽度这个选项
            'circle-stroke-width': this.lineWidth,
            'circle-translate': this.offset,
          }
        }
      } else if (geojson.features.length > 0 && geojson.features[0].geometry.type === "LineString") {
        this.dataType = 'line';
        window.originLayer[this.layerIdCopy + "_" + this.$_getThemeName()] = {
          id:  this.layerIdCopy + "_单值专题图",
          type: 'line',
          source: this.source_vector_Id, //必须和上面的layerVectorId一致
          layout: {
            'visibility': "visible"
          },
          paint: {
            'line-color': fillColors, //颜色
            'line-opacity': this.opacity, //透明度
            'line-width': this.lineWidth,
          }
        }
      }
      if(this.source_vector_layer_Id){
        window.originLayer[this.layerIdCopy + "_" + this.$_getThemeName()]["source-layer"] = this.source_vector_layer_Id;
      }
      this.title = "单值专题图" + "_" + this.layerIdCopy;
      this.$_addTextLayer();
    }
  }
}
</script>

<style scoped>
</style>