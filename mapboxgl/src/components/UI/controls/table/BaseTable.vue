<template>
  <div v-show="hasFeatures">
    <div class="mapgis-table-collapse-wrapper">
      <mapgis-ui-div class="mapgis-table-collapse" v-show="!visible">
        <div @click="showTable">
          <mapgis-ui-iconfont type="mapgis-table" />属性表
        </div>
      </mapgis-ui-div>
    </div>
    <mapgis-ui-div class="mapgis-baseTable">
      <mapgis-ui-div
          :id="toolbarId"
          :style="{ bottom: toolbarBottom }"
          class="mapgis-baseTable-toolbar"
          v-if="toolbar && visible"
      >
        <div class="toolbar-num">
          总共{{ paginationCopy.total }}条，已选{{ selectData.length }}条
        </div>
        <mapgis-ui-button-group class="toolbar-buttons">
          <mapgis-ui-button @click="$_exportData" size="small">
            <mapgis-ui-iconfont type="mapgis-export" />
            导出
          </mapgis-ui-button>
          <mapgis-ui-button @click="$_fieldFilter" size="small">
            <mapgis-ui-iconfont type="mapgis-filter" />
            字段过滤
          </mapgis-ui-button>
          <mapgis-ui-button @click="$_deleteMassFeature" size="small">
            <mapgis-ui-iconfont type="mapgis-delete" />
            批量删除
          </mapgis-ui-button>
          <mapgis-ui-button @click="$_fullScreen" size="small" v-show="showFullScene">
            <mapgis-ui-iconfont type="mapgis-fullscreen" />
            全屏
          </mapgis-ui-button>
          <mapgis-ui-button @click="hideTable" size="small">
            <mapgis-ui-iconfont type="mapgis-close-circle" />
            关闭
          </mapgis-ui-button>
        </mapgis-ui-button-group>
      </mapgis-ui-div>
      <div class="mapgis-baseTable-nonData" v-show="columnsCopy.length === 0 && visible">
        <div style="width: 100%;">
          暂无数据
        </div>
      </div>
      <div
          :id="columnFilterId"
          class="mapgis-baseTable-fieldFilter"
          :style="{
          overflowY: plainOptions.length > 8 ? 'scroll' : 'hidden',
          top: filterTop + 'px',
          position: filterPosition
        }"
          v-show="showFilter && visible"
      >
        <mapgis-ui-row>
          <mapgis-ui-checkbox
              :indeterminate="indeterminate"
              :checked="checkAll"
              @change="$_checkAll"
          >
            全选
          </mapgis-ui-checkbox>
        </mapgis-ui-row>
        <mapgis-ui-row>
          <mapgis-ui-checkbox-group
              v-model="checkedList"
              :options="plainOptions"
              @change="$_check"
          />
        </mapgis-ui-row>
      </div>
      <mapgis-ui-table
          v-if="!deletTable"
          v-show="visible"
          :id="tableId"
          :data-source="dataSourceCopy"
          :columns="columnsCopy"
          :pagination="paginationCopy"
          :scroll="scroll"
          :row-selection="rowSelection"
          @change="$_change"
      >
        <div
            v-for="(column, index) in columnsCopy"
            :key="index"
            :slot="column.dataIndex"
            slot-scope="text, record"
        >
          <div
              class="mapgis-baseTable-tableTd"
              @click="$_onceClick(record.key, column.key)"
              @dblclick="$_doubleClick(record.key, column.key, record)"
          >
            <p
                :style="{ fontStyle: text === 'null' ? 'italic' : 'normal' }"
                class="mapgis-baseTable-content"
                :title="text"
                v-if="editRowAndCol !== column.key + '_' + record.key"
            >
              {{ text }}
            </p>
            <mapgis-ui-input
                v-if="editRowAndCol === column.key + '_' + record.key"
                v-model="record[column.key]"
            />
          </div>
        </div>
        <template v-if="editable" slot="operation" slot-scope="text, record">
          <mapgis-ui-popconfirm @confirm="$_deleteFeature(record)">
            删除
          </mapgis-ui-popconfirm>
        </template>
      </mapgis-ui-table>
    </mapgis-ui-div>
  </div>
</template>

<script>
import { VFeature } from "../../../util";
import { MRFS } from "@mapgis/webclient-es6-service";
const { FeatureService } = MRFS;
export default {
  name: "mapgis-base-table",
  props: {
    /*
    * json数据源url
    * */
    baseUrl: {
      type: String
    },
    /*
    * 数据源
    * */
    dataSource: {
      type: [Array, Object]
    },
    /*
    * 用户自定义的表头信息数组
    * */
    columns: {
      type: Array,
      default() {
        return [];
      }
    },
    /*
    * 分页信息
    * */
    pagination: {
      type: Object,
      default() {
        return {
          total: 0,
          pageSize: 10
        };
      }
    },
    /*
    * 是否启用表格编辑
    * */
    editable: {
      type: Boolean,
      default: true
    },
    /*
    * 是否启用选择
    * */
    selectable: {
      type: Boolean,
      default: true
    },
    autoEdit: {
      type: Boolean,
      default: true
    },
    showFullScene: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      visible: true,
      //转化后mapgis-ui-table需要的数据源
      dataSourceCopy: [],
      dataSourceOrigin: [],
      //dataSource转成的feature对象集合
      featureSet: [],
      //转化后mapgis-ui-table需要的表头
      columnsCopy: [],
      //保存一份columns
      columnsSave: [],
      columnsWidthSave: [],
      //tableId
      tableId: "table" + (Math.random() * 1000).toFixed(0),
      toolbarId: "toolbar" + (Math.random() * 1000).toFixed(0),
      columnFilterId: "columnFilter" + (Math.random() * 1000).toFixed(0),
      //表格的分页信息，外部必须传入
      paginationCopy: {},
      //要显示的表头
      checkedList: [],
      //是否显示x、y轴滚动条
      scroll: {},
      //已选择的数据
      selectData: [],
      //要编辑的单元格的行列号
      editRowAndCol: "",
      //是否显示工具栏
      toolbar: true,
      //是否显示过滤栏
      showFilter: false,
      //选择列
      rowSelection: {
        onChange: (selectedRowKeys, selectedRows) => {
          this.rowSelection.selectedRowKeys = selectedRowKeys;
          this.$_tableChanged();
          this.$emit("selectedChange", selectedRowKeys, selectedRows);
          this.$emit("selectedchange", selectedRowKeys, selectedRows);
        },
        onSelect: (record, selected) => {
          this.$_select(record, selected);
        },
        onSelectAll: selected => {
          this.$_selectAll(selected);
        },
        selectedRowKeys: []
      },
      //用于分页回调
      pageInfo: undefined,
      //用于排序回调
      sorterInfo: {
        orderField: "",
        isASC: false
      },
      indeterminate: true,
      checkAll: false,
      plainOptions: [],
      //工具栏高度
      toolbarBottom: 0,
      //是否全屏
      fullScreen: false,
      //一条数据高度
      rowHeight: 0,
      //分页高度
      pageHeight: 0,
      filterTop: 6,
      filterPosition: "absolute",
      pageSize: 10,
      baseUrlCopy: undefined,
      hasFeatures: true,
      currentId: undefined,
      deletTable: false,
      sortBack: {}
    };
  },
  watch: {
    dataSource: {
      handler: function() {
        this.$_initSource();
      },
      deep: true
    },
    baseUrl: {
      handler: function() {
        this.baseUrlCopy = this.baseUrl;
        this.$_initTableFromUrl();
      }
    },
    pagination: {
      handler: function() {
        this.$_initPagination();
      },
      deep: true
    }
  },
  created() {
    if(!window.tableData){
      window.tableData = {};
    }
  },
  mounted() {
    this.$_initTable();
    this.$_registerMouseLeave();
    this.$emit("loaded", this);
  },
  methods: {
    $_initTable() {
      if (this.pagination) {
        this.paginationCopy = this.pagination;
        this.pageSize = this.pagination.pageSize;
      }
      if (this.dataSource) {
        this.$_initSource();
      }
      if (this.baseUrl) {
        this.baseUrlCopy = this.baseUrl;
        this.$_initTableFromUrl();
      }
    },
    addTable(dataObj,currentId) {
      this.deletTable = true;
      this.currentId = currentId;
      this.$nextTick(function () {
        if (typeof dataObj === "string") {
          this.baseUrlCopy = dataObj;
          this.$_initTableFromUrl();
        } else if (dataObj instanceof Object) {
          this.$_initSource(dataObj);
        } else {
          throw new Error("请传入数据对象或者url！");
        }
      })
    },
    $_initTableFromUrl() {
      let vm = this;
      FeatureService.get(
          this.baseUrlCopy,
          function(result) {
            result = JSON.parse(result);
            vm.$_initSource(result);
          },
          function(e) {
            console.log(e);
          }
      );
    },
    $_nullProperties(features){
      let nullProperties = true;
      for (let i = 0; i < features.length; i++) {
        if(nullProperties && JSON.stringify(features[i].properties) !== "{}"){
          nullProperties = false;
          break
        }
      }
      return nullProperties;
    },
    //将传入的数据转化为mapgis-ui-table识别的数据
    $_initSource(dataSource) {
      dataSource = dataSource || this.dataSource;
      this.dataSourceOrigin = dataSource;
      this.sortBack = {};
      if(this.rowSelection){
        this.rowSelection.selectedRowKeys = [];
      }
      if(!dataSource || !dataSource.features || dataSource.features.length === 0){
        this.hasFeatures = false;
        this.$emit("createTableFailed","属性表","没有数据!");
        this.$emit("createLayerFailed",{
          message: "属性表",
          description: "数据量为0!"
        });
        return;
      }
      this.hasFeatures = true;
      if (dataSource instanceof Array) {
        if (this.$_isFeatureSet(dataSource)) {
          //Feature集合
          this.$_getColumnsCopyByFeatureSet(dataSource);
          this.$_applyColumnsToColumnsCopy();
          this.$_initPlainOptions();
          this.$_initCheckedList();
          this.$_addOperationColumns();
          this.featureSet = dataSource;
          this.$_featureSetToDataSource(this.featureSet);
          this.$_drawTable();
        }
        // else {
        //   //是原始的antdesign-table的datasource格式
        //   if(!this.pagination){
        //     this.paginationCopy.total = dataSource.length;
        //   }
        //   dataSourceCopy = dataSource;
        // }
      } else if (dataSource instanceof Object) {
        if(dataSource.hasOwnProperty("selectedRowKeys")){
          console.log("dataSource.selectedRowKeys",dataSource.selectedRowKeys)
          this.rowSelection.selectedRowKeys = dataSource.selectedRowKeys;
        }
        if(dataSource.hasOwnProperty("pagination")){
          this.paginationCopy = {...dataSource.pagination};
          let current = this.paginationCopy.current;
          delete this.paginationCopy.current;
          this.paginationCopy.defaultCurrent = current ? current : 1;
        }else {
          this.paginationCopy = this.pagination;
        }
        //zondy格式
        if (this.$_isZondyResult(dataSource)) {
          //this.columnsCopy.length为0表示第一次加载数据，需要初始化表头
          if (this.columnsCopy.length === 0) {
            this.$_getColumnsCopyByZondySource(dataSource);
            this.$_applyColumnsToColumnsCopy();
            this.$_initPlainOptions();
            this.$_initCheckedList();
            this.$_addOperationColumns();
            this.featureSet = VFeature.fromQueryResult(dataSource);
            this.$_featureSetToDataSource(this.featureSet);
            this.$_drawTable();
          } else {
            this.featureSet = VFeature.fromQueryResult(dataSource);
            this.$_featureSetToDataSource(this.featureSet);
            this.$nextTick(function() {
              this.$_drawTableHeight();
            });
          }
        } else {
          let nullProperties = this.$_nullProperties(dataSource.features);
          if(nullProperties){
            this.$emit("createLayerFailed",{
              message: "属性表",
              description: "数据中不包含任何属性数据!"
            });
            this.hasFeatures = false;
            return;
          }
          //geoJSON格式
          let features = VFeature.fromGeoJSON(dataSource);
          this.paginationCopy.total = features.length;
          this.$_getColumnsCopyByFeatureSet(features,dataSource.sortInfo);
          this.$_applyColumnsToColumnsCopy();
          this.$_initPlainOptions();
          this.deletTable = false;
          let table = document.getElementById(this.tableId);
          if(table){
            draw(this,features);
          }else {
            let vm = this;
            let interval = setInterval(function () {
              let table = document.getElementById(vm.tableId);
              if(table){
                clearInterval(interval);
                draw(vm,features,dataSource);
              }
            },30);
          }
          function draw(vm,features) {
            vm.$_initCheckedList();
            vm.featureSet = features;
            vm.$_featureSetToDataSource(features);
            vm.$_drawTable();
            vm.$_addOperationColumns();
          }
        }
      }
    },
    /*
     * 从zondy数据源中取得表头信息
     * @param Source 数据源
     * **/
    $_getColumnsCopyByZondySource(Source) {
      let FldName = Source.AttStruct.FldName;
      let columns = [];
      for (let i = 0; i < FldName.length; i++) {
        columns.push({
          title: FldName[i],
          dataIndex: FldName[i],
          key: FldName[i],
          scopedSlots: { customRender: FldName[i] },
          align: "left",
          ellipsis: true,
          sorter: function(a, b) {
            return a[key] - b[key];
          },
          width: 100
        });
      }
      this.columnsCopy = columns;
    },
    /*
     * 从featureSet里面去的columns
     * @param Source 数据源
     * **/
    $_getColumnsCopyByFeatureSet(Source,sortInfo) {
      if (Source.length > 0) {
        let columns = [];
        Object.keys(Source[0].attributes).forEach(function(key) {
          let column = {
            title: key,
            dataIndex: key,
            key: key,
            scopedSlots: { customRender: key },
            align: "left",
            ellipsis: true,
            sorter: function(a, b) {
              return a[key] - b[key];
            },
            width: 100
          }
          if(sortInfo && key === sortInfo.key){
            column.defaultSortOrder = sortInfo.value;
          }
          columns.push(column);
        });
        this.columnsCopy = columns;
      }
    },
    /*
     * 将[feature]转化为mapgis-ui-table数据源
     * **/
    $_featureSetToDataSource(featureSet) {
      //线存一份原始数据
      this.allDataSource = featureSet;
      //清空dataSourceCopy
      this.dataSourceCopy = [];
      //将为空的数据设为"null"
      for (let i = 0; i < featureSet.length; i++) {
        let data = Object.assign(featureSet[i].attributes, {}),
            vm = this;
        for (let j = 0; j < this.columnsCopy.length; j++) {
          if (
              !featureSet[i].attributes.hasOwnProperty(
                  this.columnsCopy[j].dataIndex
              )
          ) {
            data[this.columnsCopy[j].dataIndex] = "null";
          } else {
            let value = featureSet[i].attributes[this.columnsCopy[j].dataIndex];
            if (value === undefined || value === null || value === "") {
              data[this.columnsCopy[j].dataIndex] = "null";
            }
          }
        }
        featureSet[i].FID = featureSet[i].FID || i + 1;
        this.dataSourceCopy.push(
            Object.assign(data, { key: featureSet[i].FID })
        );
      }
    },
    /*
     * 初始化分页信息
     * **/
    $_initPagination() {
      this.paginationCopy = JSON.parse(JSON.stringify(this.pagination));
    },
    /*
     * 将用户自定义的columns覆盖原本的columns
     * **/
    $_applyColumnsToColumnsCopy() {
      if (this.columns.length > 0) {
        for (let i = 0; i < this.columnsCopy.length; i++) {
          for (let j = 0; j < this.columns.length; j++) {
            if (this.columns[j].key === this.columnsCopy[i].key) {
              this.columnsCopy[i] = Object.assign(
                  this.columnsCopy[i],
                  this.columns[j]
              );
            }
          }
        }
      }
      this.columnsSave = this.columnsCopy;
      this.columnsWidthSave = JSON.parse(JSON.stringify(this.columnsCopy));
    },
    /*
     * 添加操作列
     * **/
    $_addOperationColumns() {
      if (this.editable) {
        let flag = true;
        for (let i = 0; i < this.columnsCopy.length; i++) {
          if (this.columnsCopy[i].dataIndex === "operation") {
            flag = false;
            break;
          }
        }
        if (flag) {
          this.columnsCopy.push({
            title: "删除",
            dataIndex: "operation",
            key: "operation",
            scopedSlots: { customRender: "operation" },
            align: "center",
            width: 100,
            fixed: "right"
          });
        }
      }
    },
    /*
     * 确定显示隐藏表头的数组，不包含operation
     * **/
    $_initPlainOptions() {
      this.plainOptions = [];
      for (let i = 0; i < this.columnsCopy.length; i++) {
        if (this.columnsCopy[i].dataIndex !== "operation") {
          this.plainOptions.push(this.columnsCopy[i].title);
        }
      }
    },
    /*
     * 取得表格有效宽度
     * **/
    $_getTableEffectiveWidth(width) {
      let offsetWidth;
      //取得table对象
      let table = document.getElementById(this.tableId);
      if (width) {
        offsetWidth = width;
      } else {
        offsetWidth = table.offsetWidth;
      }
      //去掉启用编辑后剔除操作列的宽度
      if (this.editable) {
        offsetWidth -= 100;
      }
      //去掉启用选择后剔除选择列的宽度
      if (this.selectable) {
        offsetWidth -= 60;
      }
      return offsetWidth;
    },
    /*
     * 确定要显示的表头，如果用户传入columns则使用，不传则自动填满表格，不包含operation
     * **/
    $_initCheckedList() {
      function fillTableWithColumns() {
        for (let i = 0; i < vm.columnsCopy.length; i++) {
          columnsWidth += vm.columnsCopy[i].width;
          if (columnsWidth < offsetWidth) {
            vm.checkedList.push(vm.columnsCopy[i].title);
            columns.push(vm.columnsCopy[i]);
          } else {
            break;
          }
        }
      }

      this.checkedList = [];
      let columns = [],
          columnsWidth = 0,
          vm = this;
      //取得有效宽度
      let offsetWidth = this.$_getTableEffectiveWidth();
      if (this.columns.length > 0) {
        //用户传入columns，则应用
        for (let i = 0; i < this.columnsCopy.length; i++) {
          if (this.columnsCopy[i].checked) {
            columns.push(this.columnsCopy[i]);
            columnsWidth += this.columnsCopy[i].width;
            this.checkedList.push(this.columnsCopy[i].title);
          }
        }
        //如果用户没有指定要显示的列，则
        if (columns.length === 0) {
          fillTableWithColumns();
        }
      } else {
        //如果没有columns，则自动填满表格
        fillTableWithColumns();
      }
      //根据每个column的width，以及剔除选择和操作列后剩余的宽度，计算最终填满table每列需要的宽度
      for (let i = 0; i < columns.length; i++) {
        columns[i].width = (columns[i].width / columnsWidth) * offsetWidth;
      }
      this.columnsCopy = columns;
    },
    /*
     * 根据columns，实际取得的数据绘制table
     * **/
    $_drawTable() {
      let columnsWidth = 0;
      //取得有效宽度
      let offsetWidth = this.$_getTableEffectiveWidth();
      for (let i = 0; i < this.checkedList.length; i++) {
        for (let j = 0; j < this.columnsCopy.length; j++) {
          if (this.checkedList[i] === this.columnsCopy[j].title && this.columnsCopy[j].title !== "key") {
            columnsWidth += this.columnsCopy[j].width;
            break;
          }
        }
      }
      if (columnsWidth > offsetWidth) {
        this.scroll = {
          x: columnsWidth
        };
      } else {
        delete this.scroll.x;
        this.$nextTick(function() {
          if (this.dataSourceCopy.length > 0) {
            this.$_drawTableHeight();
          }
        });
      }
    },
    /*
     * 绘制表格高度
     * @param scrollHeight 滚动条高度
     * **/
    $_drawTableHeight(scrollHeight) {
      let table = document.getElementById(this.tableId);
      let tableBody = this.$_queryTag(
          table.childNodes,
          "mapgis-ui-table-body",
          "div"
      );
      let tr = this.$_queryTag(
          tableBody.childNodes,
          "mapgis-ui-table-row-level-0",
          "tr"
      );
      let container = this.$_queryTag(
          table.childNodes,
          "mapgis-ui-spin-container",
          "div"
      );
      this.rowHeight = tr.offsetHeight;
      let page = this.$_queryTag(
          table.childNodes,
          "mapgis-ui-pagination",
          "ul"
      );
      let pageStyle = window.getComputedStyle(page);
      let pageMarginTop = pageStyle.marginTop.replace("px", "");
      let pageMarginBottom = pageStyle.marginBottom.replace("px", "");
      this.pageHeight =
          page.offsetHeight + Number(pageMarginTop) + Number(pageMarginBottom);
      //页数+页眉+分页的高度
      let containerHeight =
          (this.paginationCopy.pageSize + 1.5) * this.rowHeight + this.pageHeight;
      container.style.height = containerHeight + "px";
      tableBody.style.height = containerHeight + "px";
      let vm = this;
      setTimeout(function () {
        vm.$_drawToolBar(containerHeight);
      },20);
    },
    /*
     * 绘制工具栏
     * **/
    $_drawToolBar(containerHeight) {
      this.toolbarBottom = containerHeight + "px";
    },
    /*
     * 通过className查询doom元素
     * **/
    $_queryTag(childNodes, className, tagName) {
      let node;

      function queryTag(childNodes, className, tagName) {
        for (let i = 0; i < childNodes.length; i++) {
          if (
              childNodes[i].localName === tagName &&
              typeof childNodes[i].className === "string" &&
              childNodes[i].className.indexOf(className) > -1
          ) {
            if (childNodes[i].className.indexOf(className + "-") < 0) {
              node = childNodes[i];
              break;
            }
          } else {
            queryTag(childNodes[i].childNodes, className, tagName);
          }
        }
      }

      queryTag(childNodes, className, tagName);
      return node;
    },
    /*
     * 判断是否上zondy格式
     * @param source 数据源
     **/
    $_isZondyResult(source) {
      let flag = true;
      if (
          !(
              source.hasOwnProperty("AttStruct") &&
              source.hasOwnProperty("SFEleArray") &&
              source.hasOwnProperty("TotalCount")
          )
      ) {
        flag = false;
      }
      return flag;
    },
    /*
     * 判断是否是要素集合
     * @param source 数据源
     **/
    $_isFeatureSet(source) {
      let flag = true;
      //这里无法使用instanceof进行比较，因为datasource可能由feture派生出来
      for (let i = 0; i < source.length; i++) {
        if (
            !(
                source[i].hasOwnProperty("geometry") &&
                source[i].hasOwnProperty("geometryType") &&
                source[i].hasOwnProperty("attributes") &&
                source[i].hasOwnProperty("style") &&
                source[i].hasOwnProperty("FID")
            )
        ) {
          flag = false;
          break;
        }
      }
      return flag;
    },
    /*
     * 取得当前分页的所有数据
     * **/
    $_getAllAttrData() {
      let dataArr = Object.assign(this.featureSet, {}),
          data;
      for (let i = 0; i < dataArr.length; i++) {
        dataArr[i].attributes = this.$_removeNullData(dataArr[i].attributes);
      }
      return dataArr;
    },
    /*
     * 将“null”转化为null
     * @param data 要转化的数据
     * **/
    $_removeNullData(data) {
      let returnData = {};
      Object.keys(data).forEach(function(key) {
        if (typeof data[key] === "string" && data[key].indexOf("null") > -1) {
          returnData[key] = null;
        } else {
          returnData[key] = data[key];
        }
      });
      return returnData;
    },
    /**
     * 输入一个value，从目标数组里面取得index
     * @param key 输入的key,以某一个key进行比较
     * @param value 输入的value
     * @param arrayObj 目标数组
     * @return Number 数组下标
     * */
    $_getIndexFromArray(key,value,arrayObj){
      let index= undefined;
      for (let i = 0; i < arrayObj.length; i++) {
        if(arrayObj[i][key] === value){
          index = i;
          break;
        }
      }
      return index;
    },
    /*
     * 删除一条数据
     * **/
    $_deleteFeature(record) {
      let data = this.$_getDataByKey(record.key);
      let index = this.$_getIndexFromArray("key",record.key,this.dataSourceCopy);

      let selectIndex = this.$_getIndexFromArray("FID",record.key,this.selectData);

      if(index !== undefined){
        this.dataSourceCopy.splice(index,1);
        this.featureSet.splice(index,1);
        if(selectIndex !== undefined){
          this.selectData.splice(selectIndex,1);
        }
        let checkIndex = this.rowSelection.selectedRowKeys.indexOf(record.key);
        if(checkIndex > -1){
          this.rowSelection.selectedRowKeys.splice(checkIndex,1);
        }
        this.paginationCopy.total = this.dataSourceCopy.length;
        this.$_tableChanged();
        this.$emit("dataChanged", this.$_getGeoJsonFromData());
        this.$emit("deleted", data);
      }
    },
    /*
     * 批量删除一条数据
     * **/
    $_deleteMassFeature() {
      let newData = [],newFeatureSet = [];
      for (let i = 0; i < this.dataSourceCopy.length; i++) {
        if(!this.$_getObjectFromArray("key",this.dataSourceCopy[i].key,this.selectData)){
          newData.push(this.dataSourceCopy[i]);
        }else {
          let checkIndex = this.rowSelection.selectedRowKeys.indexOf(this.dataSourceCopy[i].key);
          if(checkIndex > -1){
            this.rowSelection.selectedRowKeys.splice(checkIndex,1);
          }
        }
      }
      for (let i = 0; i < this.featureSet.length; i++) {
        if(!this.$_getObjectFromArray("key",this.featureSet[i].attributes.key,this.selectData)){
          newFeatureSet.push(this.featureSet[i]);
        }
      }
      this.dataSourceCopy = newData;
      this.featureSet = newFeatureSet;
      this.paginationCopy.total = this.dataSourceCopy.length;
      this.$_tableChanged();
      this.$emit("deleteMass", this.selectData);
      this.$emit("dataChanged", this.$_getGeoJsonFromData());
      this.selectData = [];
    },
    /**
     * 根据输入的key，以及value从数组中找到该对象
     * */
    $_getObjectFromArray(key,value,arrayObj){
      let obj = undefined;
      for (let i=0;i<arrayObj.length;i++){
        if(value === arrayObj[i].attributes[key]){
          obj = arrayObj[i];
          break;
        }
      }
      return obj;
    },
    /*
     * 选择一条数据
     * **/
    $_select(record, selected) {
      let value;
      let AllAttrData = this.$_getDateAuto(this.featureSet);
      for (let i = 0; i < AllAttrData.length; i++) {
        if (record.key === AllAttrData[i].FID) {
          value = AllAttrData[i];
          value.attributes = this.$_removeNullData(value.attributes);
          break;
        }
      }
      let index = -1,
          insertIndex = 0,
          FIDs = [];
      for (let i = 0; i < this.selectData.length; i++) {
        FIDs.push(this.selectData[i].FID);
        if (this.selectData[i].FID === value.FID) {
          index = i;
          break;
        }
      }
      if (index === -1) {
        for (let i = 0; i < FIDs.length; i++) {
          if (value.FID > FIDs[i]) {
            insertIndex++;
          }
        }
        this.selectData.splice(insertIndex, 0, value);
      } else {
        this.selectData.splice(index, 1);
      }
      this.$_tableChanged();
      this.$emit("selected", value, this.selectData, selected);
    },
    $_getDateAuto(data){
      let dataArr = [];
      if(this.autoEdit){
        if(!this.pageInfo){
          for (let i = 0; i < this.paginationCopy.pageSize; i++) {
            dataArr.push(data[i]);
          }
        }else {
          let start = (this.pageInfo.current - 1) * this.pageInfo.pageSize;
          for (let i = start; i < start + this.pageInfo.pageSize; i++) {
            dataArr.push(data[i]);
          }
        }
      }
      return dataArr;
    },
    /*
     * 选择一个分页度所有数据
     * **/
    $_selectAll(selected) {
      let AllAttrData = this.featureSet,
          selectData = [];
      AllAttrData = this.$_getDateAuto(AllAttrData);
      if (selected) {
        for (let i = 0; i < AllAttrData.length; i++) {
          let flag = false,
              FIDs = [];
          for (let j = 0; j < this.selectData.length; j++) {
            FIDs.push(this.selectData[j].FID);
            if (this.selectData[j].FID === AllAttrData[i].FID) {
              flag = true;
              break;
            }
          }
          if (!flag) {
            let insertIndex = 0;
            for (let j = 0; j < FIDs.length; j++) {
              if (AllAttrData[i].FID > FIDs[j]) {
                insertIndex++;
              }
            }
            // AllAttrData[i].attributes = this.$_removeNullData(AllAttrData[i].attributes);
            this.selectData.splice(insertIndex, 0, AllAttrData[i]);
          }
        }
      } else {
        for (let i = 0; i < this.selectData.length; i++) {
          for (let j = 0; j < AllAttrData.length; j++) {
            if (this.selectData[i].FID === AllAttrData[j].FID) {
              this.selectData[i] = [];
              break;
            }
          }
        }
        selectData = [].concat(this.selectData);
        this.selectData = [];
        for (let i = 0; i < selectData.length; i++) {
          if (selectData[i].length !== 0) {
            // AllAttrData[i].attributes = this.$_removeNullData(AllAttrData[i].attributes);
            this.selectData.push(selectData[i]);
          }
        }
      }
      this.$_tableChanged();
      this.$emit("selectAll", this.selectData, selected);
      this.$emit("selectall", this.selectData, selected);
    },
    /*
     * 分页或排序回调
     * **/
    $_change(pagination, filters, sorter, currentDataSource) {
      console.log("sorter",sorter)
      if (!sorter.hasOwnProperty("order")) {
        sorter.order = "";
      }
      let sorterObj = {};
      sorterObj.orderField = sorter.field;
      if (sorter.order === "ascend") {
        sorterObj.isAsc = true;
      } else if (sorter.order === "descend") {
        sorterObj.isAsc = false;
      } else if (sorter.order === "") {
        sorterObj.isAsc = false;
        sorterObj.noSort = true;
      }
      if (!this.pageInfo) {
        if (!sorter.hasOwnProperty("columnKey")) {
          this.$emit("pageChanged", pagination, sorterObj, currentDataSource);
          this.$emit("pagechanged", pagination, sorterObj, currentDataSource);
        } else {
          this.$emit("sorted", sorterObj, pagination, currentDataSource);
        }
      } else {
        if (pagination.current !== this.pageInfo.current) {
          this.$emit("pageChanged", pagination, sorterObj, currentDataSource);
          this.$emit("pagechanged", pagination, sorterObj, currentDataSource);
        } else {
          this.$emit("sorted", sorterObj, pagination, currentDataSource);
        }
      }
      this.pageInfo = pagination;
      this.sorterInfo = sorterObj;
      let sortOrder = undefined;
      if(sorterObj.hasOwnProperty("noSort")){
        sortOrder = false;
      }else {
        sortOrder = sorterObj.isAsc ? "ascend" : "descend";
      }
      this.sortBack = {};
      this.sortBack.key = sorterObj.orderField;
      this.sortBack.value = sortOrder;
      this.$_tableChanged();
      this.$emit("changed", pagination, filters, sorterObj, currentDataSource);
    },
    /*
     * 要素table的单次点击事件
     * **/
    $_onceClick(index, key) {
      //index即为行，key为列
      if (this.editRowAndCol !== key + "_" + index) {
        if (this.editRowAndCol.length > 0) {
          let arr = this.editRowAndCol.split("_");
          let datakey = arr[arr.length - 1];
          let data = this.$_getDataByKey(datakey);
          this.$_tableChanged();
          this.$emit("edited", data, this.$_getGeoJsonFromData());
          this.$emit("dataChanged", this.$_getGeoJsonFromData());
        }
        this.editRowAndCol = "";
      }
      let data = this.$_getDataByKey(index);
      this.$emit("click", data, key);
    },
    $_getGeoJsonFromData(){
      let geoJson = {
        "type": "FeatureCollection",
        "features": []
      };
      for(let i = 0;i < this.dataSourceCopy.length;i++){
        geoJson.features.push({
          type: 'Feature',
          geometry: this.dataSourceOrigin.features[i].geometry,
          properties: this.dataSourceCopy[i]
        });
      }
      return geoJson;
    },
    $_getDataByKey(key) {
      let dataIndex;
      for (let i = 0; i < this.dataSourceCopy.length; i++) {
        if (Number(key) === this.dataSourceCopy[i].key) {
          dataIndex = i;
          break;
        }
      }
      let data = JSON.parse(JSON.stringify(this.dataSourceCopy[dataIndex]));
      delete data.key;
      this.dataSourceCopy[dataIndex].attributes = data;
      data = this.$_removeNullData(data);
      let AllAttrData = this.$_getAllAttrData();
      AllAttrData[dataIndex].attributes = data;
      return AllAttrData[dataIndex];
    },
    /*
     * 要素table的双击事件，双击开启编辑
     * **/
    $_doubleClick(index, key, record) {
      let data = this.$_removeNullData(record);
      let AllAttrData = this.$_getAllAttrData();
      let value = data[key];
      value = !value ? null : value;
      this.curruntKey = key;
      if (this.editable) {
        //如果开启编辑，保存当前编辑单元格的行（index）列（key）号
        this.editRowAndCol = key + "_" + index;
        this.currentRecord = record;
      }
      this.$emit(
          "doubleClick",
          index - 1,
          key,
          value,
          data,
          AllAttrData[index - 1]
      );
      this.$emit(
          "doubleclick",
          index - 1,
          key,
          value,
          data,
          AllAttrData[index - 1]
      );
    },
    /*
     * 选择要显示或隐藏的列
     * **/
    $_check(e) {
      this.indeterminate = this.checkedList.length < this.plainOptions.length;
      this.checkAll = this.checkedList.length === this.plainOptions.length;
      let columns = [];
      for (let i = 0; i < this.checkedList.length; i++) {
        for (let j = 0; j < this.columnsSave.length; j++) {
          if (this.checkedList[i] === this.columnsSave[j].title) {
            columns.push(
                Object.assign(this.columnsSave[j], {
                  width: this.columnsWidthSave[i].width
                })
            );
          }
        }
      }
      this.columnsCopy = columns;
      if (this.editable && this.columnsCopy.length > 0) {
        this.$_addOperationColumns();
        this.$_drawTable();
      }
      this.$_setRowSelect();
    },
    /**
     * 设置是否显示左边的复选框，当没有列被显示时，隐藏左边的复选框
     * */
    $_setRowSelect(){
      if(this.columnsCopy.length === 0){
        this.rowSelection = undefined;
      }else {
        this.rowSelection = {
          onChange: (selectedRowKeys, selectedRows) => {
            this.$_tableChanged();
            this.$emit("selectedChange", selectedRowKeys, selectedRows);
            this.$emit("selectedchange", selectedRowKeys, selectedRows);
          },
          onSelect: (record, selected) => {
            this.$_select(record, selected);
          },
          onSelectAll: selected => {
            this.$_selectAll(selected);
          }
        }
      }
    },
    /*
     * 全选
     * **/
    $_checkAll(e) {
      if (e.target.checked) {
        this.checkedList = this.plainOptions;
        let columns = [];
        for (let i = 0; i < this.checkedList.length; i++) {
          for (let j = 0; j < this.columnsSave.length; j++) {
            if (this.checkedList[i] === this.columnsSave[j].title) {
              this.columnsSave[j].width = this.columnsWidthSave[j].width;
              columns.push(this.columnsSave[j]);
            }
          }
        }
        this.columnsCopy = columns;
        if (this.editable && this.columnsCopy.length > 0) {
          this.$_addOperationColumns();
        }
        this.$_drawTable();
      } else {
        this.checkedList = [];
        this.columnsCopy = [];
      }
      this.indeterminate = false;
      this.checkAll = e.target.checked;
      this.$_setRowSelect();
    },
    $_fieldFilter() {
      this.showFilter = !this.showFilter;
    },
    $_exportData(){
      this.$emit("exportData",this.$_getGeoJsonFromData());
    },
    showTable() {
      this.visible = true;
    },
    $_tableChanged(){
      let tableData = this.$_getGeoJsonFromData();
      tableData.selectedRowKeys = [].concat(this.rowSelection.selectedRowKeys);
      if(!this.pageInfo){
        tableData.pagination = {...this.paginationCopy};
        tableData.pagination.current = 1;
      }else {
        tableData.pagination = {...this.pageInfo};
      }
      tableData.sortInfo = this.sortBack;
      this.$emit("tableChanged",tableData);
    },
    hideTable() {
      this.$emit("hideTable");
      this.visible = false;
    },
    $_registerMouseLeave() {
      let columnFilter = document.getElementById(this.columnFilterId),
          vm = this;
      columnFilter.onmouseleave = function() {
        vm.showFilter = false;
      };
    },
    /*
     * 全屏函数
     * **/
    $_fullScreen() {
      let toolbar = document.getElementById(this.toolbarId);
      let table = document.getElementById(this.tableId);
      if (!this.fullScreen) {
        let tHeight = Number(document.body.scrollHeight);
        table.style.height = tHeight + "px";
        table.style.top = toolbar.offsetHeight + "px";
        table.classList.add("mapgis-baseTable-fullScreen");
        toolbar.style.top = "0";
        toolbar.style.position = "fixed";
        toolbar.style.width = document.body.scrollWidth + "px";
        this.filterTop = this.rowHeight + 6;
        this.filterPosition = "fixed";
        let offsetWidth = this.$_getTableEffectiveWidth(
            document.body.scrollWidth
        );
        let columnsWidth = 0;
        for (let i = 0; i < this.columnsCopy.length; i++) {
          for (let j = 0; j < this.columnsWidthSave.length; j++) {
            if (this.columnsCopy[i].key === this.columnsWidthSave[j].key) {
              this.columnsCopy[i].width = this.columnsWidthSave[j].width;
              columnsWidth += this.columnsCopy[i].width;
              break;
            }
          }
        }
        if (columnsWidth > offsetWidth) {
          this.scroll.x = offsetWidth;
        } else {
          delete this.scroll.x;
        }
        this.pageSize = this.pagination.pageSize;
        let fullNum = parseInt(
            (tHeight - this.pageHeight - toolbar.offsetHeight) / this.rowHeight
        );
        this.$emit(
            "fullScreen",
            this.$_getPageInfo(fullNum - 2),
            this.sorterInfo
        );
        this.$emit(
            "fullscreen",
            this.$_getPageInfo(fullNum - 2),
            this.sorterInfo
        );
        this.fullScreen = true;
      } else {
        table.removeAttribute("style");
        table.classList.remove("mapgis-baseTable-fullScreen");
        this.$nextTick(function() {
          let toolbar = document.getElementById(this.toolbarId);
          let table = document.getElementById(this.tableId);
          toolbar.style = "";
          this.toolbarBottom = table.offsetHeight - 1 + "px";
          toolbar.style.position = "absolute";
          toolbar.style.width = "100%";
          this.filterTop = 6;
          this.filterPosition = "absolute";
          let offsetWidth = this.$_getTableEffectiveWidth();
          let columnsWidth = 0;
          for (let i = 0; i < this.columnsCopy.length; i++) {
            for (let j = 0; j < this.columnsWidthSave.length; j++) {
              if (this.columnsCopy[i].key === this.columnsWidthSave[j].key) {
                this.columnsCopy[i].width = this.columnsWidthSave[j].width;
                columnsWidth += this.columnsCopy[i].width;
                break;
              }
            }
          }
          if (columnsWidth > offsetWidth) {
            this.scroll.x = offsetWidth;
          } else {
            delete this.scroll.x;
          }
        });
        this.$emit(
            "originScreen",
            this.$_getPageInfo(this.pageSize),
            this.sorterInfo
        );
        this.$emit(
            "originscreen",
            this.$_getPageInfo(this.pageSize),
            this.sorterInfo
        );
        this.fullScreen = false;
      }
    },
    /*
     * 取得pageInfo
     * **/
    $_getPageInfo(pageSize) {
      let pageInfo = {};
      if (!this.pageInfo) {
        pageInfo.current = 1;
        pageInfo.pageSize = pageSize;
      } else {
        pageInfo = this.pageInfo;
        pageInfo.pageSize = pageSize;
      }
      return pageInfo;
    }
  }
};
</script>

<style>
.mapgis-baseTable {
  width: 100%;
  position: absolute;
  background: transparent;
  bottom: 0;
  left: 0;
  z-index: 1000;
}

.mapgis-table-collapse-wrapper {
  position: absolute;
  z-index: 1000;
  bottom: 0px;
  width: 100%;
}
.mapgis-baseTable-nonData{
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 440px;
  z-index: 1000;
  background: white;
  font-size: 20px;
  text-align: center;
  align-items: center;
  display: flex;
}
.mapgis-table-collapse {
  margin: 0 auto;
  background: transparent;
  width: 72px;
  height: 24px;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  border-top: 1px solid #666666;
  border-left: 1px solid #666666;
  border-right: 1px solid #666666;
}

.mapgis-baseTable-tableTd {
  padding: 2px 16px;
  width: 100%;
  height: 32px;
  cursor: pointer;
}

.mapgis-baseTable-content {
  margin-bottom: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mapgis-baseTable .mapgis-ui-table {
  border-bottom: 1px solid transparent;
  line-height: 2;
}

.mapgis-baseTable .mapgis-ui-table-tbody > tr > td {
  padding: 0;
}

.mapgis-baseTable .mapgis-ui-table-thead > tr > th {
  padding: 2px 16px;
}

.mapgis-baseTable td.mapgis-ui-table-row-cell-break-word > span {
  cursor: pointer;
  color: #0088ff;
}

.mapgis-baseTable .mapgis-ui-input {
  height: 15px;
  width: 80px;
}

.mapgis-baseTable.addFeature {
  bottom: 64px;
  left: 23px;
  width: 90%;
}

.mapgis-baseTable .mapgis-ui-spin-container {
  border: 1px solid transparent;
  border-radius: 4px 4px 0 0;
}

.mapgis-baseTable-toolbar {
  width: 100%;
  height: 40px;
  position: absolute;
  background: transparent;
  z-index: 1;
  left: 0;
  bottom: 427px;
}

.mapgis-baseTable-toolbar .toolbar-button {
  position: absolute;
  right: 6px;
  top: 6px;
}

.mapgis-baseTable-toolbar .toolbar-num {
  position: absolute;
  min-width: 120px;
  left: 6px;
  top: 10px;
}

.mapgis-baseTable-toolbar .toolbar-buttons {
  float: right;
  margin-top: 10px;
  margin-right: 10px;
}

.mapgis-baseTable-fieldFilter {
  position: absolute;
  z-index: 1001;
  right: 6px;
  top: 6px;
  width: 150px;
  height: 200px;
  border: 1px solid #e8e8e8;
  border-radius: 3px;
  overflow: hidden;
  padding-top: 8px;
  background: white;
}

.mapgis-baseTable-fieldFilter .mapgis-ui-checkbox-wrapper {
  float: left;
}

.mapgis-baseTable-fieldFilter .mapgis-ui-checkbox-wrapper {
  padding-left: 10px;
}

.mapgis-baseTable .mapgis-ui-table-pagination {
  position: absolute;
  bottom: 5px;
  right: 10px;
}

.mapgis-baseTable-fullScreen {
  position: fixed;
  left: 0;
}
</style>
