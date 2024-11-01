<template>
  <div>
    <slot>
      <div class="mapgis-widget-excavate-analysis">
        <mapgis-ui-row class="model">
          <mapgis-ui-checkbox-group
            v-if="checkboxOptions.length > 0"
            @change="onCheckboxGroupChange"
          >
            <mapgis-ui-row
              v-for="(option, index) in checkboxOptions"
              :key="`model-${index}`"
            >
              <mapgis-ui-checkbox
                :value="option.value"
                style="line-height: 32px"
              >
                {{ option.label }}
              </mapgis-ui-checkbox>
            </mapgis-ui-row>
          </mapgis-ui-checkbox-group>
          <div v-else>暂无数据！</div>
        </mapgis-ui-row>
        <mapgis-ui-select
          class="mapgis-3d-fill-image mapgis-3d-select"
          :autoWidth="true"
          size="default"
          v-model="selectTerrainWall"
          placeholder="请选择纹理"
        >
          <mapgis-ui-select-option
            v-for="(option, i) in terrainWallFillImages"
            :key="i"
            :value="option.value"
            >{{ option.label }}</mapgis-ui-select-option
          >
        </mapgis-ui-select>
        <mapgis-ui-select
          class="mapgis-3d-fill-image mapgis-3d-select"
          :autoWidth="true"
          size="default"
          v-model="selectTerrainGround"
          placeholder="请选择纹理"
        >
          <mapgis-ui-select-option
            v-for="(option, i) in terrainGroundFillImages"
            :key="i"
            :value="option.value"
            >{{ option.label }}</mapgis-ui-select-option
          >
        </mapgis-ui-select>
        <mapgis-ui-setting-footer>
          <mapgis-ui-button type="primary" @click="analysis"
            >分析</mapgis-ui-button
          >
          <mapgis-ui-button @click="removeCuttingPlane">清除</mapgis-ui-button>
        </mapgis-ui-setting-footer>
      </div>
    </slot>
  </div>
</template>

<script>
import { rgbaToHex } from "../Utils/common/color-util";
/* import { Util } from "@mapgis/webclient-vue-ui";
const { ColorUtil } = Util; */
import VueOptions from "../Base/Vue/VueOptions";
import BaseLayer from "./BaseLayer";
import {
  isEnableLighting,
  setEnableLighting,
  getLight,
  setLight,
  getDynamicAtmosphereLighting,
  setDynamicAtmosphereLighting,
  getDynamicAtmosphereLightingFromSun,
  setDynamicAtmosphereLightingFromSun,
} from "../WebGlobe/util";

export default {
  name: "mapgis-3d-terrain-aspect",
  inject: ["Cesium", "vueCesium", "viewer"],
  mixins: [BaseLayer],
  props: {
    ...VueOptions,
    /**
     * @type String  model | terrain
     * @description 开挖的图层类型
     */
    layerType: {
      type: String,
      default: "model",
    },
    models: {
      type: Array,
      default: () => [],
    },
  },
  watch: {
    models: {
      handler: function (layers) {
        console.log(layers, 'watch-layer');
        
        this.checkboxOptions = [];
        this.vueIndexs = [];
        this.layerIndexs = [];
        layers.forEach((layer) => {
          const { title, vueIndex } = layer;
          const obj = { label: title, value: vueIndex };
          this.checkboxOptions.push(obj);
        });
      },
      deep: true,
      immediate: true,
    },
  },
  data() {
    return {
      modelPositions: [],
      // checkbox选项合集
      checkboxOptions: [],
      // 选择项
      checked: [],
      drawElement: null,
      pnts: [],
      drawPositions: [],
      cutTool: null,
      selectTerrainGround: "",
      selectTerrainWall: "",
      terrainGroundFillImages: [
        {
          label: "默认纹理",
          value: "",
        },
        {
          label: "底面纹理1",
          value:
            "http://192.168.82.91:8200/NoneSpatialData/image/ground-texture-1.jpg",
        },
        {
          label: "底面纹理2",
          value:
            "http://192.168.82.91:8200/NoneSpatialData/image/ground-texture-2.jpg",
        },
        {
          label: "底面纹理3",
          value:
            "http://192.168.82.91:8200/NoneSpatialData/image/ground-texture-3.jpg",
        },
      ],

      terrainWallFillImages: [
        {
          label: "默认纹理",
          value: "",
        },
        {
          label: "剖面纹理1",
          value:
            "http://192.168.82.91:8200/NoneSpatialData/image/wall-texture-1.jpg",
        },
        {
          label: "剖面纹理2",
          value:
            "http://192.168.82.91:8200/NoneSpatialData/image/wall-texture-2.jpg",
        },
        {
          label: "剖面纹理3",
          value:
            "http://192.168.82.91:8200/NoneSpatialData/image/wall-texture-3.jpg",
        },
      ],

      isEnableLighting: undefined, // 光照是否已开启

      light: undefined, // 是否有light对象

      dynamicAtmosphereLighting: undefined,

      dynamicAtmosphereLightingFromSun: undefined,

      info: "坡向分析需要带法线地形。\r\n坡向按照东北西南的顺序表示方向,即0°表示坡向指向正东方向。",

      value: 1,
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.mount();
  },
  destroyed() {
    this.unmount();
  },
  methods: {
    onCheckboxGroupChange(val) {
      this.checked = [...val];
    },
    async createCesiumObject() {
      const { baseUrl, options } = this;
      return new Promise(
        (resolve) => {
          resolve();
        },
        (reject) => {}
      );
    },
    /**
     * 判断传入的m3d、Cesium3DTileset图层是否加载完毕
     */
    m3dIsReady() {
      const { vueKey, checked } = this;
      return new Promise((resolve, reject) => {
        if (checked.length > 0) {
          this.$_getAll3DTileSetArray(
            function (m3ds) {
              if (m3ds && m3ds.length > 0) {
                resolve(m3ds);
              } else {
                reject(null);
              }
            },
            vueKey,
            checked
          );
        } else {
          reject(null);
        }
      });
    },

    mount() {
      const { viewer, vueCesium, vueKey, vueIndex } = this;
      viewer.scene.globe.depthTestAgainstTerrain = true;
      const vm = this;
      let promise = this.createCesiumObject();
      promise.then(function (dataSource) {
        vm.$emit("load", vm);
        vueCesium.ExcavateAnalysisManager.addSource(
          vueKey,
          vueIndex,
          dataSource,
          {
            drawElement: null,
            cutTool: null,
          }
        );
      });
    },
    unmount() {
      this.removeCuttingPlane();
      this.$emit("unload", this);
    },

    async getCutLayers() {
      // 如果传了图层直接用传的图层
      if (this.models && this.models.length) {
        // return this.layers;
        const m3ds = (await this.m3dIsReady()) || [];
        return m3ds;
      }
      // 如果是模型开挖，则获取m3d图层
      if (this.layerType === "model") {
        return [];
      }
      // 其他情况默认是地形开挖
      return [];
    },
    /**
     * @description 开始绘制并分析
     */
    async analysis() {
      let { vueCesium, vueKey, vueIndex, Cesium } = this;
      //  var positions = [
      //               Cesium.Cartesian3.fromDegrees(113.46, 22.27, 0),
      //               Cesium.Cartesian3.fromDegrees(113.41, 29.58, 0),
      //               Cesium.Cartesian3.fromDegrees(115.45, 29.47, 0),
      //               Cesium.Cartesian3.fromDegrees(120.52, 30.41, 0)
      //           ];
      //           var samplePrecision = 10000;

      //           var terrainExcavateTool = new Cesium.TerrainExcavateTool(this.viewer, {});
      //           var result = terrainExcavateTool._prepareWell(positions, samplePrecision, 0);
      //           console.log(result);
      //           const pointPrimitives = new Cesium.PointPrimitiveCollection();
      //           for (const point of result.no_height_top) {
      //               pointPrimitives.add({
      //                   position: point,
      //                   color: Cesium.Color.YELLOW,
      //                   pixelSize: 10
      //               });
      //           }
      //           this.viewer.scene.primitives.add(pointPrimitives);
      // this.createWellWall()
      let find = vueCesium.ExcavateAnalysisManager.findSource(vueKey, vueIndex);
      let { options } = find;
      let { cutTool, drawElement } = options;
      const { viewer } = this;
      // 初始化交互式绘制控件
      drawElement = drawElement || new this.Cesium.DrawElement(viewer);
      vueCesium.ExcavateAnalysisManager.changeOptions(
        vueKey,
        vueIndex,
        "drawElement",
        drawElement
      );
      const vm = this;
      // 添加一个剖切工具
      const m3dLayers = await this.getCutLayers();
      cutTool = new this.Cesium.CuttingTool(viewer, [...m3dLayers], {
        isCuttingTerrain: true,
        onErrorCallback: function (type, msg) {
          console.log("错误信息：" + type + ":" + msg);
        },
      });
      vm.removeCuttingPlane();
      console.log(m3dLayers, "m3dLayer-----", [...m3dLayers]);
      this.drawTerrainPolygon(drawElement, cutTool);
      // if (m3dLayers && m3dLayers.length) {
      //   // m3d图层，说明是模型开挖
      //   this.drawModelPolygon(drawElement, cutTool);
      // } else {
      //   // 地形开挖
      //   this.drawTerrainPolygon(drawElement, cutTool);
      // }
      vueCesium.ExcavateAnalysisManager.changeOptions(
        vueKey,
        vueIndex,
        "cutTool",
        cutTool
      );
    },
    // 绘制地形裁剪区域
    drawTerrainPolygon(drawElement, cutTool) {
      const { vueCesium, vueKey, vueIndex, Cesium } = this;
      // 激活交互式绘制工具
      drawElement.startDrawingPolygon({
        // 绘制完成回调函数
        callback: (result) => {
          let positions = result.positions;
          this.pnts = [];
          const cartographicPnts = [];
          for (let i = 0; i < positions.length; i++) {
            let position = positions[i];
            let c1 = Cesium.Cartographic.fromCartesian(position);
            cartographicPnts.push(c1);
            let p1 = new Cesium.Cartesian3(
              Cesium.Math.toDegrees(c1.longitude),
              Cesium.Math.toDegrees(c1.latitude),
              c1.height
            );
            console.log(positions, c1, p1, "高程值");

            this.pnts.push(p1);
          }
          this.drawPositions = [...positions]
          this.modelPositions = this.prepareWell([...positions], 0.1);
          // this.getModelSampleHeight(cartographicPnts);
          this.createTerrainCuttingVolume(cutTool);
          drawElement.stopDrawing();
        },
      });
    },
    // 移除之前剪裁效果
    removeCuttingPlane() {
      let { vueCesium, vueKey, vueIndex, Cesium } = this;
      let find = vueCesium.ExcavateAnalysisManager.findSource(vueKey, vueIndex);
      let { options } = find || {};
      let { cutTool, drawElement } = options || {};
      if (cutTool) {
        cutTool.removeAll();
      }
      if (drawElement) {
        drawElement.stopDrawing();
      }
    },
    // // 构建裁剪体进行模型开挖
    // drawModelPolygon(drawElement, cutTool) {
    //   const { vueCesium, vueKey, vueIndex, Cesium } =
    //     this;
    //   drawElement.startDrawingPolygon({
    //     getCoordinates: function (result) {
    //       let positions = result.positions;
    //       let pnts = [];
    //       for (let i = 0; i < positions.length; i++) {
    //         let position = positions[i];
    //         let c1 = Cesium.Cartographic.fromCartesian(position);

    //         pnts.push(Cesium.Math.toDegrees(c1.longitude));
    //         pnts.push(Cesium.Math.toDegrees(c1.latitude));
    //       }
    //       console.log(pnts, cutTool.createModelCuttingPolygon, "cuttool");
    //       cutTool.createModelCuttingPolygon(
    //         pnts,
    //         //裁剪深度
    //         -200,
    //         //裁剪高度
    //         500,
    //         {
    //           //裁剪方向，false：原方向，true反方向
    //           unionClippingRegions: false,
    //           //配置裁剪体的颜色，以及透明度
    //           color: new Cesium.Color(1, 1, 1, 0.2),
    //           //是否显示裁剪体
    //           showCuttingPlane: true,
    //         }
    //       );
    //       drawElement.stopDrawing();
    //     },
    //   });
    // },
    // 通过构建裁剪体进行地形开挖
    createTerrainCuttingVolume(cutTool) {
      if (!cutTool) {
        return false;
      }
      // options 参数
      let options = {
        unionClippingRegions: true, // 裁剪方向，false：原方向，true：反方向
        showCuttingPlane: false, // 是否显示辅助面
        getCoordinates: this.getModelSampleHeight,
        samplePrecision: 0.1,
      };
      if (this.selectTerrainWall) {
        options.terrainWallFillImage = this.selectTerrainWall;
      }
      if (this.selectTerrainGround) {
        options.terrainGroundFillImage = this.selectTerrainGround;
      }
      console.log(options, "this.pnts--", this.pnts);

      cutTool.createModelCuttingVolume(
        this.pnts, // 区域边界点数组
        -2000, // 最小高程
        5000, // 最大高程
        options
      );

      console.log(cutTool._terrainPlan._samplePrecision, "_samplePrecision");
    },

    prepareWell(positions, samplePrecision) {
      const { Cesium } = this;
      var length = positions.length;
      if (length > 0) {
        var noHeightPos = [];
        for (var i = 0; i < length; i++) {
          var u = i == length - 1 ? 0 : i + 1;
          var cartographicPrev = Cesium.Cartographic.fromCartesian(
            positions[i]
          );
          var cartographicNext = Cesium.Cartographic.fromCartesian(
            positions[u]
          );
          var prev = [cartographicPrev.longitude, cartographicPrev.latitude];
          var next = [cartographicNext.longitude, cartographicNext.latitude];
          if (i == 0) {
            noHeightPos.push(
              Cesium.Cartesian3.fromRadians(prev[0], prev[1], 0)
            );
          }

          var distance = Cesium.Cartesian3.distance(positions[i], positions[u]);
          var split = Math.ceil(distance / samplePrecision);

          for (var j = 1; j <= split; j++) {
            var longitudeLerp = Cesium.Math.lerp(prev[0], next[0], j / split);
            var latitudeLerp = Cesium.Math.lerp(prev[1], next[1], j / split);
            if (i != length - 1 || j != split) {
              noHeightPos.push(
                Cesium.Cartesian3.fromRadians(longitudeLerp, latitudeLerp, 0)
              );
            }
          }
        }
        console.log(noHeightPos, "noHeightPos--");

        return noHeightPos;
      }
    },

    // 获取模型高程值

    getModelSampleHeight(axis) {
      const { Cesium } = this;
      const pnts = this.modelPositions;
      console.log(pnts, "传过来的坐标", axis);
      // 筛选地形点
      // const filterPnts = this.evenlySpaceArray(pnts, 1000);
      let positions = pnts.map((item) => {
        let c1 = Cesium.Cartographic.fromCartesian(item);
        // c1.height = 0;
        const position = new Cesium.Cartographic(
          c1.longitude,
          c1.latitude,
        );
        return position;
      });
      console.log(positions, "弧度坐标", positions);
      const promise = this.viewer.scene.sampleHeightMostDetailed(positions);
      this.createWellWall(pnts, positions);
      promise.then((updatedPosition) => {
        console.log(updatedPosition, "updatedPosition");

        this.createWellWall(pnts, updatedPosition);
      }).catch(err => {
        console.log(err, 'err----');

      });
    },
    // 间隔筛选
    evenlySpaceArray(arr, parts) {
      const result = [];
      const interval = (arr.length - 1) / (parts - 1);
      for (let i = 0; i < parts; i++) {
        const index = Math.round(i * interval);
        result.push(arr[index]);
      }
      return result;
    },
    // 填充纹理

    createWellWall(bottomPos, modelPositions) {
      // if (!bottomPos.length) {
      //   return;
      // }
      console.log("执行wall", this.pnts);

      const { Cesium, viewer } = this;
      // 采取模型上的点
      const maxHeights = [];
      const minHeights = [];
      let positions = [];
      for (let i = 0; i < this.pnts.length; i++) {
        console.log("for 循环执行");

        // const p1 = modelPositions[i];
        // if (p1.height) {
        //   const c1 = Cesium.Cartesian3.fromRadians(
        //     p1.latitude,
        //     p1.longitude,
        //     p1.height
        //   );
        //   const c2 = Cesium.Cartographic.fromCartesian(bottomPos[i]);
        //   positions.push(c1);
        //   maxHeights.push(1110.7303636465031);
        //   // maxHeights.push(p1.height);
        //   minHeights.push(0);
        // }
        maxHeights.push(1110.7303636465031);
        // maxHeights.push(p1.height);
        minHeights.push(0);
      }
      console.log("for循环外执行");

      positions = this.pnts;
      var wall = new Cesium.WallGeometry({
        positions: this.drawPositions,
        maximumHeights: [
          100, 100, 100, 100, 100
        ],
        minimumHeights: [
          0, 0, 0, 0, 0
        ],
      });
      console.log(this.drawPositions, "wall----", maxHeights, minHeights);

      var geometry = Cesium.WallGeometry.createGeometry(wall);
      var material = new Cesium.Material({
        fabric: {
          materials: {
            diffuseMaterial: {
              type: "DiffuseMap",
              uniforms: {
                image:
                  "http://192.168.82.91:8200/NoneSpatialData/image/wall-texture-1.jpg",
              },
            },
          },
          components: {
            diffuse: "diffuseMaterial.diffuse",
          },
        },
      });
      var appearance = new Cesium.MaterialAppearance({
        translucent: false,
        flat: true,
        material: material,
        faceForward: true,
        closed: false,
      });
      const wallSpace = new Cesium.Primitive({
        geometryInstances: new Cesium.GeometryInstance({
          geometry: geometry,
          attributes: {
            color: Cesium.ColorGeometryInstanceAttribute.fromColor(
              Cesium.Color.GREY
            ),
          },
        }),
        appearance: appearance,
        asynchronous: false,
      });
      viewer.scene.primitives.add(wallSpace);
    },
  },
};
</script>
<style scoped>
.mapgis-3d-fill-image.mapgis-3d-select {
  display: block;
  margin-bottom: 10px;
}
</style>
