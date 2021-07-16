<template>
  <mapgis-ui-card class="theme-panel">
    <!--  专题图面板  -->
    <div v-show="init" class="theme-panel-tab">
      <!--标题-->
      <mapgis-ui-row>
        <mapgis-ui-col :span="24" class="theme-panel-type theme-panel-type-title">
          <p class="theme-panel-title">单值专题图</p>
          <p class="theme-panel-title-close" @click="$_close">X</p>
        </mapgis-ui-col>
      </mapgis-ui-row>
      <!--字段信息-->
      <mapgis-ui-row>
        <mapgis-ui-col :span="6">
          <p class="theme-panel-p">字段</p>
        </mapgis-ui-col>
        <mapgis-ui-col :span="18">
          <mapgis-ui-select
              style="width: 182px"
              v-if="fields.length > 0"
              :default-value="defaultValue"
              @change="$_selectChange"
          >
            <mapgis-ui-select-option v-for="(Field,index) in fields" :value="Field">{{ Field }}
            </mapgis-ui-select-option>
          </mapgis-ui-select>
        </mapgis-ui-col>
      </mapgis-ui-row>
      <!--字段过滤-->
      <!--      <mapgis-ui-row>-->
      <!--        <mapgis-ui-collapse>-->
      <!--          <mapgis-ui-collapse-panel key="1" header="字段过滤">-->
      <!--            <p>dasdadadasdasd</p>-->
      <!--          </mapgis-ui-collapse-panel>-->
      <!--        </mapgis-ui-collapse>-->
      <!--      </mapgis-ui-row>-->
      <!--专题图样式-->
      <mapgis-ui-row>
        <mapgis-ui-col :span="6">
<!--          <mapgis-ui-select-->
<!--              style="margin-left: -17px;"-->
<!--              @change="$_changeOption"-->
<!--              :default-value="gradientValue">-->
<!--            <mapgis-ui-select-option value="common">-->
<!--              渐变颜色-->
<!--            </mapgis-ui-select-option>-->
<!--            <mapgis-ui-select-option value="customize">-->
<!--              自定义-->
<!--            </mapgis-ui-select-option>-->
<!--          </mapgis-ui-select>-->
          <p class="theme-panel-p">渐变颜色</p>
        </mapgis-ui-col>
        <mapgis-ui-col :span="18"
                       v-if="gradientValue === 'common'"
        >
          <mapgis-ui-select
              :default-value="'#FF0000'"
              @change="$_gradientChange"
          >
            <mapgis-ui-select-option v-for="(gradient,index) in gradientArr" :value="gradient.key">
              <div class="theme-panel-gradient" :style="{background: gradient.value}"></div>
            </mapgis-ui-select-option>
          </mapgis-ui-select>
        </mapgis-ui-col>
        <mapgis-ui-col :span="9"
                       v-if="gradientValue === 'customize'"
        >
          起始颜色:
          <colorPicker
              class="picker"
              v-model="startColor"
              @change="$_selectStartColor"
          />
        </mapgis-ui-col>
        <mapgis-ui-col :span="9"
                       v-if="gradientValue === 'customize'"
        >
          结束颜色:
          <colorPicker
              class="picker"
              v-model="endColor"
              @change="$_selectEndColor"
          />
        </mapgis-ui-col>
      </mapgis-ui-row>
      <mapgis-ui-row>
        <mapgis-ui-col :span="6">
          <p class="theme-panel-p" style="margin-top: 0.8em">透明度</p>
        </mapgis-ui-col>
        <mapgis-ui-col :span="18">
          <mapgis-ui-slider class="theme-panel-slider-opacity" v-model="opacity" :marks="marks"/>
        </mapgis-ui-col>
      </mapgis-ui-row>
      <mapgis-ui-row
          v-if="dataType !== 'line'"
      >
        <mapgis-ui-col :span="6">
          <p class="theme-panel-p" style="margin-top: 0.8em;">描边颜色</p>
        </mapgis-ui-col>
        <mapgis-ui-col :span="18">
          <colorPicker
              class="picker theme-panel-line-color"
              v-model="lineColor"
              @change="$_selectLineColor"
          />
        </mapgis-ui-col>
      </mapgis-ui-row>
      <mapgis-ui-row
          v-if="dataType==='circle'"
      >
        <mapgis-ui-col :span="6">
          <p class="theme-panel-p">半径</p>
        </mapgis-ui-col>
        <mapgis-ui-col :span="18">
          <mapgis-ui-input-number v-model="radius" class="theme-panel-input-number"/>
        </mapgis-ui-col>
      </mapgis-ui-row>
      <mapgis-ui-row
          v-if="dataType==='line'"
      >
        <mapgis-ui-col :span="6">
          <p class="theme-panel-p">线宽</p>
        </mapgis-ui-col>
        <mapgis-ui-col :span="18">
          <mapgis-ui-input-number v-model="lineWidth" class="theme-panel-input-number"/>
        </mapgis-ui-col>
      </mapgis-ui-row>
      <!--专题图信息-->
      <mapgis-ui-row>
        <mapgis-ui-col :span="24" class="theme-panel-type">
          图例
        </mapgis-ui-col>
      </mapgis-ui-row>
      <mapgis-ui-row>
        <mapgis-ui-list
            bordered
            :data-source="dataSourceCopy"
        >
          <mapgis-ui-list-item slot="renderItem" slot-scope="item, index">
            <div class="theme-panel-td theme-panel-td-border-right">
              {{ index }}
            </div>
            <div class="theme-panel-td theme-panel-td-border-right">
              <mapgis-ui-checkbox
                  :value="{item:item,color:colors[index]}"
                  :color="colors[index]"
                  :checked="checkBoxArr[index]"
                  @change="$_checked">
              </mapgis-ui-checkbox>
            </div>
            <div class="theme-panel-td theme-panel-td-border-right">
              <div class="theme-panel-color-picker">
                <colorPicker class="picker" v-model="colors[index]" v-on:change="$_changeColor(index)"/>
              </div>
            </div>
            <div class="theme-panel-td theme-panel-td-key theme-panel-td-border-right">
              {{ selectValue.toString().length > 6 ? String(selectValue).substr(0, 6) + "..." : (selectValue === "" ? "其他" : selectValue) }}
            </div>
            <div class="theme-panel-td theme-panel-td-value">
              {{ item.toString().length > 12 ? String(item).substr(0, 12) + "..." : (item === "" ? "其他" : item) }}
            </div>
          </mapgis-ui-list-item>
        </mapgis-ui-list>
      </mapgis-ui-row>
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
      lineWidth: 5,
      opacity: 100,
      defaultValue: "",
      lineColor: "#000000",
      startColor: "#FFF",
      endColor: "#000",
      gradientArr: [{
        key: "#FF0000",
        value: "-webkit-linear-gradient(left,#FFFFFF,#FF0000)"
      }, {
        key: "#00FF00",
        value: "-webkit-linear-gradient(left,#FFFFFF,#00FF00)"
      }, {
        key: "#0000FF",
        value: "-webkit-linear-gradient(left,#FFFFFF,#0000FF)"
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
    $_gradientChange(e) {
      this.$emit("gradientChange", "#FFFFFF", e);
    },
    $_checked(e) {
      let value = e.target.value.item;
      let color = e.target.value.color;
      let index = this.dataSourceCopy.indexOf(value);
      if (index >= 0) {
        this.$set(this.checkBoxArr, index, !this.checkBoxArr[index]);
      }
      this.$emit("checked", this.checkBoxArr,index,color);
    },
    $_changeColor(index) {
      this.$emit("oneColorChanged", index, this.colors[index]);
    },
    $_selectChange(value) {
      this.selectValue = value;
      this.$emit("change", value);
    },
    $_initDataSource() {
      if(this.dataSource.length > 0 && !this.init){
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

.theme-panel-loading {
  padding-top: 180px;
}

.theme-panel-type {
  text-align: left;
}

.theme-panel-p {
  margin-top: 0.4em;
  margin-bottom: 0.6em;
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

.theme-panel-color-picker .picker {
  position: absolute;
  top: 2px;
  right: 6px;
}

.theme-panel-color-picker .picker .colorBtn{
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
  width: 138px;
  height: 15px;
  margin: 8px 4px 0;
  border-radius: 3px;
}

.theme-panel-input-num {
  width: 200px;
}

/deep/ .theme-panel-noflow .mapgis-ui-collapse-content {
  overflow: visible !important;
}

.theme-panel-slider-opacity{
  width: 169px;
  margin-left: 7px;
}
.theme-panel-input-number{
  width: 260px;
  margin-left: 0px;
}
/deep/ .theme-panel-line-color .colorBtn{
  width: 183px!important;
  height: 33px!important;
  margin-left: 3px;
  border-radius: 3px;
}

.theme-panel-type-title{
  border-bottom: 1px solid rgb(228,228,228);
  width: 300px;
  height: 26px;
  margin-left: -24px;
  margin-top: -14px;
  padding-left: 24px;
  padding-bottom: 40px;
  font-size: 16px;
}

.theme-panel-title{
  display: inline-block;
}

.theme-panel-title-close{
  display: inline-block;
  color: #40a9ff;
  font-size: 12px;
  position: absolute;
  right: 16px;
  top: 4px;
  cursor: pointer;
}
</style>