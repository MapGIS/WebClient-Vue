<template>
  <div>
    <slot>
      <div class="mapgis-widget-excavate-analysis">
        <mapgis-ui-row class="model">
          <mapgis-ui-checkbox-group
            v-model="checked"
            v-if="checkboxOptions.length > 0"
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
        <mapgis-ui-form-item label="剖面纹理">
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
        </mapgis-ui-form-item>
        <mapgis-ui-form-item label="底面纹理">
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
        </mapgis-ui-form-item>

        <mapgis-ui-input-number-panel
          class="mapgis-excavate-form"
          size="large"
          label="开挖深度(米)"
          :range="[0, 2000]"
          v-model="excavateDepth"
        />
        <mapgis-ui-input-number-panel
          class="mapgis-excavate-form"
          size="large"
          label="开挖精度"
          :range="[1, 100]"
          v-model="samplePrecision"
        />
        <mapgis-ui-switch-panel
          label="开启模型封边"
          v-model="useModelFill"
          size="default"
        ></mapgis-ui-switch-panel>
        <mapgis-ui-setting-footer>
          <mapgis-ui-button type="primary" @click="analysis"
            >分析</mapgis-ui-button
          >
          <mapgis-ui-button @click="removeCuttingPlane">清除</mapgis-ui-button>
        </mapgis-ui-setting-footer>
      </div>
    </slot>
    <mapgis-ui-mask
      :parentDivClass="'cesium-map-wrapper'"
      :loading="maskShow"
      :text="maskText"
      :showSvg="true"
    ></mapgis-ui-mask>
  </div>
</template>

<script>
import VueOptions from "../Base/Vue/VueOptions";
import BaseLayer from "./BaseLayer";

export default {
  name: "mapgis-3d-terrain-aspect",
  inject: ["Cesium", "vueCesium", "viewer"],
  mixins: [BaseLayer],
  props: {
    ...VueOptions,
    /**
     * @type Boolean
     * @default true
     * @description 是否使用内置的遮罩层
     */
    useMask: {
      type: Boolean,
      default: true,
    },
    models: {
      type: Array,
      default: () => [],
    },
  },
  watch: {
    models: {
      handler: function (layers) {
        console.log(layers, "watch-layer");
        this.checkboxOptions = [];
        this.vueIndexs = [];
        this.layerIndexs = [];
        if (layers.length > 0) {
          const currentLayer = layers[layers.length - 1];
          if (
            !this.checkboxOptions.find(
              (item) => item.value === currentLayer.vueIndex
            ) &&
            !this.checked.includes(currentLayer.vueIndex)
          ) {
            this.checked.push(currentLayer.vueIndex);
          }
          layers.forEach((layer) => {
            const { title, vueIndex } = layer;
            const obj = { label: title, value: vueIndex };
            this.checkboxOptions.push(obj);
          });
        }
      },
      deep: true,
      immediate: true,
    },
  },
  data() {
    return {
      m3dLayers: [],
      useModelFill: true,
      maskText: "正在分析中, 请稍等...",
      maskShow: true,
      samplePrecision: 50,
      wallSpace: null,
      excavateDepth: 100,
      // checkbox选项合集
      checkboxOptions: [],
      // 选择项
      checked: [],
      drawElement: null,
      pnts: [],
      sampledPositions: [],
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
    };
  },
  computed: {
    samplePrecisionComputed() {
      const baseNum = 50
      return baseNum / this.samplePrecision
    }
  },

  mounted() {
    this.mount();
  },
  destroyed() {
    this.unmount();
  },
  methods: {
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
      try {
        if (this.models && this.models.length) {
          const m3ds = await this.m3dIsReady();
          return m3ds;
        }
        return [];
      } catch (err) {
        return [];
      }
    },
    /**
     * @description 开始绘制并分析
     */
    async analysis() {
      let { vueCesium, vueKey, vueIndex, Cesium } = this;
      let find = vueCesium.ExcavateAnalysisManager.findSource(vueKey, vueIndex);
      let { options } = find || {};
      let { cutTool, drawElement } = options || {};
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
      vm.removeCuttingPlane();
      // 添加一个剖切工具
      this.m3dLayers = await this.getCutLayers();
      cutTool = new this.Cesium.CuttingTool(viewer, [...this.m3dLayers], {
        isCuttingTerrain: true,
        onErrorCallback: function (type, msg) {
          console.log("错误信息：" + type + ":" + msg);
        },
      });
      this.drawTerrainPolygon(drawElement, cutTool);
      vueCesium.ExcavateAnalysisManager.changeOptions(
        vueKey,
        vueIndex,
        "cutTool",
        cutTool
      );
    },
    // 绘制地形裁剪区域
    drawTerrainPolygon(drawElement, cutTool) {
      const { Cesium } = this;
      // 激活交互式绘制工具
      drawElement.startDrawingPolygon({
        // 绘制完成回调函数
        callback: async (result) => {
          this.maskShow = true;
          console.log("callback", this, this.maskShow);

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
            this.pnts.push(p1);
          }
          const modlePositions = this.prepareWell(
            [...positions],
            this.samplePrecisionComputed
          );
          // 如果有模型且需要模型封边
          if (this.m3dLayers.length && this.useModelFill) {
            this.sampledPositions = this.getModelSampleHeight(modlePositions);
          }
          let terrainHeight = 0;
          // 如果加载了地形
          if (viewer.terrainProvider._layers) {
            terrainHeight = await this.getTerrainSampleHeight(cartographicPnts);
          }
          this.createTerrainCuttingVolume(cutTool, terrainHeight);
          drawElement.stopDrawing();
          this.maskShow = false;
        },
      });
    },
    // 移除之前剪裁效果
    removeCuttingPlane() {
      let { vueCesium, vueKey, vueIndex, viewer } = this;
      let find = vueCesium.ExcavateAnalysisManager.findSource(vueKey, vueIndex);
      let { options } = find || {};
      let { cutTool, drawElement } = options || {};
      viewer.scene.primitives.remove(this.wallSpace);
      if (cutTool) {
        cutTool.removeAll();
      }
      if (drawElement) {
        drawElement.stopDrawing();
      }
    },
    // 通过构建裁剪体进行开挖
    createTerrainCuttingVolume(cutTool, terrainHeight) {
      if (!cutTool) {
        return false;
      }
      const exactExcavateDepth = (this.excavateDepth - terrainHeight) * -1;
      // options 参数
      let options = {
        unionClippingRegions: true, // 裁剪方向，false：原方向，true：反方向
        showCuttingPlane: false, // 是否显示辅助面
        getCoordinates: this.getCoordinates,
        samplePrecision: this.samplePrecisionComputed,
      };
      if (this.selectTerrainWall) {
        options.terrainWallFillImage = this.selectTerrainWall;
      }
      if (this.selectTerrainGround) {
        options.terrainGroundFillImage = this.selectTerrainGround;
      }
      const maxSampleHeight = 5000
      cutTool.createModelCuttingVolume(
        this.pnts, // 区域边界点数组
        exactExcavateDepth, // 最小高程
        maxSampleHeight, // 最大高程
        options
      );
    },

    prepareWell(positions, samplePrecision) {
      const { Cesium } = this;
      let length = positions.length;
      if (length > 0) {
        let noHeightPos = [];
        for (let i = 0; i < length; i++) {
          let u = i == length - 1 ? 0 : i + 1;
          let cartographicPrev = Cesium.Cartographic.fromCartesian(
            positions[i]
          );
          let cartographicNext = Cesium.Cartographic.fromCartesian(
            positions[u]
          );
          let prev = [cartographicPrev.longitude, cartographicPrev.latitude];
          let next = [cartographicNext.longitude, cartographicNext.latitude];
          if (i == 0) {
            noHeightPos.push(
              Cesium.Cartesian3.fromRadians(prev[0], prev[1], 0)
            );
          }
          let distance = Cesium.Cartesian3.distance(positions[i], positions[u]);
          let split = Math.ceil(distance / samplePrecision);
          for (let j = 1; j <= split; j++) {
            let longitudeLerp = Cesium.Math.lerp(prev[0], next[0], j / split);
            let latitudeLerp = Cesium.Math.lerp(prev[1], next[1], j / split);
            if (i != length - 1 || j != split) {
              noHeightPos.push(
                Cesium.Cartesian3.fromRadians(longitudeLerp, latitudeLerp, 0)
              );
            }
          }
        }
        return noHeightPos;
      }
    },

    // 获取地形高程值
    async getTerrainSampleHeight(pnts) {
      const { Cesium, viewer } = this;
      const terrainPositions =
        (await Cesium.sampleTerrainMostDetailed(
          viewer.terrainProvider,
          pnts
        )) || [];
      const totolHeight = terrainPositions.reduce((pre, next) => {
        return pre + next.height;
      }, 0);
      return totolHeight / terrainPositions.length;
    },

    // 获取模型高程值
    getModelSampleHeight(pnts) {
      const { Cesium, viewer } = this;
      let positions = pnts.map((item) => {
        let c1 = Cesium.Cartographic.fromCartesian(item);
        // const position = new Cesium.Cartographic(c1.longitude, c1.latitude);
        return c1;
      });
      const sampledPositions = [];
      for (let n = 0; n < positions.length; n++) {
        positions[n].height = viewer.scene.sampleHeight(positions[n]);
        sampledPositions.push(positions[n].clone());
      }
      return sampledPositions;
    },
    // api获取地形开挖坐标
    getCoordinates(axis) {
      if (this.m3dLayers.length && this.useModelFill) {
        this.createWellWall(axis, this.sampledPositions);
      }
    },
    // 模型封边
    createWellWall(bottomPos, modelPositions) {
      if (!bottomPos.length) {
        return;
      }
      const { Cesium, viewer } = this;
      // 采取模型上的点
      const maxHeights = [];
      const minHeights = [];
      let positions = [];
      for (let i = 0; i < modelPositions.length; i++) {
        const p1 = modelPositions[i];
        if (p1.height) {
          const c1 = Cesium.Cartesian3.fromRadians(
            p1.longitude,
            p1.latitude,
            p1.height
          );
          const p2 = Cesium.Cartographic.fromCartesian(bottomPos[i]);
          positions.push(c1);
          maxHeights.push(p1.height);
          minHeights.push(p2.height);
        }
      }
      const wall = new Cesium.WallGeometry({
        positions,
        maximumHeights: maxHeights,
        minimumHeights: minHeights,
      });
      const geometry = Cesium.WallGeometry.createGeometry(wall);
      const material = new Cesium.Material({
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
      const appearance = new Cesium.MaterialAppearance({
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
      this.wallSpace = viewer.scene.primitives.add(wallSpace);
    },
  },
};
</script>
<style scoped>
.mapgis-3d-fill-image.mapgis-3d-select {
  display: block;
  margin-bottom: 10px;
}
.mapgis-ui-form-item {
  margin-bottom: 0;
}
</style>
