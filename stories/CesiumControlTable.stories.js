import {G3D} from "@mapgis/webclient-es6-service"
window.G3D = G3D;
export default {
  title: "三维/交互-表格",
  argTypes: {
  }
};

const Template = (args, { argTypes }) => ({
  test:argTypes,
  props: Object.keys(argTypes),
  template: `
    <mapgis-web-scene style="height: 800px">
    <mapgis-3d-igs-m3d :url="url"> </mapgis-3d-igs-m3d>
    <mapgis-3d-table
        :dataSource="dataSource"
        :pagination="pagination"
        @pageChanged="pageChanged"
        @selectAll="selectAll"
        @fullScreen="fullScreen"
        @originScreen="originScreen"
        @edited="edited"
        @click="click"
        @deleted="deleted"
        @sorted="sorted"
        @selected="selected"
    ></mapgis-3d-table>
    </mapgis-web-scene>
  `,
  data(){
    return {
      url: 'http://develop.smaryun.com:6163/igs/rest/g3d/ModelM3D',
      dataSource: undefined,
      pagination:{
        total:0,
        pageSize:10
      },
      show: false
    }
  },
  mounted() {
    this.getData();
  },
  methods:{
    getData(){
      let vm = this;
      let inter = setInterval(function () {
        if(CesiumZondy.Query){
          clearInterval(inter);
          vm.query("0",10);
        }
      },20);
    },
    query(page,pageCount,orderField,isAsc){
      let vm = this;
      //初始化参数对象
      let queryParam = new Zondy.Catalog.G3DMapDoc();
      //查询图层的URL路径
      queryParam.gdbp = "gdbp://MapGisLocal/示例数据/ds/三维示例/sfcls/景观_模型";
      //设置查询结果结构
      queryParam.structs = {'IncludeAttribute':true,'IncludeGeometry':false,'IncludeWebGraphic':false};
      //属性查询
      queryParam.where = "";
      //分页信息
      queryParam.page = page;
      queryParam.pageCount = pageCount;
      //服务器的ip
      queryParam.ip = "develop.smaryun.com"
      queryParam.port = "6163";
      //排序设置
      queryParam.orderField = orderField ? orderField : "";
      queryParam.isAsc = isAsc ? isAsc : false;
      //查询服务
      queryParam.GetFeature(function(result) {
        console.log("result",result)
        vm.dataSource = result;
        vm.pagination.total = result.TotalCount;
      }, function(e) {
        console.log("e",e)
      });
    },
    pageChanged(pagination, sorter){
      //分页事件
      console.log("pageChanged",pagination)
      this.query(pagination.current - 1,pagination.pageSize,sorter.orderField,sorter.isAsc);
    },
    selectAll(selectData){
      //全选事件
      console.log("selectAll",selectData);
    },
    selected(selectData,allDate){
      //选择单个数据事件
      console.log("selected",selectData);
      console.log("allDate",allDate);
    },
    fullScreen(pagination, sorter){
    },
    originScreen(pagination, sorter){
      //还原屏幕事件
      this.pagination.pageSize = pagination.pageSize;
      this.query(pagination.current - 1,pagination.pageSize,sorter.orderField,sorter.isAsc);
    },
    edited(result){
      //编辑完成事件
      console.log("edited",result)
    },
    click(result, key){
      //单击事件
      console.log("click",result, key)
    },
    deleted(result){
      //删除事件
      console.log("deleted",result)
    },
    sorted(sorter, pagination){
      //排序事件
      this.query(pagination.current - 1,pagination.pageSize,sorter.orderField,sorter.isAsc);
    }
  }
});

export const table = Template.bind({});
table.args = {
};

