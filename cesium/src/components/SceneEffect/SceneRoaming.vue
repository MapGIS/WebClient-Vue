<template>
  <div>
    <slot>
      <div class="mapgis-widget-scene-roaming">
        <div v-if="!roaming">
          <mapgis-ui-button
            v-if="!interactiveAdding"
            type="primary"
            class="full-width"
            @click="onAddPathStart"
          >
            添加路线
          </mapgis-ui-button>
          <div v-else class="add-path-status">
            <mapgis-ui-button
              @click="onAddPathCancel"
              class="add-path-status-action"
            >
              取消
            </mapgis-ui-button>
            <mapgis-ui-button
              type="primary"
              class="add-path-status-action"
              @click="onAddPathComplete"
              :disabled="addedPositions.length < 2"
            >
              完成
            </mapgis-ui-button>
          </div>
          <div v-if="!interactiveAdding" class="path-container">
            <mapgis-ui-group-tab :title="pathTotal">
              <mapgis-ui-toolbar slot="handle" :bordered="false">
                <mapgis-ui-toolbar-command
                  icon="mapgis-save"
                  title="保存"
                  @click="_savePaths"
                ></mapgis-ui-toolbar-command>
              </mapgis-ui-toolbar>
            </mapgis-ui-group-tab>
            <div class="path-list">
              <path-item
                :key="index"
                v-for="(item, index) in pathsCopy"
                :path="item"
                @goto-path="onGotoPath(item)"
                @delete-path="onDeletePath(item)"
              />
            </div>
          </div>
          <div v-else class="path-container">
            <mapgis-ui-group-tab title="路线坐标"> </mapgis-ui-group-tab>
            <mapgis-ui-table
              class="path-list position-list"
              size="small"
              :columns="addedPositionsColumns"
              :data-source="positions"
              :rowKey="
                record => {
                  return record.number;
                }
              "
            >
              <template slot="position" slot-scope="text">
                <div class="path-position" :title="text">{{ text }}</div>
              </template>
            </mapgis-ui-table>
          </div>
        </div>
        <div v-else>
          <div class="header" @click="onGotoHome">
            <div>
              <mapgis-ui-iconfont class="return" type="mapgis-left" />
            </div>
            <div class="name">{{ roamingPath.name }}</div>
          </div>
          <path-roaming
            ref="refPathRoaming"
            :positions="roamingPath.path"
            :models="models"
            :speed="roamingPath.para.speed"
            :exHeight="roamingPath.para.exHeight"
            :heading="roamingPath.para.heading"
            :pitch="roamingPath.para.pitch"
            :range="roamingPath.para.range"
            :animationType="roamingPath.para.animationType"
            :interpolationAlgorithm="roamingPath.para.interpolationAlgorithm"
            :isLoop="roamingPath.para.isLoop"
            :showPath="roamingPath.para.showPath"
            :showInfo="roamingPath.para.showInfo"
          ></path-roaming>
        </div>
      </div>
    </slot>
  </div>
</template>

<script>
import PathItem from "./PathRoaming/PathItem.vue";
import PathRoaming from "./PathRoaming/PathRoaming.vue";
import VueOptions from "../Base/Vue/VueOptions";
export default {
  name: "mapgis-3d-scene-roaming",
  inject: ["Cesium", "vueCesium", "viewer"],
  components: { PathItem, PathRoaming },
  props: {
    ...VueOptions,
    speed: {
      type: Number,
      default: 10
    },
    exHeight: {
      type: Number,
      default: 1
    },
    heading: {
      type: Number,
      default: 90
    },
    pitch: {
      type: Number,
      default: 0
    },
    range: {
      type: Number,
      default: 1
    },
    animationType: {
      type: Number,
      default: 1
    },
    interpolationAlgorithm: {
      type: String,
      default: "LagrangePolynomialApproximation"
    },
    isLoop: {
      type: Boolean,
      default: true
    },
    showPath: {
      type: Boolean,
      default: true
    },
    showInfo: {
      type: Boolean,
      default: true
    },
    models: {
      type: Array,
      required: true,
      default: () => []
    },
    paths: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  computed: {
    pathTotal() {
      return `${this.pathsCopy.length}条路线`;
    },
    positions() {
      return this.addedPositions.map((position, index) => {
        return { number: index + 1, ...position };
      });
    }
  },
  watch: {
    paths: {
      handler() {
        this.pathsCopy = this.paths;
      },
      deep: true,
      immediate: true
    }
  },
  data() {
    return {
      draw: undefined,
      interactiveAdding: false,
      roaming: false,
      roamingPath: null,
      addedPositions: [],
      addedPositionsColumns: [
        {
          title: "序号",
          dataIndex: "number",
          align: "center",
          ellipsis: true,
          width: 42
        },
        {
          title: "经度",
          dataIndex: "x",
          align: "center",
          ellipsis: true,
          scopedSlots: { customRender: "position" }
        },
        {
          title: "纬度",
          dataIndex: "y",
          align: "center",
          ellipsis: true,
          scopedSlots: { customRender: "position" }
        },
        {
          title: "高度",
          dataIndex: "z",
          align: "center",
          ellipsis: true,
          scopedSlots: { customRender: "position" },
          width: 60
        }
      ],
      pathsCopy: [],
      linePoints: [],
      polyline: undefined
    };
  },
  created() {},
  mounted() {
    this.mount();
  },
  destroyed() {
    this.unmount();
  },
  methods: {
    async createCesiumObject() {
      return new Promise(
        resolve => {
          resolve();
        },
        reject => {}
      );
    },
    mount() {
      const vm = this;
      let promise = this.createCesiumObject();
      promise.then(function(dataSource) {
        vm.$emit("load", vm);
      });
    },
    unmount() {
      this._stopAdded();
      this._stopRoaming();
      this.$emit("unload", this);
    },
    onAddPathStart() {
      this.interactiveAdding = true;
      this.draw = new this.Cesium.DrawElement(this.viewer);

      const material = this.Cesium.Material.fromType("Color");
      material.uniforms.color = new this.Cesium.Color(0.9, 0.6, 0.1, 0.5);
      this.linePoints = [];

      this.draw.startDrawingMarker({
        material,
        addDefaultMark: true,
        callback: coord => {
          // 获取当前坐标系标准
          const ellipsoid = this.viewer.scene.globe.ellipsoid;
          // 根据坐标系标准，将笛卡尔坐标转换为地理坐标
          const cartographic = ellipsoid.cartesianToCartographic(
            coord.position
          );
          // 获取该位置的经纬度坐标和镜头高度
          const lonDegree = this.Cesium.Math.toDegrees(cartographic.longitude);
          const latDegree = this.Cesium.Math.toDegrees(cartographic.latitude);
          const height = cartographic.height;

          this.addedPositions.push({
            x: lonDegree,
            y: latDegree,
            z: height
          });

          this.linePoints.push(lonDegree);
          this.linePoints.push(latDegree);
          this.linePoints.push(height);

          if (this.addedPositions.length > 1) {
            if (this.polyline) {
              this.viewer.entities.remove(this.polyline);
            }

            this.polyline = this.viewer.entities.add({
              name: "scence-roaming",
              polyline: {
                positions: this.Cesium.Cartesian3.fromDegreesArrayHeights(
                  this.linePoints
                ),
                width: 2,
                material: this.Cesium.Color.RED,
                clampToGround: false
              }
            });
          }
        }
      });
    },
    onAddPathComplete() {
      let pathId;
      if (this.pathsCopy.length > 0) {
        const pathIds = this.pathsCopy
          .map((item, index) => {
            return item.id || index + 1;
          })
          .sort((a, b) => {
            return a - b;
          });
        pathId = +pathIds[pathIds.length - 1] + 1;
      } else {
        pathId = 1;
      }
      const {
        speed,
        exHeight,
        heading,
        pitch,
        range,
        animationType,
        interpolationAlgorithm,
        isLoop,
        showPath,
        showInfo
      } = this;
      const path = {
        name: `路线${pathId}`,
        id: pathId,
        path: this.addedPositions,
        para: {
          speed,
          exHeight,
          heading,
          pitch,
          range,
          animationType,
          interpolationAlgorithm,
          isLoop,
          showPath,
          showInfo
        }
      };
      this.pathsCopy.push(path);

      this._stopAdded();
    },
    onAddPathCancel() {
      this._stopAdded();
    },
    onGotoPath(path) {
      this.roamingPath = path;
      this.roaming = true;
    },
    onGotoHome() {
      this.$refs.refPathRoaming.onClickStop();
      this.roaming = false;
    },
    onDeletePath(path) {
      const index = this.pathsCopy.indexOf(path);
      if (index > -1) {
        this.pathsCopy.splice(index, 1);
      }
    },
    _stopAdded() {
      if (this.draw) {
        this.draw.stopDrawing();
      }
      this.interactiveAdding = false;
      this.addedPositions = [];
      this.linePoints = [];

      if (this.polyline) {
        this.viewer.entities.remove(this.polyline);
      }
    },
    _stopRoaming() {
      this.$refs.refPathRoaming && this.$refs.refPathRoaming.onClickStop();
    },
    onGetPathRoaming() {
      return this.$refs.refPathRoaming;
    },
    _savePaths() {
      this.$emit("save-paths", this.pathsCopy);
    }
  }
};
</script>

<style lang="scss" scoped>
.mapgis-widget-scene-roaming {
  .full-width {
    width: 100%;
  }
  .add-path-status {
    display: flex;
    justify-content: space-between;
    .add-path-status-action {
      width: calc(50% - 4px);
    }
  }
  .path-container .path-list {
    width: 280px;
    margin: 0 auto;
  }

  .header {
    cursor: pointer;
    display: flex;
    align-content: center;
    .return {
      // color: @primary-color;
      margin: 0 10px 0 0;
    }
    .name {
      flex: 1;
    }
  }
}
::v-deep .mapgis-ui-table {
  font-size: 12px;
  .path-position {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
::v-deep .mapgis-ui-table-pagination.mapgis-ui-pagination {
  margin: 8px 0 0 0;
}
</style>
