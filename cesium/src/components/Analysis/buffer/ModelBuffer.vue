<template>
  <div>
    <slot>
      <div class="mapgis-widget-buffer-analysis">
        <slot name="selectLayer" />
        <mapgis-ui-group-tab title="缓冲区参数设置" id="title-space" />
        <!-- 图层级缓冲区分析UI面板 -->
        <mapgis-ui-form-model
          v-bind="formItemLayout"
          :layout="layout"
          labelAlign="left"
          :colon="false"
        >
          <mapgis-ui-form-model-item label="缓冲半径">
            <mapgis-ui-radio-group
              v-model="isByAtt"
              :options="[
                { label: '指定半径', value: false },
                { label: '根据属性值', value: true }
              ]"
              :disabled="srcType == 'Feature'"
            >
            </mapgis-ui-radio-group>
          </mapgis-ui-form-model-item>
          <mapgis-ui-form-model-item label="设置半径" v-show="!isByAtt">
            <mapgis-ui-input-number
              autoWidth
              v-model="bufferRadius"
            ></mapgis-ui-input-number>
          </mapgis-ui-form-model-item>
          <mapgis-ui-form-model-item label="半径单位" v-show="!isByAtt">
            <mapgis-ui-select
              v-model="selectedUnit"
              :placeholder="unit[0].name"
              @change="selectCurrentUnit($event)"
            >
              <mapgis-ui-select-option
                v-for="(item, index) in unit"
                :key="index"
                :value="item.unitParam"
                >{{ item.name }}</mapgis-ui-select-option
              >
            </mapgis-ui-select>
          </mapgis-ui-form-model-item>
          <mapgis-ui-form-model-item label="选择字段" v-show="isByAtt">
            <mapgis-ui-select
              v-model="selectedFldName"
              :placeholder="fldName[0].FldName"
              @change="selectAtt($event)"
            >
              <mapgis-ui-select-option
                v-for="(item, index) in fldName"
                :key="index"
                :value="item.FldName"
                >{{ item.FldName }}</mapgis-ui-select-option
              >
            </mapgis-ui-select>
          </mapgis-ui-form-model-item>
          <mapgis-ui-form-model-item label="缓冲区接口样式">
            <mapgis-ui-radio-group
              v-model="jointStyle"
              :options="[
                { label: '圆头', value: 1 },
                { label: '平头', value: 0 }
              ]"
            >
            </mapgis-ui-radio-group>
          </mapgis-ui-form-model-item>
          <mapgis-ui-form-model-item label="截面圆边数">
            <mapgis-ui-input-number
              autoWidth
              v-model="bufferQuality"
            ></mapgis-ui-input-number>
          </mapgis-ui-form-model-item>
          <mapgis-ui-form-model-item label="截面圆边数">
            <mapgis-ui-input-number
              autoWidth
              v-model="simplifyTolerance"
            ></mapgis-ui-input-number>
          </mapgis-ui-form-model-item>
          <mapgis-ui-group-tab
            title="输出结果"
            :isTitleBold="false"
            :hasTopMargin="false"
            :hasBottomMargin="false"
          >
            <mapgis-ui-tooltip slot="handle" title="导出" @click="exportResult">
              <mapgis-ui-iconfont class="iconfont-btn" type="mapgis-daochu" />
            </mapgis-ui-tooltip>
            <mapgis-ui-tooltip slot="handle" title="删除" @click="deleteResult">
              <mapgis-ui-iconfont class="iconfont-btn" type="mapgis-shanchu" />
            </mapgis-ui-tooltip>
          </mapgis-ui-group-tab>
          <mapgis-ui-form-model-item>
            <mapgis-ui-row>
              <mapgis-ui-col :span="24">
                <mapgis-ui-input v-model="destLayer"></mapgis-ui-input>
              </mapgis-ui-col>
            </mapgis-ui-row>
            <mapgis-ui-checkbox
              style="line-height:32px;"
              :default-checked="bufferAdd"
              @change="sendBufferAdd"
              >将结果图层添加到视图中</mapgis-ui-checkbox
            >
          </mapgis-ui-form-model-item>
        </mapgis-ui-form-model>
      </div>
      <mapgis-ui-setting-footer>
        <mapgis-ui-button type="primary" @click="run">分析</mapgis-ui-button>
        <mapgis-ui-button @click="cancel">重置</mapgis-ui-button>
      </mapgis-ui-setting-footer>
      <mapgis-ui-mask
        v-if="useMask"
        :parentDivClass="'map-wrapper'"
        :loading="maskShow"
        :text="maskText"
      ></mapgis-ui-mask>
    </slot>
  </div>
</template>
<script>
import axios from "axios";
// 引入es6-service内置封装接口
import * as Zondy from "@mapgis/webclient-es6-service";
export default {
  name: "mapgis-3d-analysis-model-buffer",
  inject: ["Cesium", "vueCesium", "viewer"],
  props: {
    /**
     * @type Object
     * @default {}
     * @description 组件样式
     */
    layout: {
      type: String,
      default: "vertical" // 'horizontal' 'vertical' 'inline'
    },
    /**
     * @type String
     * @default "http://localhost:6163"
     * @description Zondy.Service.HttpRequest ip port，对字符串url进行处理获得 ip/域名 port
     */
    baseUrl: {
      type: String,
      default: "http://localhost:6163"
    },
    /**
     * @type String
     * @default "Layer"
     * @description 图层级缓冲 "Layer" 要素级缓冲 "Feature"
     */
    srcType: {
      type: String,
      default: "Feature"
    },
    /**
     * @type String
     * @default ""
     * @description 图层级缓冲 输入gdbp
     */
    srcLayer: {
      type: String,
      default: "gdbp://MapGISLocalPlus/sample/sfcls/等值线"
    },
    /**
     * @type Object
     * @default {}
     * @description 要素级缓冲 输入JSON
     */
    srcFeature: {
      type: Object,
      default: function() {
        return {};
      }
    },
    /**
     * @type Boolean
     * @default true
     * @description 是否使用内置的遮罩层
     */
    useMask: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      // 图层级半径缓冲
      isByAtt: false,
      bufferRadius: 100,
      unit: [
        { name: "米", unitParam: "meters" },
        { name: "千米", unitParam: "kilometers" },
        { name: "英里", unitParam: "miles" },
        { name: "度", unitParam: "degrees" }
      ],
      selectedUnit: "meters",
      jointStyle: 0,
      bufferQuality: 100,
      simplifyTolerance: 100,
      fldName: [{ FldName: "", FldType: "" }],
      selectedFldName: "Oid",
      destLayer: "",
      bufferAdd: true,
      // 监听组件内部缓冲状态，结束this.$emit("listenFinish", finish)
      finish: false,
      maskShow: false,
      maskText: "正在分析中, 请稍等..."
    };
  },
  watch: {
    srcType(val, oldval) {
      this.destLayer = this.srcLayer + this.currentTime();
      if (val == "Feature") {
        this.isByAtt = false;
      }
    },
    srcLayer: {
      handler(val, oldval) {
        if (val != oldval) {
          this.destLayer = val + this.currentTime();
          this.getAttribute();
        }
      },
      immediate: true
    },
    isByAtt(val, oldval) {
      if (val == true) {
        this.getAttribute();
      }
    }
  },
  mounted() {
    this.mount();
  },
  destroyed() {
    this.unmount();
  },
  methods: {
    mount() {
      this.$emit("load", this);
    },
    unmount() {
      this.maskShow = false;
    },
    sendBufferAdd() {
      this.bufferAdd = !this.bufferAdd;
    },
    // 查询IGServer，实现获取gdbp图层中的属性字段名称与类型
    getAttribute() {
      var domain;
      if (!!this.baseUrl && this.baseUrl.length > 0) {
        var url = new URL(this.baseUrl);
        domain = url.origin;
      }
      //创建查询结构对象
      var queryStruct = new Zondy.MRFS.QueryFeatureStruct();
      //是否包含几何图形信息
      queryStruct.IncludeGeometry = false;
      //指定查询规则
      var rule = new Zondy.MRFS.QueryFeatureRule({
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
      var queryParam = new Zondy.MRFS.QueryByLayerParameter(this.srcLayer, {
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
      queryParam.recordNumber = 1;
      //实例化地图文档查询服务对象
      var queryService = new Zondy.G3D.G3DMapDoc({
        domain: "http://192.168.1.131:8089",
        gdbp: this.srcLayer,
        ...queryParam
      });
      //执行查询操作，querySuccess为成功回调，queryError为失败回调
      queryService.GetFeature(this.onSuccess, () => {
        console.log("获取图层属性信息请求失败");
      });
    },
    onSuccess(data) {
      var tempFldName = [];
      for (var i = 0; i < data.AttStruct.FldName.length; i++) {
        var obj = {};
        obj.FldName = data.AttStruct.FldName[i];
        obj.FldType = data.AttStruct.FldType[i];
        tempFldName.push(obj);
      }
      this.fldName = tempFldName;
      this.selectedFldName = this.fldName[0].FldName;
    },
    selectAtt(event) {
      this.selectedFldName = event;
    },
    selectCurrentUnit(event) {
      this.selectedUnit = event;
    },
    convertRadUnit(currentRad, currentUnit) {
      const earthRadius = 6371.393; // 地球半径, km
      switch (currentUnit) {
        case "meters":
          // 米转度公式
          currentRad = ((currentRad / 1000) * 180) / (Math.PI * earthRadius);
          break;
        case "kilometers":
          // 千米转度公式: degree（圆心角）=l(弧长) × 180/(π（圆周率）× r（半径）)  纬度1°约等于111km
          currentRad = (currentRad * 180) / (Math.PI * earthRadius);
          break;
        case "miles":
          // 英里转度 1英里=1.609344千米
          currentRad = (currentRad * 1.609344 * 180) / (Math.PI * earthRadius);
          break;
        case "degrees":
          currentRad = currentRad * 1;
          break;
      }
      return currentRad;
    },
    currentTime() {
      const now = new Date();
      let hh = String(now.getHours());
      let mm = String(now.getMinutes());
      let ss = String(now.getSeconds());
      if (hh.length == 1) hh = `0${hh}`;
      if (mm.length == 1) mm = `0${mm}`;
      if (ss.length == 1) ss = `0${ss}`;
      return `buffer${hh}${mm}${ss}`;
    },
    /**
     * 图层级缓冲分析
     * @function MRCS,MRFWS
     * @param {Object} options 缓冲参数
     * @param {String} options.ip ip地址或域名 localhost
     * @param {String} options.port 端口号 6163
     * @param {Boolean} options.isByAtt 指定缓冲方式 半径缓冲 false
     * @param {Number} options.leftRad 左半径 100
     * @param {Number} options.rightRad 右半径 100
     * @param {String} options.fldName 缓冲字段
     * @param {String} options.srcInfo 输入gdbp
     * @param {String} options.desInfo 输出gdbp
     * @param {Number} options.angelType 拐角类型 默认圆头 0 尖头 1
     * @param {Boolean} options.isDissolve 缓冲区是否合并 默认合并 true 不合并 false
     */
    async run() {
      this.maskShow = true;
      this.$emit("listenBufferAdd", this.bufferAdd);
      let srcOidList = [];
      if (this.srcType == "Feature") {
        if (this.srcFeature.features && this.srcFeature.features.length > 0) {
          for (let i = 0; i < this.srcFeature.features.length; i++) {
            const { FID } = this.srcFeature.features[i].properties;
            srcOidList.push(FID);
          }
        }
      }
      var bufferRadius = this.convertRadUnit(
        this.bufferRadius,
        this.selectedUnit
      );
      const { jointStyle, bufferQuality, simplifyTolerance } = this;
      const options = {
        srcCls: this.srcLayer,
        desCls: this.destLayer,
        bufferRadius,
        jointStyle,
        bufferQuality,
        simplifyTolerance,
        srcOidList: srcOidList.length > 0 ? srcOidList.join(",") : undefined,
        fieldName: this.isByAtt ? this.selectedFldName : undefined
      };
      const res = await this.modelBuffer(options);
      console.log(res);
      this.maskShow = false;
      if (this.res) {
        this.AnalysisSuccess();
      }
    },
    modelBuffer(options) {
      const {
        srcCls,
        desCls,
        bufferRadius,
        jointStyle,
        bufferQuality,
        simplifyTolerance,
        srcOidList,
        fieldName
      } = options;
      const keys = Object.keys(options);
      let paramArr = [];
      for (let i = 0; i < keys.length; i++) {
        const param = {
          Key: keys[i],
          Value: options[keys[i]]
        };
        paramArr.push(param);
      }
      const url = `http://192.168.1.131:8089/igs/rest/mrfws/execute/600372?isAsy=false&f=json`;
      const promise = new Promise((resolve, reject) => {
        axios.post(url, paramArr).then(res => {
          const { data } = res;
          if (!data) {
            resolve(undefined);
          } else {
            resolve(data);
          }
        });
      });
      return promise.then(data => {
        return data;
      });
    },
    AnalysisSuccess(data) {
      this.maskShow = false;
      // 传出gdbp路径，缓冲区样式，renderType类型
      this.$emit("listenLayer", this.destLayer);
    },
    cancel() {
      this.maskShow = false;
      Object.assign(this.$data, this.$options.data());
    },
    exportResult() {
      this.$emit("exportResult");
    },
    deleteResult() {
      this.$emit("deleteResult");
    }
  },
  computed: {
    formItemLayout({ layout }) {
      return layout === "horizontal"
        ? {
            labelCol: { span: 6 },
            wrapperCol: { span: 17 }
          }
        : {};
    }
  }
};
</script>

<style scoped>
.mapgis-widget-buffer-analysis {
  /* height: auto; */
  max-height: calc(60vh);
  overflow-y: auto;
  overflow-x: hidden;
}
/* .mapgis-ui-form-item {
	width: 300px;
} */
.mapgis-ui-form-item {
  margin-bottom: 0px;
}
.iconfont-btn {
  margin: 0 5px;
}
</style>
