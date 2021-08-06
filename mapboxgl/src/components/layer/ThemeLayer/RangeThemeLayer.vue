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
        :isGradient="isGradient"
        :isSingle="isSingle"
        @closePanel="$_closePanel"
        @panelClick="$_panelClick"
        @change="$_selectChange"
        @gradientChange="$_singleChangedOut"
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
        @clickSingle="$_clickSingle"
        @clickGradient="$_clickGradient"
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
              :data-source="dataSourceCopy"
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
                <div class="theme-panel-td theme-panel-td-input-num theme-panel-td-border-right">
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
                <div class="theme-panel-td theme-panel-td-add" @click="$_addRange(index)">
                  <mapgis-ui-iconfont type="mapgis-tianjiamulu" />
                </div>
              </div>
            </mapgis-ui-list-item>
          </mapgis-ui-list>
        </mapgis-ui-row>
      </div>
    </ThemePanel>
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
          if(!this.addRange){
            let index = 0;
            for (let i = 0; i < this.dataSource.length; i++) {
              if (Number(this.dataSource[i]) !== Number(this.dataSourceCopy[i])) {
                index = i;
              }
            }

            if (index === 0 && Number(this.dataSourceCopy[index]) > Number(this.startData) && Number(this.dataSourceCopy[index]) < Number(this.dataSourceCopy[index + 1])) {
              this.$_setPaint(index);
            } else if (index === this.dataSourceCopy.length && Number(this.dataSourceCopy[index]) > Number(this.dataSourceCopy[index - 1]) && Number(this.dataSourceCopy[index]) < Number(this.endData)) {
              this.$_setPaint(index);
            } else if (Number(this.dataSourceCopy[index - 1]) < Number(this.dataSourceCopy[index]) && Number(this.dataSourceCopy[index]) < Number(this.dataSourceCopy[index + 1])) {
              this.$_setPaint(index);
            } else {
              //输入错误，改变输入框样式
              this.$_inputWrong(index);
            }
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
      addRange: false
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
    $_addRange(index){
      this.rangeLevel++;
      this.addRange = true;
      let startData = Number(this.dataSourceCopy[index]);
      let endData = Number(this.dataSourceCopy[index + 1]);
      if(index < this.dataSourceCopy.length - 1){
        if( startData < endData){
          let addNum = (startData + endData)/2;
          this.dataSourceCopy.splice(index + 1,0,addNum);
          let newColors = this.$_gradientColor(this.colors[index],this.colors[index + 1],2);
          this.colors.splice(index + 1,0,newColors[1]);
          this.checkBoxArr.splice(index + 1,0,true);
          this.$_setRangeColor(newColors[1],startData,endData);
        }
      }else {
        let addNum = (endData = startData) + endData;
        this.colors.push(this.colors[index]);
        this.checkBoxArr.push(true);
        this.dataSourceCopy.push(addNum);
      }
      this.$nextTick(function () {
        this.addRange = false;
      });
    },
    removeLayer() {
      this.$_removeLayer();
    },
    toggleLayer() {
      this.$_toggleLayer();
    },
    $_outerLineColorChanged(color) {
      switch (this.dataType) {
        case "fill":
          this.$_setPaintProperty("line-color", color, this.lineId, this.lineLayer);
          break;
        case "circle":
          this.$_setPaintProperty("circle-stroke-color", color, this.layerIdCopy + "_" + this.$_getThemeName(), window.originLayer[this.layerIdCopy][this.layerIdCopy + "_" + this.$_getThemeName()]);
          break;
      }
    },
    $_fontChanged(font) {
      this.textFont = font;
      this.$_setLayOutProperty("text-font", [this.textFont], this.textId, this.textLayer);
    },
    $_lineWidthChanged(lineWidth) {
      switch (this.dataType) {
        case "fill":
          this.$_setPaintProperty("line-width", lineWidth, this.lineId, this.lineLayer);
          break;
        case "line":
          this.$_setPaintProperty("line-width", lineWidth, this.lineId, this.lineLayer);
          break;
        case "circle":
          this.$_setPaintProperty("circle-stroke-width", lineWidth, this.lineId, this.lineLayer);
          break;
      }
    },
    $_outerLineOpacityChanged(opacity) {
      switch (this.dataType) {
        case "fill":
          this.$_setPaintProperty("line-opacity", opacity, this.lineId, this.lineLayer);
          break;
        case "circle":
          this.$_setPaintProperty("circle-stroke-opacity", opacity, this.layerIdCopy + "_" + this.$_getThemeName(), window.originLayer[this.layerIdCopy][this.layerIdCopy + "_" + this.$_getThemeName()]);
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
      this.isGradient = false;
      this.$_setRangeColor(this.colors[index],this.$_getStartEndData(index).startData,this.$_getStartEndData(index).endData);
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
    $_setPaint(index) {
      this.$_removeInputWrong();
      this.$_setRangeColor(this.colors[index],this.$_getStartEndData(index).startData,this.$_getStartEndData(index).endData,true);
      this.$_setRangeColor(this.colors[index + 1],this.$_getStartEndData(index + 1).startData,this.$_getStartEndData(index + 1).endData);
      this.dataSource[index] = Number(this.dataSourceCopy[index]);
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
      let color;
      if(!checkBoxArr[index]){
        color = "#ffffff";
      }else {
        color = checkColor;
      }
      this.$_setRangeColor(color,this.$_getStartEndData(index).startData,this.$_getStartEndData(index).endData);
      this.showVector = true;
      this.changeLayerProp = true;
      this.changeLayerId = this.layerIdCopy;
    },
    $_getStartEndData(index){
      let startData,endData;
      if(index === 0){
        startData = this.startData;
        endData = this.dataSourceCopy[index];
      }else if(index === this.dataSourceCopy.length){
        startData = this.dataSourceCopy[index];
        endData = this.endData;
      }else {
        startData = this.dataSourceCopy[index - 1];
        endData = this.dataSourceCopy[index];
      }
      return {
        startData: Number(startData),
        endData: Number(endData)
      }
    },
    $_setRangeColor(color,startData,endData,noPaint){
      let paintColor = window.originLayer[this.layerIdCopy][this.layerIdCopy + "_" + this.$_getThemeName()].paint[this.dataType + "-color"];
      let length = (paintColor.length - 1)/2;
      for (let i = 0;i <length;i++){
        if(paintColor[2 + i * 2 + 1] >= startData && paintColor[2 + i * 2 + 1] < endData){
          paintColor.splice(2 + i * 2,1,color);
        }
      }
      window.originThemeData[this.layerIdCopy][this.themeType + "_" + this.selectKey] = paintColor;
      if(!noPaint){
        this.$_setPaintByType(paintColor,true);
      }else {
        window.originLayer[this.layerIdCopy][this.layerIdCopy + "_" + this.$_getThemeName()].paint[this.dataType + "-color"] = paintColor;
      }
    },
    /*
    * 字段选择的回调函数，在该回调函数中应该重置绘制参数window.originLayer[this.layerIdCopy][this.layerIdCopy + "_" + this.$_getThemeName()].paint
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
      if (geojson.features.length > 0 && (geojson.features[0].geometry.type === "MultiPolygon" || geojson.features[0].geometry.type === "Polygon")) {
        this.dataType = 'fill';
        window.originLayer[this.layerIdCopy][this.layerIdCopy + "_" + this.$_getThemeName()] = {
          id: this.layerIdCopy + "_分段专题图",
          type: 'fill',
          source: this.source_vector_Id, //必须和上面的layerVectorId一致
          layout: {
            'visibility': "visible"
          },
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
        window.originLayer[this.layerIdCopy][this.layerIdCopy + "_" + this.$_getThemeName()] = {
          id: this.layerIdCopy + "_分段专题图",
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
        window.originLayer[this.layerIdCopy][this.layerIdCopy + "_" + this.$_getThemeName()] = {
          id: this.layerIdCopy + "_分段专题图",
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
      if (this.source_vector_layer_Id) {
        window.originLayer[this.layerIdCopy][this.layerIdCopy + "_" + this.$_getThemeName()]["source-layer"] = this.source_vector_layer_Id;
      }
      this.title = "分段" + "_" + this.layerIdCopy;
      window.originThemeData[this.layerIdCopy][this.themeType + "_" + this.selectKey] = fillColors;
      this.$_addTextLayer();
    },
    $_editGeoJSON(geojson) {
      return geojson;
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

.theme-panel-td-add{
  cursor: pointer;
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
  width: 54px;
}

.range-theme-list-item {
  width: 100%;
  height: 44px;
}

/deep/ .mapgis-ui-list-bordered .mapgis-ui-list-item {
  padding: 0;
}

.theme-panel-td-input-num {
  width: 25%;
}

.theme-panel-td-checkbox, .theme-panel-td-index {
  padding-top: 10px;
}
</style>