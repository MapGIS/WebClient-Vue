<template>
  <div>
    <slot>
      <mapgis-ui-card class="fill-tool-bar" v-show="!showResult">
        <mapgis-ui-row>
          <mapgis-ui-col :span="8">
            <p class="fill-title">工具选择:</p>
          </mapgis-ui-col>
          <mapgis-ui-col :span="16">
            <mapgis-ui-select class="fill-select" default-value="cut" @change="$_selectChange">
              <mapgis-ui-select-option value="cut">
                开挖分析
              </mapgis-ui-select-option>
              <mapgis-ui-select-option value="fill">
                填方分析
              </mapgis-ui-select-option>
            </mapgis-ui-select>
          </mapgis-ui-col>
        </mapgis-ui-row>
        <mapgis-ui-row>
          <mapgis-ui-col :span="8">
            <p class="fill-title">{{ cutTitle }}</p>
          </mapgis-ui-col>
          <mapgis-ui-col :span="16">
            <mapgis-ui-input-number v-model="heightCopy" class="fill-input"></mapgis-ui-input-number>
          </mapgis-ui-col>
        </mapgis-ui-row>
        <mapgis-ui-row>
          <mapgis-ui-col :span="8">
            <p class="fill-title">x方向采样点个数:</p>
          </mapgis-ui-col>
          <mapgis-ui-col :span="16">
            <mapgis-ui-input-number v-model="xPaneNumCopy" class="fill-input"></mapgis-ui-input-number>
          </mapgis-ui-col>
        </mapgis-ui-row>
        <mapgis-ui-row>
          <mapgis-ui-col :span="8">
            <p class="fill-title">y方向采样点个数:</p>
          </mapgis-ui-col>
          <mapgis-ui-col :span="16">
            <mapgis-ui-input-number v-model="yPaneNumCopy" class="fill-input"></mapgis-ui-input-number>
          </mapgis-ui-col>
        </mapgis-ui-row>
        <mapgis-ui-row>
          <mapgis-ui-button type="primary" class="fill-button" @click="$_startAnalyse">开始分析</mapgis-ui-button>
        </mapgis-ui-row>
      </mapgis-ui-card>
      <mapgis-ui-card class="fill-tool-bar fill-result-bar" v-show="showResult">
        <mapgis-ui-row>
          <mapgis-ui-col :span="8">
            <p class="fill-title">{{volumeTitle}}</p>
          </mapgis-ui-col>
          <mapgis-ui-col :span="16">
            <mapgis-ui-input-number v-model="heightCopy" :disabled="true" class="fill-input"></mapgis-ui-input-number>
          </mapgis-ui-col>
        </mapgis-ui-row>
        <mapgis-ui-row>
          <mapgis-ui-col :span="8">
            <p class="fill-title">体积(立方米):</p>
          </mapgis-ui-col>
          <mapgis-ui-col :span="16">
            <mapgis-ui-input-number v-model="volume" :disabled="true" class="fill-input"></mapgis-ui-input-number>
          </mapgis-ui-col>
        </mapgis-ui-row>
        <mapgis-ui-row>
          <mapgis-ui-col :span="8">
            <p class="fill-title">表面积(平方米):</p>
          </mapgis-ui-col>
          <mapgis-ui-col :span="16">
            <mapgis-ui-input-number v-model="surfaceArea" :disabled="true" class="fill-input"></mapgis-ui-input-number>
          </mapgis-ui-col>
        </mapgis-ui-row>
        <mapgis-ui-row>
          <mapgis-ui-button type="primary" class="fill-button" @click="$_stopAnalyse">停止分析</mapgis-ui-button>
        </mapgis-ui-row>
      </mapgis-ui-card>
    </slot>
  </div>
</template>

<script>
import ServiceLayer from "./BaseLayer";
import * as H from "@turf/helpers";
import * as T from "@turf/turf";
import {getCesiumBaseObject} from "../Utils/util";
export default {
  name: "mapgis-3d-cut-fill",
  mixins: [ServiceLayer],
  data(){
    return {
      showResult: false,
      cutTitle: "开挖高度(米):",
      volumeTitle: "开挖高度(米):",
      type: "cut",
      volume:0,
      surfaceArea:0,
      heightCopy: 0,
      xPaneNumCopy: 0,
      yPaneNumCopy: 0
    }
  },
  props: {
    height:{
      type: Number,
      default: 4000
    },
    xPaneNum: {
      type: Number,
      default: 16
    },
    yPaneNum: {
      type: Number,
      default: 16
    },
    color: {
      type: String,
      default: "#398167"
    },
    opacity: {
      type: Number,
      default: 0.7
    }
  },
  mounted() {
    this.$_initProps();
    this.$emit("loaded",this);
  },
  methods:{
    $_initProps(){
      this.heightCopy = this.height;
      this.xPaneNumCopy = this.xPaneNum;
      this.yPaneNumCopy = this.yPaneNum;
    },
    $_startAnalyse(){
      this.$_initAnalysis("startDrawingPolygon","$_volumeAnalyse");
    },
    $_selectChange(value){
      this.type = value;
      if(value === "cut"){
        this.cutTitle = "开挖高度(米):";
      }else {
        this.cutTitle = "填方高度(米):";
      }
    },
    $_transformEdit(center){
      // 经纬度定位
      let lo = center.geometry.coordinates[1];
      let la = center.geometry.coordinates[0];
      // 修改模型高度
      let height = 50.0;
      // 定位方法
      let hpr = new Cesium.Matrix3();
      // new Cesium.HeadingPitchRoll(heading, pitch, roll)
      // heading围绕负z轴的旋转。pitch是围绕负y轴的旋转。Roll是围绕正x轴的旋转
      let hprObj = new Cesium.HeadingPitchRoll(Cesium.Math.PI, Cesium.Math.PI, Cesium.Math.PI);
      hpr = Cesium.Matrix3.fromHeadingPitchRoll(hprObj, hpr);
      // 2、平移
      // 2.3储存平移的结果
      let modelMatrix = Cesium.Matrix4.multiplyByTranslation(
          // 2.1从以度为单位的经度和纬度值返回Cartesian3位置
          // 2.2计算4x4变换矩阵
          Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(lo, la, height)), new Cesium.Cartesian3(), new Cesium.Matrix4()
      );
      /// 3、应用旋转
      // Cesium.Matrix4.multiplyByMatrix3 （矩阵，旋转，结果）
      Cesium.Matrix4.multiplyByMatrix3(modelMatrix, hpr, modelMatrix);
      return modelMatrix;
    },
    $_deleteEntity(callback){
      const {vueKey,vueIndex} = this;
      let CesiumZondy = getCesiumBaseObject(this,"CesiumZondy");
      let entityManager = CesiumZondy.EntityManager.findSource(vueKey,vueIndex),entity;
      let vm = this;
      if(entityManager && entityManager.hasOwnProperty("source") && entityManager.source){
        entity = CesiumZondy.EntityManager.findSource(vueKey,vueIndex).source;
        CesiumZondy.getWebGlobeByInterval(function (webGlobe) {
          webGlobe.viewer.entities.remove(entity);
          CesiumZondy.EntityManager.deleteSource(vueKey,vueIndex);
        });
      }
      callback && callback(vm,webGlobe);
    },
    $_analyse(advancedAnalysisManager,positions,wallHeight){
      let vm = this,height,volumeTitle;
      if(this.type === "cut"){
        height = this.heightCopy;
      }else {
        height = wallHeight;
      }
      height = Number(height);
      //创建填挖方实例
      let cutFill = advancedAnalysisManager.createCutFill(0.0, {
        //设置x方向采样点个数
        xPaneNum: vm.xPaneNum,
        //设置y方向采样点个数参数
        yPaneNum: vm.yPaneNum,
        //设置填挖规整高度
        height: height,
        //返回结果的回调函数
        callback: function(result) {
          vm.showResult = true;
          vm.volume = vm.type === "cut" ? result.cutVolume : result.fillVolume;
          vm.surfaceArea = result.surfaceArea;
          vm.heightCopy = height;
          vm.volumeTitle = vm.type === "cut" ? "开挖高度(米):" : "填方高度(米):";
          vm.$emit("analysed",result);
        }
      });
      //开始执行填挖方分析
      advancedAnalysisManager.startCutFill(cutFill, positions);
    },
    $_stopAnalyse(){
      this.$_deleteEntity(function (vm) {
        window.drawElement.stopDrawing();
        vm.showResult = false;
        vm.heightCopy = vm.height;
        vm.$emit("analyseStoped");
      });
    },
    $_getCenter(positions){
      let Cesium = getCesiumBaseObject(this,"Cesium");
      let degreePoints = [],wallHeight = 0;
      for (let i = 0;i < positions.length - 1;i++){
        let cartographic = Cesium.Cartographic.fromCartesian(positions[i]);
        if(cartographic.height > wallHeight){
          wallHeight = cartographic.height;
        }
        degreePoints.push(H.point([Cesium.Math.toDegrees(cartographic.latitude),Cesium.Math.toDegrees(cartographic.longitude),cartographic.height]));
      }
      let center = T.center(T.featureCollection(degreePoints));
      center.wallHeight = wallHeight;
      return center;
    },
    $_addEntity(webGlobe,center,positions,wallHeight){
      const {vueKey,vueIndex} = this;
      let Cesium= getCesiumBaseObject(this,"Cesium");
      //添加填挖方分析显示实体
      let transform = this.$_transformEdit(center);
      let viewer = webGlobe.viewer;
      let array = [];
      for (let i = 0; i < positions.length; i++) {
        let point = positions[i];
        let resPoint = new Cesium.Cartesian3;
        let invserTran = new Cesium.Matrix4;
        Cesium.Matrix4.inverse(transform, invserTran);
        Cesium.Matrix4.multiplyByPoint(invserTran, point, resPoint);
        array.push(new Cesium.Cartesian3(resPoint.x, resPoint.y, resPoint.z));
      }
      let newArray = [];
      for (let arraylength = 0; arraylength < array.length; arraylength++) {
        array[arraylength].z = Number(wallHeight);
        let point = array[arraylength];
        let resPoint = new Cesium.Cartesian3;
        let invserTran = new Cesium.Matrix4;
        Cesium.Matrix4.multiplyByPoint(transform, point, resPoint);
        newArray.push(new Cesium.Cartesian3(resPoint.x, resPoint.y, resPoint.z));
      }
      let color = Cesium.Color.fromCssColorString(this.color);
      color = Cesium.Color.fromAlpha(color,this.opacity)
      //在视图中添加围栏实体
      let entity = viewer.entities.add({
        //实体名称
        name: '围栏',
        //示例类型
        wall: {
          //实体点数组
          positions: newArray,
          //实体材质
          material: color,
          //实体轮廓
          outline: true
        }
      });
      CesiumZondy.EntityManager.addSource(vueKey,vueIndex,entity);
    },
    $_volumeAnalyse(webGlobe, positions) {
      let center = this.$_getCenter(positions);
      let wallHeight = center.wallHeight;
      let height = center.wallHeight;
      if(this.heightCopy !== 0){
        height = this.heightCopy;
      }
      //移除视图中所有的实体对象
      this.$_deleteEntity();
      this.$_addEntity(webGlobe,center,positions,height);
      //初始化高级分析功能管理类
      let advancedAnalysisManager = new CesiumZondy.Manager.AdvancedAnalysisManager({
        viewer: webGlobe.viewer
      });
      this.$_analyse(advancedAnalysisManager,positions,height);
    },
    startAnalyse(type,height,xPaneNum,yPaneNum){
      this.type = type || this.type;
      this.height = height || this.height;
      this.xPaneNum = xPaneNum || this.xPaneNum;
      this.yPaneNum = yPaneNum || this.yPaneNum;
      this.$_startAnalyse();
    },
    stopAnalyse(){
      this.$_stopAnalyse();
    }
  }
}
</script>

<style scoped>
.fill-tool-bar{
  position: absolute;
  width: 380px;
  height: 240px;
  top: 10px;
  left: 10px;
}

.fill-result-bar{
  height: 200px;
  width: 345px;
}

.fill-result-bar .fill-input{
  width: 190px;
}

.fill-tool-bar .fill-title{
  margin-top: 0.4em;
  text-align: left;
}

.fill-select,.fill-input{
  width: 215px;
}

.fill-button{
  float: right;
  margin-right: 3px;
}
</style>