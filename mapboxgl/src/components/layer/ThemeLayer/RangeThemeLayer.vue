<template>
  <div>
    <ThemePanel
        v-show="showPanel"
        :title="title"
        :data-source="dataSource"
        :fields="fields"
        :colors="colors"
        :dataType="dataType"
        :checkBoxArr="checkBoxArr"
        @closePanel="$_closePanel"
        @panelClick="$_panelClick"
        @change="$_selectChange"
        @gradientChange="$_gradientChange"
        @lineColorChanged="$_lineColorChanged"
        @opacityChanged="$_opacityChanged"
        @radiusChanged="$_radiusChanged"
        @lineWidthChanged="$_lineWidthChanged"
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
                  <mapgis-ui-input v-if="dataSourceCopy.length > 1 && index === 0" class="range-theme-num"
                                   @click="$_inputClick(index)"
                                   @change="$_inputStartChange" v-model="startData">
                    <mapgis-ui-tooltip slot="suffix" title="Wrong number" v-if="index === numWrong">
                      <mapgis-ui-iconfont type="mapgis-yingyan" style="color: rgba(255,0,0,.45)"/>
                    </mapgis-ui-tooltip>
                  </mapgis-ui-input>
                  <mapgis-ui-input v-if="dataSourceCopy.length === 1" class="range-theme-num"
                                   @click="$_inputClick(index)"
                                   @change="$_inputStartChange" v-model="dataSourceCopy[index]">
                    <mapgis-ui-tooltip slot="suffix" title="Wrong number" v-if="index === numWrong">
                      <mapgis-ui-iconfont type="mapgis-yingyan" style="color: rgba(255,0,0,.45)"/>
                    </mapgis-ui-tooltip>
                  </mapgis-ui-input>
                  <mapgis-ui-input v-if="index > 0" class="range-theme-num"
                                   @click="$_inputClick(index)"
                                   @change="$_inputStartChange" v-model="dataSourceCopy[index - 1]">
                    <mapgis-ui-tooltip slot="suffix" title="Wrong number" v-if="(index - 1) === numWrong">
                      <mapgis-ui-iconfont type="mapgis-yingyan" style="color: rgba(255,0,0,.45)"/>
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
                                   v-if="index < dataSourceCopy.length && dataSourceCopy.length > 1">
                    <mapgis-ui-tooltip slot="suffix" title="Wrong number" v-if="index === numWrong">
                      <mapgis-ui-iconfont type="mapgis-yingyan" style="color: rgba(255,0,0,.45)"/>
                    </mapgis-ui-tooltip>
                  </mapgis-ui-input>
                  <mapgis-ui-input class="range-theme-num"
                                   @change="$_inputEndChange"
                                   @click="$_inputClick(index)"
                                   v-model="endData"
                                   v-if="index < dataSourceCopy.length && dataSourceCopy.length === 1">
                    <mapgis-ui-tooltip slot="suffix" title="Wrong number" v-if="index === numWrong">
                      <mapgis-ui-iconfont type="mapgis-yingyan" style="color: rgba(255,0,0,.45)"/>
                    </mapgis-ui-tooltip>
                  </mapgis-ui-input>
                  <mapgis-ui-input class="range-theme-num"
                                   @change="$_inputEndChange"
                                   @click="$_inputClick(index)"
                                   v-model="endData" v-if="index === dataSourceCopy.length">
                    <mapgis-ui-tooltip slot="suffix" title="Wrong number" v-if="index === numWrong">
                      <mapgis-ui-iconfont type="mapgis-yingyan" style="color: rgba(255,0,0,.45)"/>
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
  watch: {
    startData: {
      handler: function () {
        if (Number(this.startData) >= Number(this.dataSourceCopy[0])) {
          //输入错误，改变输入框样式
          this.$_inputWrong(0);
        } else {
          this.$_removeInputWrong();
        }
      }
    },
    endData: {
      handler: function () {
        if ((this.dataSourceCopy.length === 1 && Number(this.startData) >= Number(this.endData)) ||
            (this.dataSourceCopy.length > 1 && Number(this.startData) >= Number(this.dataSourceCopy[0]))) {
          //输入错误，改变输入框样式
          this.$_inputWrong(this.dataSourceCopy.length);
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
      dataSourceCopy: undefined,
      dataInit: false,
      numWrong: -1,
      resetNum: true,
      endData: 0,
      startData: 0
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
    $_inputClick(index){
      console.log("++++++++++++++++++")
      console.log("index",index)
      if(index === this.numWrong){
        this.resetNum = false;
      }else {
        this.resetNum = true;
      }
    },
    $_panelClick(){
      console.log(this.numWrong)
      console.log(this.dataSource)
      if(this.numWrong >= 0 && this.resetNum){
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
          this.map.setPaintProperty(this.layerId, "fill-color", colors);
          break;
        case "circle":
          this.map.setPaintProperty(this.layerId, "circle-color", colors);
          break;
        case "line":
          this.map.setPaintProperty(this.layerId, "line-color", colors);
          break;
      }
      this.dataSource[index] = Number(this.dataSourceCopy[index]);
      //自动更细allOriginColors
      this.originColors.colors.stops[index][0] = this.dataSource[index];
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
      colors = this.$_editColor(colors);
      console.log("this.colord", this.colors)
      console.log("colord", colors)
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
    $_opacityChangedCallBack(opacity) {
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
      console.log("------------------", colors)
      colors = this.$_editColor(colors);
      console.log("adadadasdasdcolors", colors)
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
      console.log("colorsqweqweqw", colors)
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
      console.log("---------", colors)
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
    $_editColor(colors) {
      let newStops = [], stopIndex = 0;
      for (let i = 0; i < this.dataBack.length; i++) {
        if (this.dataBack[i] <= colors.stops[stopIndex][0]) {
          newStops.push([this.dataBack[i], colors.stops[stopIndex][1]]);
        } else {
          stopIndex++;
          for (let j = stopIndex; j < colors.stops.length; j++) {
            if (this.dataBack[i] < colors.stops[j][0]) {
              stopIndex = j;
              newStops.push([this.dataBack[i], colors.stops[j][1]]);
              break;
            }
          }
        }
      }
      return {
        "property": colors.property,
        "stops": newStops
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
      console.log("gradient", gradient)
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
    $_editData(dataSource) {
      console.log("--dataSource", dataSource)
      this.dataBack = dataSource;
      let length = dataSource.length, newDataSource = [], rangeLevel = 10;
      let range = dataSource[length - 1] - dataSource[0];
      if (range === 0) {
        newDataSource.push(dataSource[0]);
        this.endData = dataSource[0] + 1;
        return newDataSource;
      } else {
        let rangeSect = range / rangeLevel;
        this.startData = 0;
        for (let i = 0; i < rangeLevel; i++) {
          newDataSource.push(dataSource[0] + (i + 1) * rangeSect + 1);
        }
        this.endData = newDataSource[rangeLevel - 1] + rangeSect;
        console.log("newDataSource", newDataSource)
        return newDataSource;
      }
    },
    /*
    * 初始化专题图样式的业务逻辑
    * @param geojson geojson数据
    * @fillColors 处理好的颜色信息
    * **/
    $_initThemeCallBack(geojson, fillColors, dataSource) {
      console.log("geojson", geojson)
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
            if (key === "治愈") {
              console.log(features[i].properties[key])
            }
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