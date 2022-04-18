<template>
	<div>
		<slot>
			<div class="mapgis-widget-buffer-analysis">
				<slot name="selectLayer" />
				<mapgis-ui-group-tab title="缓冲区参数设置" id="title-space"/>
				<!-- 要素级缓冲区分析UI面板 -->
				<mapgis-ui-form-model v-bind="formItemLayout" :layout="layout" labelAlign="left" :colon="false" v-if="srcType == 'Feature'">
					<mapgis-ui-form-model-item label="设置半径">
						<mapgis-ui-input-number autoWidth v-model=radius></mapgis-ui-input-number>
					</mapgis-ui-form-model-item>
					<mapgis-ui-form-model-item label="半径单位">
						<mapgis-ui-select v-model="selectedUnit" :placeholder=unit[0].name @change="selectCurrentUnit($event)">
							<mapgis-ui-select-option v-for="(item, index) in unit" :key="index" :value="item.unitParam">{{item.name}}</mapgis-ui-select-option>
						</mapgis-ui-select>
					</mapgis-ui-form-model-item>
					<!-- <mapgis-ui-select-panel label="半径单位" /> -->
					<!-- <mapgis-ui-form-model-item label="步长">
						<mapgis-ui-input v-model=steps></mapgis-ui-input>
					</mapgis-ui-form-model-item> -->
					<mapgis-ui-form-model-item label="轮廓宽度">
						<mapgis-ui-input-number-addon v-model=colorLineWidth></mapgis-ui-input-number-addon>
					</mapgis-ui-form-model-item>
					<mapgis-ui-color-pick-panel
						label="轮廓颜色"
						:color="colorCopyLine"
						:labelCol="24"
						:wrapperCol="24"
						:size="size"
						:disableAlpha="false"
						:colorStyle="colorStyle"
						@input="val =>
							(colorCopyLine = `rgba(${val.rgba.r}, ${val.rgba.g}, ${val.rgba.b}, ${val.rgba.a})`)"
					>
					</mapgis-ui-color-pick-panel>
					<mapgis-ui-color-pick-panel
						label="填充颜色"
						:color="colorCopyFill"
						:wrapperCol="24"
						:size="size"
						:disableAlpha="false"
						:colorStyle="colorStyle"
						@input="val =>
							(colorCopyFill = `rgba(${val.rgba.r}, ${val.rgba.g}, ${val.rgba.b}, ${val.rgba.a})`,
							colorCopyOpacity = `${val.rgba.a}`)"
					>
					</mapgis-ui-color-pick-panel>
					<mapgis-ui-group-tab title="输出结果" id="title-space" :hasBottomMargin="false"/>
					<!-- <mapgis-ui-form-model-item label="输出结果"> -->
					<mapgis-ui-form-model-item>
						<mapgis-ui-row>
							<mapgis-ui-col :span=24>
								<mapgis-ui-input v-model="destLayer"></mapgis-ui-input>
							</mapgis-ui-col>				
						</mapgis-ui-row>
						<mapgis-ui-checkbox style="line-height:32px;" :default-checked="bufferAdd" @change="sendBufferAdd">将结果图层添加到视图中</mapgis-ui-checkbox>
					</mapgis-ui-form-model-item>
				</mapgis-ui-form-model>
				<!-- 图层级缓冲区分析UI面板 -->
				<mapgis-ui-form-model v-bind="formItemLayout" :layout="layout" labelAlign="left" :colon="false" v-if="srcType == 'Layer'">
					<mapgis-ui-form-model-item label="缓冲半径">
						<mapgis-ui-radio-group v-model="isByAtt" :options='[{"label":"指定半径","value":false},{"label":"根据属性值","value":true}]'>
						</mapgis-ui-radio-group>
					</mapgis-ui-form-model-item>
					<mapgis-ui-form-model-item label="设置半径" v-show="!isByAtt">
						<mapgis-ui-row :gutter="8">
							<mapgis-ui-col :span="12">	
								<mapgis-ui-input-number-addon v-model=leftRad>
									<mapgis-ui-tooltip slot="addonBefore" title="左">
										<mapgis-ui-iconfont type="mapgis-zuo"/>
									</mapgis-ui-tooltip>
								</mapgis-ui-input-number-addon>			
							</mapgis-ui-col>
							<mapgis-ui-col :span="12">
								<mapgis-ui-input-number-addon v-model=rightRad>
									<mapgis-ui-tooltip slot="addonBefore" title="右">
										<mapgis-ui-iconfont type="mapgis-you"/>
									</mapgis-ui-tooltip>
								</mapgis-ui-input-number-addon>
							</mapgis-ui-col>
						</mapgis-ui-row>
						<mapgis-ui-checkbox style="line-height:32px;" :default-checked="equalLeftRight" v-model="equalLeftRight">左右等距</mapgis-ui-checkbox>
					</mapgis-ui-form-model-item>
					<mapgis-ui-form-model-item label="半径单位" v-show="!isByAtt">
						<mapgis-ui-select v-model="selectedUnit" :placeholder=unit[0].name @change="selectCurrentUnit($event)">
							<mapgis-ui-select-option v-for="(item, index) in unit" :key="index" :value="item.unitParam">{{item.name}}</mapgis-ui-select-option>
						</mapgis-ui-select>
					</mapgis-ui-form-model-item>
					<mapgis-ui-form-model-item label="选择字段" v-show="isByAtt">
						<mapgis-ui-select v-model="selectedFldName" :placeholder=fldName[0].FldName @change="selectAtt($event)">
							<mapgis-ui-select-option v-for="(item, index) in fldName" :key="index" :value="item.FldName">{{item.FldName}}</mapgis-ui-select-option>
						</mapgis-ui-select>
					</mapgis-ui-form-model-item>
					<mapgis-ui-form-model-item label="线端类型">
						<mapgis-ui-radio-group v-model="angelType" :options='[{"label":"圆头","value":false}, {"label":"平头","value":true}]'>
						</mapgis-ui-radio-group>
					</mapgis-ui-form-model-item>
					<mapgis-ui-form-model-item label="合并样式">
						<mapgis-ui-radio-group v-model="isDissolve" :options='[{"label":"合并", "value":true},{"label":"不合并", "value":false}]'>
						</mapgis-ui-radio-group>
					</mapgis-ui-form-model-item>
					<mapgis-ui-group-tab title="输出结果" id="title-space" :hasBottomMargin="false"/>
					<!-- <mapgis-ui-form-model-item label="输出结果"> -->
					<mapgis-ui-form-model-item>
						<mapgis-ui-row>
							<mapgis-ui-col :span=24>
								<mapgis-ui-input v-model="destLayer"></mapgis-ui-input>
							</mapgis-ui-col>				
						</mapgis-ui-row>
						<mapgis-ui-checkbox style="line-height:32px;" :default-checked="bufferAdd" @change="sendBufferAdd">将结果图层添加到视图中</mapgis-ui-checkbox>
					</mapgis-ui-form-model-item>
				</mapgis-ui-form-model>
			</div>
			<mapgis-ui-setting-footer>
				<mapgis-ui-button type="primary" @click="run">分析</mapgis-ui-button>
				<mapgis-ui-button @click="cancel">重置</mapgis-ui-button>
			</mapgis-ui-setting-footer>
		</slot>
	</div>
</template>

<script>
// 引入es6-service内置封装接口
import { MRCS, MRFWS } from '@mapgis/webclient-es6-service'
const { ClassBufferBySingleRing, FeatureBuffBySingleRing } = MRFWS
const { VectorLayer } = MRCS
// 引入第三方turf->buffer
import * as turf from '@turf/turf'
import { setDepthTestAgainstTerrainEnable } from '../WebGlobe/util'
import { Style } from "@mapgis/webclient-es6-service";
const { FillStyle } = Style;

export default {
	name: "mapgis-3d-analysis-buffer",
	inject: ["Cesium", "vueCesium", "viewer"],
	props: {
		/**
     * @type Object
     * @default {}
     * @description 组件样式
     */
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
     * @description 图层级缓冲 "Layer" 要素级缓冲 "Feature"
     */
		srcType: {
			type: String,
			default: "Feature"
		},
		/**
     * @type String
     * @default ""
     * @description 图层级缓冲 输入gdbp
     */
		srcLayer: {
			type: String,
			default: "gdbp://MapGISLocalPlus/sample/sfcls/等值线"
		},
		/**
     * @type Object
     * @default {}
     * @description 要素级缓冲 输入JSON
     */
		srcFeature: {
			type: Object,
			default: function() {
				return {}
			}
		},
	},
	data() {
		return {
      colorCopyFill: "rgba(255,0,0,1)",
      colorCopyLine: "rgba(255,0,0,1)",
			colorLineWidth: 3,
			colorCopyOpacity: 1,
      size: "default",
			colorStyle:{
				fontSize: '14px',
				// padding:"0 0 8px",
			},
			// 图层级半径缓冲
			isByAtt: false,
			leftRad: 100,
			rightRad: 100,			
			realLeftRad: 100,
			realRightRad: 100,
			equalLeftRight: true,
			// 图层级属性缓冲
			fldName: [{"FldName": "", "FldType": ""}],  
			selectedFldName: "UserID",
			angelType: false,
			isDissolve: true,
			// 要素级半径缓冲
			radius: 100,
			realRadius: 100,
			unit: [
				{"name": "米", "unitParam": "meters"},
				{"name": "千米", "unitParam": "kilometers"},
				{"name": "英里", "unitParam": "miles"},
				{"name": "度", "unitParam": "degrees"}
			],
			selectedUnit: "meters",
			// steps: 8,  
			destLayer: '',
			bufferAdd: true,
			// 监听组件内部缓冲状态，结束this.$emit("listenFinish", finish)
			finish: false,
		}
	},
	watch: {
		srcType(val, oldval) {
			if (val == "Feature") {
				this.destLayer = this.currentTime()
			} else {
				this.destLayer = this.srcLayer + this.currentTime()
			}
		},
		srcLayer(val, oldval) {
			if(val != oldval) {
				this.destLayer = val + this.currentTime()
				this.getAttribute()
			}
		},
		isByAtt(val, oldval) {
			if (val == true) {
				this.getAttribute()
			}
		},
		leftRad(val, oldval) {
			if (this.equalLeftRight == true) {
				this.rightRad = val
			}
		},
		rightRad(val, oldval) {
			if (this.equalLeftRight == true) {
				this.leftRad = val
			}
		},
		equalLeftRight(val, oldval) {
			if (oldval == false && val == true) {
				this.rightRad = this.leftRad
			}
		},
	},
	mounted() {
		this.mount();
	},
	destroyed() {
		this.unmount();
	},
	methods: {
		mount() {
			this.$emit('load',this);
			// 进行缓冲区分析前，优先关闭深度检测
      setDepthTestAgainstTerrainEnable(false, this.viewer);
		},
		unmount() {
			// this.destLayer = ''
		},
		sendBufferAdd() {
			this.bufferAdd = !this.bufferAdd;
		},
		// 查询IGServer，实现获取gdbp图层中的属性字段名称与类型
		getAttribute() {
			var vectorLayer = new VectorLayer({
				ip: (this.baseUrl || "").split('/')[2].split(':')[0],
				port: (this.baseUrl || "").split('/')[2].split(':')[1],
			})
			vectorLayer.getLayerInfo(this.srcLayer, this.onSuccess, () => {
				console.log("获取图层详细信息请求失败")
			})
		},
		onSuccess(data) {
			var tempFldName = []
			for(var i = 0; i < data.FieldAtt.FldName.length; i++) {
				var obj = {}
				obj.FldName = data.FieldAtt.FldName[i]
				obj.FldType = data.FieldAtt.FldType[i]
				tempFldName.push(obj)
			}
			this.fldName = tempFldName
		},
		selectAtt(event) {
			this.selectedFldName = event
		},
		selectCurrentUnit(event) {
			this.selectedUnit = event
		},
		convertRadUnit(currentRad, currentUnit) {
			const earthRadius = 6371.393;  // 地球半径, km
			switch(currentUnit) {
				case 'meters':
					// 米转度公式
					currentRad = (currentRad / 1000) * 180 / (Math.PI * earthRadius)
					break
				case 'kilometers':
					// 千米转度公式: degree（圆心角）=l(弧长) × 180/(π（圆周率）× r（半径）)  纬度1°约等于111km
					currentRad = currentRad * 180 / (Math.PI * earthRadius)
					break
				case 'miles':
					// 英里转度 1英里=1.609344千米
					currentRad = currentRad * 1.609344 * 180 / (Math.PI * earthRadius)
					break
				case 'degrees':
					currentRad = currentRad * 1
					break
			}
			return currentRad
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
			return `buffer${hh}${mm}${ss}`
  	},
		/**
		* 图层级缓冲分析
		* @function MRCS,MRFWS
    * @param {Object} options 缓冲参数
    * @param {String} options.ip ip地址或域名 localhost
    * @param {String} options.port 端口号 6163
		* @param {Boolean} options.isByAtt 指定缓冲方式 半径缓冲 false
		* @param {Number} options.leftRad 左半径 100 
		* @param {Number} options.rightRad 右半径 100 
		* @param {String} options.fldName 缓冲字段
		* @param {String} options.srcInfo 输入gdbp
		* @param {String} options.desInfo 输出gdbp
		* @param {Number} options.angelType 拐角类型 默认圆头 0 尖头 1
		* @param {Boolean} options.isDissolve 缓冲区是否合并 默认合并 true 不合并 false
		*/
		/**
		* 要素级缓冲分析
		* @function turf
    * @param {Object} options 缓冲参数
    * @param {GeoJSON} options.srcFeature 缓冲数据源
    * @param {Number} options.radius 缓冲半径 100
    * @param {String} options.units 缓冲单位 默认千米 kilometers 英里 miles 经纬度 degrees
		* @param {Number} options.steps 缓冲步长 8
		*/
		run() {
			this.$emit("listenBufferAdd", this.bufferAdd)
			if (this.srcType === "Layer") {
				var newLeftRad = this.convertRadUnit(this.leftRad, this.selectedUnit)
				var newRightRad = this.convertRadUnit(this.rightRad, this.selectedUnit)
				this.realLeftRad = newLeftRad
				this.realRightRad = newRightRad
				var clsBufBySRt = new ClassBufferBySingleRing({
					ip: this.baseUrl.split('/')[2].split(':')[0],
					port: this.baseUrl.split('/')[2].split(':')[1],
					isByAtt: this.isByAtt,
				})
				if (this.isByAtt == false) {
					clsBufBySRt.leftRad = this.realLeftRad
					clsBufBySRt.rightRad = this.realRightRad
				}	else {
					clsBufBySRt.fldName = this.selectedFldName
				}
				clsBufBySRt.srcInfo = this.srcLayer
				clsBufBySRt.desInfo = this.destLayer
				clsBufBySRt.angelType = Number(this.angelType),
				clsBufBySRt.isDissolve = this.isDissolve,
				clsBufBySRt.execute(this.AnalysisSuccess, 'post', false, 'json', () => {
					console.log("缓冲区分析失败")
				})
			} else {
				// var buffered = turf.buffer(this.srcFeature, this.radius, {units: this.selectedUnit, steps: Number(this.steps)});
				var newRadius = this.convertRadUnit(this.radius, this.selectedUnit)
				this.realRadius = newRadius
				var buffered = turf.buffer(this.srcFeature, this.realRadius, {units: 'degrees'});
				var bufferStyle = new FillStyle({
					color: this.colorCopyFill,
					outlineColor: this.colorCopyLine,
					outlineWidth: Number(this.colorLineWidth),
					opacity: Number(this.colorCopyOpacity),
				})
				this.$emit("listenFeature", buffered, this.destLayer, bufferStyle)
			}
		},
		AnalysisSuccess(data) {
			this.$emit("listenLayer", this.destLayer)
		},
		cancel() {
			Object.assign(this.$data, this.$options.data());
		}
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
.mapgis-widget-buffer-analysis {
	/* height: auto; */
	max-height: calc(50vh);
	overflow-y: auto;
	overflow-x: hidden;
}
/* .mapgis-ui-form-item {
	width: 300px;
} */
.mapgis-ui-form-item {
	margin-bottom: 0px;
}
/* .mapgis-ui-form-item-control {
	width: 214px;
	text-align: left;
	line-height: 40px;
	overflow: hidden;
} */
</style>