import MapgisMapv from "../../mapboxgl/src/components/overlay/MapvLayer.vue";
import MapgisWebMap from "../../mapboxgl/src/components/map/GlMap.vue";
import MapgisNavigationControl from "../../mapboxgl/src/components/UI/controls/NavigationControl"
import {BaseServer} from "@mapgis/webclient-es6-service";
import {utilCurve, geojson, utilCityCenter, DataSet} from "mapv";


export default {
    title: "二维/可视化/MapV-动画",
    component: MapgisMapv,
    argTypes: {}
};

const Template = (args, {argTypes}) => ({
    props: Object.keys(argTypes),
    components: {MapgisWebMap, MapgisMapv, BaseServer, MapgisNavigationControl},
    data() {
        return {
            mapStyle: 'mapbox://styles/mapbox/dark-v9',
            accessToken: 'pk.eyJ1IjoicGFybmRlZWRsaXQiLCJhIjoiY2o1MjBtYTRuMDhpaTMzbXhpdjd3YzhjdCJ9.sCoubaHF9-nhGTA-sgz0sA',
            center: [114.321317, 30.398428],
            zoom: 3
        }
    },
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
            var service = new BaseServer.IgsServiceBase(`http://${window.webclient.ip}/static/data/mapv/china.geojson`, {
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
      <mapgis-web-map :center="center" :accessToken="accessToken" :zoom="zoom" :map-style="mapStyle" style="height:60vh">
      <mapgis-navigation-control position="top-right"/>
      <mapgis-mapv v-bind="{...mapvGeojson}"></mapgis-mapv>
      <mapgis-mapv v-bind="{...mapvText}"></mapgis-mapv>
      <mapgis-mapv v-bind="{...mapvLine}"></mapgis-mapv>
      <mapgis-mapv v-bind="{...mapvPoint}"></mapgis-mapv>
      <mapgis-mapv v-bind="{...mapvTime}"></mapgis-mapv>
      </mapgis-web-map>
    `
});

export const mapv = Template.bind({});
mapv.args = {
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
