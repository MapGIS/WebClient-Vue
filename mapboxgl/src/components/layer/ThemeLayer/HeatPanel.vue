<template>
  <mapgis-ui-card class="theme-panel">
    <!--  专题图面板  -->
    <div v-show="init" class="theme-panel-tab">
      <!--标题-->
      <mapgis-ui-row>
        <mapgis-ui-col :span="24" class="theme-panel-type theme-panel-type-title">
          <p class="theme-panel-title">热力专题图</p>
          <p class="theme-panel-title-close" @click="$_close">X</p>
        </mapgis-ui-col>
      </mapgis-ui-row>
      <!--字段信息-->
      <mapgis-ui-collapse accordion>
        <mapgis-ui-collapse-panel key="1" header="字段信息">
          <mapgis-ui-row>
            <p class="theme-panel-p">权重字段</p>
          </mapgis-ui-row>
          <mapgis-ui-row :span="18">
            <mapgis-ui-select
                v-if="fields.length > 0"
                :default-value="defaultValue"
                class="theme-panel-select"
                @change="$_selectChange"
            >
              <mapgis-ui-select-option v-for="(Field,index) in fields" :value="Field">{{ Field }}
              </mapgis-ui-select-option>
            </mapgis-ui-select>
          </mapgis-ui-row>
        </mapgis-ui-collapse-panel>
      </mapgis-ui-collapse>

      <mapgis-ui-collapse accordion>
        <mapgis-ui-collapse-panel key="1" header="热点">
          <mapgis-ui-row>
            <p class="theme-panel-p">热点颜色</p>
          </mapgis-ui-row>
          <mapgis-ui-row>
            <mapgis-ui-col v-if="gradientValue === 'common'"
                           :span="25"
            >
              <mapgis-ui-select
                  :default-value="'#0000FF,#00FFFF,#00FF00,#FFFF00,#FF0000'"
                  @change="$_gradientChange"
              >
                <mapgis-ui-select-option v-for="(gradient,index) in gradientArr" :value="gradient.key">
                  <div :style="{background: gradient.value}" class="theme-panel-gradient"></div>
                </mapgis-ui-select-option>
              </mapgis-ui-select>
            </mapgis-ui-col>
          </mapgis-ui-row>

          <mapgis-ui-row>
            <p class="theme-panel-p" style="margin-top: 0.8em">透明度</p>
          </mapgis-ui-row>
          <mapgis-ui-row>
            <mapgis-ui-col :span="18">
              <mapgis-ui-slider class="theme-panel-slider" v-model="opacity"/>
            </mapgis-ui-col>
            <mapgis-ui-col :span="6">
              <mapgis-ui-input-number class="theme-panel-input-number" v-model="opacity"/>
            </mapgis-ui-col>
          </mapgis-ui-row>
          <mapgis-ui-row
              v-if="dataType==='heatmap'"
          >
            <mapgis-ui-col :span="6">
              <p class="theme-panel-p">热力半径</p>
            </mapgis-ui-col>
          </mapgis-ui-row>
            <mapgis-ui-row>
            <mapgis-ui-col :span="12">
              <mapgis-ui-input-number v-model="heatRadius" class="theme-panel-input-radius"/>
            </mapgis-ui-col>
            </mapgis-ui-row>
        </mapgis-ui-collapse-panel>
      </mapgis-ui-collapse>

      <mapgis-ui-collapse accordion>
        <mapgis-ui-collapse-panel key="1" header="自定义">
          <mapgis-ui-row>
            <p class="theme-panel-p">自定义颜色</p>
          </mapgis-ui-row>
          <mapgis-ui-row v-for="(color,index) in currentColors" :key="index">
            <mapgis-ui-row>
              <p class="theme-panel-p">热力颜色{{ index }}:</p>
            </mapgis-ui-row>
            <mapgis-ui-row>
              <colorPicker
                  v-model="color.value"
                  class="picker theme-panel-line-color"
                  @change="$_selectColor(color)"
              />
            </mapgis-ui-row>
          </mapgis-ui-row>
        </mapgis-ui-collapse-panel>
      </mapgis-ui-collapse>
    </div>
    <!--  loading  -->
    <div v-show="!init" class="theme-panel-tab theme-panel-loading">
      <mapgis-ui-row>
        <mapgis-ui-col :span="24">{{ loadingTest }}</mapgis-ui-col>
      </mapgis-ui-row>
      <mapgis-ui-row>
        <mapgis-ui-col :span="24">
          <mapgis-ui-spin size="small"/>
        </mapgis-ui-col>
      </mapgis-ui-row>
    </div>
  </mapgis-ui-card>
</template>

<script>
import {MRFS} from "@mapgis/webclient-es6-service"

export default {
  name: "mapgis-igs-theme-panel",
  props: {
    loadingTime: {
      type: Number,
      default: 0
    },
    fields: {
      type: Array,
      default() {
        return []
      }
    },
    dataSource: {
      type: Array,
      default() {
        return []
      }
    },
    colors: {
      type: Array,
      default() {
        return []
      }
    },
    checkBoxArr: {
      type: Array,
      default() {
        return []
      }
    },
    dataType: {
      type: String
    }
  },
  data() {
    return {
      init: false,
      loadingTest: "加载中，请稍后...",
      FieldArray: [],
      dataSourceCopy: [],
      selectValue: "",
      gradientValue: "common",
      lineValue: "common",
      radius: 12,
      heatRadius: 12,
      lineWidth: 5,
      opacity: 100,
      defaultValue: "",
      lineColor: "#000000",
      startColor: "#FFF",
      endColor: "#000",
      currentColors: [{
        key: "0",
        value: "#0000FF"
      }, {
        key: "1",
        value: "#00FFFF"
      }, {
        key: "2",
        value: "#00FF00"
      }, {
        key: "3",
        value: "#FFFF00"
      }, {
        key: "4",
        value: "#FF0000"
      }],
      gradientArr: [{
        key: "#0000FF,#00FFFF,#00FF00,#FFFF00,#FF0000",
        value: "-webkit-linear-gradient(left,#0000FF,#00FFFF,#00FF00,#FFFF00,#FF0000)"
      }, {
        key: "#636CEA,#1B1DD5,#BE1C4D,#F79390,#FFFFCC",
        value: "-webkit-linear-gradient(left,#636CEA,#1B1DD5,#BE1C4D,#F79390,#FFFFCC)"
      }, {
        key: "#B0B0B0,#0000FF,#00A6FF,#00FF00,#00FFFF,#FF0000,#FFA600,#FF00FF,#0000FF",
        value: "-webkit-linear-gradient(left,#B0B0B0,#0000FF,#00A6FF,#00FF00,#00FFFF,#FF0000,#FFA600,#FF00FF,#0000FF)"
      }],
      marks: {
        0: '0%',
        100: {
          style: {
            color: '#000',
          },
          label: '100%'
        }
      }
    }
  },
  watch: {
    dataSource: {
      deep: true,
      handler: function () {
        this.$_initDataSource();
      }
    },
    opacity: {
      handler: function () {
        this.$emit("opacityChanged", this.opacity / 100);
      }
    },
    radius: {
      handler: function () {
        this.$emit("radiusChanged", Number(this.radius));
      }
    },
    heatRadius: {
      handler: function () {
        this.$emit("heatRadiusChanged", Number(this.heatRadius));
      }
    },
    lineWidth: {
      handler: function () {
        this.$emit("lineWidthChanged", Number(this.lineWidth));
      }
    }
  },
  mounted() {
  },
  methods: {
    $_close() {
      this.$emit("closePanel");
    },
    $_selectLineColor(e) {
      this.lineColorChanged = e;
      this.$emit("lineColorChanged", e);
    },
    $_changeLineOption(e) {
      this.lineValue = e;
    },
    $_selectStartColor(e) {
      this.startColor = e;
      this.$emit("gradientChange", e, this.endColor);
    },
    $_selectEndColor(e) {
      this.endColor = e;
      this.$emit("gradientChange", this.startColor, this.endColor);
    },
    $_changeOption(e) {
      this.gradientValue = e;
    },
    $_selectColor(e) {
      let colorsArr = [];
      this.currentColors.forEach((c, index) => {
        if (c.key === e.key) {
          c.value = e.value;
        }
        colorsArr.push(c.value);
      })
      colorsArr.unshift("#FFFFFF");
      this.$emit("gradientChange", colorsArr);
    },
    $_gradientChange(e) {
      let colorsArr = [];
      colorsArr = e.split(",");
      this.currentColors = [];
      colorsArr.forEach((color, i) => {
        this.currentColors.push({key: i, value: color});
      });
      colorsArr.unshift("#FFFFFF");
      this.$emit("gradientChange", colorsArr);
    },
    $_checked(e) {
      let value = e.target.value.item;
      let color = e.target.value.color;
      let index = this.dataSourceCopy.indexOf(value);
      if (index >= 0) {
        this.$set(this.checkBoxArr, index, !this.checkBoxArr[index]);
      }
      this.$emit("checked", this.checkBoxArr, index, color);
    },
    // $_changeColor(index) {
    //   this.$emit("oneColorChanged", index, this.colors[index]);
    // },
    $_selectChange(value) {
      this.selectValue = value;
      this.$emit("change", value);
    },
    $_initDataSource() {
      if (this.dataSource.length > 0 && !this.init) {
        this.init = true;
      }
      this.dataSourceCopy = this.dataSource;
      this.defaultValue = this.defaultValue === "" ? this.fields[0] : this.defaultValue;
      this.selectValue = this.selectValue === "" ? this.fields[0] : this.selectValue;
    }
  }
}
</script>

<style scoped>
.theme-panel {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1000;
  width: 300px;
  height: calc((100vh - 64px) - 24px);
  overflow-y: scroll;
  overflow-x: hidden;
}

.theme-panel-tab {
  width: 100%;
  height: 100%;
}

.theme-panel-p {
  margin-top: 0;
  margin-bottom: 0;
  text-align: left;
  padding-left: 5px;
  font-weight: bold;
}

.theme-panel .mapgis-ui-collapse{
  margin-top: 10px;
}

/deep/ .theme-panel-noflow .mapgis-ui-collapse-content {
  overflow: visible !important;
}

/deep/ .mapgis-ui-collapse-content{
  overflow: visible !important;
}

.theme-panel-loading {
  padding-top: 180px;
}

.theme-panel-type {
  text-align: left;
}

.theme-panel .mapgis-ui-row {
  margin-top: 10px;
}

.theme-panel-color-picker {
  cursor: pointer;
  display: inline-block;
  width: 10px;
  height: 10px;
}

.m-colorPicker .colorBtn {
  width: 130px !important;
}

.theme-panel-color-picker .picker {
  position: absolute;
  top: 2px;
  right: 6px;
}

.theme-panel-color-picker .picker .colorBtn {
  margin-left: 20px;
}

.theme-panel-td {
  position: relative;
  display: inline-block;
  text-align: center;
  width: 10%;
  height: 30px;
  line-height: 2;
}

.theme-panel-td-key {
  width: 25%;
  padding: 0 4px;
  cursor: pointer;
}

.theme-panel-td-value {
  width: 45%;
}

.theme-panel-td-border-right {
  border-right: 1px solid rgb(217, 217, 217);
}

.theme-panel .mapgis-ui-list-item {
  display: block;
  padding: 0 !important;
  height: 30px;
}

.theme-panel .m-colorPicker {
  margin-top: 6px;
  margin-left: -2px;
}

.theme-panel .mapgis-ui-checkbox-checked {
  margin-top: 3px;
}

.theme-panel-gradient {
  width: 202px;
  height: 15px;
  margin: 8px 0px 0;
  border-radius: 3px;
}

.theme-panel-input-num {
  width: 200px;
}

/deep/ .theme-panel-noflow .mapgis-ui-collapse-content {
  overflow: visible !important;
}

.theme-panel-slider-opacity {
  width: 169px;
  margin-left: 7px;
}

.theme-panel-input-number {
  width: 180px;
  margin-left: 0px;
}

/deep/ .theme-panel-line-color .colorBtn {
  width: 233px !important;
  height: 15px !important;
  margin-left: 3px;
  border-radius: 3px;
}

.theme-panel-type-title {
  border-bottom: 1px solid rgb(228, 228, 228);
  width: 300px;
  height: 26px;
  margin-left: -24px;
  margin-top: -14px;
  padding-left: 24px;
  padding-bottom: 40px;
  font-size: 16px;
}

.theme-panel-title {
  display: inline-block;
}

.theme-panel-title-close {
  display: inline-block;
  color: #40a9ff;
  font-size: 12px;
  position: absolute;
  right: 16px;
  top: 4px;
  cursor: pointer;
}
.theme-panel-slider {
  width: 176px;
  margin-left: 7px;
}
/deep/.mapgis-ui-card-body{
  padding: 24px 4px;
}
.theme-panel-select{
  width: 242px;
  margin: 7px 0;
}
.theme-panel-input-number {
  width: 47px;
  margin-left: 0;
  margin-top: 5px;
}
.theme-panel-input-radius{
  width: 240px;
  margin-left: 7px;
}
</style>