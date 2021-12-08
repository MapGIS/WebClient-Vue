<template>
	<div id="overlay-setting">

		<mapgis-ui-form-model v-bind="formItemLayout" :layout="layout" labelAlign="left" :colon="false">

			<!-- 2.叠加参数设置 -->
			<!-- <mapgis-ui-space>叠加参数设置</mapgis-ui-space> -->
			<mapgis-ui-form-model-item label="叠加方式">
				<mapgis-ui-select :placeholder=overType[3].name @change="selectCurrentMethod($event)">
					<mapgis-ui-select-option v-for="(item, index) in overType" :key="index" :value="item.typeValue">{{item.name}}</mapgis-ui-select-option>
				</mapgis-ui-select>
			</mapgis-ui-form-model-item>
			<mapgis-ui-form-model-item label="容差半径">
				<mapgis-ui-input v-model="radius"></mapgis-ui-input>
			</mapgis-ui-form-model-item>
			<mapgis-ui-form-model-item label="图形参数">
				<mapgis-ui-select :placeholder=infoOptType[1].name @change="selectCurrentPar($event)">
					<mapgis-ui-select-option v-for="(item, index) in infoOptType" :key="index" :value="item.typeValue">{{item.name}}</mapgis-ui-select-option>
				</mapgis-ui-select>
			</mapgis-ui-form-model-item>
			<mapgis-ui-form-model-item>
				<mapgis-ui-checkbox :default-checked="attOptType" v-model="attOptType">进行属性操作</mapgis-ui-checkbox>
				<br>
				<mapgis-ui-checkbox>处理复合要素(多点/多线/多区)</mapgis-ui-checkbox>
			</mapgis-ui-form-model-item>

			<!-- 3.输出结果 -->
			<!-- <mapgis-ui-space>输出结果</mapgis-ui-space> -->
			<mapgis-ui-form-model-item label="输出结果">
				<mapgis-ui-input v-decorator="['note', {rules: [{required: true, message: 'Please input your note'}] }]"/>
					<mapgis-ui-checkbox :default-checked="overlayAdd" @change="sendOverlayAdd">将结果图层添加到视图中</mapgis-ui-checkbox>
			</mapgis-ui-form-model-item>

		</mapgis-ui-form-model>

		<!-- button提交按钮 -->
		<mapgis-ui-row>
			<mapgis-ui-col :span=8>
				<mapgis-ui-button type="primary" html-type="submit"  @click="run">分析</mapgis-ui-button>
			</mapgis-ui-col>
			<mapgis-ui-col :span=8>
				<mapgis-ui-button type="default" html-type="submit"  @click="cancel">取消</mapgis-ui-button>
			</mapgis-ui-col>
		</mapgis-ui-row>

	</div>
</template>

<script>
export default {
	name: "mapgis-3d-overlay-analysis",
	props: {
		layout: {
			type: String,
			default: "horizontal" // 'horizontal' 'vertical' 'inline'
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
     * @type String
     * @default ""
     * @description 图层级叠加 输出叠加分析结果图层的gdbp
     */
		destLayer: {
			type: String,
			default: ""
		},
		/**
     * @type Object
     * @default {}
     * @description 要素级叠加 输入被叠加要素的GeoJSON
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
     * @description 要素级叠加 输入叠加要素的GeoJSON
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
			selectedOverType: 3,  // 叠加分析类型，取值0-7，默认为3 Ovly_InClip
			radius: 0.001,  // 容差半径 Number
			infoOptType: [
				{"name": "使用随机图层参数", "type": "RandomInfo", "typeValue": 0},
				{"name": "使用图层1（被叠加对象）的图层参数", "type": "UsesAInfo", "typeValue": 1},
				{"name": "使用图层2（叠加对象）的图层参数", "type": "UsesBInfo", "typeValue": 2},
			],
			selectedInfoOptType: 1,  // 图形参数操作，取值0-2，默认为1 UsesAInfo
			attOptType: true,  // 是否进行属性操作，0不允许 1允许，默认为1 Number

			overlayAdd: true,  // 结果添加到地图文档，默认为true
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
			console.log("mount");
			this.$emit('load',this);
		},
		unmount() {
			console.log("unmount")
		},
		selectCurrentMethod(event) {
			this.selectedOverType = event
		},
		selectCurrentPar(event) {
			this.selectedInfoOptType = event
		},
		sendOverlayAdd() {
			this.overlayAdd = !this.overlayAdd;
			this.$emit("listenOverlayAdd", this.overlayAdd)
		},


		run() {
			alert("开始执行叠加分析！")
			console.log("selectedOverType", this.selectedOverType, typeof(this.selectedOverType))
			console.log("radius", Number(this.radius), typeof(Number(this.radius)))
			console.log("selectedInfoOptType", this.selectedInfoOptType, typeof(this.selectedInfoOptType))
			console.log("attOptType", Number(this.attOptType), typeof(Number(this.attOptType)))

		},
		cancel() {
			alert("取消叠加分析！")
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


<style>
	* {
		margin: 0;
		padding: 0
	}
	/* 整体组件样式 */
	#overlay-setting {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 1000;
		width: 320px;
		height: auto;
		/* margin-top: -240px; */
		background-color: rgb(255, 255, 255);
		/* border-radius: 4px;
		box-shadow: 0px 0px 6px 0px rgba(3, 25, 57, 0.2); */
		padding: 10px;
	}
	#overlay-setting > form {
		height: auto;
	}

	/* 分标题样式设置 */
	/* .mapgis-ui-space-item {
		margin-left: -140px;
		font-size: 12px;
	}
	.mapgis-ui-space-item:before {
		content: url("./titlew.png");
		margin-right: 6px;
	} */

	/* 内容样式设置 */
	/* .mapgis-ui-form {
		width: 300px;
		height: auto;
		margin: auto;
	} */

	.mapgis-ui-form label {
		font-size: 12px;
	}

	/* 样式bug所在 */
	.mapgis-ui-form-item {
		width: 300px;
		margin-top: 15px;
		/* margin: 0px 10px 8px 10px; */
		/* background-color: rgb(240, 240, 240); */
	}

	.mapgis-ui-row.mapgis-ui-form-item {
    margin: 10px 0px 10px 0px;
	}

	/* 用于控制左侧label标题 */
	.mapgis-ui-form-item-label > label {
		margin-left: 10px;
		/* top: 9px; */
	}
	/* 用于控制右侧input输入框、checkbox和radio选择框 */
	.mapgis-ui-form-item-control {
		width: 214px;
		text-align: left;
		line-height: 40px;
		overflow: hidden;
		/* margin: 0; */
	}


	/* 按钮样式设置 */
 .mapgis-ui-btn {
		font-size: 14px;
		width: 80px;
		height: 32px;
		padding: 0;
		margin-bottom: 8px;
	}
	/* .mapgis-ui-btn:nth-child(1) {
		margin-left: 5px;
	}
	.mapgis-ui-btn:nth-child(2) {
		margin-right: 5px;
	} */


</style>