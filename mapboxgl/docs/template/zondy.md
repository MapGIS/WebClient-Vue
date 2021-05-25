# 中地样式
中地数码提供一套全中国的样式模板文件
目前有三种配色： 街道配色，黑暗配色，光明配色

## 街道配色

``` json
{
	"version": 8,
	"id": "街道地图",
	"name": "街道地图",
	"sources": {
		"IGServer": {
			"type": "vector",
			"tiles": ["http://localhost:6163/igs/rest/mrms/tile/OSM全中国/{z}/{y}/{x}?type=cpbf"],
			"minZoom": 0,
			"maxZoom": 24
		}
	},
	"layers": [{
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "background",
		"key": "背景底色",
		"id": "背景底色",
		"description": "图层信息",
		"info": "图层信息",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "背景底色",
		"paint": {
			"background-color": "#EFE9E1",
			"background-opacity": {
				"stops": [
					[0, 0],
					[10, 1],
					[20, 1]
				]
			}
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "背景图",
		"id": "背景图",
		"description": "背景图",
		"info": "背景图",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "背景图",
		"paint": {
			"fill-color": "#ccc4c4"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "省级行政区",
		"id": "省级行政区",
		"description": "省级行政区",
		"info": "省级行政区",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "省级行政区",
		"paint": {
			"fill-color": "#EFE9E1"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "观光胜地",
		"id": "观光胜地",
		"description": "观光胜地",
		"info": "观光胜地",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "观光胜地",
		"paint": {
			"fill-color": "#EEE3CE"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "公园POI面",
		"id": "公园POI面",
		"description": "公园POI面",
		"info": "公园POI面",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "公园POI面",
		"paint": {
			"fill-color": "#CAE39B"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "医院",
		"id": "医院",
		"description": "医院",
		"info": "医院",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "医院",
		"paint": {
			"fill-color": "#EAD8DE"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "大学",
		"id": "大学",
		"description": "大学",
		"info": "大学",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "大学",
		"paint": {
			"fill-color": "#DDEAF0"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "学校",
		"id": "学校",
		"description": "学校",
		"info": "学校",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "学校",
		"paint": {
			"fill-color": "#DDEAF0"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "动物园",
		"id": "动物园",
		"description": "动物园",
		"info": "动物园",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "动物园",
		"paint": {
			"fill-color": "#CAE39B"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "图书馆",
		"id": "图书馆",
		"description": "图书馆",
		"info": "图书馆",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "图书馆",
		"paint": {
			"fill-color": "#EEE3CE"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "高尔夫",
		"id": "高尔夫",
		"description": "高尔夫",
		"info": "高尔夫",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "高尔夫",
		"paint": {
			"fill-color": "#CAE39B"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "体育馆",
		"id": "体育馆",
		"description": "体育馆",
		"info": "体育馆",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "体育馆",
		"paint": {
			"fill-color": "#DDEAF0"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "POI",
		"id": "POI",
		"description": "POI",
		"info": "POI",
		"layout": {
			"visibility": "none"
		},
		"source-layer": "POI",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "矮树地",
		"id": "矮树地",
		"description": "矮树地",
		"info": "矮树地",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "矮树地",
		"paint": {
			"fill-color": "#DEEDB1"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "草地",
		"id": "草地",
		"description": "草地",
		"info": "草地",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "草地",
		"paint": {
			"fill-color": " #B8DDA5"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "分配土地",
		"id": "分配土地",
		"description": "分配土地",
		"info": "分配土地",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "分配土地",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "工厂",
		"id": "工厂",
		"description": "工厂",
		"info": "工厂",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "工厂",
		"paint": {
			"fill-color": "#D6D8E1"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "公园",
		"id": "公园",
		"description": "公园",
		"info": "公园",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "公园",
		"paint": {
			"fill-color": "#CAE39B"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "果园",
		"id": "果园",
		"description": "果园",
		"info": "果园",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "果园",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "荒地",
		"id": "荒地",
		"description": "荒地",
		"info": "荒地",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "荒地",
		"paint": {
			"fill-color": "#B8DDA5"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "军事用地",
		"id": "军事用地",
		"description": "军事用地",
		"info": "军事用地",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "军事用地",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "矿地",
		"id": "矿地",
		"description": "矿地",
		"info": "矿地",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "矿地",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "零售地",
		"id": "零售地",
		"description": "零售地",
		"info": "零售地",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "零售地",
		"paint": {
			"fill-color": " #E8E0ED"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "牧场",
		"id": "牧场",
		"description": "牧场",
		"info": "牧场",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "牧场",
		"paint": {
			"fill-color": "#37FF37"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "墓地",
		"id": "墓地",
		"description": "墓地",
		"info": "墓地",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "墓地",
		"paint": {
			"fill-color": " #D8E0BD"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "农业用地",
		"id": "农业用地",
		"description": "农业用地",
		"info": "农业用地",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "农业用地",
		"paint": {
			"fill-color": "#B8DDA5"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "葡萄园",
		"id": "葡萄园",
		"description": "葡萄园",
		"info": "葡萄园",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "葡萄园",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "森林",
		"id": "森林",
		"description": "森林",
		"info": "森林",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "森林",
		"paint": {
			"fill-color": "#D1E7A6"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "商业用地",
		"id": "商业用地",
		"description": "商业用地",
		"info": "商业用地",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "商业用地",
		"paint": {
			"fill-color": "#E8E0ED"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "自然保护区",
		"id": "自然保护区",
		"description": "自然保护区",
		"info": "自然保护区",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "自然保护区",
		"paint": {
			"fill-color": "#B8DDA5"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "娱乐用地",
		"id": "娱乐用地",
		"description": "娱乐用地",
		"info": "娱乐用地",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "娱乐用地",
		"paint": {
			"fill-color": "#B8DDA5"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "住宅用地",
		"id": "住宅用地",
		"description": "住宅用地",
		"info": "住宅用地",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "住宅用地",
		"paint": {
			"fill-color": "#E4E1DD",
			"fill-outline-color": "#e4e4e4"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "岛",
		"id": "岛",
		"description": "岛",
		"info": "岛",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "岛",
		"paint": {
			"fill-color": "#F5F5F5"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "城市",
		"id": "城市",
		"description": "城市",
		"info": "城市",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "城市",
		"paint": {
			"fill-color": "#E6EBD8"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "城镇",
		"id": "城镇",
		"description": "城镇",
		"info": "城镇",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "城镇",
		"paint": {
			"fill-color": "#BDD3B9"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "地区",
		"id": "地区",
		"description": "地区",
		"info": "地区",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "地区",
		"paint": {
			"fill-color": "#E1E8DB"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "乡村",
		"id": "乡村",
		"description": "乡村",
		"info": "乡村",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "乡村",
		"paint": {
			"fill-color": "#D1E1CC"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "村庄",
		"id": "村庄",
		"description": "村庄",
		"info": "村庄",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "村庄",
		"paint": {
			"fill-color": "#BDD3B9"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "小村庄",
		"id": "小村庄",
		"description": "小村庄",
		"info": "小村庄",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "小村庄",
		"paint": {
			"fill-color": "#D1E1CC"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "郊区",
		"id": "郊区",
		"description": "郊区",
		"info": "郊区",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "郊区",
		"paint": {
			"fill-color": "#D1E1CC"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "农田",
		"id": "农田",
		"description": "农田",
		"info": "农田",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "农田",
		"paint": {
			"fill-color": "#B8DDA5"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "所在地",
		"id": "所在地",
		"description": "所在地",
		"info": "所在地",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "所在地",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 12,
		"maxZoom": 24,
		"type": "fill-extrusion",
		"key": "建筑",
		"id": "建筑",
		"description": "建筑",
		"info": "建筑",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "建筑",
		"paint": {
			"fill-extrusion-color": "#ede8e8",
			"fill-extrusion-height": {
				"stops": [
					[0, 0],
					[11, 40],
					[20, 200]
				]
			}
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "出租车站区",
		"id": "出租车站区",
		"description": "出租车站",
		"info": "出租车站",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "出租车站",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "飞机场区",
		"id": "飞机场区",
		"description": "飞机场",
		"info": "飞机场",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "飞机场",
		"paint": {
			"fill-color": "#BDE2DC"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "公交车站区",
		"id": "公交车站区",
		"description": "公交车站",
		"info": "公交车站",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "公交车站",
		"paint": {
			"fill-color": "#BDE2DC"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "汽车站区",
		"id": "汽车站区",
		"description": "汽车站",
		"info": "汽车站",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "汽车站",
		"paint": {
			"fill-color": "#BDE2DC"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "机动轨道区",
		"id": "机动轨道区",
		"description": "机动轨道",
		"info": "机动轨道",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "机动轨道",
		"paint": {
			"fill-color": "#BDE2DC"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "机动站区",
		"id": "机动站区",
		"description": "机动站",
		"info": "机动站",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "机动站",
		"paint": {
			"fill-color": "#BDE2DC"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "码头渡轮区",
		"id": "码头渡轮区",
		"description": "码头渡轮",
		"info": "码头渡轮",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "码头渡轮",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "名胜古迹区",
		"id": "名胜古迹区",
		"description": "名胜古迹",
		"info": "名胜古迹",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "名胜古迹",
		"paint": {
			"fill-color": "#EAD8DE"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "堤坝区",
		"id": "堤坝区",
		"description": "堤坝",
		"info": "堤坝",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "堤坝",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "停车场区",
		"id": "停车场区",
		"description": "停车场",
		"info": "停车场",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "停车场",
		"paint": {
			"fill-color": "#D8E6ED"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "地下停车场区",
		"id": "地下停车场区",
		"description": "地下停车场",
		"info": "地下停车场",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "地下停车场",
		"paint": {
			"fill-color": "#D8E6ED"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "多层停车场区",
		"id": "多层停车场区",
		"description": "多层停车场",
		"info": "多层停车场",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "多层停车场",
		"paint": {
			"fill-color": "#D8E6ED"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "自行车停车场区",
		"id": "自行车停车场区",
		"description": "自行车停车场",
		"info": "自行车停车场",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "自行车停车场",
		"paint": {
			"fill-color": "#D8E6ED"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "公共服务区区",
		"id": "公共服务区区",
		"description": "公共服务区",
		"info": "公共服务区",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "公共服务区",
		"paint": {
			"fill-color": " #E8E0ED"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "滑道区",
		"id": "滑道区",
		"description": "滑道",
		"info": "滑道",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "滑道",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "加油站区",
		"id": "加油站区",
		"description": "加油站",
		"info": "加油站",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "加油站",
		"paint": {
			"fill-color": "#E8E0ED"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "码头区",
		"id": "码头区",
		"description": "码头",
		"info": "码头",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "码头",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "瀑布区",
		"id": "瀑布区",
		"description": "瀑布",
		"info": "瀑布",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "瀑布",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "水坝区",
		"id": "水坝区",
		"description": "水坝",
		"info": "水坝",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "水坝",
		"paint": {
			"fill-color": "#FFFFFF"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "闸门区",
		"id": "闸门区",
		"description": "闸门",
		"info": "闸门",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "闸门",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "坝区",
		"id": "坝区",
		"description": "坝",
		"info": "坝",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "坝",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "冰川区",
		"id": "冰川区",
		"description": "冰川",
		"info": "冰川",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "冰川",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "洞穴区",
		"id": "洞穴区",
		"description": "洞穴",
		"info": "洞穴",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "洞穴",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "海滩区",
		"id": "海滩区",
		"description": "海滩",
		"info": "海滩",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "海滩",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "泉水区",
		"id": "泉水区",
		"description": "泉水",
		"info": "泉水",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "泉水",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "山峰区",
		"id": "山峰区",
		"description": "山峰",
		"info": "山峰",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "山峰",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "树区",
		"id": "树区",
		"description": "树",
		"info": "树",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "树",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "悬崖区",
		"id": "悬崖区",
		"description": "悬崖",
		"info": "悬崖",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "悬崖",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "水库区",
		"id": "水库区",
		"description": "水库",
		"info": "水库",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "水库",
		"paint": {
			"fill-color": "#B5CFFF"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "水区",
		"id": "水区",
		"description": "水",
		"info": "水",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "水",
		"paint": {
			"fill-color": "#75CFF0"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "湿地区",
		"id": "湿地区",
		"description": "湿地",
		"info": "湿地",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "湿地",
		"paint": {
			"fill-color": "#B5CFFF"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "河流流域区",
		"id": "河流流域区",
		"description": "河流流域",
		"info": "河流流域",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "河流流域",
		"paint": {
			"fill-color": "#B5CFFF"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "船坞区",
		"id": "船坞区",
		"description": "船坞",
		"info": "船坞",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "船坞",
		"paint": {
			"fill-color": "#B5CFFF"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "冰川地区区",
		"id": "冰川地区区",
		"description": "冰川地区",
		"info": "冰川地区",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "冰川地区",
		"paint": {
			"fill-color": "#FFFFFF"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "河流线",
		"id": "河流线",
		"description": "河流",
		"info": "河流",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "河流",
		"paint": {
			"line-color": "#8DCBF7"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "运河线",
		"id": "运河线",
		"description": "运河",
		"info": "运河",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "运河",
		"paint": {
			"line-color": "#8DCBF7",
			"line-width": {
				"stops": [
					[0, 1],
					[12, 3],
					[15, 5],
					[20, 8]
				]
			}
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "排水道线",
		"id": "排水道线",
		"description": "排水道",
		"info": "排水道",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "排水道",
		"paint": {
			"line-color": "#8DCBF7"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "溪流线",
		"id": "溪流线",
		"description": "溪流",
		"info": "溪流",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "溪流",
		"paint": {
			"line-color": "#8DCBF7"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "铁路线虚部",
		"id": "铁路线虚部",
		"description": "铁路",
		"info": "铁路",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "铁路",
		"paint": {
			"line-color": "#000000",
			"line-width": 3
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "铁路线实部",
		"id": "铁路线实部",
		"description": "铁路",
		"info": "铁路",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "铁路",
		"paint": {
			"line-dasharray": {
				"stops": [
					[0, [3, 3]],
					[10, [2, 4]],
					[15, [5, 5]],
					[20, [6, 6]]
				]
			},
			"line-width": 2,
			"line-color": "#ffffff"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "小铁路线",
		"id": "小铁路线",
		"description": "小铁路",
		"info": "小铁路",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "小铁路",
		"paint": {
			"line-color": "#ffffff"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "窄轨铁路",
		"id": "窄轨铁路",
		"description": "窄轨铁路",
		"info": "窄轨铁路",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "窄轨铁路",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "单轨铁路",
		"id": "单轨铁路",
		"description": "单轨铁路",
		"info": "单轨铁路",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "单轨铁路",
		"paint": {
			"line-width": 1.5,
			"line-color": "#ffffff"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "电车轨道",
		"id": "电车轨道",
		"description": "电车轨道",
		"info": "电车轨道",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "电车轨道",
		"paint": {
			"line-color": "#f8e71c",
			"line-width": 2
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "缆索轨道",
		"id": "缆索轨道",
		"description": "缆索轨道",
		"info": "缆索轨道",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "缆索轨道",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "轻轨轨道",
		"id": "轻轨轨道",
		"description": "轻轨轨道",
		"info": "轻轨轨道",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "轻轨轨道",
		"paint": {
			"line-color": "#a363b1",
			"line-width": {
				"stops": [
					[0, 1],
					[20, 2]
				]
			}
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "地铁",
		"id": "地铁",
		"description": "地铁",
		"info": "地铁",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "地铁",
		"paint": {
			"line-color": "#CE7BB8",
			"line-width": {
				"stops": [
					[0, 1],
					[10, 3],
					[15, 7],
					[20, 10]
				]
			}
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "人行道",
		"id": "人行道",
		"description": "人行道",
		"info": "人行道",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "人行道",
		"paint": {
			"line-color": "#ffffff"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "轨道",
		"id": "轨道",
		"description": "轨道",
		"info": "轨道",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "轨道",
		"paint": {
			"line-color": "#ffffff"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "轨道_向导_1",
		"id": "轨道_向导_1",
		"description": "轨道_向导_1",
		"info": "轨道_向导_1",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "轨道_向导_1",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "轨道_向导_2",
		"id": "轨道_向导_2",
		"description": "轨道_向导_2",
		"info": "轨道_向导_2",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "轨道_向导_2",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "轨道_向导_3",
		"id": "轨道_向导_3",
		"description": "轨道_向导_3",
		"info": "轨道_向导_3",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "轨道_向导_3",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "轨道_向导_4",
		"id": "轨道_向导_4",
		"description": "轨道_向导_4",
		"info": "轨道_向导_4",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "轨道_向导_4",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "轨道_向导_5",
		"id": "轨道_向导_5",
		"description": "轨道_向导_5",
		"info": "轨道_向导_5",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "轨道_向导_5",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 12,
		"maxZoom": 24,
		"type": "line",
		"key": "公共服务道路",
		"id": "公共服务道路",
		"description": "公共服务道路",
		"info": "公共服务道路",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "公共服务道路",
		"paint": {
			"line-color": "#ffffff",
			"line-width": {
				"stops": [
					[0, 1],
					[11, 1.25],
					[20, 4]
				]
			},
			"line-dasharray": [1, 1]
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "小路线",
		"id": "小路线",
		"description": "小路",
		"info": "小路",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "小路",
		"paint": {
			"line-color": "#ffffff"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "一级道路",
		"id": "一级道路",
		"description": "一级道路",
		"info": "一级道路",
		"layout": {
			"line-cap": "round",
			"visibility": "visible"
		},
		"source-layer": "一级道路",
		"paint": {
			"line-color": "#EECE5A",
			"line-width": {
				"stops": [
					[0, 1.31],
					[10, 2.97],
					[15, 7],
					[20, 10]
				]
			}
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "一级道路_链接",
		"id": "一级道路_链接",
		"description": "一级道路_链接",
		"info": "一级道路_链接",
		"layout": {
			"line-cap": "round",
			"visibility": "visible"
		},
		"source-layer": "一级道路_链接",
		"paint": {
			"line-color": "#EECE5A"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "二级道路",
		"id": "二级道路",
		"description": "二级道路",
		"info": "二级道路",
		"layout": {
			"line-cap": "round",
			"visibility": "visible"
		},
		"source-layer": "二级道路",
		"paint": {
			"line-color": "#FFA35C",
			"line-width": {
				"stops": [
					[0, 1],
					[12, 2],
					[15, 5],
					[20, 7]
				]
			}
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "二级道路_链接",
		"id": "二级道路_链接",
		"description": "二级道路_链接",
		"info": "二级道路_链接",
		"layout": {
			"line-cap": "round",
			"visibility": "visible"
		},
		"source-layer": "二级道路_链接",
		"paint": {
			"line-color": "#ffffff"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "三级道路",
		"id": "三级道路",
		"description": "三级道路",
		"info": "三级道路",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "三级道路",
		"paint": {
			"line-color": "#FFA35C",
			"line-width": {
				"stops": [
					[0, 1],
					[12, 2],
					[15, 4],
					[20, 5]
				]
			}
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "三级道路_链接",
		"id": "三级道路_链接",
		"description": "三级道路_链接",
		"info": "三级道路_链接",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "三级道路_链接",
		"paint": {
			"line-color": "#ffffff"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "主干道线",
		"id": "主干道线",
		"description": "主干道",
		"info": "主干道",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "主干道",
		"paint": {
			"line-color": "#ffffff"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "主干道_链接",
		"id": "主干道_链接",
		"description": "主干道_链接",
		"info": "主干道_链接",
		"layout": {
			"line-cap": "round",
			"visibility": "visible"
		},
		"source-layer": "主干道_链接",
		"paint": {
			"line-color": "#ffffff"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "高速公路",
		"id": "高速公路",
		"description": "高速公路",
		"info": "高速公路",
		"layout": {
			"line-cap": "round",
			"visibility": "visible"
		},
		"source-layer": "高速公路",
		"paint": {
			"line-color": "#FFA35C",
			"line-width": {
				"stops": [
					[0, 1],
					[12, 2],
					[15, 5],
					[20, 7]
				]
			}
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "高速公路_链接",
		"id": "高速公路_链接",
		"description": "高速公路_链接",
		"info": "高速公路_链接",
		"layout": {
			"line-cap": "round",
			"visibility": "visible"
		},
		"source-layer": "高速公路_链接",
		"paint": {
			"line-color": "#FFA35C",
			"line-width": {
				"stops": [
					[0, 1],
					[12, 2],
					[15, 6],
					[20, 7]
				]
			}
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "大车道",
		"id": "大车道",
		"description": "大车道",
		"info": "大车道",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "大车道",
		"paint": {
			"line-color": "#ffffff"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "行人道",
		"id": "行人道",
		"description": "行人道",
		"info": "行人道",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "行人道",
		"paint": {
			"line-color": "#ffffff"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "流动街道",
		"id": "流动街道",
		"description": "流动街道",
		"info": "流动街道",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "流动街道",
		"paint": {
			"line-color": "#ffffff",
			"line-dasharray": [3, 2]
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "台阶线",
		"id": "台阶线",
		"description": "台阶",
		"info": "台阶",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "台阶",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "住宅道路",
		"id": "住宅道路",
		"description": "住宅道路",
		"info": "住宅道路",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "住宅道路",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "自行车道",
		"id": "自行车道",
		"description": "自行车道",
		"info": "自行车道",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "自行车道",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "不明道路",
		"id": "不明道路",
		"description": "不明道路",
		"info": "不明道路",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "不明道路",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "未分类道路",
		"id": "未分类道路",
		"description": "未分类道路",
		"info": "未分类道路",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "未分类道路",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "商业用地注记",
		"id": "商业用地注记",
		"description": "商业用地",
		"info": "商业用地",
		"layout": {
			"text-font": ["微软雅黑", "微软雅黑"],
			"text-size": 12,
			"text-field": "{name}",
			"icon-image": "340202_超市",
			"text-offset": [2.5, 0],
			"icon-offset": [-2.5, 0],
			"visibility": "visible"
		},
		"source-layer": "商业用地",
		"paint": {
			"text-color": "#ffffff",
			"text-halo-color": "#E8E0ED",
			"text-halo-width": 2
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "POI点",
		"id": "POI点",
		"description": "POI点",
		"info": "POI点",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "POI点",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 10,
		"maxZoom": 24,
		"type": "symbol",
		"key": "住宅用地注记",
		"id": "住宅用地注记",
		"description": "住宅用地",
		"info": "住宅用地",
		"layout": {
			"text-font": ["微软雅黑", "微软雅黑"],
			"text-size": 11,
			"text-field": "{name}",
			"icon-image": "310300_单幢房屋、普通房屋",
			"icon-size": 1,
			"icon-offset": [-25, 0],
			"visibility": "visible"
		},
		"source-layer": "住宅用地",
		"paint": {
			"text-halo-color": "#b9b2b2",
			"text-halo-width": 2,
			"text-color": "#ffffff",
			"icon-translate": [-10, 0]
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "观光胜地注记",
		"id": "观光胜地注记",
		"description": "观光胜地",
		"info": "观光胜地",
		"layout": {
			"text-font": ["微软雅黑", "微软雅黑"],
			"text-field": "{name}",
			"text-size": 13,
			"icon-image": "350100_古迹、遗址",
			"icon-offset": [-2, 0],
			"text-offset": [2, 0],
			"visibility": "visible"
		},
		"source-layer": "观光胜地",
		"paint": {
			"text-halo-color": "#EEE3CE",
			"text-halo-width": 2,
			"text-color": "#ffffff"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "大学注记",
		"id": "大学注记",
		"description": "大学图层信息",
		"info": "大学图层信息",
		"layout": {
			"text-font": ["微软雅黑", "微软雅黑"],
			"text-size": 12,
			"text-field": "{name}",
			"visibility": "visible"
		},
		"source-layer": "大学",
		"paint": {
			"text-halo-color": "#85aedd",
			"text-halo-width": 2,
			"text-color": "#ffffff"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "医院注记",
		"id": "医院注记",
		"description": "医院图层信息",
		"info": "医院图层信息",
		"layout": {
			"text-font": ["微软雅黑", "微软雅黑"],
			"text-field": "{name}",
			"text-size": 12,
			"visibility": "visible"
		},
		"source-layer": "医院",
		"paint": {
			"text-halo-color": "#ebc4c4",
			"text-halo-width": 2,
			"text-color": "#ffffff"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "工厂注记",
		"id": "工厂注记",
		"description": "工厂图层信息",
		"info": "工厂图层信息",
		"layout": {
			"text-font": ["微软雅黑", "微软雅黑"],
			"text-field": "{name}",
			"text-size": 12,
			"visibility": "visible"
		},
		"source-layer": "工厂",
		"paint": {
			"text-color": "#ffffff",
			"text-halo-color": "#D6D8E1",
			"text-halo-width": 2
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "学校注记",
		"id": "学校注记",
		"description": "学校图层信息",
		"info": "学校图层信息",
		"layout": {
			"text-font": ["微软雅黑", "微软雅黑"],
			"text-size": 11,
			"text-field": "{name}",
			"visibility": "visible"
		},
		"source-layer": "学校",
		"paint": {
			"text-halo-color": "#a0b5d0",
			"text-halo-width": 2,
			"text-color": "#ffffff"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "首都点",
		"id": "首都点",
		"description": "首都点",
		"info": "首都点",
		"layout": {
			"text-field": "{name}",
			"text-font": ["微软雅黑", "微软雅黑"],
			"text-allow-overlap": true,
			"visibility": "visible"
		},
		"source-layer": "首都点",
		"paint": {
			"text-halo-width": 2,
			"text-halo-color": "#ffffff",
			"text-color": "#ee2c43"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "省会城市",
		"id": "省会城市",
		"description": "省会城市",
		"info": "省会城市",
		"layout": {
			"text-field": "{name}",
			"text-font": ["微软雅黑", "微软雅黑"],
			"text-allow-overlap": true,
			"visibility": "visible"
		},
		"source-layer": "省会城市",
		"paint": {
			"text-halo-color": "#ffffff",
			"text-halo-width": 2,
			"text-color": "#4a90e2"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "岛屿点",
		"id": "岛屿点",
		"description": "岛屿点",
		"info": "岛屿点",
		"layout": {
			"text-field": "{name}",
			"text-font": ["微软雅黑", "微软雅黑"],
			"text-size": 14,
			"visibility": "visible"
		},
		"source-layer": "岛屿点",
		"paint": {
			"text-halo-color": "#ffffff",
			"text-halo-width": 1.5
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "城市点",
		"id": "城市点",
		"description": "城市点",
		"info": "城市点",
		"layout": {
			"text-field": "{name}",
			"text-font": ["微软雅黑", "微软雅黑"],
			"text-size": 12,
			"visibility": "visible"
		},
		"source-layer": "城市点",
		"paint": {
			"text-halo-color": "#ffffff",
			"text-halo-width": 1
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "市镇点",
		"id": "市镇点",
		"description": "市镇点",
		"info": "市镇点",
		"layout": {
			"text-field": "{name}",
			"text-size": 11,
			"text-font": ["微软雅黑", "微软雅黑"],
			"visibility": "visible"
		},
		"source-layer": "市镇点",
		"paint": {
			"text-halo-color": "#ffffff",
			"text-halo-width": 1
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "地区点",
		"id": "地区点",
		"description": "地区点",
		"info": "地区点",
		"layout": {
			"text-field": "{name}",
			"text-size": 12,
			"text-font": ["微软雅黑", "微软雅黑"],
			"visibility": "visible"
		},
		"source-layer": "地区点",
		"paint": {
			"text-halo-color": "#ffffff",
			"text-halo-width": 1
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "乡村点",
		"id": "乡村点",
		"description": "乡村点",
		"info": "乡村点",
		"layout": {
			"text-field": "{name}",
			"text-font": ["微软雅黑", "微软雅黑"],
			"visibility": "visible"
		},
		"source-layer": "乡村点",
		"paint": {
			"text-color": "#ffffff",
			"text-halo-color": "#ffffff",
			"text-halo-width": 1
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "村庄点",
		"id": "村庄点",
		"description": "村庄点",
		"info": "村庄点",
		"layout": {
			"text-field": "{name}",
			"text-font": ["微软雅黑", "微软雅黑"],
			"text-size": 11,
			"visibility": "visible"
		},
		"source-layer": "村庄点",
		"paint": {
			"text-halo-color": "#ffffff",
			"text-halo-width": 1.5
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "小村庄点",
		"id": "小村庄点",
		"description": "小村庄点",
		"info": "小村庄点",
		"layout": {
			"text-font": ["微软雅黑", "微软雅黑"],
			"text-field": "{name}",
			"text-size": 11,
			"visibility": "visible"
		},
		"source-layer": "小村庄点",
		"paint": {
			"text-halo-color": "#ffffff",
			"text-halo-width": 1
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "所在地点",
		"id": "所在地点",
		"description": "所在地点",
		"info": "所在地点",
		"layout": {
			"text-font": ["微软雅黑", "微软雅黑"],
			"text-field": "{name}",
			"text-size": 11,
			"visibility": "visible"
		},
		"source-layer": "所在地点",
		"paint": {
			"text-halo-width": 2,
			"text-halo-color": "#ffffff"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "农场点",
		"id": "农场点",
		"description": "农场点",
		"info": "农场点",
		"layout": {
			"text-font": ["微软雅黑", "微软雅黑"],
			"text-field": "{name}",
			"visibility": "visible"
		},
		"source-layer": "农场点",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "郊区点",
		"id": "郊区点",
		"description": "郊区点",
		"info": "郊区点",
		"layout": {
			"text-font": ["微软雅黑", "微软雅黑"],
			"text-field": "{name}",
			"text-size": 13,
			"visibility": "visible"
		},
		"source-layer": "郊区点",
		"paint": {
			"text-halo-color": "#ffffff",
			"text-halo-width": 2
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "出租车停靠位置",
		"id": "出租车停靠位置",
		"description": "出租车停靠位置",
		"info": "出租车停靠位置",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "出租车停靠位置",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "电车点",
		"id": "电车点",
		"description": "电车点",
		"info": "电车点",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "电车点",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "渡轮码头点",
		"id": "渡轮码头点",
		"description": "渡轮码头点",
		"info": "渡轮码头点",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "渡轮码头点",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "公交车站点",
		"id": "公交车站点",
		"description": "公交车站点",
		"info": "公交车站点",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "公交车站点",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "机动轨道点",
		"id": "机动轨道点",
		"description": "机动轨道点",
		"info": "机动轨道点",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "机动轨道点",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "机动站点",
		"id": "机动站点",
		"description": "机动站点",
		"info": "机动站点",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "机动站点",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "汽车站点",
		"id": "汽车站点",
		"description": "汽车站点",
		"info": "汽车站点",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "汽车站点",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "名胜古迹点",
		"id": "名胜古迹点",
		"description": "名胜古迹点",
		"info": "名胜古迹点",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "名胜古迹点",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "自行车停车场点",
		"id": "自行车停车场点",
		"description": "自行车停车场点",
		"info": "自行车停车场点",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "自行车停车场点",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "闸门点",
		"id": "闸门点",
		"description": "闸门点",
		"info": "闸门点",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "闸门点",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "旋转点",
		"id": "旋转点",
		"description": "旋转点",
		"info": "旋转点",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "旋转点",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "停车点",
		"id": "停车点",
		"description": "停车点",
		"info": "停车点",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "停车点",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "停车场点",
		"id": "停车场点",
		"description": "停车场点",
		"info": "停车场点",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "停车场点",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "摄像头点",
		"id": "摄像头点",
		"description": "摄像头点",
		"info": "摄像头点",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "摄像头点",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "浅滩点",
		"id": "浅滩点",
		"description": "浅滩点",
		"info": "浅滩点",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "浅滩点",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "瀑布点",
		"id": "瀑布点",
		"description": "瀑布点",
		"info": "瀑布点",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "瀑布点",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "码头点",
		"id": "码头点",
		"description": "码头点",
		"info": "码头点",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "码头点",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "路灯点",
		"id": "路灯点",
		"description": "路灯点",
		"info": "路灯点",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "路灯点",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "加油站点",
		"id": "加油站点",
		"description": "加油站点",
		"info": "加油站点",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "加油站点",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "环状交叉路口",
		"id": "环状交叉路口",
		"description": "环状交叉路口",
		"info": "环状交叉路口",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "环状交叉路口",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "河堤点",
		"id": "河堤点",
		"description": "河堤点",
		"info": "河堤点",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "河堤点",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "公共服务点",
		"id": "公共服务点",
		"description": "公共服务点",
		"info": "公共服务点",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "公共服务点",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "多层停车场点",
		"id": "多层停车场点",
		"description": "多层停车场点",
		"info": "多层停车场点",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "多层停车场点",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "地下停车场点",
		"id": "地下停车场点",
		"description": "地下停车场点",
		"info": "地下停车场点",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "地下停车场点",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "堤坝点",
		"id": "堤坝点",
		"description": "堤坝点",
		"info": "堤坝点",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "堤坝点",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "船台滑道点",
		"id": "船台滑道点",
		"description": "船台滑道点",
		"info": "船台滑道点",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "船台滑道点",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "高速公路连接点",
		"id": "高速公路连接点",
		"description": "高速公路连接点",
		"info": "高速公路连接点",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "高速公路连接点",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "信号灯点",
		"id": "信号灯点",
		"description": "信号灯点",
		"info": "信号灯点",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "信号灯点",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "十字路口",
		"id": "十字路口",
		"description": "十字路口",
		"info": "十字路口",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "十字路口",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "树木点",
		"id": "树木点",
		"description": "树木",
		"info": "树木",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "树木",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "山顶点",
		"id": "山顶点",
		"description": "山顶",
		"info": "山顶",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "山顶",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "沙滩点",
		"id": "沙滩点",
		"description": "沙滩",
		"info": "沙滩",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "沙滩",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "泉眼点",
		"id": "泉眼点",
		"description": "泉眼",
		"info": "泉眼",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "泉眼",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "峭壁点",
		"id": "峭壁点",
		"description": "峭壁",
		"info": "峭壁",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "峭壁",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "火山口点",
		"id": "火山口点",
		"description": "火山口",
		"info": "火山口",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "火山口",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "洞穴口点",
		"id": "洞穴口点",
		"description": "洞穴口",
		"info": "洞穴口",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "洞穴口",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "冰洞点",
		"id": "冰洞点",
		"description": "冰洞",
		"info": "冰洞",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "冰洞",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "公园POI面注记",
		"id": "公园POI面注记",
		"description": "公园POI面",
		"info": "公园POI面",
		"layout": {
			"text-font": ["微软雅黑", "微软雅黑"],
			"text-field": "{name}",
			"text-size": 13,
			"symbol-avoid-edges": false,
			"text-allow-overlap": false,
			"text-ignore-placement": false,
			"text-optional": false,
			"symbol-spacing": 1500,
			"text-max-width": 80,
			"text-letter-spacing": 0,
			"icon-offset": [-2.5, 0],
			"icon-image": "340303_陵园",
			"text-offset": [2.5, 0],
			"visibility": "visible"
		},
		"source-layer": "公园POI面",
		"paint": {
			"text-color": "#ffffff",
			"text-halo-color": "#b0db84",
			"text-halo-width": 2
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "铁路注记",
		"id": "铁路注记",
		"description": "铁路",
		"info": "铁路",
		"layout": {
			"text-font": ["微软雅黑", "微软雅黑"],
			"text-field": "{name}",
			"text-size": 13,
			"symbol-placement": "line",
			"visibility": "visible"
		},
		"source-layer": "铁路",
		"paint": {
			"text-halo-color": "#ffffff",
			"text-halo-width": 2
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "一级道路注记",
		"id": "一级道路注记",
		"description": "一级道路",
		"info": "一级道路",
		"layout": {
			"text-field": "{name}",
			"text-font": ["微软雅黑", "微软雅黑"],
			"text-size": 11,
			"symbol-placement": "line",
			"visibility": "visible"
		},
		"source-layer": "一级道路",
		"paint": {
			"text-halo-color": "#ffffff",
			"text-halo-width": 2,
			"text-color": "#EECE5A"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "2567f02b-a1b9-4301-8596-e9eb4abea26f",
		"id": "2567f02b-a1b9-4301-8596-e9eb4abea26f",
		"description": "一级道路",
		"info": "一级道路",
		"layout": {
			"text-field": "{name}",
			"text-font": ["微软雅黑", "微软雅黑"],
			"text-size": 11,
			"symbol-placement": "line",
			"visibility": "visible"
		},
		"source-layer": "二级道路",
		"paint": {
			"text-halo-color": "#ffffff",
			"text-halo-width": 2,
			"text-color": "#EECE5A"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "高速公路注记",
		"id": "高速公路注记",
		"description": "高速公路",
		"info": "高速公路",
		"layout": {
			"text-field": "{name}",
			"text-font": ["微软雅黑", "微软雅黑"],
			"text-size": 11,
			"symbol-placement": "line",
			"visibility": "visible"
		},
		"source-layer": "高速公路",
		"paint": {
			"text-halo-color": "#ffffff",
			"text-halo-width": 1,
			"text-color": "#4a4a4a"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "地铁注记",
		"id": "地铁注记",
		"description": "地铁",
		"info": "地铁",
		"layout": {
			"text-font": ["微软雅黑", "微软雅黑"],
			"text-field": "{name}",
			"symbol-placement": "line",
			"text-size": 13,
			"visibility": "visible"
		},
		"source-layer": "地铁",
		"paint": {
			"text-halo-color": "#ffffff",
			"text-halo-width": 2
		}
	}, {
		"source": "IGServer",
		"minZoom": 9,
		"maxZoom": 24,
		"type": "symbol",
		"key": "水注记",
		"id": "水注记",
		"description": "水",
		"info": "水",
		"layout": {
			"text-font": ["微软雅黑", "微软雅黑"],
			"text-size": 13,
			"text-field": "{name}",
			"symbol-placement": "point",
			"icon-image": "220304_地下渠出水口",
			"icon-offset": [-2.5, 0],
			"text-offset": [2.5, 0],
			"visibility": "visible"
		},
		"source-layer": "水",
		"paint": {
			"text-color": "#ffffff",
			"text-halo-color": "#8DCBF7",
			"text-halo-width": 2
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "自然保护区注记",
		"id": "自然保护区注记",
		"description": "自然保护区信息",
		"info": "自然保护区信息",
		"layout": {
			"text-font": ["微软雅黑", "微软雅黑"],
			"text-size": 11,
			"text-field": "{name}",
			"visibility": "visible"
		},
		"source-layer": "自然保护区",
		"paint": {
			"text-halo-color": "#98c668",
			"text-halo-width": 2,
			"text-color": "#ffffff"
		}
	}],
	"sprite": "http://localhost:6163/igs/rest/mrms/vtiles/sprite",
	"glyphs": "http://localhost:6163/igs/rest/mrms/vtiles/fonts/{fontstack}/{range}.pbf"
}
```

## 黑暗配色
``` json
{
	"version": 8,
	"id": "黑夜地图",
	"name": "黑夜地图",
	"sources": {
		"IGServer": {
			"type": "vector",
			"tiles": ["http://develop.smaryun.com:6163/igs/rest/mrms/tile/OSM全中国/{z}/{y}/{x}?type=cpbf"],
			"minZoom": 0,
			"maxZoom": 24
		}
	},
	"layers": [{
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "background",
		"key": "背景底色",
		"id": "背景底色",
		"description": "图层信息",
		"info": "图层信息",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "背景底色",
		"paint": {
			"background-color": "#343332",
			"background-opacity": {
				"stops": [
					[0, 0],
					[10, 1],
					[20, 1]
				]
			}
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "背景图",
		"id": "背景图",
		"description": "背景图",
		"info": "背景图",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "背景图",
		"paint": {
			"fill-color": "#4a4a4a"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "省级行政区",
		"id": "省级行政区",
		"description": "省级行政区",
		"info": "省级行政区",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "省级行政区",
		"paint": {
			"fill-color": "#343332"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "观光胜地",
		"id": "观光胜地",
		"description": "观光胜地",
		"info": "观光胜地",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "观光胜地",
		"paint": {
			"fill-color": "#323432"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "公园POI面",
		"id": "公园POI面",
		"description": "公园POI面",
		"info": "公园POI面",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "公园POI面",
		"paint": {
			"fill-color": "#323432"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "医院",
		"id": "医院",
		"description": "医院",
		"info": "医院",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "医院",
		"paint": {
			"fill-color": "#191A1A"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "大学",
		"id": "大学",
		"description": "大学",
		"info": "大学",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "大学",
		"paint": {
			"fill-color": "#191A1A"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "学校",
		"id": "学校",
		"description": "学校",
		"info": "学校",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "学校",
		"paint": {
			"fill-color": "#ECEEED"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "动物园",
		"id": "动物园",
		"description": "动物园",
		"info": "动物园",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "动物园",
		"paint": {
			"fill-color": "#191A1A"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "图书馆",
		"id": "图书馆",
		"description": "图书馆",
		"info": "图书馆",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "图书馆",
		"paint": {
			"fill-color": "#191A1A"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "高尔夫",
		"id": "高尔夫",
		"description": "高尔夫",
		"info": "高尔夫",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "高尔夫",
		"paint": {
			"fill-color": "#191A1A"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "体育馆",
		"id": "体育馆",
		"description": "体育馆",
		"info": "体育馆",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "体育馆",
		"paint": {
			"fill-color": "#191A1A"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "POI",
		"id": "POI",
		"description": "POI",
		"info": "POI",
		"layout": {
			"visibility": "none"
		},
		"source-layer": "POI",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "矮树地",
		"id": "矮树地",
		"description": "矮树地",
		"info": "矮树地",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "矮树地",
		"paint": {
			"fill-color": "#323432"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "草地",
		"id": "草地",
		"description": "草地",
		"info": "草地",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "草地",
		"paint": {
			"fill-color": " #343332"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "分配土地",
		"id": "分配土地",
		"description": "分配土地",
		"info": "分配土地",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "分配土地",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "工厂",
		"id": "工厂",
		"description": "工厂",
		"info": "工厂",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "工厂",
		"paint": {
			"fill-color": "#333333"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "公园",
		"id": "公园",
		"description": "公园",
		"info": "公园",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "公园",
		"paint": {
			"fill-color": "#ECEEED"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "果园",
		"id": "果园",
		"description": "果园",
		"info": "果园",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "果园",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "荒地",
		"id": "荒地",
		"description": "荒地",
		"info": "荒地",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "荒地",
		"paint": {
			"fill-color": "#B8DDA5"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "军事用地",
		"id": "军事用地",
		"description": "军事用地",
		"info": "军事用地",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "军事用地",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "矿地",
		"id": "矿地",
		"description": "矿地",
		"info": "矿地",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "矿地",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "零售地",
		"id": "零售地",
		"description": "零售地",
		"info": "零售地",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "零售地",
		"paint": {
			"fill-color": " #E8E0ED"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "牧场",
		"id": "牧场",
		"description": "牧场",
		"info": "牧场",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "牧场",
		"paint": {
			"fill-color": "#37FF37"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "墓地",
		"id": "墓地",
		"description": "墓地",
		"info": "墓地",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "墓地",
		"paint": {
			"fill-color": " #D8E0BD"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "农业用地",
		"id": "农业用地",
		"description": "农业用地",
		"info": "农业用地",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "农业用地",
		"paint": {
			"fill-color": "#343332",
			"fill-outline-color": "#343332"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "葡萄园",
		"id": "葡萄园",
		"description": "葡萄园",
		"info": "葡萄园",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "葡萄园",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "森林",
		"id": "森林",
		"description": "森林",
		"info": "森林",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "森林",
		"paint": {
			"fill-color": "#191A1A"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "商业用地",
		"id": "商业用地",
		"description": "商业用地",
		"info": "商业用地",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "商业用地",
		"paint": {
			"fill-color": "#272726"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "自然保护区",
		"id": "自然保护区",
		"description": "自然保护区",
		"info": "自然保护区",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "自然保护区",
		"paint": {
			"fill-color": "#ECEEED"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "娱乐用地",
		"id": "娱乐用地",
		"description": "娱乐用地",
		"info": "娱乐用地",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "娱乐用地",
		"paint": {
			"fill-color": "#191A1A"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "住宅用地",
		"id": "住宅用地",
		"description": "住宅用地",
		"info": "住宅用地",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "住宅用地",
		"paint": {
			"fill-color": "#454545"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "岛",
		"id": "岛",
		"description": "岛",
		"info": "岛",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "岛",
		"paint": {
			"fill-color": "#4a4a4a"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "城市",
		"id": "城市",
		"description": "城市",
		"info": "城市",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "城市",
		"paint": {
			"fill-color": "#343332"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "城镇",
		"id": "城镇",
		"description": "城镇",
		"info": "城镇",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "城镇",
		"paint": {
			"fill-color": "#191A1A"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "地区",
		"id": "地区",
		"description": "地区",
		"info": "地区",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "地区",
		"paint": {
			"fill-color": "#E1E8DB"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "乡村",
		"id": "乡村",
		"description": "乡村",
		"info": "乡村",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "乡村",
		"paint": {
			"fill-color": "#343332"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "村庄",
		"id": "村庄",
		"description": "村庄",
		"info": "村庄",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "村庄",
		"paint": {
			"fill-color": "#343332"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "小村庄",
		"id": "小村庄",
		"description": "小村庄",
		"info": "小村庄",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "小村庄",
		"paint": {
			"fill-color": "#272726"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "郊区",
		"id": "郊区",
		"description": "郊区",
		"info": "郊区",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "郊区",
		"paint": {
			"fill-color": "#ECEEED"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "农田",
		"id": "农田",
		"description": "农田",
		"info": "农田",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "农田",
		"paint": {
			"fill-color": "#343332"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "所在地",
		"id": "所在地",
		"description": "所在地",
		"info": "所在地",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "所在地",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 12,
		"maxZoom": 24,
		"type": "fill-extrusion",
		"key": "建筑",
		"id": "建筑",
		"description": "建筑",
		"info": "建筑",
		"layout": {
			"visibility": "none"
		},
		"source-layer": "建筑",
		"paint": {
			"fill-extrusion-color": "#2C2C2B",
			"fill-extrusion-height": {
				"stops": [
					[0, 0],
					[11, 40],
					[20, 200]
				]
			}
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "出租车站区",
		"id": "出租车站区",
		"description": "出租车站",
		"info": "出租车站",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "出租车站",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "飞机场区",
		"id": "飞机场区",
		"description": "飞机场",
		"info": "飞机场",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "飞机场",
		"paint": {
			"fill-color": "#BDE2DC"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "公交车站区",
		"id": "公交车站区",
		"description": "公交车站",
		"info": "公交车站",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "公交车站",
		"paint": {
			"fill-color": "#ECEEED"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "汽车站区",
		"id": "汽车站区",
		"description": "汽车站",
		"info": "汽车站",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "汽车站",
		"paint": {
			"fill-color": "#BDE2DC"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "机动轨道区",
		"id": "机动轨道区",
		"description": "机动轨道",
		"info": "机动轨道",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "机动轨道",
		"paint": {
			"fill-color": "#BDE2DC"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "机动站区",
		"id": "机动站区",
		"description": "机动站",
		"info": "机动站",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "机动站",
		"paint": {
			"fill-color": "#BDE2DC"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "码头渡轮区",
		"id": "码头渡轮区",
		"description": "码头渡轮",
		"info": "码头渡轮",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "码头渡轮",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "名胜古迹区",
		"id": "名胜古迹区",
		"description": "名胜古迹",
		"info": "名胜古迹",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "名胜古迹",
		"paint": {
			"fill-color": "#4a4a4a"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "堤坝区",
		"id": "堤坝区",
		"description": "堤坝",
		"info": "堤坝",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "堤坝",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "停车场区",
		"id": "停车场区",
		"description": "停车场",
		"info": "停车场",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "停车场",
		"paint": {
			"fill-color": "#191A1A"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "地下停车场区",
		"id": "地下停车场区",
		"description": "地下停车场",
		"info": "地下停车场",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "地下停车场",
		"paint": {
			"fill-color": "#D8E6ED"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "多层停车场区",
		"id": "多层停车场区",
		"description": "多层停车场",
		"info": "多层停车场",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "多层停车场",
		"paint": {
			"fill-color": "#D8E6ED"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "自行车停车场区",
		"id": "自行车停车场区",
		"description": "自行车停车场",
		"info": "自行车停车场",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "自行车停车场",
		"paint": {
			"fill-color": "#D8E6ED"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "公共服务区区",
		"id": "公共服务区区",
		"description": "公共服务区",
		"info": "公共服务区",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "公共服务区",
		"paint": {
			"fill-color": "#ECEEED"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "滑道区",
		"id": "滑道区",
		"description": "滑道",
		"info": "滑道",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "滑道",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "加油站区",
		"id": "加油站区",
		"description": "加油站",
		"info": "加油站",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "加油站",
		"paint": {
			"fill-color": "#E8E0ED"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "码头区",
		"id": "码头区",
		"description": "码头",
		"info": "码头",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "码头",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "瀑布区",
		"id": "瀑布区",
		"description": "瀑布",
		"info": "瀑布",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "瀑布",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "水坝区",
		"id": "水坝区",
		"description": "水坝",
		"info": "水坝",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "水坝",
		"paint": {
			"fill-color": "#FFFFFF"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "闸门区",
		"id": "闸门区",
		"description": "闸门",
		"info": "闸门",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "闸门",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "坝区",
		"id": "坝区",
		"description": "坝",
		"info": "坝",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "坝",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "冰川区",
		"id": "冰川区",
		"description": "冰川",
		"info": "冰川",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "冰川",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "洞穴区",
		"id": "洞穴区",
		"description": "洞穴",
		"info": "洞穴",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "洞穴",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "海滩区",
		"id": "海滩区",
		"description": "海滩",
		"info": "海滩",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "海滩",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "泉水区",
		"id": "泉水区",
		"description": "泉水",
		"info": "泉水",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "泉水",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "山峰区",
		"id": "山峰区",
		"description": "山峰",
		"info": "山峰",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "山峰",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "树区",
		"id": "树区",
		"description": "树",
		"info": "树",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "树",
		"paint": {
			"fill-color": "#323432"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "悬崖区",
		"id": "悬崖区",
		"description": "悬崖",
		"info": "悬崖",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "悬崖",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "水库区",
		"id": "水库区",
		"description": "水库",
		"info": "水库",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "水库",
		"paint": {
			"fill-color": "#CAD2D3"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "水区",
		"id": "水区",
		"description": "水",
		"info": "水",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "水",
		"paint": {
			"fill-color": "#191A1A"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "湿地区",
		"id": "湿地区",
		"description": "湿地",
		"info": "湿地",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "湿地",
		"paint": {
			"fill-color": "#CAD2D3"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "河流流域区",
		"id": "河流流域区",
		"description": "河流流域",
		"info": "河流流域",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "河流流域",
		"paint": {
			"fill-color": "#191A1A"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "船坞区",
		"id": "船坞区",
		"description": "船坞",
		"info": "船坞",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "船坞",
		"paint": {
			"fill-color": "#B5CFFF"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "冰川地区区",
		"id": "冰川地区区",
		"description": "冰川地区",
		"info": "冰川地区",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "冰川地区",
		"paint": {
			"fill-color": "#FFFFFF"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "河流线",
		"id": "河流线",
		"description": "河流",
		"info": "河流",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "河流",
		"paint": {
			"line-color": "#191A1A"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "运河线",
		"id": "运河线",
		"description": "运河",
		"info": "运河",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "运河",
		"paint": {
			"line-color": "#0C0D0D",
			"line-width": {
				"stops": [
					[0, 1],
					[12, 2],
					[15, 3],
					[20, 5]
				]
			}
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "排水道线",
		"id": "排水道线",
		"description": "排水道",
		"info": "排水道",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "排水道",
		"paint": {
			"line-color": "#8DCBF7"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "溪流线",
		"id": "溪流线",
		"description": "溪流",
		"info": "溪流",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "溪流",
		"paint": {
			"line-color": "#CAD2D3"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "铁路线虚部",
		"id": "铁路线虚部",
		"description": "铁路",
		"info": "铁路",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "铁路",
		"paint": {
			"line-color": "#000000",
			"line-width": 3
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "铁路线实部",
		"id": "铁路线实部",
		"description": "铁路",
		"info": "铁路",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "铁路",
		"paint": {
			"line-dasharray": {
				"stops": [
					[0, [3, 3]],
					[10, [2, 4]],
					[15, [5, 5]],
					[20, [6, 6]]
				]
			},
			"line-width": 2,
			"line-color": "#ffffff"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "小铁路线",
		"id": "小铁路线",
		"description": "小铁路",
		"info": "小铁路",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "小铁路",
		"paint": {
			"line-color": "#ffffff"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "窄轨铁路",
		"id": "窄轨铁路",
		"description": "窄轨铁路",
		"info": "窄轨铁路",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "窄轨铁路",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "单轨铁路",
		"id": "单轨铁路",
		"description": "单轨铁路",
		"info": "单轨铁路",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "单轨铁路",
		"paint": {
			"line-width": 1.5,
			"line-color": "#ffffff"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "电车轨道",
		"id": "电车轨道",
		"description": "电车轨道",
		"info": "电车轨道",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "电车轨道",
		"paint": {
			"line-color": "#ffffff",
			"line-width": 2
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "缆索轨道",
		"id": "缆索轨道",
		"description": "缆索轨道",
		"info": "缆索轨道",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "缆索轨道",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "轻轨轨道",
		"id": "轻轨轨道",
		"description": "轻轨轨道",
		"info": "轻轨轨道",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "轻轨轨道",
		"paint": {
			"line-color": "#a363b1",
			"line-width": {
				"stops": [
					[0, 1],
					[20, 2]
				]
			}
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "地铁",
		"id": "地铁",
		"description": "地铁",
		"info": "地铁",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "地铁",
		"paint": {
			"line-color": "#191A1A",
			"line-width": {
				"stops": [
					[0, 1],
					[10, 3],
					[15, 7],
					[20, 10]
				]
			}
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "人行道",
		"id": "人行道",
		"description": "人行道",
		"info": "人行道",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "人行道",
		"paint": {
			"line-color": "#F0EFEF"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "轨道",
		"id": "轨道",
		"description": "轨道",
		"info": "轨道",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "轨道",
		"paint": {
			"line-color": "#ffffff"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "轨道_向导_1",
		"id": "轨道_向导_1",
		"description": "轨道_向导_1",
		"info": "轨道_向导_1",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "轨道_向导_1",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "轨道_向导_2",
		"id": "轨道_向导_2",
		"description": "轨道_向导_2",
		"info": "轨道_向导_2",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "轨道_向导_2",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "轨道_向导_3",
		"id": "轨道_向导_3",
		"description": "轨道_向导_3",
		"info": "轨道_向导_3",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "轨道_向导_3",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "轨道_向导_4",
		"id": "轨道_向导_4",
		"description": "轨道_向导_4",
		"info": "轨道_向导_4",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "轨道_向导_4",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "轨道_向导_5",
		"id": "轨道_向导_5",
		"description": "轨道_向导_5",
		"info": "轨道_向导_5",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "轨道_向导_5",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 12,
		"maxZoom": 24,
		"type": "line",
		"key": "公共服务道路",
		"id": "公共服务道路",
		"description": "公共服务道路",
		"info": "公共服务道路",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "公共服务道路",
		"paint": {
			"line-color": "#F5F4F4",
			"line-width": {
				"stops": [
					[0, 1],
					[11, 1.25],
					[20, 4]
				]
			},
			"line-dasharray": [1, 1]
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "小路线",
		"id": "小路线",
		"description": "小路",
		"info": "小路",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "小路",
		"paint": {
			"line-color": "#F8F7F7"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "一级道路",
		"id": "一级道路",
		"description": "一级道路",
		"info": "一级道路",
		"layout": {
			"line-cap": "round",
			"visibility": "visible"
		},
		"filter": ["all", ["==", "编码", "空"]],
		"source-layer": "一级道路",
		"paint": {
			"line-color": "#fff",
			"line-width": {
				"stops": [
					[0, 1.31],
					[10, 2.97],
					[15, 7],
					[20, 10]
				]
			}
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "一级道路_链接",
		"id": "一级道路_链接",
		"description": "一级道路_链接",
		"info": "一级道路_链接",
		"layout": {
			"line-cap": "round",
			"visibility": "visible"
		},
		"source-layer": "一级道路_链接",
		"paint": {
			"line-color": "#fff"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "二级道路",
		"id": "二级道路",
		"description": "二级道路",
		"info": "二级道路",
		"layout": {
			"line-cap": "round",
			"visibility": "visible"
		},
		"source-layer": "二级道路",
		"paint": {
			"line-color": "#B22E2E",
			"line-width": {
				"stops": [
					[0, 1],
					[12, 2],
					[15, 5],
					[20, 7]
				]
			}
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "二级道路_链接",
		"id": "二级道路_链接",
		"description": "二级道路_链接",
		"info": "二级道路_链接",
		"layout": {
			"line-cap": "round",
			"visibility": "visible"
		},
		"source-layer": "二级道路_链接",
		"paint": {
			"line-color": "#B22E2E"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "三级道路",
		"id": "三级道路",
		"description": "三级道路",
		"info": "三级道路",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "三级道路",
		"paint": {
			"line-color": "#ffffff",
			"line-width": {
				"stops": [
					[0, 1],
					[12, 2],
					[15, 4],
					[20, 5]
				]
			}
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "三级道路_链接",
		"id": "三级道路_链接",
		"description": "三级道路_链接",
		"info": "三级道路_链接",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "三级道路_链接",
		"paint": {
			"line-color": "#ffffff"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "主干道线",
		"id": "主干道线",
		"description": "主干道",
		"info": "主干道",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "主干道",
		"paint": {
			"line-color": "#F5F5F5"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "主干道_链接",
		"id": "主干道_链接",
		"description": "主干道_链接",
		"info": "主干道_链接",
		"layout": {
			"line-cap": "round",
			"visibility": "visible"
		},
		"source-layer": "主干道_链接",
		"paint": {
			"line-color": "#F5F5F5"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "高速公路",
		"id": "高速公路",
		"description": "高速公路",
		"info": "高速公路",
		"layout": {
			"line-cap": "round",
			"visibility": "visible"
		},
		"filter": ["all", ["==", "fclass", "motorway"]],
		"source-layer": "高速公路",
		"paint": {
			"line-color": "#ffffff",
			"line-width": {
				"stops": [
					[0, 1],
					[12, 2],
					[15, 5],
					[20, 7]
				]
			}
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "高速公路_链接",
		"id": "高速公路_链接",
		"description": "高速公路_链接",
		"info": "高速公路_链接",
		"layout": {
			"line-cap": "round",
			"visibility": "visible"
		},
		"source-layer": "高速公路_链接",
		"paint": {
			"line-color": "#ffffff",
			"line-width": {
				"stops": [
					[0, 1],
					[12, 2],
					[15, 6],
					[20, 7]
				]
			}
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "大车道",
		"id": "大车道",
		"description": "大车道",
		"info": "大车道",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "大车道",
		"paint": {
			"line-color": "#ffffff"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "行人道",
		"id": "行人道",
		"description": "行人道",
		"info": "行人道",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "行人道",
		"paint": {
			"line-color": "#ffffff"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "流动街道",
		"id": "流动街道",
		"description": "流动街道",
		"info": "流动街道",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "流动街道",
		"paint": {
			"line-color": "#ffffff",
			"line-dasharray": [3, 2]
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "台阶线",
		"id": "台阶线",
		"description": "台阶",
		"info": "台阶",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "台阶",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "住宅道路",
		"id": "住宅道路",
		"description": "住宅道路",
		"info": "住宅道路",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "住宅道路",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "自行车道",
		"id": "自行车道",
		"description": "自行车道",
		"info": "自行车道",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "自行车道",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "不明道路",
		"id": "不明道路",
		"description": "不明道路",
		"info": "不明道路",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "不明道路",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "未分类道路",
		"id": "未分类道路",
		"description": "未分类道路",
		"info": "未分类道路",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "未分类道路",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "商业用地注记",
		"id": "商业用地注记",
		"description": "商业用地",
		"info": "商业用地",
		"layout": {
			"text-font": ["微软雅黑", "微软雅黑"],
			"text-size": 12,
			"text-field": "{name}",
			"icon-image": "340202_超市",
			"text-offset": [2.5, 0],
			"icon-offset": [-2.5, 0],
			"visibility": "visible"
		},
		"source-layer": "商业用地",
		"paint": {
			"text-color": "#999999",
			"text-halo-color": "#212121",
			"text-halo-width": 2
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "POI点",
		"id": "POI点",
		"description": "POI点",
		"info": "POI点",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "POI点",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 10,
		"maxZoom": 24,
		"type": "symbol",
		"key": "住宅用地注记",
		"id": "住宅用地注记",
		"description": "住宅用地",
		"info": "住宅用地",
		"layout": {
			"text-font": ["微软雅黑", "微软雅黑"],
			"text-size": 11,
			"text-field": "{name}",
			"icon-image": "310300_单幢房屋、普通房屋",
			"icon-size": 1,
			"icon-offset": [-25, 0],
			"visibility": "visible"
		},
		"source-layer": "住宅用地",
		"paint": {
			"text-halo-color": "#212121",
			"text-halo-width": 2,
			"text-color": "#999999",
			"icon-translate": [-10, 0]
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "观光胜地注记",
		"id": "观光胜地注记",
		"description": "观光胜地",
		"info": "观光胜地",
		"layout": {
			"text-font": ["微软雅黑", "微软雅黑"],
			"text-field": "{name}",
			"text-size": 13,
			"icon-image": "350100_古迹、遗址",
			"icon-offset": [-2, 0],
			"text-offset": [2, 0],
			"visibility": "visible"
		},
		"source-layer": "观光胜地",
		"paint": {
			"text-halo-color": "#1A1A1A",
			"text-halo-width": 2,
			"text-color": "#B3B3B3"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "大学注记",
		"id": "大学注记",
		"description": "大学图层信息",
		"info": "大学图层信息",
		"layout": {
			"text-font": ["微软雅黑", "微软雅黑"],
			"text-size": 12,
			"text-field": "{name}",
			"visibility": "visible"
		},
		"source-layer": "大学",
		"paint": {
			"text-halo-color": "#1a1a1a",
			"text-halo-width": 2,
			"text-color": "#B3B3B3"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "医院注记",
		"id": "医院注记",
		"description": "医院图层信息",
		"info": "医院图层信息",
		"layout": {
			"text-font": ["微软雅黑", "微软雅黑"],
			"text-field": "{name}",
			"text-size": 12,
			"visibility": "visible"
		},
		"source-layer": "医院",
		"paint": {
			"text-halo-color": "#212121",
			"text-halo-width": 2,
			"text-color": "#ffffff"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "工厂注记",
		"id": "工厂注记",
		"description": "工厂图层信息",
		"info": "工厂图层信息",
		"layout": {
			"text-font": ["微软雅黑", "微软雅黑"],
			"text-field": "{name}",
			"text-size": 12,
			"visibility": "visible"
		},
		"source-layer": "工厂",
		"paint": {
			"text-color": "#ffffff",
			"text-halo-color": "#D6D8E1",
			"text-halo-width": 2
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "学校注记",
		"id": "学校注记",
		"description": "学校图层信息",
		"info": "学校图层信息",
		"layout": {
			"text-font": ["微软雅黑", "微软雅黑"],
			"text-size": 11,
			"text-field": "{name}",
			"visibility": "visible"
		},
		"source-layer": "学校",
		"paint": {
			"text-halo-color": "#212121",
			"text-halo-width": 2,
			"text-color": "#ffffff"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "首都点",
		"id": "首都点",
		"description": "首都点",
		"info": "首都点",
		"layout": {
			"text-field": "{name}",
			"text-font": ["微软雅黑", "微软雅黑"],
			"text-allow-overlap": true,
			"visibility": "visible"
		},
		"source-layer": "首都点",
		"paint": {
			"text-halo-width": 2,
			"text-halo-color": "#ffffff",
			"text-color": "#000000"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "省会城市",
		"id": "省会城市",
		"description": "省会城市",
		"info": "省会城市",
		"layout": {
			"text-field": "{name}",
			"text-font": ["微软雅黑", "微软雅黑"],
			"text-allow-overlap": true,
			"visibility": "visible"
		},
		"source-layer": "省会城市",
		"paint": {
			"text-halo-color": "#1A1A1A",
			"text-halo-width": 2,
			"text-color": "#808080"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "岛屿点",
		"id": "岛屿点",
		"description": "岛屿点",
		"info": "岛屿点",
		"layout": {
			"text-field": "{name}",
			"text-font": ["微软雅黑", "微软雅黑"],
			"text-size": 14,
			"visibility": "visible"
		},
		"source-layer": "岛屿点",
		"paint": {
			"text-halo-color": "#ffffff",
			"text-halo-width": 1.5
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "城市点",
		"id": "城市点",
		"description": "城市点",
		"info": "城市点",
		"layout": {
			"text-field": "{name}",
			"text-font": ["微软雅黑", "微软雅黑"],
			"text-size": 12,
			"visibility": "visible"
		},
		"source-layer": "城市点",
		"paint": {
			"text-halo-color": "#1A1A1A",
			"text-halo-width": 1,
			"text-color": "#E6E6E6"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "市镇点",
		"id": "市镇点",
		"description": "市镇点",
		"info": "市镇点",
		"layout": {
			"text-field": "{name}",
			"text-size": 11,
			"text-font": ["微软雅黑", "微软雅黑"],
			"visibility": "visible"
		},
		"source-layer": "市镇点",
		"paint": {
			"text-halo-color": "#1A1A1A",
			"text-halo-width": 1,
			"text-color": "#D9D9D9"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "地区点",
		"id": "地区点",
		"description": "地区点",
		"info": "地区点",
		"layout": {
			"text-field": "{name}",
			"text-size": 12,
			"text-font": ["微软雅黑", "微软雅黑"],
			"visibility": "visible"
		},
		"source-layer": "地区点",
		"paint": {
			"text-halo-color": "#ffffff",
			"text-halo-width": 1
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "乡村点",
		"id": "乡村点",
		"description": "乡村点",
		"info": "乡村点",
		"layout": {
			"text-field": "{name}",
			"text-font": ["微软雅黑", "微软雅黑"],
			"visibility": "visible"
		},
		"source-layer": "乡村点",
		"paint": {
			"text-color": "#737373",
			"text-halo-color": "#1A1A1A",
			"text-halo-width": 1
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "村庄点",
		"id": "村庄点",
		"description": "村庄点",
		"info": "村庄点",
		"layout": {
			"text-field": "{name}",
			"text-font": ["微软雅黑", "微软雅黑"],
			"text-size": 11,
			"visibility": "visible"
		},
		"source-layer": "村庄点",
		"paint": {
			"text-halo-color": "#ffffff",
			"text-halo-width": 1.5
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "小村庄点",
		"id": "小村庄点",
		"description": "小村庄点",
		"info": "小村庄点",
		"layout": {
			"text-font": ["微软雅黑", "微软雅黑"],
			"text-field": "{name}",
			"text-size": 11,
			"visibility": "visible"
		},
		"source-layer": "小村庄点",
		"paint": {
			"text-halo-color": "#1A1A1A",
			"text-halo-width": 1,
			"text-color": "#BFBFBF"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "所在地点",
		"id": "所在地点",
		"description": "所在地点",
		"info": "所在地点",
		"layout": {
			"text-font": ["微软雅黑", "微软雅黑"],
			"text-field": "{name}",
			"text-size": 11,
			"visibility": "visible"
		},
		"source-layer": "所在地点",
		"paint": {
			"text-halo-width": 2,
			"text-halo-color": "#ffffff"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "农场点",
		"id": "农场点",
		"description": "农场点",
		"info": "农场点",
		"layout": {
			"text-font": ["微软雅黑", "微软雅黑"],
			"text-field": "{name}",
			"visibility": "visible"
		},
		"source-layer": "农场点",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "郊区点",
		"id": "郊区点",
		"description": "郊区点",
		"info": "郊区点",
		"layout": {
			"text-font": ["微软雅黑", "微软雅黑"],
			"text-field": "{name}",
			"text-size": 13,
			"visibility": "visible"
		},
		"source-layer": "郊区点",
		"paint": {
			"text-halo-color": "#ffffff",
			"text-halo-width": 2
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "出租车停靠位置",
		"id": "出租车停靠位置",
		"description": "出租车停靠位置",
		"info": "出租车停靠位置",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "出租车停靠位置",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "电车点",
		"id": "电车点",
		"description": "电车点",
		"info": "电车点",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "电车点",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "渡轮码头点",
		"id": "渡轮码头点",
		"description": "渡轮码头点",
		"info": "渡轮码头点",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "渡轮码头点",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "公交车站点",
		"id": "公交车站点",
		"description": "公交车站点",
		"info": "公交车站点",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "公交车站点",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "机动轨道点",
		"id": "机动轨道点",
		"description": "机动轨道点",
		"info": "机动轨道点",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "机动轨道点",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "机动站点",
		"id": "机动站点",
		"description": "机动站点",
		"info": "机动站点",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "机动站点",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "汽车站点",
		"id": "汽车站点",
		"description": "汽车站点",
		"info": "汽车站点",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "汽车站点",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "名胜古迹点",
		"id": "名胜古迹点",
		"description": "名胜古迹点",
		"info": "名胜古迹点",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "名胜古迹点",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "自行车停车场点",
		"id": "自行车停车场点",
		"description": "自行车停车场点",
		"info": "自行车停车场点",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "自行车停车场点",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "闸门点",
		"id": "闸门点",
		"description": "闸门点",
		"info": "闸门点",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "闸门点",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "旋转点",
		"id": "旋转点",
		"description": "旋转点",
		"info": "旋转点",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "旋转点",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "停车点",
		"id": "停车点",
		"description": "停车点",
		"info": "停车点",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "停车点",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "停车场点",
		"id": "停车场点",
		"description": "停车场点",
		"info": "停车场点",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "停车场点",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "摄像头点",
		"id": "摄像头点",
		"description": "摄像头点",
		"info": "摄像头点",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "摄像头点",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "浅滩点",
		"id": "浅滩点",
		"description": "浅滩点",
		"info": "浅滩点",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "浅滩点",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "瀑布点",
		"id": "瀑布点",
		"description": "瀑布点",
		"info": "瀑布点",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "瀑布点",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "码头点",
		"id": "码头点",
		"description": "码头点",
		"info": "码头点",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "码头点",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "路灯点",
		"id": "路灯点",
		"description": "路灯点",
		"info": "路灯点",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "路灯点",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "加油站点",
		"id": "加油站点",
		"description": "加油站点",
		"info": "加油站点",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "加油站点",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "环状交叉路口",
		"id": "环状交叉路口",
		"description": "环状交叉路口",
		"info": "环状交叉路口",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "环状交叉路口",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "河堤点",
		"id": "河堤点",
		"description": "河堤点",
		"info": "河堤点",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "河堤点",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "公共服务点",
		"id": "公共服务点",
		"description": "公共服务点",
		"info": "公共服务点",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "公共服务点",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "多层停车场点",
		"id": "多层停车场点",
		"description": "多层停车场点",
		"info": "多层停车场点",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "多层停车场点",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "地下停车场点",
		"id": "地下停车场点",
		"description": "地下停车场点",
		"info": "地下停车场点",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "地下停车场点",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "堤坝点",
		"id": "堤坝点",
		"description": "堤坝点",
		"info": "堤坝点",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "堤坝点",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "船台滑道点",
		"id": "船台滑道点",
		"description": "船台滑道点",
		"info": "船台滑道点",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "船台滑道点",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "高速公路连接点",
		"id": "高速公路连接点",
		"description": "高速公路连接点",
		"info": "高速公路连接点",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "高速公路连接点",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "信号灯点",
		"id": "信号灯点",
		"description": "信号灯点",
		"info": "信号灯点",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "信号灯点",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "十字路口",
		"id": "十字路口",
		"description": "十字路口",
		"info": "十字路口",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "十字路口",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "树木点",
		"id": "树木点",
		"description": "树木",
		"info": "树木",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "树木",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "山顶点",
		"id": "山顶点",
		"description": "山顶",
		"info": "山顶",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "山顶",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "沙滩点",
		"id": "沙滩点",
		"description": "沙滩",
		"info": "沙滩",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "沙滩",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "泉眼点",
		"id": "泉眼点",
		"description": "泉眼",
		"info": "泉眼",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "泉眼",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "峭壁点",
		"id": "峭壁点",
		"description": "峭壁",
		"info": "峭壁",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "峭壁",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "火山口点",
		"id": "火山口点",
		"description": "火山口",
		"info": "火山口",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "火山口",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "洞穴口点",
		"id": "洞穴口点",
		"description": "洞穴口",
		"info": "洞穴口",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "洞穴口",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "冰洞点",
		"id": "冰洞点",
		"description": "冰洞",
		"info": "冰洞",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "冰洞",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "公园POI面注记",
		"id": "公园POI面注记",
		"description": "公园POI面",
		"info": "公园POI面",
		"layout": {
			"text-font": ["微软雅黑", "微软雅黑"],
			"text-field": "{name}",
			"text-size": 13,
			"symbol-avoid-edges": false,
			"text-allow-overlap": false,
			"text-ignore-placement": false,
			"text-optional": false,
			"symbol-spacing": 1500,
			"text-max-width": 80,
			"text-letter-spacing": 0,
			"icon-offset": [-2.5, 0],
			"icon-image": "340303_陵园",
			"text-offset": [2.5, 0],
			"visibility": "visible"
		},
		"source-layer": "公园POI面",
		"paint": {
			"text-color": "#BABABA",
			"text-halo-color": "#212121",
			"text-halo-width": 2
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "铁路注记",
		"id": "铁路注记",
		"description": "铁路",
		"info": "铁路",
		"layout": {
			"text-font": ["微软雅黑", "微软雅黑"],
			"text-field": "{name}",
			"text-size": 13,
			"symbol-placement": "line",
			"visibility": "visible"
		},
		"source-layer": "铁路",
		"paint": {
			"text-halo-color": "#ffffff",
			"text-halo-width": 2
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "一级道路注记",
		"id": "一级道路注记",
		"description": "一级道路",
		"info": "一级道路",
		"layout": {
			"text-field": "{name}",
			"text-font": ["微软雅黑", "微软雅黑"],
			"text-size": 11,
			"symbol-placement": "line",
			"visibility": "visible"
		},
		"source-layer": "一级道路",
		"paint": {
			"text-halo-color": "#212121",
			"text-halo-width": 2,
			"text-color": "#C7C7C7"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "2567f02b-a1b9-4301-8596-e9eb4abea26f",
		"id": "2567f02b-a1b9-4301-8596-e9eb4abea26f",
		"description": "一级道路",
		"info": "一级道路",
		"layout": {
			"text-field": "{name}",
			"text-font": ["微软雅黑", "微软雅黑"],
			"text-size": 11,
			"symbol-placement": "line",
			"visibility": "visible"
		},
		"source-layer": "二级道路",
		"paint": {
			"text-halo-color": "#212121",
			"text-halo-width": 2,
			"text-color": "#9b9b9b"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "高速公路注记",
		"id": "高速公路注记",
		"description": "高速公路",
		"info": "高速公路",
		"layout": {
			"text-field": "{name}",
			"text-font": ["微软雅黑", "微软雅黑"],
			"text-size": 11,
			"symbol-placement": "line",
			"visibility": "visible"
		},
		"source-layer": "高速公路",
		"paint": {
			"text-halo-color": "#ffffff",
			"text-halo-width": 1,
			"text-color": "#4a4a4a"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "地铁注记",
		"id": "地铁注记",
		"description": "地铁",
		"info": "地铁",
		"layout": {
			"text-font": ["微软雅黑", "微软雅黑"],
			"text-field": "{name}",
			"symbol-placement": "line",
			"text-size": 13,
			"visibility": "visible"
		},
		"source-layer": "地铁",
		"paint": {
			"text-halo-color": "#212121",
			"text-halo-width": 2,
			"text-color": "#999999"
		}
	}, {
		"source": "IGServer",
		"minZoom": 9,
		"maxZoom": 24,
		"type": "symbol",
		"key": "水注记",
		"id": "水注记",
		"description": "水",
		"info": "水",
		"layout": {
			"text-font": ["微软雅黑", "微软雅黑"],
			"text-size": 13,
			"text-field": "{name}",
			"symbol-placement": "point",
			"icon-image": "220304_地下渠出水口",
			"icon-offset": [-2.5, 0],
			"text-offset": [2.5, 0],
			"visibility": "visible"
		},
		"source-layer": "水",
		"paint": {
			"text-color": "#525252",
			"text-halo-color": "#1A1A1A",
			"text-halo-width": 2
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "自然保护区注记",
		"id": "自然保护区注记",
		"description": "自然保护区信息",
		"info": "自然保护区信息",
		"layout": {
			"text-font": ["微软雅黑", "微软雅黑"],
			"text-size": 11,
			"text-field": "{name}",
			"visibility": "visible"
		},
		"source-layer": "自然保护区",
		"paint": {
			"text-halo-color": "#d0cece",
			"text-halo-width": 2,
			"text-color": "#ffffff"
		}
	}],
	"sprite": "http://develop.smaryun.com:6163/igs/rest/mrms/vtiles/sprite",
	"glyphs": "http://develop.smaryun.com:6163/igs/rest/mrms/vtiles/fonts/{fontstack}/{range}.pbf"
}
```

## 光明配色
``` json
{
	"version": 8,
	"id": "浅色地图",
	"name": "浅色地图",
	"sources": {
		"IGServer": {
			"type": "vector",
			"tiles": ["http://localhost:6163/igs/rest/mrms/tile/OSM全中国/{z}/{y}/{x}?type=cpbf"],
			"minZoom": 0,
			"maxZoom": 24
		}
	},
	"layers": [{
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "background",
		"key": "背景底色",
		"id": "背景底色",
		"description": "图层信息",
		"info": "图层信息",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "背景底色",
		"paint": {
			"background-color": "#F6F6F4",
			"background-opacity": {
				"stops": [
					[0, 0],
					[10, 1],
					[20, 1]
				]
			}
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "背景图",
		"id": "背景图",
		"description": "背景图",
		"info": "背景图",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "背景图",
		"paint": {
			"fill-color": "#F6F6F4"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "省级行政区",
		"id": "省级行政区",
		"description": "省级行政区",
		"info": "省级行政区",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "省级行政区",
		"paint": {
			"fill-color": "#ffffff"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "观光胜地",
		"id": "观光胜地",
		"description": "观光胜地",
		"info": "观光胜地",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "观光胜地",
		"paint": {
			"fill-color": "#ECEEED"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "公园POI面",
		"id": "公园POI面",
		"description": "公园POI面",
		"info": "公园POI面",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "公园POI面",
		"paint": {
			"fill-color": "#ECEEED"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "医院",
		"id": "医院",
		"description": "医院",
		"info": "医院",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "医院",
		"paint": {
			"fill-color": "#ECEEED"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "大学",
		"id": "大学",
		"description": "大学",
		"info": "大学",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "大学",
		"paint": {
			"fill-color": "#ECEEED"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "学校",
		"id": "学校",
		"description": "学校",
		"info": "学校",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "学校",
		"paint": {
			"fill-color": "#ECEEED"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "动物园",
		"id": "动物园",
		"description": "动物园",
		"info": "动物园",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "动物园",
		"paint": {
			"fill-color": "#ECEEED"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "图书馆",
		"id": "图书馆",
		"description": "图书馆",
		"info": "图书馆",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "图书馆",
		"paint": {
			"fill-color": "#ECEEED"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "高尔夫",
		"id": "高尔夫",
		"description": "高尔夫",
		"info": "高尔夫",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "高尔夫",
		"paint": {
			"fill-color": "#ECEEED"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "体育馆",
		"id": "体育馆",
		"description": "体育馆",
		"info": "体育馆",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "体育馆",
		"paint": {
			"fill-color": "#ECEEED"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "POI",
		"id": "POI",
		"description": "POI",
		"info": "POI",
		"layout": {
			"visibility": "none"
		},
		"source-layer": "POI",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "矮树地",
		"id": "矮树地",
		"description": "矮树地",
		"info": "矮树地",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "矮树地",
		"paint": {
			"fill-color": "#E3E3E3"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "草地",
		"id": "草地",
		"description": "草地",
		"info": "草地",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "草地",
		"paint": {
			"fill-color": " #E3E3E3"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "分配土地",
		"id": "分配土地",
		"description": "分配土地",
		"info": "分配土地",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "分配土地",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "工厂",
		"id": "工厂",
		"description": "工厂",
		"info": "工厂",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "工厂",
		"paint": {
			"fill-color": "#D6D8E1"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "公园",
		"id": "公园",
		"description": "公园",
		"info": "公园",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "公园",
		"paint": {
			"fill-color": "#ECEEED"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "果园",
		"id": "果园",
		"description": "果园",
		"info": "果园",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "果园",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "荒地",
		"id": "荒地",
		"description": "荒地",
		"info": "荒地",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "荒地",
		"paint": {
			"fill-color": "#B8DDA5"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "军事用地",
		"id": "军事用地",
		"description": "军事用地",
		"info": "军事用地",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "军事用地",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "矿地",
		"id": "矿地",
		"description": "矿地",
		"info": "矿地",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "矿地",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "零售地",
		"id": "零售地",
		"description": "零售地",
		"info": "零售地",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "零售地",
		"paint": {
			"fill-color": " #E8E0ED"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "牧场",
		"id": "牧场",
		"description": "牧场",
		"info": "牧场",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "牧场",
		"paint": {
			"fill-color": "#37FF37"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "墓地",
		"id": "墓地",
		"description": "墓地",
		"info": "墓地",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "墓地",
		"paint": {
			"fill-color": " #D8E0BD"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "农业用地",
		"id": "农业用地",
		"description": "农业用地",
		"info": "农业用地",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "农业用地",
		"paint": {
			"fill-color": "#E3E3E3"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "葡萄园",
		"id": "葡萄园",
		"description": "葡萄园",
		"info": "葡萄园",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "葡萄园",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "森林",
		"id": "森林",
		"description": "森林",
		"info": "森林",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "森林",
		"paint": {
			"fill-color": "#ECEEED"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "商业用地",
		"id": "商业用地",
		"description": "商业用地",
		"info": "商业用地",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "商业用地",
		"paint": {
			"fill-color": "#E9E9E7"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "自然保护区",
		"id": "自然保护区",
		"description": "自然保护区",
		"info": "自然保护区",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "自然保护区",
		"paint": {
			"fill-color": "#ECEEED"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "娱乐用地",
		"id": "娱乐用地",
		"description": "娱乐用地",
		"info": "娱乐用地",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "娱乐用地",
		"paint": {
			"fill-color": " #E3E3E3"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "住宅用地",
		"id": "住宅用地",
		"description": "住宅用地",
		"info": "住宅用地",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "住宅用地",
		"paint": {
			"fill-color": "#E9E9E7",
			"fill-outline-color": "#DFDFDD"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "岛",
		"id": "岛",
		"description": "岛",
		"info": "岛",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "岛",
		"paint": {
			"fill-color": "#F5F5F5"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "城市",
		"id": "城市",
		"description": "城市",
		"info": "城市",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "城市",
		"paint": {
			"fill-color": "#ECEEED"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "城镇",
		"id": "城镇",
		"description": "城镇",
		"info": "城镇",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "城镇",
		"paint": {
			"fill-color": "#595959"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "地区",
		"id": "地区",
		"description": "地区",
		"info": "地区",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "地区",
		"paint": {
			"fill-color": "#E1E8DB"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "乡村",
		"id": "乡村",
		"description": "乡村",
		"info": "乡村",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "乡村",
		"paint": {
			"fill-color": "#D1E1CC"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "村庄",
		"id": "村庄",
		"description": "村庄",
		"info": "村庄",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "村庄",
		"paint": {
			"fill-color": "#CAD2D3"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "小村庄",
		"id": "小村庄",
		"description": "小村庄",
		"info": "小村庄",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "小村庄",
		"paint": {
			"fill-color": "#E3E3E3"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "郊区",
		"id": "郊区",
		"description": "郊区",
		"info": "郊区",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "郊区",
		"paint": {
			"fill-color": "#ECEEED"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "农田",
		"id": "农田",
		"description": "农田",
		"info": "农田",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "农田",
		"paint": {
			"fill-color": "#B8DDA5"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "所在地",
		"id": "所在地",
		"description": "所在地",
		"info": "所在地",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "所在地",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 12,
		"maxZoom": 24,
		"type": "fill-extrusion",
		"key": "建筑",
		"id": "建筑",
		"description": "建筑",
		"info": "建筑",
		"layout": {
			"visibility": "none"
		},
		"source-layer": "建筑",
		"paint": {
			"fill-extrusion-color": "#ede8e8",
			"fill-extrusion-height": {
				"stops": [
					[0, 0],
					[11, 40],
					[20, 200]
				]
			}
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "出租车站区",
		"id": "出租车站区",
		"description": "出租车站",
		"info": "出租车站",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "出租车站",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "飞机场区",
		"id": "飞机场区",
		"description": "飞机场",
		"info": "飞机场",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "飞机场",
		"paint": {
			"fill-color": "#BDE2DC"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "公交车站区",
		"id": "公交车站区",
		"description": "公交车站",
		"info": "公交车站",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "公交车站",
		"paint": {
			"fill-color": "#ECEEED"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "汽车站区",
		"id": "汽车站区",
		"description": "汽车站",
		"info": "汽车站",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "汽车站",
		"paint": {
			"fill-color": "#BDE2DC"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "机动轨道区",
		"id": "机动轨道区",
		"description": "机动轨道",
		"info": "机动轨道",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "机动轨道",
		"paint": {
			"fill-color": "#BDE2DC"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "机动站区",
		"id": "机动站区",
		"description": "机动站",
		"info": "机动站",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "机动站",
		"paint": {
			"fill-color": "#BDE2DC"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "码头渡轮区",
		"id": "码头渡轮区",
		"description": "码头渡轮",
		"info": "码头渡轮",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "码头渡轮",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "名胜古迹区",
		"id": "名胜古迹区",
		"description": "名胜古迹",
		"info": "名胜古迹",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "名胜古迹",
		"paint": {
			"fill-color": "#d0d0d0"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "堤坝区",
		"id": "堤坝区",
		"description": "堤坝",
		"info": "堤坝",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "堤坝",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "停车场区",
		"id": "停车场区",
		"description": "停车场",
		"info": "停车场",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "停车场",
		"paint": {
			"fill-color": "#CAD2D3"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "地下停车场区",
		"id": "地下停车场区",
		"description": "地下停车场",
		"info": "地下停车场",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "地下停车场",
		"paint": {
			"fill-color": "#D8E6ED"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "多层停车场区",
		"id": "多层停车场区",
		"description": "多层停车场",
		"info": "多层停车场",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "多层停车场",
		"paint": {
			"fill-color": "#D8E6ED"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "自行车停车场区",
		"id": "自行车停车场区",
		"description": "自行车停车场",
		"info": "自行车停车场",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "自行车停车场",
		"paint": {
			"fill-color": "#D8E6ED"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "公共服务区区",
		"id": "公共服务区区",
		"description": "公共服务区",
		"info": "公共服务区",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "公共服务区",
		"paint": {
			"fill-color": "#ECEEED"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "滑道区",
		"id": "滑道区",
		"description": "滑道",
		"info": "滑道",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "滑道",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "加油站区",
		"id": "加油站区",
		"description": "加油站",
		"info": "加油站",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "加油站",
		"paint": {
			"fill-color": "#E8E0ED"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "码头区",
		"id": "码头区",
		"description": "码头",
		"info": "码头",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "码头",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "瀑布区",
		"id": "瀑布区",
		"description": "瀑布",
		"info": "瀑布",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "瀑布",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "水坝区",
		"id": "水坝区",
		"description": "水坝",
		"info": "水坝",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "水坝",
		"paint": {
			"fill-color": "#FFFFFF"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "闸门区",
		"id": "闸门区",
		"description": "闸门",
		"info": "闸门",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "闸门",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "坝区",
		"id": "坝区",
		"description": "坝",
		"info": "坝",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "坝",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "冰川区",
		"id": "冰川区",
		"description": "冰川",
		"info": "冰川",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "冰川",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "洞穴区",
		"id": "洞穴区",
		"description": "洞穴",
		"info": "洞穴",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "洞穴",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "海滩区",
		"id": "海滩区",
		"description": "海滩",
		"info": "海滩",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "海滩",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "泉水区",
		"id": "泉水区",
		"description": "泉水",
		"info": "泉水",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "泉水",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "山峰区",
		"id": "山峰区",
		"description": "山峰",
		"info": "山峰",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "山峰",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "树区",
		"id": "树区",
		"description": "树",
		"info": "树",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "树",
		"paint": {
			"fill-color": "#F7F7F7"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "悬崖区",
		"id": "悬崖区",
		"description": "悬崖",
		"info": "悬崖",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "悬崖",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "水库区",
		"id": "水库区",
		"description": "水库",
		"info": "水库",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "水库",
		"paint": {
			"fill-color": "#CAD2D3"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "水区",
		"id": "水区",
		"description": "水",
		"info": "水",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "水",
		"paint": {
			"fill-color": "#CAD2D3"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "湿地区",
		"id": "湿地区",
		"description": "湿地",
		"info": "湿地",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "湿地",
		"paint": {
			"fill-color": "#CAD2D3"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "河流流域区",
		"id": "河流流域区",
		"description": "河流流域",
		"info": "河流流域",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "河流流域",
		"paint": {
			"fill-color": "#CBD3D4"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "船坞区",
		"id": "船坞区",
		"description": "船坞",
		"info": "船坞",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "船坞",
		"paint": {
			"fill-color": "#B5CFFF"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "fill",
		"key": "冰川地区区",
		"id": "冰川地区区",
		"description": "冰川地区",
		"info": "冰川地区",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "冰川地区",
		"paint": {
			"fill-color": "#FFFFFF"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "河流线",
		"id": "河流线",
		"description": "河流",
		"info": "河流",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "河流",
		"paint": {
			"line-color": "#CBD3D4"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "运河线",
		"id": "运河线",
		"description": "运河",
		"info": "运河",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "运河",
		"paint": {
			"line-color": "#CAD2D3",
			"line-width": {
				"stops": [
					[0, 1],
					[12, 2],
					[15, 3],
					[20, 5]
				]
			}
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "排水道线",
		"id": "排水道线",
		"description": "排水道",
		"info": "排水道",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "排水道",
		"paint": {
			"line-color": "#8DCBF7"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "溪流线",
		"id": "溪流线",
		"description": "溪流",
		"info": "溪流",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "溪流",
		"paint": {
			"line-color": "#CAD2D3"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "铁路线虚部",
		"id": "铁路线虚部",
		"description": "铁路",
		"info": "铁路",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "铁路",
		"paint": {
			"line-color": "#000000",
			"line-width": 3
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "铁路线实部",
		"id": "铁路线实部",
		"description": "铁路",
		"info": "铁路",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "铁路",
		"paint": {
			"line-dasharray": {
				"stops": [
					[0, [3, 3]],
					[10, [2, 4]],
					[15, [5, 5]],
					[20, [6, 6]]
				]
			},
			"line-width": 2,
			"line-color": "#ffffff"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "小铁路线",
		"id": "小铁路线",
		"description": "小铁路",
		"info": "小铁路",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "小铁路",
		"paint": {
			"line-color": "#ffffff"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "窄轨铁路",
		"id": "窄轨铁路",
		"description": "窄轨铁路",
		"info": "窄轨铁路",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "窄轨铁路",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "单轨铁路",
		"id": "单轨铁路",
		"description": "单轨铁路",
		"info": "单轨铁路",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "单轨铁路",
		"paint": {
			"line-width": 1.5,
			"line-color": "#ffffff"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "电车轨道",
		"id": "电车轨道",
		"description": "电车轨道",
		"info": "电车轨道",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "电车轨道",
		"paint": {
			"line-color": "#ffffff",
			"line-width": 2
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "缆索轨道",
		"id": "缆索轨道",
		"description": "缆索轨道",
		"info": "缆索轨道",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "缆索轨道",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "轻轨轨道",
		"id": "轻轨轨道",
		"description": "轻轨轨道",
		"info": "轻轨轨道",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "轻轨轨道",
		"paint": {
			"line-color": "#a363b1",
			"line-width": {
				"stops": [
					[0, 1],
					[20, 2]
				]
			}
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "地铁",
		"id": "地铁",
		"description": "地铁",
		"info": "地铁",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "地铁",
		"paint": {
			"line-color": "#DEE2E3",
			"line-width": {
				"stops": [
					[0, 1],
					[10, 3],
					[15, 7],
					[20, 10]
				]
			}
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "人行道",
		"id": "人行道",
		"description": "人行道",
		"info": "人行道",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "人行道",
		"paint": {
			"line-color": "#ffffff"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "轨道",
		"id": "轨道",
		"description": "轨道",
		"info": "轨道",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "轨道",
		"paint": {
			"line-color": "#ffffff"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "轨道_向导_1",
		"id": "轨道_向导_1",
		"description": "轨道_向导_1",
		"info": "轨道_向导_1",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "轨道_向导_1",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "轨道_向导_2",
		"id": "轨道_向导_2",
		"description": "轨道_向导_2",
		"info": "轨道_向导_2",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "轨道_向导_2",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "轨道_向导_3",
		"id": "轨道_向导_3",
		"description": "轨道_向导_3",
		"info": "轨道_向导_3",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "轨道_向导_3",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "轨道_向导_4",
		"id": "轨道_向导_4",
		"description": "轨道_向导_4",
		"info": "轨道_向导_4",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "轨道_向导_4",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "轨道_向导_5",
		"id": "轨道_向导_5",
		"description": "轨道_向导_5",
		"info": "轨道_向导_5",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "轨道_向导_5",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 12,
		"maxZoom": 24,
		"type": "line",
		"key": "公共服务道路",
		"id": "公共服务道路",
		"description": "公共服务道路",
		"info": "公共服务道路",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "公共服务道路",
		"paint": {
			"line-color": "#ffffff",
			"line-width": {
				"stops": [
					[0, 1],
					[11, 1.25],
					[20, 4]
				]
			},
			"line-dasharray": [1, 1]
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "小路线",
		"id": "小路线",
		"description": "小路",
		"info": "小路",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "小路",
		"paint": {
			"line-color": "#ffffff"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "一级道路",
		"id": "一级道路",
		"description": "一级道路",
		"info": "一级道路",
		"layout": {
			"line-cap": "round",
			"visibility": "visible"
		},
		"filter": ["all", ["==", "编码", "空"]],
		"source-layer": "一级道路",
		"paint": {
			"line-color": "#fff",
			"line-width": {
				"stops": [
					[0, 1.31],
					[10, 2.97],
					[15, 7],
					[20, 10]
				]
			}
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "一级道路_链接",
		"id": "一级道路_链接",
		"description": "一级道路_链接",
		"info": "一级道路_链接",
		"layout": {
			"line-cap": "round",
			"visibility": "visible"
		},
		"source-layer": "一级道路_链接",
		"paint": {
			"line-color": "#fff"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "二级道路",
		"id": "二级道路",
		"description": "二级道路",
		"info": "二级道路",
		"layout": {
			"line-cap": "round",
			"visibility": "visible"
		},
		"source-layer": "二级道路",
		"paint": {
			"line-color": "#fff",
			"line-width": {
				"stops": [
					[0, 1],
					[12, 2],
					[15, 5],
					[20, 7]
				]
			}
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "二级道路_链接",
		"id": "二级道路_链接",
		"description": "二级道路_链接",
		"info": "二级道路_链接",
		"layout": {
			"line-cap": "round",
			"visibility": "visible"
		},
		"source-layer": "二级道路_链接",
		"paint": {
			"line-color": "#fff"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "三级道路",
		"id": "三级道路",
		"description": "三级道路",
		"info": "三级道路",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "三级道路",
		"paint": {
			"line-color": "#ffffff",
			"line-width": {
				"stops": [
					[0, 1],
					[12, 2],
					[15, 4],
					[20, 5]
				]
			}
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "三级道路_链接",
		"id": "三级道路_链接",
		"description": "三级道路_链接",
		"info": "三级道路_链接",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "三级道路_链接",
		"paint": {
			"line-color": "#ffffff"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "主干道线",
		"id": "主干道线",
		"description": "主干道",
		"info": "主干道",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "主干道",
		"paint": {
			"line-color": "#ffffff"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "主干道_链接",
		"id": "主干道_链接",
		"description": "主干道_链接",
		"info": "主干道_链接",
		"layout": {
			"line-cap": "round",
			"visibility": "visible"
		},
		"source-layer": "主干道_链接",
		"paint": {
			"line-color": "#ffffff"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "高速公路",
		"id": "高速公路",
		"description": "高速公路",
		"info": "高速公路",
		"layout": {
			"line-cap": "round",
			"visibility": "visible"
		},
		"filter": ["all", ["==", "fclass", "motorway"]],
		"source-layer": "高速公路",
		"paint": {
			"line-color": "#e8edeb",
			"line-width": {
				"stops": [
					[0, 1],
					[12, 2],
					[15, 5],
					[20, 7]
				]
			}
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "高速公路_链接",
		"id": "高速公路_链接",
		"description": "高速公路_链接",
		"info": "高速公路_链接",
		"layout": {
			"line-cap": "round",
			"visibility": "visible"
		},
		"source-layer": "高速公路_链接",
		"paint": {
			"line-color": "#e8edeb",
			"line-width": {
				"stops": [
					[0, 1],
					[12, 2],
					[15, 6],
					[20, 7]
				]
			}
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "大车道",
		"id": "大车道",
		"description": "大车道",
		"info": "大车道",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "大车道",
		"paint": {
			"line-color": "#ffffff"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "行人道",
		"id": "行人道",
		"description": "行人道",
		"info": "行人道",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "行人道",
		"paint": {
			"line-color": "#ffffff"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "流动街道",
		"id": "流动街道",
		"description": "流动街道",
		"info": "流动街道",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "流动街道",
		"paint": {
			"line-color": "#ffffff",
			"line-dasharray": [3, 2]
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "台阶线",
		"id": "台阶线",
		"description": "台阶",
		"info": "台阶",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "台阶",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "住宅道路",
		"id": "住宅道路",
		"description": "住宅道路",
		"info": "住宅道路",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "住宅道路",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "自行车道",
		"id": "自行车道",
		"description": "自行车道",
		"info": "自行车道",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "自行车道",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "不明道路",
		"id": "不明道路",
		"description": "不明道路",
		"info": "不明道路",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "不明道路",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "line",
		"key": "未分类道路",
		"id": "未分类道路",
		"description": "未分类道路",
		"info": "未分类道路",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "未分类道路",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "商业用地注记",
		"id": "商业用地注记",
		"description": "商业用地",
		"info": "商业用地",
		"layout": {
			"text-font": ["微软雅黑", "微软雅黑"],
			"text-size": 12,
			"text-field": "{name}",
			"icon-image": "340202_超市",
			"text-offset": [2.5, 0],
			"icon-offset": [-2.5, 0],
			"visibility": "visible"
		},
		"source-layer": "商业用地",
		"paint": {
			"text-color": "#ffffff",
			"text-halo-color": "#ECEEED",
			"text-halo-width": 2
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "POI点",
		"id": "POI点",
		"description": "POI点",
		"info": "POI点",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "POI点",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 10,
		"maxZoom": 24,
		"type": "symbol",
		"key": "住宅用地注记",
		"id": "住宅用地注记",
		"description": "住宅用地",
		"info": "住宅用地",
		"layout": {
			"text-font": ["微软雅黑", "微软雅黑"],
			"text-size": 11,
			"text-field": "{name}",
			"icon-image": "310300_单幢房屋、普通房屋",
			"icon-size": 1,
			"icon-offset": [-25, 0],
			"visibility": "visible"
		},
		"source-layer": "住宅用地",
		"paint": {
			"text-halo-color": "#9b9b9b",
			"text-halo-width": 2,
			"text-color": "#ffffff",
			"icon-translate": [-10, 0]
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "观光胜地注记",
		"id": "观光胜地注记",
		"description": "观光胜地",
		"info": "观光胜地",
		"layout": {
			"text-font": ["微软雅黑", "微软雅黑"],
			"text-field": "{name}",
			"text-size": 13,
			"icon-image": "350100_古迹、遗址",
			"icon-offset": [-2, 0],
			"text-offset": [2, 0],
			"visibility": "visible"
		},
		"source-layer": "观光胜地",
		"paint": {
			"text-halo-color": "#ECEEED",
			"text-halo-width": 2,
			"text-color": "#ffffff"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "大学注记",
		"id": "大学注记",
		"description": "大学图层信息",
		"info": "大学图层信息",
		"layout": {
			"text-font": ["微软雅黑", "微软雅黑"],
			"text-size": 12,
			"text-field": "{name}",
			"visibility": "visible"
		},
		"source-layer": "大学",
		"paint": {
			"text-halo-color": "#ECEEED",
			"text-halo-width": 2,
			"text-color": "#ffffff"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "医院注记",
		"id": "医院注记",
		"description": "医院图层信息",
		"info": "医院图层信息",
		"layout": {
			"text-font": ["微软雅黑", "微软雅黑"],
			"text-field": "{name}",
			"text-size": 12,
			"visibility": "visible"
		},
		"source-layer": "医院",
		"paint": {
			"text-halo-color": "#ECEEED",
			"text-halo-width": 2,
			"text-color": "#ffffff"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "工厂注记",
		"id": "工厂注记",
		"description": "工厂图层信息",
		"info": "工厂图层信息",
		"layout": {
			"text-font": ["微软雅黑", "微软雅黑"],
			"text-field": "{name}",
			"text-size": 12,
			"visibility": "visible"
		},
		"source-layer": "工厂",
		"paint": {
			"text-color": "#ffffff",
			"text-halo-color": "#D6D8E1",
			"text-halo-width": 2
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "学校注记",
		"id": "学校注记",
		"description": "学校图层信息",
		"info": "学校图层信息",
		"layout": {
			"text-font": ["微软雅黑", "微软雅黑"],
			"text-size": 11,
			"text-field": "{name}",
			"visibility": "visible"
		},
		"source-layer": "学校",
		"paint": {
			"text-halo-color": "#ECEEED",
			"text-halo-width": 2,
			"text-color": "#ffffff"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "首都点",
		"id": "首都点",
		"description": "首都点",
		"info": "首都点",
		"layout": {
			"text-field": "{name}",
			"text-font": ["微软雅黑", "微软雅黑"],
			"text-allow-overlap": true,
			"visibility": "visible"
		},
		"source-layer": "首都点",
		"paint": {
			"text-halo-width": 2,
			"text-halo-color": "#ffffff",
			"text-color": "#000000"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "省会城市",
		"id": "省会城市",
		"description": "省会城市",
		"info": "省会城市",
		"layout": {
			"text-field": "{name}",
			"text-font": ["微软雅黑", "微软雅黑"],
			"text-allow-overlap": true,
			"visibility": "visible"
		},
		"source-layer": "省会城市",
		"paint": {
			"text-halo-color": "#ffffff",
			"text-halo-width": 2,
			"text-color": "#4a4a4a"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "岛屿点",
		"id": "岛屿点",
		"description": "岛屿点",
		"info": "岛屿点",
		"layout": {
			"text-field": "{name}",
			"text-font": ["微软雅黑", "微软雅黑"],
			"text-size": 14,
			"visibility": "visible"
		},
		"source-layer": "岛屿点",
		"paint": {
			"text-halo-color": "#ffffff",
			"text-halo-width": 1.5
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "城市点",
		"id": "城市点",
		"description": "城市点",
		"info": "城市点",
		"layout": {
			"text-field": "{name}",
			"text-font": ["微软雅黑", "微软雅黑"],
			"text-size": 12,
			"visibility": "visible"
		},
		"source-layer": "城市点",
		"paint": {
			"text-halo-color": "#ffffff",
			"text-halo-width": 1
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "市镇点",
		"id": "市镇点",
		"description": "市镇点",
		"info": "市镇点",
		"layout": {
			"text-field": "{name}",
			"text-size": 11,
			"text-font": ["微软雅黑", "微软雅黑"],
			"visibility": "visible"
		},
		"source-layer": "市镇点",
		"paint": {
			"text-halo-color": "#ffffff",
			"text-halo-width": 1
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "地区点",
		"id": "地区点",
		"description": "地区点",
		"info": "地区点",
		"layout": {
			"text-field": "{name}",
			"text-size": 12,
			"text-font": ["微软雅黑", "微软雅黑"],
			"visibility": "visible"
		},
		"source-layer": "地区点",
		"paint": {
			"text-halo-color": "#ffffff",
			"text-halo-width": 1
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "乡村点",
		"id": "乡村点",
		"description": "乡村点",
		"info": "乡村点",
		"layout": {
			"text-field": "{name}",
			"text-font": ["微软雅黑", "微软雅黑"],
			"visibility": "visible"
		},
		"source-layer": "乡村点",
		"paint": {
			"text-color": "#ffffff",
			"text-halo-color": "#ffffff",
			"text-halo-width": 1
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "村庄点",
		"id": "村庄点",
		"description": "村庄点",
		"info": "村庄点",
		"layout": {
			"text-field": "{name}",
			"text-font": ["微软雅黑", "微软雅黑"],
			"text-size": 11,
			"visibility": "visible"
		},
		"source-layer": "村庄点",
		"paint": {
			"text-halo-color": "#ffffff",
			"text-halo-width": 1.5
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "小村庄点",
		"id": "小村庄点",
		"description": "小村庄点",
		"info": "小村庄点",
		"layout": {
			"text-font": ["微软雅黑", "微软雅黑"],
			"text-field": "{name}",
			"text-size": 11,
			"visibility": "visible"
		},
		"source-layer": "小村庄点",
		"paint": {
			"text-halo-color": "#ffffff",
			"text-halo-width": 1
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "所在地点",
		"id": "所在地点",
		"description": "所在地点",
		"info": "所在地点",
		"layout": {
			"text-font": ["微软雅黑", "微软雅黑"],
			"text-field": "{name}",
			"text-size": 11,
			"visibility": "visible"
		},
		"source-layer": "所在地点",
		"paint": {
			"text-halo-width": 2,
			"text-halo-color": "#ffffff"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "农场点",
		"id": "农场点",
		"description": "农场点",
		"info": "农场点",
		"layout": {
			"text-font": ["微软雅黑", "微软雅黑"],
			"text-field": "{name}",
			"visibility": "visible"
		},
		"source-layer": "农场点",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "郊区点",
		"id": "郊区点",
		"description": "郊区点",
		"info": "郊区点",
		"layout": {
			"text-font": ["微软雅黑", "微软雅黑"],
			"text-field": "{name}",
			"text-size": 13,
			"visibility": "visible"
		},
		"source-layer": "郊区点",
		"paint": {
			"text-halo-color": "#ffffff",
			"text-halo-width": 2
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "出租车停靠位置",
		"id": "出租车停靠位置",
		"description": "出租车停靠位置",
		"info": "出租车停靠位置",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "出租车停靠位置",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "电车点",
		"id": "电车点",
		"description": "电车点",
		"info": "电车点",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "电车点",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "渡轮码头点",
		"id": "渡轮码头点",
		"description": "渡轮码头点",
		"info": "渡轮码头点",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "渡轮码头点",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "公交车站点",
		"id": "公交车站点",
		"description": "公交车站点",
		"info": "公交车站点",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "公交车站点",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "机动轨道点",
		"id": "机动轨道点",
		"description": "机动轨道点",
		"info": "机动轨道点",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "机动轨道点",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "机动站点",
		"id": "机动站点",
		"description": "机动站点",
		"info": "机动站点",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "机动站点",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "汽车站点",
		"id": "汽车站点",
		"description": "汽车站点",
		"info": "汽车站点",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "汽车站点",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "名胜古迹点",
		"id": "名胜古迹点",
		"description": "名胜古迹点",
		"info": "名胜古迹点",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "名胜古迹点",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "自行车停车场点",
		"id": "自行车停车场点",
		"description": "自行车停车场点",
		"info": "自行车停车场点",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "自行车停车场点",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "闸门点",
		"id": "闸门点",
		"description": "闸门点",
		"info": "闸门点",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "闸门点",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "旋转点",
		"id": "旋转点",
		"description": "旋转点",
		"info": "旋转点",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "旋转点",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "停车点",
		"id": "停车点",
		"description": "停车点",
		"info": "停车点",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "停车点",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "停车场点",
		"id": "停车场点",
		"description": "停车场点",
		"info": "停车场点",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "停车场点",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "摄像头点",
		"id": "摄像头点",
		"description": "摄像头点",
		"info": "摄像头点",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "摄像头点",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "浅滩点",
		"id": "浅滩点",
		"description": "浅滩点",
		"info": "浅滩点",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "浅滩点",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "瀑布点",
		"id": "瀑布点",
		"description": "瀑布点",
		"info": "瀑布点",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "瀑布点",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "码头点",
		"id": "码头点",
		"description": "码头点",
		"info": "码头点",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "码头点",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "路灯点",
		"id": "路灯点",
		"description": "路灯点",
		"info": "路灯点",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "路灯点",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "加油站点",
		"id": "加油站点",
		"description": "加油站点",
		"info": "加油站点",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "加油站点",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "环状交叉路口",
		"id": "环状交叉路口",
		"description": "环状交叉路口",
		"info": "环状交叉路口",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "环状交叉路口",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "河堤点",
		"id": "河堤点",
		"description": "河堤点",
		"info": "河堤点",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "河堤点",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "公共服务点",
		"id": "公共服务点",
		"description": "公共服务点",
		"info": "公共服务点",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "公共服务点",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "多层停车场点",
		"id": "多层停车场点",
		"description": "多层停车场点",
		"info": "多层停车场点",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "多层停车场点",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "地下停车场点",
		"id": "地下停车场点",
		"description": "地下停车场点",
		"info": "地下停车场点",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "地下停车场点",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "堤坝点",
		"id": "堤坝点",
		"description": "堤坝点",
		"info": "堤坝点",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "堤坝点",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "船台滑道点",
		"id": "船台滑道点",
		"description": "船台滑道点",
		"info": "船台滑道点",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "船台滑道点",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "高速公路连接点",
		"id": "高速公路连接点",
		"description": "高速公路连接点",
		"info": "高速公路连接点",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "高速公路连接点",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "信号灯点",
		"id": "信号灯点",
		"description": "信号灯点",
		"info": "信号灯点",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "信号灯点",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "十字路口",
		"id": "十字路口",
		"description": "十字路口",
		"info": "十字路口",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "十字路口",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "树木点",
		"id": "树木点",
		"description": "树木",
		"info": "树木",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "树木",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "山顶点",
		"id": "山顶点",
		"description": "山顶",
		"info": "山顶",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "山顶",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "沙滩点",
		"id": "沙滩点",
		"description": "沙滩",
		"info": "沙滩",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "沙滩",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "泉眼点",
		"id": "泉眼点",
		"description": "泉眼",
		"info": "泉眼",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "泉眼",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "峭壁点",
		"id": "峭壁点",
		"description": "峭壁",
		"info": "峭壁",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "峭壁",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "火山口点",
		"id": "火山口点",
		"description": "火山口",
		"info": "火山口",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "火山口",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "洞穴口点",
		"id": "洞穴口点",
		"description": "洞穴口",
		"info": "洞穴口",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "洞穴口",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "冰洞点",
		"id": "冰洞点",
		"description": "冰洞",
		"info": "冰洞",
		"layout": {
			"visibility": "visible"
		},
		"source-layer": "冰洞",
		"paint": {}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "公园POI面注记",
		"id": "公园POI面注记",
		"description": "公园POI面",
		"info": "公园POI面",
		"layout": {
			"text-font": ["微软雅黑", "微软雅黑"],
			"text-field": "{name}",
			"text-size": 13,
			"symbol-avoid-edges": false,
			"text-allow-overlap": false,
			"text-ignore-placement": false,
			"text-optional": false,
			"symbol-spacing": 1500,
			"text-max-width": 80,
			"text-letter-spacing": 0,
			"icon-offset": [-2.5, 0],
			"icon-image": "340303_陵园",
			"text-offset": [2.5, 0],
			"visibility": "visible"
		},
		"source-layer": "公园POI面",
		"paint": {
			"text-color": "#ffffff",
			"text-halo-color": "#8C8C8C",
			"text-halo-width": 2
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "铁路注记",
		"id": "铁路注记",
		"description": "铁路",
		"info": "铁路",
		"layout": {
			"text-font": ["微软雅黑", "微软雅黑"],
			"text-field": "{name}",
			"text-size": 13,
			"symbol-placement": "line",
			"visibility": "visible"
		},
		"source-layer": "铁路",
		"paint": {
			"text-halo-color": "#ffffff",
			"text-halo-width": 2
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "一级道路注记",
		"id": "一级道路注记",
		"description": "一级道路",
		"info": "一级道路",
		"layout": {
			"text-field": "{name}",
			"text-font": ["微软雅黑", "微软雅黑"],
			"text-size": 11,
			"symbol-placement": "line",
			"visibility": "visible"
		},
		"source-layer": "一级道路",
		"paint": {
			"text-halo-color": "#ffffff",
			"text-halo-width": 2,
			"text-color": "#9b9b9b"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "2567f02b-a1b9-4301-8596-e9eb4abea26f",
		"id": "2567f02b-a1b9-4301-8596-e9eb4abea26f",
		"description": "一级道路",
		"info": "一级道路",
		"layout": {
			"text-field": "{name}",
			"text-font": ["微软雅黑", "微软雅黑"],
			"text-size": 11,
			"symbol-placement": "line",
			"visibility": "visible"
		},
		"source-layer": "二级道路",
		"paint": {
			"text-halo-color": "#ffffff",
			"text-halo-width": 2,
			"text-color": "#9b9b9b"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "高速公路注记",
		"id": "高速公路注记",
		"description": "高速公路",
		"info": "高速公路",
		"layout": {
			"text-field": "{name}",
			"text-font": ["微软雅黑", "微软雅黑"],
			"text-size": 11,
			"symbol-placement": "line",
			"visibility": "visible"
		},
		"source-layer": "高速公路",
		"paint": {
			"text-halo-color": "#ffffff",
			"text-halo-width": 1,
			"text-color": "#4a4a4a"
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "地铁注记",
		"id": "地铁注记",
		"description": "地铁",
		"info": "地铁",
		"layout": {
			"text-font": ["微软雅黑", "微软雅黑"],
			"text-field": "{name}",
			"symbol-placement": "line",
			"text-size": 13,
			"visibility": "visible"
		},
		"source-layer": "地铁",
		"paint": {
			"text-halo-color": "#ffffff",
			"text-halo-width": 2
		}
	}, {
		"source": "IGServer",
		"minZoom": 8,
		"maxZoom": 24,
		"type": "symbol",
		"key": "水注记",
		"id": "水注记",
		"description": "水",
		"info": "水",
		"layout": {
			"text-font": ["微软雅黑", "微软雅黑"],
			"text-size": 13,
			"text-field": "{name}",
			"symbol-placement": "point",
			"icon-image": "220304_地下渠出水口",
			"icon-offset": [-2.5, 0],
			"text-offset": [2.5, 0],
			"visibility": "visible"
		},
		"source-layer": "水",
		"paint": {
			"text-color": "#ffffff",
			"text-halo-color": "#78888a",
			"text-halo-width": 2
		}
	}, {
		"source": "IGServer",
		"minZoom": 0,
		"maxZoom": 24,
		"type": "symbol",
		"key": "自然保护区注记",
		"id": "自然保护区注记",
		"description": "自然保护区信息",
		"info": "自然保护区信息",
		"layout": {
			"text-font": ["微软雅黑", "微软雅黑"],
			"text-size": 11,
			"text-field": "{name}",
			"visibility": "visible"
		},
		"source-layer": "自然保护区",
		"paint": {
			"text-halo-color": "#d0cece",
			"text-halo-width": 2,
			"text-color": "#ffffff"
		}
	}],
	"sprite": "http://localhost:6163/igs/rest/mrms/vtiles/sprite",
	"glyphs": "http://localhost:6163/igs/rest/mrms/vtiles/fonts/{fontstack}/{range}.pbf"
}
```
