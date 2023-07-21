<template>
  <div>
    <slot>
      <div class="mapgis-widget-model-overlay-analysis">
        <slot name="selectLayer" />
        <mapgis-ui-group-tab title="叠加参数设置" id="title-space" />
        <mapgis-ui-form-model
          v-bind="formItemLayout"
          :layout="layout"
          labelAlign="left"
          :colon="false"
        >
          <!-- 2.叠加参数设置 -->
          <mapgis-ui-form-model-item label="叠加方式">
            <mapgis-ui-select
              v-model="operateType"
              :placeholder="overType[1].name"
              @change="selectCurrentMethod($event)"
            >
              <mapgis-ui-select-option
                v-for="(item, index) in overType"
                :key="index"
                :value="item.typeValue"
                >{{ item.name }}</mapgis-ui-select-option
              >
            </mapgis-ui-select>
          </mapgis-ui-form-model-item>
          <mapgis-ui-form-model-item label="容差半径">
            <mapgis-ui-input-number
              autoWidth
              v-model="tolerance"
            ></mapgis-ui-input-number>
          </mapgis-ui-form-model-item>
          <mapgis-ui-checkbox
            :default-checked="attOperateType"
            v-model="attOperateType"
            style="line-height:32px;"
            >进行属性操作</mapgis-ui-checkbox
          >
          <br />
          <mapgis-ui-checkbox
            :default-checked="multiOperate"
            v-model="multiOperate"
            style="line-height:32px;"
            >进行复合要素操作</mapgis-ui-checkbox
          >
          <mapgis-ui-group-tab
            title="输出结果"
            :isTitleBold="false"
            :hasTopMargin="false"
            :hasBottomMargin="false"
          >
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
              :default-checked="overlayAdd"
              @change="sendOverlayAdd"
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

export default {
  name: "mapgis-3d-analysis-model-overlay",
  props: {
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
     * @description 图层级叠加 "Layer" 要素级叠加 "Feature"
     */
    srcType: {
      type: String,
      default: "Layer"
    },
    /**
     * @type String
     * @default ""
     * @description 图层级叠加 输入被叠加图层的gdbp
     */
    srcALayer: {
      type: String,
      default: ""
    },
    /**
     * @type String
     * @default ""
     * @description 图层级叠加 输入叠加图层的gdbp
     */
    srcBLayer: {
      type: String,
      default: ""
    },
    /**
     * @type Object
     * @default {}
     * @description 要素级叠加 GeoJSON
     */
    srcAFeature: {
      type: Object,
      default: function() {
        return {};
      }
    },
    /**
     * @type Object
     * @default {}
     * @description 要素级叠加 GeoJSON
     */
    srcBFeature: {
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
      overType: [
        { name: "求交", type: "Ovly_Inter", typeValue: 0 },
        { name: "求减（差）", type: "Ovly_Sub", typeValue: 1 }
      ],
      operateType: 0, // 叠加分析类型，取值0-1，默认为1 Ovly_Inter
      tolerance: 0.001, // 容差半径 Number
      attOperateType: true, // 是否进行属性操作，0不允许 1允许，默认为1 Number
      multiOperate: false, // 进行复合要素操作，0不允许 1允许，默认为0 Number
      destLayer: "",
      overlayAdd: true, // 结果添加到地图文档，默认为true
      maskShow: false,
      maskText: "正在分析中, 请稍等..."
    };
  },
  watch: {
    srcALayer: {
      handler(val, oldval) {
        if (val != oldval) {
          this.destLayer = val + this.currentTime();
        }
      },
      immediate: true
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
    },
    domain() {
      var domain;
      if (!!this.baseUrl && this.baseUrl.length > 0) {
        var url = new URL(this.baseUrl);
        domain = url.origin;
      }
      return domain;
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
    selectCurrentMethod(event) {
      this.operateType = event;
    },
    sendOverlayAdd() {
      this.overlayAdd = !this.overlayAdd;
    },
    currentTime() {
      const now = new Date();
      let hh = String(now.getHours());
      let mm = String(now.getMinutes());
      let ss = String(now.getSeconds());
      if (hh.length == 1) hh = `0${hh}`;
      if (mm.length == 1) mm = `0${mm}`;
      if (ss.length == 1) ss = `0${ss}`;
      return `overlay${hh}${mm}${ss}`;
    },
    async run() {
      this.maskShow = true;
      this.$emit("listenOverlayAdd", this.overlayAdd);
      let srcOidListA = [];
      let srcOidListB = [];
      if (this.srcType == "Feature") {
        if (this.srcAFeature.features && this.srcAFeature.features.length > 0) {
          for (let i = 0; i < this.srcAFeature.features.length; i++) {
            const { FID } = this.srcAFeature.features[i].properties;
            srcOidListA.push(FID);
          }
        }
        if (this.srcBFeature.features && this.srcBFeature.features.length > 0) {
          for (let i = 0; i < this.srcBFeature.features.length; i++) {
            const { FID } = this.srcBFeature.features[i].properties;
            srcOidListB.push(FID);
          }
        }
      }
      const options = {
        srcClsA: this.srcALayer,
        srcClsB: this.srcBLayer,
        desCls: this.destLayer,
        operateType: this.operateType,
        attOperateType: this.attOperateType ? 1 : 0,
        multiOperate: this.multiOperate ? 1 : 0,
        tolerance: this.tolerance,
        srcOidListA: srcOidListA.length > 0 ? srcOidListA.join(",") : undefined,
        srcOidListB: srcOidListB.length > 0 ? srcOidListB.join(",") : undefined
      };
      const res = await this.modelOverlay(options);
      console.log(res);
      this.maskShow = false;
      if (res) {
        this.AnalysisSuccess();
      }
    },
    modelOverlay(options) {
      const {
        srcClsA,
        srcClsB,
        desCls,
        operateType,
        attOperateType,
        multiOperate,
        tolerance,
        srcOidListA,
        srcOidListB
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
      const url = `${this.domain}/igs/rest/mrfws/execute/600371?isAsy=false&f=json`;
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
    // 将一张图的当前结果集GeoJSON数据转化为点集数组
    transformToPoint(geojson) {
      var polygonList = [];
      for (var i = 0; i < geojson.features.length; i++) {
        if (geojson.features[i].geometry.type == "Polygon") {
          var tempPolygon = geojson.features[i].geometry.coordinates[0];
          polygonList.push(tempPolygon);
        }
      }
      return polygonList;
    },
    // 将点集数组转化为MapGIS区要素几何图形信息类
    transformToAnyLine(pointList) {
      var anyLineList = [];
      for (var k = 0; k < pointList.length; k++) {
        var arcPointList = [];
        for (var i = 0; i < pointList[k].length; i++) {
          var point = new Zondy.Object.Point2D(
            pointList[k][i][0],
            pointList[k][i][1]
          );
          arcPointList.push(point);
        }
        var arc = new Zondy.Object.Arc(arcPointList);
        var anyLine = new Zondy.Object.AnyLine([arc]);
        anyLineList.push(anyLine);
      }
      return anyLineList;
    },
    cancel() {
      this.maskShow = false;
      Object.assign(this.$data, this.$options.data());
      // 重置结果输出路径
      this.destLayer = this.srcALayer + this.currentTime();
    },
    AnalysisSuccess(data) {
      this.maskShow = false;
      console.log("----------叠加分析成功--------------");
      this.$emit("listenLayer", this.destLayer);
    },
    deleteResult() {
      this.$emit("deleteResult");
    }
  }
};
</script>

<style scoped>
.mapgis-widget-model-overlay-analysis {
  /* height: auto; */
  max-height: calc(60vh);
  overflow-y: auto;
  overflow-x: hidden;
}
.mapgis-ui-form-item {
  /* width: 300px; */
  margin: 0px;
}
.mapgis-ui-row.mapgis-ui-form-item {
  /* margin: 10px 0px 10px 0px; */
}
.iconfont-btn {
  margin: 0 5px;
}
</style>
