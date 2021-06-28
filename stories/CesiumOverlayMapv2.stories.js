import MapgisWebScene from "../cesium/src/components/WebGlobe/WebGlobe.vue";
import Mapgis3dArcgisTileLayer from "../cesium/src/components/Layer/ArcGISServer/ArcGISTileLayer";
import {BaseServer} from "@mapgis/webclient-es6-service";
import {utilCurve, geojson, utilCityCenter, DataSet} from "mapv";


export default {
    title: "三维/覆盖物-MapV-动画",
};

const Template = (args, {argTypes}) => ({
    props: Object.keys(argTypes),
    components: {MapgisWebScene, BaseServer,Mapgis3dArcgisTileLayer},
    mounted() {
        this.initData();
    },
    methods: {
        initData() {
            var to = '北京';
            var pathInfo = new DataSet([{
                from: '河北',
                count: 354551,
                to: to,
            },
                {
                    from: '天津',
                    count: 97323,
                    to: to,
                },
                {
                    from: '山东',
                    count: 28664,
                    to: to,
                },
                {
                    from: '山西',
                    count: 16650,
                    to: to,
                },
                {
                    from: '辽宁',
                    count: 14379,
                    to: to,
                },
                {
                    from: '河南',
                    count: 10980,
                    to: to,
                },
                {
                    from: '内蒙古',
                    count: 9603,
                    to: to,
                },
                {
                    from: '江苏',
                    count: 4536,
                    to: to,
                },
                {
                    from: '上海',
                    count: 3556,
                    to: to,
                },
                {
                    from: '广东',
                    count: 2600,
                    to: to,
                },
            ]);
            let qianxiData = pathInfo.get();
            var lineData = [];
            var pointData = [];
            var textData = [];
            var timeData = [];

            var citys = {}

            for (var i = 0; i < qianxiData.length; i++) {
                var fromCenter = utilCityCenter.getCenterByCityName(qianxiData[i].from);
                var toCenter = utilCityCenter.getCenterByCityName(qianxiData[i].to);
                if (!fromCenter || !toCenter) {
                    continue;
                }
                citys[qianxiData[i].from] = qianxiData[i].count;
                citys[qianxiData[i].to] = 100;
                pointData.push({
                    geometry: {
                        type: 'Point',
                        coordinates: [fromCenter.lng, fromCenter.lat]
                    },
                    properties: {
                        count: 30 * Math.random()
                    },
                });
                pointData.push({
                    geometry: {
                        type: 'Point',
                        coordinates: [toCenter.lng, toCenter.lat]
                    },
                    properties: {
                        count: 30 * Math.random()
                    },
                });

                textData.push({
                    geometry: {
                        type: 'Point',
                        coordinates: [fromCenter.lng, fromCenter.lat]
                    },
                    properties: {
                        count: 30 * Math.random(),
                        text: qianxiData[i].from
                    },
                });
                textData.push({
                    geometry: {
                        type: 'Point',
                        coordinates: [toCenter.lng, toCenter.lat]
                    },
                    properties: {
                        count: 30 * Math.random(),
                        text: qianxiData[i].to
                    },
                });

                var curve = utilCurve.getPoints([fromCenter, toCenter]);

                for (let j = 0; j < curve.length; j++) {
                    timeData.push({
                        geometry: {
                            type: 'Point',
                            coordinates: curve[j]
                        },
                        properties: {
                            count: 1,
                            time: j
                        },
                    });
                }

                lineData.push({
                    geometry: {
                        type: 'LineString',
                        coordinates: curve
                        //coordinates: [[fromCenter.lng, fromCenter.lat], [toCenter.lng, toCenter.lat]]
                    },
                    properties: {
                        count: 30 * Math.random()
                    },
                });

            }
            let onSuccess = function (data) {
                this.mapvGeojson.geojson.features = data.features.filter(function (item) {
                    if (!citys[item.properties.name]) {
                        return false;
                    }
                    // item.properties={};
                    item.properties.count = citys[item.properties.name];
                    // item.count = citys[item.name];
                    return true;
                });
            }
            let onError = function (e) {
                console.log(e);
            }
            var service = new BaseServer.IgsServiceBase('http://develop.smaryun.com:8899/static/data/mapv/china.geojson', {
                eventListeners: {
                    scope: this,
                    processCompleted: onSuccess,
                    processFailed: onError
                }
            });
            service.processAsync();

            this.mapvPoint.geojson.features = pointData;
            this.mapvText.geojson.features = textData;
            this.mapvTime.geojson.features = timeData;
            this.mapvLine.geojson.features = lineData;
        }
    },
    template: `
      <mapgis-web-scene style="height:60vh">
      <mapgis-3d-arcgis-tile-layer :baseUrl="baseUrl" :layer-style="layerStyle" :tilingScheme="tilingScheme"/>
      <mapgis-3d-mapv-layer v-bind="{...mapvGeojson}"></mapgis-3d-mapv-layer>
      <mapgis-3d-mapv-layer v-bind="{...mapvText}"></mapgis-3d-mapv-layer>
      <mapgis-3d-mapv-layer v-bind="{...mapvLine}"></mapgis-3d-mapv-layer>
      <mapgis-3d-mapv-layer v-bind="{...mapvPoint}"></mapgis-3d-mapv-layer>
      <mapgis-3d-mapv-layer v-bind="{...mapvTime}"></mapgis-3d-mapv-layer>
      </mapgis-web-scene>
    `
});

export const mapv = Template.bind({});
mapv.args = {
    baseUrl:"http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer",
    layerStyle: {
        visible: true,
        opacity: 1,
        zIndex: 2
    },
    tilingScheme:"EPSG:4326",
    mapvGeojson: {
        options: {
            gradient: {
                0: 'rgba(55, 50, 250, 0.4)',
                1: 'rgba(55, 50, 250, 1)'
            },
            max: 354551,
            draw: 'intensity',
            // zIndex: 10
        },
        geojson: {
            features: []
        }
    },
    mapvText: {
        options: {
            context: '2d',
            draw: 'text',
            font: '14px Arial',
            fillStyle: 'white',
            shadowColor: 'yellow',
            shadowBlue: 10,
            zIndex: 11,
            shadowBlur: 10
        },
        geojson: {
            features: []
        }
    },
    mapvLine: {
        options: {
            context: '2d',
            strokeStyle: 'rgba(255, 250, 50, 0.8)',
            shadowColor: 'rgba(255, 250, 50, 1)',
            shadowBlur: 20,
            lineWidth: 2,
            zIndex: 100,
            draw: 'simple'
        },
        geojson: {
            features: []
        }
    },
    mapvPoint: {
        options: {
            context: '2d',
            fillStyle: 'rgba(254,175,3,0.7)',
            shadowColor: 'rgba(55, 50, 250, 0.5)',
            shadowBlur: 10,
            size: 5,
            zIndex: 10,
            draw: 'simple'
        },
        geojson: {
            features: []
        }
    },
    mapvTime: {
        options: {
            context: '2d',
            fillStyle: 'rgba(255, 250, 250, 0.5)',
            zIndex: 200,
            size: 2.5,
            animation: {
                type: 'time',
                stepsRange: {
                    start: 0,
                    end: 50
                },
                trails: 10,
                duration: 2,
            },
            draw: 'simple'
        },
        geojson: {
            features: []
        }
    },
};
