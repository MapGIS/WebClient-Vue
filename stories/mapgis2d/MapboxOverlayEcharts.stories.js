import MapgisEchartsLayer from "../../mapboxgl/src/components/overlay/EchartsLayer.vue";
import MapgisWebMap from "../../mapboxgl/src/components/map/GlMap.vue";
import { BaseServer } from "@mapgis/webclient-es6-service";
import * as echarts from 'echarts';

export default {
    title:"二维/覆盖物/Echarts",
    component:MapgisEchartsLayer,
    argTypes:{}
};

const Template = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { MapgisWebMap, MapgisEchartsLayer, BaseServer},
    data(){
        return{
           mapStyle: 'mapbox://styles/mapbox/dark-v9',
           accessToken: 'pk.eyJ1IjoicGFybmRlZWRsaXQiLCJhIjoiY2o1MjBtYTRuMDhpaTMzbXhpdjd3YzhjdCJ9.sCoubaHF9-nhGTA-sgz0sA',
           center: [116.46, 39.92],
           zoom: 10,
           busLines:{},
           option:{}
        }
    },
    mounted() {
        this.initData();
    },
    methods:{
      initData() {
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
                this.initOptions(busLines);
            }
            let onError = function (e){
                console.log(e);
            }
            var service = new BaseServer.IgsServiceBase('https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples/data/asset/data/lines-bus.json',{
                eventListeners: {
                    scope: this,
                    processCompleted: onSuccess,
                    processFailed: onError
                }
            });
            service.processAsync();
       },
      initOptions(busLines) {
           let echartsOptions =  {
                    mapboxgl: {
                        roam: true
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
                };
           this.option = echartsOptions;
      }
    },
    template: `
    <mapgis-web-map :center="center" :accessToken="accessToken" :zoom="zoom" :map-style="mapStyle" style="height:60vh">
      <mapgis-echarts-layer :options.sync="option"></mapgis-echarts-layer>
    </mapgis-web-map>`
});

export const mapEcharts = Template.bind({});
let busLines = {};
mapEcharts.args = {

};
