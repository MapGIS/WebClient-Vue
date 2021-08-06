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
        :showOutLineColor="false"
        :showRange="showRange"
        :icons="icons"
        :panelProps="panelPropsDefault"
        :textFonts="textFonts"
        :themeDefaultType="themeDefaultType"
        :themeType="themeTypeArrCopy"
        :activeKey="activeKey"
        :iconUrl="iconUrl"
        :defaultIconValue="defaultIconValue"
        @iconLoaded="$_iconLoaded"
        @oneColorChanged="$_oneColorChanged"
        @checked="$_checked"
        @closePanel="$_closePanel"
        @panelClick="$_panelClick"
        @change="$_selectChange"
        @gradientChange="$_gradientChange"
        @lineColorChanged="$_lineColorChanged"
        @opacityChanged="$_opacityChanged"
        @radiusChanged="$_radiusChanged"
        @rotationChanged="$_rotationChanged"
        @xOffsetChanged="$_xOffsetChanged"
        @yOffsetChanged="$_yOffsetChanged"
        @lineWidthChanged="$_lineWidthChanged"
        @fontColorChanged="$_fontColorChanged"
        @haloColorChanged="$_haloColorChanged"
        @haloWidthChanged="$_haloWidthChanged"
        @fontSizeChanged="$_fontSizeChanged"
        @yOffsetTextChanged="$_yOffsetTextChanged"
        @xOffsetTextChanged="$_xOffsetTextChanged"
        @textPaddingChanged="$_textPaddingChanged"
        @textRotationChanged="$_textRotationChanged"
        @selectTextChanged="$_selectTextChanged"
        @beginSearch="$_beginSearch"
        @singleChanged="$_singleChanged"
        @clickIcon="$_clickIcon"
        @fontChanged="$_fontChanged"
        @themeTypeChanged="$_themeTypeChanged"
    >
      <div slot="legend" slot-scope="slotProps" v-if="showRange">
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
  </div>
</template>

<script>
import ThemePanel from "./ThemePanel";
import BaseLayer from "./BaseLayer";

export default {
  name: "mapgis-igs-symbol-theme-layer",
  inject: ["mapbox", "map"],
  mixins: [BaseLayer],
  components: {
    ThemePanel
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

          if ((index === 0 && Number(this.dataSourceCopy[index]) > Number(this.startData) && Number(this.dataSourceCopy[index]) < Number(this.dataSourceCopy[index + 1])) ||
              (index === this.dataSourceCopy.length && Number(this.dataSourceCopy[index]) > Number(this.dataSourceCopy[index - 1]) && Number(this.dataSourceCopy[index]) < Number(this.endData)) ||
              (Number(this.dataSourceCopy[index - 1]) < Number(this.dataSourceCopy[index]) && Number(this.dataSourceCopy[index]) < Number(this.dataSourceCopy[index + 1]))
          ) {
            let colors = this.$_editColor();
            this.$_setPaintProperty("icon-color", colors);
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
      title: "等级符号专题图",
      themeType: "symbol",
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
      hasString: false,
      showRange: false,
      radius: 0.5,
      fontSize: 11,
      offset: [0, 1.5],
      offsetText: [0, 0],
      textPadding: 0.05,
      textRotation: 0,
      haloColor: "#FFFFFF",
      haloWidth: 0,
      dataType: "symbol",
      panelPropsDefault: {
        "icon-size" : 1
      },
      activeKey: ['2'],
      iconsJson: undefined,
      defaultIconValue: undefined
    }
  },
  props: {
    icons: {
      type: Array
    },
    panelProps: {
      type: Object,
      default(){
        return {
        }
      }
    },
    themeDefaultType: {
      type: String,
      default: "等级符号专题图"
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
    hideLayer(){
      this.$_hideLayer();
    },
    $_hideLayer(){
      this.$_setLayOutProperty("visibility","none",this.layerIdCopy + "_symbol",window.originLayer[this.layerIdCopy][this.layerIdCopy + "_symbol"]);
    },
    removeLayer() {
      this.$_removeLayer();
    },
    toggleLayer() {
      this.$_toggleLayer();
    },
    $_beginSearch(key, operate, value) {
      let newData = [], colors;
      switch (operate) {
        case "=":
          newData = [];
          for (let i = 0; i < this.dataSource.length; i++) {
            if (this.dataSource[i] === value) {
              newData.push(value);
            }
          }
          break;
        case "like":
          newData = [];
          for (let i = 0; i < this.dataSource.length; i++) {
            if (this.dataSource[i].indexOf(value) >= 0) {
              newData.push(this.dataSource[i]);
            }
          }
          break;
      }
      this.dataSource = newData;
      this.dataBack = newData;
      colors = this.$_editColor();
      this.$_setPaintProperty("icon-color", colors);
    },
    $_iconLoaded(json){
      this.iconsJson = json;
    },
    $_fontColorChanged(color) {
      this.$_setPaintProperty("text-color", color);
    },
    $_haloColorChanged(color) {
      this.$_setPaintProperty("text-halo-color", color);
    },
    $_haloWidthChanged(color) {
      this.$_setPaintProperty("text-halo-width", color);
    },
    $_fontSizeChanged(fontSize) {
      this.$_setLayOutProperty("text-size", fontSize);
    },
    $_yOffsetTextChanged(offset) {
      this.offsetText[1] = offset;
      this.$_setLayOutProperty("text-offset", this.offsetText);
    },
    $_xOffsetTextChanged(offset) {
      this.offsetText[0] = offset;
      this.$_setLayOutProperty("text-offset", this.offsetText);
    },
    $_textPaddingChanged(textPadding) {
      this.textPadding = textPadding;
      this.$_setLayOutProperty("text-letter-spacing", textPadding);
    },
    $_textRotationChanged(textRotation) {
      this.textRotation = textRotation;
      this.$_setLayOutProperty("text-rotate", textRotation);
    },
    $_selectTextChanged(value) {
      this.selectText = value;
      this.$_setLayOutProperty("text-field", '{' + value + '}');
    },
    $_radiusChanged(radius) {
      this.$_setLayOutProperty("icon-size", radius);
    },
    $_rotationChanged(rotation) {
      this.$_setLayOutProperty("icon-rotate", rotation);
    },
    $_xOffsetChanged(xOffset) {
      this.offset[0] = xOffset;
      this.$_setLayOutProperty("icon-offset", this.offset);
    },
    $_yOffsetChanged(yOffset) {
      this.offset[1] = yOffset;
      this.$_setLayOutProperty("icon-offset", this.offset);
    },
    $_singleChanged(startColor, endColor) {
      this.$_gradientChange(startColor, endColor);
    },
    $_fontChanged(font){
      this.textFont = font;
      this.$_setLayOutProperty("text-font",[this.textFont],"symbol_layer_id",window.originLayer[this.layerIdCopy][this.layerIdCopy + "_" + this.$_getThemeName()]);
    },
    $_clickIcon(icon) {
      let hasIcon = this.map.hasImage(icon);
      if (hasIcon) {
        this.$_setLayOutProperty("icon-image", icon);
      }
    },
    $_gradientChange(startColor, endColor) {
      this.showVector = false;
      this.startColor = startColor;
      this.endColor = endColor;
      this.$_getColors(this.dataSource, startColor, endColor, this.selectKey, false, true);
      let colors = this.$_editColor();
      this.$_setPaintProperty('icon-color', colors);
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
    /*
    * 从data里面获取colors信息，如果index, color有值，则更新colors，此方法必须被重载
    * @param index 被改变颜色的数据index
    * @param color 被改变的颜色
    * **/
    /*
    * 修改单一属性的颜色的回调方法
    * @param colors 颜色信息
    * **/
    $_oneColorChangedCallBack(colors) {
      colors = this.$_editColor();
      this.$_setPaintProperty('icon-color', colors);
    },
    /*
    * 改变透明度的回调方法
    * @param opacity 透明度
    * **/
    $_opacityChangedCallBack(opacity) {
      this.$_setPaintProperty('icon-opacity', opacity);
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
    $_checked() {
      let newColors = this.$_editColor();
      this.$_setPaintProperty('icon-color', newColors);
      this.changeLayerProp = true;
      this.changeLayerId = this.layerIdCopy;
    },
    $_changeOriginLayer() {
    },
    /*
    * 字段选择的回调函数，在该回调函数中应该重置绘制参数window.originLayer[this.layerIdCopy][this.layerIdCopy + "_" + this.$_getThemeName()].paint
    * @param colors 针对该字段的颜色信息
    * **/
    $_selectChangeCallBack() {
      this.dataInit = false;
      let dataSourceCopy = [];
      for (let i = 0; i < this.dataSource.length; i++) {
        dataSourceCopy.push(this.dataSource[i]);
      }
      this.dataSourceCopy = dataSourceCopy;
      this.$nextTick(function () {
        this.dataInit = true;
      });
      let colors = this.$_editColor();
      if(this.selectText){
        window.originLayer[this.layerIdCopy][this.layerIdCopy + "_" + this.$_getThemeName()].layout["text-field"] = '{' + this.selectText + '}';
        this.map.setLayoutProperty(this.layerIdCopy, "text-field", window.originLayer[this.layerIdCopy][this.layerIdCopy + "_" + this.$_getThemeName()].layout["text-field"]);
      }
      this.$_setPaintProperty('icon-color', colors);
    },
    $_editColor(dataBack) {
      dataBack = dataBack || this.dataBack;
      let newColors = ['match', ['get', this.selectKey]], Index = 0;
      if(dataBack.length === 1){
        newColors.push(dataBack[0], this.colors[0]);
        newColors.push("#FFF");
      }else if (!this.hasString) {
        for (let i = 0; i < dataBack.length; i++) {
          if (Number(dataBack[i]) >= Number(this.dataSourceCopy[Index])) {
            Index++;
          }
          if (this.checkBoxArr[Index]) {
            newColors.push(dataBack[i], this.colors[Index]);
          } else {
            newColors.push(dataBack[i], "#FFF");
          }
        }
        newColors.push("#FFF");
      } else {
        for (let i = 0; i < dataBack.length; i++) {
          if (this.checkBoxArr[i]) {
            newColors.push(dataBack[i], this.colors[i]);
          } else {
            newColors.push(dataBack[i], "#FFF");
          }
        }
        newColors.push("#FFF");
      }
      return newColors;
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

      return {
        checkArr: checkArr,
        colors: colors,
        colorList: colorList
      }
    },
    $_editData(dataSource) {
      let reg = /^\d+$/;
      this.hasString = false;
      for (let i = 0; i < dataSource.length; i++) {
        if (!reg.exec(dataSource[i])) {
          this.hasString = true;
          break;
        }
      }
      this.dataBack = dataSource;
      if (!this.hasString) {
        this.showRange = true;
        this.dataBack.sort(function (a, b) {
          return a - b;
        });
        let length = dataSource.length, newDataSource = [], rangeLevel = 10;
        let range = Number(dataSource[length - 1]) - Number(dataSource[0]);
        if (range === 0) {
          newDataSource.push(dataSource[0]);
          this.endData = dataSource[0] + 1;
          this.endDataCopy = this.endData;
          return newDataSource;
        } else {
          let rangeSect = Math.ceil(range / rangeLevel);
          if (dataSource[0] < 0) {
            this.startData = dataSource[0] - 1;
          } else {
            this.startData = 0;
          }
          this.startDataCopy = this.startData;
          for (let i = 0; i < rangeLevel; i++) {
            newDataSource.push(Number(dataSource[0]) + (i + 1) * rangeSect + 1);
          }
          this.endData = newDataSource[rangeLevel - 1] + rangeSect;
          this.endDataCopy = this.endData;
          return newDataSource;
        }
      } else {
        this.showRange = false;
      }
      return dataSource;
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
      fillColors = this.$_editColor();
      let vm = this;
      let interval = setInterval(function () {
        if(vm.iconsJson){
          let keyArr = [];
          Object.keys(vm.iconsJson).forEach(function (key) {
            keyArr.push(key);
          });
          vm.defaultIconValue = keyArr[0] ? keyArr[0] : '';
          window.originLayer[vm.layerIdCopy][vm.layerIdCopy + "_" + vm.$_getThemeName()] = {
            'id': vm.layerIdCopy + "_等级符号专题图",
            'source': vm.source_vector_Id,
            'type': 'symbol',
            'layout': {
              'icon-image': vm.defaultIconValue,
              'icon-size': vm.radius,
              "text-field": '',
              'text-size': vm.fontSize,
              'text-letter-spacing': vm.textPadding,
              'text-offset': vm.offset,
              'text-font': [vm.textFonts[0]],
              'text-rotate': vm.textRotation,
              'visibility': 'visible'
            },
            'paint': {
              'icon-color': fillColors,
              'icon-opacity': vm.opacity,
              'text-color': '#000000',
              "text-halo-color": vm.haloColor,
              "text-halo-width": vm.haloWidth
            },
          };
          if(vm.source_vector_layer_Id){
            window.originLayer[vm.layerIdCopy][vm.layerIdCopy + "_" + vm.$_getThemeName()]["source-layer"] = vm.source_vector_layer_Id;
          }
          vm.title = "等级符号" + "_" + vm.layerIdCopy;
          vm.map.addLayer(window.originLayer[vm.layerIdCopy][vm.layerIdCopy + "_" + vm.$_getThemeName()]);
          clearInterval(interval);
        }
      },10);
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
  width: 27%;
  margin-left: 2%;
}

.theme-panel-td-checkbox, .theme-panel-td-index {
  padding-top: 10px;
}
</style>