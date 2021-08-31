import {VFeature, SQLParameter} from "../../mapboxgl/src/components/util";
import {polygonData} from "../component/geometry";

export default {
  title: "二维/基本表格",
  argTypes: {
    layerId: "igs_layer_layerid",
    sourceId: "igs_layer_sourceid",
    baseUrl: "http://develop.smaryun.com:6163/igs/rest/mrms/docs/北京市"
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  template: `
    <mapgis-web-map crs="EPSG:4326" :center="[116.3909, 39.9148]" :zoom="8">
      <mapgis-rastertile-layer layerId="tdt" url="http://t0.tianditu.com/DataServer?T=vec_c&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752" />
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
      //获取数据
      // this.query(0,10,undefined,undefined,true,"zondy");
      // this.query(0,10,undefined,undefined,true,"Feature");
      this.query(0,10,undefined,undefined,true,"Feature");
    },
    query(pageIndex,pagination,orderBy,isAsc,initial,type){
      let vm = this;
      let sql = new SQLParameter({
        layers: "1",
        where: '',
        pageIndex: pageIndex,
        pagination: pagination,
        orderBy: orderBy,
        isAsc: isAsc,
        IncludeGeometry: false
      })
      //zondy格式
      vm.service.$_queryBySQL(sql,function (result) {
        if(type === "zondy"){
          vm.dataSource = result;
        }else if(type === "Feature"){
          vm.dataSource = VFeature.fromQueryResult(result);
        }
        if(initial){
          vm.columns = [{
            title: "mpArea",
            key: "mpArea",
            checked: true
          },{
            title: "mpPerimeter",
            key: "mpPerimeter",
            width: 120,
            checked: true
          },{
            title: "mpLayer",
            key: "mpLayer",
            width: 120,
            checked: true
          }];
          vm.pagination.total = result.TotalCount;
        }
      },function () {})
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
    edited(row){
      console.log("编辑完成",row);
    },
    deleteRow(OID,row){
      console.log(OID,row)
    },
    pageChanged(pagination,sorter){
      //默认降序
      let isAsc = false;
      if(sorter.order === "ascend"){
        isAsc = true;
      }else if(sorter.order === "") {
        sorter.columnKey = "";
      }
      // this.query(pagination.current - 1,pagination.pageSize,sorter.columnKey,isAsc,false,"zondy");
      this.query(pagination.current - 1,pagination.pageSize,sorter.columnKey,isAsc,false,"Feature");
    },
    sorted(sorter,pagination){
      //默认降序
      let isAsc = false;
      if(sorter.order === "ascend"){
        isAsc = true;
      }else if(sorter.order === "") {
        sorter.columnKey = "";
      }
      // this.query(pagination.current - 1,pagination.pageSize,sorter.columnKey,isAsc,false,"zondy");
      this.query(pagination.current - 1,pagination.pageSize,sorter.columnKey,isAsc,false,"Feature");
    },
    selected(row,selectRows){
      console.log("选择一行",row);
      console.log("已选择数据",selectRows);
    },
    selectAll(selectRows){
      console.log("已选择数据",selectRows);
    },
    fullScreen(){},
    originScreen(){}
  }
});

export const Doc = Template.bind({});
Doc.args = {
  layerId: "igs_layer_layerid",
  sourceId: "igs_layer_sourceid",
  baseUrl: "http://develop.smaryun.com:6163/igs/rest/mrms/docs/北京市"
};

