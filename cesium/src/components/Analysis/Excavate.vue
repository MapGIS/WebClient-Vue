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
import {
  isDepthTestAgainstTerrainEnable,
  setDepthTestAgainstTerrainEnable
} from "../WebGlobe/util";
export default {
  name: "mapgis-3d-excavate-analysis",
  inject: ["Cesium", "vueCesium", "viewer"],
  mixins: [BaseLayer],
  props: {
    ...VueOptions,
    /**
     * @type Array
     * @default []
     * @description 图层列表
     */
    models: {
      type: Array,
      default: () => [],
    },
    terrainGroundFillImages: {
      type: Array,
      default: () => [],
    },
    terrainWallFillImages: {
      type: Array,
      default: () => [],
    },
    modelFillImage: {
      type: String,
      default: ''
    }
  },
  watch: {
    /**
     * @description props图层改变时候切换选中图层
     */
    models: {
      handler: function (layers) {
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
      useModelFill: true,
      maskText: "正在分析中, 请稍等...",
      // 遮罩层
      maskShow: false,
      // 开挖精度
      samplePrecision: 10,
      // 开挖深度
      excavateDepth: 100,
      // checkbox选项合集
      checkboxOptions: [],
      // 选择项
      checked: [],
      // 选点集合
      pnts: [],
      // 选中的底面纹理
      selectTerrainGround: "",
      // 选中的剖面纹理
      selectTerrainWall: "",
      isDepthTestAgainstTerrainEnable: undefined, // 深度检测是否已开启，默认为undefined，当这个值为undefined的时候，说明没有赋值，不做任何处理
    };
  },
  computed: {
    samplePrecisionComputed() {
      const baseNum = 50;
      return baseNum / this.samplePrecision;
    },
  },

  mounted() {
    this.mount();
  },
  destroyed() {
    this.unmount();
  },
  methods: {
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

     /**
     * @description 恢复Cesium设置
     */
     _restoreCesiumSetting() {
      if (
        this.isDepthTestAgainstTerrainEnable !== undefined &&
        this.isDepthTestAgainstTerrainEnable !==
          isDepthTestAgainstTerrainEnable(this.viewer)
      ) {
        setDepthTestAgainstTerrainEnable(
          this.isDepthTestAgainstTerrainEnable,
          this.viewer
        )
      }
    },

    mount() {
      const { viewer, vueCesium, vueKey, vueIndex } = this;
      this.isDepthTestAgainstTerrainEnable = isDepthTestAgainstTerrainEnable(
        this.viewer
      );
      if (!this.isDepthTestAgainstTerrainEnable) {
        // 如果深度检测没有开启，则开启
        setDepthTestAgainstTerrainEnable(true, this.viewer);
      }
      const vm = this;
      let promise = Promise.resolve();
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
      this._restoreCesiumSetting();
    },
    /**
     * @description 获取裁剪图层
     */
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
      let { vueCesium, vueKey, vueIndex, Cesium, viewer } = this;
      let find = vueCesium.ExcavateAnalysisManager.findSource(vueKey, vueIndex);
      let { options } = find || {};
      let { cutTool, drawElement } = options || {};
      // 初始化交互式绘制控件
      drawElement = drawElement || new Cesium.DrawElement(viewer);
      vueCesium.ExcavateAnalysisManager.changeOptions(
        vueKey,
        vueIndex,
        "drawElement",
        drawElement
      );
      this.removeCuttingPlane();
      // 添加一个剖切工具
      this.m3dLayers = await this.getCutLayers();
      cutTool = new Cesium.CuttingTool(viewer, [...this.m3dLayers], {
        isCuttingTerrain: true,
        onErrorCallback: function (type, msg) {
          console.warn("错误信息：" + type + ":" + msg);
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
    /**
     * 绘制完成后执行函数
     * @param result 笛卡尔坐标
     * @param drawElement 拖拽对象
     * @param cutTool 裁剪工具
     */
    async drawPolygonCallBack(result, drawElement, cutTool) {
      try {
        const { Cesium } = this;
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
        // 获取划分后的坐标
        const modlePositions = this.prepareWell(
          [...positions],
          this.samplePrecisionComputed
        );
        // 如果有模型且需要模型封边
        if (this.m3dLayers && this.m3dLayers.length && this.useModelFill) {
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
      } catch (err) {
        console.warn(err);
      }
    },
    // 绘制地形裁剪区域
    drawTerrainPolygon(drawElement, cutTool) {
      // 激活交互式绘制工具
      drawElement.startDrawingPolygon({
        // 绘制完成回调函数
        callback: (result) => {
          this.maskShow = true;
          requestAnimationFrame(() => {
            requestAnimationFrame(() =>
              this.drawPolygonCallBack(result, drawElement, cutTool)
            );
          });
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
      const maxSampleHeight = 5000;
      cutTool.createModelCuttingVolume(
        this.pnts, // 区域边界点数组
        exactExcavateDepth, // 最小高程
        maxSampleHeight, // 最大高程
        options
      );
    },
    /**
     * @description 将坐标按照精度划分成多个坐标
     * @param {Array} positions - 被划分的笛卡尔坐标
     * @param {Number} samplePrecision - 划分精度
     * @return {Array} - 不含高度的划分后坐标
     */
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

    /**
     * @description 获取模地形平均高程
     * @param {Array} pnts - 底面笛卡尔坐标
     * @return {Number} - 地形平均高程
     */
    async getTerrainSampleHeight(pnts) {
      const { Cesium, viewer } = this;
      const terrainPositions = await Cesium.sampleTerrainMostDetailed(
        viewer.terrainProvider,
        pnts
      );
      const totolHeight = terrainPositions.reduce((pre, next) => {
        return pre + next.height;
      }, 0);
      return totolHeight / terrainPositions.length;
    },

    /**
     * @description 获取模型高程坐标
     * @param {Array} pnts - 底面笛卡尔坐标
     * @return {Array} - 模型高程数组坐标
     */
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
      if (this.m3dLayers && this.m3dLayers.length && this.useModelFill) {
        this.createWellWall(axis, this.sampledPositions);
      }
    },
    /**
     * @description 模型封边
     * @param {Array} bottomPos - 底面坐标
     * @param {Array} modelPositions - 顶面坐标
     */
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
                image: this.modelFillImage
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
