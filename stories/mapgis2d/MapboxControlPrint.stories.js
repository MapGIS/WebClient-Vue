import MapgisPrint from "../../mapboxgl/src/components/UI/controls/print/Print.vue";
import MapgisWebMap from "../../mapboxgl/src/components/map/GlMap.vue";
import "../style/print.css";

export default {
  title: "二维/地图子组件/打印",
  component: MapgisPrint,
  argTypes: {},
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisPrint, MapgisWebMap },
  data() {
    return {
      mapOptions: {
        crs: "EPSG:4326", //经纬度一定要设置crs参数
        maxBounds: [
          [-180, -90],
          [180, 90],
        ],
        zoom: 7.5,
        center: [116.39, 40.2],
      },
      printStyle: {
        position: "absolute",
        zIndex: 700,
        right: "20px",
        top: "20px",
        // height: "360px",
        width: "300px",
      },
      scaleStyle: {
        position: "absolute",
        left: "10px",
        bottom: "10px",
        height: "50px",
        width: "240px",
      },
      legendColumn: 1,
      legendStyle: {
        position: "absolute",
        zIndex: 900,
        right: "5px",
        bottom: "10px",
        maxHeight: "300px",
        width: "260px",
      },
      tilesize: {
        tileSize: 256,
      },
    };
  },
  methods: {
    hidePrintCard() {
      if (this.$refs.collapseprint) {
        this.$refs.collapseprint.hide();
      }
    },
    handleBeforePrint() {},
    handleAfterPrint() {},
  },
  template: `
    <mapgis-web-map v-bind="{...mapOptions}" style="height:95vh">
    <mapgis-rastertile-layer :source="tilesize" layerId="天地图底图" url="http://t0.tianditu.com/DataServer?T=vec_c&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752" />
    <mapgis-rastertile-layer :source="tilesize" layerId="天地图注记" url="http://t0.tianditu.com/DataServer?T=cia_c&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752" />
      <mapgis-ui-collapse-card
        title="打印"
        ref="collapseprint"
        :outStyle="printStyle"
        position="top-right"
      >
        <mapgis-ui-iconfont type="mapgis-huizhi1" slot="icon-hiden" />
        <div slot="title">
          <span class="mapgis-custom-scale-card-title"> 绘制 </span>
        </div>
        <div @click="hidePrintCard" slot="extra">
          <mapgis-ui-iconfont type="mapgis-huizhi1" />
        </div>
        <mapgis-print 
          :delay="true"
          :delayTime="1000"
          @beforePrint="handleBeforePrint"
          @afterPrint="handleAfterPrint"
        />
      </mapgis-ui-collapse-card>
      <mapgis-ui-card class="mapgis-test-custom-scale">
        <mapgis-custom-scale :style="scaleStyle" />
      </mapgis-ui-card>
      <mapgis-ui-card class="mapgis-test-custom-legend">
        <mapgis-mvt-legend
          ref="mvtlegend"
          :column="legendColumn"
          :outStyle="legendStyle"
        />
      </mapgis-ui-card>
    </mapgis-web-map>
    `,
});

export const 打印 = Template.bind({});
打印.args = {};
