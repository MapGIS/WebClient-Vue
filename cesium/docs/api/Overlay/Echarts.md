# Echarts

> mapgis-3d-echarts-layer

## 属性

All common [layers props](/zh/api/Layers/README.md#props)

### `options`

- **类型:** `Object`
- **默认值:** `{ cesium: { roam: true }, series: [{ coordinateSystem: 'cesium', type: 'lines' }] }`
- **侦听属性**
- **描述:** 参数 options 与 echarts 方法 setOption 中一致。echarts.options 使用 option
  来描述其对图表的各种需求，包括：有什么数据、要画什么图表、图表长什么样子、含有什么组件、组件能操作什么事情等等。简而言之，option 表述了：数据、数据如何映射成图形、交互行为。
- **注意:** mapbox 的地图在使用的时候需要设置对应的坐标系，以 mapboxgl 举例，关键代码如下：
  ```js
  // option的关键参数
  var option = {
    cesium: {
      //关键地方---1
      // 是否开启鼠标缩放和平移漫游。默认不开启。如果只想要开启缩放或者平移，可以设置成 'scale' 或者 'move'。设置成 true 为都开启
      roam: true
    },
    series: [
      {
        //关键地方---2
        // 坐标系
        coordinateSystem: "cesium"
      }
    ]
  };
  ```

## 示例

```vue
<template>
  <mapgis-web-scene style="height:60vh" :cameraView = "cameraView">
    <mapgis-3d-arcgis-tile-layer :baseUrl="url" :layer-style="layerStyle" :srs="srs"/>
    <mapgis-3d-echarts-layer :options.sync="option"></mapgis-3d-echarts-layer>
  </mapgis-web-scene>
</template>
<script>
import { MapgisWebScene,Mapgis3dArcgisTileLayer } from "@mapgis/webclient-vue-cesium";
import { BaseServer } from "@mapgis/webclient-es6-service";
import * as echarts from "echarts";

export default {
  components: { MapgisWebScene, Mapgis3dArcgisTileLayer, BaseServer },
  data() {
    return {
      busLines: {},
      option: {},
      url:"http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer",
      layerStyle: {
        visible: true,
        opacity: 1,
        zIndex: 2
      },
      srs: "EPSG:4326",
      cameraView:{
        destination: {
          x: -2409221.7854387695,
          y: 4705113.697479787,
          z: 4500333.6696071755
        },
        orientation: {
          heading: 3.2694614177406143,
          pitch: -1.4832321184766042,
          roll: 3.1369303868636838
        },
      }
    };
  },
  mounted() {
    this.initData();
  },
  methods: {
    initData() {
      let vm = this;
      let onSuccess = function(data) {
        var hStep = 300 / (data.value.length - 1);
        vm.busLines = [].concat.apply(
          [],
          data.value.map(function(busLine, idx) {
            var prevPt;
            var points = [];
            for (var i = 0; i < busLine.length; i += 2) {
              var pt = [busLine[i], busLine[i + 1]];
              if (i > 0) {
                pt = [prevPt[0] + pt[0], prevPt[1] + pt[1]];
              }
              prevPt = pt;

              points.push([pt[0] / 1e4, pt[1] / 1e4]);
            }
            return {
              coords: points,
              lineStyle: {
                normal: {
                  color: echarts.color.modifyHSL(
                    "#5A94DF",
                    Math.round(hStep * idx)
                  )
                }
              }
            };
          })
        );
        this.initOptions(vm.busLines);
      };
      let onError = function(e) {
        console.log(e);
      };
      var service = new BaseServer.IgsServiceBase(
        "https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples/data/asset/data/lines-bus.json",
        {
          eventListeners: {
            scope: this,
            processCompleted: onSuccess,
            processFailed: onError
          }
        }
      );
      service.processAsync();
    },
    initOptions(busLines) {
      let echartsOptions = {
        cesium: {
          roam: true
        },
        series: [
          {
            type: "lines",
            coordinateSystem: "cesium",
            polyline: true,
            data: busLines,
            silent: true,
            lineStyle: {
              // color: '#c23531',
              // color: 'rgb(200, 35, 45)',
              opacity: 0.2,
              width: 1
            },
            progressiveThreshold: 500,
            progressive: 200
          },
          {
            type: "lines",
            coordinateSystem: "mapboxgl",
            polyline: true,
            data: busLines,
            lineStyle: {
              width: 0
            },
            effect: {
              constantSpeed: 20,
              show: true,
              trailLength: 0.1,
              symbolSize: 1.5
            },
            zlevel: 1
          }
        ]
      };
      this.option = echartsOptions;
    }
  }
};
</script>
<style lang="css">
.main {
  height: 600px;
  width: 100%;
}
</style>
```
