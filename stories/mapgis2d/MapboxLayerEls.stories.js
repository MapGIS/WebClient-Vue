import MapgisElasticsearchLayer from "../../mapboxgl/src/components/layer/elasticsearch/ElasticsearchLayer.vue";

export default {
  title: "二维/可视化/弹性搜索",
  component: MapgisElasticsearchLayer,
  argTypes: {},
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisElasticsearchLayer },
  data() {
    return {
      mapOptions: {
        crs: "EPSG:4326", //经纬度一定要设置crs参数
        maxBounds: [
          [-180, -90],
          [180, 90],
        ],
        mapStyle: {
          version: 8,
          name: "街道地图",
          metadata: {},
          sources: {},
          layers: [],
          sprite: `http://${window.webclient.ip}:${window.webclient.port}/igs/rest/mrms/vtiles/sprite`,
          glyphs:
              `http://${window.webclient.ip}:${window.webclient.port}/igs/rest/mrms/vtiles/fonts/{fontstack}/{range}.pbf`,
        },
        zoom: 13,
        center: [114.8820937708428, 30.44895306216159],
      },

      elasticsearchVisible: true,
      elasticsearchMode: "heater",
      elasticsearchStyle: {
        position: "absolute",
        zIndex: 600,
        width: "300px",
        height: "90px",
        right: "10px",
        top: "20px",
      },

      innerbuckets: [
        {
          key: "18/214722/107771",
          doc_count: 39,
          gridCentroid: {
            location: {
              lat: 30.453995892491477,
              lon: 114.87646335162796,
            },
            count: 39,
          },
        },
        {
          key: "18/214748/107773",
          doc_count: 36,
          gridCentroid: {
            location: {
              lat: 30.452129300683737,
              lon: 114.9125459510833,
            },
            count: 36,
          },
        },
        {
          key: "18/214748/107774",
          doc_count: 27,
          gridCentroid: {
            location: {
              lat: 30.45027698390186,
              lon: 114.91182040423155,
            },
            count: 27,
          },
        },
        {
          key: "18/214716/107773",
          doc_count: 27,
          gridCentroid: {
            location: {
              lat: 30.451862085610628,
              lon: 114.86776992678642,
            },
            count: 27,
          },
        },
        {
          key: "18/214715/107773",
          doc_count: 27,
          gridCentroid: {
            location: {
              lat: 30.451913187280297,
              lon: 114.86740808933973,
            },
            count: 27,
          },
        },
        {
          key: "18/214762/107792",
          doc_count: 24,
          gridCentroid: {
            location: {
              lat: 30.429582986980677,
              lon: 114.93174995295703,
            },
            count: 24,
          },
        },
        {
          key: "18/214752/107758",
          doc_count: 24,
          gridCentroid: {
            location: {
              lat: 30.46956697013229,
              lon: 114.91797999478877,
            },
            count: 24,
          },
        },
        {
          key: "18/214737/107762",
          doc_count: 24,
          gridCentroid: {
            location: {
              lat: 30.464201724389568,
              lon: 114.89691019523889,
            },
            count: 24,
          },
        },
        {
          key: "18/214732/107765",
          doc_count: 24,
          gridCentroid: {
            location: {
              lat: 30.461330231046304,
              lon: 114.89029082818888,
            },
            count: 24,
          },
        },
        {
          key: "18/214721/107772",
          doc_count: 24,
          gridCentroid: {
            location: {
              lat: 30.45261134917382,
              lon: 114.87520622089505,
            },
            count: 24,
          },
        },
        {
          key: "18/214755/107772",
          doc_count: 21,
          gridCentroid: {
            location: {
              lat: 30.452950565543556,
              lon: 114.92213838866779,
            },
            count: 21,
          },
        },
        {
          key: "18/214747/107760",
          doc_count: 21,
          gridCentroid: {
            location: {
              lat: 30.466588119577086,
              lon: 114.91071367503277,
            },
            count: 21,
          },
        },
        {
          key: "18/214741/107763",
          doc_count: 21,
          gridCentroid: {
            location: {
              lat: 30.463595127553813,
              lon: 114.90225983118373,
            },
            count: 21,
          },
        },
        {
          key: "18/214736/107760",
          doc_count: 21,
          gridCentroid: {
            location: {
              lat: 30.467253696572566,
              lon: 114.89588879447963,
            },
            count: 21,
          },
        },
        {
          key: "18/214730/107757",
          doc_count: 21,
          gridCentroid: {
            location: {
              lat: 30.47014540527016,
              lon: 114.88747695593962,
            },
            count: 21,
          },
        },
        {
          key: "18/214727/107791",
          doc_count: 21,
          gridCentroid: {
            location: {
              lat: 30.430753831086413,
              lon: 114.88297652054045,
            },
            count: 21,
          },
        },
        {
          key: "18/214723/107788",
          doc_count: 21,
          gridCentroid: {
            location: {
              lat: 30.433638828274393,
              lon: 114.87750197627714,
            },
            count: 21,
          },
        },
        {
          key: "18/214721/107790",
          doc_count: 21,
          gridCentroid: {
            location: {
              lat: 30.431262271345727,
              lon: 114.875161533377,
            },
            count: 21,
          },
        },
        {
          key: "18/214713/107777",
          doc_count: 21,
          gridCentroid: {
            location: {
              lat: 30.446983704210393,
              lon: 114.86472196877003,
            },
            count: 21,
          },
        },
        {
          key: "18/214803/107775",
          doc_count: 18,
          gridCentroid: {
            location: {
              lat: 30.448849964886904,
              lon: 114.98749991878867,
            },
            count: 18,
          },
        },
      ],
    };
  },
  methods: {
    hideEls() {
      if (this.$refs.collapsecard) {
        this.$refs.collapsecard.hide();
      }
    },
  },
  template: `
    <mapgis-web-map v-bind="{...mapOptions}" style="height:60vh">
        <mapgis-rastertile-layer layerId="tdt" url="http://t0.tianditu.com/DataServer?T=vec_c&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752" />
        <mapgis-ui-collapse-card
          v-show="elasticsearchVisible"
          :style="elasticsearchStyle"
          position="top-right"
          ref="collapsecard"
        >
          <mapgis-ui-iconfont type="mapgis-ElasticSearch" slot="icon-hiden" />
          <div slot="title">
            <span>
              ElasticSearch 弹性搜索
            </span>
          </div>
          <div slot="extra" @click="hideEls">
            <mapgis-ui-iconfont type="mapgis-ElasticSearch" />
          </div>
          <mapgis-ui-button-group>
            <mapgis-ui-button @click="elasticsearchMode = 'heater'">
              热力
            </mapgis-ui-button>
            <mapgis-ui-button @click="elasticsearchMode = 'cluster'">
              聚类
            </mapgis-ui-button>
          </mapgis-ui-button-group>
        </mapgis-ui-collapse-card>
        <mapgis-elasticsearch-layer :buckets="innerbuckets" :mode="elasticsearchMode" />
    </mapgis-web-map>
    `,
});

export const 弹性搜索 = Template.bind({});
弹性搜索.args = {};
