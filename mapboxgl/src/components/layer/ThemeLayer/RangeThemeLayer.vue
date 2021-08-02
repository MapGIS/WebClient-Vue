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
        :themeType="themeTypeArr"
        :iconUrl="iconUrl"
        @closePanel="$_closePanel"
        @panelClick="$_panelClick"
        @change="$_selectChange"
        @gradientChange="$_gradientChange"
        @lineColorChanged="$_lineColorChanged"
        @opacityChanged="$_opacityChanged"
        @outerLineOpacityChanged="$_outerLineOpacityChanged"
        @iconSizeChanged="$_radiusChanged"
        @radiusChanged="$_radiusChanged"
        @lineWidthChanged="$_lineWidthChanged"
        @selectTextChanged="$_selectTextChanged"
        @fontSizeChanged="$_fontSizeChanged"
        @yOffsetTextChanged="$_yOffsetTextChanged"
        @xOffsetTextChanged="$_xOffsetTextChanged"
        @textPaddingChanged="$_textPaddingChanged"
        @textRotationChanged="$_textRotationChanged"
        @haloColorChanged="$_haloColorChanged"
        @haloWidthChanged="$_haloWidthChanged"
        @clickIcon="$_clickIcon"
        @singleChanged="$_singleChanged"
        @fontColorChanged="$_fontColorChanged"
        @lineStyleChanged="$_lineStyleChanged"
        @xOffsetChanged="$_xOffsetChanged"
        @yOffsetChanged="$_yOffsetChanged"
        @outerLineColorChanged="$_outerLineColorChanged"
        @fontChanged="$_fontChanged"
        @themeTypeChanged="$_themeTypeChanged"
    >
      <div slot="legend" slot-scope="slotProps">
        <mapgis-ui-row>
          <mapgis-ui-list
              bordered
              :data-source="dataSource"
          >
            <mapgis-ui-list-item slot="renderItem" slot-scope="item, index">
              <div class="range-theme-list-item">
                <div class="theme-panel-td theme-panel-td-border-right theme-panel-td-index">
                  {{ index }}
                </div>
                <div class="theme-panel-td theme-panel-td-border-right theme-panel-td-checkbox">
                  <mapgis-ui-checkbox
                      :value="{item:item,color:colors[index]}"
                      :checked="checkBoxArr[index]"
                      @change="$_checkboxChecked">
                  </mapgis-ui-checkbox>
                </div>
                <div class="theme-panel-td theme-panel-td-border-right">
                  <div class="theme-panel-color-picker">
                    <colorPicker class="picker" v-model="colors[index]"
                                 @change="$_changeColor(index)"/>
                  </div>
                </div>
                <div class="theme-panel-td theme-panel-td-input-num">
                  <mapgis-ui-input v-if="dataSourceCopy.length === 1 || (dataSourceCopy.length > 1 && index === 0)"
                                   class="range-theme-num"
                                   @click="$_inputClick('start')"
                                   @change="$_inputStartChange" v-model="startData">
                    <mapgis-ui-tooltip slot="suffix" title="Wrong number" v-if="startNumWrong">
                      <mapgis-ui-iconfont type="mapgis-zaozitucanshuquesheng" style="color: rgba(255,0,0,.45)"/>
                    </mapgis-ui-tooltip>
                  </mapgis-ui-input>
                  <mapgis-ui-input v-if="index > 0" class="range-theme-num"
                                   @click="$_inputClick(index - 1)"
                                   @change="$_inputStartChange" v-model="dataSourceCopy[index - 1]">
                    <mapgis-ui-tooltip slot="suffix" title="Wrong number" v-if="(index - 1) === numWrong">
                      <mapgis-ui-iconfont type="mapgis-zaozitucanshuquesheng" style="color: rgba(255,0,0,.45)"/>
                    </mapgis-ui-tooltip>
                  </mapgis-ui-input>
                </div>
                <div class="theme-panel-td">
                  ~
                </div>
                <div class="theme-panel-td theme-panel-td-input-num">
                  <mapgis-ui-input class="range-theme-num"
                                   @change="$_inputEndChange"
                                   @click="$_inputClick(index)"
                                   v-model="dataSourceCopy[index]"
                                   v-if="index < dataSourceCopy.length - 1 && dataSourceCopy.length > 1">
                    <mapgis-ui-tooltip slot="suffix" title="Wrong number" v-if="index === numWrong">
                      <mapgis-ui-iconfont type="mapgis-zaozitucanshuquesheng" style="color: rgba(255,0,0,.45)"/>
                    </mapgis-ui-tooltip>
                  </mapgis-ui-input>
                  <mapgis-ui-input class="range-theme-num"
                                   @change="$_inputEndChange"
                                   @click="$_inputClick('end')"
                                   v-model="endData"
                                   v-if="dataSourceCopy.length === 1 || (index === dataSourceCopy.length - 1 && dataSourceCopy.length > 1)">
                    <mapgis-ui-tooltip slot="suffix" title="Wrong number" v-if="endNumWrong">
                      <mapgis-ui-iconfont type="mapgis-zaozitucanshuquesheng" style="color: rgba(255,0,0,.45)"/>
                    </mapgis-ui-tooltip>
                  </mapgis-ui-input>
                </div>
              </div>
            </mapgis-ui-list-item>
          </mapgis-ui-list>
        </mapgis-ui-row>
      </div>
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
  name: "mapgis-igs-range-theme-layer",
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
      default: "分段专题图"
    }
  },
  watch: {
    startData: {
      handler: function () {
        if ((this.dataSourceCopy.length === 1 && Number(this.startData) >= Number(this.endData)) ||
            (this.dataSourceCopy.length > 1 && Number(this.startData) >= Number(this.dataSourceCopy[0]))) {
          //输入错误，改变输入框样式
          this.startNumWrong = true;
        } else {
          this.$_removeInputWrong();
        }
      }
    },
    endData: {
      handler: function () {
        if ((this.dataSourceCopy.length === 1 && Number(this.startData) >= Number(this.endData)) ||
            (this.dataSourceCopy.length > 1 && Number(this.endData) < Number(this.dataSourceCopy[this.dataSourceCopy.length - 1]))) {
          //输入错误，改变输入框样式
          this.endNumWrong = true;
        } else {
          this.$_removeInputWrong();
        }
      }
    },
    dataSourceCopy: {
      handler: function () {
        if (this.dataInit) {
          let index = 0;
          for (let i = 0; i < this.dataSource.length; i++) {
            if (Number(this.dataSource[i]) !== Number(this.dataSourceCopy[i])) {
              index = i;
            }
          }

          if (index === 0 && Number(this.dataSourceCopy[index]) > Number(this.startData) && Number(this.dataSourceCopy[index]) < Number(this.dataSourceCopy[index + 1])) {
            this.$_setPaint(index, this.dataSourceCopy[index]);
          } else if (index === this.dataSourceCopy.length && Number(this.dataSourceCopy[index]) > Number(this.dataSourceCopy[index - 1]) && Number(this.dataSourceCopy[index]) < Number(this.endData)) {
            this.$_setPaint(index, this.dataSourceCopy[index]);
          } else if (Number(this.dataSourceCopy[index - 1]) < Number(this.dataSourceCopy[index]) && Number(this.dataSourceCopy[index]) < Number(this.dataSourceCopy[index + 1])) {
            this.$_setPaint(index, this.dataSourceCopy[index]);
          } else {
            //输入错误，改变输入框样式
            this.$_inputWrong(index);
          }
        }
      },
      deep: true
    }
  },
  data() {
    return {
      title: "分段专题图",
      themeType: "range",
      dataSourceCopy: undefined,
      dataInit: false,
      numWrong: -1,
      resetNum: true,
      endData: 0,
      endDataCopy: 0,
      startData: 0,
      startDataCopy: 0,
      startNumWrong: false,
      endNumWrong: false,
      offsetText: [0, 0],
      panelPropsDefault: {},
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
          this.$_setPaintProperty("circle-stroke-color",color,this.layerIdCopy, window.layerVector);
          break;
      }
    },
    $_fontChanged(font){
      this.textFont = font;
      this.$_setLayOutProperty("text-font",[this.textFont],this.textId,this.textLayer);
    },
    $_lineWidthChanged(lineWidth) {
      switch (this.dataType){
        case "fill":
          this.$_setPaintProperty("line-width",lineWidth,this.lineId, this.lineLayer);
          break;
        case "line":
          this.$_setPaintProperty("line-width", lineWidth,this.lineId, this.lineLayer);
          break;
        case "circle":
          this.$_setPaintProperty("circle-stroke-width", lineWidth,this.lineId, this.lineLayer);
          break;
      }
    },
    $_outerLineOpacityChanged(opacity){
      switch (this.dataType) {
        case "fill":
          this.$_setPaintProperty("line-opacity",opacity,this.lineId, this.lineLayer);
          break;
        case "circle":
          this.$_setPaintProperty("circle-stroke-opacity",opacity,this.layerIdCopy, window.layerVector);
          break;
      }
    },
    $_opacityChangedCallBack(opacity) {
      let opacityType = "";
      switch (this.dataType) {
        case "fill":
          opacityType = "fill-opacity";
          break
        case "line":
          opacityType = "line-opacity";
          break;
        case "circle":
          opacityType = "circle-opacity";
          break;
      }
      this.$_setPaintProperty(opacityType, opacity);
    },
    $_inputClick(index) {
      if (index !== 'start' && this.startNumWrong) {
        this.startNumWrong = false;
        this.startData = this.startDataCopy;
      } else if (index !== 'end' && this.endNumWrong) {
        this.endNumWrong = false;
        this.endData = this.endDataCopy;
      } else if (index === this.numWrong && typeof index === 'number') {
        this.resetNum = false;
      } else {
        this.resetNum = true;
      }
    },
    $_panelClick() {
      if (this.numWrong >= 0 && this.resetNum) {
        this.dataSourceCopy[this.numWrong] = this.dataSource[this.numWrong];
        this.numWrong = -1;
      }
    },
    $_changeColor(index) {
      this.$_oneColorChanged(index, this.colors[index]);
    },
    $_inputStartChange() {
      this.direction = "start";
    },
    $_inputEndChange() {
      this.direction = "end";
    },
    $_removeInputWrong() {
      this.numWrong = -1;
      this.startNumWrong = false;
      this.endNumWrong = false;
    },
    $_inputWrong(index) {
      this.numWrong = index;
    },
    $_setPaint(index, num) {
      this.$_removeInputWrong();
      let colors = this.$_getColorsFromOrigin(index, null, Number(num));
      colors = this.$_editColor(colors);
      switch (this.dataType) {
        case "fill":
          this.map.setPaintProperty(this.layerIdCopy, "fill-color", colors);
          break;
        case "circle":
          this.map.setPaintProperty(this.layerIdCopy, "circle-color", colors);
          break;
        case "line":
          this.map.setPaintProperty(this.layerIdCopy, "line-color", colors);
          break;
      }
      this.dataSource[index] = Number(this.dataSourceCopy[index]);
      //自动更细allOriginColors
      this.originColors.colors.stops[index][0] = this.dataSource[index];
    },
    $_checkboxChecked(e) {
      let value = e.target.value.item;
      let color = e.target.value.color;
      let index = 0;
      for (let i = 0; i < this.dataSourceCopy.length; i++) {
        if (Number(value) === Number(this.dataSourceCopy[i])) {
          index = i;
          break;
        }
      }
      if (index >= 0) {
        this.$set(this.checkBoxArr, index, !this.checkBoxArr[index]);
      }
      this.$_checked(this.checkBoxArr, index, color);
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
      }
      this.showVector = false;
      colors = this.$_editColor(colors);
      if (next) {
        switch (this.dataType) {
          case "fill":
            window.layerVector.paint["fill-color"] = colors;
            break;
          case "circle":
            window.layerVector.paint["circle-color"] = colors;
            break;
          case "line":
            window.layerVector.paint["line-color"] = colors;
            break;
        }
        this.$_changeOriginLayer();
        this.showVector = true;
        this.changeLayerProp = true;
        this.changeLayerId = this.layerIdCopy;
      }
    },
    /*
    * 字段选择的回调函数，在该回调函数中应该重置绘制参数window.layerVector.paint
    * @param colors 针对该字段的颜色信息
    * **/
    $_selectChangeCallBack(colors) {
      this.dataInit = false;
      let dataSourceCopy = [];
      for (let i = 0; i < this.dataSource.length; i++) {
        dataSourceCopy.push(this.dataSource[i]);
      }
      this.dataSourceCopy = dataSourceCopy;
      this.$nextTick(function () {
        this.dataInit = true;
      });
      colors = this.$_editColor(colors);
      switch (this.dataType) {
        case "fill":
          window.layerVector.paint["fill-color"] = colors;
          break;
        case "circle":
          window.layerVector.paint["circle-color"] = colors;
          break;
        case "line":
          window.layerVector.paint["line-color"] = colors;
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
      let checkArr = [], colorList = [];
      let gradient = this.$_gradientColor(startColor, endColor, dataSource.length);
      colors = {
        "property": key,
        "stops": []
      };
      for (let i = 0; i < dataSource.length; i++) {
        colors.stops.push([dataSource[i], gradient[i]]);
        colorList.push(gradient[i]);
        checkArr.push(true);
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
    $_initThemeCallBack(geojson, fillColors, dataSource) {
      let dataSourceCopy = [];
      for (let i = 0; i < dataSource.length; i++) {
        dataSourceCopy.push(dataSource[i]);
      }
      this.dataSourceCopy = dataSourceCopy;
      this.$nextTick(function () {
        this.dataInit = true;
      });
      fillColors = this.$_editColor(fillColors);
      // let vm = this;
      // this.map.loadImage("./icons/life/car.png", function (error, image) {
      //   if (error) throw error;
      //   vm.map.addImage("car", image, {'sdf': true});
      //   console.log("-------------------------")
      //   vm.$_setPaintProperty("fill-pattern","car");
      // });
      if (geojson.features.length > 0 && (geojson.features[0].geometry.type === "MultiPolygon" || geojson.features[0].geometry.type === "Polygon")) {
        this.dataType = 'fill';
        window.layerVector = {
          type: 'fill',
          source: this.sourceVectorId, //必须和上面的layerVectorId一致
          paint: {
            'fill-antialias': true, //抗锯齿，true表示针对边界缝隙进行填充
            'fill-color': fillColors, //颜色
            'fill-opacity': this.opacity, //透明度
            'fill-outline-color': '#fff', //边线颜色，没错,确实没有边线宽度这个选项
          }
        }
        this.$_addLineLayer();
      } else if (geojson.features.length > 0 && (geojson.features[0].geometry.type === "MultiPoint" || geojson.features[0].geometry.type === "Point")) {
        this.dataType = 'circle';
        window.layerVector = {
          type: 'circle',
          source: this.sourceVectorId, //必须和上面的layerVectorId一致
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
        window.layerVector = {
          type: 'line',
          source: this.sourceVectorId, //必须和上面的layerVectorId一致
          paint: {
            'line-color': fillColors, //颜色
            'line-opacity': this.opacity, //透明度
            'line-width': this.lineWidth,
          }
        }
      }
      this.title = "分段" + "_" + this.layerIdCopy;
      this.$_addTextLayer();
    },
    $_editGeoJSON(geojson) {
      let newGeoJSON = {
        features: [],
        type: "FeatureCollection"
      };
      let features = geojson.features;
      for (let i = 0; i < features.length; i++) {
        let feature = {}, properties = {};
        feature.geometry = features[i].geometry;
        feature.type = features[i].type;
        Object.keys(features[i].properties).forEach(function (key) {
          if (typeof features[i].properties[key] === 'number') {
            properties[key] = features[i].properties[key];
          }
        });
        feature.properties = properties;
        newGeoJSON.features.push(feature);
      }
      return newGeoJSON;
    }
  }
}
</script>

<style scoped>
.theme-panel-td-border-right {
  border-right: 1px solid rgb(217, 217, 217);
}

.theme-panel-td {
  position: relative;
  display: inline-block;
  text-align: center;
  width: 10%;
  height: 44px;
  line-height: 2;
  float: left;
  padding-top: 6px;
}

.theme-panel-color-picker {
  cursor: pointer;
  display: inline-block;
  width: 10px;
  height: 10px;
}

.theme-panel-color-picker .picker {
  position: absolute;
  top: 16px;
  right: 4px;
}

.theme-panel-color-picker .picker .colorBtn {
  margin-left: 20px;
}

.range-theme-num {
  width: 62px;
}

.range-theme-list-item {
  width: 100%;
  height: 44px;
}

/deep/ .mapgis-ui-list-bordered .mapgis-ui-list-item {
  padding: 0;
}

.theme-panel-td-input-num {
  width: 30%;
}

.theme-panel-td-checkbox, .theme-panel-td-index {
  padding-top: 10px;
}
</style>