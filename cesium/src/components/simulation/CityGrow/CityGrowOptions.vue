<template>
  <div>
    <div class="mapgis-city-grow-options">
      <mapgis-ui-select-panel
          label="开始时间字段"
          v-model="featureStyle.startTimeField"
          :labelCol="24"
          :wrapperCol="24"
          :selectOptions="dataFields"
          :disabled="isDisabled"
          @change="val => onFieldChange(val, 'startTimeField') ">
      </mapgis-ui-select-panel>
      <mapgis-ui-select-panel
          label="结束时间字段"
          v-model="featureStyle.endTimeField"
          :labelCol="24"
          :wrapperCol="24"
          :selectOptions="dataFields"
          :disabled="isDisabled"
          :placeholder="placeholder"
          @change="val => onFieldChange(val, 'endTimeField') ">
      </mapgis-ui-select-panel>
      <mapgis-ui-select-panel
          label="高程字段"
          v-model="featureStyle.heightField"
          :labelCol="24"
          :wrapperCol="24"
          :selectOptions="dataFields"
          :disabled="isDisabled"
          :placeholder="placeholder"
          @change="val => onFieldChange(val, 'heightField') ">
      </mapgis-ui-select-panel>
      <mapgis-ui-input-number-panel
          size="large"
          label="高程比"
          v-model="featureStyle.heightRatio"
          :placeholder="placeholder"
          @change="val => onHeightScale(val,  'heightRatio')"/>

      <mapgis-ui-switch-panel
          size="small"
          :labelCol="{ span: 3 }"
          :wrapperCol="{ span: 20 }"
          layout="horizontal"
          label="建筑生长"
          :checked="featureStyle.isGrowHeight"
          @changeChecked="changeGrowHeight"
      ></mapgis-ui-switch-panel>

      <mapgis-ui-range-picker @change="onDateChange" v-model="dataRange" style="margin:8px 0"></mapgis-ui-range-picker>

      <mapgis-ui-colors-setting
          v-model="colorsCopy"
          :rangeField="'时间段'"
          style="margin-top: 8px"
          v-if='colorsCopy.length > 0'
          @change="colorChanged"
          @input="colorInput"
      >
      </mapgis-ui-colors-setting>
    </div>
    <mapgis-ui-setting-footer>
      <mapgis-ui-button type="primary" @click="onCommitOptions">
        确认
      </mapgis-ui-button>
      <mapgis-ui-button @click="remove" :disabled="disabled">取消</mapgis-ui-button>
    </mapgis-ui-setting-footer>
  </div>
</template>

<script>
import {MRFS} from "@mapgis/webclient-es6-service";

const {QueryDocFeature} = MRFS;
import moment from "moment";
import clonedeep from 'lodash.clonedeep';

export default {
  name: "mapgis-3d-city-grow-options",
  inject: ["Cesium", "vueCesium", "viewer"],
  props: {
    cityGrowOptions: {
      type: [Object, String],
      default: () => {
        return [];
      }
    },
    buildingColors: {
      type: Array,
      default: () => {
        return ["rgba(245,33,0,1)", "rgba(255,121,26,1)", "rgba(255,164,46,1)", "rgba(255,209,82,1)"]
      }
    }
  },
  data() {
    return {
      initial: true,
      baseUrl: "",
      isDisabled: true,
      placeholder: '请选择对应字段',
      dataFields: [],
      colorsCopy: [],
      featureStyle: {
        startTimeField: "",
        endTimeField: "",
        heightField: "",
        heightRatio: 1,
        isGrowHeight: false
      },
      layerIndexArray: [],
      switchSize: 'small',
      disabled: true,
      // 定义url的方式是选择还是手输
      urlWays: undefined,
      dataRange: undefined,
      // 时间数据暂存状态
      dataRangeTemp: undefined,
      // 颜色列表是否修改的标志
      colorChangedTag: false,
      // 把获取到的颜色设置表参数暂存
      colorSettingTemp: [],
      //确认按钮保存参数面板数据
      submitFeatureStyle: {}
    }
  },
  mounted() {
  },
  beforeDestroy() {
    this.unmount();
  },
  watch: {
    dataRange:{
      deep: true,
      handler: function (newValue, oldValue) {
        this.dataRangeTemp = oldValue;
      },
    },
    cityGrowOptions: {
      deep: true,
      immediate: true,
      handler(next) {
        let vm = this;
        vm.initial = true;
        vm.disabled = true;
        if (typeof next === 'string' && next !== '') {
          // 先判断是二维地图文档还是三维地图文档
          if (next.indexOf("/g3d") > -1) {
            this.$message.warning("暂不支持三维地图文档");
            // vm.featureStyle.url
            //调取三维地图文档服务获取属性
            // vm.queryFields(next);
            // vm.baseUrl = next;
          } else if (next.indexOf('igs/rest/mrfs/docs') > -1) {
            vm.queryFields(next);
            vm.baseUrl = next;
            vm.urlWays = 'wrote';
          }
        } else if (Object.keys(next).length !== 0) {
          vm.urlWays = 'selected';
          vm.baseUrl = next.baseUrl;
          vm.queryFields(vm.baseUrl);
          vm.featureStyle.startTimeField = next.startTimeField;
          vm.featureStyle.endTimeField = next.endTimeField;
          vm.featureStyle.heightField = next.heightField;
          vm.getGrowTime();
        } else {
          vm.baseUrl = '';
          vm.$_clearData();
          vm.dataFields = [];
        }
      }
    },
  },
  methods: {
    queryFields(url) {
      let vm = this;
      // 从url中获取ip、port、docname
      // 用正则
      const protocolReg = /^\w+:\/\//;
      if (!protocolReg.test(url)) {
        url = "http://" + url
      }
      const ip = new URL(url).hostname;
      const port = new URL(url).port;
      const pathName = new URL(url).pathname;
      const pathNameArr = pathName.split('/');
      let docName = pathNameArr[pathNameArr.length - 3];
      docName = decodeURIComponent(docName);
      const layerIndex = Number(pathNameArr[pathNameArr.length - 1]);
      // 二维矢量文档
      let queryStruct = new Zondy.Service.QueryFeatureStruct();
      //是否包含几何图形信息
      queryStruct.IncludeGeometry = true;
      //是否包含属性信息
      queryStruct.IncludeAttribute = true;
      //是否包含图形显示参数
      queryStruct.IncludeWebGraphic = false;
      //创建一个用于查询的矩形
      let geomObj = new Zondy.Object.Rectangle(93, 35, 111, 56);
      //制定查询规则
      let rule = new Zondy.Service.QueryFeatureRule({
        //是否将要素的可见性计算在内
        EnableDisplayCondition: false,
        //是否完全包含
        MustInside: false,
        //是否仅比较要素的外包矩形
        CompareRectOnly: false,
        //是否相交
        Intersect: true
      });
      //实例化查询参数对象
      let queryParam = new Zondy.Service.QueryParameter({
        //几何对象
        geometry: geomObj,
        //结果格式
        resultFormat: "json",
        //查询结构
        struct: queryStruct,
        //查询规则
        rule: rule
      });
      //设置查询分页号
      queryParam.pageIndex = 0;
      //设置查询要素数目
      queryParam.recordNumber = 20;
      //实例化地图文档查询服务对象
      let queryService = new Zondy.Service.QueryDocFeature(queryParam, docName, layerIndex, {
        //IP地址
        ip: ip,
        //端口号
        port: port
      });
      //执行查询操作，querySuccess为成功回调，queryError为失败回调
      queryService.query(function (res) {
        vm.$_getFields(res);
      }, function (error) {
        vm.$message.warning("错误的城市生长数据地址");
      });
    },

    $_getFields(result) {
      let attStruct = result.AttStruct.FldName;
      this.dataFields = attStruct;
      this.isDisabled = false;
    },

    onFieldChange(val, key) {
      let vm = this;
      vm.disabled = false;
      vm.featureStyle[key] = val;
      if (key === 'endTimeField' && val !== '') {
        vm.getGrowTime();
      }
    },

    onDateChange(date, dateString) {
      let vm = this;
      let startTime = parseInt(moment(date[0]).valueOf() / 1000);
      let endTime = parseInt(moment(date[1]).valueOf() / 1000);
      vm.featureStyle['startTime'] = startTime;
      vm.featureStyle['endTime'] = endTime;
      vm.disabled = false;
    },

    onHeightScale(val, key) {
      let vm = this;
      vm.featureStyle[key] = val;
      vm.disabled = false;
    },

    onCommitOptions() {
      let vm = this;
      vm.featureStyle.colors = [];
      vm.featureStyle.times = [];
      for (let i = 0; i < vm.colorsCopy.length; i++) {
        vm.featureStyle.colors.push(vm.colorsCopy[i].color);
        if (i !== 0) {
          vm.featureStyle.times.push(vm.colorsCopy[i].min);
        }
      }

      // 先判断必须的值是否有：startTimeField、endTimeField、heightField
      if (vm.baseUrl !== '' && vm.featureStyle.startTimeField !== '' && vm.featureStyle.endTimeField !== '' && vm.featureStyle.heightField !== '') {
        // 深拷贝
        vm.submitFeatureStyle = clonedeep(vm.featureStyle);
        vm.colorSettingTemp = vm.colorsCopy;
        this.$emit('commitOptions', vm.submitFeatureStyle);
        vm.disabled = true;
        for (let i = 0; i < vm.layerIndexArray.length; i++) {
          if (this.Cesium.defined(vm.layerIndexArray[i])) {
            this.viewer.scene.layers.removeVectorLayerByID(vm.layerIndexArray[i]);
          }
        }
      }
    },

    $_clearData() {
      const vm = this;
      vm.featureStyle.startTimeField = '';
      vm.featureStyle.endTimeField = '';
      vm.featureStyle.heightField = '';
      vm.featureStyle.startTime = undefined;
      vm.featureStyle.endTime = undefined;
      vm.dataRange = undefined;
      vm.colorsCopy = [];
      vm.featureStyle.heightRatio = 1;
      vm.featureStyle.isGrowHeight = false
    },

    remove() {
      // 清空数据
      let vm = this;
      vm.disabled = true;
      vm.initial = false;
      if (Object.keys(vm.submitFeatureStyle).length !== 0) {
        vm.featureStyle.startTimeField = vm.submitFeatureStyle.startTimeField;
        vm.featureStyle.endTimeField = vm.submitFeatureStyle.endTimeField;
        vm.featureStyle.heightField = vm.submitFeatureStyle.heightField;
        vm.featureStyle.startTime = vm.submitFeatureStyle.startTime;
        vm.featureStyle.endTime = vm.submitFeatureStyle.endTime;
        vm.featureStyle.heightRatio = vm.submitFeatureStyle.heightRatio;
        vm.featureStyle.isGrowHeight = vm.submitFeatureStyle.isGrowHeight;
        vm.dataRange = vm.dataRangeTemp;
      } else if (vm.urlWays !== undefined) {
        if (vm.urlWays === 'wrote') {
          vm.$_clearData();
        } else if (vm.urlWays === 'selected') {
          vm.featureStyle.startTime = undefined;
          vm.featureStyle.endTime = undefined;
          vm.dataRange = undefined;
        }
        vm.featureStyle.heightRatio = 1;
        vm.featureStyle.isGrowHeight = false
      }
      if (vm.colorChangedTag) {
        vm.colorsCopy = vm.colorSettingTemp;
        vm.colorChangedTag = false;
        vm.disabled = true
      }
      for (let i = 0; i < vm.layerIndexArray.length; i++) {
        if (this.Cesium.defined(vm.layerIndexArray[i])) {
          this.viewer.scene.layers.removeVectorLayerByID(vm.layerIndexArray[i]);
        }
      }
    },

    getGrowTime() {
      let vm = this;
      if (vm.featureStyle.startTimeField && vm.featureStyle.endTimeField) {
        let options = {
          style: {
            type: 'cityGrow',
            styleOptions: {
              startTimeField: vm.featureStyle.startTimeField,
              endTimeField: vm.featureStyle.endTimeField,
              onReady: function (timeControl) {
                vm.formatType = 'year';
                vm.colorsCopy = [];
                // vm.featureStyle.colors = [];
                let startYear = vm.formatDate(timeControl.startTime);
                let endYear = vm.formatDate(timeControl.endTime);
                let steps = Math.floor((endYear - startYear) / vm.buildingColors.length);
                let colors = vm.buildingColors;
                if (colors.length > 0) {
                  for (let i = 0; i < colors.length; i++) {
                    let obj = {};
                    if (i === 0) {
                      obj.min = startYear;
                      obj.max = startYear + steps;
                      obj.color = colors[i];
                    } else if (i === colors.length - 1) {
                      obj.min = startYear + steps * i;
                      obj.max = endYear;
                      obj.color = colors[i];
                    } else {
                      obj.min = startYear + steps * i;
                      obj.max = startYear + steps * (i + 1);
                      obj.color = colors[i];
                    }
                    vm.colorsCopy.push(obj);
                    vm.colorSettingTemp = vm.colorsCopy;
                  }
                }
                vm.initial = true
              },
            }
          }
        }
        vm.viewer.scene.layers.appendVectorLayer(vm.baseUrl, {
          ...options,
          getDocLayerIndexes: function (indexs) {
            vm.layerIndexArray.push(indexs[0]);
          }
        });
      }
    },

    formatDate(timestamp) {
      // 时间戳转时间 方法一：
      let time = new Date(timestamp * 1000);
      let y = time.getFullYear();
      let m = time.getMonth() + 1;
      let d = time.getDate();
      switch (this.formatType) {
        case "year":
          return y;
        case "month":
          return y + '-' + this.addT(m);
        case "day":
          return y + '-' + this.addT(m) + '-' + this.addT(d);
      }
      // 时间戳转时间 方法二：
      // return moment(timestamp).format("YYYY-MM-DD");
    },
    changeGrowHeight(val) {
      const vm = this;
      this.featureStyle.isGrowHeight = val;
      vm.disabled = false;
    },
    colorChanged() {
    },
    colorInput(){
      const vm = this;
      vm.disabled = false;
      vm.colorChangedTag = true;
    },
    unmount() {
      this.baseUrl = '';
      this.urlWays = undefined;
      this.$_clearData();
      this.dataFields = [];
      this.colorsCopy = [];
      this.submitFeatureStyle = {};
      this.colorSettingTemp = [];
      this.remove();
    }
  }
}
</script>

<style scoped>
.mapgis-city-grow-options {
  max-height: calc(50vh);
  overflow-y: auto;
}

::v-deep .mapgis-ui-input-affix-wrapper .mapgis-ui-input:not(:first-child) {
  padding-left: 38px;
}
</style>