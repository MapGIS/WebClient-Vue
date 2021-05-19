import MapgisArcserverLegend from "../mapboxgl/src/components/UI/controls/legend/Legend.vue";
import MapgisWebMap from "../mapboxgl/src/components/map/GlMap.vue";
import ArcgisTileLayer from "../mapboxgl/src/components/layer/ArcGISServer/ArcGISTileLayer.js";

export default {
    title: "二维/交互-图例",
    component: MapgisArcserverLegend
};

const Template = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { MapgisArcserverLegend, MapgisWebMap, ArcgisTileLayer },
    data() {
        return {
            mapOptions: {
                crs: 'EPSG:4326', //经纬度一定要设置crs参数
                maxBounds: [
                    [-180, -90],
                    [180, 90]
                ],
                //设置地图样式信息
                mapStyle: {
                    //设置版本号，一定要设置
                    version: 8,
                    //添加来源
                    sources: {
                        dark: {
                            type: 'raster',
                            tiles: [
                                //来源请求地址，请求天地图提供的全球矢量地图WMTS服务
                                'http://t0.tianditu.gov.cn/vec_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles' +
                                '&TILECOL=' +
                                '{x}' +
                                '&TILEROW=' +
                                '{y}' +
                                '&TILEMATRIX=' +
                                '{z}' +
                                '&tk=' +
                                'f5347cab4b28410a6e8ba5143e3d5a35'
                            ],
                            //栅格瓦片的分辨率
                            tileSize: 256
                        }
                    },
                    //设置加载并显示来源的图层信息
                    layers: [
                        {
                            //图层id，要保证唯一性
                            id: 'dark',
                            //图层类型
                            type: 'raster',
                            //连接图层来源
                            source: 'dark',
                            //图层最小缩放级数
                            minzoom: 0,
                            //图层最大缩放级数
                            maxzoom: 22
                        }
                    ]
                },
                zoom: 7.5,
                center: [116.39, 40.2]
            },
            layerOptions: {
                layerId: 'tile-layer',
                type: 'raster',
                source: {
                    type: 'raster',
                    tiles: ['http://219.142.81.85/arcgis/rest/services/10wanZH/MapServer/tile/{z}/{y}/{x}'],
                    tileSize: 512,
                    mapgisOffset: -1
                },
                paint: {}
            }
        }
    },
    template: `
    <mapgis-web-map v-bind="{...mapOptions}" style="height:60vh">
        <arcgis-tile-layer v-bind="{...layerOptions}"></arcgis-tile-layer>
        <mapgis-arcserver-legend></mapgis-arcserver-legend>
    </mapgis-web-map>
    `
});

export const Legend = Template.bind({});
Legend.args = {}