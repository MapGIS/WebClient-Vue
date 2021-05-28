import MapgisWebScene from "../cesium/src/components/WebGlobe/WebGlobe.vue";
import Mapgis3dArcgisTileLayer from "../cesium/src/components/Layer/ArcGISServer/ArcGISTileLayer";
import {BaseServer} from "@mapgis/webclient-es6-service";
import * as echarts from 'echarts';

export default {
    title: "三维/echarts-5.0.2升级",
};

const Template = (args, {argTypes}) => ({
    props: Object.keys(argTypes),
    components: {MapgisWebScene, BaseServer, Mapgis3dArcgisTileLayer},
    data() {
        return {
            mapStyle: 'mapbox://styles/mapbox/dark-v9',
            accessToken: 'pk.eyJ1IjoicGFybmRlZWRsaXQiLCJhIjoiY2o1MjBtYTRuMDhpaTMzbXhpdjd3YzhjdCJ9.sCoubaHF9-nhGTA-sgz0sA',
            center: [116.46, 39.92],
            zoom: 10,
            busLines: {},
            option: {}
        }
    },
    mounted() {
        this.initData();
    },
    methods: {
        handleMapLoad() {
            // let { webGlobe } = window;
            // let sceneManager = new CesiumZondy.Manager.SceneManager({
            //     viewer: webGlobe.viewer,
            // });
            //视点跳转（经度，纬度，视角高度，方位角，俯仰角，翻滚角）
            // sceneManager.flyToEx(114.299039, 30.594797, {
            //     height: 320,
            //     heading: -38,
            //     pitch: -22,
            //     roll: 0,
            // });
            let spec = {
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
            };
            window.webGlobe.viewer.scene.camera.setView(spec);
        },
        initData() {
            let onSuccess = function (data) {
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
            let onError = function (e) {
                console.log(e);
            }
            var service = new BaseServer.IgsServiceBase('https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples/data/asset/data/lines-bus.json', {
                eventListeners: {
                    scope: this,
                    processCompleted: onSuccess,
                    processFailed: onError
                }
            });
            service.processAsync();
        },
        initOptions(busLines) {
            let echartsOptions = {
                cesium: {
                    roam: true
                },
                series: [{
                    type: 'lines',
                    coordinateSystem: 'cesium',
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
                    coordinateSystem: 'cesium',
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
      <mapgis-web-scene style="height:60vh" @load="handleMapLoad">
      <mapgis-3d-arcgis-tile-layer :url="url" :layer-style="layerStyle" :srs="srs"/>
      <mapgis-3d-echarts-layer :options.sync="option" :center="center"></mapgis-3d-echarts-layer>
      </mapgis-web-scene>`
});

export const mapEcharts = Template.bind({});
let busLines = {};
mapEcharts.args = {
    url: "http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer",
    layerStyle: {
        visible: true,
        opacity: 1,
        zIndex: 2
    },
    srs: "EPSG:4326",
    cameraView: {
        destination:
            {
                // x: -2211984.1977517945,
                // y: 4535239.698163201,
                // z: 4206543.0941376835
                x:114.299039,
                y:30.594797,
                z:10
            }
    }
};
