<template>
  <div class="mapgis-baseTable">
    <div :id="toolbarId" class="mapgis-baseTable-toolbar" v-if="toolbar">
      <div class="toolbar-num">总共{{paginationCopy.total}}条，已选{{selectData.length}}条</div>
      <button class="toolbar-button" style="right: 80px;" @click="$_fullScreen">全屏</button>
      <button class="toolbar-button" @click="$_fieldFilter">字段过滤</button>
    </div>
    <div :id="columnFilterId" class="mapgis-baseTable-fieldFilter" :style="{overflowY: plainOptions.length > 8 ? 'scroll' : 'hidden'}" v-show="showFilter">
      <a-row>
        <a-checkbox :indeterminate="indeterminate" :checked="checkAll" @change="$_checkAll">
          全选
        </a-checkbox>
      </a-row>
      <a-row>
        <a-checkbox-group v-model="checkedList" :options="plainOptions" @change="$_check"/>
      </a-row>
    </div>
    <a-table :id="tableId"
             :data-source="dataSourceCopy"
             :columns="columnsCopy"
             :row-selection="rowSelection"
             :pagination="paginationCopy"
             :scroll="scroll"
             @change="$_change"
             bordered>
      <div v-for="(column,index) in columnsCopy" :key="index" :slot="column.dataIndex" slot-scope="text,record,index">
        <div class="mapgis-baseTable-tableTd" @click="$_onceClick(record.key,column.title,false,record)"
             @dblclick="$_doubleClick(record.key,column.title,record)">
          <p :style="{fontStyle:text === 'null' ? 'italic' : 'normal'}" class="mapgis-baseTable-content" :title="text" v-if="editRowAndCol !== column.title + '_' + record.key">
            {{ text }}
          </p>
          <a-input v-if="editRowAndCol === column.title + '_' + record.key"
                   v-model="record[column.title]"/>
        </div>
      </div>
      <template v-if="edit || showDelete" slot="operation" slot-scope="text, record">
        <a-popconfirm
            @confirm="$_deleteFeature(record)"
        >
          删除
        </a-popconfirm>
      </template>
    </a-table>
  </div>
</template>

<script>
import Vue from "vue"
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import {VFeature} from "../../../util";
import iconfont from "../../iconfont/iconfront"

Vue.use(Antd);

export default {
  name: "mapgis-base-table",
  components:{iconfont},
  props:{
    dataSource:{
      type: [Array,Object]
    },
    columns:{
      type: Array,
      default: function () {
        return []
      }
    },
    edit:{
      type: Boolean,
      default: true
    },
    showDelete:{
      type: Boolean,
      default: false
    },
    pagination:{
      type: Object
    },
    height:{
      type: Number
    },
    select:{
      type: Boolean,
      default: true
    },
    toolbar:{
      type: Boolean,
      default: true
    }
  },
  data(){
    return {
      plainOptions : [],
      checkedList : [],
      //要编辑的单元格的行列号
      editRowAndCol: "",
      currentRecord:"",
      //columns的副本，避免columns无限更新
      columnsCopy:[],
      columnsAuto:[],
      //dataSource的副本，避免dataSource无限更新
      dataSourceCopy:[],
      //包含所有值得数据
      allDataSource:[],
      paginationCopy:{
        total:0,
        pageSize:10
      },
      pageSizeCopy:undefined,
      rowSelection: {
        onChange: (selectedRowKeys, selectedRows) => {
          this.$emit("selectedChange",selectedRowKeys, selectedRows);
        },
        onSelect: (record, selected) => {
          let AllAttrData = this.$_getAllAttrData();
          let value;
          for (let i = 0;i < AllAttrData.length;i++){
            if(record.key === AllAttrData[i].FID){
              value = AllAttrData[i];
              break
            }
          }
          let index = -1,insertIndex = 0,FIDs = [];
          for (let i = 0;i < this.selectData.length;i++){
            FIDs.push(this.selectData[i].FID);
            if(this.selectData[i].FID === value.FID){
              index = i
              break;
            }
          }
          if(index === -1){
            for (let i = 0;i < FIDs.length;i++){
              if(value.FID > FIDs[i]){
                insertIndex++;
              }
            }
            this.selectData.splice(insertIndex,0,value);
          }else {
            this.selectData.splice(index,1);
          }
          this.$emit("selected",value,this.selectData,selected);
        },
        onSelectAll: (selected) => {
          let AllAttrData = this.$_getAllAttrData(),selectData = [];
          if(selected){
            for(let i = 0;i < AllAttrData.length;i++){
              let flag = false,FIDs = [];
              for (let j = 0;j < this.selectData.length;j++){
                FIDs.push(this.selectData[j].FID);
                if(this.selectData[j].FID === AllAttrData[i].FID){
                  flag = true;
                  break;
                }
              }
              if(!flag){
                let insertIndex = 0;
                for (let j = 0;j < FIDs.length;j++){
                  if(AllAttrData[i].FID > FIDs[j]){
                    insertIndex++;
                  }
                }
                this.selectData.splice(insertIndex,0,AllAttrData[i]);
              }
            }
          }else {
            for(let i = 0; i < this.selectData.length;i++){
              for (let j = 0;j < AllAttrData.length;j++){
                if(this.selectData[i].FID === AllAttrData[j].FID){
                  this.selectData[i] = [];
                  break;
                }
              }
            }
            selectData = [].concat(this.selectData);
            this.selectData = [];
            for (let i = 0;i < selectData.length;i++){
              if(selectData[i].length !== 0){
                this.selectData.push(selectData[i]);
              }
            }
          }
          this.$emit("selectAll", this.selectData, selected);
        },
      },
      showFilter: false,
      tableId: "table" + parseInt(Math.random() * 1000),
      toolbarId: "toolbar" + parseInt(Math.random() * 1000),
      columnFilterId: "columnFilter" + parseInt(Math.random() * 1000),
      table: undefined,
      scroll:undefined,
      checkAll: false,
      indeterminate: true,
      fullScreen: false,
      selectData: [],
      trHeight: undefined,
      addScroll: false,
      pageInfo: undefined,
      sorterInfo: undefined,
      init: false
    }
  },
  watch:{
    columnsAuto:{
      handler:function () {
        this.$_columnsToCopy(this.columnsAuto);
        this.$_featureSetToDataSource(VFeature.fromQueryResult(this.dataSource),this.columnsAuto);
      },
      deep: true
    },
    dataSource:{
      handler:function () {
        this.$_sourceToCopy();
      },
      deep: true
    },
    columns:{
      handler:function () {
        this.$_changeColumnAttr();
      },
      deep: true
    },
    edit:{
      handler:function (){
        if(this.edit){
          this.$_addOperationColumns();
        }else {
          if(this.editRowAndCol.length > 0){
            this.editRowAndCol = "";
            this.$_onceClick(this.editRowAndCol.split("_")[1],this.editRowAndCol.split("_")[0],true,this.currentRecord);
          }
          this.$_removeOperationColumns();
        }
      }
    },
    pagination:{
      handler:function (){
        this.$_paginationToCopy();
      },
      deep: true
    },
    select:{
      handler:function () {
        this.rowSelection = undefined;
      }
    },
    toolbar:{
      handler:function () {}
    }
  },
  created() {
  },
  mounted() {
    let columnFilter = document.getElementById(this.columnFilterId),vm = this;
    columnFilter.onmouseleave  = function () {
      vm.showFilter = false;
    };
    //如果一开始数据存在，则主动处理一下数据
    if(this.dataSource.length > 0){
      this.$_sourceToCopy();
    }
    if(this.columns.length > 0){
      this.$_columnsToCopy(this.columns);
    }
    if(this.pagination && this.pagination.hasOwnProperty("total") && this.pagination.total > 0){
      this.$_paginationToCopy();
    }
    if(!this.select){
      this.rowSelection = undefined;
    }
    this.$emit("handleCreated",this);
  },
  methods:{
    $_changeColumnAttr(){
      let columnArr = [],hasOperation = false,columnsWidth = 200,widthBase = 0;
      this.plainOptions = [];
      for (let i = 0;i < this.columnsCopy.length;i++){
        for (let j = 0;j < this.columns.length;j++){
          if(this.columns[j].key === this.columnsCopy[i].key){
            this.columnsCopy[i] = Object.assign(this.columnsCopy[i],this.columns[j]);
            if(this.columns[j].checked === true){
              columnArr.push(this.columnsCopy[i]);
              columnsWidth += this.columnsCopy[i].width;
              widthBase += this.columnsCopy[i].width;
            }
          }
        }
        if(this.columnsCopy[i].key === "operation"){
          hasOperation = true;
        }
        this.plainOptions.push(this.columnsCopy[i].title);
      }
      let table = document.getElementById(this.tableId);
      let offsetWidth = table.offsetWidth;
      console.log("table",table.offsetWidth)
      console.log("columnsWidth",columnsWidth)
      for(let i = 0;i < columnArr.length;i++){
        columnArr[i].width = columnArr[i].width/widthBase * (offsetWidth - 160);
      }
      if(columnArr.length > 0){
        this.$_initCheckedList(columnArr);
        this.columnsCopy = columnArr;
        if(hasOperation){
          this.$_addOperationColumns();
        }
      }
    },
    $_fullScreen(){
      let toolbar = document.getElementById(this.toolbarId);
      let table = document.getElementById(this.tableId);
      if(!this.fullScreen){
        let tHeight = document.body.scrollHeight - toolbar.offsetHeight;
        table.style.height = tHeight + "px";
        table.style.top = toolbar.offsetHeight + "px";
        table.classList.add("mapgis-baseTable-fullScreen");
        toolbar.style.bottom = document.body.scrollHeight - toolbar.offsetHeight + "px";
        toolbar.style.position = "fixed";
        toolbar.style.width = document.body.scrollWidth + "px";
        let fullNum = parseInt(tHeight / this.trHeight);
        this.pageSizeCopy = this.paginationCopy.pageSize;
        this.$emit("fullScreen",fullNum);
        this.fullScreen = true;
      }else {
        table.style = "";
        table.classList.remove("mapgis-baseTable-fullScreen");
        toolbar.style.bottom = table.offsetHeight + "px";
        toolbar.style.position = "absolute";
        toolbar.style.width = "100%";
        this.$emit("originScreen",this.pageSizeCopy);
        this.fullScreen = false;
      }
    },
    $_initTableStyle(scrollHeight){
      let table = document.getElementById(this.tableId);
      let toolbar = document.getElementById(this.toolbarId);
      let tableBody = this.$_queryTag(table.childNodes,"ant-table-body","div");
      let tr = this.$_queryTag(table.childNodes,"ant-table-row","tr");
      let container = this.$_queryTag(table.childNodes,"ant-spin-container","div");
      this.trHeight = tr.offsetHeight;
      if(this.height){
        tableBody.style.height = this.height + "px";
        container.style.height = this.height + 110 + "px";
        if(this.toolbar){
          toolbar.style.bottom = container.offsetHeight + "px";
        }
        let hasScroll = true;
        if(this.dataSourceCopy.length < this.paginationCopy.pageSize){
          if(this.dataSourceCopy.length * tr.offsetHeight < this.height){
            hasScroll = false;
          }
        }
        if(hasScroll){
          if(!this.scroll){
            this.scroll = {
              y: this.height
            };
          }else {
            this.scroll.y = this.height;
          }
        }
      }else {
        this.$nextTick(function () {
          let table = document.getElementById(this.tableId);
          let toolbar = document.getElementById(this.toolbarId);
          let tableBody = this.$_queryTag(table.childNodes,"ant-table-body","div",true);
          let tr = this.$_queryTag(tableBody.childNodes,"ant-table-row-level-0","tr");
          let container = this.$_queryTag(table.childNodes,"ant-spin-container","div");
          let pageUL = this.$_queryTag(table.childNodes,"ant-pagination","ul");
          if(this.toolbar){
            if(scrollHeight === 0){
              tableBody.style.height = (this.paginationCopy.pageSize + 1) * (tr.offsetHeight + 2) + 40 + "px";
            }else {
              tableBody.style.height = (this.paginationCopy.pageSize + 1) * (tr.offsetHeight + 1) + 7 + "px";
            }
          }
          //页数+页眉+页脚的高度
          container.style.height = (this.paginationCopy.pageSize + 1) * tr.offsetHeight + 40 + pageUL.offsetHeight + scrollHeight + "px";
          toolbar.style.bottom = container.offsetHeight + "px";
        })
      }
    },
    $_queryTag(childNodes,className,tagName,strict){
      let node;
      function queryTag(childNodes,className,tagName){
        for (let i = 0; i < childNodes.length;i++){
          if(childNodes[i].localName === tagName && typeof childNodes[i].className === "string" && childNodes[i].className.indexOf(className) > -1){
            if(strict){
              if(childNodes[i].className.indexOf(className + "-") < 0){
                node = childNodes[i];
                break;
              }
            }else {
              node = childNodes[i];
              break;
            }
          }else {
            queryTag(childNodes[i].childNodes,className,tagName);
          }
        }
      }
      queryTag(childNodes,className,tagName);
      return node;
    },
    $_check(e){
      this.indeterminate =  this.checkedList.length < this.plainOptions.length;
      this.checkAll = this.checkedList.length === this.plainOptions.length;
      this.$_initColumns(this.columnsAuto,false);
      this.$_addOperationColumns();
      for (let i = 0;i < this.columnsCopy.length;i++){
        for (let j = 0;j < this.columns.length;j++){
          if(this.columns[j].key === this.columnsCopy[i].key){
            this.columnsCopy[i] = Object.assign(this.columnsCopy[i],this.columns[j]);
          }
        }
      }
    },
    $_checkAll(e){
      if(e.target.checked){
        this.checkedList = this.plainOptions;
      }else {
        this.checkedList = [];
      }
      this.indeterminate = false;
      this.checkAll = e.target.checked;
      this.$_initColumns(this.columnsAuto,false);
      this.$_addOperationColumns();
    },
    $_fieldFilter(){
      this.showFilter = !this.showFilter;
    },
    $_removeOperationColumns(){
      this.columnsCopy.splice(this.columnsCopy.length - 1,1);
    },
    $_addOperationColumns(){
      if(this.edit || this.showDelete){
        let flag = true;
        for (let i = 0;i < this.columnsCopy.length;i++){
          if(this.columnsCopy[i].dataIndex === "operation"){
            flag = false;
            break;
          }
        }
        if(flag){
          this.columnsCopy.push({
            title: 'operation',
            dataIndex: 'operation',
            key: 'operation',
            scopedSlots: {customRender: 'operation'},
            align: 'center',
            width: 100,
            fixed: 'right'
          });
        }
      }
    },
    $_change(pagination, filters, sorter,currentDataSource ){
      if(!sorter.hasOwnProperty("order")){
        sorter.order = "";
      }
      if(!this.pageInfo){
        if(sorter.hasOwnProperty("order")){
          this.$emit("sorted", sorter, pagination, currentDataSource );
        }else {
          this.$emit("pageChanged",pagination, sorter, currentDataSource );
        }
        this.pageInfo = pagination;
      }else {
        if(pagination.current !== this.pageInfo.current){
          this.pageInfo = pagination;
          this.$emit("pageChanged",pagination, sorter, currentDataSource );
        }else{
          this.$emit("sorted", sorter, pagination, currentDataSource );
        }
      }
      this.sorterInfo = sorter;
      this.$emit("changed",pagination, filters, sorter,currentDataSource );
    },
    $_returnModelKey(value, record){
      let key;
      if(value.indexOf("_null") > -1){
        key = value;
      }else {
        key = this.$_returnKey(value, record);
      }
      return key;
    },
    //要素table的单次点击事件
    $_onceClick(index, key,forceClick,record) {
      console.log("index, key,forceClick,record",index, key,forceClick,record)
      let data = this.$_removeExtraData(record);
      let AllAttrData = this.$_getAllAttrData();
      let value = data[key];
      value = !value ? null : value;
      //index即为行，key为列，当行列号不是当前要编辑的table单元格时，取消当前的编辑行为
      if ((this.edit || forceClick)&& this.editRowAndCol !== key + "_" + index) {
        if(this.editRowAndCol.length > 0){
          this.dataSourceCopy[index-1] = data;
          this.$emit("edited",index-1,key,value,data,AllAttrData[index-1]);
        }
        this.editRowAndCol = "";
        this.currentRecord = "";
      }

      this.$emit("click",index-1,key,value,data,AllAttrData[index-1]);
    },
    $_removeExtraData(data){
      let returnData = {};
      Object.keys(data).forEach(function (key) {
        if(typeof data[key] === "string" && data[key].indexOf("null") > -1){
          returnData[key] = null;
        }else {
          returnData[key] = data[key];
        }
      });
      return returnData;
    },
    //要素table的双击事件，双击开启编辑
    $_doubleClick(index, key, record) {
      let data = this.$_removeExtraData(record);
      let AllAttrData = this.$_getAllAttrData();
      let value = data[key];
      value = !value ? null : value;
      this.curruntKey = key;
      if (this.edit) {
        //如果开启编辑，保存当前编辑单元格的行（index）列（key）号
        this.editRowAndCol = key + "_" + index;
        this.currentRecord = record;
      }
      this.$emit("doubleClick",index-1,key,value,data,AllAttrData[index-1]);
    },
    $_returnText(text,record){
      if(record.hasOwnProperty(text)){
        return "null";
      }
      return text;
    },
    //通过当前数据的文本内容，反推出key的值
    $_returnKey(value, record) {
      let key;
      Object.keys(record).forEach(function (k) {
        if (record[k] === value) {
          key = k;
        }
      });
      return key;
    },
    $_deleteFeature(record) {
      for(let i = 0;i < this.dataSourceCopy.length;i++){
        if(this.dataSourceCopy[i].key === record.key){
          this.dataSourceCopy.splice(i,1);
          break;
        }
      }
      let pageInfo = {},sorterInfo = {};
      if(!this.pageInfo){
        pageInfo = this.pagination;
        pageInfo.current = 1;
        sorterInfo.columnKey = "";
        sorterInfo.order = "";
      }else {
        pageInfo = this.pageInfo;
        sorterInfo = this.sorterInfo;
      }
      this.$emit("delete",record.key,this.$_removeExtraData(record),pageInfo,sorterInfo);
    },
    //是否是Feature集合
    $_isFeatureSet(FeatureSet){
      let flag = true;
      //这里无法使用instanceof进行比较，因为datasource可能由feture派生出来
      for (let i = 0;i < FeatureSet.length;i++){
        if(!(FeatureSet[i].hasOwnProperty("geometry") && FeatureSet[i].hasOwnProperty("geometryType") &&
            FeatureSet[i].hasOwnProperty("attributes") && FeatureSet[i].hasOwnProperty("style") &&
            FeatureSet[i].hasOwnProperty("FID"))){
          flag = false;
          break;
        }
      }
      return flag;
    },
    //是否是zondy查询方法返回的值
    $_isZondyResult(result){
      let flag = true;
      if(!(result.hasOwnProperty("AttStruct")
          && result.hasOwnProperty("SFEleArray")
          && result.hasOwnProperty("TotalCount"))){
        flag = false;
      }
      return flag;
    },
    //判断是否是GeoJson
    $_isGeoJSON(GeoJSON){
      let flag;
      if(GeoJSON.hasOwnProperty("type") && GeoJSON.hasOwnProperty("features")){
        flag = true;
      }else if(GeoJSON.hasOwnProperty("type") && GeoJSON.hasOwnProperty("geometry") && GeoJSON.hasOwnProperty("properties")){
        flag = true;
      }else {
        flag = false;
      }
    },
    $_featureSetToDataSource(featureSet,columns){
      this.allDataSource = featureSet;
      this.dataSourceCopy = [];
      for (let i = 0; i < featureSet.length; i++) {
        let data = Object.assign(featureSet[i].attributes,{}),vm = this;
        for (let j = 0;j < columns.length;j++){
          if(!featureSet[i].attributes.hasOwnProperty(columns[j].dataIndex)){
            data[columns[j].dataIndex] = "null";
          }else{
            let value = featureSet[i].attributes[columns[j].dataIndex];
            if(value === undefined || value === null || value === ""){
              data[columns[j].dataIndex] = "null";
            }
          }
        }
        this.dataSourceCopy.push(Object.assign(data, {key: featureSet[i].FID ? featureSet[i].FID : i + 1}));
      }
      console.log("dataSourceCopy",this.dataSourceCopy)
      if(!this.pagination){
        this.paginationCopy.total = this.dataSourceCopy.length;
      }
    },
    $_getAllAttrData(hasKey){
      let dataArr = [],data;
      for (let i = 0;i < this.allDataSource.length;i++){
        data = {};
        data.attributes = this.$_removeExtraData(this.dataSourceCopy[i]);
        delete data.attributes.key;
        data.geometry = this.allDataSource[i].geometry;
        data.geometryType = this.allDataSource[i].geometryType;
        data.style = this.allDataSource[i].style;
        data.FID = this.allDataSource[i].FID;
        dataArr.push(data);
      }
      return dataArr;
    },
    $_getDataSource(){
      let dataArr = [],data;
      for (let i = 0;i < this.dataSourceCopy.length;i++){
        data = this.$_removeExtraData(this.dataSourceCopy[i]);
        dataArr.push(data);
      }
      return dataArr;
    },
    $_sourceToCopy(){
      if(this.dataSource instanceof Array){
        if(this.$_isFeatureSet(this.dataSource)){
          //Feature集合
          this.$_featureSetToDataSource(this.dataSource,this.columns);
        }else {
          //是原始的antdesign-table的datasource格式
          if(!this.pagination){
            this.paginationCopy.total = this.dataSource.length;
          }
          this.dataSourceCopy = this.dataSource;
        }
      }else if(this.dataSource instanceof Object){
        //zondy格式
        if(this.$_isZondyResult(this.dataSource)){
          if(this.columnsCopy.length === 0){
            let FldName = this.dataSource.AttStruct.FldName;
            let columnsAuto = [];
            for (let i = 0; i < FldName.length; i++) {
              columnsAuto.push({
                title: FldName[i],
                dataIndex: FldName[i],
                key: FldName[i],
                scopedSlots: {customRender: FldName[i]},
                align: "left",
                ellipsis: true,
                sorter: (a, b) => a[FldName[i]] > b[FldName[i]],
                width: 100
              });
            }
            this.columnsAuto = columnsAuto;
          }else {
            this.columnsAuto = this.columnsCopy;
          }
        }else if(this.$_isGeoJSON(this.dataSource)){
          //geoJSON格式
          this.$_featureSetToDataSource(VFeature.fromGeoJSON(this.dataSource));
        }
      }
      if(this.dataSourceCopy.length < this.paginationCopy.pageSize){
        this.$nextTick(function () {
          let table = document.getElementById(this.tableId);
          let tableBody = this.$_queryTag(table.childNodes,"ant-table-body","div",true);
          tableBody.style.height = this.height + "px";
          let tr = this.$_queryTag(table.childNodes,"ant-table-row","tr");
          if(tr.offsetHeight * this.dataSourceCopy.length < this.height){
            this.scroll = {}
          }
        });
      }
    },
    $_initPlainOptions(columns){
      this.plainOptions = [];
      for(let i = 0;i < columns.length;i++){
        let title = columns[i].title;
        this.plainOptions.push(title);
      }
    },
    $_initCheckedList(columns){
      this.checkedList = [];
      let columnsWidth = 100;
      let table = document.getElementById(this.tableId);
      for(let i = 0;i < columns.length;i++){
        columnsWidth += columns[i].width;
        if(columnsWidth < table.offsetWidth){
          this.checkedList.push(this.plainOptions[i]);
        }else {
          break
        }
      }
    },
    $_initColumns(columns,initTableStyle){
      this.columnsCopy = [];
      let columnsWidth = 100,widthBase = 0;
      for(let i = 0;i < this.checkedList.length;i++){
        let dataIndex = columns[i].dataIndex;
        let column = {
          title: dataIndex,
          dataIndex: dataIndex,
          key: dataIndex,
          scopedSlots: {customRender: dataIndex},
          align: "left",
          ellipsis: true,
          sorter: (a, b) => a[FldName[i]] > b[FldName[i]],
          width: 100
        };
        column = Object.assign(column,columns[i])
        this.columnsCopy.push(column);
        columnsWidth += Number(column.width);
        widthBase += column.width;
      }
      let table = document.getElementById(this.tableId);

      //60为复选框所在列的宽度
      console.log("columnsWidth + 60",columnsWidth + 60)
      if(columnsWidth + 60 > table.offsetWidth){
        this.$nextTick(function (){
          this.scroll = {
            x: table.offsetWidth
          }
          this.$_initTableStyle(18);
        })
      }else {
        let offsetWidth = table.offsetWidth;
        console.log("table",table.offsetWidth)
        console.log("columnsWidth",columnsWidth)
        for(let i = 0;i < this.columnsCopy.length;i++){
          this.columnsCopy[i].width = this.columnsCopy[i].width/widthBase * (offsetWidth - 160);
        }
        this.scroll = undefined
        this.$nextTick(function (){
          this.$_initTableStyle(0);
        })
      }
    },
    $_columnsToCopy(columns){
      console.log("columns=-----------",columns)
      this.$_initPlainOptions(columns);
      this.$_initCheckedList(columns);
      this.$_initColumns(columns,true);
      this.$_addOperationColumns();
    },
    $_paginationToCopy(){
      if(this.pagination){
        this.paginationCopy = this.pagination;
      }
    }
  }
}
</script>

<style>
.mapgis-baseTable{
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  background: white;
  z-index: 1;
}

.mapgis-baseTable-tableTd {
  padding: 2px 15px;
  width: 100%;
  height: 32px;
  cursor: pointer;
}

.mapgis-baseTable-content {
  margin-bottom: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mapgis-baseTable .ant-table{
  border-bottom: 1px solid #e8e8e8;
  line-height: 2;
}

.mapgis-baseTable .ant-table-tbody > tr > td {
  padding: 0;
}

.mapgis-baseTable .ant-table-thead > tr > th {
  padding: 2px 16px;
}

.mapgis-baseTable td.ant-table-row-cell-break-word > span {
  cursor: pointer;
  color: #0088ff;
}

.mapgis-baseTable .ant-input {
  height: 15px;
  width: 80px;
}
.mapgis-baseTable.addFeature{
  bottom: 64px;
  left: 23px;
  width: 90%;
}

.mapgis-baseTable .ant-spin-container{
  border: 1px solid #e8e8e8;
  border-radius: 4px 4px 0 0
}

.mapgis-baseTable-toolbar{
  width: 100%;
  height: 40px;
  position: absolute;
  background: white;
  z-index: 1;
  left: 0;
  bottom: 427px;
}

.mapgis-baseTable-toolbar .toolbar-button{
  position: absolute;
  right: 6px;
  top: 6px;
}

.mapgis-baseTable-toolbar .toolbar-num{
  position: absolute;
  min-width: 120px;
  left: 6px;
  top: 10px;
}

.mapgis-baseTable-fieldFilter{
  position: absolute;
  z-index: 2;
  right: 6px;
  top: 6px;
  width: 150px;
  height: 200px;
  background: white;
  border: 1px solid #e8e8e8;
  border-radius: 3px;
  overflow: hidden;
  padding-top: 8px;
}

.mapgis-baseTable-fieldFilter .ant-checkbox-wrapper{
  float: left;
}

.mapgis-baseTable-fieldFilter .ant-checkbox-wrapper{
  padding-left: 10px;
}
.mapgis-baseTable .ant-table-pagination{
  position: absolute;
  bottom: 5px;
  right: 10px;
}
.mapgis-baseTable-fullScreen{
  position: fixed;
  left: 0;
  background: white;
}
</style>