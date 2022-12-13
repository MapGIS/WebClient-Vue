import Mapgis3dStratifiedHousehold from "../../cesium/src/components/Analysis/StratifiedHousehold.vue";
import Mapgis3dRelationshipGraph from "../../cesium/src/components/UI/Popup/components/RelationshipGraph.vue";
import Markdown from "../../cesium/docs/api/analysis/Household.md";

export default {
  title: "三维/数据图层/M3D模型/MapGIS",
  component: Mapgis3dStratifiedHousehold,
  argTypes: {
    enablePopup: true,
    enableDynamicQuery: false,
    enableStratifiedHouse: true,
    layers: [],
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { Mapgis3dStratifiedHousehold },
  data() {
    return {
      relationshipGraphShow: false,
      relationshipInfo: null,
    };
  },
  methods: {
    handleMapload() {
      const vm = this;
    },
    closeRelationshipGraph() {
      this.$nextTick(() => {
        this.$refs.stratifiedHousehold.resizeGraph().then(() => {
          this.$refs.stratifiedHousehold.restoreFloor();
        });
        // 窗口退出全屏
        this.$refs.relationshipGraphWindow.fullScreen = false;
      });
    },
    onResize() {
      this.$nextTick(() => {
        this.$refs.mapgisRelationshipGraph.resizeGraph();
      });
    },
    changeFloor(data) {
      this.$nextTick(() => {
        this.$refs.stratifiedHousehold.changeFloor(data);
      });
    },
    showRelationshipGraph(info) {
      this.$nextTick(() => {
        this.relationshipInfo = info;
        // 重新渲染
        if (this.relationshipGraphShow) {
          this.$refs.mapgisRelationshipGraph.init();
        } else {
          this.relationshipGraphShow = true;
        }

        if (info.isFloor) {
          if (this.$refs.stratifiedHousehold.prevFloorId) {
            this.$refs.stratifiedHousehold.resizeGraph().then(() => {
              this.$refs.stratifiedHousehold.lockFloor(info.layerIndex);
            });
          } else {
            this.$refs.stratifiedHousehold.lockFloor(info.layerIndex);
          }
        } else {
          this.$refs.stratifiedHousehold.restoreOrigindVisible();
          this.$refs.stratifiedHousehold.resizeGraph().then(() => {
            this.$refs.stratifiedHousehold.restoreFloor();
          });
        }
      });
    },
    floorHighlight(data) {
      this.$nextTick(() => {
        this.$refs.stratifiedHousehold.floorHighlight(data);
      });
    },
    houseHighlight(data) {
      this.$nextTick(() => {
        this.$refs.stratifiedHousehold.houseHighlight(data);
      });
    },
    handleProjectScreen(file) {
      if (!this.getProjectorStatus(file.name)) {
        const { layerId, layerTitle } = this;
        const {
          vFOV,
          orientationHeading,
          orientationRoll,
          positionX,
          positionY,
          positionZ,
          hFOV,
          orientationPitch,
        } = file;
        const cameraPosition = {
          x: positionX,
          y: positionY,
          z: positionZ,
        };
        const Orientation = {
          heading: orientationHeading,
          pitch: orientationPitch,
          roll: orientationRoll,
        };

        ProjectorManager.addProjector(
          layerId, // this.exhibition.id,
          layerTitle, // this.exhibition.name,
          file.name,
          file.url,
          "video",
          file.type,
          file.url,
          "",
          "",
          true,
          cameraPosition,
          Orientation,
          hFOV,
          vFOV
        );
        this.setProjectorStatus(file.name, true);
      } else {
        this.setProjectorStatus(file.name);
      }
    },
  },
  template: `<mapgis-web-scene @load="handleMapload" style="height:95vh">    
    <mapgis-3d-scene-layer v-bind="$props.g3d" />
    <mapgis-3d-stratified-household style="position: absolute;top: 10px;left: 10px;" v-bind="$props" @show-relationship-graph="showRelationshipGraph" ref="stratifiedHousehold" />
    <!-- <mp-window-wrapper :visible="relationshipGraphShow"> -->
      <mapgis-ui-window
        class="relationship-graph-wrapper"
        ref="relationshipGraphWindow"
        @window-size="onResize"
        @update:visible="closeRelationshipGraph"
        :visible.sync="relationshipGraphShow"
        :min-width="1000"
        :mix-height="720"
        :has-padding="relationshipWindowPadding"
        anchor="bottom-center"
        title="关系图谱"
      >
        <div v-if="relationshipGraphShow">
          <mapgis-3d-relationship-graph
            ref="mapgisRelationshipGraph"
            :info="relationshipInfo"
            v-bind="$props"
            @floor-highlight="floorHighlight"
            @house-highlight="houseHighlight"
            @change-floor="changeFloor"
            @project-screen="handleProjectScreen"
          />
        </div>
      </mapgis-ui-window>
       <!-- </mp-window-wrapper> -->
    <mapgis-3d-statebar />
  </mapgis-web-scene>`,
});

export const 分层分户 = Template.bind({});
分层分户.args = {
  g3d: {
    url: `http://${window.webclient.igsIp}:${window.webclient.igsPort}/igs/rest/g3d/分层分户`,
    vueIndex: "73CBB58E-C31B-2C50-08F3-DBD70DDED1BCi",
  },
  enablePopup: true,
  enableDynamicQuery: false,
  enableStratifiedHouse: true,
  layers: [
    {
      isHousehold: false,
      title: "分层分户10层",
      vueIndex: "73CBB58E-C31B-2C50-08F3-DBD70DDED1BCi",
    },
  ],
  dataStoreIp: "192.168.83.188",
  dataStoreDataset: "Graph3/GraphDataset1",
  dataStorePort: "9014",
  dataStoreStep: 2,
  enableCollapse: false,
  relationshipWindowPadding: false,
  relationshipConfig: {
    dataStore1: {
      name: "楼幢",
      nodeName: "栋号",
      detailField:
        "分摊建筑面积，地上层数，地下层数，坐落，备注，套内建筑面积，小区名称，幢ID，建筑面积，总层数，栋号，竣工日期，项目名称",
    },
    dataStore2: {
      name: "楼层",
      nodeName: "楼层号",
      detailField: "楼层号",
    },
    dataStore3: {
      name: "房屋",
      nodeName: "室号部位",
      detailField:
        "不动产单元号，分摊建筑面积，分摊系数，备注，套内建筑面积，室号部位，层号，建筑面积，户号，房屋坐落",
    },
    dataStore4: {
      name: "权利人",
      nodeName: "权利人名称",
      detailField:
        "权利人名称，权利人性质，性别，民族，出生日期，地址，籍贯，电话，证件种类，法人代表，备注",
    },
  },
};

分层分户.parameters = {
  docs: {
    description: {
      component: Markdown,
    },
  },
};
