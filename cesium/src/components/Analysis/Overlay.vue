<template>
	<div>
		<slot>
			<div class="mapgis-widget-overlay-analysis">
				<mapgis-ui-group-tab title="叠加参数设置" id="title-space"/>
				<mapgis-ui-form-model v-bind="formItemLayout" :layout="layout" labelAlign="left" :colon="false">
					<!-- 2.叠加参数设置 -->
					<!-- <mapgis-ui-space>叠加参数设置</mapgis-ui-space> -->
					<mapgis-ui-form-model-item label="叠加方式">
						<mapgis-ui-select v-model="selectedOverType" :placeholder=overType[1].name @change="selectCurrentMethod($event)">
							<mapgis-ui-select-option v-for="(item, index) in overType" :key="index" :value="item.typeValue">{{item.name}}</mapgis-ui-select-option>
						</mapgis-ui-select>
					</mapgis-ui-form-model-item>
					<mapgis-ui-form-model-item label="容差半径">
						<mapgis-ui-input-number autoWidth v-model="radius"></mapgis-ui-input-number>
					</mapgis-ui-form-model-item>
					<mapgis-ui-form-model-item label="图层样式">
						<mapgis-ui-select v-model="selectedInfoOptType" :placeholder=infoOptType[1].name @change="selectCurrentPar($event)">
							<mapgis-ui-select-option v-for="(item, index) in infoOptType" :key="index" :value="item.typeValue">{{item.name}}</mapgis-ui-select-option>
						</mapgis-ui-select>
					</mapgis-ui-form-model-item>
					<mapgis-ui-checkbox :default-checked="attOptType" v-model="attOptType" style="line-height:32px;">进行属性操作</mapgis-ui-checkbox>
					<br>
					<mapgis-ui-checkbox :default-checked="isValidReg" v-model="isValidReg" style="line-height:32px;">检查区合法性</mapgis-ui-checkbox>
					<!-- 3.输出结果 -->
					<!-- <mapgis-ui-space>输出结果</mapgis-ui-space> -->
					<mapgis-ui-group-tab title="输出结果" id="title-space" :hasBottomMargin="false"/>
					<mapgis-ui-form-model-item>
						<mapgis-ui-row>
							<mapgis-ui-col :span=24>
								<mapgis-ui-input v-model="destLayer"></mapgis-ui-input>
							</mapgis-ui-col>				
						</mapgis-ui-row>
						<mapgis-ui-checkbox style="line-height:32px;" :default-checked="overlayAdd" @change="sendOverlayAdd">将结果图层添加到视图中</mapgis-ui-checkbox>
					</mapgis-ui-form-model-item>
				</mapgis-ui-form-model>
				<mapgis-ui-setting-footer>
					<mapgis-ui-button type="primary" @click="run">分析</mapgis-ui-button>
					<mapgis-ui-button @click="cancel">重置</mapgis-ui-button>
				</mapgis-ui-setting-footer>
			</div>
		</slot>
	</div>
</template>

<script>
import { MRCS, MRFWS } from '@mapgis/webclient-es6-service'
const { OverlayByLayer, OverlayByPolygon } = MRFWS

export default {
	name: "mapgis-3d-analysis-overlay",
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
				return {}
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
				return {}
			}
		},
	},
	data() {
		return {
			overType: [
				{"name": "求并", "type": "Ovly_Union", "typeValue": 0},
				{"name": "求交", "type": "Ovly_Inter", "typeValue": 1},
				{"name": "求减（差）", "type": "Ovly_Sub", "typeValue": 2},
				{"name": "内裁（交）", "type": "Ovly_InClip", "typeValue": 3},
				{"name": "外裁（差）", "type": "Ovly_OutClip", "typeValue": 4},
				{"name": "叠加", "type": "Ovly_Overlay", "typeValue": 5},
				{"name": "对称差", "type": "Ovly_SymDiff", "typeValue": 6},
				{"name": "判别", "type": "Ovly_Ident", "typeValue": 7},
			],
			selectedOverType: 1,  // 叠加分析类型，取值0-7，默认为1 Ovly_Inter
			radius: 0.001,  // 容差半径 Number
			infoOptType: [
				{"name": "使用随机图层样式", "type": "RandomInfo", "typeValue": 0},
				{"name": "使用图层1（被叠加对象）的图层样式", "type": "UsesAInfo", "typeValue": 1},
				{"name": "使用图层2（叠加对象）的图层样式", "type": "UsesBInfo", "typeValue": 2},
			],
			selectedInfoOptType: 1,  // 图形参数操作，取值0-2，默认为1 UsesAInfo
			attOptType: true,  // 是否进行属性操作，0不允许 1允许，默认为1 Number
			isValidReg: false,  // 检查区合法性，false true，默认为false
			destLayer: '',
			overlayAdd: true,  // 结果添加到地图文档，默认为true
		}
	},
	watch: {
		srcALayer(val, oldval) {
			if(val != oldval) {
				this.destLayer = val + this.currentTime()
			}
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
			this.$emit('load', this);
		},
		unmount() {
		},
		selectCurrentMethod(event) {
			this.selectedOverType = event
		},
		selectCurrentPar(event) {
			this.selectedInfoOptType = event
		},
		sendOverlayAdd() {
			this.overlayAdd = !this.overlayAdd;
		},
		currentTime() {
			const now = new Date();
			let hh = String(now.getHours());
			let mm = String(now.getMinutes());
			let ss = String(now.getSeconds());
			if (hh.length == 1)
				hh = `0${hh}`
			if (mm.length == 1) 
				mm = `0${mm}`
			if (ss.length == 1) 
				ss = `0${ss}`
			return `overlay${hh}${mm}${ss}`
  	},
		run() {
			this.$emit("listenOverlayAdd", this.overlayAdd)
			if (this.srcType == "Layer") {
				var overlayLayer = new OverlayByLayer({
					ip: this.baseUrl.split('/')[2].split(':')[0],
					port: this.baseUrl.split('/')[2].split(':')[1],
					overType: this.selectedOverType,
					radius: Number(this.radius),
					infoOptType: this.selectedInfoOptType,
					attOptType: Number(this.attOptType),
					isValidReg: this.isValidReg,
					srcInfo1: this.srcALayer,
					srcInfo2: this.srcBLayer,
					desInfo: this.destLayer,
				})
				overlayLayer.execute(this.AnalysisSuccess, 'post', false, 'json', () => {
					console.log("叠加分析失败!")
				})
			} else if (this.srcType == "Feature") {
				var overlayFeature = new OverlayByPolygon({
					ip: this.baseUrl.split('/')[2].split(':')[0],
					port: this.baseUrl.split('/')[2].split(':')[1],
					overType: this.selectedOverType,
					radius: Number(this.radius),
					infoOptType: this.selectedInfoOptType,
					attOptType: Number(this.attOptType),
					isValidReg: this.isValidReg,
					srcInfo1: this.srcALayer,
					desInfo: this.destLayer
				})
				var polygonList = this.transformToPoint(this.srcAFeature)
				var anyLineList = this.transformToAnyLine(polygonList);
				var gReg = new Zondy.Object.GRegion(anyLineList);
				overlayFeature.strGRegionXML = JSON.stringify(gReg)
				overlayFeature.execute(this.AnalysisSuccess, 'post', false, 'json', () => {
					console.log("叠加分析失败!")
				})
			}
		},
		// 将一张图的当前结果集GeoJSON数据转化为点集数组
		transformToPoint(geojson) {
			var polygonList = []
			for(var i = 0; i < geojson.features.length; i ++) {
				if(geojson.features[i].geometry.type == "Polygon") {
					var tempPolygon = geojson.features[i].geometry.coordinates[0]
					polygonList.push(tempPolygon)
				}
			}
			return polygonList
		},
		// 将点集数组转化为MapGIS区要素几何图形信息类
		transformToAnyLine(pointList) {
			var anyLineList = []
			for(var k = 0; k < pointList.length; k ++) {
				var arcPointList = []
				for(var i = 0; i < pointList[k].length; i ++) {
					var point = new Zondy.Object.Point2D(pointList[k][i][0], pointList[k][i][1])
					arcPointList.push(point)
				}
				var arc = new Zondy.Object.Arc(arcPointList)
				var anyLine = new Zondy.Object.AnyLine([arc])
				anyLineList.push(anyLine)
			}
			return anyLineList
		},
		cancel() {
			Object.assign(this.$data, this.$options.data());
		},
		AnalysisSuccess(data) {
			console.log('----------叠加分析成功--------------')
			this.$emit("listenLayer", this.destLayer)
		},
	},
	computed: {
    formItemLayout({layout}) {
      return layout === "horizontal"
          ? {
            labelCol: {span: 6},
            wrapperCol: {span: 17}
          }
          : {};
    },
  },
}
</script>


<style scoped>
.mapgis-widget-overlay-analysis {
	height: auto;
}
.mapgis-ui-form-item {
	/* width: 300px; */
	margin: 0px;
}
.mapgis-ui-row.mapgis-ui-form-item {
  /* margin: 10px 0px 10px 0px; */
}
.mapgis-ui-form-item-control {
	/* width: 214px;
	text-align: left;
	line-height: 40px;
	overflow: hidden; */
}
</style>