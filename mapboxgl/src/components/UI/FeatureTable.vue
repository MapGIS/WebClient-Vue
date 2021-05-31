<template>
  <div>
    <div class="ft_toolbar" style="bottom: 331px">
      <a-checkbox :checked="readOnly" @change="$_readOnly">
        只读
      </a-checkbox>
      <a-checkbox @change="">
        图属联动
      </a-checkbox>
      <a-checkbox @change="">
        仅显示选中
      </a-checkbox>
      <a-button class="editable-add-btn" @click="$_togglePoint">
        点
      </a-button>
      <a-button class="editable-add-btn" @click="$_togglePolyline">
        线
      </a-button>
<!--      <a-button class="editable-add-btn" @click="$_togglePolygon">-->
<!--        矩形-->
<!--      </a-button>-->
      <a-button class="editable-add-btn" @click="$_togglePolygon">
        多边形
      </a-button>
      <a-button class="editable-add-btn" @click="$_showFilter">
        查询条件
      </a-button>
      <a-button class="editable-add-btn" @click="$_query">
        查询
      </a-button>
      <a-button class="editable-add-btn" @click="">
        新增数据
      </a-button>
      <a-button class="editable-add-btn" @click="$_updateTable">
        更新数据
      </a-button>
      <a-button class="editable-add-btn" @click="">
        删除数据
      </a-button>
      <a-modal
          title="输入查询条件"
          :visible="visible"
          @ok="$_showFilter"
          @cancel="$_showFilter"
      >
        <a-row>
          <a-col :span="8">
            <a-list bordered :data-source="FldName" class="ft_attributeList">
              <a-list-item @dblclick="$_addKeyToSQL(item)" @click="$_clickFldNameShowAttributes(item)" class="ft_fldListItem" slot="renderItem" slot-scope="item, index">
                {{ item }}
              </a-list-item>
              <div slot="header">
                字段信息
              </div>
            </a-list>
          </a-col>
          <a-col :span="8">
            <div class="ft_operation">
              <a-tag @click="$_addKeyToSQL(operate)" v-for="(operate,index) in operations" :key="index">{{ operate }}</a-tag>
            </div>
            <div>
              <a-select style="width: 120px" @change="">
                <a-select-option @click="$_addKeyToSQL(func)" v-for="(func,index) in functions" :key="index">
                  {{ func }}
                </a-select-option>
              </a-select>
            </div>
          </a-col>
          <a-col :span="8">
            <a-list bordered :data-source="FldNameToAttributes" class="ft_attributeList">
              <a-list-item @dblclick="$_addKeyToSQL('\'' + item + '\'')" slot="renderItem" slot-scope="item, index" class="ft_fldListItem">
                {{ item }}
              </a-list-item>
              <div slot="header">
                属性信息
              </div>
            </a-list>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="20">
            <a-input id="SQL" placeholder="Basic usage" v-model="SQL"/>
          </a-col>
          <a-col :span="4">
            <a-button @click="$_clearSQL" class="editable-add-btn">
              清空
            </a-button>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="4">
            <a-modal
                title="Title"
                :visible="showSQL"
                @ok="$_showSQL"
                @cancel="$_showSQL"
            >
              <div style="width: 400px;height: 200px;">
                <a-table style="width: 400px;height: 200px;left: 20px;bottom: 53px;" :columns="SQLModelColumns" :data-source="SQLModelData">
                  <template slot="SQLText" slot-scope="text,record">
                    <p @dblclick="$_chooseSQL(record.SQL)" style="cursor: pointer">{{text}}</p>
                  </template>
                </a-table>
              </div>
            </a-modal>
            <a-button class="editable-add-btn" @click="$_getSQL">
              SQL模板
            </a-button>
          </a-col>
          <a-col :span="4">
            <a-modal
                title="模板名称"
                :visible="saveSQL"
                @ok="$_saveSQL"
                @cancel="$_showSaveSQL"
            >
              <a-input placeholder="请输入模板名称" v-model="SQLName"/>
            </a-modal>
            <a-button class="editable-add-btn" @click="$_showSaveSQL">
              保存SQL模板
            </a-button>
          </a-col>
        </a-row>
      </a-modal>
    </div>
    <div class="ft_toolbar">
      <a-tabs v-model="activeKey" type="editable-card" @edit="$_closeTab" @change="$_changeTab(activeKey)">
        <a-tab-pane v-for="(pane,index) in panes" :key="pane.key" :tab="pane.title" :closable="pane.closable">
          {{ pane.content }}
        </a-tab-pane>
      </a-tabs>
    </div>
    <base-draw
        v-bind:controls="controls"
        v-on:added="$_handleAdded"
        v-on:drawcreate="$_handleCreate"
        ref="draw"
    ></base-draw>
    <a-table style="width: 100%" ref="atable" bordered :data-source="featureData" :columns="columns" :scroll="{ x: 400}">
      <template slot="text" slot-scope="text,record">
        <div @click="$_onceClick(record.key,$_returnKey(text,record))" @dblclick="$_doubleClick(record.key,$_returnKey(text,record))">
          <p class="ft_content" v-if="isEdit !== $_returnKey(text,record) + '_' + record.key">{{text}}</p>
          <a-input v-if="isEdit === $_returnKey(text,record) + '_' + record.key" v-model="record[$_returnKey(text,record)]"/>
        </div>
      </template>
    </a-table>
  </div>
</template>

<script>
/* import Vue from "vue"
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
Vue.use(Antd); */

import featureService from "../map/mixins/FeatureService.js"
import BaseDraw from "./controls/draw/BaseDraw"
import {Feature, GeometryParameter, SQLParameter} from "../util";
import {extend} from "@mapgis/webclient-es6-service/common";

export default {
  name: "FeatureTable",
  mixins:[featureService],
  inject:["map"],
  components: {BaseDraw},
  props:{
    MapUrl: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      isEdit:"",
      featureData:[],
      columns: [],
      columnsArr: [],
      controls: {
        point: false,
        line_string: false,
        polygon: false,
        trash: false,
        combine_features: false,
        uncombine_features: false
      },
      visible: false,
      saveSQL: false,
      showSQL: false,
      FldName:[],
      FldNameToAttributes:[],
      features:[],
      featuresArr:[],
      operations:["+","-","*","/","()","%","=","!=",">","<",">=","<=","LIKE","AND","OR","NOT","IS","NULL"],
      functions:["--数学函数--","Abs()","Max()","Min()","--字符串函数--","Lower()","Upper()","Substr()"],
      readOnly:true,
      point: "",
      polyline: "",
      polygon: "",
      queryGeometryType: "",
      SQL:"",
      SQLName:"",
      SQLPosition:0,
      SQLModelData: [],
      SQLModelColumns: [{
        title: 'SQL描述',
        dataIndex: 'SQLName',
        key: 'SQLName',
        scopedSlots: { customRender: 'SQLText' }
      },{
        title: 'SQL语句',
        dataIndex: 'SQL',
        key: 'SQL',
        scopedSlots: { customRender: 'SQLText' }
      }],
      panes:[],
      activeKey: "",
      layer:[],
      layerArr:[]
    };
  },
  mounted() {
    this.$emit("loaded",this);
  },
  methods:{
    $_closeTab(targetKey, action){
      this["$_" + action](targetKey);
    },
    $_remove(targetKey){
      delete this.panes.splice(targetKey,1);
      delete this.featuresArr.splice(targetKey,1);
      delete this.columnsArr.splice(targetKey,1);
      if(targetKey > 0){
        this.features = this.featuresArr[targetKey - 1];
        this.columns = this.columnsArr[targetKey - 1];
        this.$_initFeatureTableData();
        this.activeKey = targetKey - 1;
      }
    },
    $_changeTab(activeKey){
      this.features = this.featuresArr[activeKey];
      this.columns = this.columnsArr[activeKey];
      this.layer = this.layerArr[activeKey];
      this.$_initFeatureTableData();
    },
    $_readOnly(){
      this.readOnly = !this.readOnly;
    },
    $_showSQL(){
      this.showSQL = !this.showSQL;
    },
    $_chooseSQL(SQL){
      this.SQL = SQL;
      this.$_showSQL();
    },
    $_getSQL(){
      let store = window.localStorage,vm = this;
      let sqls = store.getItem("sqls");
      if(sqls){
        sqls = JSON.parse(sqls);
      }else {
        sqls = {};
      }
      this.SQLModelData = [];
      Object.keys(sqls).forEach(function (key) {
        vm.SQLModelData.push({
          key: vm.SQLModelData.length,
          SQLName: key,
          SQL: sqls[key]
        })
      });
      this.$_showSQL();
    },
    $_showSaveSQL() {
      this.saveSQL = !this.saveSQL;
    },
    $_saveSQL(){
      let storage = window.localStorage,sqls;
      sqls = storage.getItem("sqls");
      if(sqls){
        sqls = JSON.parse(sqls);
      }else {
        sqls = {};
      }
      sqls[this.SQLName] = this.SQL;
      storage.setItem("sqls",JSON.stringify(sqls));
      this.$_showSaveSQL();
    },
    $_showFilter() {
      this.visible = !this.visible;
    },
    $_onceClick(index,key){
      if(this.isEdit !== key + "_" + index){
        this.isEdit = "";
      }
    },
    $_returnKey(value,record){
      let key;
      Object.keys(record).forEach(function (k) {
        if(record[k] === value){
          key = k;
        }
      });
      return key;
    },
    $_doubleClick(index,key){
      if(!this.readOnly){
        this.isEdit = key + "_" + index;
      }
    },
    $_handleAdded(e, data){
      let { drawer, map } = e;
      this.drawer = drawer;
    },
    $_handleCreate(e){
      let vm = this;
      this.queryParameters = "";
      this.queryGeometryType = e.features[0].geometry.type;
      switch (e.features[0].geometry.type){
        case "Point":
          vm.point = e.features[0];
          break;
        case "LineString":
          vm.polyline = e.features[0];
          break;
        case "Polygon":
          vm.polygon = e.features[0];
          break;
      }
    },
    $_togglePoint(e){
      this.type = "point";
      this.$_enableDrawer();
      this.drawer && this.drawer.changeMode('draw_point');
    },
    $_enableDrawer() {
      const component = this.$refs.draw;
      if (component) {
        component.enableDrawer();
      }
      this.$_clearLayer("highlayer");
    },
    $_togglePolyline(){
      this.type = "polyline";
      this.$_enableDrawer();
      this.drawer && this.drawer.changeMode('draw_line_string');
    },
    $_togglePolygon(){
      this.type = "polygon";
      this.$_enableDrawer();
      this.drawer && this.drawer.changeMode('draw_polygon');
    },
    $_updateTable(){
      let featureSet = [];
      for(let i = 0;i < this.features.length;i++){
        for(let j = 0;j < this.featureData.length;j++){
          if(this.features[i].FID === this.featureData[j].key){
            extend(this.features[i].attributes,this.featureData[j]);
            featureSet.push(this.features[i]);
          }
        }
      }
      this.$_update(featureSet,this.layer.join(","),function (result) {
        console.log("更新完成:",result)
      })
    },
    $_query(){
      let vm = this,geom;
      geom = new GeometryParameter({
        layers: vm.layer,
        where: vm.SQL
      });
      switch (this.queryGeometryType){
        case "Point":
          geom.fromGeoJSON(vm.point);
          break
        case "LineString":
          geom.fromGeoJSON(vm.polyline);
          break
        case "Polygon":
          geom.fromGeoJSON(vm.polygon);
          break;
      }
      this.$_queryByGeometry(geom,function (result) {
        vm.$_addFeatureToLayer(result);
        vm.features = Feature.fromQueryResult(result)
        vm.featuresArr[vm.activeKey] = vm.features;
        vm.$_initFeatureTableData();
      });
    },
    $_queryByLayer(layer){
      let sql = new SQLParameter({
        layers:layer
      }),vm = this;
      this.$_getFieldAtt(layer.join(","),function (result) {
        if(result && result.hasOwnProperty("FieldAtt") && result.FieldAtt.hasOwnProperty("FldName")){
          vm.FldName = result.FieldAtt.FldName;
          let Name = result.Name;
          vm.$_queryBySQL(sql,function (result) {
            // vm.addLayer(result);
            if(!result){
              throw new Error("返回结果为空");
            }else if(!result.hasOwnProperty("AttStruct")){
              throw new Error("返回结果不包含AttStruct（字段名）");
            }
            let FldName = result.AttStruct.FldName;
            vm.columns = [];
            for (let i = 0;i < FldName.length;i++){
              vm.columns.push({
                title: FldName[i],
                width: 100,
                dataIndex: FldName[i],
                key: FldName[i],
                scopedSlots: { customRender: 'text' },
                align: 'center',
                ellipsis: true,
                sorter: (a, b) => a[FldName[i]] > b[FldName[i]]
              });
            }
            vm.features = Feature.fromQueryResult(result)
            vm.featuresArr.push(vm.features);
            vm.columnsArr.push(vm.columns);
            let key = String(vm.panes.length);
            vm.panes.push({ title: Name, key: key })
            vm.activeKey = key;
            vm.layer = layer;
            vm.layerArr.push(layer);
            vm.$_initFeatureTableData();
          });
        }else {
          throw new Error("未找到FldName信息，请检查数据库配置是否正确");
        }
      });
    },
    $_initFeatureTableData(){
      this.featureData = [];
      for (let i = 0;i < this.features.length;i++){
        this.featureData.push(Object.assign(this.features[i].attributes,{key:this.features[i].FID}));
      }
    },
    $_addFeatureToLayer(result){
      if(result.SFEleArray[0].ftype === 1){
        this.$_addPointToLayer(result);
      }else if(result.SFEleArray[0].ftype === 2){
        this.$_addPolylineToLayer(result);
      }else if(result.SFEleArray[0].ftype === 3){
        this.$_addPolygonToLayer(result);
      }
    },
    $_addPointToLayer(result){
      this.$_clearLayer("highlayer");
      let SFEleArray = result.SFEleArray;
      let features = [];
      for(let i = 0;i < SFEleArray.length;i++){
        let PntGeom = result.SFEleArray[i].fGeom.PntGeom;
        for(let j = 0;j < PntGeom.length;j++){
          let Dots = PntGeom[j].Dot;
          let feature = {
            "type": "Feature",
            "geometry": {
              "type": "Point",
              "coordinates": [Dots.x,Dots.y]
            }
          };
          features.push(feature);
        }
      }

      //用geojson创建一个多边形
      let geometryPolygon = {
        "type": "FeatureCollection",
        "features": features
      };
      let source = {
        "type": "geojson",
        "data": geometryPolygon
      };
      this.map.addLayer({
        //此id可随意设置，但是要唯一
        "id": "highlayer",
        //指定类型为fill（填充区域）
        "type": "circle",
        //设置数据来源
        "source": source,
        //设置绘制参数
        "paint": {
          //设置填充颜色
          "circle-color": "#000000",
          "circle-radius": 5
        }
      });
    },
    $_addPolylineToLayer(result){
      this.$_clearLayer("highlayer");
      let SFEleArray = result.SFEleArray;
      let features = [];
      for (let i = 0;i < SFEleArray.length;i++){
        //确保满足多线的情况
        let LinGeom = SFEleArray[i].fGeom.LinGeom;
        for (let j = 0;j < LinGeom.length;j++){
          let Dots = LinGeom[j].Line.Arcs[0].Dots;
          let finaldots = [];
          for (let k = 0; k < Dots.length; k++) {
            //组织面的坐标数组
            finaldots.push([Dots[k].x, Dots[k].y]);
          }
          let feature = {
            "type": "Feature",
            "geometry": {
              "type": "LineString",
              "coordinates": finaldots
            }
          }
          features.push(feature);
        }
      }

      //用geojson创建一个多边形
      let geometryPolygon = {
        "type": "FeatureCollection",
        "features": features
      };
      let source = {
        "type": "geojson",
        "data": geometryPolygon
      };
      this.map.addLayer({
        //此id可随意设置，但是要唯一
        "id": "highlayer",
        //指定类型为fill（填充区域）
        "type": "line",
        //设置数据来源
        "source": source,
        //设置绘制参数
        "paint": {
          //设置填充颜色
          "line-color": "#000000",
          "line-gap-width": 5
        }
      });
    },
    $_addPolygonToLayer(result ){
      this.$_clearLayer("highlayer");
      //获取查询到的结果数组,ploygonArr的个数即为查询到的结果数
      let ploygonArr = result.SFEleArray,vm = this;
      let features = [];
      for (let i = 0; i < ploygonArr.length; i++) {
        //确保可以满足一个要素含有多个区域
        let RegGeom = ploygonArr[i].fGeom.RegGeom;
        for (let m = 0;m < RegGeom.length;m++){
          //获取要素几何数组
          let Rings = RegGeom[m].Rings;
          //针对复合要素，要循环获取每一个几何
          for (let j = 0; j < Rings.length; j++) {
            //取出构成多边形的数组
            let dots = Rings[j].Arcs[0].Dots;
            let finaldots = [];
            for (let k = 0; k < dots.length; k++) {
              //组织面的坐标数组
              finaldots.push([dots[k].x, dots[k].y]);
            }
            let feature = {
              "type": "Feature",
              "geometry": {
                "type": "Polygon",
                "coordinates": [finaldots]
              }
            }
            features.push(feature);
          }
        }
      }
      //用geojson创建一个多边形
      let geometryPolygon = {
        "type": "FeatureCollection",
        "features": features
      };
      let source = {
        "type": "geojson",
        "data": geometryPolygon
      };
      vm.map.addLayer({
        //此id可随意设置，但是要唯一
        "id": "highlayer",
        //指定类型为fill（填充区域）
        "type": "fill",
        //设置数据来源
        "source": source,
        //设置绘制参数
        "paint": {
          //设置填充颜色
          "fill-color": "rgba(127,255,0, 0.5)",
          "fill-outline-color": '#FFA500'
        }
      });
    },
    $_clearLayer(layerId){
      if(this.map.getLayer(layerId)){
        this.map.removeLayer(layerId);
        this.map.removeSource(layerId);
      }
    },
    $_clickFldNameShowAttributes(key){
      let vm = this;
      vm.FldNameToAttributes = [];
      for(let i = 0;i < vm.features.length;i++){
        Object.keys(vm.features[i].attributes).forEach(function (k) {
          if(key === k){
            vm.FldNameToAttributes.push(vm.features[i].attributes[k]);
          }
        });
      }
    },
    $_addKeyToSQL(key){
      let length = this.SQL.length,SQLObj = document.getElementById("SQL");
      if(this.SQLPosition === 0){
        this.SQL += length === 0 ? key : " " + key;
      }else {
        this.SQL = this.SQL.substr(0,this.SQLPosition) + " " + key + " " + this.SQL.substr(this.SQLPosition,length);
        this.SQLPosition = this.SQLPosition + 1 + key.length - 1;
      }
      if((this.functions.indexOf(key) > -1 || key === "()") && this.SQLPosition === 0){
        this.SQLPosition = this.SQL.length - 1;
      }
    },
    $_clearSQL(){
      this.SQL = "";
      this.SQLPosition = 0;
    }
  }
}
</script>

<style>
.ant-table-wrapper{
  position: absolute;
  bottom: 0;
  top:auto;
  left: 0;
  background: white;
  z-index: 999;
}
.ft_toolbar{
  width: 100%;
  height: 40px;
  position: absolute;
  bottom: 291px;
  z-index: 1;
  background: white;
}

.ft_content{
  margin-bottom:0;
}

.ft_attributeList{
  overflow-y: scroll;
  height: 400px;
}

.ft_operation .ant-tag{
  margin: 0 3px;
}

.ft_fldListItem{
  cursor: pointer;
}

.ant-table-thead > tr > th, .ant-table-tbody > tr > td{
  padding: 2px;
}

.ant-table{
  line-height: 1;
}
.ant-table-body{
  height: 227px;
}

</style>