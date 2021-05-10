<template>
  <div></div>
</template>
<script>
import { EchartsLayer } from "./echarts/EchartsLayer";
import { BaseServer } from "@mapgis/webclient-es6-service";
import * as echarts from 'echarts';
export default {
  name: "echartsLinesSeries",
  data() {
    return{
      busLines:{}
    }
  },
  inject: ["mapbox", "map"],
  methods: {
    createMapboxObject() {
      let vm = this;
      const { map } = this;
      const options = this.initOptions(vm.busLines);
      return new EchartsLayer(map, options);
    },
    initData() {
      let vm = this;
      var busLines = {};
      let onSuccess = function (data){
        var hStep = 300 / (data.value.length - 1);
        busLines = [].concat.apply([], data.value.map(function (busLine, idx) {
          var prevPt;
          var points = [];
          for (var i = 0; i < busLine.length; i += 2) {
            var pt = [busLine[i], busLine[i + 1]];
            if (i > 0) {
              pt = [
                prevPt[0] + pt[0],
                prevPt[1] + pt[1]
              ];
            }
            prevPt = pt;

            points.push([pt[0] / 1e4, pt[1] / 1e4]);
          }
          return {
            coords: points,
            lineStyle: {
              normal: {
                color: echarts.color.modifyHSL('#5A94DF', Math.round(hStep * idx))
              }
            }
          };
        }))
        vm.busLines = busLines;
        this.echartsLayer = this.createMapboxObject();
        this.echartsLayer.addTo(this.map);
      }
      let onError = function (e){
        console.log(e);
      }
      var service = new BaseServer.IgsServiceBase('https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples/data/asset/data/lines-bus.json',{
          eventListeners: {
            scope: vm,
            processCompleted: onSuccess,
            processFailed: onError
      }
      });
      service.processAsync();
      return vm.busLines;
    },
    initOptions(busLines) {
      const options = {
        mapboxgl: {
          center: [116.46, 39.92],
          zoom: 10,
          roam: true,
          mapStyle: {
            'styleJson': [
              {
                'featureType': 'water',
                'elementType': 'all',
                'stylers': {
                  'color': '#031628'
                }
              },
              {
                'featureType': 'land',
                'elementType': 'geometry',
                'stylers': {
                  'color': '#000102'
                }
              },
              {
                'featureType': 'highway',
                'elementType': 'all',
                'stylers': {
                  'visibility': 'off'
                }
              },
              {
                'featureType': 'arterial',
                'elementType': 'geometry.fill',
                'stylers': {
                  'color': '#000000'
                }
              },
              {
                'featureType': 'arterial',
                'elementType': 'geometry.stroke',
                'stylers': {
                  'color': '#0b3d51'
                }
              },
              {
                'featureType': 'local',
                'elementType': 'geometry',
                'stylers': {
                  'color': '#000000'
                }
              },
              {
                'featureType': 'railway',
                'elementType': 'geometry.fill',
                'stylers': {
                  'color': '#000000'
                }
              },
              {
                'featureType': 'railway',
                'elementType': 'geometry.stroke',
                'stylers': {
                  'color': '#08304b'
                }
              },
              {
                'featureType': 'subway',
                'elementType': 'geometry',
                'stylers': {
                  'lightness': -70
                }
              },
              {
                'featureType': 'building',
                'elementType': 'geometry.fill',
                'stylers': {
                  'color': '#000000'
                }
              },
              {
                'featureType': 'all',
                'elementType': 'labels.text.fill',
                'stylers': {
                  'color': '#857f7f'
                }
              },
              {
                'featureType': 'all',
                'elementType': 'labels.text.stroke',
                'stylers': {
                  'color': '#000000'
                }
              },
              {
                'featureType': 'building',
                'elementType': 'geometry',
                'stylers': {
                  'color': '#022338'
                }
              },
              {
                'featureType': 'green',
                'elementType': 'geometry',
                'stylers': {
                  'color': '#062032'
                }
              },
              {
                'featureType': 'boundary',
                'elementType': 'all',
                'stylers': {
                  'color': '#465b6c'
                }
              },
              {
                'featureType': 'manmade',
                'elementType': 'all',
                'stylers': {
                  'color': '#022338'
                }
              },
              {
                'featureType': 'label',
                'elementType': 'all',
                'stylers': {
                  'visibility': 'off'
                }
              }
            ]
          }
        },
        series: [{
          type: 'lines',
          coordinateSystem: 'mapboxgl',
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
        }, {
          type: 'lines',
          coordinateSystem: 'mapboxgl',
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
        }]
      }
      return options;
    },
    watchProp() {
      /* let { geojson, heaterLayer } = this;
      if (geojson && heaterLayer) {
        this.$watch("geojson", function (next) {
          if (this.initial) return;
          const data = this.initData(next)
          this.heaterLayer.updateData(data);
        });
      } */
    },
    mount() {
      this.initData();
      // this.echartsLayer = this.createMapboxObject();
    },
    unmount() {
      const { webGlobe, echartsLayer } = this;
      const viewer = webGlobe.viewer;
      return !viewer.isDestroyed() && echartsLayer.destroy();
    }
  },
  created() {
    this.mount();
    this.watchProp();
  }
};
</script>
