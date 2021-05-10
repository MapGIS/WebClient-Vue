import MapgisEcharts from "../mapboxgl/src/components/overlay/echartsLinesSeries.vue";
import MapgisWebMap from "../mapboxgl/src/components/map/GlMap.vue";

export default {
    title:"二维/echarts-5.0.2升级",
    component:MapgisEcharts,
    argTypes:{}
};

const Template = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { MapgisWebMap, MapgisEcharts },
    data(){
        return{
           crs: 'EPSG:4326',
           center:[116,40],
           mapStyle: 'mapbox://styles/mapbox/dark-v9',
           accessToken: 'pk.eyJ1IjoicGFybmRlZWRsaXQiLCJhIjoiY2o1MjBtYTRuMDhpaTMzbXhpdjd3YzhjdCJ9.sCoubaHF9-nhGTA-sgz0sA'
        }
    },
    template: `
    <mapgis-web-map :crs="crs" :center="center" :accessToken="accessToken" :zoom=9 :map-style="mapStyle">
      <mapgis-echarts></mapgis-echarts>
    </mapgis-web-map>`
});

export const mapEcharts = Template.bind({});

mapEcharts.args = {
};