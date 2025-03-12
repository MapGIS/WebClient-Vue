<template>
  <div>
    <div class="mapgis-city-grow-options">
      <mapgis-ui-select-panel label="开始时间字段" v-model="featureStyle.startTimeField" :labelCol="24" :wrapperCol="24"
        :selectOptions="dataFields" :disabled="isDisabled" @change="val => onFieldChange(val, 'startTimeField')">
      </mapgis-ui-select-panel>
      <mapgis-ui-select-panel label="结束时间字段" v-model="featureStyle.endTimeField" :labelCol="24" :wrapperCol="24"
        :selectOptions="dataFields" :disabled="isDisabled" :placeholder="placeholder"
        @change="val => onFieldChange(val, 'endTimeField')">
      </mapgis-ui-select-panel>

      <mapgis-ui-switch-panel size="small" :labelCol="{ span: 3 }" :wrapperCol="{ span: 20 }" layout="horizontal"
        label="是否显示网格" :checked="featureStyle.isGrowHeight" @changeChecked="changeGrowHeight"></mapgis-ui-switch-panel>


      <mapgis-ui-colors-setting v-model="colorsCopy" :rangeField="'时间段'" style="margin-top: 8px"
        v-if="colorsCopy.length > 0" @input="colorInput">
      </mapgis-ui-colors-setting>
    </div>
    <mapgis-ui-setting-footer>
      <mapgis-ui-button type="primary" @click="onCommitOptions">
        确认
      </mapgis-ui-button>
      <mapgis-ui-button @click="remove">取消</mapgis-ui-button>
    </mapgis-ui-setting-footer>
  </div>
</template>

<script>
import { MRFS } from "@mapgis/webclient-es6-service";

const { QueryDocFeature } = MRFS;
import moment from "moment";
import clonedeep from "lodash.clonedeep";

export default {
  name: "mapgis-3d-city-grow-options",
  inject: ["Cesium", "vueCesium", "viewer"],
  props: {
    cityGrowOptions: {
      type: [Object, String],
      default: () => {
        return {};
      }
    },
    buildingColors: {
      type: Array,
      default: () => {
        return [
          "rgba(245,33,0,1)",
          "rgba(255,121,26,1)",
          "rgba(255,164,46,1)",
          "rgba(255,209,82,1)"
        ];
      }
    },
    dataFields: {
      type: Array,
      default: () => []
    },
    growAttributes: {
      type: Object,
      default: () => { }
    },
  },
  data() {
    return {
      initial: true,
      baseUrl: "",
      isDisabled: true,
      placeholder: "请选择对应字段",
      colorsCopy: [],
      colorWithTime: [],
      featureStyle: {
        startTimeField: "",
        endTimeField: "",
        isGrowHeight: false
      },
      switchSize: "small",
      // 定义url的方式是选择还是手输
      urlWays: undefined,
      // 时间数据暂存状态
      dataRangeTemp: undefined,
      // 颜色列表是否修改的标志
      colorChangedTag: false,
      // 把获取到的颜色设置表参数暂存
      colorSettingTemp: [],
      //确认按钮保存参数面板数据
      submitFeatureStyle: {}
    };
  },
  mounted() { },
  beforeDestroy() {
    this.unmount();
  },
  watch: {
    cityGrowOptions: {
      deep: true,
      immediate: true,
      handler(next) {
        let vm = this;
        vm.initial = true;
        if (typeof next === "string" && next !== "") {
          // 先判断是二维地图文档还是三维地图文档
          if (next.indexOf("/g3d") > -1) {
            this.$message.warning("暂不支持三维地图文档");
            // vm.featureStyle.url
            //调取三维地图文档服务获取属性
            // vm.queryFields(next);
            // vm.baseUrl = next;
          } else if (next.indexOf("igs/rest/mrfs/docs") > -1) {
            vm.queryFields(next);
            vm.baseUrl = next;
            vm.urlWays = "wrote";
          }
        } else if (Object.keys(next).length !== 0) {
          vm.urlWays = "selected";
          vm.baseUrl = next.baseUrl;
          vm.featureStyle.startTimeField = next.startTimeField;
          vm.featureStyle.endTimeField = next.endTimeField;
          vm.getGrowTime();
        } else {
          vm.baseUrl = "";
          vm.$_clearData();
        }
      }
    }
  },
  methods: {
    onFieldChange(val, key) {
      let vm = this;
      vm.featureStyle[key] = val;
      if (key === "endTimeField" && val !== "") {
        vm.getGrowTime();
      }
    },

    onCommitOptions() {
      let vm = this;
      vm.featureStyle.colors = [];
      vm.featureStyle.times = [];
      // 组装指定的颜色格式
      for (let i = 0; i < vm.colorWithTime.length; i++) {
        const colorItem = vm.colorWithTime[i].color
        const colorArray = colorItem.match(/\d+(\.\d+)?/g).map(Number)
        vm.featureStyle.colors.push({ ...vm.colorWithTime[i], colorArray });
      }
      vm.featureStyle.startTime = Number(this.growAttributes.startTime)
      vm.featureStyle.endTime = Number(this.growAttributes.endTime)
      // 先判断必须的值是否有：startTimeField、endTimeField、heightField
      if (
        vm.baseUrl !== "" &&
        vm.featureStyle.startTimeField !== "" &&
        vm.featureStyle.endTimeField !== ""
      ) {
        // 深拷贝
        vm.submitFeatureStyle = clonedeep(vm.featureStyle);
        vm.colorSettingTemp = vm.colorsCopy;
        this.$emit("commitOptions", vm.submitFeatureStyle);
      }
    },

    $_clearData() {
      const vm = this;
      vm.featureStyle.startTimeField = "";
      vm.featureStyle.endTimeField = "";
      vm.featureStyle.startTime = undefined;
      vm.featureStyle.endTime = undefined;
      vm.colorsCopy = [];
      vm.featureStyle.isGrowHeight = false;
    },

    remove() {
      // 清空数据
      this.$emit('remove')

    },
    // 获取生长时间用于颜色分段
    getGrowTime() {
      let vm = this;
      if (vm.featureStyle.startTimeField && vm.featureStyle.endTimeField) {

        vm.formatType = "year";
        vm.colorsCopy = [];
        vm.colorWithTime = []
        const startTimestamp = Number(this.growAttributes.startTime)
        const endTimestamp = Number(this.growAttributes.endTime)
        let stampStep = Math.floor(
          (endTimestamp - startTimestamp) / vm.buildingColors.length
        );
        let colors = vm.buildingColors;
        if (colors.length > 0) {
          for (let i = 0; i < colors.length; i++) {
            let obj = {};
            obj.minStamp = startTimestamp + stampStep * i;
            obj.maxStamp = startTimestamp + stampStep * (i + 1);
            if (i === colors.length - 1) {
              obj.maxStamp = endTimestamp
            }
            obj.min = new Date(obj.minStamp * 1000).getFullYear()
            obj.max = new Date(obj.maxStamp * 1000).getFullYear()
            obj.color = colors[i];
            vm.colorsCopy.push(obj);
            vm.colorWithTime.push(obj);
            vm.colorSettingTemp = vm.colorsCopy;
          }
        }
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
          return y + "-" + this.addT(m);
        case "day":
          return y + "-" + this.addT(m) + "-" + this.addT(d);
      }
      // 时间戳转时间 方法二：
      // return moment(timestamp).format("YYYY-MM-DD");
    },
    changeGrowHeight(val) {
      const vm = this;
      this.featureStyle.isGrowHeight = val;
    },
    colorInput() {
      const vm = this;
      vm.colorChangedTag = true;
    },
    unmount() {
      this.baseUrl = "";
      this.urlWays = undefined;
      this.$_clearData();
      this.colorsCopy = [];
      this.submitFeatureStyle = {};
      this.colorSettingTemp = [];
      this.remove();
    }
  }
};
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
