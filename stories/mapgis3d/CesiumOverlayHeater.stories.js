import MapgisWebScene from "../../cesium/src/components/WebGlobe/WebGlobe.vue";
import Mapgis3dArcgisTileLayer from "../../cesium/src/components/Layer/ArcGISServer/ArcGISTileLayer";
import Mapgis3dIgsM3d from "../../cesium/src/components/M3D/M3d.vue";
import Mapgis3dCesiumHeaterLayer from "../../cesium/src/components/Overlay/themeLayer/heater/CesiumHeater.vue";
import Mapgis3dMapvHeaterLayer from "../../cesium/src/components/Overlay/themeLayer/heater/MapvHeater.vue";


export default {
    title: "三维/可视化/热力图",
    argTypes: {
        enableModel: false,
    },
};

const Template = (args, {argTypes}) => ({
    props: Object.keys(argTypes),
    components: {
        MapgisWebScene,
        "mapgis-3d-arcgis-tile-layer": Mapgis3dArcgisTileLayer,
        "mapgis-3d-igs-m3d": Mapgis3dIgsM3d,
        "mapgis-3d-cesium-heater-layer": Mapgis3dCesiumHeaterLayer,
        "mapgis-3d-mapv-heater-layer": Mapgis3dMapvHeaterLayer,
    },
    data() {
        return {
            m3dUrl: "http://localhost:6163/igs/rest/g3d/BIM模型",
            autoReset: true,
            maximumScreenSpaceError: 8,
            baseUrl:
                "http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer",
            layerStyle: {
                visible: true,
                opacity: 1,
                zIndex: 2,
            },
            tilingScheme: "EPSG:4326",
            showSettingPanel: false,
            type: "MAPV",
            activeType: "",
            field: "count",
            bound: null,
            geojson: null,
            cesiumOptions: {
                useClustering: true,
            },
            blur: 0.85,
            radius: 20,
            mapvOptions: {
                size: 20,
                max: 100,
            },
            toolbarBtns: [
                // {
                //   title: "mapv",
                //   icon: "mapgis-layer1",
                //   type: "MAPV",
                //   method: this.showHeaterLayer,
                // },
                // {
                //   title: "原生",
                //   icon: "mapgis-svgglobalselect",
                //   type: "CESIUM",
                //   method: this.showHeaterLayer,
                // },
                // {
                //   title: "清除",
                //   icon: "mapgis-shanchu_dianji",
                //   method: this.removeHeaterLayer,
                // },
                {
                    title: "设置",
                    icon: "mapgis-setting",
                    method: this.toggleSettingPanel,
                },
            ],
        };
    },
    computed: {
        controlStyle() {
            return {
                position: "absolute",
                top: "10px",
                left: "10px",
                background: "#fff",
                zIndex: 100,
            };
        },
        isMapv({activeType}) {
            return activeType === "MAPV";
        },
        isCesium({activeType}) {
            return activeType === "CESIUM";
        },
    },
    mounted() {
        let vm = this;
        if (vm.enableModel) {
            vm.bound = vm.mockCesiumBound();
            vm.geojson = vm.mockCesiumGeoJson();
        } else {
            vm.bound = vm.mockMapvBound();
            vm.geojson = vm.mockMapvGeoJson();
        }
    },
    watch:{
        enableModel:{
            handler(newVal,oldVal){
                if (newVal){
                    this.bound = this.mockCesiumBound();
                    this.geojson = this.mockCesiumGeoJson();
                } else {
                    this.bound = this.mockMapvBound();
                    this.geojson = this.mockMapvGeoJson();
                }
            }
        }
    },
    methods: {
        toggleSettingPanel() {
            this.showSettingPanel = !this.showSettingPanel;
        },
        mockCesiumBound() {
            return {
                east: 114.40417819778051,
                north: 30.469278757013154,
                south: 30.465101046619523,
                west: 114.39874205680401,
            };
        },
        mockCesiumGeoJson() {
            const {east, north, west, south} = this.bound;
            const [pointX, pointY] = window.Cesium.Cartesian3.fromDegreesArray([
                west,
                north,
                west,
                south,
                east,
                south,
                east,
                north,
            ]);
            const boundsHeight = window.Cesium.Cartesian3.distance(pointX, pointY);
            const boundsWidth = window.Cesium.Cartesian3.distance(pointX, pointY);
            const step = Math.ceil((boundsHeight / 20) * (boundsWidth / 20));
            const count = step > 10000 ? 10000 : step;
            const pointArr = window.Cesium.AlgorithmLib.getRandomPointByRect(
                west,
                south,
                east,
                north,
                count
            );
            const features = pointArr.map(({x, y}) => ({
                type: "Feature",
                properties: {
                    [this.field]: (Math.random() * 100).toFixed(2),
                },
                geometry: {
                    type: "Point",
                    coordinates: [x, y],
                },
            }));
            return {
                type: "FeatureCollection",
                dataCount: features.length,
                features,
            }
        },
        mockMapvBound() {
            return {
                east: 124.40417819778051,
                north: 39.469278757013154,
                south: 20.465101046619523,
                west: 80.39874205680401,
            };
        },
        mockMapvGeoJson() {
            return {
                type: "FeatureCollection",
                dataCount: 500,
                features: new Array(500).fill("Point").map((type, i) => ({
                    geometry: {
                        type,
                        coordinates: [75 + Math.random() * 50, 20.3 + Math.random() * 20],
                    },
                    properties: {
                        [this.field]: 30 * Math.random(),
                    },
                })),
            };
        },
        showHeaterLayer({type}) {
            this.type = type;
            this.activeType = type;
            if (!this.geojson) {
                if (this.enableModel) {
                    this.bound = this.mockCesiumBound();
                    this.geojson = this.mockCesiumGeoJson();
                } else {
                    this.bound = this.mockMapvBound();
                    this.geojson = this.mockMapvGeoJson();
                }
            }
            this.$refs.cesiumHeater.$_createCesiumHeater();
        },
        removeHeaterLayer() {
            this.geojson = null;
            this.activeType = "";
        },
    },
    template: `
      <mapgis-web-scene style="height: 95vh">
      <mapgis-3d-igs-m3d
          v-if="enableModel"
          :autoReset="autoReset"
          :maximumScreenSpaceError="maximumScreenSpaceError"
          :url="m3dUrl"/>
      <mapgis-3d-arcgis-tile-layer
          v-else
          :baseUrl="baseUrl"
          :layer-style="layerStyle"
          :tilingScheme="tilingScheme"/>
      <div class="heater-story-control" :style="controlStyle">
        <mapgis-ui-toolbar-command-group
            style="padding:4px 10px;justify-content:space-between;">
          <mapgis-ui-toolbar-command
              v-for="btn in toolbarBtns"
              @click="btn.method(btn)"
              :key="btn.title"
              :title="btn.title"
              :icon="btn.icon"
              :active="activeType === btn.type"
          />
        </mapgis-ui-toolbar-command-group>
        <mapgis-ui-setting-form
            layout="vertical"
            v-show="showSettingPanel"
            style="padding:0 10px;">
          <!--              <template v-if="isCesium">-->
          <mapgis-ui-form-item label="是否聚合">
            <mapgis-ui-radio-group v-model="cesiumOptions.useClustering">
              <mapgis-ui-radio :value="true">是</mapgis-ui-radio>
              <mapgis-ui-radio :value="false">否</mapgis-ui-radio>
            </mapgis-ui-radio-group>
          </mapgis-ui-form-item>
          <mapgis-ui-form-item label="半径大小">
            <mapgis-ui-input-number
                v-model="radius"
                :auto-width="true"
                :min="13"
            />
          </mapgis-ui-form-item>
          <mapgis-ui-form-item label="模糊大小">
            <mapgis-ui-input-number
                v-model="blur"
                :auto-width="true"
                :min="0.1"
                :max="1"
                :step="0.01"
            />
          </mapgis-ui-form-item>
          <!--              </template>-->
          <!--              <template v-else-if="isMapv">-->
          <!--                <mapgis-ui-form-item label="半径大小">-->
          <!--                  <mapgis-ui-input-number-->
          <!--                    v-model="mapvOptions.size"-->
          <!--                    :auto-width="true"-->
          <!--                    :min="13"-->
          <!--                  />-->
          <!--                </mapgis-ui-form-item>-->
          <!--                <mapgis-ui-form-item label="最大权重">-->
          <!--                  <mapgis-ui-input-number-->
          <!--                    v-model="mapvOptions.max"-->
          <!--                    :auto-width="true"-->
          <!--                    :min="1"-->
          <!--                  />-->
          <!--                </mapgis-ui-form-item>-->
          <!--              </template>-->
          <!-- <mapgis-ui-form-item label="填充颜色">
           <color-picker-setting v-model="options.gradient" />
          </mapgis-ui-form-item> -->
        </mapgis-ui-setting-form>
        <!--            <template v-if="activeType">-->
        <!--              <mapgis-3d-mapv-heater-layer-->
        <!--                v-if="isMapv"-->
        <!--                :options="mapvOptions"-->
        <!--                :geojson="geojson"-->
        <!--                :field="field"-->
        <!--              />-->
        <mapgis-3d-cesium-heater-layer
            :options="cesiumOptions"
            :blur="blur"
            :radius="radius"
            :data-source="geojson"
            :field="field"
            :bound="bound"
            ref="cesiumHeater"
        />
        <!--            </template>-->
      </div>
      </mapgis-web-scene>
    `,
});

export const 热力图 = Template.bind({});
热力图.args = {
    enableModel: false,
};
