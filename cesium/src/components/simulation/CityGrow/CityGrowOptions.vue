<template>
  <div class="mapgis-city-grow-options">
    <mapgis-ui-select-panel
        label="开始时间字段"
        v-model="featureStyle.startTimeField"
        :selectOptions="dataFields"
        :disabled="isDisabled"
        @change="val => onFieldChange(val, 'startTimeField') ">
    </mapgis-ui-select-panel>
    <mapgis-ui-select-panel
        label="结束时间字段"
        v-model="featureStyle.endTimeField"
        :selectOptions="dataFields"
        :disabled="isDisabled"
        :placeholder="placeholder"
        @change="val => onFieldChange(val, 'endTimeField') ">
    </mapgis-ui-select-panel>
    <mapgis-ui-select-panel
        label="高程字段"
        v-model="featureStyle.heightField"
        :selectOptions="dataFields"
        :disabled="isDisabled"
        :placeholder="placeholder"
        @change="val => onFieldChange(val, 'heightField') ">
    </mapgis-ui-select-panel>
    <mapgis-ui-input-number-panel
        size="small"
        label="高程比"
        v-model="heightScale"
        :placeholder="placeholder"
        @change="val => onHeightScale(val,  'heightScale')"/>

    <mapgis-ui-range-picker @change="onDateChange" style="margin:7px 0"></mapgis-ui-range-picker>

    <mapgis-ui-colors-setting
        v-model="colorsCopy"
        :rangeField="'高度'"
        :showNumber="false"
        style="margin-top: 7px"
    >
    </mapgis-ui-colors-setting>
    <mapgis-ui-setting-footer>
      <mapgis-ui-button type="primary" @click="onCommitOptions"
      >确认
      </mapgis-ui-button
      >
      <mapgis-ui-button @click="remove">取消</mapgis-ui-button>
      <!--      <mapgis-ui-button @click="deleteCityGrow">消除城市生长</mapgis-ui-button>-->
    </mapgis-ui-setting-footer>
  </div>
</template>

<script>
import {MRFS} from "@mapgis/webclient-es6-service";

const {QueryDocFeature} = MRFS;
import moment from "moment";

export default {
  name: "mapgis-3d-city-grow-options",
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
        return ["#fff0f6", "#ff85c0", "#eb2f96"]
      }
    }
  },
  data() {
    return {
      baseUrl: "",
      isDisabled: true,
      placeholder: '请选择对应字段',
      dataFields: [],
      heightScale: 1,
      colorsCopy: [],
      featureStyle: {
        startTimeField: "",
        endTimeField: "",
        heightField: "",
      }
    }
  },
  mounted() {
  },
  watch: {
    cityGrowOptions: {
      deep: true,
      immediate: true,
      handler(next) {
        let vm = this;
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
          }
        } else {
          vm.baseUrl = next.baseUrl;
          vm.featureStyle.startTimeField = next.startTimeField
          vm.featureStyle.endTimeField = next.endTimeField
          vm.featureStyle.heightField = next.heightField
        }
      }
    },
    buildingColors: {
      handler(next) {
        let vm = this;
        let colors = next;
        if (colors.length > 0) {
          for (let i = 0; i < colors.length; i++) {
            let obj = {};
            obj.min = 60 * i;
            obj.max = 60 * (i + 1);
            obj.color = colors[i];
            vm.colorsCopy.push(obj);
            vm.featureStyle.colors = vm.colorsCopy;
          }
        }
      },
      deep: true,
      immediate: true
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
      const docName = pathNameArr[pathNameArr.length - 3];
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
        console.log(error);
      });
    },

    $_getFields(result) {
      let attStruct = result.AttStruct.FldName;
      this.dataFields = attStruct;
      this.isDisabled = false;
    },

    onFieldChange(val, key) {
      let vm = this;
      vm.featureStyle[key] = val;
    },

    onDateChange(date, dateString) {
      let vm = this;
      let startTime = parseInt(moment(date[0]).valueOf() / 1000);
      let endTime = parseInt(moment(date[1]).valueOf() / 1000);
      vm.featureStyle['startTime'] = startTime;
      vm.featureStyle['endTime'] = endTime;
    },

    onHeightScale(val, key) {
      let vm = this;
      vm.featureStyle[key] = val;
    },

    onCommitOptions() {
      let vm = this;
      vm.featureStyle.colors = [];
      for (let i = 0; i < vm.colorsCopy.length; i++) {
        vm.featureStyle.colors.push(vm.colorsCopy[i].color);
      }
      // 先判断必须的值是否有：startTimeField、endTimeField、heightField
      if (vm.baseUrl !== '' && vm.featureStyle.startTimeField !== '' && vm.featureStyle.endTimeField !== '' && vm.featureStyle.heightField !== '') {
        this.$emit('commitOptions', vm.featureStyle);
      }
    },

    remove() {
      // 清空数据
      let vm = this;
      vm.featureStyle.startTimeField = '';
      vm.featureStyle.endTimeField = '';
      vm.featureStyle.heightField = '';
      vm.featureStyle.heightScale = 1;
      vm.heightScale = 1;
    }
  }
}
</script>

<style scoped>
.mapgis-city-grow-options {
  max-height: calc(60vh);
  overflow-y: auto;
}
</style>