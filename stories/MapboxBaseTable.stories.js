import {Feature, SQLParameter} from "../mapboxgl/src/components/util";
import {polygonData} from "./component/geometry";

export default {
  title: "二维/基本表格",
  argTypes: {
    layerId: "igs_layer_layerid",
    sourceId: "igs_layer_sourceid",
    domain: "http://develop.smaryun.com:6163",
    serverName: "北京市"
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  template: `
    <mapgis-web-map crs="EPSG:4326" :center="[116.3909, 39.9148]" :zoom="8">
      <mapgis-igs-doc-layer v-bind="$props" />
      <mapgis-base-table
          :dataSource="dataSource"
          :pagination="pagination"
          :columns="columns"
          @pageChanged="pageChanged"
          @sorted="sorted"
          @selected="selected"
          @selectAll="selectAll"
          @delete="deleteRow"
          @edited="edited"
          @fullScreen="fullScreen"
          @originScreen="originScreen"
      >
      </mapgis-base-table>
      <mapgis-feature-service @loaded="serviceLoaded" :url="serviceUrl"/>
    </mapgis-web-map>
  `,
  data(){
    return {
      service: '',
      columns: [],
      dataSource: [],
      pagination:{
        total:0,
        pageSize:10
      },
      serviceUrl: "http://develop.smaryun.com:6163/igs/rest/mrfs/docs/Hubei3857"
    }
  },
  mounted() {
  },
  methods:{
    //获取数据
    getData(type){
      let vm = this;
      let sql = new SQLParameter({
        layers: "2",
        where: '',
        pageIndex: 0,
        pagination: 10
      })
      //获取数据
      if(type === "zondy"){
        //zondy格式
        vm.service.$_queryBySQL(sql,function (result) {
          console.log("result",result)
          vm.dataSource = result;
          vm.pagination.total = result.TotalCount;
        },function () {
          
        })
      }
    },
    //要素服务加载完毕事件
    serviceLoaded(service){
      this.service = service;
      this.getData('zondy');
    },
    //table加载完毕事件
    handleCreated(table){
      this.table = table;
    },
    //编辑完成事件
    edited(index,key,value,row,allRow){
      console.log("编辑完成",index,key,value,row,allRow)
    },
    //取得表格里的数据
    getTableData(){
      alert("数据已取出，并在控制台打印")
      console.log("表格里的属性数据：",this.table)
      console.log("表格里的属性数据：",this.table.$_getDataSource())
      console.log("表格里的所有数据：",this.table.$_getAllAttrData())
    },
    deleteRow(OID,row){
      console.log(OID,row)
    },
    clk(index,key,value,row,allRow){
      console.log(index,key,value,row,allRow)
    },
    pageChanged(pagination,sorter){
      let vm = this;
      //默认降序
      let isAsc = false;
      if(sorter.order === "ascend"){
        isAsc = true;
      }else if(sorter.order === "") {
        sorter.columnKey = "";
      }
      let sql = vm.service.$_getSQLParameter({
        layers: "2",
        where: '',
        pageIndex: pagination.current - 1,
        pagination: pagination.pageSize,
        orderBy: sorter.columnKey,
        isAsc: isAsc
      })
      vm.service.$_queryBySQL(sql,function (result) {
        console.log("result",result)
        vm.dataSource = result;
      })
    },
    sorted(){},
    selected(){},
    selectAll(){},
    fullScreen(){},
    originScreen(){}
  }
});

export const Doc = Template.bind({});
Doc.args = {
  layerId: "igs_layer_layerid",
  sourceId: "igs_layer_sourceid",
  domain: "http://develop.smaryun.com:6163",
  serverName: "北京市"
};

