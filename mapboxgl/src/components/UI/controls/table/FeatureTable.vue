<template>
  <div class="mapgis-fTable"> 
    <div class="mapgis-fTable-toolbar" :style="{bottom:toolBarBottom + 'px'}">
      <mapgis-ui-checkbox class="mapgis-fTable-toolcheckbox" :checked="!readOnly" @change="$_readOnly">
        只读
      </mapgis-ui-checkbox>
      <mapgis-ui-checkbox class="mapgis-fTable-toolcheckbox" style="left:70px;" @change="$_flyTo">
        图属联动
      </mapgis-ui-checkbox>
      <mapgis-ui-button class="editable-add-btn" v-if="geometry === true" @click="$_togglePoint">
        点
      </mapgis-ui-button>
      <mapgis-ui-button style="left:216px;" class="editable-add-btn" v-if="geometry === true" @click="$_togglePolyline">
        线
      </mapgis-ui-button>
      <mapgis-ui-button style="left:269px;" class="editable-add-btn" v-if="geometry === true" @click="$_togglePolygon">
        多边形
      </mapgis-ui-button>
      <mapgis-ui-button style="left:350px;" class="editable-add-btn" @click="$_showFilter">
        查询条件
      </mapgis-ui-button>
      <mapgis-ui-button style="left:445px;" class="editable-add-btn" @click="$_updateTable">
        更新要素
      </mapgis-ui-button>
      <mapgis-ui-button style="left:540px;" class="editable-add-btn" @click="$_addFeatureButton">
        新增要素
      </mapgis-ui-button>
      <mapgis-ui-button style="left:635px;" class="editable-add-btn" @click="$_reset">
        还原
      </mapgis-ui-button>
      <input style="display: none" type="file" id="uploadFile" @change="$_loadGeoJSON">
      <mapgis-ui-modal
          title="输入查询条件"
          :visible="showFilter"
          @ok="$_showFilter"
          @cancel="$_showFilter"
      >
        <template slot="footer">
          <mapgis-ui-button key="back" @click="$_showFilter">
            取消
          </mapgis-ui-button>
          <mapgis-ui-button key="submit" type="primary" @click="$_queryConfirm">
            查询
          </mapgis-ui-button>
        </template>
        <mapgis-ui-row>
          <mapgis-ui-col :span="8">
            <mapgis-ui-list bordered :datmapgis-ui-source="FldName" class="mapgis-fTable-attributeList">
              <mapgis-ui-list-item :title="item" @dblclick="$_addKeyToSQL(item)" @click="$_clickFldNameShowAttributes(item)"
                           class="mapgis-fTable-fldListItem" slot="renderItem" slot-scope="item, index">
                {{ item }}
              </mapgis-ui-list-item>
              <div slot="header">
                字段信息
              </div>
            </mapgis-ui-list>
          </mapgis-ui-col>
          <mapgis-ui-col :span="8">
            <div>
              <p class="mapgis-fTable-title">-------- 运算符 --------</p>
            </div>
            <div class="mapgis-fTable-operation">
              <mapgis-ui-tag @click="$_addKeyToSQL(operate)" v-for="(operate,index) in operations" :key="index">{{
                  operate
                }}
              </mapgis-ui-tag>
            </div>
            <div>
              <p class="mapgis-fTable-title">--------- 函 数 ---------</p>
            </div>
            <div>
              <mapgis-ui-select class="mapgis-fTable-Function">
                <mapgis-ui-select-option @click="$_addKeyToSQL(func)" v-for="(func,index) in functions" :key="index">
                  {{ func }}
                </mapgis-ui-select-option>
              </mapgis-ui-select>
            </div>
          </mapgis-ui-col>
          <mapgis-ui-col :span="8">
            <mapgis-ui-list bordered :datmapgis-ui-source="FldNameToAttributes" class="mapgis-fTable-attributeList">
              <mapgis-ui-list-item :title="item" @dblclick="$_addKeyToSQL('\'' + item + '\'')" slot="renderItem" slot-scope="item, index"
                           class="mapgis-fTable-fldListItem">
                {{ item }}
              </mapgis-ui-list-item>
              <div slot="header">
                属性信息
              </div>
            </mapgis-ui-list>
          </mapgis-ui-col>
        </mapgis-ui-row>
        <mapgis-ui-row style="margin: 6px 0;">
          <mapgis-ui-col :span="20">
            <mapgis-ui-input id="SQL" class="mapgis-fTable-where" placeholder="请输入where语句" v-model="SQL"/>
          </mapgis-ui-col>
          <mapgis-ui-col :span="4" style="padding-left: 17px;">
            <mapgis-ui-button @click="$_clearSQL" class="editable-add-btn">
              清空
            </mapgis-ui-button>
          </mapgis-ui-col>
        </mapgis-ui-row>
        <mapgis-ui-row>
          <mapgis-ui-col :span="4">
            <mapgis-ui-modal
                title="SQL模板"
                :visible="showSQLMould"
                @ok="$_showSQLMould"
                @cancel="$_showSQLMould"
            >
              <div style="width: 100%;height: 300px;">
                <mapgis-base-table class="mapgis-fTable-SQLTable"
                            :dataSource="SQLModelData"
                            :columns="SQLModelColumns"
                            :showDelete="true"
                            :edit="false"
                            :select="false"
                            :height="235"
                            :toolbar="false"
                            @doubleClick="$_chooseSQL"
                            @delete="$_deleteSQL">
                </mapgis-base-table>
              </div>
            </mapgis-ui-modal>
            <mapgis-ui-button class="editable-add-btn" @click="$_getSQL(true)">
              SQL模板
            </mapgis-ui-button>
          </mapgis-ui-col>
          <mapgis-ui-col :span="4">
            <mapgis-ui-modal
                title="模板名称"
                :visible="showSaveSQL"
                @ok="$_saveSQL"
                @cancel="$_showSaveSQL"
            >
              <mapgis-ui-input class="mapgis-fTable-where" style="width: 100%;" placeholder="请输入模板名称" v-model="SQLName"/>
            </mapgis-ui-modal>
            <mapgis-ui-button class="editable-add-btn" style="margin-left: 10px;" @click="$_showSaveSQL">
              保存SQL模板
            </mapgis-ui-button>
          </mapgis-ui-col>
        </mapgis-ui-row>
      </mapgis-ui-modal>
      <mapgis-ui-modal
          title="新增数据"
          :visible="showAddFeature"
          @ok="$_addFeature"
          @cancel="$_showAddFeature"
      >
        <div class="mapgis-fTable-addFeatureTable">
          <mapgis-base-table class="mapgis-fTable-addFeature"
                      :dataSource="addFeaturesData"
                      :columns="addFeatureColumns"
                      :edit="false"
                      :select="false"
                      :toolbar="false"
                      :height="320"
                      @handleCreated="$_addHandleCreated">
          </mapgis-base-table>
        </div>
      </mapgis-ui-modal>
    </div>
    <base-draw
        v-bind:controls="controls"
        v-on:added="$_handleAdded"
        v-on:drawcreate="$_handleCreate"
        ref="draw"
    ></base-draw>
    <mapgis-base-table :dataSource="featureData"
                :columns="columns"
                :edit="readOnly"
                :pagination="pagination"
                :height="height"
                @delete="$_deleteFeature"
                @click="$_onceClick"
                @handleCreated="$_handleCreated"
                @changed="$_changed"
                @selected="$_selected"
                @selectAll="$_selectedAll"
    >
    </mapgis-base-table>
  </div>
</template>

<script>
import featureService from "../../../map/mixins/FeatureService"
import BaseDraw from "../draw/BaseDraw"
import BaseTable from "./MapBoxBaseTable.vue";

import * as T from '@turf/turf'
import * as H from '@turf/helpers'

export default {
  name: "mapgis-feature-table",
  mixins: [featureService],
  inject: ["map"],
  components: {BaseTable, BaseDraw},
  props: {
    url: {
      type: String,
      default: ""
    },
    layer:{
      type: String,
      default: ""
    },
    geometry: {
      type: Boolean,
      default: false
    },
    styles:{
      type: Object
    },
    editable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      //判断哪一个table单元格要启用编辑
      // isEdit: "",
      //是否启用编辑
      readOnly: this.$props.editable,
      //是否启用图属联动
      flyTo: false,
      //当前要显示到table组件的数据（td）
      featureData: [],
      //当前的要素源数据
      features: [],
      //当前需要显示到table组件的表头（th）数据
      columns: [],
      //BaseDraw组件必要参数
      controls: {
        point: false,
        line_string: false,
        polygon: false,
        trash: false,
        combine_features: false,
        uncombine_features: false
      },
      //存放BaseDraw组件返回的点集合
      point: "",
      //存放BaseDraw组件返回的线集合
      polyline: "",
      //存放BaseDraw组件返回的多边形集合
      polygon: "",
      //存放BaseDraw组件返回的几何对象的类型，供查询方法使用
      queryGeometryType: "",
      //是否显示查询条件面板
      showFilter: false,
      //是否显示模板名称面板
      showSaveSQL: false,
      //是否显示SQL模板面板
      showSQLMould: false,
      //是否显示添加要素面板
      showAddFeature: false,
      //从数据库取得的字段名
      FldName: [],
      //从this.features取得数据，表示一个字段所对应的所有属性组成的数组集合
      FldNameToAttributes: [],
      //where语句中运算符组成的数组，在查询条件面板中使用
      operations: ["+", "-", "*", "/", "()", "%", "=", "!=", ">", "<", ">=", "<=", "LIKE", "AND", "OR", "NOT", "IS", "NULL"],
      //where语句中函数字组成的数组，在查询条件面板中使用
      functions: ["--数学函数--", "Abs()", "Max()", "Min()", "--字符串函数--", "Lower()", "Upper()", "Substr()"],
      //存放组装好的SQL语句
      SQL: "",
      //SQL模板的名称
      SQLName: "",
      //组装SQL语句时，光标的位置，在查询条件面板使用
      SQLPosition: 0,
      //取得所有的SQL语句模板
      SQLModelData: [],
      //SQL模板页面的表头（th）设置
      SQLModelColumns: [],
      //确定哪一个标签页是激活状态，只与panes[i].key有关，跟下标无关
      activeKey: "",
      //存放多个layer
      layerArr: [],
      //新增要素的input对象
      uploadFile: "",
      //地图文档的所有图层信息
      docInfo:"",
      //存储当前地图的所有gdbp数据库字段信息
      gdbpFieldArr:[],
      //新增要素table表头信息
      addFeatureColumns:[],
      //新增要素的table所需要的数据
      addFeaturesData: [],
      //新增要素的table所需要的源数据
      addFeatures: [],
      //toolBar样式信息，距离底部的距离
      toolBarBottom: 435,
      //是否显示Tab标签，当没有任何图层信息时，隐藏标签栏
      showTab: true,
      currentPage: 1,
      pagination:{
        total:0,
        defaultPageSize:10
      },
      queryParam:{},
      addFeatureStyle: {
        bottom: "20px;"
      },
      height: 285
    };
  },
  mounted() {
    this.uploadFile = document.getElementById("uploadFile");
    this.$_queryByLayer(this.layer);
  },
  methods: {
    $_reset(){
      this.$_queryByLayer(this.layer);
    },
    $_selected(record, selectedRows, selected){
      this.$_selectFeature(selectedRows,"tableLayer",selected);
    },
    $_selectedAll(selected, selectedRows){
      this.$_selectFeature(selectedRows,"tableLayer",selected);
    },
    $_selectFeature(selectedRows,layerId,selected){
      if(selected){
        this.$_addFeatureToLayer(selectedRows);
        let geometryType = selectedRows[0].geometryType,finalCenter;
        switch (geometryType){
          case "Point":
            let pointsArr = this.$_getPointsCoordinates(selectedRows);
            finalCenter = this.$_getPointsCenter(pointsArr);
            break;
          case "LineString":
            let lineArr = [];
            lineArr = this.$_getPolylinesCoordinates(selectedRows);
            finalCenter = this.$_getPolylinesCenter(lineArr);
            break;
          case "Polygon":
            let polygonsArr = this.$_getPolygonsCoordinates(selectedRows);
            finalCenter = this.$_getPolygonsCenter(polygonsArr);
            break;
        }
        this.map.flyTo({
          center: finalCenter.geometry.coordinates
        });
      }else {
        this.$_clearLayer(layerId);
      }
    },
    $_changed(pagination, filters, sorter ){
      //排序或分页回调，都走的是同一个业务逻辑
      //默认降序
      let isAsc = false;
      if(sorter.hasOwnProperty("order")){
        if(sorter.order === "ascend"){
          isAsc = true;
        }
        this.queryParam.orderBy = sorter.columnKey;
        this.queryParam.isAsc = isAsc;
      }else {
        this.queryParam.orderBy = "";
        this.queryParam.isAsc = false;
      }
      this.queryParam.pageIndex = pagination.current - 1;
      this.queryParam.pagination = this.pagination.pageSize;
      this.$_query(this.queryParam,false);
    },
    $_handleCreated(table){
      this.table = table;
    },
    $_addHandleCreated(table){
      this.addTable = table;
    },
    //是否可以编辑table
    $_readOnly() {
      this.readOnly = !this.readOnly;
    },
    //是否开启图属联动功能
    $_flyTo() {
      this.flyTo = !this.flyTo;
    },
    //新增要素按钮点击事件
    $_addFeatureButton(){
      //调用隐藏的iput点击事件
      this.uploadFile.click();
    },
    //加载JSON文件
    $_loadGeoJSON() {
      //初始化FileReader
      let reader = new FileReader(), vm = this;
      //读取文件
      reader.readAsText(this.uploadFile.files[0]);
      //处理内容
      reader.onload = function (evt) {
        let result = JSON.parse(evt.target.result);
        vm.addFeatures = vm.$_fromGeoJSON(result);
        //根据当前激活的图层，设置选中的下拉框
        vm.$_initAddLayerColumns()
        //初始化表格数据
        vm.$_initFeatureTableData("addFeaturesData", "addFeatures");
        //显示要素Table表格
        vm.$_showAddFeature();
      }
    },
    //是否显示添加要素面板
    $_showAddFeature() {
      this.uploadFile.value = "";
      this.showAddFeature = !this.showAddFeature;
    },
    //添加要素
    $_addFeature() {
      let vm = this;
      this.$_add(this.addTable.$_getAllAttrData(), String(this.layer), function (result) {
        vm.$emit("addSuccess",result);
        vm.$message.success('新增要素成功');
        vm.$_showAddFeature();
      }, function (result) {
        vm.$message.error('新增要素失败');
        vm.$emit("addFailure",result);
      })
    },
    //切换要添加要素的图层
    $_initAddLayerColumns() {
      this.addFeatureColumns = [];
      let afc = []
      for (let j = 0;j < this.FldName.length;j++){
        let FldName = this.FldName[j];
        afc.push({
          title: FldName,
          width: 100,
          dataIndex: FldName,
          key: FldName,
          align: "left"
        })
      }
      this.addFeatureColumns = afc;
      //初始化表格数据
      this.$_initFeatureTableData("addFeaturesData", "addFeatures");
    },
    //删除要素
    $_deleteFeature(OID,record) {
      let vm = this;
      this.$_delete([OID], this.layer, function (result) {
        if (result.succeed) {
          vm.$_query(vm.queryParam);
        }
        vm.$emit("deleteSuccess",OID,record);
      },function (result) {
        vm.$emit("deleteFailure",result);
      })
    },
    //关闭tab页，调用$_remove方法
    $_closeTab(targetKey, action) {
      this["$_" + action](targetKey);
    },
    //是否显示SQL模板面板
    $_showSQLMould() {
      this.showSQLMould = !this.showSQLMould;
    },
    //在SQL模板面板中，选择一条SQL语句
    $_chooseSQL(index,key,value,record) {
      this.SQL = record.SQL;
      this.$_showSQLMould();
    },
    //在SQL模板面板中，删除一条SQL语句
    $_deleteSQL(key,record){
      let store = window.localStorage;
      let SQLObj = JSON.parse(store.getItem("sqls"));
      delete SQLObj[record.SQLName];
      store.setItem("sqls",JSON.stringify(SQLObj));
      this.$_getSQL();
    },
    //在SQL模板面板中，加载所有SQL语句
    $_getSQL(isShow) {
      let store = window.localStorage, vm = this;
      let sqls = store.getItem("sqls");
      if (sqls) {
        sqls = JSON.parse(sqls);
      } else {
        sqls = {};
      }
      this.SQLModelData = [];
      Object.keys(sqls).forEach(function (key) {
        vm.SQLModelData.push({
          key: vm.SQLModelData.length + 1,
          SQLName: key,
          SQL: sqls[key]
        })
      });
      this.SQLModelColumns = [{
        title: 'SQL描述',
        dataIndex: 'SQLName',
        key: 'SQLName',
        width: 100
      },{
        title: 'SQL语句',
        dataIndex: 'SQL',
        key: 'SQL',
        width: 240
      }];
      if(isShow){
        this.$_showSQLMould();
      }
    },
    //是否显示保存SQL面板
    $_showSaveSQL() {
      this.showSaveSQL = !this.showSaveSQL;
    },
    //保存SQL
    $_saveSQL() {
      let storage = window.localStorage, sqls;
      sqls = storage.getItem("sqls");
      if (sqls) {
        sqls = JSON.parse(sqls);
      } else {
        sqls = {};
      }
      sqls[this.SQLName] = this.SQL;
      storage.setItem("sqls", JSON.stringify(sqls));
      this.$_showSaveSQL();
    },
    //是否显示查询条件面板
    $_showFilter() {
      this.showFilter = !this.showFilter;
      this.$nextTick(function () {
        let SQLObj = document.getElementById("SQL");
        SQLObj.focus();
      })
    },
    //要素table的单次点击事件
    $_onceClick(index) {
      //如果图属联动功能开启，则单次点击飞到指定地点
      if (this.flyTo) {
        let feature = this.features[index], coordinates, points, center;
        switch (feature.geometryType) {
          case "Point":
            this.$_addFeatureToLayer([feature]);
            this.map.flyTo({
              center: feature.geometry[0].coordinates
            });
            break;
          case "LineString":
            this.$_addFeatureToLayer([feature]);
            coordinates = [];
            for (let i = 0; i < feature.geometry[0].coordinates.length; i++) {
              coordinates.push(H.point([feature.geometry[0].coordinates[i].x, feature.geometry[0].coordinates[i].y]));
            }
            points = T.featureCollection(coordinates);
            center = T.center(points);
            this.map.flyTo({
              center: center.geometry.coordinates
            });
            break;
          case "Polygon":
            this.$_addFeatureToLayer([feature]);
            coordinates = [];
            for (let i = 0; i < feature.geometry[0].exterior.length; i++) {
              coordinates.push(H.point([feature.geometry[0].exterior[i].x, feature.geometry[0].exterior[i].y]));
            }
            points = T.featureCollection(coordinates);
            center = T.center(points);
            this.map.flyTo({
              center: center.geometry.coordinates
            });
            break;
        }
      }
    },
    //BaseDraw初始化完成事件，取得draw画图对象
    $_handleAdded(e, data) {
      let {drawer, map} = e;
      this.drawer = drawer;
    },
    //BaseDraw绘画完成事件，取得几何对象
    $_handleCreate(e) {
      let vm = this;
      this.queryParameters = "";
      this.queryGeometryType = e.features[0].geometry.type;
      switch (e.features[0].geometry.type) {
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
      vm.$_query(undefined,true);
    },
    //画点方法
    $_togglePoint(e) {
      this.type = "point";
      this.$_enableDrawer();
      this.drawer && this.drawer.changeMode('draw_point');
    },
    //画线方法
    $_togglePolyline() {
      this.type = "polyline";
      this.$_enableDrawer();
      this.drawer && this.drawer.changeMode('draw_line_string');
    },
    //画多边形方法
    $_togglePolygon() {
      this.type = "polygon";
      this.$_enableDrawer();
      this.drawer && this.drawer.changeMode('draw_polygon');
    },
    //开始绘画
    $_enableDrawer() {
      let component = this.$refs.draw;
      if (component) {
        component.enableDrawer();
      }
      this.$_clearLayer("tableLayer");
    },
    //更新要素
    $_updateTable() {
      let vm = this;
      //更新要素
      this.$_update(this.table.$_getAllAttrData(), this.layer, function (result) {
        vm.$message.success('更新要素成功');
        vm.$emit("updateSuccess",vm.table.$_getAllAttrData());
      },function (result) {
        vm.$message.error('更新要素失败');
        vm.$emit("updateFailure",result);
      })
    },
    $_queryConfirm(){
      this.$_query(undefined,true);
      this.$_showFilter();
    },
    //查询要素
    $_query(queryParam,addToLayer) {
      let vm = this, geom;
      //拼装查询参数
      geom = this.$_getGeometryParameter({
        layers: vm.layer,
        where: vm.SQL
      });
      if(queryParam){
        geom = Object.assign(geom,queryParam);
      }
      //取得几何查询对象
      switch (this.queryGeometryType) {
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
      //开始查询
      this.$_queryByGeometry(geom, function (result) {
        let fSet = vm.features = vm.$_fromQueryResult(result);
        console.log("result",result)
        if (vm.features.length > 0) {
          if(addToLayer){
            vm.$_addFeatureToLayer(vm.features);
          }
          vm.$_initFeatureTableData("featureData", "features");
        } else {
          vm.features = [];
          vm.featureData = [];
          vm.toolBarBottom -= 64;
        }
        vm.pagination.total = result.TotalCount;
        if(vm.drawer){
          vm.drawer.deleteAll();
        }
        vm.$emit("querySuccess",fSet);
      },function (result) {
        vm.$emit("queryFailure",result);
      });
    },
    //table组件的入口方法，调用这个方法，初始化并显示一个table
    $_queryByLayer(layer, where) {
      //初始化参数
      let sql = this.$_getSQLParameter({
        layers: layer,
        where: where,
        pageIndex: 0,
        pagination: 10
      }), vm = this;
      //取得字段信息
      this.$_getFieldAtt(layer, function (result) {
        console.log(result)
        if (result && result.hasOwnProperty("FieldAtt") && result.FieldAtt.hasOwnProperty("FldName")) {
          //存储字段信息
          vm.FldName = result.FieldAtt.FldName;
          let Name = result.Name;
          //查询要素
          vm.$_queryBySQL(sql, function (result) {
            //确保数据不为空
            if (!result) {
              return
            } else if (!result.hasOwnProperty("AttStruct")) {
              throw new Error("返回结果不包含AttStruct（字段名）");
            }
            //取得数据总条数
            vm.pagination = {
              total: result.TotalCount,
              pageSize: 10
            }
            //初始化表头信息
            let FldName = result.AttStruct.FldName;
            vm.columns = [];
            for (let i = 0; i < FldName.length; i++) {
              vm.columns.push({
                title: FldName[i],
                width: 100,
                dataIndex: FldName[i],
                key: FldName[i],
                align: 'left',
                ellipsis: true,
                sorter: (a, b) => a[FldName[i]] > b[FldName[i]]
              });
            }
            //从查询结果取得数据
            vm.features = vm.$_fromQueryResult(result)
            //初始化table数据
            vm.$_initFeatureTableData("featureData", "features");
          });
        } else {
          throw new Error("未找到FldName信息，请检查数据库配置是否正确");
        }
      });
    },
    //根据table的数据源名称，以及要素集合的名称，初始化table数据
    $_initFeatureTableData(dataName, featureName) {
      this[dataName] = [];
      for (let i = 0; i < this[featureName].length; i++) {
        if(!this[featureName][i].attributes.hasOwnProperty("key")){
          this[featureName][i].attributes.key =  this[featureName][i].FID ? this[featureName][i].FID : i;
        }
        this[dataName].push(this[featureName][i]);
      }
    },
    //根据几何对象的类型，画图
    $_addFeatureToLayer(featureSet) {
      if(featureSet.length > 0){
        this.$_clearLayer("tableLayer");
        let features = [],paint,layerType;

        switch (featureSet[0].geometryType){
          case "Point":
            for (let i = 0; i < featureSet.length; i++) {
              let PntGeom = featureSet[i].geometry;
              for (let j = 0; j < PntGeom.length; j++) {
                let Dots = PntGeom[j].coordinates;
                let feature = {
                  "type": "Feature",
                  "geometry": {
                    "type": "Point",
                    "coordinates": [Dots[0], Dots[1]]
                  }
                };
                features.push(feature);
              }
            }
            if(this.styles && this.styles.hasOwnProperty("circle")){
              paint = this.styles.circle
            }else {
              paint = {
                //设置填充颜色
                "circle-color": "#000000",
                "circle-radius": 5
              }
            }
            layerType = "circle";
            break
          case "LineString":
            for (let i = 0; i < featureSet.length; i++) {
              //确保满足多线的情况
              let LinGeom = featureSet[i].geometry;
              for (let j = 0; j < LinGeom.length; j++) {
                let Dots = LinGeom[j].coordinates;
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
            if(this.styles && this.styles.hasOwnProperty("line")){
              paint = this.styles.line
            }else {
              paint = {
                //设置填充颜色
                "line-color": "#000000",
                "line-gap-width": 5
              }
            }
            layerType = "line";
            break
          case "Polygon":
            for (let i = 0; i < featureSet.length; i++) {
              //确保可以满足一个要素含有多个区域
              let RegGeom = featureSet[i].geometry;
              for (let m = 0; m < RegGeom.length; m++) {
                let finaldots = [], exterior = [], interior;
                for (let k = 0; k < RegGeom[m].exterior.length; k++) {
                  exterior.push([RegGeom[m].exterior[k].x, RegGeom[m].exterior[k].y]);
                }
                finaldots.push(exterior);
                for (let k = 0; k < RegGeom[m].interior.length; k++) {
                  interior = [];
                  for (let p = 0; p < RegGeom[m].interior[k].length; p++) {
                    interior.push([RegGeom[m].interior[k][p].x, RegGeom[m].interior[k][p].y]);
                  }
                  finaldots.push(interior);
                }
                let feature = {
                  "type": "Feature",
                  "geometry": {
                    "type": "Polygon",
                    "coordinates": finaldots
                  }
                }
                features.push(feature);
              }
            }
            if(this.styles && this.styles.hasOwnProperty("fill")){
              paint = this.styles.fill
            }else {
              paint = {
                //设置填充颜色
                "fill-color": "rgba(127,255,0, 0.5)",
                "fill-outline-color": '#FFA500'
              }
            }
            layerType = "fill";
            break
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
          "id": "tableLayer",
          //指定类型为fill（填充区域）
          "type": layerType,
          //设置数据来源
          "source": source,
          //设置绘制参数
          "paint": paint
        });
      }
    },
    //清除当前绘画图层
    $_clearLayer(layerId) {
      if (this.map.getLayer(layerId)) {
        this.map.removeLayer(layerId);
        this.map.removeSource(layerId);
      }
    },
    //在查询条件面板中，点击左边的字段名，显示当前查询到的字段属性
    $_clickFldNameShowAttributes(key) {
      let vm = this;
      vm.FldNameToAttributes = [];
      for (let i = 0; i < vm.features.length; i++) {
        Object.keys(vm.features[i].attributes).forEach(function (k) {
          if (key === k) {
            vm.FldNameToAttributes.push(vm.features[i].attributes[k]);
          }
        });
      }
    },
    //控制拼装SQL语句的光标位置
    $_addKeyToSQL(key) {
      let length = this.SQL.length, SQLObj = document.getElementById("SQL");
      this.SQLPosition = SQLObj.selectionStart;
      if (this.functions.indexOf(key) > -1 || key === "()") {
        let index = key.indexOf("(") + 1;
        if(this.SQL.length === 0){
          this.SQLPosition = 1;
          this.SQL = key;
        }else {
          this.SQL = this.SQL.substr(0,this.SQLPosition) + " " + key + " " + this.SQL.substr(this.SQLPosition,this.SQL.length - this.SQLPosition);
          this.SQLPosition = this.SQLPosition + index + 1;
        }
      }else {
        if(this.SQL.length === 0){
          this.SQLPosition = key.length;
          this.SQL = key;
        }else {
          this.SQL = this.SQL.length === 0 ? key : this.SQL.substr(0,this.SQLPosition) + " " + key + this.SQL.substr(this.SQLPosition,this.SQL.length - this.SQLPosition);
          this.SQLPosition = (this.SQL.substr(0,this.SQLPosition) + key).length + 1;
        }
      }
      this.$nextTick(function () {
        SQLObj.setSelectionRange(this.SQLPosition, this.SQLPosition);
        SQLObj.focus();
      })
    },
    //清空SQL
    $_clearSQL() {
      this.SQL = "";
      this.SQLPosition = 0;
    }
  }
}
</script>

<style>
.mapgis-fTable .mapgis-fTable-toolbar {
  width: 100%;
  height: 40px;
  position: absolute;
  z-index: 1;
  background: white;
}

.mapgis-fTable .mapgis-fTable-toolbar button{
  margin: 3px 2px;
}

.mapgis-fTable-attributeList {
  overflow-y: scroll;
  height: 400px;
}

.mapgis-fTable-title {
  margin: 0;
  text-align: center;
}

.mapgis-fTable-operation {
  padding-left: 3px;
}

.mapgis-fTable-operation .ant-tag {
  margin: 3px;
  width: 44px;
  height: 44px;
  cursor: pointer;
}

.mapgis-fTable-Function {
  width: 145px;
  margin-left: 7px!important;
  margin-top: 4px!important;
}

.mapgis-fTable-where.ant-input{
  width: 404px;
  height: 32px;
}

.mapgis-fTable-fldListItem {
  cursor: pointer;
  text-overflow: ellipsis;
  overflow: hidden;
  display: block!important;
  white-space: nowrap;
}

.mapgis-fTable-addFeatureTable {
  width: 400px;
  height: 380px;
}

.mapgis-fTable-addFeature {
  bottom: 70px;
  width: 90%;
  left: 5%;
}

.mapgis-fTable-SQLTable{
  width: 90%;
  height: 200px;
  left: 25px;
  bottom: 180px;
}

.mapgis-fTable .ant-table-placeholder {
  display: none;
}

.mapgis-fTable .ant-tabs-nav{
  float: left;
}

.mapgis-fTable-toolcheckbox{
  position: absolute;
  left: 10px;
  top: 10px;
}

.mapgis-fTable .editable-add-btn{
  position: absolute;
  left: 164px;
  top: 2px;
}
.mapgis-fTable .ant-tabs-extra-content{
  display: none;
}
</style>