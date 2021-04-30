<template>
  <div>
    <div class="menuLeft" @click="chooseQuery('where')">仅SQL查询</div>
    <div class="menuLeft" style="left:80px;" @click="chooseQuery('point')">单点</div>
    <div class="menuLeft" style="left:115px;" @click="chooseQuery('polyline')">单线</div>
    <div class="menuLeft" style="left:150px;" @click="chooseQuery('polygon')">单个多边形</div>
    <div class="menuLeft" style="left:230px;" @click="chooseQuery('multiPolygon')">多个多边形</div>
    <div class="menuLeft" style="left:310px;" @click="chooseQuery('objectIds')">objectIds</div>
    <div class="menuLeft" style="left:375px;" @click="chooseQuery('bbox')">bbox查询</div>
    <div class="menuLeft" style="left:440px;" @click="chooseQuery('add')">添加要素</div>
    <div class="menuLeft" style="left:500px;" @click="chooseQuery('update')">更新要素</div>
    <div class="menuLeft" style="left:560px;" @click="chooseQuery('delete')">删除要素</div>
    <div class="queryParameters">
      <div v-for="(value,name) in queryParameters" v-if="name !== 'where' && name !== 'geometry' && name !== 'objectIds' && name !== 'rectangle'" >
        <div class="attr">
          {{name}}: <input type="text" v-model="queryParameters[name]">
        </div>
      </div>
    </div>

    <div class="menuRight" v-show="type==='where'">
      查询语句 <br>
      where <input v-model="where" type="text"> <br>
      查询图层<input type="text" v-model="layer"> <br>
      <button @click="query" type="button">查询</button>
    </div>
    <div class="menuRight" v-show="type==='bbox'">
      bbox <input v-model="bbox" type="text"> <br>
      where <input v-model="where" type="text"> <br>
      查询图层<input type="text" v-model="layer"> <br>
      <button @click="queryRect" type="button">查询</button>
    </div>
    <div class="menuRight" v-show="type==='point'">
      查询图层<input type="text" v-model="layer"> <br>
      点<input type="text" v-model="point"> <br>
      where <input v-model="where" type="text"> <br>
      <button @click="queryPoint" type="button">点查询</button>
    </div>
    <div class="menuRight" v-show="type==='polyline'">
      查询图层<input type="text" v-model="layer"> <br>
      线<input type="text" v-model="polyline"> <br>
      where <input v-model="where" type="text"> <br>
      <button @click="queryPolyline" type="button">线查询</button>
    </div>
    <div class="menuRight" v-show="type==='polygon'">
      查询图层<input type="text" v-model="layer"> <br>
      多边形<input type="text" v-model="polygon"> <br>
      where <input v-model="where" type="text"> <br>
      <button @click="queryPolygon" type="button">多边形查询</button>
      <button @click="updateFeatures" type="button">更新要素</button>
    </div>
    <div class="menuRight" v-show="type==='multiPolygon'">
      查询图层<input type="text" v-model="layer"> <br>
      多个多边形<input type="text" v-model="polygon"> <br>
      where <input v-model="where" type="text"> <br>
      <button @click="queryMultiPolygon" type="button">多个多边形查询</button>
    </div>
    <div class="menuRight" v-show="type==='objectIds'">
      查询图层<input type="text" v-model="layer"> <br>
      objectIds<input type="text" v-model="objectIds">
      <button @click="queryByObjectIds" type="button">objectIds查询</button>
    </div>
    <div class="menuRight" v-show="type==='add'">
      要添加的图层<input type="text" v-model="layer"> <br>
      <button @click="addPoint" type="button">添加点要素</button>
      <button @click="addPolyline" type="button">添加线要素</button>
      <button @click="addPolygon" type="button">添加几何要素</button>
      <button @click="addMultiPolygon" type="button">添加多个几何要素</button>
    </div>
    <div class="menuRight" v-show="type==='delete'">
      要删除的图层<input type="text" v-model="layer"> <br>
      要删除的要素id<input type="text" v-model="objectIds"> <br>
      <button @click="deleteFeaturesInput" type="button">通过输入框删除要素</button>
      <button @click="deleteFeatures" type="button">通过画图删除要素</button>
    </div>
    <div class="menuRight" v-show="type==='update'">
      要更新的图层<input type="text" v-model="layer"> <br>
      <button @click="updateFeatures" type="button">更新要素</button>
    </div>
    <div class="features">
      <div v-for="feature in featureArr" :key="feature.FID" @click="show(feature.FID)">
        <div class="feature">{{feature.attributes.Name}} - {{feature.FID}}</div>
        <div class="fAtt" v-show="FID === feature.FID">
          <div class="attr" v-for="(value,name) in feature.attributes">
            <p>{{ name }}</p>
            <p><input type="text" v-model="feature.attributes[name]"></p>
          </div>
        </div>
      </div>
    </div>
    <base-draw
        position="top-left"
        v-bind:controls="controls"
        v-on:added="handleAdded"
        v-on:drawcreate="handleCreate"
        ref="draw"
    >
      <div id="toolbar-wrapper1">
        <div class="toolbar-item" v-on:click="togglePoint">画点</div>
        <div class="toolbar-item" v-on:click="togglePolyline">画线</div>
        <div class="toolbar-item" v-on:click="togglePolygon">画区</div>
        <div class="toolbar-item" v-on:click="toggleDelete">删除</div>
      </div>
    </base-draw>
  </div>
</template>

<script>
import featureService from "../../mapboxgl/src/components/map/mixins/FeatureService";
import {RectangleParameter,SQLParameter,
  ObjectIdsParameter,Point,GeometryParameter,Polyline,Polygon,MultiPoint,Feature,MultiPolygon} from "../../mapboxgl/src/components/util"
import BaseDraw from "../../mapboxgl/src/components/UI/controls/draw/BaseDraw"
import {pointData,polylineData,polygonData,multiPolygonData} from "./geometry";

export default {
  name: "mapgis-test-layer",
  mixins: [featureService],
  components: {BaseDraw},
  inject:["map"],
  props:{
    url: {
      type: String
    }
  },
  data(){
    return {
      where:"",
      MapUrl:this.$props.url,
      type:"where",
      polygon:"",
      polyline:"",
      point:"",
      objectIds:"",
      layer:"0",
      bbox: "113.929565834003,30.3803471073974,114.087823337592,30.5106768162356",
      controls: {
        point: false,
        line_string: false,
        polygon: false,
        trash: false,
        combine_features: false,
        uncombine_features: false
      },
      featureArr:"",
      FID:"",
      queryParameters: ""
    }
  },
  created() {
  },
  mounted() {
    let vm = this;
    this.$watch("layer",function () {
      if(vm.queryParameters){
        vm.queryParameters.layers = vm.layer;
      }
    })
  },
  methods: {
    addPoint(){
      // let pt = new Point({
      //   coordinates: [114.57,30.59]
      // });
      // let feature = new Feature({
      //   geometry: pt,
      //   attributes:{
      //     Name: "test111111"
      //   }
      // });
      // let features = [feature];
      let features = Feature.fromGeoJSON(pointData);
      this.$_add(features,this.layer,function (result) {
        console.log(result);
      },function () {
        console.log("添加失败")
      });
    },
    addPolyline(){
      // let polyline = new Polyline({
      //   coordinates: [[114.22,31.11],[114.33,31.17],[114.44,31.15]]
      // });
      // let feature = new Feature({
      //   geometry: polyline,
      //   attributes:{
      //     Name: "testPolyline"
      //   }
      // });
      // let features = [feature];
      let features = Feature.fromGeoJSON(polylineData);
      this.$_add(features,this.layer,function (result) {
        console.log(result);
      },function () {
        console.log("添加失败")
      });
    },
    addPolygon(){
      // let polygon = new Polygon({
      //   exterior: [[114.2956565234,30.778158233096],[114.2956565234,30.9312439228424],[114.526664208378,30.9312439228424],[114.526664208378,30.778158233096],[114.2956565234,30.778158233096]],
      //   interior: [[[114.329356317798,30.8527047152595],[114.36031058139,30.8527047152595],[114.36031058139,30.8818201117078],[114.329356317798,30.8818201117078],[114.329356317798,30.8527047152595]],
      //   [[114.423751497862,30.8566889274051],[114.457157584313,30.8566889274051],[114.457157584313,30.8695609974138],[114.423751497862,30.8695609974138],[114.423751497862,30.8566889274051]]]
      // });
      // let feature = new Feature({
      //   geometry: polygon,
      //   attributes:{
      //     Name: "tewewewqrwer"
      //   }
      // });
      // let features = [feature];
      let features = Feature.fromGeoJSON(polygonData);
      console.log(features)
      this.$_add(features,this.layer,function (result) {
        console.log(result);
      },function () {
        console.log("添加失败")
      });
    },
    addMultiPolygon(){
      // let polygon1 = new Polygon({
      //   exterior: [[113.73,30.41],[113.77,30.42],[113.73,30.39],[113.73,30.41]]
      // });
      // let polygon2 = new Polygon({
      //   exterior: [[113.86,30.40],[113.91,30.38],[113.83,30.38],[113.86,30.40]]
      // });
      // let polygon = new MultiPolygon({
      //   polygons: [polygon1,polygon2]
      // });
      // let feature = new Feature({
      //   geometry: polygon,
      //   attributes:{
      //     Name: "testPolygonMMMMMMM"
      //   }
      // });
      // let features = [feature];
      let features = Feature.fromGeoJSON(multiPolygonData);
      this.$_add(features,this.layer,function (result) {
        console.log(result);
      });
    },
    updateFeatures(){
      // let feature = new Feature({
      //   attributes:{
      //     Name: "testPolygonTTTT"
      //   },
      //   FID:171
      // });
      // let features = [feature];
      this.$_update(this.featureArr,this.layer,function (result) {
        console.log("更新成功",result);
      },function () {
        console.log("更新失败");
      });
    },
    deleteFeaturesInput(){
      let OID = this.objectIds.split(",");
      this.$_delete(OID,this.layer,function (result) {
        console.log(result);
      });
    },
    deleteFeatures(){
      let OID = [];
      for (let i = 0;i < this.featureArr.length;i++){
        OID.push(this.featureArr[i].FID);
      }
      this.$_delete(OID,this.layer,function (result) {
        console.log(result);
      });
    },
    chooseQuery(type){
      this.queryParameters = "";
      // this.toggleDelete();
      this.type = type;
    },
    queryRect(){
      let vm = this,layer = this.layer.split(",");
      for (let i = 0;i < layer.length;i++){
        if(layer[i].indexOf("gdbp") <= -1){
          layer[i] = Number(layer[i]);
        }
      }
      let rect = new RectangleParameter({
        layers:layer,
        where: this.where,
        rectangle: this.bbox.split(",")
      });
      if(this.queryParameters === ""){
        this.queryParameters = rect;
      }
      this.$_queryByRectangle(this.queryParameters,function (result) {
        console.log(result)
        vm.addLayer(result);
        vm.featureArr = Feature.fromQueryResult(result)
        console.log("features",vm.featureArr)
      })
    },
    queryByObjectIds() {
      let vm = this;
      let layer = vm.layer.split(",");
      for (let i = 0;i < layer.length;i++){
        if(layer[i].indexOf("gdbp") <= -1){
          layer[i] = Number(layer[i]);
        }
      }
      let ids = new ObjectIdsParameter({
        layers:layer,
        objectIds: vm.objectIds.split(",")
      });
      if(this.queryParameters === ""){
        this.queryParameters = ids;
      }
      this.$_queryByObjectIds(this.queryParameters,function (result) {
        vm.addLayer(result);
        vm.featureArr = Feature.fromQueryResult(result)
        console.log("features",vm.featureArr)
      });
    },
    queryPolygon(){
      let vm = this;
      let layer = vm.layer.split(",");
      for (let i = 0;i < layer.length;i++){
        if(layer[i].indexOf("gdbp") <= -1){
          layer[i] = Number(layer[i]);
        }
      }
      let geom = new GeometryParameter({
        layers:layer,
        where: vm.where
      });
      console.log("vm.polygon",vm.polygon)
      geom.fromGeoJSON(vm.polygon);
      if(this.queryParameters === ""){
        this.queryParameters = geom;
      }
      this.$_queryByGeometry(this.queryParameters,function (result) {
        vm.addLayer(result);
        vm.featureArr = Feature.fromQueryResult(result)
        console.log("features",vm.featureArr)
      },function (result) {
        console.log("查询失败")
      });
    },
    queryPolyline(){
      let vm = this;
      let layer = vm.layer.split(",");
      for (let i = 0;i < layer.length;i++){
        if(layer[i].indexOf("gdbp") <= -1){
          layer[i] = Number(layer[i]);
        }
      }
      let geom = new GeometryParameter({
        layers:layer,
        where: vm.where
      });
      geom.fromGeoJSON(vm.polyline);
      if(this.queryParameters === ""){
        this.queryParameters = geom;
      }
      this.$_queryByGeometry(this.queryParameters,function (result) {
        vm.addLayer(result);
        vm.featureArr = Feature.fromQueryResult(result)
        console.log("features",vm.featureArr)
      });
    },
    queryPoint(){
      let vm = this,pt;
      let layer = vm.layer.split(",");
      for (let i = 0;i < layer.length;i++){
        if(layer[i].indexOf("gdbp") <= -1){
          layer[i] = Number(layer[i]);
        }
      }
      let geom = new GeometryParameter({
        layers:layer,
        where: vm.where
      });
      geom.fromGeoJSON(vm.point);
      if(this.queryParameters === ""){
        this.queryParameters = geom;
      }
      this.$_queryByGeometry(this.queryParameters,function (result) {
        vm.addLayer(result);
        vm.featureArr = Feature.fromQueryResult(result)
        console.log("features",vm.featureArr)
      });
    },
    queryMultiPolygon: function () {
      let vm = this;
      let layer = vm.layer.split(",");
      for (let i = 0;i < layer.length;i++){
        if(layer[i].indexOf("gdbp") <= -1){
          layer[i] = Number(layer[i]);
        }
      }
      let polygon1 = new Polygon({
        exterior:[[114.22,31.11],[114.33,31.17],[114.44,31.15],[114.22,31.11]]
      })
      let polygon2 = new Polygon({
        exterior:[[114.12,30.81],[114.22,30.85],[114.36,30.84],[114.12,30.81]]
      })
      let multiPolygon = new MultiPolygon({
        polygons: [polygon1,polygon2]
      });
      let geom = new GeometryParameter({
        layers:layer,
        geometry: multiPolygon,
        where: vm.where
      });
      if(this.queryParameters === ""){
        this.queryParameters = geom;
      }
      this.$_queryByGeometry(this.queryParameters,function (result) {
        vm.addLayer(result);
        vm.featureArr = Feature.fromQueryResult(result)
        console.log("features",vm.featureArr)
      });
    },
    query: function() {
      let vm = this;
      let layer = vm.layer.split(",");
      for (let i = 0;i < layer.length;i++){
        if(layer[i].indexOf("gdbp") <= -1){
          layer[i] = Number(layer[i]);
        }
      }
      let sql = new SQLParameter({
        layers:layer,
        where: vm.where
      });
      if(this.queryParameters === ""){
        this.queryParameters = sql;
      }
      this.$_queryBySQL(this.queryParameters,function (result) {
        vm.addLayer(result);
        vm.featureArr = Feature.fromQueryResult(result)
        console.log("features",vm.featureArr)
      });
    },
    addLayersWFS(data,layerId,type,colorFill,coloOut){
      if(this.map.getLayer(layerId)){
        this.map.removeLayer(layerId);
        this.map.removeSource(layerId);
      }
      let reg = [];
      for (let i = 0;i < data.length;i++){
        if(data[i].Reg){
          if(type === "MultiLineString"){
            reg.push(data[i].Reg);
          }else {
            reg.push([data[i].Reg]);
          }
        }
      }
      let features = [];
      let feature = {
        "type": "Feature",
        "geometry": {
          "type": type,
          "coordinates": reg
        }
      }
      features.push(feature);
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
        "id": layerId,
        //指定类型为fill（填充区域）
        "type": "fill",
        //设置数据来源
        "source": source,
        //设置绘制参数
        "paint": {
          //设置填充颜色
          "fill-color": colorFill,
          //设置透明度
          "fill-opacity": 0.5,
          "fill-outline-color": coloOut
        }
      });
    },
    addLayer(result){
      if(!result.SFEleArray){
        console.log("未查询到数据")
      }else if(result.SFEleArray[0].fGeom.LinGeom.length > 0){
        console.log("查询成功，数据为：",result);
        this.addLayerLine(result);
      }else if(result.SFEleArray[0].fGeom.PntGeom.length > 0){
        console.log("查询成功，数据为：",result);
        this.addLayerPoint(result);
      }else if(result.SFEleArray[0].fGeom.RegGeom.length > 0){
        console.log("查询成功，数据为：",result);
        this.addLayerPolygon(result);
      }
    },
    addLayerPoint(result){
      if(this.map.getLayer("highlayer")){
        this.map.removeLayer("highlayer");
        this.map.removeSource("highlayer");
      }
      let SFEleArray = result.SFEleArray;
      let features = [];
      for(let i = 0;i < SFEleArray.length;i++){
        let Dots = result.SFEleArray[i].fGeom.PntGeom[0].Dot;
        let feature = {
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [Dots.x,Dots.y]
          }
        };
        features.push(feature);
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
    addLayerLine(result){
      if(this.map.getLayer("highlayer")){
        this.map.removeLayer("highlayer");
        this.map.removeSource("highlayer");
      }
      let SFEleArray = result.SFEleArray;
      let features = [];
      for (let i = 0;i < SFEleArray.length;i++){
        let Dots = SFEleArray[i].fGeom.LinGeom[0].Line.Arcs[0].Dots;
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
    addLayerPolygon(result){
      if(this.map.getLayer("highlayer")){
        this.map.removeLayer("highlayer");
        this.map.removeSource("highlayer");
      }
      //获取查询到的结果数组,ploygonArr的个数即为查询到的结果数
      let ploygonArr = result.SFEleArray,vm = this;
      let features = [];
      for (let i = 0; i < ploygonArr.length; i++) {
        //获取要素几何数组
        let Rings = ploygonArr[i].fGeom.RegGeom[0].Rings;
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
    handleAdded(e, data){
      let { drawer, map } = e;
      this.drawer = drawer;
      console.log(this.drawer)
    },
    handleCreate(e){
      let vm = this;
      console.log('create', e);
      this.queryParameters = "";
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
    togglePoint(e){
      this.type = "point";
      this.enableDrawer();
      this.drawer && this.drawer.changeMode('draw_point');
    },
    enableDrawer() {
      const component = this.$refs.draw;
      if (component) {
        component.enableDrawer();
      }
    },
    togglePolyline(){
      this.type = "polyline";
      this.enableDrawer();
      this.drawer && this.drawer.changeMode('draw_line_string');
    },
    togglePolygon(){
      this.type = "polygon";
      this.enableDrawer();
      this.drawer && this.drawer.changeMode('draw_polygon');
    },toggleDelete() {
      this.featureArr = "";
      this.queryParameters = "";
      this.drawer && this.drawer.deleteAll();
      if(this.map.getLayer("highlayer")){
        this.map.removeLayer("highlayer");
        this.map.removeSource("highlayer");
      }
    },
    show(FID){
      this.FID = FID
    }
  }
}
</script>

<style scoped>
.menuLeft{
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100;
  color: white;
  cursor: pointer;
  font-size: 14px;
}
.menuRight{
  position: absolute;
  top: 0;
  right: 0;
  z-index: 100;
  color: white;
  cursor: pointer;
  font-size: 14px;
}
#toolbar-wrapper1 {
  position: absolute;
  z-index: 9999;
  display: inline-flex;
  overflow-x: hidden;
  overflow-y: visible;
  top: 20px;
  left: 20px;
}
.toolbar-item {
  background: #ffffff;
  border: 1px dashed #666666;
  text-align: center;
  font-size: 20px;
  line-height: 20px;
  height: fit-content;
  padding: 6px 16px;
  cursor: pointer;
}
.features{
  position: absolute;
  right: 0;
  top: 100px;
  z-index: 100;
  width: 300px;
  height: 400px;
  overflow-y: scroll;
  background: #999999;
  border: 1px solid black;
}
.feature{
  width: 100%;
  height: 20px;
  background: #bdbdbd;
  border: 1px solid #282727;
  cursor: pointer;
}
.fAtt{
  width: 100%;
  height: 200px;
  overflow-y: scroll;
}
.attr{
  width: 100%;
  height: 30px;
}
.attr > p{
  display: inline-block;
  margin: 6px;
}
.queryParameters{
  width: 330px;
  height: 300px;
  position: absolute;
  top: 100px;
  left: 0;
  background: #999999;
  z-index: 999;
  overflow-y: scroll;
}
</style>