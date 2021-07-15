# 融合组件(倾斜摄影与矢量图层的融合) mapgis-3d-mix-component

## 属性

### `vueKey`

- **类型:** `String`
- **可选**
- **非侦听属性**
- **默认值:** `default`
- **描述:**
  > mapgis-web-scene 组件的 ID，当使用多个 mapgis-web-scene 组件时，需要指定该值，来唯一标识 mapgis-web-scene 组件，<br/>
  > 同时 mapgis-web-scene 插槽中的组件也需要传入相同的 vueKey，让组件知道应该作用于哪一个 mapgis-web-scene。

### `vueIndex`

- **类型:** `Number`
- **必传**
- **非侦听属性**
- **描述:**
  > 使用该融合组件时：当 一个mapgis-web-scene组件中使用了mapgis-3d-igs-m3d和mapgis-3d-mix-component组件时，用来联系组件之间的标识符。
  

### `geoJson`

- **类型:** `String | Object`
- **必传**
- **非侦听属性**
- **描述:** 
  > 矢量图层的Geojson数据，geoJson参数是geojson格式的实体对象

### `ruleJson`

- **类型:** `Object`
- **必传**
- **非侦听属性**
- **描述:**
  > 样式模板，针对不同的行业，制定相同格式的不同样式的版本，参考如下：
  ```
  {
    "title": "地类名称",
    "type": "一级分类",
    "hasSecond": true,
    "rule": [
        {
            "title": "非建设用地",
            "type": "二级分类",
            "rule": [
                {"key": 1,"name": "果园", "color":"#F5D228"},
				{"key": 2,"name": "水浇地", "color":"#80CFE8"},
				{"key": 3,"name": "沟渠", "color":"#A0CDF0"},
				{"key": 4,"name": "河流水面", "color":"#96F0FF"},
				{"key": 5,"name": "坑塘水面", "color":"#A0CDF0"},
				{"key": 6,"name": "空闲地", "color":"#7F3F00"},
				{"key": 7,"name": "内陆滩涂", "color":"#D7FFFF"},
				{"key": 8,"name": "农村道路", "color":"#AA5550"},
				{"key": 9,"name": "其他林地", "color":"#8CD782"},
				{"key": 10,"name": "其他草地", "color":"#C8DC64"},
				{"key": 11,"name": "乔木林地", "color":"#7F3F00"},
				{"key": 12,"name": "有林地", "color":"#288C00"},
				{"key": 13,"name": "灌木林地", "color":"#55B964"}
            ],
			"color": "#03fdfe"
        },
        {
            "title": "建设用地",
            "type": "二级分类",
            "rule": [
			{"key": 14,"name": "城镇村道路用地", "color":"#C0FF3E"},
			{"key": 15,"name": "城镇住宅用地", "color":"#A9A9A9"},
			{"key": 16,"name": "高教用地", "color":"#A9A9A9"},
			{"key": 17,"name": "工业用地", "color":"#A83800"},
			{"key": 18,"name": "公路用地", "color":"#AA5550"},
			{"key": 19,"name": "公用设施用地", "color":"#FF007F"},
			{"key": 20,"name": "公园与绿地", "color":"#FF007F"},
			{"key": 22,"name": "广场用地", "color":"#FF007F"},
			{"key": 23,"name": "机关团体新闻出版用地", "color":"#FF007F"},
			{"key": 24,"name": "交通服务场站用地", "color":"#000000"},
			{"key": 25,"name": "科教文卫用地", "color":"#A9A9A9"},
			{"key": 26,"name": "农村宅基地", "color":"#778899"},
			{"key": 27,"name": "商业服务业设施用地", "color":"#A9A9A9"},
			{"key": 28,"name": "设施农用地", "color":"#DCB482"},
			{"key": 29,"name": "水工建筑用地", "color":"#E68264"},
			{"key": 30,"name": "特殊用地", "color":"#FF007F"},
			{"key": 31,"name": "物流仓储用地", "color":"#FF007F"},
			{"key": 32,"name": "养殖坑塘", "color":"#90AACF"}
            ],
			"color": "#708686"
        }
    ]
}

### `options`

- **类型:** `Object`
- **必传**
- **非侦听属性**
- **描述:** geojson矢量图层的entity的多边形Polygon层次结构渲染时所需要的参数，
  目前有如下参数：除了type为必传参数，其他为非必传。
```
 type:[String] geojson的类型, 目前只支持"Polygon"
 clampToGround: [boolean] 是否贴地 true|false
 alpha:[numeric]
 outlineColor: [String],指定轮廓线的颜色,若不传则默认和material材质的颜色保持一致
 outlineWidth: [numeric] 指定轮廓线的宽度。default:1
 ```

### `activeCircle`

- **类型:** `Boolean`
- **非必传**
- **非侦听属性** 默认为false
- **描述:**
> 该参数是来控制是否裁剪矢量图层和倾斜摄影模型的相交部分。裁剪后的结果是：以倾斜摄影的中心为圆心，半径为radius的圆多边形，与矢量图层相交得到的多边形

### `radius`

- **类型:** `Number`
- **非必传**
- **非侦听属性**
- **描述:** 
> 该参数是来控制裁剪的：以倾斜摄影的中心为圆心，半径为radius的圆多边形


### 简单使用

```vue
<template>
  <mapgis-web-scene
          lib-path="./statics/libs/cdn/cesium/Cesium.js"
          plugin-path="./statics/libs/cdn/zondyclient/webclient-cesium-plugin.min.js"
          style="height:100vh">
    <mapgis-3d-igs-m3d :url="m3dUrl2"  :vue-index="vueIndex" :auto-reset="autoReset" :maximum-screen-space-error="maximumScreenSpaceError"></mapgis-3d-igs-m3d>
    <mapgis-3d-mix-component
            :vue-index="vueIndex"
            :geo-json="geoJson"
            :rule-json="ruleJson"
            :options="options"
            :active-circle="activeCircle"
            :radius="radius"
    ></mapgis-3d-mix-component>
    <mapgis-3d-statebar></mapgis-3d-statebar>
  </mapgis-web-scene>
</template>

<script>
import axios from "axios";

export default {
  name: "cesiumComponentMix.vue",
  data() {
    return {
      autoReset: true,
      m3dUrl2: "http://localhost:6163/igs/rest/g3d/village",
      maximumScreenSpaceError: 5,
      vueIndex: 22,
      debugShowBoundingVolume: true,
      geoJson: "./data/village.geojson",
      ruleJson: "",
      activelegend: [],
      activeCircle:true,
      radius:3,
      options: {
        type: "Polygon",
        clampToGround: true,
        outlineWidth: 2,
        alpha: 0.8,
      },
    }
  },
  mounted() {
    this.initData();
  },
  methods: {
    initData() {
      let vm = this;
      axios.get('./data/rule.json').then((response) => {
        vm.ruleJson = response.data;
      })
      axios.get('./data/village.geojson').then((response) => {
        vm.geoJson = response.data;
      })
    },
    tabChange(data) {
      this.activelegend = data;
    },
    changeRadius(){
      this.radius = 1;
    },
    changeIsActiveCircle(){
      this.activeCircle = false;
    }
  }
}

</script>

<style scoped>
</style>
```
